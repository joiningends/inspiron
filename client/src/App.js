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
import { Profiler } from "react";
import TherapistProfilePage from "./components/Pages/Therapists/TherapistProfilePage";
import PatientDetails from "./components/Pages/Therapists/PatientDetails";
import FirstSessionNotes from "./components/Pages/Therapists/FirstSessionNotes";
import Dashboard from "./components/Pages/Admin/Dashboard";

function App() {
  return (
    <>
      <Router>
        <NavBar />
        <div className="pages">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/bookaslot/:id" element={<BookTime />} />
            <Route path="/therapists/:id" element={<DoctorProfile />} />
            <Route path="/FindTherapist" element={<TherapistsWithFilter />} />
            <Route path="/assessment" element={<Assessments />} />
            <Route path="/assessment/:id" element={<Assessment />} />
            <Route path="/login" element={<Signup />} />
            <Route path="/signin" element={<Signin />} />
            <Route path="/result" element={<Result />} />
            <Route path="/therapist" element={<Therapistfilter />} />
            <Route path="/therapists" element={<TherapistHomePage />} />
            <Route path="/appointment" element={<TherapistAppointment />} />
            <Route path="/profile" element={<TherapistProfilePage />} />
            <Route path="/patient-details/:id" element={<PatientDetails />} />
            <Route
              path="/patient-details-first-session-notes/:id"
              element={<FirstSessionNotes />}
            />
            <Route path="/admin-Dashboard" element={<Dashboard />} />
          </Routes>
        </div>
      </Router>
    </>
  );
}

export default App;
