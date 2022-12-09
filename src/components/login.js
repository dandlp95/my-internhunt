import React from "react";
import "./login.css";
import { useState, useEffect } from "react";
import { getApiRoot } from "../utils/getApiRoot";
import { useNavigate, Link } from "react-router-dom";
import "./login.css";
import FailMessage from "./failMessage";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import jwtDecode from "jwt-decode";

function Login(props) {
  const [userToken, setUserToken] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fail, setFail] = useState(false);
  const navigate = useNavigate();
  const clientId =
    "774704710261-0486u3ih7ergh0t8iasbbsrmnphbsir2.apps.googleusercontent.com";
  console.log("GOOGLE CLIENT ID: ", process.env.REACT_APP_GOOGLE_CLIENT_ID);
  useEffect(() => {
    const isLoggedIn = async () => {
      const userData = localStorage.getItem("userData");
      if (!userData) {
        return;
      }
      const userDataJson = JSON.parse(userData);
      const token = userDataJson.jwt;
      if (!token) {
        return;
      }
      const options = {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await fetch(
        getApiRoot() + "/users/isAuthorized",
        options
      );

      if (response.ok) {
        const userMajor = userDataJson.major;
        const URLQuery = `?major=${encodeURI(userMajor)}`;
        navigate(`/posts${URLQuery}`);
      }
    };
    isLoggedIn();
  }, []);

  const handleLogin = async () => {
    const options = {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ email, password }),
    };

    const response = await fetch(getApiRoot() + "/users/login", options);

    if (response.ok) {
      const userData = await response.json();

      localStorage.setItem(
        "userData",
        JSON.stringify({
          userId: userData.userId,
          jwt: userData.token,
          major: userData.major,
        })
      );

      const userMajor = userData.major;
      const URLQuery = `?major=${encodeURI(userMajor)}`;
      navigate(`/posts${URLQuery}`);
    } else {
      setFail(true);
    }
  };

  const onSuccess = async (res) => {
    console.log(jwtDecode(res.credential));
    const credentials = jwtDecode(res.credential);
    const options = {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        googleJWT: res.credential,
      }),
    };
    const response = await fetch(
      getApiRoot() + "/users/handleGoogleAuth",
      options
    );
    if (response.ok) {
      const userData = await response.json();
      localStorage.setItem(
        "userData",
        JSON.stringify({
          userId: userData.userId,
          jwt: userData.token,
          major: userData.major,
        })
      );
      var URLQuery;
      if (userData.major) {
        console.log(typeof userData.major);
        const userMajor = userData.major;
        URLQuery = `?major=${encodeURI(userMajor)}`;
      } else {
        URLQuery = "";
      }
      navigate(`/posts${URLQuery}`);
    } else {
      setFail(true);
    }
  };

  const onFailure = (res) => {
    console.log(jwtDecode(res.credential));
  };

  return (
    <div className="loginComponent">
      <div className="loginFormDiv">
        <form onSubmit={(e) => e.preventDefault()}>
          <div
            href="javascript:;"
            onClick={(e) => props.action(e)}
            className="closeBtn"
          >
            X
          </div>
          <h2>Log in into your account</h2>

          <input
            placeholder="Email"
            type="text"
            name="email"
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            placeholder="Password"
            type="text"
            name="password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <input type="submit" value="Submit" onClick={handleLogin} />
          <div className="forgot-password-option">
            <Link to="/forgot-password">Forgot your password?</Link>
          </div>
          <div>
            <div className="google-btn-container">
              <div>Sign in with Google</div>
              <div className="google-btn">
                <GoogleOAuthProvider
                  clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
                >
                  <GoogleLogin
                    onSuccess={onSuccess}
                    onFailure={onFailure}
                  ></GoogleLogin>
                </GoogleOAuthProvider>
              </div>
            </div>
          </div>
          {fail && <FailMessage action="log in" />}
        </form>
      </div>
    </div>
  );
}

export default Login;
