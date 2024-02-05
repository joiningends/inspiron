const CaseSummary = require('../models/casesummery');

// Create a new case summary
exports.createCaseSummary = async (req, res) => {
  try {
    const { description } = req.body;
    const newCaseSummary = new CaseSummary({ description });
    const savedCaseSummary = await newCaseSummary.save();
    res.status(201).json(savedCaseSummary);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all case summaries
exports.getAllCaseSummaries = async (req, res) => {
  try {
    const caseSummaries = await CaseSummary.find();
    res.json(caseSummaries);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get a specific case summary by ID
exports.getCaseSummaryById = async (req, res) => {
  try {
    const { id } = req.params;
    const caseSummary = await CaseSummary.findById(id);
    if (!caseSummary) {
      return res.status(404).json({ error: 'Case summary not found' });
    }
    res.json(caseSummary);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update a specific case summary by ID
exports.updateCaseSummaryById = async (req, res) => {
  try {
    const { id } = req.params;
    const { description } = req.body;
    const updatedCaseSummary = await CaseSummary.findByIdAndUpdate(
      id,
      { description },
      { new: true }
    );
    if (!updatedCaseSummary) {
      return res.status(404).json({ error: 'Case summary not found' });
    }
    res.json(updatedCaseSummary);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a specific case summary by ID
exports.deleteCaseSummaryById = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCaseSummary = await CaseSummary.findByIdAndRemove(id);
    if (!deletedCaseSummary) {
      return res.status(404).json({ error: 'Case summary not found' });
    }
    res.json({ message: 'Case summary deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
