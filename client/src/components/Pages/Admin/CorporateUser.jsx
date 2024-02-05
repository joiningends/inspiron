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
  const [searchQuery, setSearchQuery] = useState("");
  const usersPerPage = 5;
  const { groupid } = useParams();

  useEffect(() => {
    async function fetchUserData() {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/users/group/${groupid}?search=${searchQuery}`
        );
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }

    fetchUserData();
  }, [groupid, searchQuery]);

  const handleAction = async (userId, action) => {
    try {
      await axios.put(
        `${process.env.REACT_APP_SERVER_URL}/users/${userId}/types`,
        {
          types: action,
        }
      );

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

  const filteredUsers = users.filter(
    user =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.empid.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.mobile &&
        typeof user.mobile === "string" &&
        user.mobile.toLowerCase().includes(searchQuery.toLowerCase())) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const handlePageChange = (event, pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div>
      <div className="search-container">
        <input
          type="text"
          placeholder="Search by name, employee ID, phone number, or email"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          style={{ margin: "0.5rem", width: "88%" }}
        />
      </div>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Employee Id</th>
            <th>Group Id</th>
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
              <td>{user.groupid}</td>
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
          count={Math.ceil(filteredUsers.length / usersPerPage)}
          page={currentPage}
          onChange={handlePageChange}
        />
      </div>
    </div>
  );
}

export default CorporateUser;
