const { Appointment } = require("../models/appointment");
const { User } = require("../models/user");
const Client = require("../models/client");
const { Therapist } = require("../models/therapist");
const Coin = require("../models/coin");
const Price = require("../models/prices");
const puppeteer = require("puppeteer");
const nodemailer = require("nodemailer");
const fs = require("fs");
const util = require("util");
const writeFile = util.promisify(fs.writeFile);
const cron = require("node-cron");
const PDFDocument = require('pdfkit');
const moment = require("moment");
const {
  sendWhatsAppMessage,sendWhatsAppMessageMedia,
  getSentMessageCount,
  getSentMessages,
  
} = require("../controller/whatsappcontrooler");

// Function to update the Sessionnumber for the user
const updateSessionNumber = async (userId, therapistId) => {
  const numberOfSessions = await Appointment.countDocuments({
    therapist: therapistId,
    user: userId,
  });
  await User.findByIdAndUpdate(userId, { Sessionnumber: numberOfSessions });
};

exports.createAppointment = async (req, res) => {
  const { therapistId, userId, dateTime, startTime, endTime, sessionMode } =
    req.body;

  try {
    const user = await User.findById(userId).select(
      "name email age gender credits groupid priceHistory mobile"
    );
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const therapist = await Therapist.findById(therapistId).select(
      "name level meetLink expriencelevel sessions "
    );

    if (!therapist) {
      return res.status(404).json({ error: "Therapist not found" });
    }

    const priceId = therapist.expriencelevel;

    console.log(priceId);

    // If the user has a groupid, check if the companypayment is true
    if (user.groupid) {
      const client = await Client.findOne({ groupid: user.groupid }).select(
        "companypayment credit"
      );

      if (client && client.companypayment) {
        const priceDetails = await Price.findById(priceId).select(
          "level session sessionPrice discountPrice"
        );

        if (!priceDetails) {
          throw new Error("Price details not found");
        }

        const existingAppointment = await Appointment.findOne({
          therapist: therapistId,
          dateTime,
          startTime: { $lte: endTime },
          endTime: { $gte: startTime },
        });

        if (existingAppointment) {
          return res
            .status(409)
            .json({ error: "The requested time slot is already booked" });
        }

        const newAppointment = new Appointment({
          therapist: therapistId,
          meetlink: therapist.meetLink,
          price: therapist.expriencelevel, // Store the price from priceDetails
          session: priceDetails.session,
          sessionPrice: priceDetails.sessionPrice, // Update the session price
          discountPrice: priceDetails.discountPrice,
          level: priceDetails.level,
          user: userId,
          dateTime,
          startTime,
          endTime,
          sessionMode,

          paymentstatus: "Success",
        });

        // Update the appointment's price, sessions, and discounted price

        const currentSessionDetails = {
          priceId: priceId,
          level: priceDetails.level,
          session: priceDetails.session,
          sessionPrice: priceDetails.sessionPrice, // Store the current session price
          discountPrice: priceDetails.discountPrice,
        };
        user.priceHistory.push(currentSessionDetails);

        await user.save();
        const therapistSessions = therapist.sessions || [];
        console.log(therapistSessions);
        // Extract appointment date, start time, and end time
        const appointmentDate = newAppointment.dateTime;
        const appointmentStartTime = newAppointment.startTime;
        const appointmentEndTime = newAppointment.endTime;
        console.log("Therapist Sessions Before Filtering:");
        therapistSessions.forEach(session => {
          console.log(`Date: ${session.date}`);
          session.timeSlots.forEach((timeSlot, index) => {
            console.log(`Time Slot ${index + 1}:`);
            console.log(`  Start Time: ${timeSlot.startTime}`);
            console.log(`  End Time: ${timeSlot.endTime}`);
          });
        });
        // Filter and remove the matching therapist session based on date and start time
        // Filter and remove the matching therapist session based on date and start time
        // Filter and remove the matching therapist session's start time
        const updatedTherapistSessions = therapistSessions.filter(session => {
          const sessionDate = new Date(session.date); // Assuming session.date is a string in ISO format
          const matchingTimeSlotIndex = session.timeSlots.findIndex(
            timeSlot => timeSlot.startTime === appointmentStartTime
          );

          if (
            sessionDate.toDateString() === appointmentDate.toDateString() &&
            matchingTimeSlotIndex !== -1
          ) {
            // Remove the matching start time from the session's time slots
            session.timeSlots.splice(matchingTimeSlotIndex, 1);
            return session.timeSlots.length > 0; // Only return sessions with remaining time slots
          }
          return true; // Keep other sessions as they are
        });

        // Filter out sessions with no time slots left
        const updatedTherapistSessionsWithoutEmptySessions =
          updatedTherapistSessions.filter(
            session => session.timeSlots.length > 0
          );

        console.log("Therapist Sessions After Filtering:");
        updatedTherapistSessions.forEach(session => {
          console.log(`Date: ${session.date}`);
          session.timeSlots.forEach((timeSlot, index) => {
            console.log(`Time Slot ${index + 1}:`);
            console.log(`  Start Time: ${timeSlot.startTime}`);
            console.log(`  End Time: ${timeSlot.endTime}`);
          });
        });
        const filter = { _id: therapist._id }; // Replace with the appropriate query

        const update = {
          sessions: updatedTherapistSessionsWithoutEmptySessions,
        };

        const options = { new: true }; // To return the updated document

        const updatedTherapistInDB = await Therapist.findOneAndUpdate(
          filter,
          update,
          options
        );

        if (!updatedTherapistInDB) {
          console.log("Failed to update therapist sessions in the database");
          return res
            .status(500)
            .json({ error: "Failed to update therapist sessions" });
        }

        let calculatedAverage;
        let totalSessions;
        let totalDiscountPriceIncludingAppointment = 0;
        let packageAmount;

        const therapistLevel = therapist.level
          ? therapist.level.toString()
          : null;

        const userPriceHistory = user.priceHistory.filter(priceDetails => {
          const level = priceDetails.level
            ? priceDetails.level.toString()
            : null;

          if (therapistLevel && level) {
            return level === therapistLevel;
          }

          return false;
        });

        console.log(
          "User Price History Matching Therapist Level:",
          userPriceHistory
        );

        const totalDiscountPrice = userPriceHistory.reduce(
          (sum, priceDetails) => {
            if (priceDetails.discountPrice) {
              return sum + priceDetails.discountPrice;
            }
            return sum;
          },
          0
        );

        console.log("Total Discount Price:", totalDiscountPrice);

        totalDiscountPriceIncludingAppointment = totalDiscountPrice;
        console.log(
          "Total Discount Price Including Appointment:",
          totalDiscountPriceIncludingAppointment
        );

        const totalSessionsInPriceHistory = userPriceHistory.reduce(
          (sum, priceDetails) => {
            if (priceDetails.session) {
              return sum + priceDetails.session;
            }
            return sum;
          },
          0
        );

        totalSessions = totalSessionsInPriceHistory;
        console.log("Total Sessions:", totalSessions);
        // Calculate the average price
        calculatedAverage =
          Math.round(
            (totalDiscountPriceIncludingAppointment / totalSessions) * 100
          ) / 100;

        // Save the updated appointment

        const savedAppointment = await newAppointment.save();
        await updateSessionNumber(userId, therapistId);

        console.log("Before increment: user.credits =", user.credits);
        user.credits = user.credits + 1;
        console.log("After increment: user.credits =", user.credits);
        await user.save();
        // Update the credit in the client table
        client.credit = client.credit + 1; // Increase the credit by 1
        await client.save();

        // Check if the user has a coin balance for this level
        const existingCoin = await Coin.findOne({
          user: userId,
          expriencelevel: therapist.level,
        });

        if (existingCoin) {
          // Update the existing coin balance
          existingCoin.coinBalance = existingCoin.coinBalance - 1;
          existingCoin.avarage = calculatedAverage;
          await existingCoin.save();
        } else {
          const coinEntry = new Coin({
            user: userId,
            expriencelevel: therapist.level,
            coinBalance: -1,
            groupid: user.groupid,
            avarage: calculatedAverage,
          });

          await coinEntry.save();
        }

        const populatedAppointment = await Appointment.findById(
          savedAppointment._id
        )
          .populate("user", "name age gender")
          .exec();

        const dateObject = new Date(appointmentDate);

        // Extract the date part in YYYY-MM-DD format
        const appointmentDateonly = dateObject.toISOString().split("T")[0];
        sendWhatsAppMessage(
          user.mobile,
          `
          Hi ${user.name},
          Thank you for successfully booking an appointment with ${therapist.name} on ${appointmentDateonly} at  ${startTime}.
          Please log into the application 5 mins before the start of the session.
          Thanks,
          Team Inspiron
          `
        );

        const emailMessage = `
          Hi ${user.name},\n
          Thank you for successfully booking an appointment with ${therapist.name} on ${appointmentDateonly} at ${startTime}. Please log into the application 5 mins before the start of the session.\n
          Thanks,\n
          Team Inspiron
        `;

        sendEmailfor(user.email, "Appointment Confirmation", emailMessage);

        return res.status(201).json(populatedAppointment);
      }
    } else {
     

      const negativeCoinBalance = await Coin.findOne({
        user: userId,
        coinBalance: { $lt: 0, $ne: 0 }, 
      });
      
  


if (negativeCoinBalance) {
  const { coinBalance, avarage, expriencelevel } = negativeCoinBalance;

  
  const product = (-coinBalance) * avarage;

  return res.status(400).json({
    message: `Dear customer, please pay the amount: ${product}`,
    userId: userId,
    expriencelevel: expriencelevel,
  });
}

// Continue with booking logic for users without groupid and without company payment
// Check if the appointment slot is available
const existingAppointment = await Appointment.findOne({
  therapist: therapistId,
  dateTime,
  startTime: { $lte: endTime },
  endTime: { $gte: startTime },
});

if (existingAppointment) {
  return res.status(409).json({ error: 'The requested time slot is already booked' });
}


      const newAppointment = new Appointment({
        therapist: therapistId,
        meetlink: therapist.meetLink,
        user: userId,
        dateTime,
        startTime,
        endTime,
        sessionMode,
      });

      const savedAppointment = await newAppointment.save();
      await updateSessionNumber(userId, therapistId);

      // Check if the user has a coin balance for this level
      const existingCoin = await Coin.findOne({
        user: userId,
        expriencelevel: therapist.level,
      });
      if (existingCoin) {
        // Check if the user has a coin balance for this level
        if (existingCoin.coinBalance > 0) {
          savedAppointment.coinpositive = true;
          await savedAppointment.save();
        }
      }

      if (existingCoin) {
        // Update the existing coin balance
        existingCoin.coinBalance = existingCoin.coinBalance - 1;
        await existingCoin.save();
      } else {
        const coinEntry = new Coin({
          user: userId,
          expriencelevel: therapist.level,
          coinBalance: -1,
          avarage: 0, // Set average here if needed
          userName: user.name,
        });

        await coinEntry.save();
      }

      const populatedAppointment = await Appointment.findById(
        savedAppointment._id
      )
        .populate("user", "name age gender")
        .exec();

      return res.status(201).json(populatedAppointment);
    }
  } catch (error) {
    console.error("Error creating appointment:", error);
    return res
      .status(500)
      .json({ error: "An error occurred while creating the appointment" });
  }
};

