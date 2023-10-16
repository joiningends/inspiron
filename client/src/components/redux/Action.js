import axios from "axios";

const API_URL = `${process.env.REACT_APP_SERVER_URL}`;

// Fetch therapists
const FETCH_THERAPISTS_REQUEST = "FETCH_THERAPISTS_REQUEST";
const FETCH_THERAPISTS_SUCCESS = "FETCH_THERAPISTS_SUCCESS";
const FETCH_THERAPISTS_FAILURE = "FETCH_THERAPISTS_FAILURE";

const fetchTherapistsRequest = () => ({
  type: FETCH_THERAPISTS_REQUEST,
});

const fetchTherapistsSuccess = (therapists) => ({
  type: FETCH_THERAPISTS_SUCCESS,
  payload: therapists,
});

const fetchTherapistsFailure = (error) => ({
  type: FETCH_THERAPISTS_FAILURE,
  payload: error,
});

const fetchTherapists = () => {
  return (dispatch) => {
    dispatch(fetchTherapistsRequest());
    axios
      .get(`${API_URL}/therapists/all`)
      .then((response) => {
        dispatch(fetchTherapistsSuccess(response.data));
      })
      .catch((error) => {
        dispatch(fetchTherapistsFailure(error.message));
      });
  };
};

// Fetch therapist
const FETCH_THERAPIST_REQUEST = "FETCH_THERAPIST_REQUEST";
const FETCH_THERAPIST_SUCCESS = "FETCH_THERAPIST_SUCCESS";
const FETCH_THERAPIST_FAILURE = "FETCH_THERAPIST_FAILURE";

const fetchTherapistRequest = () => ({
  type: FETCH_THERAPIST_REQUEST,
});

const fetchTherapistSuccess = (therapist) => ({
  type: FETCH_THERAPIST_SUCCESS,
  payload: therapist,
});

const fetchTherapistFailure = (error) => ({
  type: FETCH_THERAPIST_FAILURE,
  payload: error,
});

const fetchTherapist = (id) => {
  return (dispatch) => {
    dispatch(fetchTherapistRequest());
    axios
      .get(`${API_URL}/therapists/${id}`)
      .then((response) => {
        dispatch(fetchTherapistSuccess(response.data));
      })
      .catch((error) => {
        dispatch(fetchTherapistFailure(error.message));
      });
  };
};

// Create therapist
const CREATE_THERAPIST_REQUEST = "CREATE_THERAPIST_REQUEST";
const CREATE_THERAPIST_SUCCESS = "CREATE_THERAPIST_SUCCESS";
const CREATE_THERAPIST_FAILURE = "CREATE_THERAPIST_FAILURE";

const createTherapistRequest = () => ({
  type: CREATE_THERAPIST_REQUEST,
});

const createTherapistSuccess = () => ({
  type: CREATE_THERAPIST_SUCCESS,
});

const createTherapistFailure = (error) => ({
  type: CREATE_THERAPIST_FAILURE,
  payload: error,
});

const createTherapist = (therapistData) => {
  return (dispatch) => {
    dispatch(createTherapistRequest());
    axios
      .post(`${API_URL}/therapists`, therapistData)
      .then(() => {
        dispatch(createTherapistSuccess());
      })
      .catch((error) => {
        dispatch(createTherapistFailure(error.message));
      });
  };
};

// Fetch assessments
const FETCH_ASSESSMENTS_REQUEST = "FETCH_ASSESSMENTS_REQUEST";
const FETCH_ASSESSMENTS_SUCCESS = "FETCH_ASSESSMENTS_SUCCESS";
const FETCH_ASSESSMENTS_FAILURE = "FETCH_ASSESSMENTS_FAILURE";

const fetchAssessmentsRequest = () => ({
  type: FETCH_ASSESSMENTS_REQUEST,
});

const fetchAssessmentsSuccess = (assessments) => ({
  type: FETCH_ASSESSMENTS_SUCCESS,
  payload: assessments,
});

