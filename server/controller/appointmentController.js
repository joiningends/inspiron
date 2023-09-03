const { Appointment } = require('../models/appointment');
const { User } = require('../models/user');
const Client = require('../models/client');
const { Therapist } = require('../models/therapist');
const Coin = require('../models/coin');
const Price = require('../models/prices');
// Function to update the Sessionnumber for the user
const updateSessionNumber = async (userId, therapistId) => {
  const numberOfSessions = await Appointment.countDocuments({
    therapist: therapistId,
    user: userId,
  });
  await User.findByIdAndUpdate(userId, { Sessionnumber: numberOfSessions + 1 });
};

exports.createAppointment = async (req, res) => {
  const { therapistId, userId, dateTime, startTime, endTime, sessionMode } = req.body;

  try {
    const user = await User.findById(userId).select('name age gender credits groupid');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const therapist = await Therapist.findById(therapistId).select('name level');
    if (!therapist) {
      return res.status(404).json({ error: 'Therapist not found' });
    }

    
    // If the user has a groupid, check if the companypayment is true
    if (user.groupid) {
      const client = await Client.findOne({ groupid: user.groupid }).select('companypayment credit');

      if (client && client.companypayment) {
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
          user: userId,
          dateTime,
          startTime,
          endTime,
          sessionMode,
        });

        const savedAppointment = await newAppointment.save();
        await updateSessionNumber(userId, therapistId);

        console.log('Before increment: user.credits =', user.credits);
user.credits = user.credits + 1;
console.log('After increment: user.credits =', user.credits);
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
          await existingCoin.save();
        } else {
          const coinEntry = new Coin({
            user: userId,
            expriencelevel: therapist.level,
            coinBalance: -1,
            groupid: user.groupid,
            avarage: 0, // Set average here if needed
            
          });

          await coinEntry.save();
        }

        const populatedAppointment = await Appointment.findById(savedAppointment._id)
          .populate('user', 'name age gender')
          .exec();

        return res.status(201).json(populatedAppointment);
      }
    } else {
      // Check if the user has a negative coin balance for every level
      const negativeCoinBalance = await Coin.findOne({
        user: userId,
        coinBalance: { $lt: 0 }, // Find any negative balance
      });

      if (negativeCoinBalance) {
        return res.status(400).json({ error: 'Dear custmer pay the due book an appointment.' });
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

      // Create the new appointment
      const newAppointment = new Appointment({
        therapist: therapistId,
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
        // Update the existing coin balance
        existingCoin.coinBalance = existingCoin.coinBalance - 1;
        await existingCoin.save();
      } else {
        const coinEntry = new Coin({
          user: userId,
          expriencelevel:therapist.level,
          coinBalance: -1,
          avarage: 0, // Set average here if needed
          userName: user.name,
          
        });

        await coinEntry.save();
      }

      const populatedAppointment = await Appointment.findById(savedAppointment._id)
        .populate('user', 'name age gender')
        .exec();

      return res.status(201).json(populatedAppointment);
    }
  } catch (error) {
    console.error('Error creating appointment:', error);
    return res.status(500).json({ error: 'An error occurred while creating the appointment' });
  }
};



exports.createAppointmentbytherapist = async (req, res) => {
  const { therapistId, userId, dateTime, startTime, endTime, sessionMode } = req.body;

  try {
    const user = await User.findById(userId).select('name age gender credits groupid');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const therapist = await Therapist.findById(therapistId).select('name level');
    if (!therapist) {
      return res.status(404).json({ error: 'Therapist not found' });
    }

    if (user.groupid) {
      const client = await Client.findOne({ groupid: user.groupid }).select('companypayment credit');

      if (client && client.companypayment) {
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
          user: userId,
          dateTime,
          startTime,
          endTime,
          sessionMode,
        });

        const savedAppointment = await newAppointment.save();
        await updateSessionNumber(userId, therapistId);

        user.credits = user.credits + 1; // Increase the creditfield count by 1
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
          await existingCoin.save();
        } else {
          const coinEntry = new Coin({
            user: userId,
            expriencelevel: therapist.level,
            coinBalance: -1,
            groupid: user.groupid,
            avarage: 0, // Set average here if needed
          });

          await coinEntry.save();
        }

        const populatedAppointment = await Appointment.findById(savedAppointment._id)
          .populate('user', 'name age gender')
          .exec();

        return res.status(201).json(populatedAppointment);
      }
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

    // Create the new appointment
    const newAppointment = new Appointment({
      therapist: therapistId,
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

    const populatedAppointment = await Appointment.findById(savedAppointment._id)
      .populate('user', 'name age gender')
      .exec();

    return res.status(201).json(populatedAppointment);
  } catch (error) {
    console.error('Error creating appointment:', error);
    return res.status(500).json({ error: 'An error occurred while creating the appointment' });
  }
};



 

    








