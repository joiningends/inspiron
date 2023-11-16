import React, { useEffect } from "react";
import { RiDeleteBin2Line, RiAddLine } from "react-icons/ri";
import "./CreateAssessment.css";
import { fetchAssessments } from "../../redux/Action";
import { useSelector, useDispatch } from "react-redux";
import Footer from "../Footer";

function CreateAssessment() {
  const dispatch = useDispatch();
  const assessments = useSelector(state => state.assessments);

  useEffect(() => {
    dispatch(fetchAssessments());
  }, [dispatch]);

  const handleDelete = assessmentId => {
    // Make a DELETE request to the server
    console.log(assessmentId._id);
    console.log(
      `${process.env.REACT_APP_SERVER_URL}/assessments/${assessmentId._id}`
    );
    fetch(
      `${process.env.REACT_APP_SERVER_URL}/assessments/${assessmentId._id}`,
      {
        method: "DELETE",
      }
    )
      .then(response => {
        // Successfully deleted, update your local state or re-fetch assessments
        dispatch(fetchAssessments());
        window.location.reload();
      })
      .catch(error => {
        console.error("Error while deleting assessment:", error);
        window.location.reload();
      });
  };

  const handleCreateAssessment = () => {
    console.log("Create Assessment button clicked");
    window.location.href = "create-assessment-page";
  };

  return (
    <>
      <div>
        <h2>Assessments</h2>
        <table>
          <thead>
            <tr>
              <th>Assessment Name</th>
              <th>No of Questions</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(assessments) &&
              assessments.map(assessment => (
                <tr key={assessment.hostId}>
                  <td>{assessment.assessment_name}</td>
                  <td>{assessment.questions.length}</td>
                  <td>
                    <button
                      className="action-button"
                      onClick={() => handleDelete(assessment)}
                    >
                      <RiDeleteBin2Line className="action-icon delete-icon" />
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        <button
          className="create-assessment-button"
          onClick={handleCreateAssessment}
          style={{ marginLeft: "5rem" }}
        >
          Create Assessment
          <RiAddLine className="create-assessment-icon" />
        </button>
      </div>
      <Footer />
    </>
  );
}

export default CreateAssessment;
