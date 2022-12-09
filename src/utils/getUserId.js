import FetchCalls from "./fetchCalls";
// I dont think this function is needed, may delete later...
const getUserById = async () => {
  var response = {};
  response.ok = false;
  const userData = localStorage.getItem("userData");
  if (!userData) {
    return response;
  }
  const userDataJson = JSON.parse(userData);
  const userId = userDataJson.userId;
  if (!userId) {
    return response;
  }
  const callObject = new FetchCalls("/users/getById/" + userId, "GET"); // Once routes are protected, add a thir parameter for the token
  response = await callObject.protectedNoBody();

  return response;
};

export default getUserById;