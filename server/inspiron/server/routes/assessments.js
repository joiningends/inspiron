const express = require('express');
const router = express.Router();
const  Assessment  = require('../models/assessmentf');

// GET all assessments
router.get('/', async (req, res) => {
  try {
    const assessments = await Assessment.find();
    res.json(assessments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve assessments' });
  }
});

// GET a specific assessment by ID
router.get('/:id', async (req, res) => {
  try {
    const assessment = await Assessment.findById(req.params.id);
    if (!assessment) {
      return res.status(404).json({ error: 'Assessment not found' });
    }
    res.json(assessment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve assessment' });
  }
});

// CREATE a new assessment
router.post('/', (req, res) => {
  const assessmentData = req.body;

  const assessment = new Assessment(assessmentData);

  assessment.save()
    .then(() => {
      res.status(201).json({ message: 'assessment created successfully' });
    })
    .catch((error) => {
      res.status(500).json({ error: 'Failed to create assessment', details: error });
    });
});

// UPDATE an existing assessment
router.put('/:id', async (req, res) => {
  try {
    const assessment = await Assessment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!assessment) {
      return res.status(404).json({ error: 'Assessment not found' });
    }
    res.json(assessment);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update assessment' });
  }
});

// DELETE an assessment
router.delete('/:id', async (req, res) => {
  try {
    const assessment = await Assessment.findByIdAndDelete(req.params.id);
    if (!assessment) {
      return res.status(404).json({ error: 'Assessment not found' });
    }
    res.json({ message: 'Assessment deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete assessment' });
  }
});

module.exports = router;
