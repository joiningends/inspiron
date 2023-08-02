const Heading = require('../models/heading');

const Patient = require('../models/patient');
const { Therapist } = require('../models/therapist');

exports.createPatient = async (req, res) => {
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
      information,
      religionEthnicity,
      dateOfBirth,
      languagesKnown,
      otherLanguage,
      foreignLanguage,
      maritalStatus,
      courtshipDuration,
      reference,
      
     
    } = req.body;

    const therapistId = req.params.id;
    const therapist = await Therapist.findById(therapistId);
    if (!therapist) {
      return res.status(404).json({ error: 'Therapist not found' });
    }

    // Fetch the onset details based on the provided Onsets array and populate them
    

    // Create the patient under the therapist
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
      information,
      religionEthnicity,
      dateOfBirth,
      languagesKnown,
      otherLanguage,
      foreignLanguage,
      maritalStatus,
      courtshipDuration,
      reference,
      
      
    });

    const savedPatient = await newPatient.save();

    
    res.status(201).json({ success: true, patient: savedPatient });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};







exports.updateOnsetHeading = async (req, res) => {
  try {
    // Get the patient ID from the request body
    const { patientId } = req.body;

    // Find the patient by ID and ensure it's associated with the therapist
    const patient = await Patient.findOne({ _id: patientId, therapist: req.params.id })
      .populate('onset')
      .populate('heading');

    if (!patient) {
      return res.status(404).json({ error: 'Patient not found or not associated with the therapist' });
    }

    // Fetch the updated onset and heading details from the request body
    const { onsetData, headingData } = req.body;

    // Update the onset data
    if (onsetData) {
      if (!patient.onsets) {
        // If the patient doesn't have an onset, create a new one and associate it with the patient
        const newOnset = new Onset(onsetData);
        await newOnset.save();
        patient.onsets = newOnset._id;
      } else {
        // If the patient has an onset, update its data
        Object.assign(patient.onsets, onsetData);
        await patient.onsets.save();
      }
    }

    // Update the heading data
    if (headingData) {
      if (!patient.heading) {
        // If the patient doesn't have a heading, create a new one and associate it with the patient
        const newHeading = new Heading(headingData);
        await newHeading.save();
        patient.heading = newHeading._id;
      } else {
        // If the patient has a heading, update its data
        Object.assign(patient.heading, headingData);
        await patient.heading.save();
      }
    }

    // Save the updated patient
    await patient.save();

    res.status(200).json({ success: true, patient });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
