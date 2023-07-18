const Onset = require('../models/onset');

// Create a new onset
const createOnset = async (req, res) => {
  try {
    const onset = new Onset(req.body);
    const savedOnset = await onset.save();
    res.status(201).json(savedOnset);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create onset' });
  }
};

// Get all onsets
const getAllOnsets = async (req, res) => {
  try {
    const onsets = await Onset.find();
    res.json(onsets);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve onsets' });
  }
};

// Get a specific onset by ID
const getOnsetById = async (req, res) => {
  try {
    const onset = await Onset.findById(req.params.id);
    if (!onset) {
      return res.status(404).json({ error: 'Onset not found' });
    }
    res.json(onset);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve onset' });
  }
};

// Update an existing onset
const updateOnset = async (req, res) => {
  try {
    const updatedOnset = await Onset.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedOnset) {
      return res.status(404).json({ error: 'Onset not found' });
    }
    res.json(updatedOnset);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update onset' });
  }
};

// Delete an onset
const deleteOnset = async (req, res) => {
  try {
    const deletedOnset = await Onset.findByIdAndRemove(req.params.id);
    if (!deletedOnset) {
      return res.status(404).json({ error: 'Onset not found' });
    }
    res.json({ message: 'Onset deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete onset' });
  }
};

module.exports = {
  createOnset,
  getAllOnsets,
  getOnsetById,
  updateOnset,
  deleteOnset,
};
