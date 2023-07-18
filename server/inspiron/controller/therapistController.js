const { Therapist } = require('../models/therapist');
const { Appointment } = require('../models/appointment');
const Category = require('../models/category');
const Patient = require('../models/patient');

const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');

const getTherapistDetails = async (req, res) => {
  const therapistId = req.params.id;
  const userId = req.query.userId; // Assuming you have the user's ID

  try {
    const therapist = await Therapist.findById(therapistId)
      .select('-availability._id')
      .populate({
        path: 'availability.location',
        select: 'centerName centerAddress contactNo -_id', // Exclude _id field from location details
      });

    if (!therapist) {
      return res.status(404).json({ error: 'Therapist not found' });
    }

    // Check if the user has an appointment with the therapist
    const appointment = await Appointment.findOne({ therapist: therapistId, user: userId });

    if (appointment && appointment.sessionMode === 'Offline') {
      // If the user has an appointment with 'Offline' session mode, show the location
      therapist.availability.forEach((availability) => {
        availability.location = availability.location;
      });
    } else {
      // If the user doesn't have an appointment or the session mode is 'Online', remove the location
      therapist.availability.forEach((availability) => {
        availability.location = undefined;
      });
    }

    res.json(therapist);
  } catch (error) {
    console.error('Failed to retrieve therapist details:', error);
    res.status(500).json({ error: 'An error occurred while retrieving therapist details' });
  }
};


