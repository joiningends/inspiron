// expertiseController.js

const Expertise = require('../models/expetise');

// Create a new expertise
exports.createExpertise = async (req, res) => {
  try {
    const expertise = await Expertise.create(req.body);
    res.status(201).json(expertise);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create expertise' });
  }
};

// Get all expertise
exports.getAllExpertise = async (req, res) => {
  try {
    const expertise = await Expertise.find();
    res.json(expertise);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch expertise' });
  }
};

// Get expertise by ID
exports.getExpertiseById = async (req, res) => {
  try {
    const expertise = await Expertise.findById(req.params.id);
    if (!expertise) {
      return res.status(404).json({ error: 'Expertise not found' });
    }
    res.json(expertise);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch expertise' });
  }
};

// Update expertise by ID
exports.updateExpertiseById = async (req, res) => {
  try {
    const expertise = await Expertise.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!expertise) {
      return res.status(404).json({ error: 'Expertise not found' });
    }
    res.json(expertise);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update expertise' });
  }
};

// Delete expertise by ID
exports.deleteExpertiseById = async (req, res) => {
  try {
    const expertise = await Expertise.findByIdAndDelete(req.params.id);
    if (!expertise) {
      return res.status(404).json({ error: 'Expertise not found' });
    }
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete expertise' });
  }
};
