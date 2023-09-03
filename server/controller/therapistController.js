const { Therapist } = require('../models/therapist');
const { Appointment } = require('../models/appointment');
const Category = require('../models/category');

const Assessment = require('../models/assessmentf');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { Session } = require('inspector');
const Price = require('../models/prices');
const { error } = require('console');
const Client = require('../models/client');


const getTotalTherapists = async (req, res) => {
  try {
    const therapists = await Therapist.find({}).populate('expertise group');

    const totalTherapists = therapists.length;

    res.json({ totalTherapists,therapists });
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
    const therapists = await Therapist.find({}).populate('expertise expriencelevel').exec();
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

    // Filter therapists with approved profiles
   // Filter therapists with all three fields present (expertise, experience level, meet link) and status is "approved"
   const approvedTherapists = populatedTherapists.filter(
    therapist => therapist.status === 'Approved'
  );


    return res.json({ totalTherapists: approvedTherapists.length, therapists: approvedTherapists });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve therapists', details: error.message });
  }
};


const getAllTherapistscorporate = async (req, res) => {
  try {
    const { groupid } = req.params;

    const therapists = await Therapist.find({})
      .populate('expertise expriencelevel')
      .exec();

    const populatedTherapists = await Promise.all(
      therapists.map(async therapist => {
        const populatedAvailability = await Promise.all(
          therapist.availability.map(async availability => {
            const category = await Category.findById(availability.location);
            if (!category) {
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

        const filteredAvailability = populatedAvailability.filter(availability => availability !== null);

        const therapistsGroupIds = therapist.group.map(clientId => clientId.toString()); // Convert ObjectId to string
        return {
          ...therapist.toObject(),
          availability: filteredAvailability,
          group: therapistsGroupIds // Now the group array contains extracted group ids
        };
      })
    );

    const approvedTherapists = populatedTherapists.filter(
      therapist => therapist.status === 'Approved'
    );

    if (groupid) {
      const therapistsInGroup = approvedTherapists.filter(
        therapist => therapist.groupDetails.some(groupDetails => groupDetails.groupid === groupid)
      );
      return res.json({ totalTherapists: therapistsInGroup.length, therapists: therapistsInGroup });
    }

    return res.json({ totalTherapists: approvedTherapists.length, therapists: approvedTherapists });

  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve therapists', details: error.message });
  }
};








  
  


const getTherapists = async (req, res) => {
  try {
    const assessmentId = req.params.assessmentId;

    // Find the assessment using the provided assessment ID
    const assessment = await Assessment.findById(assessmentId);
    if (!assessment) {
      return res.status(404).json({ error: 'Assessment not found' });
    }

    const assessmentScore = parseInt(req.params.assessmentScore);
    console.log('Assessment Score:', assessmentScore);
    const { low, medium, high } = assessment;

    let matchingAssessments = [];

    // Check if the assessmentScore falls within the low, medium, or high range
    if (assessmentScore >= low.min && assessmentScore <= low.max) {
      matchingAssessments = low.expertise;
    } else if (assessmentScore >= medium.min && assessmentScore <= medium.max) {
      matchingAssessments = medium.expertise;
    } else if (assessmentScore >= high.min && assessmentScore <= high.max) {
      matchingAssessments = high.expertise;
    }

    // Build the query object with the expertise filter
    const query = {
      expertise: { $in: matchingAssessments },
      status: 'Approved'
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
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to retrieve therapists' });
  }
};




const getTherapistscorporate = async (req, res) => {
  try {
    const assessmentScore = parseInt(req.params.assessmentScore); // Assuming the score is an integer
    console.log('Assessment Score:', assessmentScore);// Add this line to log the assessment score

    const groupid = req.params.groupid; // Assuming the groupid is passed as a query parameter
    const assessmentId = req.params.assessmentId;

    console.log('Group ID from URL:', groupid);

    const existingAssessment = await Assessment.findById(assessmentId);
    if (!existingAssessment) {
      return res.status(404).json({ error: 'Assessment not found' });
    }

    // Extract 'high', 'medium', and 'low' values from the assessment
    const { high, medium, low } = existingAssessment;

    let matchingExpertiseIds = [];

    // Check if the assessmentScore falls within the 'high', 'medium', or 'low' range
    if (assessmentScore >= low.min && assessmentScore <= low.max) {
      matchingExpertiseIds = low.expertise.map(expertise => expertise.toString());
    } else if (assessmentScore >= medium.min && assessmentScore <= medium.max) {
      matchingExpertiseIds = medium.expertise.map(expertise => expertise.toString());
    } else if (assessmentScore >= high.min && assessmentScore <= high.max) {
      matchingExpertiseIds = high.expertise.map(expertise => expertise.toString());
    }

    // Build the query object with the expertise filter
    const query = {
      expertise: { $in: matchingExpertiseIds },
      status: 'Approved'
    };

    // Fetch the therapists based on the determined query
    const therapists = await Therapist.find(query, {
      assessmentScoreRange: 0, // Exclude the assessmentScoreRange field
    }).populate('expertise'); // Include expertise details

    // Filter therapists by groupid if provided
    if (groupid) {
      const therapistsInGroup = therapists.filter(
        therapist => therapist.groupDetails.some(groupDetails => groupDetails.groupid === groupid)
      );
      return res.json({ totalTherapists: therapistsInGroup.length, therapists: therapistsInGroup });
    }

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
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to retrieve therapists' });
  }
};

  
  
  




const getTherapistById = async (req, res) => {
  const therapistId = req.params.id;

  try {
    const therapist = await Therapist.findById(therapistId).populate('expertise expriencelevel');

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
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve therapist', details: error.message });
  }
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
    const { name, email, mobile, availability, therapisttype } = req.body;
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
    const therapist = new Therapist({ name, email, mobile, availability,therapisttype, password: randomPassword });
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
    const { expriencelevel, group } = req.body;
  
    try {
      const therapist = await Therapist.findById(therapistId);
  
      if (!therapist) {
        return res.status(404).json({ error: 'Therapist not found' });
      }
  
      // Update expriencelevel and related fields
      if (expriencelevel) {
        therapist.expriencelevel = expriencelevel;
  
        const priceEntry = await Price.findById(expriencelevel);
  
        if (priceEntry) {
          therapist.level = priceEntry.level;
          therapist.sessionPrice = priceEntry.sessionPrice;
        }
      }
  
      // Update group and related fields
      if (group && Array.isArray(group)) {
        therapist.group = group; // Assign the group array with ObjectId references
  
        therapist.groupid = group.map(objId => objId.toString());
  
        const groupDetailsPromises = group.map(async groupId => {
          const client = await Client.findById(groupId);
          return client ? { _id: groupId, groupid: client.groupid } : null;
        });
  
        therapist.groupDetails = await Promise.all(groupDetailsPromises);
      }
  
      // Save the updated therapist
      const updatedTherapist = await therapist.save();
  
      res.status(200).json(updatedTherapist);
    } catch (error) {
      console.error('Error updating therapist details:', error);
      res.status(500).json({ error: 'An error occurred while updating therapist details' });
    }
  };
  








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
      // Calculate age from the date of birth
      const dob = new Date(dateOfBirth);
      const currentYear = new Date().getFullYear();
      const birthYear = dob.getFullYear();
      const age = currentYear - birthYear;
  
      const therapist = await Therapist.findByIdAndUpdate(
        therapistId,
        { name, dateOfBirth, gender, age }, // Update age field
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




const deleteAllTherapists = async (req, res) => {
  try {
    // Delete all therapists from the database
    await Therapist.deleteMany({});

    res.status(200).json({ message: 'All therapists deleted successfully' });
  } catch (error) {
    console.error('Error deleting therapists:', error);
    res.status(500).json({ error: 'An error occurred while deleting therapists' });
  }
};

// Controller to check and extend sessions


const approveTherapist = async (req, res) => {
  try {
    const therapistId = req.params.id;
    const therapist = await Therapist.findById(therapistId);

    if (!therapist) {
      return res.status(404).json({ message: 'Therapist not found' });
    }

    // Check if the therapist meets the approval conditions
    const isApproved = therapist.expertise.length > 0 &&
      therapist.expriencelevel.length > 0 &&
      therapist.group.length > 0 &&
      therapist.meetLink !== "";

    if (isApproved) {
      therapist.status = 'Approved';
      sendApprovalEmail(therapist);
    } else {
      therapist.status = 'Pending';
      sendDisapprovalEmail(therapist);
    }

    // Save the therapist to the database
    await therapist.save();

    // Assuming you want to return the updated therapist as the response
    const updatedTherapist = therapist.toObject();
    res.status(200).json(updatedTherapist);
  } catch (error) {
    console.error('Error approving therapist:', error);
    res.status(500).json({ error: 'An error occurred while approving therapist' });
  }
};

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
      <p>Add the required details in your profile</p>`,
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending approval email:', error);
    } else {
      console.log('Approval Email sent: ' + info.response);
    }
  });
};

const sendDisapprovalEmail = (therapist) => {
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
    subject: "Therapist Account Disapproved",
    html: `
      <p>Dear ${therapist.name}</p>
      <p>We regret to inform you that your therapist profile has been disapproved.</p>
      <p>Please review and update your profile to meet the approval criteria.</p>`,
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending disapproval email:', error);
    } else {
      console.log('Disapproval Email sent: ' + info.response);
    }
  });
};




module.exports = {
  getTotalTherapists,
  getTherapistDetails,
getAllTherapists,
getAllTherapistscorporate,
  getTherapists,
  getTherapistscorporate,
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
 
  deleteAllTherapists,
  
  approveTherapist,
};
