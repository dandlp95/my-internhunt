import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FetchCalls from "../utils/fetchCalls";
import { isAuth } from "../utils/isLoggedIn";
import Header from "../components/header";
import "./personalSettings.css";
import ChangeMajor from "../components/changeMajor";
import UserManager from "../components/userManager";
import DeleteAccount from "../components/deleteAccount";

const PersonalSettings = () => {
  const [user, setUser] = useState();
  const [oldPassword, setOldPassword] = useState();
  const [oldPasswordExists, setOldPasswordExists] = useState(false);

  const [message1, setMessage1] = useState(null);
  const [message2, setMessage2] = useState(null);
  const [confirmationResponse, setConfirmationResponse] = useState();
  const [isErr, setIsErr] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
  const navigate = useNavigate();

  const requestPasswordChange = async (newPassword, newPasswordConfirm) => {
    const user = JSON.parse(localStorage.getItem("userData"));
    if (oldPassword) {
      setMessage1(null);
      if (!newPassword || !newPasswordConfirm) {
        setIsErr(true);
        setConfirmationResponse("Please fill out both fields");
      } else {
        if (newPassword === newPasswordConfirm) {
          const body = {
            currPassword: oldPassword,
            newPassword: newPassword,
          };

          const backendCaller = new FetchCalls(
            `/users/edit-password/${user.userId}`,
            "PATCH",
            user.jwt,
            body
          );

          const response = await backendCaller.protectedBody();
          if (response.ok) {
            setIsErr(false);
            setOldPassword("");
            setNewPassword("");
            setNewPasswordConfirm("");
            setConfirmationResponse(
              "Your password has been succesfully changed."
            );
          } else if (response.status === 401) {
            setIsErr(true);
            setConfirmationResponse("Incorrect password. Please try again.");
          } else {
            const data = await response.json();
            setConfirmationResponse(data.message);
            setIsErr(true);
          }
        } else {
          setMessage2("Passwords don't match");
        }
      }
    } else {
      setIsErr(true);
      setConfirmationResponse("Please enter your current password.");
    }
  };

  const requestEmailCode = async () => {
    var user;
    const res = await isAuth();
    if (res.ok) {
      user = await res.json();
    } else if (res.err === "server down") {
      alert("Error processing your request.");
      navigate("/");
    } else {
      alert("Please login");
      navigate("/");
    }

    const email = user.email;

    const backendCaller = new FetchCalls(
      "/users/request-password-reset",
      "PATCH",
      null,
      { email }
    );

    try {
      const response = await backendCaller.protectedBody();
      if (response.ok) {
        setIsErr(false);
        setConfirmationResponse(
          "The link was sent to your registered email address. Use it to set a new password"
        );
      } else {
        setIsErr(true);
        const error = await response.json();
        setConfirmationResponse(error.message);
      }
    } catch (err) {
      alert("Error processing your request.");
      navigate("/");
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const response = await isAuth();
      if (response.ok) {
        const fetchUser = await response.json();
        setUser(fetchUser);
        setOldPasswordExists(fetchUser.customPassword);

        if (fetchUser.accessLevel > 0) setIsAdmin(true);
      } else if (response.err) {
        if (response.err === "server down") {
          alert("Our servers are down.");
          navigate("/");
        } else {
          alert("Please log in");
          navigate("/");
        }
      }
    };

    fetchUserData();
  }, []);

  if (user) {
    if (oldPasswordExists) {
      return (
        <div className="password-change-main">
          <Header accountId={user._id} />
          <div className="spacer">&nbsp;</div>
          <div className="password-ui-container">
            <div className="password-header">
              <h2>Change Password</h2>
              <hr />
            </div>
            <div className="passwords-inputs">
              <input
                type="password"
                value={oldPassword}
                placeholder="Enter your old password"
                onChange={(e) => setOldPassword(e.target.value)}
                className="old-password-input"
              />
              <div className="password-input-main">
                <div className="new-password-container">
                  <input
                    value={newPassword}
                    type="password"
                    placeholder="Enter your new password"
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <input
                    value={newPasswordConfirm}
                    type="password"
                    placeholder="Enter your new password again"
                    onChange={(e) => setNewPasswordConfirm(e.target.value)}
                  />
                </div>
                <div className="buttons">
                  <button
                    onClick={() =>
                      requestPasswordChange(newPassword, newPasswordConfirm)
                    }
                  >
                    Change Password
                  </button>
                </div>
              </div>
              {confirmationResponse && (
                <div
                  className={isErr ? "error-response" : "confirmation-response"}
                >
                  {confirmationResponse}
                </div>
              )}
            </div>
          </div>
          <div className="change-major-ui-container">
            <ChangeMajor />
          </div>
          <div className="">
            <DeleteAccount />
          </div>
          {isAdmin && (
            <div>
              <UserManager />
            </div>
          )}
        </div>
      );
    } else {
      return (
        <div className="password-change-main">
          <Header accountId={user._id} />
          <div className="spacer">&nbsp;</div>
          <div className="password-ui-container">
            <div className="password-header">
              <h2>Change Password</h2>
              <hr />
            </div>
            <div>
              To set a password through the website, click the "Send Link"
              button to receive a link to your email, which you can use to set a
              new password.
            </div>
            <div className="buttons">
              <button
                onClick={() => {
                  requestEmailCode();
                }}
              >
                Send Link
              </button>
            </div>
            {confirmationResponse && (
              <div
                className={isErr ? "error-response" : "confirmation-response"}
              >
                {confirmationResponse}
              </div>
            )}
          </div>
          <div className="change-major-ui-container">
            <ChangeMajor />
          </div>
          <div>
            <DeleteAccount />
          </div>
          {isAdmin && (
            <div>
              <UserManager />
            </div>
          )}
        </div>
      );
    }
  }
};

export default PersonalSettings;