// Function to send an email
const sendEmailfor = (to, subject, message) => {
  console.log("Recipient email:", to);
  const transporter = nodemailer.createTransport({
    host: "smtppro.zoho.com",
    port: 465,
    secure: true,
    auth: {
      user: "info@inspirononline.com",
      pass: "zU0VjyrxHmFm",
    },
  });

  const mailOptions = {
    from: "info@inspirononline.com",
    to: to,
    subject: "Booking Confirmation",
    text: message,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });
};

exports.createAppointmentbytherapist = async (req, res) => {
  const { therapistId, userId, dateTime, startTime, endTime, sessionMode } =
    req.body;

  try {
    const user = await User.findById(userId).select(
      "name email age gender credits groupid priceHistory mobile"
    );
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const therapist = await Therapist.findById(therapistId).select(
      "name level meetLink expriencelevel sessions"
    );
    if (!therapist) {
      return res.status(404).json({ error: "Therapist not found" });
    }

    const priceId = therapist.expriencelevel;

    console.log(priceId);

    // If the user has a groupid, check if the companypayment is true
    if (user.groupid) {
      const client = await Client.findOne({ groupid: user.groupid }).select(
        "companypayment credit"
      );

      if (client && client.companypayment) {
        const priceDetails = await Price.findById(priceId).select(
          "level session sessionPrice discountPrice"
        );

        if (!priceDetails) {
          throw new Error("Price details not found");
        }

        const existingAppointment = await Appointment.findOne({
          therapist: therapistId,
          dateTime,
          startTime: { $lte: endTime },
          endTime: { $gte: startTime },
        });

        if (existingAppointment) {
          return res
            .status(409)
            .json({ error: "The requested time slot is already booked" });
        }

        const newAppointment = new Appointment({
          therapist: therapistId,
          meetlink: therapist.meetLink,
          price: therapist.expriencelevel, // Store the price from priceDetails
          session: priceDetails.session,
          sessionPrice: priceDetails.sessionPrice, // Update the session price
          discountPrice: priceDetails.discountPrice,
          level: priceDetails.level,
          user: userId,
          dateTime,
          startTime,
          endTime,
          sessionMode,
          paymentstatus: "Success",
        });

        // Update the appointment's price, sessions, and discounted price

        const currentSessionDetails = {
          priceId: priceId,
          level: priceDetails.level,
          session: priceDetails.session,
          sessionPrice: priceDetails.sessionPrice, // Store the current session price
          discountPrice: priceDetails.discountPrice,
        };
        user.priceHistory.push(currentSessionDetails);

        await user.save();
        const therapistSessions = therapist.sessions || [];
        console.log(therapistSessions);
        // Extract appointment date, start time, and end time
        const appointmentDate = newAppointment.dateTime;
        const appointmentStartTime = newAppointment.startTime;
        const appointmentEndTime = newAppointment.endTime;
        console.log("Therapist Sessions Before Filtering:");
        therapistSessions.forEach(session => {
          console.log(`Date: ${session.date}`);
          session.timeSlots.forEach((timeSlot, index) => {
            console.log(`Time Slot ${index + 1}:`);
            console.log(`  Start Time: ${timeSlot.startTime}`);
            console.log(`  End Time: ${timeSlot.endTime}`);
          });
        });
        // Filter and remove the matching therapist session based on date and start time
        // Filter and remove the matching therapist session based on date and start time
        // Filter and remove the matching therapist session's start time
        const updatedTherapistSessions = therapistSessions.filter(session => {
          const sessionDate = new Date(session.date); // Assuming session.date is a string in ISO format
          const matchingTimeSlotIndex = session.timeSlots.findIndex(
            timeSlot => timeSlot.startTime === appointmentStartTime
          );

          if (
            sessionDate.toDateString() === appointmentDate.toDateString() &&
            matchingTimeSlotIndex !== -1
          ) {
            // Remove the matching start time from the session's time slots
            session.timeSlots.splice(matchingTimeSlotIndex, 1);
            return session.timeSlots.length > 0; // Only return sessions with remaining time slots
          }
          return true; // Keep other sessions as they are
        });

        // Filter out sessions with no time slots left
        const updatedTherapistSessionsWithoutEmptySessions =
          updatedTherapistSessions.filter(
            session => session.timeSlots.length > 0
          );

        console.log("Therapist Sessions After Filtering:");
        updatedTherapistSessions.forEach(session => {
          console.log(`Date: ${session.date}`);
          session.timeSlots.forEach((timeSlot, index) => {
            console.log(`Time Slot ${index + 1}:`);
            console.log(`  Start Time: ${timeSlot.startTime}`);
            console.log(`  End Time: ${timeSlot.endTime}`);
          });
        });
        const filter = { _id: therapist._id }; // Replace with the appropriate query

        const update = {
          sessions: updatedTherapistSessionsWithoutEmptySessions,
        };

        const options = { new: true }; // To return the updated document

        const updatedTherapistInDB = await Therapist.findOneAndUpdate(
          filter,
          update,
          options
        );

        if (!updatedTherapistInDB) {
          console.log("Failed to update therapist sessions in the database");
          return res
            .status(500)
            .json({ error: "Failed to update therapist sessions" });
        }

        let calculatedAverage;
        let totalSessions;
        let totalDiscountPriceIncludingAppointment = 0;
        let packageAmount;

        const therapistLevel = therapist.level
          ? therapist.level.toString()
          : null;

        const userPriceHistory = user.priceHistory.filter(priceDetails => {
          const level = priceDetails.level
            ? priceDetails.level.toString()
            : null;

          if (therapistLevel && level) {
            return level === therapistLevel;
          }

          return false;
        });

        console.log(
          "User Price History Matching Therapist Level:",
          userPriceHistory
        );

        const totalDiscountPrice = userPriceHistory.reduce(
          (sum, priceDetails) => {
            if (priceDetails.discountPrice) {
              return sum + priceDetails.discountPrice;
            }
            return sum;
          },
          0
        );

        console.log("Total Discount Price:", totalDiscountPrice);

        totalDiscountPriceIncludingAppointment = totalDiscountPrice;
        console.log(
          "Total Discount Price Including Appointment:",
          totalDiscountPriceIncludingAppointment
        );

        const totalSessionsInPriceHistory = userPriceHistory.reduce(
          (sum, priceDetails) => {
            if (priceDetails.session) {
              return sum + priceDetails.session;
            }
            return sum;
          },
          0
        );

        totalSessions = totalSessionsInPriceHistory;
        console.log("Total Sessions:", totalSessions);
        // Calculate the average price
        calculatedAverage =
          Math.round(
            (totalDiscountPriceIncludingAppointment / totalSessions) * 100
          ) / 100;

        // Save the updated appointment

        const savedAppointment = await newAppointment.save();
        await updateSessionNumber(userId, therapistId);

        console.log("Before increment: user.credits =", user.credits);
        user.credits = user.credits + 1;
        console.log("After increment: user.credits =", user.credits);
        await user.save();
        // Update the credit in the client table
        client.credit = client.credit + 1; // Increase the credit by 1
        await client.save();

        // Check if the user has a coin balance for this level
        const existingCoin = await Coin.findOne({
          user: userId,
          expriencelevel: therapist.level,
        });

        if (existingCoin) {
          // Update the existing coin balance
          existingCoin.coinBalance = existingCoin.coinBalance - 1;
          existingCoin.avarage = calculatedAverage;
          await existingCoin.save();
        } else {
          const coinEntry = new Coin({
            user: userId,
            expriencelevel: therapist.level,
            coinBalance: -1,
            groupid: user.groupid,
            avarage: calculatedAverage,
          });

          await coinEntry.save();
        }

        const populatedAppointment = await Appointment.findById(
          savedAppointment._id
        )
          .populate("user", "name age gender")
          .exec();

        const therapistName = therapist.name;

        const dateObject = new Date(appointmentDate);

        // Extract the date part in YYYY-MM-DD format
        const appointmentDateonly = dateObject.toISOString().split("T")[0];

        sendWhatsAppMessage(
          user.mobile,
          `
          Hi ${user.name},
          Thank you for successfully booking an appointment with ${therapistName} on ${appointmentDateonly} at ${appointmentStartTime}.
          Please log into the application 5 mins before the start of the session.
          Thanks,
          Team Inspiron
          `
        );

        const emailMessage = `
          Hi ${user.name},\n
          Thank you for successfully booking an appointment with ${therapist.name} on ${appointmentDateonly} at ${appointmentStartTime}. Please log into the application 5 mins before the start of the session.\n
          Thanks,\n
          Team Inspiron
        `;

        sendEmailfortherapistbook(
          user.email,
          "Appointment Confirmation",
          emailMessage
        );

        return res.status(201).json(populatedAppointment);
      }
    }

    // Continue with booking logic for users without groupid and without company payment
    // Check if the appointment slot is available
    const priceDetails = await Price.findById(priceId).select(
      "level session sessionPrice discountPrice"
    );

    if (!priceDetails) {
      throw new Error("Price details not found");
    }

    const existingAppointment = await Appointment.findOne({
      therapist: therapistId,
      dateTime,
      startTime: { $lte: endTime },
      endTime: { $gte: startTime },
    });

    if (existingAppointment) {
      return res
        .status(409)
        .json({ error: "The requested time slot is already booked" });
    }

    const newAppointment = new Appointment({
      therapist: therapistId,
      meetlink: therapist.meetLink,
      price: therapist.expriencelevel, // Store the price from priceDetails
      session: priceDetails.session,
      sessionPrice: priceDetails.sessionPrice, // Update the session price
      discountPrice: priceDetails.discountPrice,
      level: priceDetails.level,
      user: userId,
      dateTime,
      startTime,
      endTime,
      sessionMode,
      message: priceDetails.discountPrice,
      paymentstatus: "Offline",
      paymentMethod: "Book by Therapist",
    });

    // Update the appointment's price, sessions, and discounted price

    const currentSessionDetails = {
      priceId: priceId,
      level: priceDetails.level,
      session: priceDetails.session,
      sessionPrice: priceDetails.sessionPrice, // Store the current session price
      discountPrice: priceDetails.discountPrice,
    };
    user.priceHistory.push(currentSessionDetails);
    await user.save();
    const therapistSessions = therapist.sessions || [];
    console.log(therapistSessions);
    // Extract appointment date, start time, and end time
    const appointmentDate = newAppointment.dateTime;
    const appointmentStartTime = newAppointment.startTime;
    const appointmentEndTime = newAppointment.endTime;
    console.log("Therapist Sessions Before Filtering:");
    therapistSessions.forEach(session => {
      console.log(`Date: ${session.date}`);
      session.timeSlots.forEach((timeSlot, index) => {
        console.log(`Time Slot ${index + 1}:`);
        console.log(`  Start Time: ${timeSlot.startTime}`);
        console.log(`  End Time: ${timeSlot.endTime}`);
      });
    });
    // Filter and remove the matching therapist session based on date and start time
    // Filter and remove the matching therapist session based on date and start time
    // Filter and remove the matching therapist session's start time
    const updatedTherapistSessions = therapistSessions.filter(session => {
      const sessionDate = new Date(session.date); // Assuming session.date is a string in ISO format
      const matchingTimeSlotIndex = session.timeSlots.findIndex(
        timeSlot => timeSlot.startTime === appointmentStartTime
      );

      if (
        sessionDate.toDateString() === appointmentDate.toDateString() &&
        matchingTimeSlotIndex !== -1
      ) {
        // Remove the matching start time from the session's time slots
        session.timeSlots.splice(matchingTimeSlotIndex, 1);
        return session.timeSlots.length > 0; // Only return sessions with remaining time slots
      }
      return true; // Keep other sessions as they are
    });

    // Filter out sessions with no time slots left
    const updatedTherapistSessionsWithoutEmptySessions =
      updatedTherapistSessions.filter(session => session.timeSlots.length > 0);

    console.log("Therapist Sessions After Filtering:");
    updatedTherapistSessions.forEach(session => {
      console.log(`Date: ${session.date}`);
      session.timeSlots.forEach((timeSlot, index) => {
        console.log(`Time Slot ${index + 1}:`);
        console.log(`  Start Time: ${timeSlot.startTime}`);
        console.log(`  End Time: ${timeSlot.endTime}`);
      });
    });
    const filter = { _id: therapist._id }; // Replace with the appropriate query

    const update = {
      sessions: updatedTherapistSessionsWithoutEmptySessions,
    };

    const options = { new: true }; // To return the updated document

    const updatedTherapistInDB = await Therapist.findOneAndUpdate(
      filter,
      update,
      options
    );

    if (!updatedTherapistInDB) {
      console.log("Failed to update therapist sessions in the database");
      return res
        .status(500)
        .json({ error: "Failed to update therapist sessions" });
    }

    let calculatedAverage;
    let totalSessions;
    let totalDiscountPriceIncludingAppointment = 0;
    let packageAmount;

    const therapistLevel = therapist.level ? therapist.level.toString() : null;

    const userPriceHistory = user.priceHistory.filter(priceDetails => {
      const level = priceDetails.level ? priceDetails.level.toString() : null;

      if (therapistLevel && level) {
        return level === therapistLevel;
      }

      return false;
    });

    console.log(
      "User Price History Matching Therapist Level:",
      userPriceHistory
    );

    const totalDiscountPrice = userPriceHistory.reduce((sum, priceDetails) => {
      if (priceDetails.discountPrice) {
        return sum + priceDetails.discountPrice;
      }
      return sum;
    }, 0);

    console.log("Total Discount Price:", totalDiscountPrice);

    totalDiscountPriceIncludingAppointment = totalDiscountPrice;
    console.log(
      "Total Discount Price Including Appointment:",
      totalDiscountPriceIncludingAppointment
    );

    const totalSessionsInPriceHistory = userPriceHistory.reduce(
      (sum, priceDetails) => {
        if (priceDetails.session) {
          return sum + priceDetails.session;
        }
        return sum;
      },
      0
    );

    totalSessions = totalSessionsInPriceHistory;
    console.log("Total Sessions:", totalSessions);
    // Calculate the average price
    calculatedAverage =
      Math.round(
        (totalDiscountPriceIncludingAppointment / totalSessions) * 100
      ) / 100;
    const savedAppointment = await newAppointment.save();
    await updateSessionNumber(userId, therapistId);

    // Check if the user has a coin balance for this level
    const existingCoin = await Coin.findOne({
      user: userId,
      expriencelevel: therapist.level,
    });

    if (existingCoin) {
      // Update the existing coin balance
      existingCoin.coinBalance = existingCoin.coinBalance - 1;
      if (existingCoin.coinBalance < 0) {
        existingCoin.avarage = calculatedAverage; // Update the average if negative
      }
      await existingCoin.save();
    } else {
      const coinEntry = new Coin({
        user: userId,
        expriencelevel: therapist.level,
        coinBalance: -1,
        groupid: user.groupid,
        avarage: calculatedAverage,
      });
      await coinEntry.save();
    }

    const populatedAppointment = await Appointment.findById(
      savedAppointment._id
    )
      .populate("user", "name age gender")
      .exec();

    const therapistName = therapist.name;

    const dateObject = new Date(appointmentDate);

    // Extract the date part in YYYY-MM-DD format
    const appointmentDateonly = dateObject.toISOString().split("T")[0];

    sendWhatsAppMessage(
      user.mobile,
      `
      Hi ${user.name},
      Thank you for successfully booking an appointment with ${therapistName} on ${appointmentDateonly} at ${appointmentStartTime}.
      Please log into the application 5 mins before the start of the session.
      Thanks,
      Team Inspiron
      `
    );

    const emailMessage = `
      Hi ${user.name},\n
      Thank you for successfully booking an appointment with ${therapist.name} on ${appointmentDateonly} at ${appointmentStartTime}. Please log into the application 5 mins before the start of the session.\n
      Thanks,\n
      Team Inspiron
    `;

    sendEmailfortherapistbook(
      user.email,
      "Appointment Confirmation",
      emailMessage
    );

    return res.status(201).json(populatedAppointment);
  } catch (error) {
    console.error("Error creating appointment:", error);
    return res
      .status(500)
      .json({ error: "An error occurred while creating the appointment" });
  }
};
const sendEmailfortherapistbook = (to, subject, message) => {
  console.log("Recipient email:", to);

  const transporter = nodemailer.createTransport({
    host: "smtppro.zoho.com",
    port: 465,
    secure: true,
    auth: {
      user: "info@inspirononline.com",
      pass: "zU0VjyrxHmFm",
    },
  });

  const mailOptions = {
    from: "info@inspirononline.com",
    to: to,
    subject: "Booking Confirmation",
    text: message,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });
};

