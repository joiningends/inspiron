const Razorpay = require("razorpay");
const Payment = require("../models/payment");
const crypto = require("crypto");
const { Appointment } = require('../models/appointment');
const { User } = require('../models/user');
const Client = require('../models/client');
const { Therapist } = require('../models/therapist');
const Coin = require('../models/coin');
const Price = require('../models/prices');
const nodemailer = require('nodemailer');
const { sendWhatsAppMessage, getSentMessageCount, getSentMessages } = require('../controller/whatsappcontrooler'); 

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
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, amount, currency } = req.body;
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
      const appointment = await Appointment.findById(appointmentId).select('therapist user  session startTime endTime  dateTime');

      if (!appointment) {
        console.log('Appointment not found:', appointmentId);
        return res.status(404).json({ error: 'Appointment not found' });
      }

      const therapistId = appointment.therapist;
      const therapist = await Therapist.findById(therapistId).select('name level sessions');
      if (!therapist) {
        console.log('Therapist not found:', therapistId);
        return res.status(404).json({ error: 'Therapist not found' });
      }
      const userId = appointment.user;

    // Query the User model to fetch the user's email using the user ID
    const user = await User.findById(userId).select('name email priceHistory mobile');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }


    const therapistSessions = therapist.sessions || [];
    console.log(therapistSessions);
        // Extract appointment date, start time, and end time
        const appointmentDate = appointment.dateTime;
        const appointmentStartTime = appointment.startTime;
        const appointmentEndTime = appointment.endTime;
        console.log('Therapist Sessions Before Filtering:');
        therapistSessions.forEach((session) => {
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
      const matchingTimeSlotIndex = session.timeSlots.findIndex(timeSlot => timeSlot.startTime === appointmentStartTime);
    
      if (sessionDate.toDateString() === appointmentDate.toDateString() && matchingTimeSlotIndex !== -1) {
        // Remove the matching start time from the session's time slots
        session.timeSlots.splice(matchingTimeSlotIndex, 1);
        return session.timeSlots.length > 0; // Only return sessions with remaining time slots
      }
      return true; // Keep other sessions as they are
    });
    
    // Filter out sessions with no time slots left
    const updatedTherapistSessionsWithoutEmptySessions = updatedTherapistSessions.filter(session => session.timeSlots.length > 0);
    
    
    
        
        console.log('Therapist Sessions After Filtering:');
        updatedTherapistSessions.forEach((session) => {
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
    
        const updatedTherapistInDB = await Therapist.findOneAndUpdate(filter, update, options);
    
        if (!updatedTherapistInDB) {
          console.log('Failed to update therapist sessions in the database');
          return res.status(500).json({ error: 'Failed to update therapist sessions' });
        }

let calculatedAverage;
    let totalSessions;
    let totalDiscountPriceIncludingAppointment = 0;
    let packageAmount;

    const therapistLevel = therapist.level ? therapist.level.toString() : null;

    
    const userPriceHistory = user.priceHistory.filter((priceDetails) => {
      const level = priceDetails.level ? priceDetails.level.toString() : null;

      if (therapistLevel && level) {
        return level === therapistLevel;
      }

      return false;
    });

    
      console.log('User Price History Matching Therapist Level:', userPriceHistory);

      const totalDiscountPrice = userPriceHistory.reduce((sum, priceDetails) => {
        if (priceDetails.discountPrice) {
          return sum + priceDetails.discountPrice;
        }
        return sum;
      }, 0);

      console.log('Total Discount Price:', totalDiscountPrice);

      totalDiscountPriceIncludingAppointment = totalDiscountPrice ;
      console.log('Total Discount Price Including Appointment:', totalDiscountPriceIncludingAppointment);

    const totalSessionsInPriceHistory = userPriceHistory.reduce((sum, priceDetails) => {
        if (priceDetails.session) {
          return sum + priceDetails.session;
        }
        return sum;
      }, 0);

      totalSessions = totalSessionsInPriceHistory;
      console.log('Total Sessions:', totalSessions);
      // Calculate the average price
      calculatedAverage = Math.round((totalDiscountPriceIncludingAppointment / totalSessions) * 100) / 100;

      console.log('Calculated Average Price:', calculatedAverage);
      appointment.paymentstatus = paymentStatus;
      console.log('Updated Appointment:', appointment);
      await appointment.save();
      

      // Get the user's email
      userEmail = user.email;
      const username = user.name;
      
      
      const session =appointment.session;
       const userid = appointment.user;

 console.log(therapist.level)
      // Update the coin balance based on payment method
      const existingCoin = await Coin.findOne({
        user:  userid,
        expriencelevel: therapist.level,
      });
console.log(existingCoin)
      if (existingCoin) {
        if (appointment.discountPrice) {
          packageAmount = totalDiscountPriceIncludingAppointment;
        }
        console.log('Updated Coin Balance:', existingCoin.coinBalance);

        existingCoin.coinBalance += session;
        console.log('Updated Coin Balance:', existingCoin.coinBalance);

        existingCoin.avarage = calculatedAverage;
        

        await existingCoin.save();
      }

      

    const therapistName = therapist.name;
    
    const appointmentTime = appointment.startTime;

    const dateObject = new Date(appointmentDate);

// Extract the date part in YYYY-MM-DD format
const appointmentDateonly = dateObject.toISOString().split('T')[0];

      const totalPrice = packageAmount;

      sendWhatsAppMessage(user.mobile, `
      Hi ${username},
      Thank you for successfully booking an appointment with ${therapistName} on ${appointmentDateonly} at ${appointmentTime}.
      Please log into the application 5 mins before the start of the session.
      Thanks,
      Team Inspiron
      `);

      let emailMessage;
     
        emailMessage = `
          Hi ${username},\n
          Thank you for successfully booking an appointment with ${therapistName} on ${appointmentDateonly} at ${appointmentTime}. Please log into the application 5 mins before the start of the session.\n
          Your payment for Rs ${totalPrice} has been received.\n
          Thanks,\n
          Team Inspiron
        `;

        // Send the email (you need to implement this function)
        sendEmail(user.email, 'Appointment Confirmation', emailMessage);
      

      res.status(200).json({ status: paymentStatus, message: "Payment verified successfully" });
    } else {
      const appointment = await Appointment.findById(appointmentId).select('therapist user  session  ');

      if (!appointment) {
        console.log('Appointment not found:', appointmentId);
        return res.status(404).json({ error: 'Appointment not found' });
      }
      appointment.paymentstatus = paymentStatus;
      console.log('Updated Appointment:', appointment);
      await appointment.save();
      console.log('Payment verification failed');
      res.status(400).json({ status: paymentStatus, message: "Payment verification failed" });
    }
  } catch (error) {
    console.error("Verify payment error:", error);
    res.status(500).json({ status: "error", message: "Internal Server Error!" });
  }
};


  const sendEmail = (to, subject, message) => {
    console.log('Recipient email:', to); // Add this line for debugging

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
      to: to,
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




module.exports = {
  createOrder,
  verifyPayment,
};