const fetchAssessmentsFailure = (error) => ({
  type: FETCH_ASSESSMENTS_FAILURE,
  payload: error,
});

const fetchAssessments = (therapistId) => {
  return (dispatch) => {
    dispatch(fetchAssessmentsRequest());
    axios
      .get(`${API_URL}/assessments?therapistId=${therapistId}`)
      .then((response) => {
        dispatch(fetchAssessmentsSuccess(response.data));
      })
      .catch((error) => {
        dispatch(fetchAssessmentsFailure(error.message));
      });
  };
};

// Fetch assessment
const FETCH_ASSESSMENT_REQUEST = "FETCH_ASSESSMENT_REQUEST";
const FETCH_ASSESSMENT_SUCCESS = "FETCH_ASSESSMENT_SUCCESS";
const FETCH_ASSESSMENT_FAILURE = "FETCH_ASSESSMENT_FAILURE";

const fetchAssessmentRequest = () => ({
  type: FETCH_ASSESSMENT_REQUEST,
});

const fetchAssessmentSuccess = (assessment) => ({
  type: FETCH_ASSESSMENT_SUCCESS,
  payload: assessment,
});

const fetchAssessmentFailure = (error) => ({
  type: FETCH_ASSESSMENT_FAILURE,
  payload: error,
});

const fetchAssessment = (assessmentId) => {
  return (dispatch) => {
    dispatch(fetchAssessmentRequest());
    axios
      .get(`${API_URL}/assessments/${assessmentId}`)
      .then((response) => {
        dispatch(fetchAssessmentSuccess(response.data));
      })
      .catch((error) => {
        dispatch(fetchAssessmentFailure(error.message));
      });
  };
};

// Create assessment
const CREATE_ASSESSMENT_REQUEST = "CREATE_ASSESSMENT_REQUEST";
const CREATE_ASSESSMENT_SUCCESS = "CREATE_ASSESSMENT_SUCCESS";
const CREATE_ASSESSMENT_FAILURE = "CREATE_ASSESSMENT_FAILURE";

const createAssessmentRequest = () => ({
  type: CREATE_ASSESSMENT_REQUEST,
});

const createAssessmentSuccess = () => ({
  type: CREATE_ASSESSMENT_SUCCESS,
});

const createAssessmentFailure = (error) => ({
  type: CREATE_ASSESSMENT_FAILURE,
  payload: error,
});

const createAssessment = (assessmentData) => {
  return (dispatch) => {
    dispatch(createAssessmentRequest());
    axios
      .post(`${API_URL}/assessments`, assessmentData)
      .then(() => {
        dispatch(createAssessmentSuccess());
      })
      .catch((error) => {
        dispatch(createAssessmentFailure(error.message));
      });
  };
};

// Fetch users
const FETCH_USERS_REQUEST = "FETCH_USERS_REQUEST";
const FETCH_USERS_SUCCESS = "FETCH_USERS_SUCCESS";
const FETCH_USERS_FAILURE = "FETCH_USERS_FAILURE";

const fetchUsersRequest = () => ({
  type: FETCH_USERS_REQUEST,
});

const fetchUsersSuccess = (users) => ({
  type: FETCH_USERS_SUCCESS,
  payload: users,
});

const fetchUsersFailure = (error) => ({
  type: FETCH_USERS_FAILURE,
  payload: error,
});

const fetchUsers = () => {
  return (dispatch) => {
    dispatch(fetchUsersRequest());
    axios
      .get(`${API_URL}/users`)
      .then((response) => {
        dispatch(fetchUsersSuccess(response.data));
      })
      .catch((error) => {
        dispatch(fetchUsersFailure(error.message));
      });
  };
};

// Fetch user
const FETCH_USER_REQUEST = "FETCH_USER_REQUEST";
const FETCH_USER_SUCCESS = "FETCH_USER_SUCCESS";
const FETCH_USER_FAILURE = "FETCH_USER_FAILURE";

