import React, { useEffect } from "react";
import { ArrowIcon } from "../../assets/Icons/Icons";

import {
  useTable,
  useSortBy,
  useGlobalFilter,
  usePagination,
} from "react-table";
import { PAGE_CHANGED, PAGE_SIZE_CHANGED } from "../../reducers/PageReducer";
import Button from "../ui/button/Button";

export default function PaginatedTable({
  data,
  columns,
  searchText,
  queryPageIndex,
  queryPageSize,
  dispatch,
  hasmore,
}) {
  columns =
    columns ??
    React.useMemo(
      () =>
        Object.keys(data[0]).map((key) => ({
          Header: key.toUpperCase(),
          accessor: key,
        })),
      [],
    );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
    setGlobalFilter,
  } = useTable(
    {
      columns,
      data,
      initialState: {
        pageIndex: queryPageIndex,
        pageSize: queryPageSize,
      },
      manualPagination: true,
      // pageCount: 9999999, // max value tried (works but laggy)
      pageCount: 999999, //don't know the exact size of data
    },
    useGlobalFilter,
    useSortBy,
    usePagination,
  );

  useEffect(() => {
    setGlobalFilter(searchText);
  }, [searchText]);

  useEffect(() => {
    dispatch({ type: PAGE_CHANGED, payload: pageIndex });
  }, [pageIndex]);

  useEffect(() => {
    dispatch({ type: PAGE_SIZE_CHANGED, payload: pageSize });
    gotoPage(0);
  }, [pageSize]);

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="text-sm max-w-full md:rounded-lg border-2 border-body-800 overflow-x-auto">
        <table className="w-full sm:shadow-sm" {...getTableProps()}>
          <thead className="text-uppercase select-none">
            {headerGroups.map((headerGroup) => (
              <tr
                className="bg-nav text-body-400 font-bold"
                {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => {
                  return (
                    <th
                      {...column.getHeaderProps(
                        column.Header.toLowerCase() === "action" ||
                          column.getSortByToggleProps(),
                      )}
                      className="p-2 text-xs hover:bg-body-800 font-semibold w-10">
                      {column.render("Header")}
                      {column.isSorted ? (
                        <ArrowIcon
                          className={`ml-1 inline text-base duration-200 ${column.isSortedDesc ? "rotate-180" : ""}`}
                        />
                      ) : (
                        ""
                      )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>

          <tbody {...getTableBodyProps()} className="flex-1 sm:flex-none">
            {page.map((row) => {
              prepareRow(row);
              return (
                <tr
                  {...row.getRowProps()}
                  className={`text-center duration-150 hover:bg-body-940 even:bg-body-800 ${row.original.variant == "red" ? "!bg-red-900/20" : ""}`}>
                  {row.cells.map((cell) => {
                    return (
                      <td
                        {...cell.getCellProps()}
                        className="text-sm first:font-medium border border-b-0 border-r-0 border-body-700 py-2 px-2 relative">
                        {cell.render("Cell")}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex ml-auto gap-3 text-xs">
        <select
          className="bg-body-800 text-body-400 p-2 rounded-lg"
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
          }}>
          {[10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>

        <Button onClick={() => previousPage()} disabled={!canPreviousPage}>
          {"< Prev"}
        </Button>

        <Button onClick={() => nextPage()} disabled={!hasmore}>
          {"Next >"}
        </Button>
      </div>
    </div>
  );
}
