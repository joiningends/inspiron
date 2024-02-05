const express = require('express');
const router = express.Router();
const cognitiveFunctionsController = require('../controller/headingController');




router.get('/', cognitiveFunctionsController.getAllHeadings);

router.get('/:id', cognitiveFunctionsController.getHeading);
router.post('/', cognitiveFunctionsController.createHeading);
// PUT (update) a specific heading
router.put('/:id', cognitiveFunctionsController.updateHeading);

// DELETE a specific heading
router.delete('/:id',cognitiveFunctionsController.deleteHeading);
router.delete('/',cognitiveFunctionsController.deleteIllness);
module.exports = router;
