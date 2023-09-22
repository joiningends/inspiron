
const { EPrescription } = require('../models/eprescription');
const { User } = require('../models/user');
const { Therapist } = require('../models/therapist');

// controllers/ePrescriptionController.js

// POST request to create an ePrescription
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
          
            therapistname: therapist.name, // Assuming you have a name field in Therapist model
            username: user.name, // Assuming you have a name field in User model
         age:user.age,

         gender:user.gender,
         mobile:user.mobile,
          diagnosis: req.body.diagnosis,
          description: req.body.description,
          medicene: req.body.medicene,
          dose: req.body.dose,
          frequency: req.body.frequency,
          instruction: req.body.instruction,
          drugAllergies: req.body.drugAllergies,
          labTests: req.body.labTests,
        });
  
        // Save the ePrescription to the database
        await ePrescription.save();
  
        res.status(201).json(ePrescription);
      } else {
        res.status(403).json({ error: 'Only psychiatrists can create ePrescriptions.' });
      }
    } catch (error) {
      console.error('Error:', error);
      res.status(500).send('Internal server error.');
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
