export function generatePaginatedURL(url, pageData) {
    const { pageSize, pageIndex } = pageData || { pageSize: 10, pageIndex: 0 };
    const offset = pageSize * pageIndex;
    return (url + `?offset=${offset}&limit=${pageSize}`);
}
