import getLocalStorage from "./getLocalStorage";
import FetchCalls from "./fetchCalls";

export const editContent = async (route, id, bodyContent, setState) => {
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
  const response = await fetchCall.protectedBody();
  if (response.ok) {
    const responseJson = await response.json();
    setState(responseJson);
  }
};

export const deleteContent = async (route, id, isRedirect, navigateState) => {
  let userData = localStorage.getItem("userData");
  userData = JSON.parse(userData);
  const fetchCall = new FetchCalls(
    `/${route}/delete/${id}`,
    "DELETE",
    userData.jwt
  );
  const response = await fetchCall.protectedNoBody();
  if (response.ok) {
    if (isRedirect) {
      navigateState(`/posts?major=${encodeURI(userData.major)}`);
    }
  } else {
    alert("error deleting the post");
  }
};