exports.getAppointmentById = async (req, res) => {
  const appointmentId = req.params.id;

  try {
    const appointment = await Appointment.findById(appointmentId).populate(
      "user",
      "name age gender"
    );

    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    res.status(200).json(appointment);
  } catch (error) {
    console.error("Error retrieving appointment:", error);
    res
      .status(500)
      .json({ error: "An error occurred while retrieving the appointment" });
  }
};

exports.getAppointmentsByTherapist = async (req, res) => {
  const therapistId = req.params.therapistId;

  try {
    const appointments = await Appointment.find({
      therapist: therapistId,
    }).populate("user", "name age gender");
    res.status(200).json(appointments);
  } catch (error) {
    console.error("Error retrieving appointments:", error);
    res
      .status(500)
      .json({ error: "An error occurred while retrieving appointments" });
  }
};

exports.getTodayAppointmentsByTherapist = async (req, res) => {
  const therapistId = req.params.therapistId;

  try {
    // Get the start and end of today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayAppointments = await Appointment.find({
      therapist: therapistId,
      dateTime: { $gte: today, $lt: tomorrow },
    }).populate("user", "name age gender groupid");

    // Filter appointments based on payment status and group ID
    const filteredAppointments = todayAppointments.filter(appointment => {
      if (appointment.user.groupid) {
        // User has a group ID, no need to check payment status
        return true;
      } else {
        // User doesn't have a group ID, check payment status
        return ["Offline", "Success"].includes(appointment.paymentstatus);
      }
    });

    // Sort filtered appointments by date and time
    filteredAppointments.sort((a, b) => {
      if (a.dateTime < b.dateTime) return -1;
      if (a.dateTime > b.dateTime) return 1;
      if (a.startTime < b.startTime) return -1;
      if (a.startTime > b.startTime) return 1;
      return 0;
    });

    const todayPatientsCount = filteredAppointments.length;

    res.status(200).json({
      appointments: filteredAppointments,
      totalPatients: todayPatientsCount,
    });
  } catch (error) {
    console.error("Error retrieving today's appointments:", error);
    res
      .status(500)
      .json({
        error: "An error occurred while retrieving today's appointments",
      });
  }
};

exports.getUpcomingAppointmentsByTherapist = async (req, res) => {
  const therapistId = req.params.therapistId;

  // Get the current date and time
  const currentDateTime = new Date();
  const currentDate = new Date(currentDateTime.toDateString()); // Set time to midnight
  const currentTime = currentDateTime.toLocaleTimeString("en-GB", {
    hour12: false,
  });

  try {
    let query = {
      therapist: therapistId,
      $or: [
        // Future dates
        { dateTime: { $gt: currentDateTime } },
        // Today's appointments with start time greater than or equal to current time
        {
          dateTime: {
            $gte: currentDate, // Date is greater than or equal to the current date
            $lt: new Date(currentDate.getTime() + 24 * 60 * 60 * 1000), // Date is less than tomorrow
          },
          startTime: { $gte: currentTime },
        },
      ],
    };

    const upcomingAppointments = await Appointment.find(query).populate(
      "user",
      "name age gender groupid"
    );

    // Filter appointments based on payment status and group ID
    const filteredAppointments = upcomingAppointments.filter(appointment => {
      if (appointment.user.groupid) {
        // User has a group ID, no need to check payment status
        return true;
      } else {
        // User doesn't have a group ID, check payment status
        return ["Offline", "Success"].includes(appointment.paymentstatus);
      }
    });

    // Sort filtered appointments by date and time
    filteredAppointments.sort((a, b) => {
      if (a.dateTime < b.dateTime) return -1;
      if (a.dateTime > b.dateTime) return 1;
      if (a.startTime < b.startTime) return -1;
      if (a.startTime > b.startTime) return 1;
      return 0;
    });

    const upcomingPatientsCount = filteredAppointments.length;

    res.status(200).json({
      upcomingAppointments: filteredAppointments,
      totalUpcomingPatients: upcomingPatientsCount,
    });
  } catch (error) {
    console.error("Error retrieving appointments:", error);
    res
      .status(500)
      .json({ error: "An error occurred while retrieving appointments" });
  }
};

