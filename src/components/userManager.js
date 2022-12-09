import React, { useState, useEffect } from "react";
import FetchCalls from "../utils/fetchCalls";

const UserManager = () => {
  const [bannedUsers, setBannedUsers] = useState([]);
  const [message, setMessage] = useState();
  const [bannedUser, setBannedUser] = useState();

  const removeBan = async () => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    const jwt = userData.jwt;

    const backendCaller = new FetchCalls(
      `/users/ban/${bannedUser}/true`,
      "PATCH",
      jwt
    );
    const response = await backendCaller.protectedNoBody();
    if (response.ok) {
      setMessage(`User: ${bannedUser} has been unsuspended.`);
    } else {
      const err = await response.json();
      setMessage(err.message);
    }
  };

  useEffect(() => {
    const getUsers = async () => {
      const userData = JSON.parse(localStorage.getItem("userData"));
      const backendCaller = new FetchCalls(
        "/users/getBannedUsers",
        "GET",
        userData.jwt
      );
      const response = await backendCaller.protectedNoBody();
      if (response.ok) {
        const users = await response.json();
        setBannedUsers(users);
      } else {
        const errMessage = await response.json();
        setMessage(errMessage.message);
      }
    };
    getUsers();
  }, []);

  return (
    <div className="user-manager-main">
      <div>
        <h2>User Manager</h2>
        <hr />
      </div>
      <div className="user-inputs">
        <input
          value={bannedUser}
          onChange={(e) => setBannedUser(e.target.value)}
          list="users"
        />
        <datalist id="users">
          {bannedUsers.map((user) => (
            <option data-value={user._id} value={user.email} key={user._id} />
          ))}
        </datalist>
      </div>

      <div className="ban-button">
        <button onClick={() => removeBan()}>Remove Ban</button>
      </div>

      <div>{message && <div>{message}</div>}</div>
    </div>
  );
};

export default UserManager;
