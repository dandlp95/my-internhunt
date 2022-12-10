import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getApiRoot } from "../utils/getApiRoot";
import Comment from "../components/comment";
import Post from "../components/post";
import InputInterface from "../components/inputInterface";
import { isAuth } from "../utils/isLoggedIn";
import FetchCalls from "../utils/fetchCalls";
import Header from "../components/header";
import Rules from "../components/rules";
import "./PostPage.css";

// Need to add handling for when I get back a 200 but nothing was found, although map would probably take care of this...
const PostPage = () => {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const postId = urlParams.get("postId");

  const [post, setPost] = useState();
  const [postUser, setPostuser] = useState(null);
  const [comments, setComments] = useState([]);
  const [user, setUser] = useState();
  const [sortComments, setSortComments] = useState("Best"); // This will be used to add functionality to sort comments later.
  const [fetchComments, setFetchComments] = useState(true);
  const [commentsLenght, setCommentsLength] = useState(10);
  const [displaySortOptions, setDisplaySortOptions] = useState(false);
  const [activeSortBtn, setActiveSortBtn] = useState("best");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const isLoggedIn = async () => {
      const res = await isAuth();
      if (res.err) {
        if (res.err === "server down") {
          alert("Our servers are down");
          navigate("/");
        } else {
          alert("Please login");
          navigate("/");
        }
      } else {
        const info = await res.json();
        setUser(info);
      }
    };
    isLoggedIn();
  }, []);

  const sort = (sortParam) => {
    const urlParams = new URLSearchParams(window.location.search);
    const postParam = urlParams.get("postId");
    const url = `/post?postId=${postParam}&sort=${sortParam}`;
    navigate(url);
  };

  const postComment = async (comment) => {
    const userData = localStorage.getItem("userData");
    const userDataJSON = JSON.parse(userData);
    const token = userDataJSON.jwt;

    const body = {
      content: comment,
      owner: userDataJSON.userId,
      post: postId,
    };

    const backendCaller = new FetchCalls("/comments/add", "POST", token, body);
    try {
      const response = await backendCaller.protectedBody();
      if (response.ok) {
        setFetchComments(!fetchComments);
      } else {
        const serverErr = await response.json();
        alert(serverErr.message);
      }
    } catch (err) {
      alert("Error processing your request");
    }
  };

  const editContent = async (route, id, bodyContent) => {
    const body = {
      content: bodyContent,
    };
    let userData = localStorage.getItem("userData");
    userData = JSON.parse(userData);
    const fetchCall = new FetchCalls(
      `/${route}/edit/${id}`,
      "PATCH",
      userData.jwt,
      body
    );
    try {
      const response = await fetchCall.protectedBody();
      if (response.ok) {
        const responseJson = await response.json();
        setPost(responseJson);
      } else {
        const serverErr = await response.json();
        alert(serverErr.message);
      }
    } catch (err) {
      alert("Error processing your request");
    }
  };

  const deleteContent = async (route, id, isRedirect) => {
    let userData = localStorage.getItem("userData");
    if (userData) {
      try {
        userData = JSON.parse(userData);
        const fetchCall = new FetchCalls(
          `/${route}/delete/${id}`,
          "DELETE",
          userData.jwt
        );
        const response = await fetchCall.protectedNoBody();
        if (response.ok) {
          if (isRedirect) {
            navigate(`/posts?major=${encodeURI(userData.major)}`);
          } else {
            setFetchComments(!fetchComments);
          }
        } else {
          const serverErr = await response.json();
          alert(serverErr.message);
        }
      } catch (err) {
        alert("Error processing your request.");
      }
    } else {
      alert("Please login");
      navigate("/");
    }
  };

  useEffect(() => {
    const options = {
      method: "GET",
      headers: { "Content-type": "application/json" },
    };

    const deletedUser = {};
    deletedUser.firstName = "[Deleted user]";

    const unexistentPost = {};
    unexistentPost.title = "Bad request title";
    unexistentPost.content = "Bad content";

    const getPost = async () => {
      try {
        const response = await fetch(
          getApiRoot() + "/posts/getById/" + postId,
          options
        );
        if (response.ok) {
          const foundPost = await response.json();
          setPost(foundPost);

          const userId = foundPost.owner;

          const response2 = await fetch(
            getApiRoot() + "/users/getById/" + userId
          );

          if (response2.ok) {
            const foundUser = await response2.json();
            setPostuser(foundUser);
          } else {
            setPostuser(deletedUser);
          }
        } else {
          alert("Post unexistent");
          navigate("/posts");
        }
      } catch (err) {
        alert("Error fetching data");
        navigate("/");
      }
    };
    getPost();
  }, []);

  useEffect(() => {
    const options = {
      method: "GET",
      headers: { "Content-type": "application/json" },
    };

    const getComments = async () => {
      var sortParam;
      const urlParams = new URLSearchParams(window.location.search);

      if (urlParams.get("sort")) sortParam = urlParams.get("sort");

      try {
        const response = await fetch(
          getApiRoot() + "/comments/getByPost/" + postId + `?sort=${sortParam}`,
          options
        );
        if (response.ok) {
          const commentList = await response.json();
          setComments(commentList);
          setCommentsLength(commentList.length);
        } else {
          setComments([]);
        }
      } catch (err) {
        alert("Error fetching comments");
      }
    };

    getComments();
  }, [postId, fetchComments, location]);

  if (postUser && post && comments) {
    return (
      <div className="post-page-main">
        <Header accountId={user} />
        <div class="spacer">&nbsp;</div>
        <div className="main-grid-container">
          <div></div>
          <div className="grid-column-2">
            <Post
              user={postUser}
              post={post}
              editAction={editContent}
              deleteAction={deleteContent}
              commentsNumber={commentsLenght}
              key={commentsLenght}
            />
            <div className="comment-section-container">
              <InputInterface
                placeholder="What are your thoughts?"
                action={postComment}
                buttonText="Comment"
              />
              <div>
                <div className="sort-ui">
                  <div
                    onClick={() => setDisplaySortOptions(!displaySortOptions)}
                    className="display-options-ui"
                  >
                    <p>
                      Sort By: {sortComments} <i className="arrow down"></i>
                    </p>
                  </div>
                  {displaySortOptions && (
                    <div className="sort-options">
                      <div className="options">
                        <div
                          onClick={() => {
                            sort("best");
                            setActiveSortBtn("best");
                            setDisplaySortOptions(false);
                            setSortComments("Best");
                          }}
                          className={activeSortBtn === "best" ? "active" : " "}
                        >
                          <p>Best</p>
                        </div>
                        <div
                          onClick={() => {
                            sort("new");
                            setActiveSortBtn("new");
                            setDisplaySortOptions(false);
                            setSortComments("New");
                          }}
                          className={activeSortBtn === "new" ? "active" : " "}
                        >
                          <p>New</p>
                        </div>
                        <div
                          onClick={() => {
                            sort("old");
                            setActiveSortBtn("old");
                            setDisplaySortOptions(false);
                            setSortComments("Old");
                          }}
                          className={activeSortBtn === "old" ? "active" : " "}
                        >
                          <p>Old</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <hr />
                {comments.map((comment) => (
                  <div key={comment._id}>
                    <Comment comment={comment} deleteAction={deleteContent} />
                    <hr />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div>
            <Rules />
          </div>
        </div>
      </div>
    );
  }
};

export default PostPage;