const fetchUserRequest = () => ({
  type: FETCH_USER_REQUEST,
});

const fetchUserSuccess = (user) => ({
  type: FETCH_USER_SUCCESS,
  payload: user,
});

const fetchUserFailure = (error) => ({
  type: FETCH_USER_FAILURE,
  payload: error,
});

const fetchUser = (id) => {
  return (dispatch) => {
    dispatch(fetchUserRequest());
    axios
      .get(`${API_URL}/users/${id}`)
      .then((response) => {
        dispatch(fetchUserSuccess(response.data));
      })
      .catch((error) => {
        dispatch(fetchUserFailure(error.message));
      });
  };
};

// Create user
const CREATE_USER_REQUEST = "CREATE_USER_REQUEST";
const CREATE_USER_SUCCESS = "CREATE_USER_SUCCESS";
const CREATE_USER_FAILURE = "CREATE_USER_FAILURE";

const createUserRequest = () => ({
  type: CREATE_USER_REQUEST,
});

const createUserSuccess = () => ({
  type: CREATE_USER_SUCCESS,
});

const createUserFailure = (error) => ({
  type: CREATE_USER_FAILURE,
  payload: error,
});

const createUser = (userData) => {
  return (dispatch) => {
    dispatch(createUserRequest());
    axios
      .post(`${API_URL}/users/register`, userData)
      .then(() => {
        dispatch(createUserSuccess());
      })
      .catch((error) => {
        dispatch(createUserFailure(error.message));
      });
  };
};

// Update user
const UPDATE_USER_REQUEST = "UPDATE_USER_REQUEST";
const UPDATE_USER_SUCCESS = "UPDATE_USER_SUCCESS";
const UPDATE_USER_FAILURE = "UPDATE_USER_FAILURE";

const updateUserRequest = () => ({
  type: UPDATE_USER_REQUEST,
});

const updateUserSuccess = () => ({
  type: UPDATE_USER_SUCCESS,
});

const updateUserFailure = (error) => ({
  type: UPDATE_USER_FAILURE,
  payload: error,
});

const updateUser = (id, userData) => {
  return (dispatch) => {
    dispatch(updateUserRequest());
    axios
      .put(`${API_URL}/users/${id}`, userData)
      .then(() => {
        dispatch(updateUserSuccess());
      })
      .catch((error) => {
        dispatch(updateUserFailure(error.message));
      });
  };
};

// Delete user
const DELETE_USER_REQUEST = "DELETE_USER_REQUEST";
const DELETE_USER_SUCCESS = "DELETE_USER_SUCCESS";
const DELETE_USER_FAILURE = "DELETE_USER_FAILURE";

const deleteUserRequest = () => ({
  type: DELETE_USER_REQUEST,
});

const deleteUserSuccess = () => ({
  type: DELETE_USER_SUCCESS,
});

const deleteUserFailure = (error) => ({
  type: DELETE_USER_FAILURE,
  payload: error,
});

const deleteUser = (id) => {
  return (dispatch) => {
    dispatch(deleteUserRequest());
    axios
      .delete(`${API_URL}/users/${id}`)
      .then(() => {
        dispatch(deleteUserSuccess());
      })
      .catch((error) => {
        dispatch(deleteUserFailure(error.message));
      });
  };
};

const LOGIN_REQUEST = "UPDATE_USER_REQUEST";
const LOGIN_SUCCESS = "UPDATE_USER_SUCCESS";
const LOGIN_FAILURE = "UPDATE_USER_FAILURE";

// Login Action Creators
const loginRequest = () => ({
  type: LOGIN_REQUEST,
});

const loginSuccess = (user, token) => ({
  type: LOGIN_SUCCESS,
  payload: {
    user,
    token,
  },
});

const loginFailure = (error) => ({
  type: LOGIN_FAILURE,
  payload: error,
});

