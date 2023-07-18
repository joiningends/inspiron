const Patient = require('../models/patient');

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
      cognitiveFunctions
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
      cognitiveFunctions
    });

    const savedPatient = await newPatient.save();

    res.status(201).json({ success: true, patient: savedPatient });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = { createPatient };