exports.getAllAppointmentsByTherapist = async (req, res) => {
  const therapistId = req.params.therapistId;

  try {
    // Fetch all appointments for the therapist
    const allAppointments = await Appointment.find({
      therapist: therapistId,
    }).populate("user", "name age gender groupid");

    // Filter appointments based on payment status and group ID
    const filteredAppointments = allAppointments.filter(appointment => {
      if (appointment.user.groupid) {
        // User has a group ID, no need to check payment status
        return true;
      } else {
        // User doesn't have a group ID, check payment status
        return ["Offline", "Success"].includes(appointment.paymentstatus);
      }
    });

    // Sort filtered appointments by date and time
    filteredAppointments.sort((a, b) => {
      if (a.dateTime < b.dateTime) return -1;
      if (a.dateTime > b.dateTime) return 1;
      if (a.startTime < b.startTime) return -1;
      if (a.startTime > b.startTime) return 1;
      return 0;
    });

    const allPatientsCount = filteredAppointments.length;

    res.status(200).json({
      appointments: filteredAppointments,
      totalPatients: allPatientsCount,
    });
  } catch (error) {
    console.error("Error retrieving all appointments:", error);
    res
      .status(500)
      .json({ error: "An error occurred while retrieving all appointments" });
  }
};

// Update an appointment
exports.updateAppointment = async (req, res) => {
  const appointmentId = req.params.appointmentId;
  const updateData = req.body;

  try {
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      updateData,
      { new: true }
    ).populate("user", "name age gender");
    res.status(200).json(updatedAppointment);
  } catch (error) {
    console.error("Error updating appointment:", error);
    res
      .status(500)
      .json({ error: "An error occurred while updating the appointment" });
  }
};

// Delete an appointment
exports.deleteAppointment = async (req, res) => {
  const appointmentId = req.params.appointmentId;

  try {
    await Appointment.findByIdAndDelete(appointmentId);
    res.status(200).json({ message: "Appointment deleted successfully" });
  } catch (error) {
    console.error("Error deleting appointment:", error);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the appointment" });
  }
};

exports.getAppointmentsByTherapistWithEndedMeetCall = async (req, res) => {
  try {
    const therapistId = cc;

    // Update the appointment's googleMeetCallStatus to 'ended'
    const appointments = await Appointment.find({
      therapist: therapistId,
      googleMeetCallStatus: "ended",
    }).populate("user", "name age gender"); // Populate the 'user' field with 'name', 'age', and 'gender'

    if (appointments.length === 0) {
      return res
        .status(404)
        .json({ error: "No appointments found with ended Google Meet calls" });
    }

    res.status(200).json(appointments);
  } catch (error) {
    console.error(
      "Failed to retrieve appointments with ended Google Meet calls:",
      error
    );
    res
      .status(500)
      .json({
        error: "Failed to retrieve appointments with ended Google Meet calls",
      });
  }
};
exports.retrieveAppointments = (req, res) => {
  Appointment.find({}, "userName userAge userGender dateTime").exec(
    (err, appointments) => {
      if (err) {
        console.error("Error retrieving appointments:", err);
        res
          .status(500)
          .json({ error: "An error occurred while retrieving appointments." });
      } else {
        // Exclude the "user" field from each appointment
        const appointmentsWithoutUser = appointments.map(appointment => {
          const { user, ...appointmentWithoutUser } = appointment.toObject();
          return appointmentWithoutUser;
        });
        res.json(appointmentsWithoutUser);
      }
    }
  );
};
exports.coin = (req, res) => {
  const userId = req.params.UserId;

  const amountSpent = req.params.amountSpent; // Retrieve the amount spent dynamically

  User.findByIdAndUpdate(
    userId,
    { $inc: { coins: -amountSpent } },
    { new: true }
  )
    .then(updatedUser => {
      // Create the appointment and associate it with the user
      const appointmentData = {
        user: userId,
        // Other appointment details
        ...appointmentDetails,
      };

      return Appointment.create(appointmentData);
    })
    .then(createdAppointment => {
      // Handle successful appointment creation
      console.log("Appointment created:", createdAppointment);
    })
    .catch(error => {
      // Handle errors
      console.error("Error creating appointment:", error);
    });
};
exports.deleteAllAppointments = async (req, res) => {
  try {
    // Delete all appointments
    await Appointment.deleteMany({});

    res.status(200).json({ message: "All appointments deleted" });
  } catch (error) {
    console.error("Error deleting appointments:", error);
    res
      .status(500)
      .json({ error: "An error occurred while deleting appointments" });
  }
};
exports.updateAppointmentWithPayment = async (req, res) => {
  let userEmail;
  try {
    const appointmentId = req.params.id;
    const therapistId = req.params.therapistId;
    const { paymentMethod } = req.body;

    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    const therapist = await Therapist.findById(therapistId).select(
      "name level sessions"
    );
    if (!therapist) {
      return res.status(404).json({ error: "Therapist not found" });
    }
    const userId = appointment.user;

    // Query the User model to fetch the user's email using the user ID
    const user = await User.findById(userId).select(
      "name email priceHistory mobile"
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const therapistSessions = therapist.sessions || [];
    console.log(therapistSessions);
    // Extract appointment date, start time, and end time
    const appointmentDate = appointment.dateTime;
    const appointmentStartTime = appointment.startTime;
    const appointmentEndTime = appointment.endTime;
    console.log("Therapist Sessions Before Filtering:");
    therapistSessions.forEach(session => {
      console.log(`Date: ${session.date}`);
      session.timeSlots.forEach((timeSlot, index) => {
        console.log(`Time Slot ${index + 1}:`);
        console.log(`  Start Time: ${timeSlot.startTime}`);
        console.log(`  End Time: ${timeSlot.endTime}`);
      });
    });
    // Filter and remove the matching therapist session based on date and start time
    // Filter and remove the matching therapist session based on date and start time
    // Filter and remove the matching therapist session's start time
    const updatedTherapistSessions = therapistSessions.filter(session => {
      const sessionDate = new Date(session.date); // Assuming session.date is a string in ISO format
      const matchingTimeSlotIndex = session.timeSlots.findIndex(
        timeSlot => timeSlot.startTime === appointmentStartTime
      );

      if (
        sessionDate.toDateString() === appointmentDate.toDateString() &&
        matchingTimeSlotIndex !== -1
      ) {
        // Remove the matching start time from the session's time slots
        session.timeSlots.splice(matchingTimeSlotIndex, 1);
        return session.timeSlots.length > 0; // Only return sessions with remaining time slots
      }
      return true; // Keep other sessions as they are
    });

    // Filter out sessions with no time slots left
    const updatedTherapistSessionsWithoutEmptySessions =
      updatedTherapistSessions.filter(session => session.timeSlots.length > 0);

    console.log("Therapist Sessions After Filtering:");
    updatedTherapistSessions.forEach(session => {
      console.log(`Date: ${session.date}`);
      session.timeSlots.forEach((timeSlot, index) => {
        console.log(`Time Slot ${index + 1}:`);
        console.log(`  Start Time: ${timeSlot.startTime}`);
        console.log(`  End Time: ${timeSlot.endTime}`);
      });
    });
    const filter = { _id: therapist._id }; // Replace with the appropriate query

    const update = {
      sessions: updatedTherapistSessionsWithoutEmptySessions,
    };

    const options = { new: true }; // To return the updated document

    const updatedTherapistInDB = await Therapist.findOneAndUpdate(
      filter,
      update,
      options
    );

    if (!updatedTherapistInDB) {
      console.log("Failed to update therapist sessions in the database");
      return res
        .status(500)
        .json({ error: "Failed to update therapist sessions" });
    }

    let packageAmount;

    if (paymentMethod === "Offline") {
      if (appointment.discountPrice) {
        packageAmount = appointment.discountPrice;
      }
      appointment.paymentstatus = "Offline";
      appointment.paymentMethod = "Offline";
      appointment.message = ` ${packageAmount}`;
    }

    await therapist.save();
    const updatedAppointment = await appointment.save();

    userEmail = user.email;
    const username = user.name;

    // Update the coin balance based on payment method

    const therapistName = therapist.name;

    const appointmentTime = appointment.startTime;

    const dateObject = new Date(appointmentDate);

    // Extract the date part in YYYY-MM-DD format
    const appointmentDateonly = dateObject.toISOString().split("T")[0];

    let emailMessage;
    if (paymentMethod === "Offline") {
      emailMessage = `
    Hi ${username},\n
    Thank you for successfully booking an appointment with ${therapistName} on ${appointmentDate} at ${appointmentTime}. Please log into the application 5 mins before the start of the session.\n
        Thanks,\n
        Team Inspiron
      `;

      sendWhatsAppMessage(
        user.mobile,
        `
    Hi ${username},
Thank you for successfully booking an appointment with ${therapistName} on ${appointmentDateonly} at ${appointmentTime}.
Please log into the application 5 mins before the start of the session.
Thanks,
Team Inspiron
    `
      );
    }
    // Send the email
    sendEmail(userEmail, "Appointment Confirmation", emailMessage);

    return res.status(200).json(updatedAppointment);
  } catch (error) {
    console.error("Error updating appointment:", error);
    return res
      .status(500)
      .json({ error: "An error occurred while updating the appointment" });
  }
};

// Function to send an email
const sendEmail = (to, subject, message) => {
  console.log("Recipient email:", to); // Add this line for debugging

  const transporter = nodemailer.createTransport({
    host: "smtppro.zoho.com",
    port: 465,
    secure: true,
    auth: {
      user: "info@inspirononline.com",
      pass: "zU0VjyrxHmFm",
    },
  });

  const mailOptions = {
    from: "info@inspirononline.com",
    to: to,
    subject: "Booking Confirmation",
    text: message,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });
};

exports.updateAppointmentPrice = async (req, res) => {
  try {
    const appointmentId = req.params.id;
    const { priceId } = req.body;

    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    const userId = appointment.user;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const priceDetails = await Price.findById(priceId).select(
      "level session sessionPrice discountPrice"
    );

    if (!priceDetails) {
      return res.status(404).json({ error: "Price details not found" });
    }

    // Find the index of the existing price history entry based on the appointment ID
    const appointmentIndex = user.priceHistory.findIndex(
      entry => entry.appointmentId === appointmentId.toString()
    );

    if (appointmentIndex !== -1) {
      // Update the existing price history entry with the new price information
      user.priceHistory[appointmentIndex] = {
        ...user.priceHistory[appointmentIndex],
        priceId: priceId,
        level: priceDetails.level,
        session: priceDetails.session,
        sessionPrice: priceDetails.sessionPrice,
        discountPrice: priceDetails.discountPrice,
      };
    } else {
      // Create a new price history entry if it does not exist
      const newSessionDetails = {
        appointmentId: appointmentId,
        priceId: priceId,
        level: priceDetails.level,
        session: priceDetails.session,
        sessionPrice: priceDetails.sessionPrice,
        discountPrice: priceDetails.discountPrice,
      };
      user.priceHistory.push(newSessionDetails);
    }

    // Update the appointment's price-related properties
    appointment.price = priceId;
    appointment.session = priceDetails.session;
    appointment.sessionPrice = priceDetails.sessionPrice;
    appointment.discountPrice = priceDetails.discountPrice;
    appointment.level = priceDetails.level;

    await appointment.save();
    await user.save();

    return res.status(200).json(appointment);
  } catch (error) {
    console.error("Error updating appointment:", error);
    return res
      .status(500)
      .json({ error: "An error occurred while updating the appointment" });
  }
};

