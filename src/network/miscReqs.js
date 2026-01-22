import URL from './url';
import makeRequest from "./makeRequest";
const miscReqs = {};


miscReqs.getIndianStates = async () => {
    const result = await miscRequest("GET", "states");
    return result;
};

async function miscRequest(method, endpoint, body = {}) {
    const url = `${URL}/${endpoint}`;
    const headers = {
        "Content-Type": "application/json",
    }
    const result = await makeRequest(method, url, headers, body);
    return result;
}



export default miscReqs;