import React, { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";
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
import PatientPagee from "./components/Pages/Therapists/PatientPage";
import TimeSlots from "./components/Pages/Therapists/TimeSlots";
import BookSlotByTherapist from "./components/Pages/Therapists/BookSlotByTherapist";
import SessionHistoryOfPatients from "./components/Pages/Admin/SessionHistoryOfPatients";
import CreateFirstSessionQuestions from "./components/Pages/Admin/CreateFirstSessionQuestions";
import CreateSecondPart from "./components/Pages/Admin/CreateSecondPart";
import Group from "./components/Pages/Admin/Group";
import GroupSignUp from "./components/Pages/GroupSignup";
import CorporateUser from "./components/Pages/Admin/CorporateUser";
import SettingPage from "./components/Pages/Therapists/SettingPage";
import PatientCoins from "./components/Pages/Admin/PatientCoins";
import Forgotpassword from "./components/Pages/Forgotpassword";
import ResetPassword from "./components/Pages/ResetPassword";
import OnePatientDetails from "./components/Pages/Therapists/OnePatientDetails";
import OpenFirstSessionNotes from "./components/Pages/Therapists/OpenFirstSessionNotes";
import BookingPage from "./components/Pages/BookingPage";
import PaymentSuccessPage from "./components/Pages/PaymentSuccessPage";
import Profile from "./components/Pages/Profile";
import Appointments from "./components/Pages/Appointments";
import CustomerPayment from "./components/Pages/Admin/CustomerPayment";
import PendingPayments from "./components/Pages/PendingPayments";
import PaymentSuccessPageCorp from "./components/Pages/PaymentSuccessPageCorp";
import { Navigate } from "react-router-dom";
import Prescription from "./components/Pages/Therapists/Prescription";
import ResetPasswordPage from "./components/Pages/ResetPasswordPassPage";
import Thankyou from "./components/Pages/Thankyou";
import CompletePayment from "./components/Pages/CompletePayment";
import PaymentConfirm from "./components/Pages/PaymentConfirm";
import { Rating } from "@mui/material";
import RatingSystem from "./components/Pages/Rating";
import SelfHelp from "./components/Pages/SelfHelp";
import ResetPasswordTherapist from "./components/Pages/ResetPasswordTherapist";
import PageNotFound from "./components/Pages/PageNotFound";

function App() {
  const userRole = localStorage.getItem("role");
  const parsedUserRole = JSON.parse(userRole);
  console.log(parsedUserRole);
  const isAdmin = parsedUserRole === "admin";
  const isTherapist = parsedUserRole === "therapist";
  const isUser = parsedUserRole === "user";
  const empid = JSON.parse(localStorage.getItem("empid"));
  const isEmpidNull = empid === null;

  const excludedPath = "/thankyouForRegistering_teamInspiron/verify/:token";

  let groupId = localStorage.getItem("groupid");
  const [dataCompany, setDataCompany] = useState(false);
  console.log(dataCompany);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Only make the request if groupId is not null or undefined
        if (groupId !== null) {
          // Remove quotes around groupId
          const groupVal = groupId.replace(/"/g, "");

          const response = await axios.get(
            `http://localhost:5001/api/v1/clients/group/${groupVal}`
          );
          console.log(response);
          // Handle the successful response here
          setDataCompany(response.data.companypayment);
        }
      } catch (error) {
        // Handle errors here
        console.error("Error:", error);
      }
    };

    fetchData();
  }, [groupId]);

  if (parsedUserRole !== null) {
    const forbiddenPaths = ["/login", "/signin", "/login/:company/:groupId"];
    if (forbiddenPaths.includes(window.location.pathname)) {
      window.location.href = "/PageNotFound";
    }
  }

  return (
    <>
      <Router>
        {window.location.pathname !== excludedPath && <NavBar />}
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
                <Route
                  path="bookaslot/bookYourSession/:therapistId/:appointmentId"
                  element={<BookingPage />}
                />
                <Route
                  path="/sessionIsBooked/:appointmentId"
                  element={<PaymentSuccessPage />}
                />
                <Route
                  path="/sessionIsBookedCorp/:appointmentId"
                  element={<PaymentSuccessPageCorp />}
                />
                <Route path="/Profile" element={<Profile />} />
                <Route path="/Appointments" element={<Appointments />} />
                <Route
                  path="/completePayment/:userId/:amount/:experienceLevel"
                  element={<CompletePayment />}
                />
                <Route
                  path="/paymentConfirm/:amount"
                  element={<PaymentConfirm />}
                />

                <Route path="/rating" element={<RatingSystem />} />
                <Route path="/selfhelp" element={<SelfHelp />} />
                <Route path="/PendingPayments" element={<PendingPayments />} />
                <Route
                  path="/selfhelp"
                  element={
                    isEmpidNull ? (
                      <SelfHelp />
                    ) : (
                      <Navigate to="/other-route" replace />
                    )
                  }
                />
              </>
            )}

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
                <Route
                  path="/bookSlot/:userid/:therapistid"
                  element={<BookSlotByTherapist />}
                />
                <Route path="/patientPage" element={<PatientPagee />} />
                <Route
                  path="/appointments/users/:userId/therapists/:therapistId/latest-appointment"
                  element={<OnePatientDetails />}
                />
                <Route
                  path="/openFirstSessionNotes/:userId"
                  element={<OpenFirstSessionNotes />}
                />
                <Route
                  path="/prescription/:id/:therapistId"
                  element={<Prescription />}
                />
              </>
            )}

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
                <Route
                  path="/session-history-patients/:id"
                  element={<SessionHistoryOfPatients />}
                />
                <Route
                  path="/edit_add-questions"
                  element={<CreateFirstSessionQuestions />}
                />
                <Route
                  path="/edit_add-question01"
                  element={<CreateSecondPart />}
                />
                <Route path="/group" element={<Group />} />
                <Route
                  path="/corporate-user/:groupid"
                  element={<CorporateUser />}
                />
                <Route path="/admin-setting" element={<SettingPage />} />
                <Route
                  path="/user-coin/:patientId"
                  element={<PatientCoins />}
                />
                <Route
                  path="/userPayment/:userId"
                  element={<CustomerPayment />}
                />
                <Route
                  path="/patient-details-first-session-notes/:id"
                  element={<FirstSessionNotes />}
                />
                <Route
                  path="/openFirstSessionNotes/:userId"
                  element={<OpenFirstSessionNotes />}
                />
              </>
            )}
            <Route path="/login" element={<Signup />} />
            <Route path="/signin" element={<Signin />} />
            <Route path="/login/:company/:groupId" element={<GroupSignUp />} />
            <Route path="/forgotpassword" element={<Forgotpassword />} />
            <Route
              path="passwordReset/reset/:token"
              element={<ResetPasswordPage />}
            />
            <Route
              path="passwordReset/therapist/reset/:token"
              element={<ResetPasswordTherapist />}
            />
            <Route
              path="/thankyouForRegistering_teamInspiron/verify/:token"
              element={<Thankyou />}
            />
            <Route path="/assessment" element={<Assessments />} />
            <Route path="/assessment/:id" element={<Assessment />} />
            <Route path="/result" element={<Result />} />
            <Route path="/PageNotFound" element={<PageNotFound />} />
          </Routes>
        </div>
      </Router>
    </>
  );
}

export default App;
