import React from "react";
import PostPreview from "../components/postPreview";
import Header from "../components/header";
import { useState, useEffect } from "react";
import { getApiRoot } from "../utils/getApiRoot";
import { Link, useNavigate } from "react-router-dom";
import { isAuth } from "../utils/isLoggedIn";
import { useLocation } from "react-router-dom";
import { MdWorkOff, MdRateReview } from "react-icons/md";
import { FaHandsHelping } from "react-icons/fa";
import { GiHelp, GiShinyEntrance } from "react-icons/gi";
import { VscOpenPreview } from "react-icons/vsc";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import { AiFillFire } from "react-icons/ai";
import FetchCalls from "../utils/fetchCalls";
import "./posts.css";
import i from "../assets/plain-logo.png";
import PaginationPage from "../components/paginationPage";
import LoadingSpinner from "../components/loadingSpin";

const MajorsContainer = (props) => {
  const [majors, setMajors] = useState();
  const navigate = useNavigate();

  const getMajors = async () => {
    const userData = localStorage.getItem("userData");
    const jwt = JSON.parse(userData).jwt;
    const apiCaller = new FetchCalls("/majors", "GET", jwt);
    const response = await apiCaller.publicGet();
    if (response.ok) {
      const fetchedMajors = await response.json();
      setMajors(fetchedMajors);
    } else {
      console.log(response);
    }
  };

  const handleMajorClick = (url) => {
    props.styleActiveButton(1);
    navigate(url);
  };

  useEffect(() => {
    getMajors();
  }, []);

  if (majors) {
    return (
      <div className="majors-options">
        {/* <img src={workImg}/> */}
        <h3>Explore other majors</h3>
        <div className="majors-list-container">
          {majors.slice(0, 8).map((major) => (
            <div key={major._id} className="major-option">
              <div
                onClick={(e) => handleMajorClick(`/posts?major=${major.name}`)}
              >
                {major.name}
              </div>
              <div className="major-option-line">
                <hr />
              </div>
            </div>
          ))}
        </div>
        <div className="majors-button-div">
          <button
            onClick={(e) => navigate("/majors")}
            className="majors-button"
          >
            View All Majors
          </button>
        </div>
      </div>
    );
  }
};

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState();
  const [currPage, setCurrPage] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);
  const [numberOfPages, setNumberOfPages] = useState(1);
  const [isdropdownActive, setIsdropdownActive] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeBtn, setActiveBtn] = useState(1);

  const navigate = useNavigate();
  const location = useLocation();

  const getPostByType = async (postType) => {
    setIsLoading(true);
    const urlParams = new URLSearchParams(window.location.search);
    const majorParam = urlParams.get("major");
    const search = urlParams.get("search");

    var searchString = "";
    var majorString = `major=${majorParam}`;
    var postTypeString = "";
    var url;

    if (search) {
      searchString = `&search=${search}`;
    }
    if (postType !== "all") {
      postTypeString = `&type=${postType}`;
    }

    url = `/posts?${majorString}${postTypeString}${searchString}`;

    navigate(url);
  };

  const nextpage = (pageNumber) => {
    setCurrPage(pageNumber);
    setPosts([]);
  };

  const tenChange = (pageNumber, isposOrneg) => {
    var finalPage;
    if (isposOrneg > 0) {
      finalPage = pageNumber + 10;
    } else {
      finalPage = pageNumber - 10;
    }
    setCurrPage(finalPage);
    setPosts([]);
  };

  const hundreadChange = (pageNumber, isposOrneg) => {
    var finalPage;
    if (isposOrneg > 0) {
      finalPage = pageNumber + 100;
    } else {
      finalPage = pageNumber - 100;
    }
    setCurrPage(finalPage);
    setPosts([]);
  };
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const activeType = urlParams.get("type");
    console.log("active type: ", activeType);
    if (!activeType) setActiveBtn(1);
    else if (activeType === "Review") setActiveBtn(2);
    else if (activeType === "Internship opportunity") setActiveBtn(3);
    else if (activeType === "Advise") setActiveBtn(4);
    else if (activeType === "Question") setActiveBtn(5);
  }, []);

  useEffect(() => {
    const isLoggedIn = async () => {
      const res = await isAuth();
      if (!res.ok) {
        alert("Please log in");
        navigate("/");
      } else {
        const userData = localStorage.getItem("userData");
        const userDataJson = JSON.parse(userData);
        const info = await res.json();
        setUser(info);
      }
    };

    isLoggedIn();
  }, []);

  const sortBy = (sortParam) => {
    const urlParams = new URLSearchParams(window.location.search);
    const majorParam = urlParams.get("major");
    const typeParam = urlParams.get("type");
    const search = urlParams.get("search");

    var searchString = "";
    var majorString = `major=${majorParam}`;
    var postTypeString = "";
    var url;

    if (search) searchString = `&search=${search}`;

    if (typeParam) postTypeString = `&type=${typeParam}`;

    url = `/posts?${majorString}${searchString}${postTypeString}&sort=${sortParam}`;
    navigate(url);
  };

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const major = urlParams.get("major");
    const search = urlParams.get("search");
    const type = urlParams.get("type");
    const sort = urlParams.get("sort");

    const getPosts = async () => {
      const options = {
        method: "GET",
        headers: { "Content-type": "application/json" },
      };

      const URIQuery = `search=${search}&major=${major}&type=${type}&sort=${sort}&page=${currPage}`;
      const URIQuery2 = `search=${search}&major=${major}&type=${type}`;
      console.log("URIQUERY: ", URIQuery);
      const response = await fetch(
        getApiRoot() + "/posts/getPosts?" + encodeURI(URIQuery),
        options
      );

      const response2 = await fetch(
        getApiRoot() + "/posts/getPostsCount?" + encodeURI(URIQuery2),
        options
      );
      setIsLoading(false);

      if (response.ok && response2.ok) {
        const foundPosts = await response.json();
        const totalPostsCount = await response2.json();

        setTotalPosts(totalPostsCount.count);
        setPosts(foundPosts);
      } else {
        console.log("something failed", response);
      }
    };
    getPosts();
  }, [location, currPage]);

  useEffect(() => {
    console.log("total posts: ", totalPosts);
    if (totalPosts % 10 === 0) {
      setNumberOfPages(Math.floor(totalPosts / 10));
    } else {
      setNumberOfPages(Math.floor(totalPosts / 10) + 1);
    }
  }, [totalPosts]);

  if (user) {
    return (
      <div className="posts-page">
        <Header />
        <div className="spacer">&nbsp;</div>
        <div className="posts-main">
          <div></div>
          <div className="posts-container">
            <div className="create-post">
              <img src={i} width="75px" />
              <div className="input">
                <Link to={`/create-post`}>
                  <input placeholder="Create post" />
                </Link>
              </div>
            </div>
            <div className="posts-queries">
              <div className="first-button">
                <button
                  className={activeBtn === 1 ? "active-button" : ""}
                  onClick={() => {
                    getPostByType("all");
                    setActiveBtn(1);
                  }}
                >
                  <VscOpenPreview className="icon" /> All Posts
                </button>
              </div>
              <div>
                <button
                  className={activeBtn === 2 ? "active-button" : ""}
                  onClick={() => {
                    getPostByType("Review");
                    setActiveBtn(2);
                  }}
                >
                  <MdRateReview className="icon" />
                  Reviews
                </button>
              </div>
              <div>
                <button
                  className={activeBtn === 3 ? "active-button" : ""}
                  onClick={() => {
                    getPostByType("Internship opportunity");
                    setActiveBtn(3);
                  }}
                >
                  <MdWorkOff className="icon" />
                  Opportunities
                </button>
              </div>
              <div>
                <button
                  className={activeBtn === 4 ? "active-button" : ""}
                  onClick={() => {
                    getPostByType("Advise");
                    setActiveBtn(4);
                  }}
                >
                  <FaHandsHelping className="icon" />
                  Advise
                </button>
              </div>
              <div>
                <button
                  className={activeBtn === 5 ? "active-button" : ""}
                  onClick={() => {
                    getPostByType("Question");
                    setActiveBtn(5);
                  }}
                >
                  <GiHelp className="icon" />
                  Questions
                </button>
              </div>
              <div className="sort-dropdown">
                <BiDotsHorizontalRounded
                  className="dots-icon"
                  onClick={(e) => setIsdropdownActive(!isdropdownActive)}
                />
                {isdropdownActive && (
                  <div className="sort-dropdownOptions">
                    <div className="sort-rating">
                      <button
                        onClick={(e) => {
                          sortBy("rating");
                        }}
                      >
                        <GiShinyEntrance />
                        Popular
                      </button>
                    </div>
                    <div className="sort-new">
                      <button onClick={(e) => sortBy("date")}>
                        <AiFillFire />
                        New
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            {!isLoading ? (
              <div>
                {posts.map((post) => (
                  <div className="post-preview-container" key={post._id}>
                    <PostPreview post={post} />
                  </div>
                ))}
                {totalPosts > 10 && (
                  <PaginationPage
                    pages={numberOfPages}
                    nextPage={nextpage}
                    currentPage={currPage}
                    hundreadChange={hundreadChange}
                    tenChange={tenChange}
                  ></PaginationPage>
                )}
              </div>
            ) : (
              <LoadingSpinner />
            )}
          </div>
          <div className="majors-div">
            <MajorsContainer styleActiveButton={setActiveBtn} />
          </div>
        </div>
      </div>
    );
  }
};

export default Posts;
