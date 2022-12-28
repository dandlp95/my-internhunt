import React, { useEffect, useState } from "react";
import FetchCalls from "../utils/fetchCalls";
import { getApiRoot } from "../utils/getApiRoot";
import "./changeMajor.css";

const ChangeMajor = () => {
  var userData = JSON.parse(localStorage.getItem("userData"));
  var localStorageMajor;
  if (!userData.major || userData.major === "null") {
    localStorageMajor = null;
  } else {
    localStorageMajor = userData.major;
  }

  const [major, setMajor] = useState(localStorageMajor);
  const [edit, setEdit] = useState(false);
  const [majorsList, setMajorsList] = useState([]);

  const requestMajorChange = async () => {
    const backendCaller = new FetchCalls(
      `/users/edit/${userData.userId}`,
      "PATCH",
      userData.jwt,
      { major: major }
    );
    const response = await backendCaller.protectedBody();
    if (response.ok) {
      const responseData = await response.json();
      var userData2 = localStorage.getItem("userData");
      if (userData2) {
        userData2 = JSON.parse(userData2);
        userData2.major = responseData.major;
        localStorage.setItem("userData", JSON.stringify(userData2));
      }
      alert("Your major has been changed.");
    } else {
      const backendError = await response.json();
      alert(backendError.message);
      setMajor(localStorageMajor);
    }
    setEdit(false);
  };

  const handleCancel = () => {
    setMajor(localStorageMajor);
    setEdit(false);
  };

  useEffect(() => {
    const getMajors = async () => {
      const options = {
        method: "GET",
        headers: { "Content-type": "application/json" },
      };
      const response = await fetch(getApiRoot() + "/majors", options);
      var majors;
      if (response.ok) {
        majors = await response.json();
      }
      setMajorsList(majors);
    };
    getMajors();
  }, [edit]); // Use this use effect to get a list of majors and add it to the drop down menu
  if (!edit) {
    return (
      <div className="change-major-main">
        <div className="change-major-title">
          <h2>Change your Major</h2>
          <hr />
        </div>
        <div className="change-major-input">
          <input value={major ? major : "--No major declared--"} disabled />
          <div className="change-major-button-container">
            <button onClick={(e) => setEdit(true)}>Change Major</button>
          </div>
        </div>
      </div>
    );
  } else if (edit && majorsList) {
    return (
      <div className="change-major-main">
        <div className="change-major-title">
          <h2>Change your Major</h2>
          <hr />
        </div>
        <div className="change-major-input">
          <div>
            <input
              value={major ? major : setMajor(" ")}
              onChange={(e) => setMajor(e.target.value)}
              list="majors"
            />
          </div>
          <datalist id="majors">
            {majorsList.map((major) => (
              <option
                data-value={major._id}
                value={major.name}
                key={major._id}
              />
            ))}
          </datalist>
          <div className="change-major-button-container">
            <button onClick={() => requestMajorChange()}>Save</button>
            <button onClick={() => handleCancel()}>Cancel</button>
          </div>
        </div>
      </div>
    );
  }
};

export default ChangeMajor;
