import React from "react";
import "./App.css";
import NavBar from "./components/NavBar";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Home } from "./components/Pages/Home";
import { TherapistsWithFilter } from "./components/Pages/TherapistsWithFilter";
import DoctorProfile from "./components/Pages/DoctorProfile";
import BookTime from "./components/Pages/BookTime";
import Assessments from "./components/Pages/Assessments";
import Assessment from "./components/Pages/Assessment";
import Signup from "./components/Pages/Signup";
import Signin from "./components/Pages/Signin";
import Result from "./components/Pages/Result";
import Therapistfilter from "./components/Pages/Therapistfilter";
import TherapistHomePage from "./components/Pages/Therapists/TherapistHomePage";
import TherapistAppointment from "./components/Pages/Therapists/TherapistAppointment";
import TherapistProfilePage from "./components/Pages/Therapists/TherapistProfilePage";
import PatientDetails from "./components/Pages/Therapists/PatientDetails";
import FirstSessionNotes from "./components/Pages/Therapists/FirstSessionNotes";
import Dashboard from "./components/Pages/Admin/Dashboard";
import CreateAssessment from "./components/Pages/Admin/CreateAssessment";
import AssessmentCreatePage from "./components/Pages/Admin/AssessmentCreatePage";
import TherapistDetails from "./components/Pages/Admin/TherapistDetails";
import PatientPage from "./components/Pages/Admin/PatientPage";
import TimeSlots from "./components/Pages/Therapists/TimeSlots";

function App() {
  const userRole = localStorage.getItem("role");
  const parsedUserRole = JSON.parse(userRole);
  const isAdmin = parsedUserRole === "admin";
  const isTherapist = parsedUserRole === "therapist";
  const isUser = parsedUserRole === "user";

  return (
    <>
      <Router>
        <NavBar />
        <div className="pages">
          <Routes>
            {isUser && (
              <>
                {/* Other routes that are common for all users */}
                <Route path="/" element={<Home />} />
                <Route path="/bookaslot/:id" element={<BookTime />} />
                <Route path="/therapists/:id" element={<DoctorProfile />} />
                <Route
                  path="/FindTherapist"
                  element={<TherapistsWithFilter />}
                />
                <Route path="/assessment" element={<Assessments />} />
                <Route path="/assessment/:id" element={<Assessment />} />

                <Route path="/result" element={<Result />} />
                <Route path="/therapist" element={<Therapistfilter />} />
              </>
            )}

            {/* Routes shown to the therapist only */}
            {isTherapist && (
              <>
                <Route path="/appointment" element={<TherapistAppointment />} />
                <Route path="/profile" element={<TherapistProfilePage />} />
                <Route
                  path="/patient-details/:id"
                  element={<PatientDetails />}
                />
                <Route
                  path="/patient-details-first-session-notes/:id"
                  element={<FirstSessionNotes />}
                />
                <Route path="/therapists" element={<TherapistHomePage />} />
                <Route path="/timeSlots" element={<TimeSlots />} />
              </>
            )}

            {/* Routes shown to the admin only */}
            {isAdmin && (
              <>
                <Route path="/admin-Dashboard" element={<Dashboard />} />
                <Route
                  path="/admin-Create-Assessment"
                  element={<CreateAssessment />}
                />
                <Route
                  path="/create-assessment-page"
                  element={<AssessmentCreatePage />}
                />
                <Route
                  path="/therapists-Details/:id"
                  element={<TherapistDetails />}
                />
                <Route
                  path="/admin-patient-details"
                  element={<PatientPage />}
                />
              </>
            )}
            <Route path="/login" element={<Signup />} />
            <Route path="/signin" element={<Signin />} />
          </Routes>
        </div>
      </Router>
    </>
  );
}

export default App;
