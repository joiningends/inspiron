const { Therapist } = require('../models/therapist');
const { Appointment } = require('../models/appointment');
const Category = require('../models/category');
const Patient = require('../models/patient');
const Assessment = require('../models/assessmentf');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const getTotalTherapists = async (req, res) => {
  try {
    const therapists = await Therapist.find({}).populate('expertise');

    const therapistStatus = therapists.map(therapist => {
      const { expertise, experienceLevel, meetLink } = therapist;
      const isApproved = expertise && expertise.length > 0 && experienceLevel !== null && meetLink !== "";
      return {
        ...therapist.toObject(),
        status: isApproved ? 'approved' : 'pending'
      };
    });

    const totalTherapists = therapistStatus.length;

    res.json({ totalTherapists, therapists: therapistStatus });
  } catch (error) {
    console.error('Error getting total therapists:', error);
    res.status(500).json({ error: 'An error occurred while getting total therapists' });
  }
};

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
    const therapists = await Therapist.find({}).populate('expertise');

    const populatedTherapists = await Promise.all(
      therapists.map(async therapist => {
        const populatedAvailability = await Promise.all(
          therapist.availability.map(async availability => {
            const category = await Category.findById(availability.location);
            if (!category) {
              // Skip adding this therapist to the result if the category is invalid
              return null;
            }
            const locationDetails = {
              centerName: category.centerName,
              centerAddress: category.centerAddress,
              contactNo: category.contactNo
            };
            return {
              location: locationDetails,
              day: availability.day,
              timeSlot: availability.timeSlot,
              _id: availability._id
            };
          })
        );

        // Remove any null values from the populatedAvailability array
        const filteredAvailability = populatedAvailability.filter(availability => availability !== null);

        return {
          ...therapist.toObject(),
          availability: filteredAvailability
        };
      })
    );

    // Filter therapists with complete profiles
    const completeProfiles = populatedTherapists.filter(
      therapist =>
        therapist.expertise && therapist.expertise.length !== 0 &&
        therapist.expriencelevel !== null &&
        therapist.meetLink !== "" &&
        therapist.availability.length > 0  // Ensure at least one valid availability is present
    );

    if (completeProfiles.length === 0) {
      return res.status(404).json({ error: 'No therapist profiles are complete or available yet.' });
    } else {
      return res.json(completeProfiles);
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve therapists', details: error.message });
  }
};


const getTherapists = async (req, res) => {
  try {
    const assessmentScore = req.body.assessmentScore;

    // Find assessments where the assessmentScore falls within the 'low', 'medium', or 'high' range
    const assessments = await Assessment.find({
      $or: [
        { 'low.min': { $lte: assessmentScore }, 'low.max': { $gte: assessmentScore } },
        { 'medium.min': { $lte: assessmentScore }, 'medium.max': { $gte: assessmentScore } },
        { 'high.min': { $lte: assessmentScore }, 'high.max': { $gte: assessmentScore } }
      ]
    });

    // Get the expertise IDs for all matching assessments
    const expertiseIds = assessments.reduce((acc, cur) => {
      const field = assessmentScore >= cur.low.min && assessmentScore <= cur.low.max ? 'low' :
        assessmentScore >= cur.medium.min && assessmentScore <= cur.medium.max ? 'medium' :
        assessmentScore >= cur.high.min && assessmentScore <= cur.high.max ? 'high' : null;

      if (field) {
        const expertiseIds = cur[field].expertise.map(expertise => expertise.toString());
        return acc.concat(expertiseIds);
      }
      return acc;
    }, []);

    // Build the query object with the expertise filter
    const query = {
      expertise: { $in: expertiseIds },
    };

    // Fetch the therapists based on the determined query
    const therapists = await Therapist.find(query, {
      assessmentScoreRange: 0, // Exclude the assessmentScoreRange field
    }).populate('expertise'); // Include expertise details

    // Populate the therapists' availability with location details
    const populatedTherapists = await Promise.all(
      therapists.map(async therapist => {
        const populatedAvailability = await Promise.all(
          therapist.availability.map(async availability => {
            const category = await Category.findById(availability.location);
            if (!category) {
              throw new Error('Invalid category ID');
            }
            const locationDetails = {
              centerName: category.centerName,
              centerAddress: category.centerAddress,
              contactNo: category.contactNo
            };
            return {
              location: locationDetails,
              day: availability.day,
              timeSlot: availability.timeSlot,
              _id: availability._id
            };
          })
        );
        return {
          ...therapist.toObject(),
          availability: populatedAvailability
        };
      })
    );

    res.json(populatedTherapists);
  } catch (error) {
    console.error('Error:', error); // Add this line for additional error details during debugging
    res.status(500).json({ error: 'Failed to retrieve therapists' });
  }
};




