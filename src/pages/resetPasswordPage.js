import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import FetchCalls from "../utils/fetchCalls";
import Header from "../components/header";
import PasswordInput from "../components/passwordInput";
import "./resetPasswordPage.css";

const ResetPasswordPage = () => {
  const [message, setMessage] = useState();
  const navigate = useNavigate();

  const requestPasswordChange = async (password, passwordConfirmation) => {
    if (password && passwordConfirmation) {
      setMessage(null);
      if (password === passwordConfirmation) {
        setMessage(null);
        const urlParams = new URLSearchParams(window.location.search);
        const verificationCode = urlParams.get("code");
        console.log(verificationCode)

        const backendCaller = new FetchCalls(
          "/users/approve-password-reset",
          "PATCH",
          null,
          { verificationCode, password }
        );

        const response = await backendCaller.publicBody();
        console.log(response);

        if (response.ok) {
          alert("Password Successfully changed, please login.");
          navigate("/");
        } else {
          const responseJson = await response.json();
          setMessage(responseJson.message);
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
      <div class="spacer">&nbsp;</div>
      <div className="reset-password-container">
        <h2>Change Password</h2>
        <hr />
        <PasswordInput passwordChangeFunction={requestPasswordChange} />
        <div className="confirmation-message">
          {message && <div className="confirmation-message">{message}</div>}
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
