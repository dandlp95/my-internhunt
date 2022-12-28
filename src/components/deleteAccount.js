import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import FetchCalls from "../utils/fetchCalls";
import { getApiRoot } from "../utils/getApiRoot";
import "./deleteAccount.css";

const DeleteAccount = () => {
  const navigate = useNavigate();
  const localStorageUserData = localStorage.getItem("userData");
  const userData = JSON.parse(localStorageUserData);
  const userId = userData.userId;
  const token = userData.jwt;

  const deleteAccount = async () => {
    const backendCaller = new FetchCalls(`/users/delete/${userId}`, "DELETE", token);

    try {
      const response = await backendCaller.protectedNoBody();
      if (response.ok) {
        alert("Account deleted.");
        navigate("/");
      } else {
        alert("Your request could not be processed.");
        console.log(response);
      }
    } catch (err) {
      alert("Your request could not be processed.");
    }
  };
  return (
    <div className="delete-account-container">
      <div className="delete-account-title">
        <h2>Delete Account</h2>
        <hr />
      </div>
      <div className="delete-button-container">
        <button className="delete-button" onClick={() => deleteAccount()}>
          Delete Account
        </button>
      </div>
    </div>
  );
};

export default DeleteAccount;
