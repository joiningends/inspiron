import {
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
  CREATE_APPOINTMENT_REQUEST,
  CREATE_APPOINTMENT_SUCCESS,
  CREATE_APPOINTMENT_FAILURE,
  GET_APPOINTMENTS_BY_THERAPIST_REQUEST,
  GET_APPOINTMENTS_BY_THERAPIST_SUCCESS,
  GET_APPOINTMENTS_BY_THERAPIST_FAILURE,
  GET_UPCOMING_APPOINTMENTS_BY_THERAPIST_REQUEST,
  GET_UPCOMING_APPOINTMENTS_BY_THERAPIST_SUCCESS,
  GET_UPCOMING_APPOINTMENTS_BY_THERAPIST_FAILURE,
  FETCH_TODAY_APPOINTMENTS_REQUEST,
  FETCH_TODAY_APPOINTMENTS_SUCCESS,
  FETCH_TODAY_APPOINTMENTS_FAILURE,
  UPDATE_THERAPIST_REQUEST,
  UPDATE_THERAPIST_SUCCESS,
  UPDATE_THERAPIST_FAILURE,
  UPDATE_THERAPIST_IMAGE_REQUEST,
  UPDATE_THERAPIST_IMAGE_SUCCESS,
  UPDATE_THERAPIST_IMAGE_FAILURE,
} from "./Action";

const initialState = {
  therapists: [],
  therapist: null,
  assessments: [],
  todayAppointments: [],
  appointmentByTherapist: [],
  upcomingAppointments: [],
  assessment: null,
  users: [],
  user: null,
  appointments: [],
  appointment: null,
  loading: false,
  error: null,
  userCount: 0,
  totalPatients: 0,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_THERAPISTS_REQUEST:
    case FETCH_THERAPIST_REQUEST:
    case CREATE_THERAPIST_REQUEST:
    case FETCH_ASSESSMENTS_REQUEST:
    case FETCH_ASSESSMENT_REQUEST:
    case CREATE_ASSESSMENT_REQUEST:
    case FETCH_USERS_REQUEST:
    case FETCH_USER_REQUEST:
    case CREATE_USER_REQUEST:
    case UPDATE_USER_REQUEST:
    case DELETE_USER_REQUEST:
    case LOGIN_REQUEST:
    case REGISTER_REQUEST:
    case GET_USER_COUNT_REQUEST:
    case CREATE_APPOINTMENT_REQUEST:
    case GET_APPOINTMENTS_BY_THERAPIST_REQUEST:
    case FETCH_TODAY_APPOINTMENTS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case FETCH_THERAPISTS_SUCCESS:
      return {
        ...state,
        therapists: action.payload,
        loading: false,
      };

    case FETCH_THERAPIST_SUCCESS:
      return {
        ...state,
        therapist: action.payload,
        loading: false,
      };

    case CREATE_THERAPIST_SUCCESS:
      return {
        ...state,
        loading: false,
      };

    case FETCH_ASSESSMENTS_SUCCESS:
      return {
        ...state,
        assessments: action.payload,
        loading: false,
      };

    case FETCH_ASSESSMENT_SUCCESS:
      return {
        ...state,
        assessment: action.payload,
        loading: false,
      };

    case CREATE_ASSESSMENT_SUCCESS:
      return {
        ...state,
        loading: false,
      };

    case FETCH_USERS_SUCCESS:
      return {
        ...state,
        users: action.payload,
        loading: false,
      };

    case FETCH_USER_SUCCESS:
      return {
        ...state,
        user: action.payload,
        loading: false,
      };

    case CREATE_USER_SUCCESS:
    case UPDATE_USER_SUCCESS:
    case DELETE_USER_SUCCESS:
      return {
        ...state,
        loading: false,
      };

    case LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        loading: false,
      };

    case REGISTER_SUCCESS:
      return {
        ...state,
        loading: false,
      };

    case GET_USER_COUNT_SUCCESS:
      return {
        ...state,
        userCount: action.payload,
        loading: false,
      };

    case CREATE_APPOINTMENT_SUCCESS:
      return {
        ...state,
        appointments: [...state.appointments, action.payload],
        loading: false,
      };

    case GET_APPOINTMENTS_BY_THERAPIST_SUCCESS:
      return {
        ...state,
        appointmentByTherapist: action.payload,
        loading: false,
      };

    case FETCH_TODAY_APPOINTMENTS_SUCCESS:
      return {
        ...state,
        todayAppointments: action.payload,
        loading: false,
      };

    case GET_UPCOMING_APPOINTMENTS_BY_THERAPIST_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case GET_UPCOMING_APPOINTMENTS_BY_THERAPIST_SUCCESS:
      return {
        ...state,
        upcomingAppointments: action.payload.appointments,
        totalPatients: action.payload.totalPatients,
        loading: false,
      };

    case GET_UPCOMING_APPOINTMENTS_BY_THERAPIST_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case UPDATE_THERAPIST_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case UPDATE_THERAPIST_SUCCESS:
      return {
        ...state,
        therapist: action.payload,
        loading: false,
      };
    case UPDATE_THERAPIST_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case UPDATE_THERAPIST_IMAGE_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case UPDATE_THERAPIST_IMAGE_SUCCESS:
      return {
        ...state,
        therapist: action.payload,
        loading: false,
        error: null,
      };
    case UPDATE_THERAPIST_IMAGE_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case FETCH_THERAPISTS_FAILURE:
    case FETCH_THERAPIST_FAILURE:
    case CREATE_THERAPIST_FAILURE:
    case FETCH_ASSESSMENTS_FAILURE:
    case FETCH_ASSESSMENT_FAILURE:
    case CREATE_ASSESSMENT_FAILURE:
    case FETCH_USERS_FAILURE:
    case FETCH_USER_FAILURE:
    case CREATE_USER_FAILURE:
    case UPDATE_USER_FAILURE:
    case DELETE_USER_FAILURE:
    case LOGIN_FAILURE:
    case REGISTER_FAILURE:
    case GET_USER_COUNT_FAILURE:
    case CREATE_APPOINTMENT_FAILURE:
    case GET_APPOINTMENTS_BY_THERAPIST_FAILURE:
    case FETCH_TODAY_APPOINTMENTS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default reducer;