const login = (userData) => {
  return async (dispatch) => {
    dispatch(loginRequest());
    try {
      const response = await axios.post(`${API_URL}/users/login`, userData);
      const { user, token } = response.data;

      // Save user and token in localStorage
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);

      dispatch(loginSuccess(user, token));
    } catch (error) {
      dispatch(loginFailure(error.message));
    }
  };
};

const REGISTER_REQUEST = "UPDATE_USER_REQUEST";
const REGISTER_SUCCESS = "UPDATE_USER_SUCCESS";
const REGISTER_FAILURE = "UPDATE_USER_FAILURE";

// Register Action Creators
const registerRequest = () => ({
  type: REGISTER_REQUEST,
});

const registerSuccess = (user) => ({
  type: REGISTER_SUCCESS,
  payload: user,
});

const registerFailure = (error) => ({
  type: REGISTER_FAILURE,
  payload: error,
});

const register = (userData) => {
  return async (dispatch) => {
    dispatch(registerRequest());
    try {
      const response = await axios.post(`${API_URL}/register`, userData);
      const user = response.data;
      dispatch(registerSuccess(user));
    } catch (error) {
      dispatch(registerFailure(error.message));
    }
  };
};

const GET_USER_COUNT_REQUEST = "UPDATE_USER_REQUEST";
const GET_USER_COUNT_SUCCESS = "UPDATE_USER_SUCCESS";
const GET_USER_COUNT_FAILURE = "UPDATE_USER_FAILURE";

// Get User Count Action Creators
const getUserCountRequest = () => ({
  type: GET_USER_COUNT_REQUEST,
});

const getUserCountSuccess = (userCount) => ({
  type: GET_USER_COUNT_SUCCESS,
  payload: userCount,
});

const getUserCountFailure = (error) => ({
  type: GET_USER_COUNT_FAILURE,
  payload: error,
});

const getUserCount = () => {
  return async (dispatch) => {
    dispatch(getUserCountRequest());
    try {
      const response = await axios.get(`${API_URL}/get/count`);
      const { userCount } = response.data;
      dispatch(getUserCountSuccess(userCount));
    } catch (error) {
      dispatch(getUserCountFailure(error.message));
    }
  };
};

// Create appointment
const CREATE_APPOINTMENT_REQUEST = "CREATE_APPOINTMENT_REQUEST";
const CREATE_APPOINTMENT_SUCCESS = "CREATE_APPOINTMENT_SUCCESS";
const CREATE_APPOINTMENT_FAILURE = "CREATE_APPOINTMENT_FAILURE";

const createAppointmentRequest = () => ({
  type: CREATE_APPOINTMENT_REQUEST,
});

const createAppointmentSuccess = () => ({
  type: CREATE_APPOINTMENT_SUCCESS,
});

const createAppointmentFailure = (error) => ({
  type: CREATE_APPOINTMENT_FAILURE,
  payload: error,
});

const createAppointment = (appointmentData) => {
  return (dispatch) => {
    dispatch(createAppointmentRequest());
    axios
      .post(`${API_URL}/appointments`, appointmentData)
      .then(() => {
        dispatch(createAppointmentSuccess());
      })
      .catch((error) => {
        dispatch(createAppointmentFailure(error.message));
      });
  };
};

// Get appointments by therapist
const GET_APPOINTMENTS_BY_THERAPIST_REQUEST =
  "GET_APPOINTMENTS_BY_THERAPIST_REQUEST";
const GET_APPOINTMENTS_BY_THERAPIST_SUCCESS =
  "GET_APPOINTMENTS_BY_THERAPIST_SUCCESS";
const GET_APPOINTMENTS_BY_THERAPIST_FAILURE =
  "GET_APPOINTMENTS_BY_THERAPIST_FAILURE";

const getAppointmentsByTherapistRequest = () => ({
  type: GET_APPOINTMENTS_BY_THERAPIST_REQUEST,
});

const getAppointmentsByTherapistSuccess = (appointments) => ({
  type: GET_APPOINTMENTS_BY_THERAPIST_SUCCESS,
  payload: appointments,
});

