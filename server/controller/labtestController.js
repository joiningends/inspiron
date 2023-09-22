const { LabTest } = require('../models/labtest');
const xlsx = require('xlsx');

exports.createlabtest = async (req, res) => {
    try {
      const file = req.file;
      if (!file) {
        return res.status(400).send('No file uploaded.');
      }
  
      // Process the uploaded Excel file
      const excelData = xlsx.readFile(req.file.path);
      const sheet = excelData.Sheets[excelData.SheetNames[0]];
  
      // Initialize an array to store the extracted data
      const extractedData = [];
  
      // Loop through the sheet and extract data
      for (let rowNum = 2; ; rowNum++) {
        const cell = sheet[`A${rowNum}`];
        if (!cell || !cell.v) {
          // If the cell is empty, we assume there's no more data
          break;
        }
  
        // Extract the medicine name and add it to the array
        extractedData.push({
          name: cell.v,
        });
      }
  
      // Check if any of the extracted names already exist in the database
      const existingLabTests = await LabTest.find({ name: { $in: extractedData.map(item => item.name) } });
  
      // Filter out the extracted data that is not already in the database
      const newLabTests = extractedData.filter(item => !existingLabTests.some(existing => existing.name === item.name));
  
      if (newLabTests.length === 0) {
        // If no new data is found, respond accordingly
        return res.status(200).send('No new data found.');
      }
  
      // Create LabTest instances for new data and save them to the database
      const savedLabtest = await LabTest.insertMany(newLabTests);
  
      res.status(201).json(savedLabtest);
    } catch (error) {
      console.error('Error:', error);
      res.status(500).send('Internal server error.');
    }
  };
  

// Get all LabTests
exports.getAllLabTests = async (req, res) => {
  try {
    const labTests = await LabTest.find();
    res.json(labTests);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get a LabTest by ID
exports.getLabTestById = async (req, res) => {
  try {
    const labTest = await LabTest.findById(req.params.id);
    if (!labTest) {
      return res.status(404).json({ error: 'LabTest not found' });
    }
    res.json(labTest);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update a LabTest by ID
exports.updateLabTestById = async (req, res) => {
  try {
    const updatedLabTest = await LabTest.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedLabTest) {
      return res.status(404).json({ error: 'LabTest not found' });
    }
    res.json(updatedLabTest);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete a LabTest by ID
exports.deleteLabTestById = async (req, res) => {
  try {
    const deletedLabTest = await LabTest.findByIdAndRemove(req.params.id);
    if (!deletedLabTest) {
      return res.status(404).json({ error: 'LabTest not found' });
    }
    res.json({ message: 'LabTest deleted successfully' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
