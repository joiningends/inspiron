const Razorpay = require("razorpay");
const Payment = require("../models/payment");
const crypto = require("crypto");
const { Appointment } = require("../models/appointment");
const { User } = require("../models/user");
const Client = require("../models/client");
const { Therapist } = require("../models/therapist");
const Coin = require("../models/coin");
const Price = require("../models/prices");
const nodemailer = require("nodemailer");
const PDFDocument = require('pdfkit');
const fs = require('fs');
const {
  sendWhatsAppMessage,sendWhatsAppMessageMedia,
  getSentMessageCount,
  getSentMessages,
  
} = require("../controller/whatsappcontrooler");

const ExperienceLevel = require("../models/exprience");

const createOrder = async (req, res) => {
  try {
    const instance = new Razorpay({
      key_id: process.env.KEY_ID,
      key_secret: process.env.KEY_SECRET,
    });

    const options = {
      amount: req.body.amount * 100,
      currency: "INR",
      receipt: crypto.randomBytes(10).toString("hex"),
    };

    instance.orders.create(options, (error, order) => {
      if (error) {
        console.log(error);
        return res.status(500).json({ message: "Something Went Wrong!" });
      }
      res.status(200).json({ data: order });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error!" });
  }
};

const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      amount,
      currency,
    } = req.body;
    const { appointmentId } = req.params;

    // Verify the payment signature
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    let paymentStatus = "Failed"; // Default status is 'failed'

    if (razorpay_signature === expectedSign) {
      paymentStatus = "Success";
      const paymentVerification = new Payment({
        appointmentId: appointmentId,
        paymentStatus: paymentStatus, // Save the payment status
        razorpayOrderId: razorpay_order_id, // Save the Razorpay order ID
        razorpayPaymentId: razorpay_payment_id, // Save the Razorpay payment ID
        amount: amount, // Save the payment amount
        currency: currency, // Save the payment currency
      });

      await paymentVerification.save();

      // Fetch the appointment with all details
      const appointment = await Appointment.findById(appointmentId).select(
        "therapist user  session startTime endTime  dateTime"
      );

      if (!appointment) {
        console.log("Appointment not found:", appointmentId);
        return res.status(404).json({ error: "Appointment not found" });
      }

      const therapistId = appointment.therapist;
      const therapist = await Therapist.findById(therapistId).select(
        "name level sessions meetLink" );
        if (!therapist) {
        console.log("Therapist not found:", therapistId);
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
          return session.timeSlots.length > 0;
        }
        return true;
      });

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

      let calculatedAverage;
      let totalSessions;
      let totalDiscountPriceIncludingAppointment = 0;
      let packageAmount;

      const therapistLevel = therapist.level
        ? therapist.level.toString()
        : null;

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

      console.log("Calculated Average Price:", calculatedAverage);
      appointment.paymentstatus = paymentStatus;
      console.log("Updated Appointment:", appointment);
      await appointment.save();

      // Get the user's email
      userEmail = user.email;
      const username = user.name;

      const session = appointment.session;
      const userid = appointment.user;

      console.log(therapist.level);
      // Update the coin balance based on payment method
      const existingCoin = await Coin.findOne({
        user: userid,
        expriencelevel: therapist.level,
      });
      console.log(existingCoin);
      if (existingCoin) {
        if (appointment.discountPrice) {
          packageAmount = totalDiscountPriceIncludingAppointment;
        }
        console.log("Updated Coin Balance:", existingCoin.coinBalance);

        existingCoin.coinBalance += session;
        console.log("Updated Coin Balance:", existingCoin.coinBalance);

        existingCoin.avarage = calculatedAverage;

        await existingCoin.save();
      }

      const therapistName = therapist.name;

      const appointmentTime = appointment.startTime;

      const dateObject = new Date(appointmentDate);

      // Extract the date part in YYYY-MM-DD format
      const appointmentDateonly = dateObject.toISOString().split("T")[0];

      const totalPrice = amount;

      const matchingAppointmentforpdf = user.priceHistory.find(
        (appointment) => appointment.appointmentId === appointmentId
      );
      
      let discountPriceamount;
      let bookedsession;
      
      if (matchingAppointmentforpdf) {
        // Extract discountPrice and session values
        discountPriceamount = matchingAppointmentforpdf.discountPrice;
        bookedsession = matchingAppointmentforpdf.session;
      } else {
        console.log("Appointment not found");
      }
      
      // Now you can use discountPrice and bookedsession outside the if block
      console.log("Discount Price:", discountPriceamount);
      console.log("Booked Session:", bookedsession);
      
