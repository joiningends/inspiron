const Heading = require('../models/heading');



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


// POST /headings
;

// POST /headings
exports.createHeading = async (req, res) => {
  try {
    const { headings } = req.body;

    // Create a new Heading document
    const newHeading = new Heading({ headings });

    // Save the Heading document to the database
    const savedHeading = await newHeading.save();

    res.status(201).json(savedHeading);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create heading', message: error.message });
  }
};




exports.updateHeading = async (req, res) => {
  try {
    const { heading, options } = req.body;

    const updatedHeading = await Heading.findByIdAndUpdate(
      req.params.id,
      { heading, options },
      { new: true }
    );

    if (!updatedHeading) {
      return res.status(404).json({ error: 'Heading not found' });
    }

    res.json(updatedHeading);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update heading' });
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
