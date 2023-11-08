const { EPrescription } = require('../models/eprescription');
const { User } = require('../models/user');
const { Therapist } = require('../models/therapist');
const nodemailer = require('nodemailer');

const path = require('path');
const PDFDocument = require("pdfkit");
const fs = require("fs");
const {
  sendWhatsAppMessage,sendWhatsAppMessageMedia,
  getSentMessageCount,
  getSentMessages,
  
} = require("../controller/whatsappcontrooler");



const moment = require("moment");

function generateAndSavePDFeprescription(data) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    const content = [];

    const pdfFileName = `medical_prescription_${data.mobile}_${moment().format("YYYYMMDD_HHmmss")}.pdf`;
    const pdfFilePath = `public/uploads/${pdfFileName}`;

    doc.pipe(fs.createWriteStream(pdfFilePath));

    function addSectionInTable(header, text) {
      doc.font('Helvetica-Bold').fontSize(14);
      doc.text(header, 50, doc.y, { width: 200, continued: true });
      doc.font('Helvetica').fontSize(12);
      doc.text(text, { width: 350, continued: true });

      doc.moveDown(0.5);
    }

    function addSectionWithBox(header, text) {
      doc.font('Helvetica-Bold').fontSize(14);
      doc.text(header, 50, doc.y);
      doc.moveDown(0.5);
      doc.font('Helvetica').fontSize(12);
      doc.text(text, { width: 500 });

      doc.moveDown(2);
    }

    doc.image("public/uploads/logo.png", 50, 50, { width: 100 });
    doc.moveDown(1);
    const leftX = 50;
    
    // Create a table-like structure for "Patient Information" on the left side
    const labelWidth = 150;
    const valueWidth = 200;
    
    function addTableRow(label, value, y) {
      doc.font('Helvetica-Bold').fontSize(12);
      doc.text(label, leftX, y, { width: labelWidth, continued: true });
      doc.font('Helvetica').fontSize(12);
      doc.text(value, { width: valueWidth });
    }
    addTableRow("Therapist Name:", data.therapistname, doc.y);
    addTableRow("Education Level:", data.therapisteducation, doc.y);
    doc.moveDown(1);
    
    
    
    addTableRow('Patient Name:', data.username, doc.y);
    addTableRow('Phone Number:', data.mobile, doc.y);
    addTableRow('Gender:', data.gender, doc.y);
    doc.moveDown(1);
    addSectionWithBox("Diagnosis", data.diagnosis);
    addSectionWithBox("Description", data.description);
    
    // Continue with the rest of your code
    



    addSectionInTable("Medicine List", "");

    data.medicineData.forEach((medicine, index) => {
      doc.font('Helvetica-Bold').fontSize(12);
      doc.text(`Medicine ${index + 1}`, 50, doc.y, { continued: true });
      doc.text(`Name: ${medicine.name}\nDosage: ${medicine.dosage}\nFrequency: ${medicine.frequency}\nInstructions: ${medicine.instructions}`, { width: 400 });
      doc.moveDown(1);
    });

    doc.moveDown(2);

    addSectionInTable("Lab Tests", "");

    data.selectedLabTests.forEach((test, index) => {
      const labTestInfo = `Lab Test ${index + 1} -  ${test}`;
      addSectionInTable("", labTestInfo);
    })

    


    doc.end();

    resolve(pdfFilePath);
  });
}

function sendEmailWithAttachment(userEmail, pdfFilePath) {
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
    subject: 'Medical Prescription PDF',
    text: 'Attached is your medical prescription PDF',
    attachments: [
      {
        filename: "medical_prescription.pdf", // Set the filename for the email attachment
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

exports.createEPrescription = async (req, res) => {
  try {
    const { therapistId, userId } = req.params;

    // Assuming you have models for Therapist and User
    const therapist = await Therapist.findById(therapistId);
    const user = await User.findById(userId);

    if (!therapist || !user) {
      return res.status(404).json({ error: 'Therapist or user not found.' });
    }

    // Check if the therapist's therapistType is "psychiatrist"
    if (therapist.therapisttype === 'Psychiatrist') {
      // Create the ePrescription
      const ePrescription = new EPrescription({
        therapistname: therapist.name,
        therapisteducation: therapist.education.length > 0 ? therapist.education[0].educationLevel : 'Unknown',
        therapistsign: therapist.sign,
        username: user.name,
        age: user.age,
        gender: user.gender,
        mobile: user.mobile,
        diagnosis: req.body.diagnosis,
        description: req.body.description,
        medicineData: req.body.medicineData,
        selectedLabTests: req.body.selectedLabTests
      });

      // Save the ePrescription to the database
      await ePrescription.save();

      // Generate and save the PDF
      const pdfFilePath = await generateAndSavePDFeprescription(ePrescription);

      // Email the PDF to the user
      sendEmailWithAttachment(user.email, pdfFilePath);
      
      media_url=`http://13.126.59.21/${pdfFilePath}`
      console.log(media_url)
      sendWhatsAppMessageMedia(user.mobile,
   `Attached is your prescription pdf
        Thanks,
      Team Inspiron
      `
        ,  media_url);
      res.status(201).json(ePrescription);
    } else {
      res.status(403).json({ error: 'Only psychiatrists can create ePrescriptions.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

         
exports.getAllEPrescriptions = async (req, res) => {
  try {
    const ePrescriptions = await EPrescription.find()
      .populate({
        path: 'medicene dose labTests',
        select: 'name', // Select the fields you want to retrieve from related models
      })
      .exec();

    res.status(200).json(ePrescriptions);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get an ePrescription by ID with lab details, medicine details, and dose details
exports.getEPrescriptionById = async (req, res) => {
  try {
    const ePrescription = await EPrescription.findById(req.params.id)
      .populate({
        path: 'medicene dose labTests',
        select: 'name', // Select the fields you want to retrieve from related models
      })
      .exec();

    if (!ePrescription) {
      return res.status(404).json({ error: 'EPrescription not found' });
    }

    res.status(200).json(ePrescription);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update an ePrescription by ID
exports.updateEPrescription = async (req, res) => {
  try {
    // Implement your update logic here

    // Example: Updating diagnosis and description fields
    const updatedEPrescription = await EPrescription.findByIdAndUpdate(
      req.params.id,
      {
        diagnosis: req.body.diagnosis,
        description: req.body.description,
      },
      { new: true }
    );

    res.status(200).json(updatedEPrescription);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete an ePrescription by ID
exports.deleteEPrescription = async (req, res) => {
  try {
    const deletedEPrescription = await EPrescription.findByIdAndRemove(req.params.id);

    if (!deletedEPrescription) {
      return res.status(404).json({ error: 'EPrescription not found' });
    }

    res.status(204).end();
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};