// controllers/experienceLevelController.js
const ExperienceLevel = require('../models/exprience');

const createExperienceLevel = async (req, res) => {
  try {
    const { level} = req.body;
    const newExperienceLevel = new ExperienceLevel({
      level,
      
    });
    await newExperienceLevel.save();
    res.status(201).json(newExperienceLevel);
  } catch (error) {
    res.status(500).json({ error: 'Could not create the ExperienceLevel' });
  }
};
const getExperienceLevels = async (req, res) => {
  try {
    const experienceLevels = await ExperienceLevel.find();
    res.json(experienceLevels);
  } catch (error) {
    res.status(500).json({ error: 'Could not retrieve ExperienceLevels' });
  }
};

const updateExperienceLevel = async (req, res) => {
  try {
    const { level } = req.body;
    const updatedExperienceLevel = await ExperienceLevel.findByIdAndUpdate(
      req.params.id,
      { level },
      { new: true }
    );
    if (!updatedExperienceLevel) {
      return res.status(404).json({ error: 'ExperienceLevel not found' });
    }
    res.json(updatedExperienceLevel);
  } catch (error) {
    res.status(500).json({ error: 'Could not update the ExperienceLevel' });
  }
};


const deleteExperienceLevel = async (req, res) => {
  try {
    const deletedExperienceLevel = await ExperienceLevel.findByIdAndDelete(req.params.id);
    if (!deletedExperienceLevel) {
      return res.status(404).json({ error: 'ExperienceLevel not found' });
    }
    res.json({ message: 'ExperienceLevel deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Could not delete the ExperienceLevel' });
  }
};



const getExperienceLevelById = async (req, res) => {
  try {
    const experienceLevelId = req.params.id;

    // Find the ExperienceLevel by its ID
    const experienceLevel = await ExperienceLevel.findById(experienceLevelId);

    if (!experienceLevel) {
      // If no ExperienceLevel is found with the provided ID
      return res.status(404).json({ error: 'ExperienceLevel not found' });
    }

    // If ExperienceLevel is found, respond with the data
    res.json(experienceLevel);
  } catch (error) {
    res.status(500).json({ error: 'Could not get the ExperienceLevel' });
  }
};





module.exports = { 
  createExperienceLevel,
  getExperienceLevels,
  updateExperienceLevel,
  deleteExperienceLevel,
  getExperienceLevelById

};
