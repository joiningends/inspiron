const Assessment = require('../models/assessmentf');
const multer = require('multer');


// GET all assessments
async function getAllAssessments(req, res) {
  try {
    const assessments = await Assessment.find();
    res.json(assessments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve assessments' });
  }
}

// GET a specific assessment by ID
async function getAssessmentById(req, res) {
  try {
    const assessment = await Assessment.findById(req.params.id);
    if (!assessment) {
      return res.status(404).json({ error: 'Assessment not found' });
    }
    res.json(assessment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve assessment' });
  }
}

// Route to create an assessment
const createAssessment = async (req, res) => {
  try {
    // Get assessment data from the request body
    const {
      hostId,
      assessment_name,
      summary,
      slug,
      type,
      image,
      assessmentScore,
      published,
      startsAt,
      endsAt,
      content,
      questions,
      low,
      medium,
      high,
      /* other fields */
    } = req.body;

    // Create a new assessment with the provided data
    const newAssessment = new Assessment({
      hostId,
      assessment_name,
      summary,
      slug,
      type,
      image: image, // Save the base64 image data to the 'image' field
      assessmentScore,
      published,
      startsAt,
      endsAt,
      content,
      questions,
      low,
      medium,
      high,
      /* other fields */
    });

    // Save the assessment to the database
    await newAssessment.save();

    res.status(201).json({ message: 'Assessment created successfully' });
  } catch (error) {
    console.error('Error creating assessment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};





async function updateAssessment(req, res) {
  try {
    // Get the updated assessment data from the request body
    const {
      hostId,
      assessment_name,
      summary,
      slug,
      type,
      image, // The updated image data is base64-encoded here
      assessmentScore,
      published,
      startsAt,
      endsAt,
      content,
      questions,
      low,
      medium,
      high,
      /* other fields */
    } = req.body;

    // Find the assessment by ID and update it with the provided data
    const updatedAssessment = await Assessment.findByIdAndUpdate(
      req.params.id,
      {
        hostId,
        assessment_name,
        summary,
        slug,
        type,
        image, // Save the updated base64 image data to the 'image' field
        assessmentScore,
        published,
        startsAt,
        endsAt,
        content,
        questions,
        low,
        medium,
        high,
        /* other fields */
      },
      { new: true }
    );

    if (!updatedAssessment) {
      return res.status(404).json({ error: 'Assessment not found' });
    }

    res.json(updatedAssessment);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update assessment', details: error });
  }
}



// DELETE an assessment
async function deleteAssessment(req, res) {
  try {
    const assessment = await Assessment.findByIdAndDelete(req.params.id);
    if (!assessment) {
      return res.status(404).json({ error: 'Assessment not found' });
    }
    res.json({ message: 'Assessment deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete assessment' });
  }
}

// POST /generate-report
async function generateReport(req, res) {
  try {
    let assessmentScore;

    if (req.user) {
      // User is logged in, retrieve the score from the database
      const userId = req.user.id; // Assuming you have implemented authentication and have access to the user ID
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      assessmentScore = user.assessmentScore;
    } else {
      // User is not logged in, retrieve the score from the request body or query parameters
      assessmentScore = req.body.assessmentScore || req.query.assessmentScore;
    }

    // Generate the report based on the assessment score
    const report = generateReportText(assessmentScore);

    res.status(200).json({ report });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate report' });
  }
}



module.exports = {
  getAllAssessments,
  getAssessmentById,
  createAssessment,
  updateAssessment,
  deleteAssessment,
  //generateReport,
  //getAssessmentReport
};