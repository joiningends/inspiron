const {Assessment} =require('../models/assessmentf');
const express = require('express');
const router = express.Router();


// Get all assessments
router.get(`/`, async (req, res) =>{
  Assessment.find()
    .then((assessments) => {
      res.status(200).json(assessments);
    })
    .catch((error) => {
      res.status(500).json({ error: 'Failed to fetch assessments', details: error });
    });
});

// Get an assessment by ID
router.get(':id', (req, res) => {
  const assessmentId = req.params.id;

  Assessment.findById(assessmentId)
    .then((assessment) => {
      if (!assessment) {
        return res.status(404).json({ message: 'Assessment not found' });
      }
      res.status(200).json(assessment);
    })
    .catch((error) => {
      res.status(500).json({ error: 'Failed to fetch assessment', details: error });
    });
});



// Create an assessment
router.post('/', async (req, res) => {
let assessment = new Assessment({
    hostId: req.body.hostId,
    title: req.body.title,
      metaTitle: req.body.metaTitle,
      slug: req.body.slug,
      summary: req.body.summary,
      type:req.body.type,
      score: req.body.score,
      published:req.body.published,
      startsAt:req.body.startsAt,
     endsAt:req.body.endsAt,
     content:req.body.content
      
    
})
assessment = await assessment.save();

    if(!assessment)
    return res.status(400).send('the assessment cannot be created!')

    res.send(assessment);
})
// Update an assessment by ID
router.put('/:id',async (req, res)=> {
    const assessment = await Assessment.findByIdAndUpdate(
        req.params.id,
        {
     hostId: req.body.hostId,
    title: req.body.title,
      metaTitle: req.body.metaTitle,
      slug: req.body.slug,
      summary: req.body.summary,
      type:req.body.type,
      score: req.body.score,
      published:req.body.published,
      startsAt:req.body.startsAt,
     endsAt:req.body.endsAt,
     content:req.body.content
        },
        { new: true}
    )

    if(!Assessment)
    return res.status(400).send('the Assesment cannot be updated!')

    res.send(assessment);
})
// Delete an assessment by ID
router.delete('/:id', (req, res) => {
  const assessmentId = req.params.id;

  Assessment.findByIdAndRemove(assessmentId)
    .then((assessment) => {
      if (!assessment) {
        return res.status(404).json({ message: 'Assessment not found' });
      }
      res.status(200).json({ message: 'Assessment deleted successfully' });
    })
    .catch((error) => {
      res.status(500).json({ error: 'Failed to delete assessment', details: error });
    });
});

module.exports = router;
