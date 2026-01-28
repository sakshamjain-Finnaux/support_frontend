import URL from "./url";
import makeRequest from "./makeRequest";
const userReqs = {};

userReqs.getSubordinates = async () => {
  const result = await userRequest("GET", "user/subordinates");
  return result;
};

async function userRequest(method, endpoint, body = {}) {
  const url = `${URL}/${endpoint}`;
  const headers = {
    "Content-Type": "application/json",
  };
  const result = await makeRequest(method, url, headers, body);
  return result;
}

export default userReqs;
