

const { Appointment } = require('../models/appointment');
const { User } = require('../models/user');

// Create a new appointment
exports.createAppointment = async (req, res) => {
  const { therapistId, userId, dateTime, sessionMode, sessionDuration } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const newAppointment = new Appointment({
      therapist: therapistId,
      user: {
        name: user.name,
        gender: user.gender,
        age: user.age,
      },
      dateTime,
      session: {
        mode: sessionMode,
        duration: sessionDuration,
      },
    });

    const savedAppointment = await newAppointment.save();

    res.status(201).json(savedAppointment);
  } catch (error) {
    console.error('Error creating appointment:', error);
    res.status(500).json({ error: 'An error occurred while creating the appointment' });
  }
};
exports.getAppointmentsByTherapist = async (req, res) => {
    const therapistId = req.params.therapistId;
  
    try {
      const appointments = await Appointment.find({ therapist: therapistId });
      res.status(200).json(appointments);
    } catch (error) {
      console.error('Error retrieving appointments:', error);
      res.status(500).json({ error: 'An error occurred while retrieving appointments' });
    }
  };
 
  

  
  

// Get today's appointments by therapist
exports.getTodayAppointmentsByTherapist = async (req, res) => {
  const therapistId = req.params.therapistId;

  // Get the start and end of today
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  try {
    const todayAppointments = await Appointment.find({
      therapist: therapistId,
      dateTime: { $gte: today, $lt: tomorrow },
    });

    const todayPatientsCount = todayAppointments.length;

    res.status(200).json({
      appointments: todayAppointments,
      totalPatients: todayPatientsCount
    });
  } catch (error) {
    console.error('Error retrieving today\'s appointments:', error);
    res.status(500).json({ error: 'An error occurred while retrieving today\'s appointments' });
  }
};

exports.getUpcomingAppointmentsByTherapist = async (req, res) => {
  const therapistId = req.params.therapistId;

  // Get the current date and time
  const currentDate = new Date();

  try {
    const upcomingAppointments = await Appointment.find({
      therapist: therapistId,
      dateTime: { $gte: currentDate },
    });

    const upcomingPatientsCount = upcomingAppointments.length;

    res.status(200).json({
      appointments: upcomingAppointments,
      totalPatients: upcomingPatientsCount
    });
  } catch (error) {
    console.error('Error retrieving upcoming appointments:', error);
    res.status(500).json({ error: 'An error occurred while retrieving upcoming appointments' });
  }
};

// Get all appointments by therapist
exports.getAllAppointmentsByTherapist = async (req, res) => {
  const therapistId = req.params.therapistId;

  try {
    const allAppointments = await Appointment.find({
      therapist: therapistId,
    });

    const allPatientsCount = allAppointments.length;

    res.status(200).json({
      appointments: allAppointments,
      totalPatients: allPatientsCount
    });
  } catch (error) {
    console.error('Error retrieving all appointments:', error);
    res.status(500).json({ error: 'An error occurred while retrieving all appointments' });
  }
};


  // Update an appointment
  exports.updateAppointment = async (req, res) => {
    const appointmentId = req.params.appointmentId;
    const updateData = req.body;
  
    try {
      const updatedAppointment = await Appointment.findByIdAndUpdate(appointmentId, updateData, { new: true });
      res.status(200).json(updatedAppointment);
    } catch (error) {
      console.error('Error updating appointment:', error);
      res.status(500).json({ error: 'An error occurred while updating the appointment' });
    }
  };
  
  // Delete an appointment
  exports.deleteAppointment = async (req, res) => {
    const appointmentId = req.params.appointmentId;
  
    try {
      await Appointment.findByIdAndDelete(appointmentId);
      res.status(200).json({ message: 'Appointment deleted successfully' });
    } catch (error) {
      console.error('Error deleting appointment:', error);
      res.status(500).json({ error: 'An error occurred while deleting the appointment' });
    }
  };
  
  
  
 
  