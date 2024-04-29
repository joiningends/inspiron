const express = require("express");
const router = express.Router();
const assessmentController = require("../controller/assessmentController");

const multer = require("multer");
const multerS3 = require("multer-s3");
const aws = require("aws-sdk");

const FILE_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};

const MAX_FILE_SIZE = 5 * 1024 * 1024;

// Configure AWS SDK
aws.config.update({
  region: "ap-south-1",
});

const s3 = new aws.S3();

// Create an instance of multer and configure it
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: "inspirionimages",
    contentType: multerS3.AUTO_CONTENT_TYPE,

    key: function (req, file, cb) {
      const fileName = file.originalname.split(" ").join("-");
      cb(null, `${fileName}-${Date.now()}`);
    },
  }),
  limits: {
    fileSize: MAX_FILE_SIZE, // Set maximum file size
  },
});

console.log(upload);

router.get("/", assessmentController.getAllAssessments);

// GET a single assessment by ID
router.get("/:id", assessmentController.getAssessmentById);
// POST create a new assessment
router.post("/", upload.single("image"), assessmentController.createAssessment);

router.put(
  "/:id",
  upload.single("image"),
  assessmentController.updateAssessment
);

// DELETE delete an assessment
router.delete("/:id", assessmentController.deleteAssessment);
router.get(
  "/:assessmentId/:userId/:routeScore",
  assessmentController.getSeverityInfoByRouteScore
);
router.get("/:userId/:assessmentName", assessmentController.generatePDF);
module.exports = router;
