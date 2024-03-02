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
const Address = require('../models/adddress');
const GST = require('../models/gst');
const Signature = require('../models/signeture');
const BankDetails = require('../models/bankdetails.js');
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

   if (expectedSign === razorpay_signature) {
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
        "therapist user  session startTime endTime  dateTime discountPrice"
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
      

      

      const invoiceNumber = await createInvoice();
       console.log(appointment)
        const invoiceData = {
          invoiceNumber:invoiceNumber,
          billedTo: username,
          email: user.email, 
          mobile: user.mobile, 
         date:appointment.dateTime,
          pack:bookedsession,
          amount: appointment.discountPrice,
          totalAmount: appointment.discountPrice,
      };
      console.log(invoiceData)
      const pdfFilePath = `public/uploads/invoice_${invoiceNumber}.pdf`;
      generateInvoicePDF(invoiceData, pdfFilePath);
      media_url=`https://appointments.inspirononline.com./public/uploads/invoice_${Date.now()}.pdf`
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
      sendInvoiceByEmail(user.email, subject, message, pdfFilePath);

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
        const currentDate = new Date();
        const Packages = "Full payment";
        const invoiceNumber = await createInvoice();
       
        const invoiceData = {
          invoiceNumber:invoiceNumber,
          
          billedTo: user.name,
          email: user.email,
          mobile: user.mobile,
          date:formatDate(currentDate),
          pack: Packages,
          amount: amount,
          totalAmount: amount,
        };
        const pdfFilePath = `public/uploads/invoice_${Date.now()}.pdf`;
        generateInvoicePDF(invoiceData, pdfFilePath); // You need to define this function
       
      
        media_url = `https://appointments.inspirononline.com./${pdfFilePath}`;
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





const sendInvoiceByEmail = (to, subject, message, pdfFilePath) => {
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





function generateHeaders(doc,address,invoiceData) {

  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
});
  const textWidth = doc.widthOfString('Tax Invoice');
  const textX = (doc.page.width - textWidth) / 2;

  doc.fontSize(12)
    .text('Tax Invoice', textX, 50)
    .moveDown(1); // Add 1 line of spacing after the title

  // Add logo
  const logoPath = 'public/uploads/logo.png'; // Adjust the path to your logo image
  doc.image(logoPath, 50, 50, { width: 100 });

  // Add space between logo and company details
  doc.text('', 50, 150); // Add space after the logo
  doc.fontSize(12).text(address.name, 50, 90);
  doc.fontSize(10).text(address.street, 50, 105)
     .text(address.city, 50, 120)
     .text(address.state, 50, 135)
     .moveDown(1) // Add space before the telephone
     .text(`Telephone: ${address.telephone}`, 50, 160)
     .text(`E-mail: ${address.email}`, 50, 175)
     .text(`Website: ${address.website}`, 50, 190)
     .moveDown(1)
     doc.font('Helvetica-Bold').fontSize(10) 
.text(`GSTN: ${address.GSTN}`, 50, 210)
  doc.font('Helvetica').fontSize(10)
  .text(`SAC: ${address.SAC}`, 50, 225);
    
  doc.fontSize(10)
     .text(`Invoice Number: ${invoiceData.invoiceNumber}`, 300, 120)
     .text(`Invoice Date: ${currentDate}`, 300, 140)
     .moveDown(); // Add space after the invoice details

  const boxTop = 150;
  const boxLeft = 300;
  const boxWidth = 250;
  const boxHeight = 90;
  doc.strokeColor('black').lineWidth(1).rect(boxLeft, boxTop, boxWidth, boxHeight).stroke();
   
  // Set text color to black
  doc.fillColor('black');

  
  doc.font('Helvetica-Bold').fontSize(10) 
     .text('Invoiced To:', boxLeft + 5, boxTop + 5);
  doc.font('Helvetica').fontSize(10) // Change back to default font and size
     .text(`Client Name: ${invoiceData. billedTo}`, boxLeft + 5, boxTop + 20)
     .text(`Client Details: ${invoiceData.email} ${invoiceData.mobile} `, boxLeft + 5, boxTop + 35)
     .text(' ', boxLeft + 5, boxTop + 50);
}



function generateTableRow(doc, y, c1, c2, c3) {
  doc.fontSize(10)
    .text(c1, 80, y)
    .text(c2, 270, y)
    .text(c3, 400, y, { width: 90, align: 'right' });
}

// Function to generate the entire table
function generateTables(doc, tableData) {
  if (!tableData || !Array.isArray(tableData)) {
    throw new Error('Tables data is invalid or not provided.');
  }

  const tableTop = 280;

  // Table headers
  doc.font('Helvetica-Bold').fontSize(12);
  doc.text('Date', 80, tableTop);
  doc.text('Description', 270, tableTop);
  doc.text('Amount', 400, tableTop, { width: 90, align: 'right' });

  // Table rows
  doc.font('Helvetica').fontSize(10);
  let yPos = tableTop + 20;

  tableData.forEach(row => {
    generateTableRow(doc, yPos, row.date, row.description, row.amount);
    yPos += 20;
  });
}

