import URL from './url';
import makeRequest from "./makeRequest";
const authReqs = {};

authReqs.signin = async (obj) => {
    const result = await authRequest("POST", "login", obj);
    return result;
};

authReqs.signout = async () => {
    const result = await authRequest("GET", "logout");
    return result;
}

async function authRequest(method, endpoint, body = {}) {
    const url = `${URL}/${endpoint}`;
    const headers = {
        "Content-Type": "application/json",
    }
    const response = await makeRequest(method, url, headers, body);
    return response;
}

export default authReqs;