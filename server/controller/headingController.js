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

// PUT route controller to update an existing heading
exports.updateHeading = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, options } = req.body;

    const updatedHeading = await Heading.findByIdAndUpdate(
      id,
      { name, options },
      { new: true }
    );

    if (!updatedHeading) {
      return res.status(404).json({ error: 'Heading not found' });
    }

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