exports.extendSession = async (req, res) => {
  const appointmentId = req.params.id;

  try {
    const originalAppointment = await Appointment.findById(appointmentId);
    if (!originalAppointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    const userId = originalAppointment.user;
    const therapistId = originalAppointment.therapist;

    const user = await User.findById(userId).select("name email priceHistory");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const therapist = await Therapist.findById(therapistId).select("level");
    if (!therapist) {
      return res.status(404).json({ message: "Therapist not found" });
    }
    const appointmentDate = originalAppointment.dateTime;
    console.log("Appointment Date:", appointmentDate);

    const endTime = originalAppointment.endTime;
    console.log("Original Appointment End Time:", endTime);

    // Extract the date part from the appointmentDate
    const dateOnly = appointmentDate.toISOString().substring(0, 10);

    // Find the nearest appointment with the same date
    const nearestAppointment = await Appointment.findOne({
      dateTime: {
        $gte: new Date(dateOnly),
        $lt: new Date(dateOnly).setHours(23, 59, 59), // End of the same date
      },
      startTime: { $gte: originalAppointment.endTime },
    })
      .sort({ startTime: 1 })
      .exec();

    let nearestStartTime;
    if (nearestAppointment) {
      nearestStartTime = nearestAppointment.startTime;
      console.log("Nearest Appointment Start Time:", nearestStartTime);
    } else {
      nearestStartTime = "23:59"; // Set start time to 23:59 if no suitable appointment is found
      console.log("No suitable appointment found for extension");
    }

    const [nearestStartHour, nearestStartMinute] = nearestStartTime
      .split(":")
      .map(Number);
    const [endHour, endMinute] = endTime.split(":").map(Number);

    const timeDifferenceMinutes =
      nearestStartHour * 60 + nearestStartMinute - (endHour * 60 + endMinute);
    console.log("Time Difference (minutes):", timeDifferenceMinutes);

    if (timeDifferenceMinutes >= 30) {
      try {
        let calculatedAverage;
        let totalSessions;
        let totalDiscountPriceIncludingAppointment = 0;
        let extensionprice;

        const therapistLevel = therapist.level
          ? therapist.level.toString()
          : null;

        const userPriceHistory = user.priceHistory.filter(priceDetails => {
          const level = priceDetails.level
            ? priceDetails.level.toString()
            : null;

          if (therapistLevel && level) {
            return level === therapistLevel;
          }

          return false;
        });

        console.log(
          "User Price History Matching Therapist Level:",
          userPriceHistory
        );

        const totalDiscountPrice = userPriceHistory.reduce(
          (sum, priceDetails) => {
            if (priceDetails.discountPrice) {
              return sum + priceDetails.discountPrice;
            }
            return sum;
          },
          0
        );

        console.log("Total Discount Price:", totalDiscountPrice);

        totalDiscountPriceIncludingAppointment =
          totalDiscountPrice +
          (originalAppointment.discountPrice / originalAppointment.session) *
            0.5;
        console.log(
          "Total Discount Price Including Appointment:",
          totalDiscountPriceIncludingAppointment
        );

        const totalSessionsInPriceHistory = userPriceHistory.reduce(
          (sum, priceDetails) => {
            if (priceDetails.session) {
              return sum + priceDetails.session;
            }
            return sum;
          },
          0
        );

        totalSessions = totalSessionsInPriceHistory + 0.5;
        console.log("Total Sessions:", totalSessions);
        // Calculate the average price
        calculatedAverage =
          Math.round(
            (totalDiscountPriceIncludingAppointment / totalSessions) * 100
          ) / 100;

        console.log("Calculated Average Price:", calculatedAverage);

        if (originalAppointment.discountPrice !== 0.0) {
          originalAppointment.extensionprice =
            Math.round(
              (originalAppointment.discountPrice /
                originalAppointment.session) *
                0.5 *
                100
            ) / 100;
        }
        console.log("extensionprice:", originalAppointment.extensionprice);
        await originalAppointment.save();

        const userId = originalAppointment.user;
        const level = originalAppointment.therapist.level;

        const existingCoin = await Coin.findOne({
          user: userId,
          experiencelevel: level, // Assuming the field name is 'experiencelevel'
        });
        console.log("existingCoin:", existingCoin);
        if (existingCoin) {
          console.log(
            "User coin balance deducted by :",
            existingCoin.coinBalance
          );
          existingCoin.coinBalance = existingCoin.coinBalance + -0.5;
          console.log(
            "User coin balance deducted by :",
            existingCoin.coinBalance
          );
          if (!isNaN(calculatedAverage)) {
            existingCoin.avarage = calculatedAverage;
            await existingCoin.save();
            console.log(
              "User coin balance deducted by:",
              existingCoin.coinBalance
            );
          } else {
            console.error("Invalid calculated average:", calculatedAverage);
            // Handle the error or set a default value for the average
          }

          if (user.groupid) {
            user.credits = user.credits + -0.5;
            await user.save();
          }

          // Update the client's credit count if user has groupid
          if (user.groupid) {
            const client = await Client.findOne({
              groupid: user.groupid,
            }).select("credit");
            if (client) {
              client.credit = client.credit + -0.5;
              await client.save();
            }
          }
        } else {
          console.log("User coin entry not found or level mismatch.");
        }
      } catch (error) {
        console.error("Error deducting user coin balance:", error);
      }
      return res.json({
        message: "Appointment extended successfully",
      });
    }

    return res.json({
      message: "No suitable appointment found for extension",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};



function generateAndSavePDF(updateData) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    const content = [];
    doc.image("public/uploads/logo.png", 50, 50, { width: 100 }); // Add your logo image here
    doc.moveDown(2);

    // Function to add a section with a box around the text
    function addSectionWithBox(header, text) {
      if (text) {
        const padding = { left: 20, right: 20, top: 20, bottom: 20 }; // Increase padding
        const textWidth = 500 - padding.left - padding.right;
        const textHeight = doc.heightOfString(text, { width: textWidth });
        const boxHeight = textHeight + padding.top + padding.bottom;

        if (doc.y + boxHeight > doc.page.height) {
          doc.addPage(); // Start a new page if the content won't fit on the current page
        }

        content.push({ header, text });
        doc.text(header, { width: 500 });
        doc.moveDown(0.5);
        const boxX = 50 + padding.left;
        const boxY = doc.y;
        doc.rect(boxX, boxY, textWidth, boxHeight).stroke(); // Draw a box with increased padding
        doc.text(text, boxX + 10, boxY + padding.top, { width: textWidth }); // Add space from the left side
        doc.moveDown(2); // Adjust the line spacing
      }
    }

    addSectionWithBox("Summary:", updateData.summary);
    addSectionWithBox("Growth Curve Points:", updateData.growthCurve);
    addSectionWithBox("Therapeutic Techniques Used:", updateData.therapeuticTechniques);
    addSectionWithBox("Homework Given:", updateData.homeworkGiven);
    addSectionWithBox("Next Session Plan:", updateData.nextSessionPlan);

    doc.font("Helvetica").fontSize(12);

    const buffers = [];
    doc.on("data", (buffer) => buffers.push(buffer));
    doc.on("end", () => {
      const pdfBuffer = Buffer.concat(buffers);
      resolve(pdfBuffer);
    });

    
    const pdfFilePath = `public/uploads/session_summary_${moment().format("YYYYMMDD_HHmmss")}.pdf`;
    const writeStream = fs.createWriteStream(pdfFilePath);

    doc.pipe(writeStream);
    doc.end();

    writeStream.on("finish", () => {
      // The PDF has been saved locally
      console.log("PDF saved locally:", pdfFilePath);
    });

    writeStream.on("error", (err) => {
      reject(err);
    });
  });
}


exports.updateUserSessionNotes = async (req, res) => {
  try {
    const appointmentId = req.params.id;
    const updateData = req.body;

    const appointment = await Appointment.findById(appointmentId).populate('user');

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    appointment.sessionnotes.Summary = updateData.summary;
    appointment.sessionnotes.Growthcurvepoints = updateData.growthCurve;
    appointment.sessionnotes.TherapeuticTechniquesused = updateData.therapeuticTechniques;
    appointment.sessionnotes.Homeworkgiven = updateData.homeworkGiven;
    appointment.sessionnotes.Nextsessionplan = updateData.nextSessionPlan;
    appointment.sessionnotes.sharedWithPatient = updateData.sharedWithPatient;
    appointment.sessionnotes.sharedWithPsychiatrist = updateData.sharedWithPsychiatrist;
    appointment.sessionnotes.generateReport = updateData.generateReport;

    if (
      appointment.sessionnotes.Summary &&
      appointment.sessionnotes.Growthcurvepoints &&
      appointment.sessionnotes.TherapeuticTechniquesused &&
      appointment.sessionnotes.Homeworkgiven &&
      appointment.sessionnotes.Nextsessionplan &&
      appointment.sessionnotes.sharedWithPatient !== undefined &&
      appointment.sessionnotes.sharedWithPsychiatrist !== undefined &&
      appointment.sessionnotes.generateReport !== undefined
    ) {
      appointment.sessionstatus = "Completed";
    }

    const userId = appointment.user;

    if (updateData.sharedWithPsychiatrist === true) {
      const positiveCoinBalance = await Coin.findOne({
        user: userId,
        coinBalance: { $gt: 0 },
      });

      if (positiveCoinBalance) {
        const experiencelevel = positiveCoinBalance.expriencelevel;
        if (experiencelevel) {
          const level = experiencelevel.level;
          const matchingTherapists = await Therapist.find({ level: level });

          if (matchingTherapists.length > 0) {
            const therapistTypes = matchingTherapists.map(therapist => therapist.therapisttype);

            if (therapistTypes.includes("psychiatrist")) {
              const psychiatristTherapistIds = matchingTherapists.map(therapist => therapist._id);

              const psychiatristAppointments = await Appointment.find({
                therapist: { $in: psychiatristTherapistIds },
                user: userId,
              });

              if (psychiatristAppointments.length > 0) {
                const sortedAppointments = psychiatristAppointments.sort((a, b) =>
                  a.appointmentDate > b.appointmentDate ? 1 : -1
                );

                const latestAppointment = sortedAppointments[sortedAppointments.length - 1];

                const therapistId = latestAppointment.therapist;
                // Now, 'therapistId' contains the ID of the therapist associated with the latest appointment

                // You can use 'therapistId' for further processing or response
              }
            }
          }
        }
      }
    }

   
    if (updateData.sharedWithPatient === true) {
      const user = await User.findById(userId);
      const userEmail = user.email;
      const Mobile = user.mobile;

      const pdfBuffer = await generateAndSavePDF(updateData);
      const pdfFilePath = `public/uploads/session_summary_${moment().format("YYYYMMDD_HHmmss")}.pdf`;
      media_url=`http://13.126.59.21/public/uploads/session_summary_${moment().format("YYYYMMDD_HHmmss")}.pdf`
      sendWhatsAppMessageMedia(Mobile,
   `Attached is your session summary PDF
        Thanks,
      Team Inspiron
      `
        ,  media_url);
        const transporter = nodemailer.createTransport({
          host: "smtppro.zoho.com",
          port: 465,
          secure: true,
          auth: {
            user: "info@inspirononline.com",
            pass: "zU0VjyrxHmFm",
          },
        });
      
        const mailOptions = {
          from: "info@inspirononline.com",
        to: userEmail,
        subject: 'Session Summary PDF',
        text: 'Attached is your session summary PDF',
        attachments: [
          {
            filename: 'session_summary.pdf',
            path: pdfFilePath,
          },
        ],
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Error sending email:', error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
    }

    if (updateData.generateReport === true) {
      // Your code to handle generating a report, if needed
    }

    await appointment.save();

    res.json(appointment);
  } catch (error) {
    console.error("Error updating appointment session notes:", error);
    res.status(500).json({
      error: "An error occurred while updating appointment session notes",
    });
  }
};





exports.getAppointmentsByUser = async (req, res) => {
  try {
    const userId = req.params.userId; // Extract the user ID from the request parameters

    // Retrieve user appointments with sessionstatus 'Completed' using the Appointment model
    const userAppointments = await Appointment.find({
      user: userId,
      sessionstatus: "Completed",
    });

    // Calculate the count of user appointments
    const appointmentCount = userAppointments.length;

    // Fetch therapist names for each appointment
    const appointmentsWithTherapistNames = await Promise.all(
      userAppointments.map(async appointment => {
        try {
          // Fetch the therapist details for each appointment
          const therapist = await Therapist.findById(appointment.therapist);

          if (!therapist) {
            console.log(
              `Therapist with ID ${appointment.therapist} not found.`
            );
            // Handle the case where the therapist is not found.
            return {
              ...appointment.toObject(),
              therapistName: "Unknown Therapist",
            };
          }

          // Log the therapist's name for debugging purposes
          console.log(
            `Found Therapist for Appointment ID ${appointment._id}: ${therapist.name}`
          );

          // Create a new object with therapist's name
          const appointmentWithTherapistName = {
            ...appointment.toObject(),
            therapistName: therapist.name,
          };

          return appointmentWithTherapistName;
        } catch (therapistError) {
          console.error("Error fetching therapist:", therapistError);
          return {
            ...appointment.toObject(),
            therapistName: "Unknown Therapist",
          };
        }
      })
    );

    // Return the modified appointments along with the appointment count as a JSON response
    res.json({
      appointments: appointmentsWithTherapistNames,
      appointmentCount,
    });
  } catch (error) {
    // Handle errors and send an error response
    console.error("Error getting appointments by user:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching appointments" });
  }
};

exports.getAllPreviousAppointmentsForUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const therapistId = req.params.therapistId;

    // Find the therapist who made the request
    const requestingTherapist = await Therapist.findById(therapistId);

    if (!requestingTherapist) {
      return res.status(404).json({ error: "Therapist not found" });
    }

    // Find the last appointment of the therapist
    const lastTherapistAppointment = await Appointment.findOne({
      user: userId,
      therapist: therapistId,
      sessionstatus: "Completed", // Adjust this condition based on how you mark sessions as completed
    }).sort({ dateTime: -1 }); // Sort in descending order to get the latest session

    // Get the end time of the last therapist appointment
    const lastTherapistAppointmentEndTime = lastTherapistAppointment
      ? lastTherapistAppointment.endTime
      : null;

    // Find all appointments of the user with the requesting therapist
    const userAppointments = await Appointment.find({
      user: userId,

      sessionstatus: "Completed", // Adjust this condition based on how you mark sessions as completed
    }).sort({ dateTime: 1 }); // Sort in ascending order based on dateTime

    // Filter the appointments that occurred before the last appointment of the therapist
    const filteredAppointments = userAppointments.filter(
      appointment => appointment.dateTime < lastTherapistAppointment.dateTime
    );

    // Calculate the count of user's appointments with the requesting therapist
    const appointmentCount =
      filteredAppointments.length + (lastTherapistAppointment ? 1 : 0);

    // Fetch user details (including the name)
    const user = await User.findById(userId);

    // Return the list of appointments along with the appointment count and end time of the therapist's last appointment
    res.json({
      user: user ? user.name : "Unknown User",
      therapist: requestingTherapist.name,
      appointments: filteredAppointments,
      lastTherapistAppointment,
      lastTherapistAppointmentEndTime,
      appointmentCount,
    });
  } catch (error) {
    console.error("Error getting previous appointments for user:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching appointments" });
  }
};

