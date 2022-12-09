import React from "react";
import { useState, useEffect } from "react";
import { getApiRoot } from "./utils/getApiRoot";
import "./App.css";
import { useNavigate } from "react-router-dom";
import FailMessage from "./components/failMessage";
import { isAuth } from "../src/utils/isLoggedIn";
import Login from "./components/login";

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
      const response = await isAuth();
      if (response.ok) {
        const userData = localStorage.getItem("userData");
        const userDataJson = JSON.parse(userData);
        const major = userDataJson.major;
        const urlQuery = `?major=${encodeURI(major)}`;
        navigate(`/posts${urlQuery}`);
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
      const response = await fetch(getApiRoot() + "/majors", options);
      const majors = await response.json();

      setMajorsList(majors);
    };
    getMajors();
  }, []); // Use this use effect to get a list of majors and add it to the drop down menu

  const handleRegister = async () => {
    const options = {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ email, password, firstName, lastName, major }),
    };
    const response = await fetch(getApiRoot() + "/users/add", options);

    if (response.ok) {
      const jsonResponse = await response.json();
      localStorage.setItem("userData", JSON.stringify({
        userId: jsonResponse.userId,
        jwt: jsonResponse.token,
        major: jsonResponse.major
      }));
      const userMajor = jsonResponse.major;

      navigate(`/posts?major=${userMajor}`);
    } else {
      setFail(true);
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
                <option data-value={major._id} value={major.name} key={major._id} />
              ))}
            </datalist>
            <input type="submit" value="Register" onClick={handleRegister} />
            <p>
              Already have an account?{" "}
              <a href="javascript:;" onClick={(e) => setOpenPopup(true)}>
                Click here.
              </a>
            </p>
            {fail && <FailMessage action="register" />}
          </form>
        </div>
        {openPopup && <Login action={handleCloseLogin} />}
      </div>
    </div>
  );
};

export default App;
