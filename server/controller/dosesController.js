const { Dose } = require('../models/doeses');

// Create a new dose
exports.createDose = async (req, res) => {
  try {
    const { name } = req.body;
    const dose = new Dose({ name });
    await dose.save();
    res.status(201).json(dose);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get all doses
exports.getAllDoses = async (req, res) => {
  try {
    const doses = await Dose.find();
    res.status(200).json(doses);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get a specific dose by ID
exports.getDoseById = async (req, res) => {
  try {
    const { id } = req.params;
    const dose = await Dose.findById(id);
    if (!dose) {
      return res.status(404).json({ error: 'Dose not found' });
    }
    res.status(200).json(dose);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update a specific dose by ID
exports.updateDose = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const updatedDose = await Dose.findByIdAndUpdate(id, { name }, { new: true });
    if (!updatedDose) {
      return res.status(404).json({ error: 'Dose not found' });
    }
    res.status(200).json(updatedDose);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete a specific dose by ID
exports.deleteDose = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedDose = await Dose.findByIdAndRemove(id);
    if (!deletedDose) {
      return res.status(404).json({ error: 'Dose not found' });
    }
    res.status(204).send(); // No content on success
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
