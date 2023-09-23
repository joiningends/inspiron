import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
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
        console.log(response.data);
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

  const handlePageChange = (event, pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Employee Id</th>
            <th>Email</th>
            <th>Phone Number</th>
            <th>Credit</th>
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
              <td>{user.credits}</td>
              <td>
                {user.types === "approved" ? (
                  <Button onClick={() => handleAction(user._id, "disabled")}>
                    Disable
                  </Button>
                ) : user.types === "disabled" ? (
                  <Button onClick={() => handleAction(user._id, "approved")}>
                    Enable
                  </Button>
                ) : (
                  <Stack direction="row" spacing={1}>
                    <Button onClick={() => handleAction(user._id, "approved")}>
                      Approve
                    </Button>
                    <Button onClick={() => handleAction(user._id, "disabled")}>
                      Disable
                    </Button>
                  </Stack>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination-container">
        <Pagination
          count={Math.ceil(users.length / usersPerPage)}
          page={currentPage}
          onChange={handlePageChange}
        />
      </div>
    </div>
  );
}

export default CorporateUser;
