import React from "react";
import { useState, useEffect } from "react";
import { getApiRoot } from "./utils/getApiRoot";
import "./App.css";
import { useNavigate } from "react-router-dom";
import FailMessage from "./components/failMessage";
import { isAuth } from "../src/utils/isLoggedIn";
import Login from "./components/login";
import validateEmail from "./utils/isEmail";

const App = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [major, setMajor] = useState("");
  const [majorsList, setMajorsList] = useState([]);
  const [fail, setFail] = useState(false);
  const [openPopup, setOpenPopup] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = async () => {
      try {
        const response = await isAuth();
        if (response.ok) {
          const userData = localStorage.getItem("userData");
          const userDataJson = JSON.parse(userData);
          const major = userDataJson.major;
          const urlQuery = `?major=${encodeURI(major)}`;
          navigate(`/posts${urlQuery}`);
        }
      } catch (err) {
        setFail("Our servers are down.")
      }
    };
    isLoggedIn();
  }, []);

  useEffect(() => {
    const getMajors = async () => {
      const options = {
        method: "GET",
        headers: { "Content-type": "application/json" },
      };
      try {
        const response = await fetch(getApiRoot() + "/majors", options);
        if (response.ok) {
          const majors = await response.json();
          setMajorsList(majors);
        } else {
          const serverError = await response.json();
          setFail(`Failed to fetch majors: ${serverError.message}`);
        }
      } catch (err) {
        setFail("Failed to connect to the server");
      }
    };
    getMajors();
  }, []);

  const validateForm = () => {
    if (!email) return "Please fill out email input";
    if (!validateEmail(email)) return "Please enter a valid email address";
    if (!password) return "Please input a password";
    if (!firstName) return "Please input your first name";
    if (!lastName) return "Please input your last name";
    if (!major) return "Please input your major.";

    return "valid";
  };

  const handleRegister = async () => {
    const validateFormResult = validateForm();
    if (validateFormResult !== "valid") {
      setFail(validateFormResult);
    } else {
      const options = {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ email, password, firstName, lastName, major }),
      };
      const response = await fetch(getApiRoot() + "/users/add", options);

      if (response.ok) {
        const jsonResponse = await response.json();
        localStorage.setItem(
          "userData",
          JSON.stringify({
            userId: jsonResponse.userId,
            jwt: jsonResponse.token,
            major: jsonResponse.major,
          })
        );
        const userMajor = jsonResponse.major;
        navigate(`/posts?major=${userMajor}`);
      } else {
        const serverError = await response.json();
        setFail(serverError.message);
      }
    }
  };

  const handleCloseLogin = () => {
    setOpenPopup(false);
  };

  return (
    <div className="registrationPage">
      <div className="registration-container">
        <div className="pageInfo">
          <section className="pageInfoSection">
            <h2>Internhunt</h2>
            <ul>
              <li>Network with thousands of students</li>
              <li>Find an internship</li>
              <li>Share your experience</li>
              <li>Help others along the way!</li>
            </ul>
          </section>
        </div>
        <div className="formDiv">
          <form onSubmit={(e) => e.preventDefault()}>
            <div>
              <input
                required
                placeholder="Email"
                type="text"
                name="email"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <input
                required
                type="password"
                name="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div>
              <input
                placeholder="First Name"
                required
                type="text"
                name="firstName"
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>

            <div>
              <input
                placeholder="Last name"
                required
                type="text"
                name="lastName"
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>

            <div>
              <input
                placeholder="Choose a major"
                required
                type="text"
                list="majors"
                onChange={(e) => {
                  setMajor(e.target.value);
                }}
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
            <input type="submit" value="Register" onClick={handleRegister} />
            <p>
              Already have an account?{" "}
              <a href="javascript:;" onClick={(e) => setOpenPopup(true)}>
                Click here.
              </a>
            </p>
            {fail && <FailMessage message={fail} />}
          </form>
        </div>
        {openPopup && <Login action={handleCloseLogin} />}
      </div>
    </div>
  );
};

export default App;