exports.getAppointmentById = async (req, res) => {
  const appointmentId = req.params.id;

  try {
    const appointment = await Appointment.findById(appointmentId).populate('user', 'name age gender');

    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    res.status(200).json(appointment);
  } catch (error) {
    console.error('Error retrieving appointment:', error);
    res.status(500).json({ error: 'An error occurred while retrieving the appointment' });
  }
};





exports.getAppointmentsByTherapist = async (req, res) => {
    const therapistId = req.params.therapistId;
  
    try {
      const appointments = await Appointment.find({ therapist: therapistId }).populate('user', 'name age gender');
      res.status(200).json(appointments);
    } catch (error) {
      console.error('Error retrieving appointments:', error);
      res.status(500).json({ error: 'An error occurred while retrieving appointments' });
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
    }).populate('user', 'name age gender');
    todayAppointments.sort((a, b) => {
      if (a.dateTime < b.dateTime) return -1;
      if (a.dateTime > b.dateTime) return 1;
      if (a.startTime < b.startTime) return -1;
      if (a.startTime > b.startTime) return 1;
      return 0;
    });
    const todayPatientsCount = todayAppointments.length;

    res.status(200).json({
      appointments: todayAppointments,
      totalPatients: todayPatientsCount
    });
  } catch (error) {
    console.error('Error retrieving today\'s appointments:', error);
    res.status(500).json({ error: 'An error occurred while retrieving today\'s appointments' });
  }
};

exports.getUpcomingAppointmentsByTherapist = async (req, res) => {
  const therapistId = req.params.therapistId;

  // Get the current date
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0); // Set the time to 00:00:00.000

  try {
    // Fetch upcoming appointments for today and the future
    const upcomingAppointments = await Appointment.find({
      therapist: therapistId,
      $or: [
        // Future dates
        { dateTime: { $gt: currentDate } },
        // Today's appointments with start time greater than current time
        { 
          dateTime: currentDate,
          startTime: { $gt: currentDate.toLocaleTimeString('en-GB', { hour12: false }) },
        }
      ],
    }).populate('user', 'name age gender');
    // Sort appointments by date and time
    upcomingAppointments.sort((a, b) => {
      if (a.dateTime < b.dateTime) return -1;
      if (a.dateTime > b.dateTime) return 1;
      if (a.startTime < b.startTime) return -1;
      if (a.startTime > b.startTime) return 1;
      return 0;
    });

    const upcomingPatientsCount = upcomingAppointments.length;

    res.status(200).json({
      upcomingAppointments: upcomingAppointments,
      totalUpcomingPatients: upcomingPatientsCount,
    });
  } catch (error) {
    console.error('Error retrieving appointments:', error);
    res.status(500).json({ error: 'An error occurred while retrieving appointments' });
  }
};


