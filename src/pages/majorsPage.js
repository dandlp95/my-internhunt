import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import FetchCalls from "../utils/fetchCalls";
import Header from "../components/header";
import { isAuth } from "../utils/isLoggedIn";
import Card from "../components/card";
import "./majorsPage.css";
import LoadingSpinner from "../components/loadingSpin";

const MajorsPage = () => {
  const [majors, setMajors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [user, setUser] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const handleDepartmentClick = async (departmentId) => {
    // Change this so that the obtained data is filtered instead of making a call every time...
    const fetchData = new FetchCalls(
      `/majors/getByDepartment/${departmentId}`,
      "GET"
    );
    const data = await fetchData.publicGet();
    setMajors(await data.json());
  };

  useEffect(() => {
    const isLoggedIn = async () => {
      const res = await isAuth();
      if (res.ok) {
        const userData = localStorage.getItem("userData");
        const userDataJson = JSON.parse(userData);
        setUser(userDataJson.userId);
      } else if (res.err === "server down") {
        alert("Our servers are down");
        navigate("/");
      } else {
        alert("Please log in");
        navigate("/");
      }
    };

    const getMajors = async () => {
      try {
        const fetchData = new FetchCalls("/majors", "GET");
        const data = await fetchData.publicGet();
        setMajors(await data.json());
        setIsLoading(false);
      } catch (err) {
        alert("Error processing request");
        navigate("/");
      }
    };
    const getByDepartments = async () => {
      try {
        const fetchData = new FetchCalls("/departments", "GET");
        const data = await fetchData.publicGet();
        setDepartments(await data.json());
      } catch (err) {
        alert("Error processing request");
        navigate("/");
      }
    };
    getMajors();
    getByDepartments();
    isLoggedIn();
  }, []);

  return (
    <div className="majors-main">
      <Header accountId={user} />
      <div className="spacer">&nbsp;</div>

      {!isLoading ? (
        <div className="majors-grid">
          <div className="department-options">
            <h3>Departments</h3>
            <div className="departments-list-container">
              {departments.map((department) => (
                <div key={department._id} className="department-option">
                  <div onClick={() => handleDepartmentClick(department._id)}>
                    {department.name}
                  </div>
                  <div className="department-option-line">
                    <hr />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="majors-grid-two">
            {majors.map((major) => (
              <div className="card-link-container">
                <Link
                  to={`/posts?major=${encodeURI(major.name)}`}
                  key={major._id}
                >
                  <Card major={major} key={major._id} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <LoadingSpinner />
      )}
    </div>
  );
};

export default MajorsPage;
