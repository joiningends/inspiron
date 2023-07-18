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

// CREATE a new assessment
const createAssessment = async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).send('No image in the request');
    }

    const fileName = file.filename;
    const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
    const imagePath = `${basePath}${fileName}`;

    const assessmentData = {
      hostId: req.body.hostId,
      assessment_name: req.body.assessment_name,
      summary: req.body.summary,
      slug: req.body.slug,
      type: req.body.type,
      image: imagePath,
      images: req.body.images,
      assessmentScore: req.body.assessmentScore,
      published: req.body.published,
      startsAt: req.body.startsAt,
      endsAt: req.body.endsAt,
      content: req.body.content,
      questions: req.body.questions,
      low: req.body.low,
      medium: req.body.medium,
      high: req.body.high,
    };

    const assessment = new Assessment(assessmentData);
    const savedAssessment = await assessment.save();

    res.status(201).json({ message: 'Assessment created successfully', assessment: savedAssessment });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create assessment', details: error });
  }
};


// UPDATE an existing assessment
async function updateAssessment(req, res) {
  try {
    const file = req.file;
    let imagePath;

    if (file) {
      const fileName = file.filename;
      const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
      imagePath = `${basePath}${fileName}`;
    } else {
      imagePath = req.body.image;
    }

    const assessment = await Assessment.findByIdAndUpdate(
      req.params.id,
      { ...req.body, image: imagePath },
      { new: true }
    );

    if (!assessment) {
      return res.status(404).json({ error: 'Assessment not found' });
    }
    res.json(assessment);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update assessment' });
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

// GET /assessment-report
async function getAssessmentReport(req, res) {
  try {
    let assessmentScore;
    let assessmentName;
    let assessmentDescription;

    if (req.user) {
      // User is logged in, retrieve the score from the database
      const userId = req.user.id; // Assuming you have implemented authentication and have access to the user ID
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      assessmentScore = user.assessmentScore;
      assessmentName = user.assessmentName;
      assessmentDescription = user.assessmentDescription;
    } else {
      // User is not logged in, retrieve the score from the request body or query parameters
      assessmentScore = req.body.assessmentScore || req.query.assessmentScore;
      assessmentName = req.body.assessmentName || req.query.assessmentName;
      assessmentDescription = req.body.assessmentDescription || req.query.assessmentDescription;
    }

    let report = '';

    if (assessmentScore >= 1 && assessmentScore <= 10) {
      report = `Assessment Name: ${assessmentName}\nScore: ${assessmentScore}\nDescription: ${assessmentDescription}\nReport for score range 1-10`;
      // Generate report for score range 1-10
    } else if (assessmentScore > 10 && assessmentScore <= 20) {
      report = `Assessment Name: ${assessmentName}\nScore: ${assessmentScore}\nDescription: ${assessmentDescription}\nReport for score range 10-20`;
      // Generate report for score range 10-20
    } else if (assessmentScore > 20 && assessmentScore <= 30) {
      report = `Assessment Name: ${assessmentName}\nScore: ${assessmentScore}\nDescription: ${assessmentDescription}\nReport for score range 20-30`;
      // Generate report for score range 20-30
    } else if (assessmentScore > 30 && assessmentScore <= 40) {
      report = `Assessment Name: ${assessmentName}\nScore: ${assessmentScore}\nDescription: ${assessmentDescription}\nReport for score range 30-40`;
      // Generate report for score range 30-40
    } else {
      report = 'Invalid assessment score';
    }

    res.json({ report });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve assessment report' });
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