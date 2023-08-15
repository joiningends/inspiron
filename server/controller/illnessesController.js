const Illness = require('../models/illnesse');

// Create a new illness
exports.createIllness = async (req, res) => {
  try {
    const { name, options } = req.body;
    const newIllness = new Illness({ name, options });
    const savedIllness = await newIllness.save();
    res.status(201).json(savedIllness);
  } catch (error) {
    console.error('Error creating illness:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};



exports.getAllIllnesses = async (req, res) => {
  try {
    const allIllnesses = await Illness.find();
    res.json(allIllnesses);
  } catch (error) {
    console.error('Error fetching illnesses:', error);
    res.status(500).json({ error: 'Internal Server Error' });
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
exports.updateIllnessById = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, options: newOptions,  deleteOptions } = req.body;

    const existingIllness = await Illness.findById(id);

    if (!existingIllness) {
      return res.status(404).json({ error: 'illness not found' });
    }

    let updatedOptions = existingIllness.options;

    if (newOptions && Array.isArray(newOptions)) {
      // If newOptions is provided and it's an array, update the options
      updatedOptions = [...existingIllness.options, ...newOptions];
    }

    if (deleteOptions && Array.isArray(deleteOptions)) {
      // If deleteOptions is provided and it's an array, delete the corresponding options
      updatedOptions = updatedOptions.filter(
        (option) => !deleteOptions.includes(option.text)
      );
    }


    // Update the heading with the new name and merged options
    const updatedIllness= await Illness.findByIdAndUpdate(
      id,
      { name, options: updatedOptions },
      { new: true }
    );

    res.json({ success: true, illness: updatedIllness });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
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
