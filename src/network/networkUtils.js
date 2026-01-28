export function generatePaginatedURL(url, pageData) {
  const { pageSize, pageIndex } = pageData || { pageSize: 10, pageIndex: 0 };
  const offset = pageSize * pageIndex; // not right: this is bug, lol
  return url + `?offset=${pageIndex}&limit=${pageSize}`;
}
