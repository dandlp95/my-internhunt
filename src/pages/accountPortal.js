import Header from "../components/header";
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PostPreview from "../components/postPreview";
import FetchCalls from "../utils/fetchCalls";
import CommentPreview from "../components/commentPreview";
import { isAuth } from "../utils/isLoggedIn";
import "./accountPortal.css";
import Empty from "../components/empty";

const defaultProfilePic = `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`;

const AccountPortal = () => {
  const { id } = useParams();
  const [user, setUser] = useState();
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAccountAdmin, setIsAccountAdmin] = useState(false);

  const navigate = useNavigate();

  let userData = localStorage.getItem("userData");
  userData = userData ? JSON.parse(userData) : null;

  var pronoun;
  var owner = false;
  if (id === userData.userId) {
    pronoun = "Your";
    owner = true;
  } else {
    pronoun = "";
  }
  const banUser = async (action) => {
    const backendCaller = new FetchCalls(
      `/users/ban/${user.email}/${action}`,
      "PATCH",
      userData.jwt
    );
    const response = await backendCaller.protectedNoBody();
    if (response.ok) {
      const bannedUser = await response.json();
      console.log("banned user response: ", bannedUser);
      setUser(bannedUser);
    } else {
      alert("Error banning user.");
    }
  };

  useEffect(() => {
    const fetchVisitorInfo = async () => {
      const response = await isAuth();
      if (response.ok) {
        const visitorInfo = await response.json();
        if (visitorInfo.accessLevel === 1) {
          setIsAdmin(true);
        }
      } else if (response.err === "server down") {
        alert("Servers down");
        navigate("/");
      } else {
        alert("Please login");
        navigate("/");
      }
    };
    fetchVisitorInfo();
  }, []);

  useEffect(() => {
    const getUserInfo = async () => {
      var url;
      try {
        if (isAdmin || owner) {
          url = `/users/getByIdPrivate/${id}`;
          const backendApi = new FetchCalls(url, "GET", userData.jwt);
          const response = await backendApi.protectedNoBody();
          if (response.ok) {
            const usersResponse = await response.json();
            setUser(usersResponse);
            if (usersResponse.accessLevel === 1) setIsAccountAdmin(true);
          } else {
            const serverError = await response.json();
            alert(serverError.message);
          }
        } else {
          url = `/users/getById/${id}`;
          const backendApi = new FetchCalls(url, "GET");
          const response = await backendApi.publicGet();
          if (response.ok) {
            const usersResponse = await response.json();
            setUser(usersResponse);
            if (usersResponse.accessLevel === 1) setIsAccountAdmin(true);
          } else {
            const serverError = await response.json();
            alert(serverError.message);
          }
        }
      } catch (err) {}
    };

    const getCommentsByUser = async () => {
      const backendApi = new FetchCalls(
        `/comments/getByUser/${id}`,
        "GET",
        userData.jwt
      );
      try {
        const response = await backendApi.protectedNoBody();
        if (response.ok) {
          const comments = await response.json();
          setComments(comments);
        } else {
          const backendError = await response.json();
          alert(backendError.message);
        }
      } catch (err) {}
    };

    const getUserPosts = async () => {
      const backendApi = new FetchCalls(`/posts/getPostByUser/${id}`, "GET");
      try {
        const response = await backendApi.publicGet();
        if (response.ok) {
          const posts = await response.json();
          setPosts(posts);
        } else {
          const backendErr = await response.json();
          alert(backendErr.message);
        }
      } catch (err) {}
    };

    getUserInfo();
    getUserPosts();
    getCommentsByUser();
  }, [id, isAdmin]);

  const memberSince = "Novermber 1st, 2022";

  if (user) {
    return (
      <div>
        <Header accountId={user._id} />
        <div className="spacer">&nbsp;</div>
        <div className="account-portal-main">
          <div></div>
          <div className="posted-content-container">
            <section className="posts-section">
              <h2>{pronoun} Posts</h2>
              <hr />
              <div>
                {posts.length > 0 ? (
                  <div className="posts-list">
                    {posts.map((post) => (
                      <PostPreview post={post} key={post._id} />
                    ))}
                  </div>
                ) : (
                  <Empty size="small" />
                )}
              </div>
            </section>
            <section className="comments-section">
              <h2>{pronoun} Comments</h2>
              <hr />
              <div>
                {comments.length > 0 ? (
                  <div className="comments-list">
                    {comments.map((comment) => (
                      <div>
                        <CommentPreview comment={comment} key={comment._id} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <Empty size="small" />
                )}
              </div>
            </section>
          </div>
          <section className="account-info">
            <div className="account-info-flexbox">
              <img
                src={`data:image/png;base64, ${defaultProfilePic}`}
                alt="profile"
                width="100px"
              />
              <div className="info">
                <p>
                  {user.firstName} {user.lastName}
                </p>
                <p>Member since {memberSince}</p>
                <p>
                  {user.major ? user.major.name : <div>No declared major</div>}
                </p>
              </div>
            </div>
            {owner && (
              <div className="buttons">
                <button onClick={(e) => navigate("/account-settings")}>
                  Personal Settings
                </button>
              </div>
            )}
            {isAccountAdmin && (
              <div className="admin-status">Moderator Account</div>
            )}
            {isAdmin && !owner && (
              <div>
                <div>
                  {user.active ? (
                    <div>Account Status: Active</div>
                  ) : (
                    <div>Account Status: Inactive</div>
                  )}
                </div>
                <div className="ban-button">
                  {user.active ? (
                    <button onClick={() => banUser("false")}>Ban User</button>
                  ) : (
                    <button onClick={() => banUser("true")}>
                      Remove User Ban
                    </button>
                  )}
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    );
  }
};

export default AccountPortal;
