import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./header.css";
import altlogo from "../assets/alt3.png";
import { SlMagnifier } from "react-icons/sl";

const Header = (props) => {
  const [searchQuery, setSearchQuery] = useState("");
  const userData = localStorage.getItem("userData");
  const userDataJson = JSON.parse(userData);
  const navigate = useNavigate();

  const searchPost = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const majorParam = urlParams.get("major");
    
    navigate(
      `/posts?major=${encodeURI(majorParam)}&search=${encodeURI(
        searchQuery
      )}`
    );
  };

  const isKeyEntered = (e) => {
    if (!e) e = window.event;
    var keyCode = e.code || e.key;
    if (keyCode === "Enter") {
      searchPost();
    }
  };

  const handleSignout = (e) => {
    localStorage.removeItem("userData");
    navigate("/");
  };

  return (
    <div className="header-component">
      <header>
        <div className="headerflex logo">
          {userDataJson ? (
            <Link to={`/posts?major=${encodeURI(userDataJson.major)}`}>
              <img src={altlogo} alt="transparent-logo" width="200px" />
            </Link>
          ) : (
            <img src={altlogo} alt="transparent-logo" width="200px" />
          )}
        </div>
        <div className="headerflex header-about">
          <Link to={`/about`}>
            <p>About</p>
          </Link>
        </div>
        <div className="headerflex header-guidelines">
          <Link to={`/guidelines`}>
            <p>Community Guidelines</p>
          </Link>
        </div>
        <div className="headerflex searchBar">
          <div className="search-icon">
            <SlMagnifier className="magnifying-glass"/>
          </div>
          <input
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => isKeyEntered(e)}
            placeholder="Search Internhunt"
            disabled={!userDataJson}
          />
        </div>
        <div className="headerflex header-account">
          {userData ? (
            <Link to={`/account-portal/${userDataJson.userId}`}>
              <p>Account</p>
            </Link>
          ) : (
            <Link to={"/"}>Login</Link>
          )}
        </div>

        <div className="sign-out-div">
          {userDataJson && (
            <button onClick={(e) => handleSignout(e)}>Sign out</button>
          )}
        </div>
      </header>
    </div>
  );
};

export default Header;
