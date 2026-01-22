export default async function makeRequest(method, url, headers, body = '') {
    let fetchOptions = {
        method: method.toUpperCase(),
        credentials: "include",
        mode: "cors",
        headers,
    }
    switch (method.toUpperCase()) {
        case "POST":
        case "PUT":
        case "PATCH":
        case "DELETE":
            fetchOptions.body = JSON.stringify(body);
            break;
        default:
            break;
    }
    try {

        const response = await fetch(url, fetchOptions);
        const result = await response.json();
        return result;

    } catch (err) {

        return {
            success: false,
            authenticated: true,
            message: "Internal Server Error"
        }
    }
}