const getAllTherapists = async (req, res) => {
  try {
    const therapists = await Therapist.find().populate({
      path: 'availability',
      select: 'day timeSlot -_id',
      populate: {
        path: 'location',
        select: '-_id',
      },
    });

    const modifiedProfiles = therapists.map(therapist => {
      // Modify therapist profile here
      // For example, remove the location field
      therapist.availability.forEach(availability => {
        availability.location = undefined;
      });

      return therapist;
    });

    const completeProfiles = modifiedProfiles.filter(
      therapist =>
        therapist.expertise.length !== 0 &&
        therapist.experiencelevel !== null &&
        therapist.meetLink !== ""
    );

    if (completeProfiles.length === 0) {
      return res.status(404).json({ error: 'No therapist profiles are complete or available yet.' });
    } else {
      return res.json(completeProfiles);
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve therapists' });
  }
};





const getTherapists = async (req, res) => {
  try {
    let filter = {};
    if (req.query.categories) {
      filter.category = { $in: req.query.categories.split(',') };
    }

    const assessmentScore = req.body.assessmentScore;

    const therapists = await Therapist.find(
      {
        'assessmentScoreRange.min': { $lte: assessmentScore },
        'assessmentScoreRange.max': { $gte: assessmentScore },
        ...filter
      },
      { assessmentScoreRange: 0 } // Exclude the assessmentScoreRange field
    ).populate('category'); // Include category details

    res.json(therapists);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve therapists' });
  }
};






// Get a specific therapist by ID
const getTherapistById = (req, res) => {
  const therapistId = req.params.id;

  Therapist.findById(therapistId)
    .then((therapist) => {
      if (!therapist) {
        return res.status(404).json({ message: 'Therapist not found' });
      }
      res.status(200).json(therapist);
    })
    .catch((error) => {
      res.status(500).json({ error: 'Failed to retrieve therapist', details: error });
    });
};
const createTherapistfull = async (req, res) => {
  try {
    const therapistData = req.body;

    // Create a new therapist instance with the request body
    const therapist = new Therapist(therapistData);

    // Save the therapist to the database
    const savedTherapist = await therapist.save();

    res.status(201).json(savedTherapist); // Respond with the created therapist
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const createTherapist = async (req, res) => {
  try {
    // Extract the required data from the request body
    const { name, email, mobile } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Name is required' });
    }
    
    // Check if the email is provided and valid
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }
    
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }
    
    // Check if the mobile number is provided and valid
    if (!mobile) {
      return res.status(400).json({ message: 'Mobile number is required' });
    }
    
    const mobileRegex = /^\d{10}$/;
    if (!mobileRegex.test(mobile)) {
      return res.status(400).json({ message: 'Invalid mobile number format' });
    }
    const therapist = new Therapist({ name, email, mobile });
await therapist.save();
    // Create the therapist object with basic information
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com', // Replace with your SMTP server hostname
      port: 587, // Replace with the SMTP server port (e.g., 587 for TLS)
      secure: false, 
      requireTLS:true,// Set to true if your SMTP server requires a secure connection (TLS)
      auth: {
        user: 'inspiron434580@gmail.com', // Replace with your email address
        pass: '  rogiprjtijqxyedm', // Replace with your email password or application-specific password
      },
     
    
  });
  


  const mailOptions = {
    from: 'inspiron434580@gmail.com',
    to: therapist.email,
      subject: 'Therapist Account Created',
      html: `
        <p>Your therapist account has been successfully created.</p>
        
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ success: true, message: 'Therapist created successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};









// Update a therapist by ID
const updateTherapistImage = async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    const fileName = file.filename;
    const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
    const imagePath = `${basePath}${fileName}`;

    const therapist = await Therapist.findByIdAndUpdate(
      req.params.id,
      { image: imagePath },
      { new: true }
    );

    if (!therapist) {
      return res.status(404).json({ error: 'Therapist not found' });
    }

    res.json({ image: therapist.image });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update therapist image' });
  }};




 


async function updatePrimaryDetails(req, res) {
  const therapistId = req.params.id;
  const { name, dateOfBirth, gender } = req.body;

  try {
    const therapist = await Therapist.findByIdAndUpdate(
      therapistId,
      { name, dateOfBirth, gender },
      { new: true }
    );

    if (!therapist) {
      return res.status(404).json({ success: false, message: 'Therapist not found' });
    }

    res.json({ success: true, therapist });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}
async function updateContactDetails(req, res) {
  const therapistId = req.params.id;
  const { email, mobile, emergencymobile } = req.body;

  try {
    const therapist = await Therapist.findByIdAndUpdate(
      therapistId,
      { email, mobile, emergencymobile },
      { new: true, select: 'email mobile emergencymobile' }
    );

    if (!therapist) {
      return res.status(404).json({ success: false, message: 'Therapist not found' });
    }

    const { email: updatedEmail, mobile: updatedMobile, emergencymobile: updatedEmergencyMobile } = therapist;

    res.json({ success: true, email: updatedEmail, mobile: updatedMobile, emergencymobile: updatedEmergencyMobile });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}





const updateAddresses = async (req, res) => {
  const therapistId = req.params.id;
  const { currentaddress, permanentaddress } = req.body;

  try {
    const therapist = await Therapist.findByIdAndUpdate(
      therapistId,
      { currentaddress, permanentaddress },
      { new: true, select: 'currentaddress permanentaddress' } 
    );

    if (!therapist) {
      return res.status(404).json({ success: false, message: 'Therapist not found' });
    }

    const { currentaddress: updatedCurrentAddress, permanentaddress: updatedPermanentAddress } = therapist;

    res.json({  currentaddress: updatedCurrentAddress, permanentaddress: updatedPermanentAddress });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const updateEducation = async (req, res) => {
  const therapistId = req.params.id;
  const educationId = req.params.educationId;
  const { collegeName, educationLevel, field, duration } = req.body;

  try {
    const therapist = await Therapist.findById(therapistId);

    if (!therapist) {
      return res.status(404).json({ success: false, message: 'Therapist not found' });
    }

    // Find the education object to be updated
    const education = therapist.education.id(educationId);
    if (!education) {
      return res.status(404).json({ success: false, message: 'Education not found' });
    }

    // Update the education object with the new details
    education.collegeName = collegeName;
    education.educationLevel = educationLevel;
    education.field = field;
    education.duration = duration;

    // Save the updated therapist object
    const updatedTherapist = await therapist.save();

    // Find the updated education object
    const updatedEducation = updatedTherapist.education.id(educationId);

    res.status(200).json({
      
      education: updatedEducation
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update education details', details: error });
  }
};



  










const updateAvailability = async (req, res) => {
  const therapistId = req.params.id;
  const { availability } = req.body;

  try {
    const therapist = await Therapist.findById(therapistId)
    if (!therapist) {
      return res.status(404).json({ success: false, error: 'Therapist not found' });
    }

    // Update the therapist's availability
    therapist.availability = availability;
    await therapist.save();

    // Populate the updated availability with location details, excluding sessionDuration and timeBetweenSessions
    const populatedAvailability = await therapist.populate({
      path: 'availability.location',
      select: '-sessionDuration -timeBetweenSessions -_id',
    }).execPopulate();

    // Return the updated therapist's availability in the response
    return res.json({ success: true, message: 'Availability updated successfully', availability: populatedAvailability.availability });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};







// Delete a therapist by ID
const deleteTherapist = (req, res) => {
  const therapistId = req.params.id;

  Therapist.findByIdAndRemove(therapistId)
    .then((therapist) => {
      if (!therapist) {
        return res.status(404).json({ message: 'Therapist not found' });
      }
      res.status(200).json({ message: 'Therapist deleted successfully' });
    })
    .catch((error) => {
      res.status(500).json({ error: 'Failed to delete therapist', details: error });
    });
};


const getTherapistmeetlink = async (req, res) => {
  try {
    const therapistId = req.params.id;

    // Find the therapist by ID
    const therapist = await Therapist.findById(therapistId);

    if (!therapist) {
      return res.status(404).json({ message: 'Therapist not found' });
    }

    const meetlink = therapist.meetLink;

    res.status(200).json({ meetLink: meetlink });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve therapist meetlink', details: error });
  }
};

const createPatient = async (req, res) => {
  try {
    const {
      fullName,
      age,
      sex,
      pronouns,
      height,
      weight,
      fullAddress,
      contactDetails,
      emergencyContactName,
      emergencyContactNumber,
      education,
      occupation,
      socioeconomicStatus,
      informant,
      relationshipWithPatient,
      durationOfStayWithPatient,
      information,
      religionEthnicity,
      dateOfBirth,
      languagesKnown,
      foreignLanguage,
      maritalStatus,
      reference,
      depressiveSymptoms,
      maniaSymptoms,
      anxietySymptoms,
      ocdSymptoms,
      physicalSymptoms,
      psychosisSymptoms,
      personalityTraits,
      deliberateSelfHarm,
      appetite,
      sleep,
      sexualDysfunction,
      headachesPains,
      cognitiveFunctions,
      description
    } = req.body;

    const newPatient = new Patient({
      fullName,
      age,
      sex,
      pronouns,
      height,
      weight,
      fullAddress,
      contactDetails,
      emergencyContactName,
      emergencyContactNumber,
      education,
      occupation,
      socioeconomicStatus,
      informant,
      relationshipWithPatient,
      durationOfStayWithPatient,
      information,
      religionEthnicity,
      dateOfBirth,
      languagesKnown,
      foreignLanguage,
      maritalStatus,
      reference,
      depressiveSymptoms,
      maniaSymptoms,
      anxietySymptoms,
      ocdSymptoms,
      physicalSymptoms,
      psychosisSymptoms,
      personalityTraits,
      deliberateSelfHarm,
      appetite,
      sleep,
      sexualDysfunction,
      headachesPains,
      cognitiveFunctions,
      description
    });

   
    const savedPatient = await newPatient.save();
    const populatedPatient = await savedPatient.populate('cognitiveFunctions').execPopulate();

    res.status(201).json({ success: true, patient: populatedPatient });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};


module.exports = {
  getTherapistDetails,
getAllTherapists,
  getTherapists,
  getTherapistById,
  createTherapistfull,
  createTherapist,
  //updateTherapist,
  updateTherapistImage,
  //createTherapistPassword,
 // handlePasswordReset,
  //therapistLogin,
  updatePrimaryDetails,
   updateContactDetails,
   
  updateAddresses,
  updateEducation,
  updateAvailability,
  deleteTherapist,
  getTherapistmeetlink,
  //updateTherapistLocation,
  createPatient,
};