exports.getAllAppointmentsByTherapist = async (req, res) => {
  const therapistId = req.params.therapistId;

  try {
    // Fetch all appointments
    const allAppointments = await Appointment.find({
      therapist: therapistId,
    }).populate('user', 'name age gender');

    // Calculate the total patient count
    const allPatientsCount = allAppointments.length;

    // Sort the appointments
    allAppointments.sort((a, b) => {
      if (a.dateTime < b.dateTime) return -1;
      if (a.dateTime > b.dateTime) return 1;
      if (a.startTime < b.startTime) return -1;
      if (a.startTime > b.startTime) return 1;
      return 0;
    });

    res.status(200).json({
      appointments: allAppointments,
      totalPatients: allPatientsCount
    });
  } catch (error) {
    console.error('Error retrieving all appointments:', error);
    res.status(500).json({ error: 'An error occurred while retrieving all appointments' });
  }
};



  // Update an appointment
  exports.updateAppointment = async (req, res) => {
    const appointmentId = req.params.appointmentId;
    const updateData = req.body;
  
    try {
      const updatedAppointment = await Appointment.findByIdAndUpdate(appointmentId, updateData, { new: true }).populate('user', 'name age gender');
      res.status(200).json(updatedAppointment);
    } catch (error) {
      console.error('Error updating appointment:', error);
      res.status(500).json({ error: 'An error occurred while updating the appointment' });
    }
  };
  
  // Delete an appointment
  exports.deleteAppointment = async (req, res) => {
    const appointmentId = req.params.appointmentId;
  
    try {
      await Appointment.findByIdAndDelete(appointmentId);
      res.status(200).json({ message: 'Appointment deleted successfully' });
    } catch (error) {
      console.error('Error deleting appointment:', error);
      res.status(500).json({ error: 'An error occurred while deleting the appointment' });
    }
  };
  
 

  exports.getAppointmentsByTherapistWithEndedMeetCall = async (req, res) => {
    try {
      const therapistId = cc
  
      // Update the appointment's googleMeetCallStatus to 'ended'
      const appointments = await Appointment.find({
        therapist: therapistId,
        googleMeetCallStatus: 'ended'
      }).populate('user', 'name age gender'); // Populate the 'user' field with 'name', 'age', and 'gender'
  
      if (appointments.length === 0) {
        return res.status(404).json({ error: 'No appointments found with ended Google Meet calls' });
      }
  
      res.status(200).json(appointments);
    } catch (error) {
      console.error('Failed to retrieve appointments with ended Google Meet calls:', error);
      res.status(500).json({ error: 'Failed to retrieve appointments with ended Google Meet calls' });
    }
  };
  exports.retrieveAppointments = (req, res) => {
    Appointment.find({}, 'userName userAge userGender dateTime')
    .exec((err, appointments) => {
      if (err) {
        console.error('Error retrieving appointments:', err);
        res.status(500).json({ error: 'An error occurred while retrieving appointments.' });
      } else {
        // Exclude the "user" field from each appointment
        const appointmentsWithoutUser = appointments.map(appointment => {
          const { user, ...appointmentWithoutUser } = appointment.toObject();
          return appointmentWithoutUser;
        });
        res.json(appointmentsWithoutUser);
      }
    });
};
exports.coin = (req, res) => {
const userId = req.params.UserId; 


const amountSpent = req.params.amountSpent; // Retrieve the amount spent dynamically

User.findByIdAndUpdate(userId, { $inc: { coins: -amountSpent } }, { new: true })
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
    console.log('Appointment created:', createdAppointment);
  })
  .catch(error => {
    // Handle errors
    console.error('Error creating appointment:', error);
  })
}
exports.deleteAllAppointments = async (req, res) => {
  try {
    // Delete all appointments
    await Appointment.deleteMany({});

    res.status(200).json({ message: 'All appointments deleted' });
  } catch (error) {
    console.error('Error deleting appointments:', error);
    res.status(500).json({ error: 'An error occurred while deleting appointments' });
  }
}
exports.updateAppointmentWithPayment = async (req, res) => {
  try {
    const appointmentId = req.params.id;
    const therapistId = req.params.therapistId;
    const { paymentMethod } = req.body;

    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    const therapist = await Therapist.findById(therapistId).select('name level');
    if (!therapist) {
      return res.status(404).json({ error: 'Therapist not found' });
    }

    let calculatedAverage;
    let totalSessions;
    let totalDiscountPriceIncludingAppointment = 0; // Initialize to 0

    if (appointment.discountPrice) {
      console.log('Appointment Discount Price:', appointment.discountPrice);

      const totalDiscountPrice = appointment.priceHistory.reduce((sum, priceDetails) => {
        console.log('Price Details Discount Price:', priceDetails.discountPrice);
        return sum + priceDetails.discountPrice;
      }, 0);

      console.log('Total Discount Price from Price History:', totalDiscountPrice);

      // Calculate the total discount price including the appointment's discount price
      totalDiscountPriceIncludingAppointment = totalDiscountPrice + appointment.discountPrice;
      console.log('Total Discount Price Including Appointment:', totalDiscountPriceIncludingAppointment);

      // Calculate the sum of all sessions in price history
      const totalSessionsInPriceHistory = appointment.priceHistory.reduce((sum, priceDetails) => {
        console.log('Price Details Session:', priceDetails.session);
        return sum + priceDetails.session;
      }, 0);

      console.log('Total Sessions in Price History:', totalSessionsInPriceHistory);
      console.log('Appointment Session:', appointment.session);

      // Calculate the total session count including the appointment's session count
      totalSessions = appointment.session + totalSessionsInPriceHistory;
      console.log('Total Sessions:', totalSessions);
      // Calculate the average price
      calculatedAverage = totalDiscountPriceIncludingAppointment / totalSessions;
      console.log('Calculated Average Price:', calculatedAverage);
    } else {
      const totalSessionPricesInPriceHistory = appointment.priceHistory.reduce((sum, priceDetails) => sum + priceDetails.sessionPrice, 0);
      const SessionPriceIncludingAppointment = totalSessionPricesInPriceHistory + appointment.sessionPrice;
      // Calculate the total session count including the appointment's session count
      totalSessions = appointment.session + totalSessionPricesInPriceHistory;

      // Calculate the average price based on total session prices
      calculatedAverage = SessionPriceIncludingAppointment / totalSessions;
    }

    const updatedAppointment = await appointment.save();

    // Update the coin balance based on payment method
    const existingCoin = await Coin.findOne({
      user: appointment.user,
      expriencelevel: therapist.level,
    });

    if (existingCoin) {
      let packageAmount;
      if (appointment.discountPrice) {
        packageAmount = totalDiscountPriceIncludingAppointment;
      } else {
        packageAmount = SessionPriceIncludingAppointment;
      }

      if (paymentMethod === 'success') {
        existingCoin.coinBalance += totalSessions;
        existingCoin.avarage = calculatedAverage;
        existingCoin.message = '';
      } else if (paymentMethod === 'Offline') {
        existingCoin.coinBalance -= totalSessions;
        existingCoin.avarage = calculatedAverage;
        existingCoin.message = `Please collect the full package amount (${packageAmount}) and update the coin balance`;
      }
      
      await existingCoin.save();
    }
      
          // Send email based on payment method
          const userEmail = appointment.user.email;
          const therapistName = therapist.name;
          const appointmentDate = appointment.appointmentDate;
          const appointmentTime = appointment.startTime;
          const totalPrice = packageAmount;
      
          let emailMessage;
          if (paymentMethod === 'success') {
            emailMessage = `
              Hi ${userEmail},\n
              Thank you for successfully booking an appointment with ${therapistName} on ${appointmentDate} at ${appointmentTime}. Please log into the application 5 mins before the start of the session.\n
              Your payment for Rs ${totalPrice} has been received.\n
              Thanks,\n
              Team Inspiron
            `;
          } else if (paymentMethod === 'Offline') {
            emailMessage = `
              Hi ${userEmail},\n
              Thank you for successfully booking an appointment with ${therapistName} on ${appointmentDate} at ${appointmentTime}. Please log into the application 5 mins before the start of the session.\n
              Thanks,\n
              Team Inspiron
            `;
          }
      
          // Send the email
          sendEmail(userEmail, 'Appointment Confirmation', emailMessage);
      
          return res.status(200).json(updatedAppointment);
        } catch (error) {
          console.error('Error updating appointment:', error);
          return res.status(500).json({ error: 'An error occurred while updating the appointment' });
        }
      };
      
      // Function to send an email
      const sendEmail = (to, subject, message) => {
        // Create a nodemailer transporter
        const transporter = nodemailer.createTransport({
          host: 'smtp.gmail.com', // Replace with your SMTP server hostname
          port: 587, // Replace with the SMTP server port (e.g., 587 for TLS)
          secure: false,
          requireTLS: true, // Set to true if your SMTP server requires a secure connection (TLS)
          auth: {
            user: 'inspiron434580@gmail.com', // Replace with your email address
            pass: 'rogiprjtijqxyedm', // Replace with your email password or application-specific password
          },
        });
  
        const mailOptions = {
          from: 'inspiron434580@gmail.com',
          to: updatedUser.email,
          subject: 'Booking Conformation',
          text: message,
        };
      
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error('Error sending email:', error);
          } else {
            console.log('Email sent:', info.response);
          }
        });
      };
      




