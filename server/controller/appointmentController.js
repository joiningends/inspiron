const { Appointment } = require('../models/appointment');
const { User } = require('../models/user');

// Function to update the Sessionnumber for the user
const updateSessionNumber = async (userId, therapistId) => {
  const numberOfSessions = await Appointment.countDocuments({
    therapist: therapistId,
    user: userId,
  });
  await User.findByIdAndUpdate(userId, { Sessionnumber: numberOfSessions + 1 });
};

exports.createAppointment = async (req, res) => {
  const { therapistId, userId, dateTime, startTime, endTime, sessionMode } = req.body;

  try {
    const user = await User.findById(userId).select('name age gender');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if the requested time slot is already booked
    const existingAppointment = await Appointment.findOne({
      therapist: therapistId,
      dateTime,
      startTime: { $lte: endTime },
      endTime: { $gte: startTime },
    });

    if (existingAppointment) {
      return res.status(409).json({ error: 'The requested time slot is already booked' });
    }

    const newAppointment = new Appointment({
      therapist: therapistId,
      user: userId,
      dateTime,
      startTime,
      endTime,
      sessionMode,
    });

    // Save the appointment
    const savedAppointment = await newAppointment.save();

    // Update the user's Sessionnumber after saving the appointment
    await updateSessionNumber(userId, therapistId);

    // Now, fetch the populated user details and update the appointment object
    const populatedAppointment = await Appointment.findById(savedAppointment._id)
      .populate('user', 'name age gender')
      .exec();

    res.status(201).json(populatedAppointment);
  } catch (error) {
    console.error('Error creating appointment:', error);
    res.status(500).json({ error: 'An error occurred while creating the appointment' });
  }
};





exports.getAppointmentById = async (req, res) => {
  const appointmentId = req.params.id;

  try {
    const appointment = await Appointment.findById(appointmentId).populate('user', 'name age gender');

    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    res.status(200).json(appointment);
  } catch (error) {
    console.error('Error retrieving appointment:', error);
    res.status(500).json({ error: 'An error occurred while retrieving the appointment' });
  }
};





exports.getAppointmentsByTherapist = async (req, res) => {
    const therapistId = req.params.therapistId;
  
    try {
      const appointments = await Appointment.find({ therapist: therapistId }).populate('user', 'name age gender');
      res.status(200).json(appointments);
    } catch (error) {
      console.error('Error retrieving appointments:', error);
      res.status(500).json({ error: 'An error occurred while retrieving appointments' });
    }
  };
 
  

  
  




exports.getTodayAppointmentsByTherapist = async (req, res) => {
  const therapistId = req.params.therapistId;

  try {
    // Get the start and end of today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayAppointments = await Appointment.find({
      therapist: therapistId,
      dateTime: { $gte: today, $lt: tomorrow },
    }).populate('user', 'name age gender');

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

// Controller to get upcoming appointments for a therapist
exports.getUpcomingAppointmentsByTherapist = async (req, res) => {
  const therapistId = req.params.therapistId;

  try {
    // Get the current date (without the time component)
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // Set the time to 00:00:00.000

    // Fetch upcoming appointments (greater than or equal to the current date)
    const upcomingAppointments = await Appointment.find({
      therapist: therapistId,
      dateTime: { $gte: currentDate },
    }).populate('user', 'name age gender');

    // Fetch past appointments (less than the current date)
    const pastAppointments = await Appointment.find({
      therapist: therapistId,
      dateTime: { $lt: currentDate },
    }).populate('user', 'name age gender');

    res.status(200).json({
      upcomingAppointments,
      pastAppointments,
    });
  } catch (error) {
    console.error('Error retrieving upcoming appointments:', error);
    res.status(500).json({ error: 'An error occurred while retrieving upcoming appointments' });
  }
};

exports.getUpcomingAppointmentsByTherapist = async (req, res) => {
  const therapistId = req.params.therapistId;

  // Get the current date (without the time component)
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0); // Set the time to 00:00:00.000

  try {
    // Fetch upcoming appointments (greater than or equal to the current date)
    const upcomingAppointments = await Appointment.find({
      therapist: therapistId,
      dateTime: { $gte: currentDate },
    }).populate('user', 'name age gender');

    // Fetch past appointments (less than the current date)
    const pastAppointments = await Appointment.find({
      therapist: therapistId,
      dateTime: { $lt: currentDate },
    });

    const upcomingPatientsCount = upcomingAppointments.length;
    

    res.status(200).json({
      upcomingAppointments: upcomingAppointments,
      
      totalUpcomingPatients: upcomingPatientsCount,
      
    });
  } catch (error) {
    console.error('Error retrieving appointments:', error);
    res.status(500).json({ error: 'An error occurred while retrieving appointments' });
  }
};
exports.getAllAppointmentsByTherapist = async (req, res) => {
  const therapistId = req.params.therapistId;

  try {
    // Fetch all appointments
    const allAppointments = await Appointment.find({
      therapist: therapistId,
    }).populate('user', 'name age gender');

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
      const updatedAppointment = await Appointment.findByIdAndUpdate(appointmentId, updateData, { new: true }).populate('user', 'name age gender');
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
  
 

  exports.getAppointmentsByTherapistWithEndedMeetCall = async (req, res) => {
    try {
      const therapistId = cc
  
      // Update the appointment's googleMeetCallStatus to 'ended'
      const appointments = await Appointment.find({
        therapist: therapistId,
        googleMeetCallStatus: 'ended'
      }).populate('user', 'name age gender'); // Populate the 'user' field with 'name', 'age', and 'gender'
  
      if (appointments.length === 0) {
        return res.status(404).json({ error: 'No appointments found with ended Google Meet calls' });
      }
  
      res.status(200).json(appointments);
    } catch (error) {
      console.error('Failed to retrieve appointments with ended Google Meet calls:', error);
      res.status(500).json({ error: 'Failed to retrieve appointments with ended Google Meet calls' });
    }
  };
  exports.retrieveAppointments = (req, res) => {
    Appointment.find({}, 'userName userAge userGender dateTime')
    .exec((err, appointments) => {
      if (err) {
        console.error('Error retrieving appointments:', err);
        res.status(500).json({ error: 'An error occurred while retrieving appointments.' });
      } else {
        // Exclude the "user" field from each appointment
        const appointmentsWithoutUser = appointments.map(appointment => {
          const { user, ...appointmentWithoutUser } = appointment.toObject();
          return appointmentWithoutUser;
        });
        res.json(appointmentsWithoutUser);
      }
    });
};
exports.coin = (req, res) => {
const userId = req.params.UserId; 


const amountSpent = req.params.amountSpent; // Retrieve the amount spent dynamically

User.findByIdAndUpdate(userId, { $inc: { coins: -amountSpent } }, { new: true })
  .then(updatedUser => {
    // Create the appointment and associate it with the user
    const appointmentData = {
      user: userId,
      // Other appointment details
      ...appointmentDetails,
    };

    return Appointment.create(appointmentData);
  })
  .then(createdAppointment => {
    // Handle successful appointment creation
    console.log('Appointment created:', createdAppointment);
  })
  .catch(error => {
    // Handle errors
    console.error('Error creating appointment:', error);
  })
}
