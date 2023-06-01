const express = require('express');
const router = express.Router();
const { Therapist } = require('../models/therapist');

// Get all therapists
router.get(`/`, async (req, res) =>{
    Therapist.find()
      .then((therapists) => {
        res.status(200).json(therapists);
      })
      .catch((error) => {
        res.status(500).json({ error: 'Failed to retrieve therapists', details: error });
      });
  });
  
  // Get a specific therapist by ID
  router.get('/:id', (req, res) => {
    const therapistId = req.params.id;
  
    Therapist.findById(therapistId)
      .then((therapist) => {
        if (!therapist) {
          return res.status(404).json({ message: 'Therapist not found' });
        }
        res.status(200).json(therapist);
      })
      .catch((error) => {
        res.status(500).json({ error: 'Failed to retrieve therapist', details: error });
      });
  });
  
 

// Create a therapist
router.post('/', (req, res) => {
  const therapistData = req.body;

  const therapist = new Therapist(therapistData);

  therapist.save()
    .then(() => {
      res.status(201).json({ message: 'Therapist created successfully' });
    })
    .catch((error) => {
      res.status(500).json({ error: 'Failed to create therapist', details: error });
    });
});


// Update a therapist by ID
router.put('/:id', (req, res) => {
  const therapistId = req.params.id;
  const updatedData = req.body;

  Therapist.findByIdAndUpdate(therapistId, updatedData, { new: true })
    .then((therapist) => {
      if (!therapist) {
        return res.status(404).json({ message: 'Therapist not found' });
      }
      res.status(200).json({ message: 'Therapist updated successfully', therapist });
    })
    .catch((error) => {
      res.status(500).json({ error: 'Failed to update therapist', details: error });
    });
});

// Delete a therapist by ID
router.delete('/:id', (req, res) => {
  const therapistId = req.params.id;

  Therapist.findByIdAndRemove(therapistId)
    .then((therapist) => {
      if (!therapist) {
        return res.status(404).json({ message: 'Therapist not found' });
      }
      res.status(200).json({ message: 'Therapist deleted successfully' });
    })
    .catch((error) => {
      res.status(500).json({ error: 'Failed to delete therapist', details: error });
    });
});





module.exports = router;