// Function to generate the footer of the invoice
function generateFooters(doc,invoiceData,gst,bank,sign) {
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
});
  const footerTop = 400;

  doc.font('Helvetica-Bold').fontSize(12);
  doc.text(`Total Fee:${invoiceData.totalAmount}`, 420, footerTop+5);
  doc.text('Total Taxable Value', 50, footerTop+25);
  doc.text(`GST on Above:`, 50, footerTop+45);
  doc.text(`${gst.rate}`, 420, footerTop+45);
  doc.text('CGST', 50, footerTop+60);
  doc.text('0%', 420, footerTop+60);

  doc.text('SGST', 50, footerTop+75);
  doc.text('0%', 420, footerTop+75);
  doc.text('Total Invoice Value', 50, footerTop+90);
  doc.text(`${invoiceData.totalAmount}`, 420, footerTop+90);

  const boxLeft = 40;
  const boxTop = footerTop + 110;
  const boxWidth = 250;
  const boxHeight = 100;
  doc.rect(boxLeft, boxTop, boxWidth, boxHeight).stroke();

  // Add banking details inside the box
  
  doc.font('Helvetica-Bold').fontSize(10)
  .text('Banking Details:', boxLeft + 5, boxTop + 5)
  doc.font('Helvetica').fontSize(8)
    .text(`Account name: ${bank.accountname}`, boxLeft + 5, boxTop + 20)
     .text(`Bank name:  ${bank.bankName}`, boxLeft + 5, boxTop + 35)
     .text(`Account Number:  ${bank.accountNumber.accounttype}`, boxLeft + 5, boxTop + 50)
     .text(`Account Type:  ${bank.accountNumber}`, boxLeft + 5, boxTop + 65)
     .text(`IFSC Code:  ${bank.IFSC}`, boxLeft + 5, boxTop + 80);
     
     const tboxLeft = 400;
     
     const tboxWidth = 150;
     
     const termsBoxTop = footerTop + 120;
  const termsBoxHeight = 70;
  doc.rect(tboxLeft, termsBoxTop, tboxWidth, termsBoxHeight).stroke();

  doc.font('Helvetica-Bold').fontSize(10)
  .text('Terms of Payment:', tboxLeft + 5, termsBoxTop + 5);

  const imageath = 'public/uploads/mysign.jpeg'
  doc.image(imageath, tboxLeft + 10, termsBoxTop + 20, { width: 70 });
  doc.font('Helvetica').fontSize(8)
  .text( `${currentDate}`,tboxLeft + 10, termsBoxTop + 45);
  doc.font('Helvetica-Oblique').fontSize(10) // Set font to italic
   .text('for', 410, footerTop + 200); // Add italic text "for"

  doc.font('Helvetica').fontSize(10)
  
  .text(`${sign.name}`, 410, footerTop + 210)
  .text('Founder and Director', 410, footerTop + 220);
}


function generateInvoice(doc, tableData,address,invoiceData,gst,bank,sign) {
  doc.strokeColor('green').lineWidth(3);

  // Draw border around the entire page
  doc.rect(20, 20, 570, 750).stroke();
  
  // Generate headers
  generateHeaders(doc,address,invoiceData);
  
  
  doc.moveTo(50, 200);


  // Generate tables
  generateTables(doc, tableData);
// Move down to create space

  // Generate footers
  generateFooters(doc,invoiceData,gst,bank,sign);
}
const generateInvoicePDF = async (invoiceData, pdfFilePath) => {
  try {
   
    
    const doc = new PDFDocument();
    const writeStream = fs.createWriteStream(pdfFilePath);

    doc.pipe(writeStream);
    const date =formatDate(invoiceData.date)
    const amount = `${invoiceData.amount}.00`
    const tableData =[  
      { date: date, description: 'Therapy Package', amount: amount }
    ];
    const addresses = await Address.find();

        // Assuming you want to use the first address in the list
        const address = addresses[0];
        const gsts = await GST.find();

        // Assuming you want to use the first address in the list
        const gst = gsts[0];
        const banks = await BankDetails.find();

       
        const bank =banks[0];

        const signs = await Signature.find();

        // Assuming you want to use the first address in the list
        const sign =signs[0];

    // Generate the content of the PDF
    generateInvoice(doc, tableData, address,invoiceData,gst,bank,sign);

    doc.end();

    await new Promise((resolve, reject) => {
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

    return pdfFilePath;
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw error;
  }
};
const Invoice = require('../models/invoice');

// Function to create a new invoice
const createInvoice = async () => {
    try {
        const currentYear = new Date().getFullYear();

        // Find the latest invoice for the current year
        let latestInvoice = await Invoice.findOne({ year: currentYear }).sort({ invoiceCount: -1 });

        let invoiceCount;
        if (latestInvoice) {
            // If there are invoices for the current year, increment the invoice count
            invoiceCount = latestInvoice.invoiceCount + 1;
        } else {
            // If there are no invoices for the current year, set the invoice count to 1
            invoiceCount = 1;
        }

        // Create the new invoice
        const newInvoice = new Invoice({
            invoiceCount,
            year: currentYear
        });

        // Save the new invoice to the database
        await newInvoice.save();

        // Construct and return the invoice number
        const invoiceNumber = `INV${currentYear}-${invoiceCount}`;
        return invoiceNumber;
    } catch (error) {
        console.error(error);
        throw new Error('Error creating invoice');
    }
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear().toString().slice(-2);
  return `${day}-${month}-${year}`;
};






module.exports = {
  createOrder,
  verifyPayment,
  verifyPaymentoverall,
};
