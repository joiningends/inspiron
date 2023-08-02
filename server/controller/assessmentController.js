const Assessment = require('../models/assessmentf');



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



// Create a new assessment with an image
const createAssessment = async (req, res) => {
  try {
    const {
      hostId,
      assessment_name,
      summary,
      slug,
      type,
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

    // Check if an image was uploaded
    let imageBuffer = null;
    if (req.file) {
      imageBuffer = req.file.buffer;
    }

    const newAssessment = new Assessment({
      hostId,
      assessment_name,
      summary,
      slug,
      type,
      image: { data: imageBuffer, contentType: req.file.mimetype }, // Save the image buffer and content type
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

    await newAssessment.save();

    console.log('Created Assessment:', newAssessment); // Log the created assessment

    res.status(201).json({ message: 'Assessment created successfully', assessment: newAssessment });
  } catch (error) {
    console.error('Error creating assessment:', error);
    res.status(500).json({ error: 'An error occurred while creating the assessment' });
  }
};




const updateAssessment = async (req, res) => {
  try {
    const assessmentId = req.params.id; // Assuming the assessment ID is provided in the request URL

    // Find the existing assessment by ID
    const existingAssessment = await Assessment.findById(assessmentId);

    // Check if the assessment exists
    if (!existingAssessment) {
      return res.status(404).json({ error: 'Assessment not found' });
    }

    // Update the assessment fields conditionally
    if (req.body.hostId) {
      existingAssessment.hostId = req.body.hostId;
    }

    if (req.body.assessment_name) {
      existingAssessment.assessment_name = req.body.assessment_name;
    }

    if (req.body.summary) {
      existingAssessment.summary = req.body.summary;
    }

    if (req.body.slug) {
      existingAssessment.slug = req.body.slug;
    }

    if (req.body.type) {
      existingAssessment.type = req.body.type;
    }

    // Check if an image was uploaded
    if (req.file) {
      existingAssessment.image.data = req.file.buffer;
      existingAssessment.image.contentType = req.file.mimetype;
    }

    if (req.body.assessmentScore) {
      existingAssessment.assessmentScore = req.body.assessmentScore;
    }

    if (req.body.published) {
      existingAssessment.published = req.body.published;
    }

    if (req.body.startsAt) {
      existingAssessment.startsAt = req.body.startsAt;
    }

    if (req.body.endsAt) {
      existingAssessment.endsAt = req.body.endsAt;
    }

    if (req.body.content) {
      existingAssessment.content = req.body.content;
    }

    if (req.body.questions) {
      existingAssessment.questions = req.body.questions;
    }

    if (req.body.low) {
      existingAssessment.low = req.body.low;
    }

    if (req.body.medium) {
      existingAssessment.medium = req.body.medium;
    }

    if (req.body.high) {
      existingAssessment.high = req.body.high;
    }

    // Save the updated assessment
    await existingAssessment.save();

    res.status(200).json({ message: 'Assessment updated successfully' });
  } catch (error) {
    console.error('Error updating assessment:', error);
    res.status(500).json({ error: 'An error occurred while updating the assessment' });
  }
};

 


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