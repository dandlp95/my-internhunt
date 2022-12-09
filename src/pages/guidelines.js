import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/header";
import { isAuth } from "../utils/isLoggedIn";
import guidelines from "../utils/guidelines.json";
import examples from "../utils/examples.json";
import tips from "../utils/tips.json";
import "./guidelines.css";

const Guidelines = () => {
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
      <div className="guidelines-main">
        <div>
          <h2>Community Standards</h2>
          <div className="communityStandardsIntro">
            <p>
              The Community Standards helps us build a community culture based
              on mutual respect and collaboration
            </p>
            <p>
              Wether you are seeking help, or you generously would like to help
              your peers in their career endeavors, join Internhunt in creating
              a community where all students feel welcome
            </p>
          </div>
          <div className="guidelines">
            <h2>Rules</h2>
            <hr />
            <div className="guidelines-container">
              {guidelines.map((guideline) => (
                <section className="guideline-container">
                  <h3 className="guideline-title">{guideline.title}</h3>
                  <p className="guideline-content">{guideline.content}</p>
                </section>
              ))}
            </div>
            <div className="tips">
              <h2>How to create high-quality content</h2>
              <hr />
              <div className="tips-container">
                {tips.map((tip) => (
                  <section className="tip-container">
                    <h3 className="tip-rule">{tip.rule}</h3>
                    <p className="tip-explanation">{tip.explanation}</p>
                  </section>
                ))}
              </div>
            </div>
            <div className="examples">
              <table className="examplesTable">
                <thead>
                  <th>Friendly</th>
                  <th>Unfriendly</th>
                </thead>
                <tbody>
                  {examples.map((example) => (
                    <tr>
                      <td>{example.friendly}</td>
                      <td>{example.unfriendly}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Guidelines;
