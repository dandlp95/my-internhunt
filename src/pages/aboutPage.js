import React from "react";
import Header from "../components/header";
import about from "../utils/about.json";
import "./aboutPage.css#";

const AboutPage = () => {

  return (
    <div>
      <Header/>
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
