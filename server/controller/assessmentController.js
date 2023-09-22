const Assessment = require('../models/assessmentf');
const puppeteer = require('puppeteer');


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
const createAssessment = async (req, res) => {
  try {
    

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

    

    const newAssessment = new Assessment({
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
    const assessmentId = req.params.id;
    const file = req.file;
    let imagePath;

    if (file) {
      const fileName = file.filename;
      const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
      imagePath = `${basePath}${fileName}`;
    } else {
      imagePath = req.body.image;
    }
 
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
     existingAssessment.image = imagePath;
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


async function getSeverityInfoByRouteScore(req, res) {
  try {
    const assessmentId = req.params.assessmentId;
    const userId = req.params.userId;
    const routeScore = parseInt(req.params.routeScore);

    // Find assessments that match the route score and have severity names
    const assessments = await Assessment.find({
      $or: [
        {
          'low.min': { $lte: routeScore },
          'low.max': { $gte: routeScore },
        },
        {
          'medium.min': { $lte: routeScore },
          'medium.max': { $gte: routeScore },
        },
        {
          'high.min': { $lte: routeScore },
          'high.max': { $gte: routeScore },
        },
      ],
    });

    const severityInfo = assessments.reduce((acc, assessment) => {
      if (assessment.low.min <= routeScore && routeScore <= assessment.low.max) {
        acc.push({ severityName: assessment.low.serverityname, score: routeScore });
      }
      if (assessment.medium.min <= routeScore && routeScore <= assessment.medium.max) {
        acc.push({ severityName: assessment.medium.serverityname, score: routeScore });
      }
      if (assessment.high.min <= routeScore && routeScore <= assessment.high.max) {
        acc.push({ severityName: assessment.high.serverityname, score: routeScore });
      }
      return acc;
    }, []);

    res.json({
      success: true,
      severityInfo,
      assessmentId: assessmentId,
      userId: userId,
    });
  } catch (error) {
    console.error('Error fetching severity information:', error);
    res.status(500).json({ success: false, message: 'Error fetching severity information' });
  }
}




async function generatePDF(req, res) {
  
  try {
    const { assessmentName } = req.params; // Assuming you pass the assessment name in the route
    const browser = await puppeteer.launch({ headless: 'new' });

    const page = await browser.newPage();

    await page.goto('https://www.youtube.com', {
      waitUntil: 'networkidle2'
    });
    await page.setViewport({ width: 1680, height: 1050 });
    const todayDate = new Date();
    const pdfFilename = `${assessmentName}-${todayDate.getTime()}.pdf`; // Set the PDF filename

    const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });

    await browser.close();

    // Set response headers to indicate that the response will be a PDF file attachment
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${pdfFilename}`);

    // Send the PDF buffer as a download
    res.end(pdfBuffer);
  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).send('Error generating PDF');
  }
}




 


module.exports = {
  getAllAssessments,
  getAssessmentById,
  createAssessment,
  
  updateAssessment,

  
    deleteAssessment,
    getSeverityInfoByRouteScore,
    generatePDF 
};