const meetLink = therapist.meetLink
console.log(user.mobile,)
      sendWhatsAppMessage(
        user.mobile,
        `
        
Hi ${username},
        
This is Inspiron. Your upcoming appointment is confirmed!
📅 Date: ${appointmentDateonly}
🕒 Time: ${appointmentTime}
🥼 Mental Health Expert: ${therapistName}
📍 Location: ${meetLink}
        
Payment Status: ${paymentStatus}
Reply 'CONFIRMED' to acknowledge or call for any changes.
Thank you,
Inspiron Team 🌈💚
        `
        
      
      );

      let emailMessage;

      emailMessage = `
Dear ${username},

We are pleased to confirm your upcoming appointment with our dedicated mental health expert ${therapistName} at Inspiron.

Details:
Date: ${appointmentDateonly}
Time: ${appointmentTime}
Location: ${meetLink}
Payment Status: ${paymentStatus}

If you have any questions or need to reschedule, please don't hesitate to contact us at .
We look forward to supporting you on your journey to well-being.

Best regards,
Inspiron Psychological Well-being Centre
`;


      // Send the email (you need to implement this function)
      sendEmail(user.email, "Appointment Confirmation", emailMessage);
      

      const invoiceNumber = "INSPIRON" + Date.now() + user.mobile ;

      
       
        const invoiceData = {
          invoiceNumber: invoiceNumber,
          
          billedTo: username,
          email: user.email, 
          mobile: user.mobile, 
          pack:bookedsession,
          amount: discountPriceamount,
          totalAmount: discountPriceamount,
      };
      
      const invoicePath = `public/uploads/invoice_${Date.now()}.pdf`;
      generateInvoicePDF(invoiceData, invoicePath);
      media_url=`https://appointments.inspirononline.com/public/uploads/invoice_${Date.now()}.pdf`
sendWhatsAppMessageMedia(user.mobile,
`Thank you for your payment. Please find the attached invoice.
`
  , media_url);

sendWhatsAppMessageMedia(user.mobile,
`Thank you for your payment. Please find the attached invoice.
`
  , media_url);
      const subject = 'Invoice for Your Payment';
      const message = `Thank you for your payment. Please find the attached invoice.`;
      sendInvoiceByEmail(user.email, subject, message, invoicePath);

      res.status(200).json({
        status: paymentStatus,
        message: "Payment verified successfully",
      });
    } else {
      const appointment = await Appointment.findById(appointmentId).select(
        "therapist user  session  "
      );

      if (!appointment) {
        console.log("Appointment not found:", appointmentId);
        return res.status(404).json({ error: "Appointment not found" });
      }
      appointment.paymentstatus = paymentStatus;
      console.log("Updated Appointment:", appointment);
      await appointment.save();
      console.log("Payment verification failed");
      res.status(400).json({
        status: paymentStatus,
        message: "Payment verification failed",
      });
    }
  } catch (error) {
    console.error("Verify payment error:", error);
    res
      .status(500)
      .json({ status: "error", message: "Internal Server Error!" });
  }
};