const getAppointmentsByTherapistFailure = (error) => ({
  type: GET_APPOINTMENTS_BY_THERAPIST_FAILURE,
  payload: error,
});

const getAppointmentsByTherapist = (therapistId) => {
  return async (dispatch) => {
    dispatch(getAppointmentsByTherapistRequest());
    try {
      const response = await axios.get(
        `${API_URL}/appointments/therapists/${therapistId}/all`
      );
      dispatch(getAppointmentsByTherapistSuccess(response.data));
    } catch (error) {
      dispatch(getAppointmentsByTherapistFailure(error.message));
    }
  };
};

export const GET_UPCOMING_APPOINTMENTS_BY_THERAPIST_REQUEST =
  "GET_UPCOMING_APPOINTMENTS_BY_THERAPIST_REQUEST";
export const GET_UPCOMING_APPOINTMENTS_BY_THERAPIST_SUCCESS =
  "GET_UPCOMING_APPOINTMENTS_BY_THERAPIST_SUCCESS";
export const GET_UPCOMING_APPOINTMENTS_BY_THERAPIST_FAILURE =
  "GET_UPCOMING_APPOINTMENTS_BY_THERAPIST_FAILURE";

// Action creator to fetch upcoming appointments by therapist
export const getUpcomingAppointmentsByTherapist =
  (therapistId) => async (dispatch) => {
    try {
      dispatch({ type: GET_UPCOMING_APPOINTMENTS_BY_THERAPIST_REQUEST });

      const response = await axios.get(
        `${API_URL}/appointments/therapists/${therapistId}/upcoming`
      );

      const { appointments, totalPatients } = response.data;

      dispatch({
        type: GET_UPCOMING_APPOINTMENTS_BY_THERAPIST_SUCCESS,
        payload: { appointments, totalPatients },
      });
    } catch (error) {
      dispatch({
        type: GET_UPCOMING_APPOINTMENTS_BY_THERAPIST_FAILURE,
        payload:
          error.response?.data.error ||
          "An error occurred while retrieving upcoming appointments",
      });
    }
  };

const FETCH_TODAY_APPOINTMENTS_REQUEST = "FETCH_TODAY_APPOINTMENTS_REQUEST";
const FETCH_TODAY_APPOINTMENTS_SUCCESS = "FETCH_TODAY_APPOINTMENTS_SUCCESS";
const FETCH_TODAY_APPOINTMENTS_FAILURE = "FETCH_TODAY_APPOINTMENTS_FAILURE";

// Action Creators
const fetchTodayAppointments = (therapistId) => async (dispatch) => {
  dispatch({ type: FETCH_TODAY_APPOINTMENTS_REQUEST });

  try {
    const response = await axios.get(
      `${API_URL}/appointments/therapists/${therapistId}/today`
    );
    const { appointments, totalPatients } = response.data;

    dispatch({
      type: FETCH_TODAY_APPOINTMENTS_SUCCESS,
      payload: { appointments, totalPatients },
    });
  } catch (error) {
    dispatch({
      type: FETCH_TODAY_APPOINTMENTS_FAILURE,
      payload: error.message,
    });
  }
};

export const UPDATE_THERAPIST_REQUEST = "UPDATE_THERAPIST_REQUEST";
export const UPDATE_THERAPIST_SUCCESS = "UPDATE_THERAPIST_SUCCESS";
export const UPDATE_THERAPIST_FAILURE = "UPDATE_THERAPIST_FAILURE";

export const updateTherapist = (therapistId, updatedData) => (dispatch) => {
  dispatch({ type: UPDATE_THERAPIST_REQUEST });

  axios
    .put(`${API_URL}/therapists/${therapistId}`, updatedData)
    .then((response) => {
      const therapist = response.data.therapist;
      dispatch({ type: UPDATE_THERAPIST_SUCCESS, payload: therapist });
    })
    .catch((error) => {
      dispatch({ type: UPDATE_THERAPIST_FAILURE, payload: error.message });
    });
};

