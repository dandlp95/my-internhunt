import { getApiRoot } from "./getApiRoot";

export const isAuth = async () => {
  var response = {};
  response.ok = false;

  try {
    const userData = localStorage.getItem("userData");
    if (!userData) {
      response.err = "!userData";
      return response;
    }
    const userDataJson = JSON.parse(userData);
    const token = userDataJson.jwt;
    if (!token) {
      response.err = "!token";
      return response;
    }
    const options = {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    const fetchRes = await fetch(getApiRoot() + "/users/isAuthorized", options);
    return fetchRes;
  } catch (err) {
    response.err = err;
    return response;
  }
};