const sendEmail = (to, subject, message) => {
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
    subject: "Confirmation of Your Appointment with Inspiron",
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

const verifyPaymentoverall = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      amount,
      currency,
      userid,
      experiencelevel,
      useremail,
    } = req.body;

    let paymentStatus = 'Failed';

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (expectedSign === razorpay_signature) {
      paymentStatus = 'Success';

      const paymentVerification = new Payment({
        user: userid,
        paymentStatus: paymentStatus,
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
        amount: amount,
        currency: currency,
      });

      await paymentVerification.save();

      const existingCoin = await Coin.findOne({
        user: userid,
        expriencelevel: experiencelevel,
      });

      if (existingCoin) {
        existingCoin.coinBalance = 0;
        await existingCoin.save();
      }

      const therapist = await Therapist.findOne({ experiencelevel });

      await Appointment.updateMany(
        {
          user: userid,
          level: experiencelevel,
          paymentstatus: { $nin: ["Success", "Failure"] },
          paymentMethod: "Online",
        },
        {
          $set: {
            paymentMethod: "Online",
            paymentstatus: "Success",
            paymentrecived: true,
            extensionprice: 0,
          },
        }
      )
        .then((result) => {
          console.log("Update Result:", result);
        })
        .catch((error) => {
          console.error("Update Error:", error);
        });

      const user = await User.findById(userid).select("name mobile email");
      if (paymentStatus === 'Success') {
        const invoiceNumber = "INSPIRON" + Date.now() + user.mobile;
        const Packages = "Full payment";
        const invoiceData = {
          invoiceNumber: invoiceNumber,
          billedTo: user.name,
          email: user.email,
          mobile: user.mobile,
          pack: Packages,
          amount: amount,
          totalAmount: amount,
        };
        const pdfFilePath = `public/uploads/invoice_${Date.now()}.pdf`;
        generateInvoicePDF(invoiceData, pdfFilePath,); // You need to define this function

        media_url = `https://appointments.inspirononline.com/${pdfFilePath}`;
        sendWhatsAppMessageMedia(
          user.mobile,
          `Thank you for your payment. Please find the attached invoice.`,
          media_url
        ); // You need to define this function

        const subject = 'Invoice for Your Payment';
        const message = `Thank you for your payment. Please find the attached invoice.`;
        sendInvoiceByEmail(user.email, subject, message, invoicePath); // You need to define this function
      }
    }

    res.status(200).json({ message: `Payment status updated to ${paymentStatus}` });
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


const generateInvoicePDF = (invoiceData, pdfFilePath) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    const writeStream = fs.createWriteStream(pdfFilePath);

    doc.pipe(writeStream);

    doc.image('public/uploads/logo.png', 50, 50, { width: 100 }); // Add your logo image here
    doc.moveDown(3.5); // Reduce the gap

    doc.fontSize(16);
    doc.text('Invoice', { align: 'center' });
    doc.moveDown(0.5);
    doc.fontSize(12);
    doc.text(`Invoice Date: ${new Date().toLocaleDateString()}`);
    doc.text(`Invoice Number: ${invoiceData.invoiceNumber}`);
    doc.text(`Billed To: ${invoiceData.billedTo}`);
    doc.text(`Email: ${invoiceData.email}`);
    doc.text(`Mobile: ${invoiceData.mobile}`);

    // Add a small line
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();

    doc.fontSize(12);

    // Values for Package and Amount
    const packag = `${invoiceData.pack} `;
    const amount = `${invoiceData.amount} INR`;
    doc.moveDown(3);
    doc.text('Package', 150, doc.y);
    doc.text(packag, 170, doc.y);
    doc.text('Amount', 400, doc.y);
    doc.text(amount, 400, doc.y); // Adjust the X-coordinate (e.g., 450) as needed to align with the data

    // Add a line below the headings
    doc.moveTo(50, doc.y + 40).lineTo(550, doc.y + 40).stroke();

    // Total Amount
    doc.text(`Total Amount: ${invoiceData.totalAmount} INR`, 400, doc.y + 50);

    doc.end();

    writeStream.on("finish", () => {
      // The PDF has been saved locally
      console.log("PDF saved locally:", pdfFilePath);
      resolve(pdfFilePath);
    });

    writeStream.on("error", (err) => {
      // Handle the error
      console.error("Error saving PDF:", err);
      reject(err);
    });
  });
};



const sendInvoiceByEmail = (to, subject, message, invoicePath) => {
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
    attachments: [
      {
        filename: "invoice.pdf",
        path: pdfFilePath,
      },
    ],
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });
};





module.exports = {
  createOrder,
  verifyPayment,
  verifyPaymentoverall,
};