// Action Types
export const UPDATE_THERAPIST_IMAGE_REQUEST = "UPDATE_THERAPIST_IMAGE_REQUEST";
export const UPDATE_THERAPIST_IMAGE_SUCCESS = "UPDATE_THERAPIST_IMAGE_SUCCESS";
export const UPDATE_THERAPIST_IMAGE_FAILURE = "UPDATE_THERAPIST_IMAGE_FAILURE";

// Action Creators
export const updateTherapistImage = (id, file) => {
  return async (dispatch) => {
    dispatch({ type: UPDATE_THERAPIST_IMAGE_REQUEST });

    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await axios.put(
        `${API_URL}/therapists/${id}/image`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      dispatch({
        type: UPDATE_THERAPIST_IMAGE_SUCCESS,
        payload: response.data,
      });
    } catch (error) {
      dispatch({
        type: UPDATE_THERAPIST_IMAGE_FAILURE,
        payload: error.response.data,
      });
    }
  };
};

export {
  FETCH_THERAPISTS_REQUEST,
  FETCH_THERAPISTS_SUCCESS,
  FETCH_THERAPISTS_FAILURE,
  FETCH_THERAPIST_REQUEST,
  FETCH_THERAPIST_SUCCESS,
  FETCH_THERAPIST_FAILURE,
  CREATE_THERAPIST_REQUEST,
  CREATE_THERAPIST_SUCCESS,
  CREATE_THERAPIST_FAILURE,
  FETCH_ASSESSMENTS_REQUEST,
  FETCH_ASSESSMENTS_SUCCESS,
  FETCH_ASSESSMENTS_FAILURE,
  FETCH_ASSESSMENT_REQUEST,
  FETCH_ASSESSMENT_SUCCESS,
  FETCH_ASSESSMENT_FAILURE,
  CREATE_ASSESSMENT_REQUEST,
  CREATE_ASSESSMENT_SUCCESS,
  CREATE_ASSESSMENT_FAILURE,
  FETCH_USERS_REQUEST,
  FETCH_USERS_SUCCESS,
  FETCH_USERS_FAILURE,
  FETCH_USER_REQUEST,
  FETCH_USER_SUCCESS,
  FETCH_USER_FAILURE,
  CREATE_USER_REQUEST,
  CREATE_USER_SUCCESS,
  CREATE_USER_FAILURE,
  UPDATE_USER_REQUEST,
  UPDATE_USER_SUCCESS,
  UPDATE_USER_FAILURE,
  DELETE_USER_REQUEST,
  DELETE_USER_SUCCESS,
  DELETE_USER_FAILURE,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  REGISTER_REQUEST,
  REGISTER_SUCCESS,
  REGISTER_FAILURE,
  GET_USER_COUNT_REQUEST,
  GET_USER_COUNT_SUCCESS,
  GET_USER_COUNT_FAILURE,
  login,
  register,
  getUserCount,
  fetchTherapists,
  fetchTherapist,
  createTherapist,
  fetchAssessments,
  fetchAssessment,
  createAssessment,
  fetchUsers,
  fetchUser,
  createUser,
  updateUser,
  deleteUser,
  createAppointment,
  getAppointmentsByTherapist,
  fetchTodayAppointments,
  CREATE_APPOINTMENT_FAILURE,
  CREATE_APPOINTMENT_SUCCESS,
  CREATE_APPOINTMENT_REQUEST,
  GET_APPOINTMENTS_BY_THERAPIST_REQUEST,
  GET_APPOINTMENTS_BY_THERAPIST_SUCCESS,
  GET_APPOINTMENTS_BY_THERAPIST_FAILURE,
  FETCH_TODAY_APPOINTMENTS_REQUEST,
  FETCH_TODAY_APPOINTMENTS_SUCCESS,
  FETCH_TODAY_APPOINTMENTS_FAILURE,
};
