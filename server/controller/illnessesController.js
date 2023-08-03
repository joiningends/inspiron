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
  const illnessId = req.params.id;
  const { name, options: newOptions, deleteOptions } = req.body;

  try {
    // Find the existing illness in the database
    const existingIllness = await Illness.findById(illnessId);

    if (!existingIllness) {
      return res.status(404).json({ error: 'Illness not found' });
    }

    // Update the name if it's provided in the request body
    if (name) {
      existingIllness.name = name;
    }

    // Merge the existing options with the new options
    const mergedOptions = newOptions ? [...existingIllness.options, ...newOptions] : existingIllness.options;

    // If deleteOptions is provided and it's an array, delete the corresponding options
    if (deleteOptions && Array.isArray(deleteOptions)) {
      existingIllness.options = existingIllness.options.filter(
        (option) => !deleteOptions.includes(option.text)
      );
    }

    // Update the illness with the new data (including the updated name and merged options)
    existingIllness.options = mergedOptions;

    // Save the updated illness
    const updatedIllness = await existingIllness.save();

    res.json(updatedIllness);
  } catch (error) {
    console.error('Error updating illness by ID:', error);
    res.status(500).json({ error: 'Internal Server Error' });
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
