export function generatePaginatedURL(url, pageData) {
  const { pageSize, pageIndex, searchText } = pageData || {
    pageSize: 10,
    pageIndex: 0,
  };
  const offset = pageSize * pageIndex; // not right: this is bug, lol
  let newUrl = url + `?offset=${pageIndex}&limit=${pageSize}`;
  if (searchText) {
    newUrl += `&search=${searchText}`;
  }
  return newUrl;
}

export function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
}
