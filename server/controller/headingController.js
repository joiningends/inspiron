const Heading = require('../models/heading');

const Patient = require('../models/patient');
const { Therapist } = require('../models/therapist');



exports.getAllHeadings = async (req, res) => {
    try {
      const headings = await Heading.find();
      res.json(headings);
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve headings' });
    }
  };

exports.getHeading = async (req, res) => {
  try {
    const heading = await Heading.findById(req.params.id);
    if (!heading) {
      return res.status(404).json({ error: 'Heading not found' });
    }
    res.json(heading);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve heading' });
  }
};





exports.createHeading = async (req, res) => {
  try {
    const { name, options } = req.body;
    const heading = new Heading({ name, options });
    await heading.save();

    res.status(201).json(heading);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create heading' });
  }
};

exports.updateHeading = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, options: newOptions,  deleteOptions } = req.body;

    const existingHeading = await Heading.findById(id);

    if (!existingHeading) {
      return res.status(404).json({ error: 'Heading not found' });
    }

    let updatedOptions = existingHeading.options;

    if (newOptions && Array.isArray(newOptions)) {
      // If newOptions is provided and it's an array, update the options
      updatedOptions = [...existingHeading.options, ...newOptions];
    }

    if (deleteOptions && Array.isArray(deleteOptions)) {
      // If deleteOptions is provided and it's an array, delete the corresponding options
      updatedOptions = updatedOptions.filter(
        (option) => !deleteOptions.includes(option.text)
      );
    }


    // Update the heading with the new name and merged options
    const updatedHeading = await Heading.findByIdAndUpdate(
      id,
      { name, options: updatedOptions },
      { new: true }
    );

    res.json({ success: true, heading: updatedHeading });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};





exports.deleteHeading = async (req, res) => {
  try {
    const deletedHeading = await Heading.findByIdAndRemove(req.params.id);

    if (!deletedHeading) {
      return res.status(404).json({ error: 'Heading not found' });
    }

    res.json({ message: 'Heading deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete heading' });
  }
};
exports.deleteIllness = async (req, res) => {
  try {
    await Heading.deleteMany({});
    console.log('All illness records have been deleted.');
  } catch (err) {
    console.error('Error deleting illness records:', err);
  } 
}