exports.getUniqueUserNamesForTherapist = async (req, res) => {
  try {
    const therapistId = req.params.therapistId; // Extract therapist ID from the request params

    // Find all appointments for the specific therapist and populate the "user" field
    const appointments = await Appointment.find({
      therapist: therapistId,
    }).populate("user", ["name", "firstsession"]);

    // Create a Set to store unique user IDs and a Map to associate IDs with names and firstsession
    const uniqueUsers = new Map();

    // Iterate through the appointments and filter out duplicates
    appointments.forEach((appointment) => {
      const userId = appointment.user._id.toString(); // Convert ObjectId to string
      const userName = appointment.user.name;
      const firstSession = appointment.user.firstsession;

      if (!uniqueUsers.has(userId)) {
        uniqueUsers.set(userId, { userName, firstSession });
      }
    });

    // Convert the Map to an array of objects with user ID, name, and firstsession
    const uniqueUsersArray = Array.from(uniqueUsers, ([userId, { userName, firstSession }]) => ({
      userId,
      userName,
      firstSession,
    }));

    res.status(200).json(uniqueUsersArray);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getUpcomingAppointmentsByTherapistForUser = async (req, res) => {
  const userId = req.params.userId; // Extract the user ID from the request parameters

  // Get the current date and time
  const currentDateTime = new Date();
  const currentDate = new Date(currentDateTime.toDateString()); // Set time to midnight
  const currentTime = currentDateTime.toLocaleTimeString("en-GB", {
    hour12: false,
  });

  try {
    // Fetch upcoming appointments for today and the future for the specified therapist and user
    const upcomingAppointments = await Appointment.find({
      user: userId, // Filter by the specific user
      $or: [
        // Future dates
        { dateTime: { $gt: currentDateTime } },
        // Today's appointments with start time greater than or equal to current time
        {
          dateTime: {
            $gte: currentDate, // Date is greater than or equal to the current date
            $lt: new Date(currentDate.getTime() + 24 * 60 * 60 * 1000), // Date is less than tomorrow
          },
          startTime: { $gte: currentTime },
        },
      ],
    })
      .populate("user", "name age gender groupid")
      .populate("therapist", "name");
    // Sort appointments by date and time
    const filteredAppointments = upcomingAppointments.filter(appointment => {
      if (appointment.user.groupid) {
        // User has a group ID, no need to check payment status
        return true;
      } else {
        // User doesn't have a group ID, check payment status
        return ["Offline", "Success"].includes(appointment.paymentstatus);
      }
    });

    // Sort filtered appointments by date and time
    filteredAppointments.sort((a, b) => {
      if (a.dateTime < b.dateTime) return -1;
      if (a.dateTime > b.dateTime) return 1;
      if (a.startTime < b.startTime) return -1;
      if (a.startTime > b.startTime) return 1;
      return 0;
    });

    const upcomingPatientsCount = filteredAppointments.length;

    res.status(200).json({
      upcomingAppointments: filteredAppointments,
      totalUpcomingPatients: upcomingPatientsCount,
    });
  } catch (error) {
    console.error("Error retrieving appointments:", error);
    res
      .status(500)
      .json({ error: "An error occurred while retrieving appointments" });
  }
};

exports.updateUserSessionNotesemail = async (req, res) => {
  try {
    const appointmentId = req.params.id; // Extract appointmentId from the route parameters
    const updateData = req.body; // The data to update session notes

    const appointment = await Appointment.findById(appointmentId)
      .populate("user")
      .populate("therapist")
      .populate("dateTime"); // Assuming you have a 'therapist' and 'dateTime' field in your appointment object

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Update the session notes for the appointment with the provided data
    appointment.sessionnotes.sharedWithPatient = updateData.sharedWithPatient;
    appointment.sessionnotes.sharedWithPsychiatrist =
      updateData.sharedWithPsychiatrist;
    appointment.sessionnotes.generateReport = updateData.generateReport;

    // Update the appointment's status based on session notes
    if (
      appointment.sessionnotes.Summary &&
      appointment.sessionnotes.Growthcurvepoints &&
      appointment.sessionnotes.TherapeuticTechniquesused &&
      appointment.sessionnotes.Homeworkgiven &&
      appointment.sessionnotes.Nextsessionplan &&
      appointment.sessionnotes.sharedWithPatient !== undefined &&
      appointment.sessionnotes.sharedWithPsychiatrist !== undefined &&
      appointment.sessionnotes.generateReport !== undefined
    ) {
      appointment.sessionstatus = "Completed"; // Update the appointment's status
    }

    // Save the updated appointment
    await appointment.save();

    // Check if `generateReport` is true
    if (updateData.generateReport === true) {
      // Generate the PDF report and send it for download
      const pdfBuffer = await generatePDFReport(appointment);

      // Set response headers to indicate a PDF file attachment
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=appointment_report.pdf`
      );

      // Send the PDF buffer as a download
      return res.end(pdfBuffer);
    }

    // Check if `sharedWithPatient` is true
    if (updateData.sharedWithPatient === true) {
      // Retrieve the user's email address from your database based on the appointment ID
      const userEmail = appointment.user.email;
      const therapistName = appointment.therapist.name; // Assuming therapist name is in the `name` field
      const dateTime = appointment.dateTime; // Assuming `dateTime` contains the session date and time

      // Send an email to the user
      const emailResult = await sendEmailToUser(
        userEmail,
        therapistName,
        dateTime
      );

      if (emailResult) {
        return res.json({
          message: "Appointment updated and email sent to the user.",
        });
      } else {
        return res.json({
          message: "Appointment updated, but email sending failed.",
        });
      }
    }

    // Return a response indicating that the appointment has been updated
    res.json({ message: "Appointment updated." });
  } catch (error) {
    console.error("Error updating appointment session notes:", error);
    res
      .status(500)
      .json({
        error: "An error occurred while updating appointment session notes",
      });
  }
};

// Function to generate the PDF report
async function generatePDFReport(appointment) {
  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    await page.goto("https://web.whatsapp.com", {
      waitUntil: "networkidle2",
    });

    await page.setViewport({ width: 1680, height: 1050 });

    const todayDate = new Date();
    const pdfFilename = `sessionnote-${todayDate.getTime()}.pdf`; // Set the PDF filename

    const pdfBuffer = await page.pdf({ format: "A4", printBackground: true });

    await browser.close();

    return pdfBuffer;
  } catch (error) {
    console.error("Error generating PDF report:", error);
    throw new Error("Error generating PDF report");
  }
}

// Function to send an email to the user with the PDF report attached
async function sendEmailToUser(userEmail, therapistName, dateTime) {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtppro.zoho.com",
      port: 465,
      secure: true,
      auth: {
        user: "info@inspirononline.com",
        pass: "zU0VjyrxHmFm",
      },
    });
  
    const mailOptions = {
      from: "info@inspirononline.com",
      to: userEmail,
      subject: "Session Report",
      text: `Your therapist ${therapistName} has shared this attached Session Notes with you for your session on ${dateTime}. Here is your PDF report attached.`,
      attachments: [
        {
          filename: "appointment_report.pdf",
          content: await generatePDFReport(), // You need to implement this function to generate the PDF content
        },
      ],
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
}

exports.payment = async (req, res) => {
  const userId = req.params.userId;

  try {
    const appointments = await Appointment.find({
      user: userId,
      paymentstatus: { $in: ["Failed", "Success", "Offline"] }, // Exclude appointments with paymentstatus 'pending'
    });

    res.status(200).json(appointments);
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .json({
        error: "An error occurred while fetching appointments by user.",
      });
  }
};

exports.paymentpending = async (req, res) => {
  const userId = req.params.userId;

  try {
    const appointments = await Appointment.find(
      {
        user: userId,
        paymentstatus: "Pending", // Filter out appointments with paymentstatus not equal to 'pending'
      },
      {
        dateTime: 1,
        startTime: 1,
        paymentMethod: 1,
        paymentstatus: 1,
        _id: 1,
        therapist: 1,
      }
    ).populate("therapist", "name "); // Populate therapist details

    res.status(200).json(appointments);
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .json({
        error: "An error occurred while fetching appointments by user.",
      });
  }
};

exports.getAppointmentByIdoffline = async (req, res) => {
  const appointmentId = req.params.id;

  try {
    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    // Check if paymentstatus is 'offline' and include the message and extensionprice fields in the response
    if (appointment.paymentstatus === "Offline") {
      const response = { message: appointment.message };
      if (appointment.extensionprice > 0) {
        response.extensionprice = appointment.extensionprice;
      }
      return res.status(200).json(response);
    }

    // If paymentstatus is not 'offline,' return a response without the message and extensionprice fields
    return res.status(200).json({ message: "Paymentstatus is not offline" });
  } catch (error) {
    console.error("Error retrieving appointment:", error);
    return res
      .status(500)
      .json({ error: "An error occurred while retrieving the appointment" });
  }
};

exports.updatePaymentStatus = async (req, res) => {
  try {
    const { appointmentId } = req.params;

    const appointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      { paymentReceived: true },
      { new: true }
    );

    // Check if the appointment exists
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    appointment.paymentstatus = "Success";
    appointment.paymentMethod = "Offline";

    // Save the updated appointment
    await appointment.save();
    const userId = appointment.user;

    // Query the User model to fetch the user's email using the user ID
    const user = await User.findById(userId).select(
      "name email age gender credits groupid priceHistory mobile"
    );
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const therapistId = appointment.therapist;
    const therapist = await Therapist.findById(therapistId).select(
      "name level sessions"
    );

    if (!therapist) {
      console.log("Therapist not found:", therapistId);
      return res.status(404).json({ error: "Therapist not found" });
    }
    let calculatedAverage;
    let totalSessions;
    let totalDiscountPriceIncludingAppointment = 0;
    let packageAmount;

    const therapistLevel = therapist.level ? therapist.level.toString() : null;

    const userPriceHistory = user.priceHistory.filter(priceDetails => {
      const level = priceDetails.level ? priceDetails.level.toString() : null;

      if (therapistLevel && level) {
        return level === therapistLevel;
      }

      return false;
    });

    console.log(
      "User Price History Matching Therapist Level:",
      userPriceHistory
    );

    const totalDiscountPrice = userPriceHistory.reduce((sum, priceDetails) => {
      if (priceDetails.discountPrice) {
        return sum + priceDetails.discountPrice;
      }
      return sum;
    }, 0);

    console.log("Total Discount Price:", totalDiscountPrice);

    totalDiscountPriceIncludingAppointment = totalDiscountPrice;
    console.log(
      "Total Discount Price Including Appointment:",
      totalDiscountPriceIncludingAppointment
    );

    const totalSessionsInPriceHistory = userPriceHistory.reduce(
      (sum, priceDetails) => {
        if (priceDetails.session) {
          return sum + priceDetails.session;
        }
        return sum;
      },
      0
    );

    totalSessions = totalSessionsInPriceHistory;
    console.log("Total Sessions:", totalSessions);
    // Calculate the average price
    calculatedAverage =
      Math.round(
        (totalDiscountPriceIncludingAppointment / totalSessions) * 100
      ) / 100;

    console.log("Calculated Average Price:", calculatedAverage);

    await therapist.save();

    // Update the coin balance based on payment method
    const existingCoin = await Coin.findOne({
      user: appointment.user,
      expriencelevel: therapist.level,
    });

    if (existingCoin) {
      existingCoin.avarage = calculatedAverage;
      existingCoin.coinBalance += appointment.session;

      await existingCoin.save();
    }

    // Send a success response
    return res
      .status(200)
      .json({ message: "Payment received and balance updated" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.setPaymentStatusToSuccess = async (req, res) => {
  const appointmentId = req.params.id;

  try {
    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    // Check if the appointment's paymentStatus is already set to 'success'
    if (appointment.paymentStatus === "Success") {
      return res
        .status(200)
        .json({ message: "PaymentStatus is already set to success" });
    }

    // Update the paymentStatus to 'success'
    appointment.paymentStatus = "Success";

    // Save the updated appointment
    await appointment.save();

    const therapistId = appointment.therapist;
    const therapist = await Therapist.findById(therapistId).select(
      "name level sessions"
    );
    if (!therapist) {
      console.log("Therapist not found:", therapistId);
      return res.status(404).json({ error: "Therapist not found" });
    }
    const userId = appointment.user;

    // Query the User model to fetch the user's email using the user ID
    const user = await User.findById(userId).select("name email priceHistory");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const therapistSessions = therapist.sessions || [];
    console.log(therapistSessions);
    // Extract appointment date, start time, and end time
    const appointmentDate = appointment.dateTime;
    const appointmentStartTime = appointment.startTime;
    const appointmentEndTime = appointment.endTime;
    console.log("Therapist Sessions Before Filtering:");
    therapistSessions.forEach(session => {
      console.log(`Date: ${session.date}`);
      session.timeSlots.forEach((timeSlot, index) => {
        console.log(`Time Slot ${index + 1}:`);
        console.log(`  Start Time: ${timeSlot.startTime}`);
        console.log(`  End Time: ${timeSlot.endTime}`);
      });
    });
    // Filter and remove the matching therapist session based on date and start time
    // Filter and remove the matching therapist session based on date and start time
    // Filter and remove the matching therapist session's start time
    const updatedTherapistSessions = therapistSessions.filter(session => {
      const sessionDate = new Date(session.date); // Assuming session.date is a string in ISO format
      const matchingTimeSlotIndex = session.timeSlots.findIndex(
        timeSlot => timeSlot.startTime === appointmentStartTime
      );

      if (
        sessionDate.toDateString() === appointmentDate.toDateString() &&
        matchingTimeSlotIndex !== -1
      ) {
        // Remove the matching start time from the session's time slots
        session.timeSlots.splice(matchingTimeSlotIndex, 1);
        return session.timeSlots.length > 0; // Only return sessions with remaining time slots
      }
      return true; // Keep other sessions as they are
    });

    // Filter out sessions with no time slots left
    const updatedTherapistSessionsWithoutEmptySessions =
      updatedTherapistSessions.filter(session => session.timeSlots.length > 0);

    console.log("Therapist Sessions After Filtering:");
    updatedTherapistSessions.forEach(session => {
      console.log(`Date: ${session.date}`);
      session.timeSlots.forEach((timeSlot, index) => {
        console.log(`Time Slot ${index + 1}:`);
        console.log(`  Start Time: ${timeSlot.startTime}`);
        console.log(`  End Time: ${timeSlot.endTime}`);
      });
    });
    const filter = { _id: therapist._id }; // Replace with the appropriate query

    const update = {
      sessions: updatedTherapistSessionsWithoutEmptySessions,
    };

    const options = { new: true }; // To return the updated document

    const updatedTherapistInDB = await Therapist.findOneAndUpdate(
      filter,
      update,
      options
    );

    if (!updatedTherapistInDB) {
      console.log("Failed to update therapist sessions in the database");
      return res
        .status(500)
        .json({ error: "Failed to update therapist sessions" });
    }

    let calculatedAverage;
    let totalSessions;
    let totalDiscountPriceIncludingAppointment = 0;
    let packageAmount;

    const therapistLevel = therapist.level ? therapist.level.toString() : null;

    const userPriceHistory = user.priceHistory.filter(priceDetails => {
      const level = priceDetails.level ? priceDetails.level.toString() : null;

      if (therapistLevel && level) {
        return level === therapistLevel;
      }

      return false;
    });

    console.log(
      "User Price History Matching Therapist Level:",
      userPriceHistory
    );

    const totalDiscountPrice = userPriceHistory.reduce((sum, priceDetails) => {
      if (priceDetails.discountPrice) {
        return sum + priceDetails.discountPrice;
      }
      return sum;
    }, 0);

    console.log("Total Discount Price:", totalDiscountPrice);

    totalDiscountPriceIncludingAppointment = totalDiscountPrice;
    console.log(
      "Total Discount Price Including Appointment:",
      totalDiscountPriceIncludingAppointment
    );

    const totalSessionsInPriceHistory = userPriceHistory.reduce(
      (sum, priceDetails) => {
        if (priceDetails.session) {
          return sum + priceDetails.session;
        }
        return sum;
      },
      0
    );

    totalSessions = totalSessionsInPriceHistory;
    console.log("Total Sessions:", totalSessions);

    // Calculate the average price
    calculatedAverage =
      Math.round(
        (totalDiscountPriceIncludingAppointment / totalSessions) * 100
      ) / 100;

    console.log("Calculated Average Price:", calculatedAverage);

    // Get the user's email
    const userEmail = user.email;
    const username = user.name;
    const level = appointment.therapist.level;
    const session = appointment.session;

    // Update the coin balance based on payment method
    const existingCoin = await Coin.findOne({
      user: appointment.user,
      experiencelevel: level,
    });

    if (existingCoin) {
      if (appointment.discountPrice) {
        packageAmount = totalDiscountPriceIncludingAppointment;
      }
      console.log("Updated Coin Balance:", existingCoin.coinBalance);

      existingCoin.coinBalance += session;
      console.log("Updated Coin Balance:", existingCoin.coinBalance);

      existingCoin.average = calculatedAverage;

      await existingCoin.save();
    }

    // Update the coin balance based on payment method

    const therapistName = therapist.name;

    const appointmentTime = appointment.startTime;

    const dateObject = new Date(appointmentDate);

    // Extract the date part in YYYY-MM-DD format
    const appointmentDateonly = dateObject.toISOString().split("T")[0];
    const totalPrice = packageAmount;
    sendWhatsAppMessage(
      user.mobile,
      `
    Hi ${username},
    Thank you for successfully booking an appointment with ${therapistName} on ${appointmentDateonly} at ${appointmentTime}.
    Please log into the application 5 mins before the start of the session.
    Thanks,
    Team Inspiron
    `
    );

    let emailMessage;

    emailMessage = `
      Hi ${username},\n
      Thank you for successfully booking an appointment with ${therapistName} on ${appointmentDate} at ${appointmentTime}. Please log into the application 5 mins before the start of the session.\n
      Your payment for Rs ${totalPrice} has been received.\n
      Thanks,\n
      Team Inspiron
    `;

    // Send the email
    sendEmailto(userEmail, "Appointment Confirmation", emailMessage);

    return res
      .status(200)
      .json({ message: "Payment received and balance updated" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const sendEmailto = (to, subject, message) => {
  console.log("Recipient email:", to); // Add this line for debugging

  // Create a nodemailer transporter
  const transporter = nodemailer.createTransport({
    host: "smtppro.zoho.com",
    port: 465,
    secure: true,
    auth: {
      user: "info@inspirononline.com",
      pass: "zU0VjyrxHmFm",
    },
  });

  const mailOptions = {
    from: "info@inspirononline.com",
    to: to,
    subject: subject,
    text: message,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });
};
exports.updatePaymentStatusextend = async (req, res) => {
  try {
    const { appointmentId } = req.params;

    // Find the appointment by ID
    const appointment = await Appointment.findById(appointmentId);

    // Check if the appointment exists
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Set estendsession price to 0
    appointment.extensionprice = 0;

    // Save the updated appointment
    await appointment.save();

    const userId = appointment.user;

    // Query the User model to fetch the user's email using the user ID
    const user = await User.findById(userId);

    if (!user) {
      console.log("User not found:", userId);
      return res.status(404).json({ error: "User not found" });
    }

    const therapistId = appointment.therapist;
    const therapist = await Therapist.findById(therapistId).select(
      "name level"
    );

    if (!therapist) {
      console.log("Therapist not found:", therapistId);
      return res.status(404).json({ error: "Therapist not found" });
    }

    // Update the coin balance based on payment method
    const existingCoin = await Coin.findOne({
      user: appointment.user,
      expriencelevel: therapist.level,
    });

    if (existingCoin) {
      // Define your logic for calculating totalDiscountPriceIncludingAppointment, sessions, and calculatedAverage

      // Update the coin balance
      existingCoin.coinBalance = existingCoin.coinBalance + 0.5; // Add 0.5 to coinBalance

      await existingCoin.save();

      console.log("Updated Coin Balance:", existingCoin.coinBalance);
    }

    // Send a success response
    return res
      .status(200)
      .json({ message: "Payment received and balance updated" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.removeOldPendingAppointments = async (req, res) => {
  try {
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000); // 30 minutes ago

    // Find and retrieve appointments that are pending and older than 30 minutes
    const appointmentsToDelete = await Appointment.find({
      paymentstatus: "Pending",
      createdAt: { $lt: thirtyMinutesAgo },
    });

    if (appointmentsToDelete.length > 0) {
      // Extract therapist and user information from each appointment
      const therapistIds = appointmentsToDelete.map(
        appointment => appointment.therapist
      );
      const userIds = appointmentsToDelete.map(appointment => appointment.user);

      // Fetch therapist information
      const therapists = await Therapist.find({
        _id: { $in: therapistIds },
      }).select("name level sessions");
      if (!therapists) {
        return res.status(404).json({ error: "Therapists not found" });
      }

      // Fetch user information
      const users = await User.find({ _id: { $in: userIds } }).select(
        "name email priceHistory mobile"
      );
      if (!users) {
        return res.status(404).json({ error: "Users not found" });
      }

      // Delete the appointments
      const result = await Appointment.deleteMany({
        _id: { $in: appointmentsToDelete.map(appointment => appointment._id) },
      });

      console.log(`Deleted ${result.deletedCount} old pending appointments.`);

      // Increment the coin balance for each user's level
      for (const user of users) {
        const existingCoin = await Coin.findOne({
          user: user._id,
          experiencelevel: therapists.level,
        });

        if (existingCoin) {
          existingCoin.coinBalance += 1;
          await existingCoin.save();
        }
      }
    }
  } catch (error) {
    console.error("Error removing old pending appointments:", error);
  }
};

cron.schedule("* * * * *", async () => {
  const currentDate = new Date();
  const currentDateString = currentDate.toISOString().split("T")[0]; // Get the current date in ISO format (YYYY-MM-DD)

  const fiveMinutesFromNow = new Date(currentDate.getTime() + 5 * 60 * 1000);

  try {
    const upcomingAppointments = await Appointment.find({
      dateTime: {
        $gte: new Date(currentDateString), // Match appointments on or after the current date (start of the day)
        $lt: new Date(currentDateString + "T23:59:59.999Z"), // Match appointments until the end of the current day
      },
      startTime: { $lte: fiveMinutesFromNow },
      paymentstatus: { $in: ["Success", "Offline"] },
      reminded: false, // Only get appointments that have not been reminded
    });

    for (const appointment of upcomingAppointments) {
      const appointmentDateTime = new Date(
        appointment.dateTime.toDateString() + " " + appointment.startTime
      );
      const user = await User.findById(appointment.user).select(
        "name email mobile"
      );
      const therapist = await Therapist.findById(appointment.therapist).select(
        "name"
      );

      if (!user || !therapist) {
        console.log(
          "User or therapist not found for appointment:",
          appointment._id
        );
        continue;
      }

      const timeDifference = appointmentDateTime - currentDate;

      if (timeDifference >= 0 && timeDifference <= 5 * 60 * 1000) {
        const recipientNumber = user.mobile;
        const message = `Your appointment with ${therapist.name} is in 5 minutes.`;
        sendWhatsAppMessage(recipientNumber, message);

        const transporter = nodemailer.createTransport({
          host: "smtppro.zoho.com",
          port: 465,
          secure: true,
          auth: {
            user: "info@inspirononline.com",
            pass: "zU0VjyrxHmFm",
          },
        });
      
        const mailOptions = {
          from: "info@inspirononline.com",
          to: user.email,
          subject: "Appointment Reminder",
          text: `Your appointment with ${therapist.name} is in 5 minutes.`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error("Error sending email:", error);
          } else {
            console.log("Email sent:", info.response);
          }
        });

        // Mark the appointment as reminded
        appointment.reminded = true;
        await appointment.save();
      }
    }
  } catch (error) {
    console.error("Error checking for upcoming appointments:", error);
  }
});



exports.updatePackage = async (req, res) => {
  try {
    const appointmentId = req.params.id;
    const { package } = req.body;

    // Find the appointment by its ID
    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    appointment.package = package;

    // Get the therapist information
    const therapistId = appointment.therapist;
    const therapist = await Therapist.findById(therapistId).select(
      "name level sessions"
    );

    if (!therapist) {
      return res.status(404).json({ error: "Therapist not found" });
    }

    // Get the user information
    const userId = appointment.user;
    const user = await User.findById(userId).select(
      "name email priceHistory mobile"
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (package) {
      // If package is true, update payment method and payment status
      appointment.paymentMethod = "Online";
      appointment.paymentstatus = "Success";
      const therapistSessions = therapist.sessions || [];

      const appointmentDate = appointment.dateTime;
      const appointmentStartTime = appointment.startTime;

      const updatedTherapistSessions = therapistSessions.filter(session => {
        const sessionDate = new Date(session.date);
        const matchingTimeSlotIndex = session.timeSlots.findIndex(
          timeSlot => timeSlot.startTime === appointmentStartTime
        );

        if (
          sessionDate.toDateString() === appointmentDate.toDateString() &&
          matchingTimeSlotIndex !== -1
        ) {
          session.timeSlots.splice(matchingTimeSlotIndex, 1);
          return session.timeSlots.length > 0;
        }
        return true;
      });

      const updatedTherapistSessionsWithoutEmptySessions =
        updatedTherapistSessions.filter(
          session => session.timeSlots.length > 0
        );

      const filter = { _id: therapist._id };
      const update = {
        sessions: updatedTherapistSessionsWithoutEmptySessions,
      };

      const options = { new: true };
      const updatedTherapistInDB = await Therapist.findOneAndUpdate(
        filter,
        update,
        options
      );

      if (!updatedTherapistInDB) {
        console.log("Failed to update therapist sessions in the database");
        return res
          .status(500)
          .json({ error: "Failed to update therapist sessions" });
      }
    }

    const updatedAppointment = await appointment.save();
    const therapistName = therapist.name;
    const appointmentDate = appointment.dateTime;
    const dateObject = new Date(appointmentDate);
    const appointmentDateonly = dateObject.toISOString().split("T")[0];

    sendWhatsAppMessage(
      user.mobile,
      `
      Hi ${user.name},
      Thank you for successfully booking an appointment with ${therapistName} on ${appointmentDateonly} at ${appointment.StartTime}.
      Please log into the application 5 mins before the start of the session.
      Thanks,
      Team Inspiron
    `
    );

    const emailMessage = `
      Hi ${user.name},
      Thank you for successfully booking an appointment with ${therapist.name} on ${appointmentDateonly} at ${appointment.StartTime}. Please log into the application 5 mins before the start of the session.
      Thanks,
      Team Inspiron
    `;

    sendEmailforpackage(user.email, "Appointment Confirmation", emailMessage);

    return res.status(201).json(updatedAppointment);
  } catch (error) {
    console.error("Error updating package:", error);
    return res
      .status(500)
      .json({ error: "An error occurred while updating the package" });
  }
};

const sendEmailforpackage = (to, subject, message) => {
  console.log("Recipient email:", to);

  const transporter = nodemailer.createTransport({
    host: "smtppro.zoho.com",
    port: 465,
    secure: true,
    auth: {
      user: "info@inspirononline.com",
      pass: "zU0VjyrxHmFm",
    },
  });

  const mailOptions = {
    from: "info@inspirononline.com",
    to: to,
    subject: "Booking Confirmation",
    text: message,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });
};