exports.updateAppointmentPrice = async (req, res) => {
  try {
    const appointmentId = req.params.id;
    const { priceId } = req.body;

    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      throw new Error('Appointment not found');
    }

    // Store the current session details in the price history array
    const currentSessionDetails = {
      priceId: appointment.price,
      session: appointment.session,
      sessionPrice: appointment.sessionPrice,
      discountPrice: appointment.discountPrice,
    };
    appointment.priceHistory.push(currentSessionDetails);

    
    const priceDetails = await Price.findById(priceId);

    if (!priceDetails) {
      throw new Error('Price details not found');
    }

    // Update the appointment's price, sessions, and discounted price
    appointment.price = priceId;
    appointment.session = priceDetails.session;
    appointment.sessionPrice = priceDetails.sessionPrice;
    appointment.discountPrice = priceDetails.discountPrice;

    // Save the updated appointment
    const updatedAppointment = await appointment.save();
    return res.status(200).json(updatedAppointment);
  } catch (error) {
    console.error('Error updating appointment:', error);
    return res.status(500).json({ error: 'An error occurred while updating the appointment' });
  }
};



exports.extendSession = async (req, res) => {
  const appointmentId = req.params.id;

  try {
    const originalAppointment = await Appointment.findById(appointmentId);
    if (!originalAppointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    const userId = originalAppointment.user;
    const therapistId = originalAppointment.therapist;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const therapist = await Therapist.findById(therapistId);
    if (!therapist) {
      return res.status(404).json({ message: 'Therapist not found' });
    }
    const appointmentDate = originalAppointment.dateTime;
    console.log('Appointment Date:', appointmentDate);

    const endTime = originalAppointment.endTime;
    console.log('Original Appointment End Time:', endTime);

    // Extract the date part from the appointmentDate
    const dateOnly = appointmentDate.toISOString().substring(0, 10);

    // Find the nearest appointment with the same date
    const nearestAppointment = await Appointment.findOne({
      dateTime: { 
        $gte: new Date(dateOnly), 
        $lt: new Date(dateOnly).setHours(23, 59, 59) // End of the same date
      },
      startTime: { $gte: originalAppointment.endTime },
    })
    .sort({ startTime: 1 })
    .exec();

    let nearestStartTime;
    if (nearestAppointment) {
      nearestStartTime = nearestAppointment.startTime;
      console.log('Nearest Appointment Start Time:', nearestStartTime);
    } else {
      nearestStartTime = '23:59'; // Set start time to 23:59 if no suitable appointment is found
      console.log('No suitable appointment found for extension');
    }

      const [nearestStartHour, nearestStartMinute] = nearestStartTime.split(':').map(Number);
      const [endHour, endMinute] = endTime.split(':').map(Number);

      const timeDifferenceMinutes = (nearestStartHour * 60 + nearestStartMinute) - (endHour * 60 + endMinute);
      console.log('Time Difference (minutes):', timeDifferenceMinutes);

      if (timeDifferenceMinutes >= 30) {
       
        
        

  try {
    
    let totalSessions;
    let calculatedAverage;
    if (originalAppointment.discountPrice) {
      onsole.log('Appointment Discount Price:', originalAppointment.discountPrice);

  const totalDiscountPrice = originalAppointment.priceHistory.reduce((sum, priceDetails) => {
    console.log('Price Details Discount Price:', priceDetails.discountPrice);
    return sum + priceDetails.discountPrice;
  }, 0);

  console.log('Total Discount Price from Price History:', totalDiscountPrice);

  // Calculate the total discount price including the appointment's discount price
  const totalDiscountPriceIncludingAppointment = totalDiscountPrice + originalAppointment.discountPrice;
  console.log('Total Discount Price Including Appointment:', totalDiscountPriceIncludingAppointment);

      const totalDiscountExtendedPrice = totalDiscountPriceIncludingAppointment + (originalAppointment.discountPrice / 0.5);
      console.log('Total Discount Price Including Appointment:', totalDiscountExtendedPrice);
     const totalSessionsInPriceHistory = originalAppointment.priceHistory.reduce((sum, priceDetails) => {
        console.log('Price Details Session:', priceDetails.session);
        return sum + priceDetails.session;
      }, 0);
    
      console.log('Total Sessions in Price History:', totalSessionsInPriceHistory);
      console.log('Appointment Session:', originalAppointment.session);
    
      // Calculate the total session count including the appointment's session count
      totalSessions = originalAppointment + totalSessionsInPriceHistory;
      console.log('Total Sessions:', totalSessions);
      const totalExtendedSessions = totalSessions + 0.5;
      console.log('Total Sessions:', totalSessions);
      // Calculate the average price
      calculatedAverage = totalDiscountExtendedPrice / totalExtendedSessions;
    } else {
      const totalSessionPricesInPriceHistory = originalAppointment.priceHistory.reduce((sum, priceDetails) => sum + priceDetails.sessionPrice, 0);
const SessionPriceIncludingAppointment = totalSessionPricesInPriceHistory + originalAppointment.sessionPrice;
// Calculate the total session count including the appointment's session count

      const sessionPriceIncludingExtension = SessionPriceIncludingAppointment + 0.5;
      // Calculate the total sessions including the extension
      totalSessions = originalAppointment.session + totalSessionPricesInPriceHistory;
      const totalExtendedSessions = totalSessions + 0.5;
      // Calculate the average price
      calculatedAverage = sessionPriceIncludingExtension / totalExtendedSessions;
    }
    console.log('Calculated Average:', calculatedAverage);
  

          const userId = originalAppointment.user;
          const therapist = originalAppointment.therapist;

          const existingCoin = await Coin.findOne({
            user: userId,
            experiencelevel: therapist.level, // Assuming the field name is 'experiencelevel'
          });

          if (existingCoin) {
            console.log('User coin balance deducted by :', existingCoin.coinBalance);
            existingCoin.coinBalance = existingCoin.coinBalance + (-0.5);
            console.log('User coin balance deducted by :', existingCoin.coinBalance);
            if (!isNaN(calculatedAverage)) {
              existingCoin.avarage = calculatedAverage;
              await existingCoin.save();
              console.log('User coin balance deducted by:', existingCoin.coinBalance);
              
            } else {
              console.error('Invalid calculated average:', calculatedAverage);
              // Handle the error or set a default value for the average
            }
            
            
           
            
            if (user.groupid) {
              user.credits = user.credits + (-0.5);
              await user.save();
            }

            // Update the client's credit count if user has groupid
            if (user.groupid) {
              const client = await Client.findOne({ groupid: user.groupid }).select('credit');
              if (client) {
                client.credit = client.credit + (-0.5);
                await client.save();
              }
            }
          } else {
            console.log('User coin entry not found or level mismatch.');
          }
        } catch (error) {
          console.error('Error deducting user coin balance:', error);
        }
        return res.json({
          message: 'Appointment extended successfully',
        });
      }
  
      return res.json({
        message: 'No suitable appointment found for extension',
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };

exports.updateUserSessionNotes = async (req, res) => {
  try {
    
    const appointmentId = req.params.id; // Extract appointmentId from the route parameters
    const updateData = req.body; // The data to update session notes

    
    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Update the session notes for the appointment with the provided data
    appointment.sessionnotes.Summary = updateData.summary;
    appointment.sessionnotes.Growthcurvepoints = updateData.growthCurve;
    appointment.sessionnotes.TherapeuticTechniquesused = updateData.therapeuticTechniques;
    appointment.sessionnotes.Homeworkgiven = updateData.homeworkGiven;
    appointment.sessionnotes.Nextsessionplan = updateData.nextSessionPlan;
    appointment.sessionnotes.sharedWithPatient = updateData.sharedWithPatient;
    appointment.sessionnotes.sharedWithPsychiatrist = updateData.sharedWithPsychiatrist;
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
      appointment.sessionstatus = 'Completed'; // Update the appointment's status
    }

    // Save the updated appointment
    await appointment.save();

    res.json(appointment);
  } catch (error) {
    console.error('Error updating appointment session notes:', error);
    res.status(500).json({ error: 'An error occurred while updating appointment session notes' });
  }
};


exports.getAppointmentsByUser = async (req, res) => {
  try {
    const userId = req.params.userId; // Extract the user ID from the request parameters

    // Retrieve user appointments using the Appointment model
    const userAppointments = await Appointment.find({ user: userId });

    // Calculate the count of user appointments
    const appointmentCount = userAppointments.length;

    // Fetch therapist names for each appointment
    const appointmentsWithTherapistNames = await Promise.all(
      userAppointments.map(async (appointment) => {
        try {
          // Fetch the therapist details for each appointment
          const therapist = await Therapist.findById(appointment.therapist);

          if (!therapist) {
            console.log(`Therapist with ID ${appointment.therapist} not found.`);
            // Handle the case where the therapist is not found.
            return {
              ...appointment.toObject(),
              therapistName: 'Unknown Therapist',
            };
          }

          // Log the therapist's name for debugging purposes
          console.log(`Found Therapist for Appointment ID ${appointment._id}: ${therapist.name}`);

          // Create a new object with therapist's name
          const appointmentWithTherapistName = {
            ...appointment.toObject(),
            therapistName: therapist.name,
          };

          return appointmentWithTherapistName;
        } catch (therapistError) {
          console.error('Error fetching therapist:', therapistError);
          return {
            ...appointment.toObject(),
            therapistName: 'Unknown Therapist',
          };
        }
      })
    );

    // Return the modified appointments along with the appointment count as a JSON response
    res.json({ appointments: appointmentsWithTherapistNames, appointmentCount });
  } catch (error) {
    // Handle errors and send an error response
    console.error('Error getting appointments by user:', error);
    res.status(500).json({ error: 'An error occurred while fetching appointments' });
  }
};
exports.getAllPreviousAppointmentsForUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const therapistId = req.params.therapistId;

    // Find the therapist who made the request
    const requestingTherapist = await Therapist.findById(therapistId);

    if (!requestingTherapist) {
      return res.status(404).json({ error: 'Therapist not found' });
    }

    // Find the last appointment of the therapist
    const lastTherapistAppointment = await Appointment.findOne({
      user: userId,
      therapist: therapistId,
      sessionstatus: 'Completed', // Adjust this condition based on how you mark sessions as completed
    }).sort({ dateTime: -1 }); // Sort in descending order to get the latest session

    // Get the end time of the last therapist appointment
    const lastTherapistAppointmentEndTime = lastTherapistAppointment ? lastTherapistAppointment.endTime : null;

    // Find all appointments of the user with the requesting therapist
    const userAppointments = await Appointment.find({
      user: userId,
      
      sessionstatus: 'Completed', // Adjust this condition based on how you mark sessions as completed
    }).sort({ dateTime: 1 }); // Sort in ascending order based on dateTime

    // Filter the appointments that occurred before the last appointment of the therapist
    const filteredAppointments = userAppointments.filter(
      (appointment) => appointment.dateTime < lastTherapistAppointment.dateTime
    );

    // Calculate the count of user's appointments with the requesting therapist
    const appointmentCount = filteredAppointments.length + (lastTherapistAppointment ? 1 : 0);

    // Fetch user details (including the name)
    const user = await User.findById(userId);

    // Return the list of appointments along with the appointment count and end time of the therapist's last appointment
    res.json({
      user: user ? user.name : 'Unknown User',
      therapist: requestingTherapist.name,
      appointments: filteredAppointments,
      lastTherapistAppointment,
      lastTherapistAppointmentEndTime,
      appointmentCount
      
    });
  } catch (error) {
    console.error('Error getting previous appointments for user:', error);
    res.status(500).json({ error: 'An error occurred while fetching appointments' });
  }
};
