import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./CorporateUser.css";

function CorporateUser() {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;
  const { groupid } = useParams();

  useEffect(() => {
    async function fetchUserData() {
      try {
        const response = await axios.get(
          `http://localhost:4000/api/v1/users/group/${groupid}`
        );
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }

    fetchUserData();
  }, [groupid]);

  const handleAction = async (userId, action) => {
    try {
      await axios.put(`http://localhost:4000/api/v1/users/${userId}/types`, {
        types: action,
      });

      setUsers(prevUsers =>
        prevUsers.map(user => {
          if (user._id === userId) {
            return { ...user, types: action };
          }
          return user;
        })
      );
    } catch (error) {
      console.error(`Error updating user ${userId} status:`, error);
    }
  };

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  const handlePageChange = pageNumber => {
    setCurrentPage(pageNumber);
  };

  return (
    <div>
      <h2>Corporate User Details for Group ID: {groupid}</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Employee Id</th>
            <th>Email</th>
            <th>Phone Number</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.map(user => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.empid}</td>
              <td>{user.email}</td>
              <td>{user.mobile}</td>
              <td>
                {user.types === "approve" ? (
                  <button onClick={() => handleAction(user._id, "disapprove")}>
                    Disapprove
                  </button>
                ) : (
                  <div>
                    <button onClick={() => handleAction(user._id, "approve")}>
                      Approve
                    </button>
                    <button
                      onClick={() => handleAction(user._id, "disapprove")}
                    >
                      Disapprove
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination-container">
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(users.length / usersPerPage)}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="pagination">
      {pageNumbers.map(number => (
        <span
          key={number}
          className={`page-number ${number === currentPage ? "active" : ""}`}
          onClick={() => onPageChange(number)}
        >
          {number}
        </span>
      ))}
    </div>
  );
};

export default CorporateUser;
