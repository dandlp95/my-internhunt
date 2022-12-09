import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/header";
import { isAuth } from "../utils/isLoggedIn";
import about from "../utils/about.json";
import "./aboutPage.css#";

const AboutPage = () => {
  const [user, setUser] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = async () => {
      const res = await isAuth();
      if (!res.ok) {
        alert("Please log in");
        navigate("/");
      } else {
        const userData = localStorage.getItem("userData");
        const userDataJson = JSON.parse(userData);
        setUser(userDataJson.userId);
      }
    };
    isLoggedIn();
  }, []);

  return (
    <div>
      <Header accountId={user} />
      <div class="spacer">&nbsp;</div>
      <div className="about-page">
        <h2>{about.title}</h2>
        <p>{about.paragraph}</p>
        <p>{about.paragraph2}</p>
        <p>{about.paragraph3}</p>
      </div>
    </div>
  );
};

export default AboutPage;
