// controllers/mediceneController.js
const { Medicene } = require('../models/medicenes');
const xlsx = require('xlsx');

exports.createMedicene = async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).send('No file uploaded.');
    }

    // Process the uploaded Excel file
    const excelData = xlsx.readFile(file.path); // Use file.path to access the uploaded file
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

    // Find existing Medicine names in the database
    const existingMedicineNames = await Medicene.distinct('name');

    // Filter out the names that are not already in the database
    const newMedicineNames = extractedData
      .map(item => item.name)
      .filter(name => !existingMedicineNames.includes(name));

    if (newMedicineNames.length === 0) {
      // If no new data is found, respond accordingly
      return res.status(200).send('No new data found.');
    }

    // Create Medicine instances for new data and save them to the database
    const savedMedicines = await Medicene.insertMany(newMedicineNames.map(name => ({ name })));

    res.status(201).json(savedMedicines);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal server error.');
  }
};

  

exports.getMediceneById = async (req, res) => {
  try {
    const { id } = req.params;
    const medicene = await Medicene.findById(id);

    if (!medicene) {
      return res.status(404).json({ message: 'Medicene not found' });
    }

    res.status(200).json(medicene);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal server error.');
  }
};

// PUT (Update) Medicene by ID
exports.updateMediceneById = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const updatedMedicene = await Medicene.findByIdAndUpdate(
      id,
      { name },
      { new: true }
    );

    if (!updatedMedicene) {
      return res.status(404).json({ message: 'Medicene not found' });
    }

    res.status(200).json(updatedMedicene);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal server error.');
  }
};

// DELETE Medicene by ID
exports.deleteMediceneById = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedMedicene = await Medicene.findByIdAndRemove(id);

    if (!deletedMedicene) {
      return res.status(404).json({ message: 'Medicene not found' });
    }

    res.status(200).json({ message: 'Medicene deleted successfully' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal server error.');
  }
};
exports.getAllMedicenes = async (req, res) => {
    try {
      const medicenes = await Medicene.find();
      res.status(200).json(medicenes);
    } catch (error) {
      console.error('Error:', error);
      res.status(500).send('Internal server error.');
    }
  };