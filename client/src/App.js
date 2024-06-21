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
import jwtDecode from "jwt-decode";
import PrivateRoute from "./PrivateRoute";

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
            `${process.env.REACT_APP_SERVER_URL}/clients/group/${groupVal}`
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
      if (parsedUserRole === "user") {
        return (window.location.href = "/");
      } else if (parsedUserRole === "therapist") {
        return (window.location.href = "/therapists");
      } else if (parsedUserRole === "admin") {
        return (window.location.href = "/admin-Dashboard");
      }
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
                <Route path="/" element={<PrivateRoute element={Home} />} />
                <Route
                  path="/bookaslot/:id"
                  element={<PrivateRoute element={BookTime} />}
                />
                <Route
                  path="/therapists/:id"
                  element={<PrivateRoute element={DoctorProfile} />}
                />
                <Route
                  path="/FindTherapist"
                  element={<PrivateRoute element={TherapistsWithFilter} />}
                />
                <Route
                  path="/assessment"
                  element={<PrivateRoute element={Assessments} />}
                />
                <Route
                  path="/assessment/:id"
                  element={<PrivateRoute element={Assessment} />}
                />
                <Route
                  path="/result"
                  element={<PrivateRoute element={Result} />}
                />
                <Route
                  path="/therapist"
                  element={<PrivateRoute element={Therapistfilter} />}
                />
                <Route
                  path="bookaslot/bookYourSession/:therapistId/:appointmentId"
                  element={<PrivateRoute element={BookingPage} />}
                />
                <Route
                  path="/sessionIsBooked/:appointmentId"
                  element={<PrivateRoute element={PaymentSuccessPage} />}
                />
                <Route
                  path="/sessionIsBookedCorp/:appointmentId"
                  element={<PrivateRoute element={PaymentSuccessPageCorp} />}
                />
                <Route
                  path="/Profile"
                  element={<PrivateRoute element={Profile} />}
                />
                <Route
                  path="/Appointments"
                  element={<PrivateRoute element={Appointments} />}
                />
                <Route
                  path="/completePayment/:userId/:amount/:experienceLevel"
                  element={<PrivateRoute element={CompletePayment} />}
                />
                <Route
                  path="/paymentConfirm/:amount"
                  element={<PrivateRoute element={PaymentConfirm} />}
                />
                <Route
                  path="/rating"
                  element={<PrivateRoute element={RatingSystem} />}
                />
                <Route
                  path="/selfhelp"
                  element={<PrivateRoute element={SelfHelp} />}
                />
                <Route
                  path="/PendingPayments"
                  element={<PrivateRoute element={PendingPayments} />}
                />
                <Route
                  path="/selfhelp"
                  element={
                    isEmpidNull ? (
                      <PrivateRoute element={SelfHelp} />
                    ) : (
                      <Navigate to="/other-route" replace />
                    )
                  }
                />
              </>
            )}

            {isTherapist && (
              <>
                <Route
                  path="/appointment"
                  element={<PrivateRoute element={TherapistAppointment} />}
                />
                <Route
                  path="/profile"
                  element={<PrivateRoute element={TherapistProfilePage} />}
                />
                <Route
                  path="/patient-details/:id"
                  element={<PrivateRoute element={PatientDetails} />}
                />
                <Route
                  path="/patient-details-first-session-notes/:id"
                  element={<PrivateRoute element={FirstSessionNotes} />}
                />
                <Route
                  path="/therapists"
                  element={<PrivateRoute element={TherapistHomePage} />}
                />
                <Route
                  path="/timeSlots"
                  element={<PrivateRoute element={TimeSlots} />}
                />
                <Route
                  path="/bookSlot/:userid/:therapistid"
                  element={<PrivateRoute element={BookSlotByTherapist} />}
                />
                <Route
                  path="/patientPage"
                  element={<PrivateRoute element={PatientPagee} />}
                />
                <Route
                  path="/appointments/users/:userId/therapists/:therapistId/latest-appointment"
                  element={<PrivateRoute element={OnePatientDetails} />}
                />
                <Route
                  path="/openFirstSessionNotes/:userId"
                  element={<PrivateRoute element={OpenFirstSessionNotes} />}
                />
                <Route
                  path="/prescription/:id/:therapistId"
                  element={<PrivateRoute element={Prescription} />}
                />
              </>
            )}

            {isAdmin && (
              <>
                <Route
                  path="/admin-Dashboard"
                  element={<PrivateRoute element={Dashboard} />}
                />
                <Route
                  path="/admin-Create-Assessment"
                  element={<PrivateRoute element={CreateAssessment} />}
                />
                <Route
                  path="/create-assessment-page"
                  element={<PrivateRoute element={AssessmentCreatePage} />}
                />
                <Route
                  path="/therapists-Details/:id"
                  element={<PrivateRoute element={TherapistDetails} />}
                />
                <Route
                  path="/admin-patient-details"
                  element={<PrivateRoute element={PatientPage} />}
                />
                <Route
                  path="/session-history-patients/:id"
                  element={<PrivateRoute element={SessionHistoryOfPatients} />}
                />
                <Route
                  path="/edit_add-questions"
                  element={
                    <PrivateRoute element={CreateFirstSessionQuestions} />
                  }
                />
                <Route
                  path="/edit_add-question01"
                  element={<PrivateRoute element={CreateSecondPart} />}
                />
                <Route
                  path="/group"
                  element={<PrivateRoute element={Group} />}
                />
                <Route
                  path="/corporate-user/:groupid"
                  element={<PrivateRoute element={CorporateUser} />}
                />
                <Route
                  path="/admin-setting"
                  element={<PrivateRoute element={SettingPage} />}
                />
                <Route
                  path="/user-coin/:patientId"
                  element={<PrivateRoute element={PatientCoins} />}
                />
                <Route
                  path="/userPayment/:userId"
                  element={<PrivateRoute element={CustomerPayment} />}
                />
                <Route
                  path="/patient-details-first-session-notes/:id"
                  element={<PrivateRoute element={FirstSessionNotes} />}
                />
                <Route
                  path="/openFirstSessionNotes/:userId"
                  element={<PrivateRoute element={OpenFirstSessionNotes} />}
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