// Get a specific therapist by ID
const getTherapistById = (req, res) => {
  const therapistId = req.params.id;

  Therapist.findById(therapistId)
  .populate('expertise')
    .then(async (therapist) => {
      if (!therapist) {
        return res.status(404).json({ message: 'Therapist not found' });
      }

      // Filter availability data based on the provided therapist ID
      const populatedAvailability = await Promise.all(
        therapist.availability.map(async (availability) => {
          const category = await Category.findById(availability.location);
          if (!category) {
            throw new Error('Invalid category ID');
          }
          const locationDetails = {
            centerName: category.centerName,
            centerAddress: category.centerAddress,
            contactNo: category.contactNo
          };
          return {
            location: locationDetails,
            day: availability.day,
            timeSlot: availability.timeSlot,
            _id: availability._id
          };
        })
      );

      // Return the therapist data with filtered availability
      res.status(200).json({ ...therapist.toObject(), availability: populatedAvailability });
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
const createRandomPassword = () => {
  const length = 10;
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let randomPassword = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    randomPassword += charset[randomIndex];
  }
  return randomPassword;
};
const createTherapist = async (req, res) => {
  try {
    // Extract the required data from the request body
    const { name, email, mobile, availability } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    // Check if the email is provided and valid
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Check if the mobile number is provided and valid
    if (!mobile) {
      return res.status(400).json({ message: "Mobile number is required" });
    }

    const mobileRegex = /^\d{10}$/;
    if (!mobileRegex.test(mobile)) {
      return res.status(400).json({ message: "Invalid mobile number format" });
    }

    // Generate a random password
    const randomPassword = createRandomPassword();

    // Create therapist object with populated availability and passwordHash
    const therapist = new Therapist({ name, email, mobile, availability, password: randomPassword });
    await therapist.save();
   
    // Create the transporter and mail options
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
      to: therapist.email,
      subject: "Therapist Account Created",
      html: `
        <p>Your therapist account has been successfully created.</p>
        <p>Your login details are:</p>
        <p>Email: ${therapist.email}</p>
        <p>Password: ${randomPassword}</p>
      `,
    };
    await transporter.sendMail(mailOptions);

    res.status(200).json({ success: true, message: 'Therapist created successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};


const updateTherapist = (req, res) => {
  const therapistId = req.params.id;
  const updatedData = req.body;

  Therapist.findByIdAndUpdate(therapistId, updatedData, { new: true })
    .then((therapist) => {
      if (!therapist) {
        return res.status(404).json({ message: 'Therapist not found' });
      }
      res.status(200).json({ message: 'Therapist updated successfully', therapist });
    })
    .catch((error) => {
      res.status(500).json({ error: 'Failed to update therapist', details: error });
    });
};







const updateTherapists = async (req, res) => {
  const therapistId = req.params.id;
  const { expertise, experienceLevel, meetLink } = req.body;

  try {
    const therapist = await Therapist.findById(therapistId);

    if (!therapist) {
      return res.status(404).json({ error: 'Therapist not found' });
    }

    // Update the fields
    if (expertise) {
      therapist.expertise = expertise;
    }

    if (experienceLevel) {
      therapist.experienceLevel = experienceLevel;
    }

    if (meetLink) {
      therapist.meetLink = meetLink;
    }

    // Save the updated therapist
    const updatedTherapist = await therapist.save();

    // Send approval email
    sendApprovalEmail(updatedTherapist);

    res.status(200).json(updatedTherapist);
  } catch (error) {
    console.error('Error updating therapist details:', error);
    res.status(500).json({ error: 'An error occurred while updating therapist details' });
  }
};

// Function to send approval email
const sendApprovalEmail = (therapist) => {
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
    to: therapist.email,
    subject: "Therapist Account approved",
    html: `
    
    <p>Dear ${therapist.name}</p>
    <p>Congratulations! Your therapist profile has been approved.</p>
    <p>Add the requried details in your profile </p>`,
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
};








const updateTherapistImage = async (req, res) => {
  try {
    console.log('Received request body:', req.body);
  const base64Image = req.body.base64Image;

  console.log('base64Image:', base64Image);
    if (!base64Image) {
      return res.status(400).json({ error: 'No image data provided' });
    }

    // Convert the base64 image data to a buffer
    const imageBuffer = Buffer.from(base64Image, 'base64');

    const therapist = await Therapist.findByIdAndUpdate(
      req.params.id,
      { image: imageBuffer },
      { new: true }
    );

    if (!therapist) {
      return res.status(404).json({ error: 'Therapist not found' });
    }

    res.json({ image: therapist.image });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update therapist image' });
  }
};



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
    // Find the therapist by ID and populate the availability with location details
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
    });

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
     
    });

   
    const savedPatient = await newPatient.save();
    const populatedPatient = await savedPatient.populate('cognitiveFunctions').execPopulate();

    res.status(201).json({ success: true, patient: populatedPatient });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};


module.exports = {
  getTotalTherapists,
  getTherapistDetails,
getAllTherapists,
  getTherapists,
  getTherapistById,
  createTherapistfull,
  createTherapist,
  updateTherapist,
  updateTherapists,
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
