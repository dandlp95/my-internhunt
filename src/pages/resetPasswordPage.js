import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import FetchCalls from "../utils/fetchCalls";
import Header from "../components/header";
import PasswordInput from "../components/passwordInput";
import "./resetPasswordPage.css";
import ServerDown from "../components/serverDown";

const ResetPasswordPage = () => {
  const [message, setMessage] = useState();
  const [isServerDown, setIsServerDown] = useState(false)
  const navigate = useNavigate();

  const requestPasswordChange = async (password, passwordConfirmation) => {
    if (password && passwordConfirmation) {
      setMessage(null);
      if (password === passwordConfirmation) {
        setMessage(null);
        const urlParams = new URLSearchParams(window.location.search);
        const verificationCode = urlParams.get("code");

        const backendCaller = new FetchCalls(
          "/users/approve-password-reset",
          "PATCH",
          null,
          { verificationCode, password }
        );
        try {
          const response = await backendCaller.publicBody();

          if (response.ok) {
            alert("Password Successfully changed, please login.");
            navigate("/");
          } else {
            const responseJson = await response.json();
            setMessage(responseJson.message);
          }
        } catch (err) {
          setIsServerDown(true)
        }
      } else {
        setMessage("Passwords do not match");
      }
    } else {
      setMessage("Please fill out both fields");
    }
  };

  return (
    <div className="reset-password-page">
      <Header />
      <div className="spacer">&nbsp;</div>
      <div className="reset-password-container">
        <h2>Change Password</h2>
        <hr />
        <PasswordInput passwordChange={requestPasswordChange} />
        <div className="confirmation-message">
          {message && <div className="confirmation-message">{message}</div>}
        </div>
        {isServerDown && <ServerDown action={setIsServerDown}/>}
      </div>
    </div>
  );
};

export default ResetPasswordPage;
