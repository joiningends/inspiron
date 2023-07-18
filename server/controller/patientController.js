const Heading = require('../models/heading');
const Onset = require('../models/onset');

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
      therapists,
      onsets,
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
      therapists,
      onsets,
    });

    const savedPatient = await newPatient.save();

    // Add the patient to the therapist's patient list
    therapist.patients.push(savedPatient._id);
    await therapist.save();

    res.status(201).json({ success: true, patient: savedPatient });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
