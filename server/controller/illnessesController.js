const Illness = require('../models/illnesse');

// Create a new illness
exports.createIllness = async (req, res) => {
  try {
    const { headings } = req.body;
    const newIllness = new Illness({  headings });
    const savedIllness = await newIllness.save();
    res.status(201).json(savedIllness);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all illnesses
exports.getAllIllnesses = async (req, res) => {
  try {
    const illnesses = await Illness.find();
    res.json(illnesses);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get a specific illness by ID
exports.getIllnessById = async (req, res) => {
  try {
    const { id } = req.params;
    const illness = await Illness.findById(id);
    if (!illness) {
      return res.status(404).json({ error: 'Illness not found' });
    }
    res.json(illness);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update a specific illness by ID
exports.updateIllnessById = async (req, res) => {
  try {
    const { id } = req.params;
    const {  headings } = req.body;
    const updatedIllness = await Illness.findByIdAndUpdate(
      id,
      { headings },
      { new: true }
    );
    if (!updatedIllness) {
      return res.status(404).json({ error: 'Illness not found' });
    }
    res.json(updatedIllness);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a specific illness by ID
exports.deleteIllnessById = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedIllness = await Illness.findByIdAndRemove(id);
    if (!deletedIllness) {
      return res.status(404).json({ error: 'Illness not found' });
    }
    res.json({ message: 'Illness deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
