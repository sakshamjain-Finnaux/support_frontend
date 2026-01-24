import Table from "./Table";
import Spinner from "../ui/spinner/Spinner";
import PaginatedTable from "./PaginatedTable";
import { useEffect } from "react";
export default function TableView({
  refetch,
  data,
  isLoading,
  isError,
  columns,
  searchText = "",
  tableOptions = {
    hasmore: false,
    isPaginated: false,
    queryPageIndex: 0,
    queryPageSize: 10,
    dispatch: () => {},
  },
}) {
  //if all issues are deleted from a page then send user to previous page
  useEffect(() => {
    if (tableOptions.queryPageIndex > 0 && data?.length === 0) {
      tableOptions.dispatch({
        type: "PAGE_CHANGED",
        payload: tableOptions.queryPageIndex - 1,
      });
    }
  }, [data]);

  if (isLoading) return <Spinner />;

  if (isError) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center text-center">
        <p className="text-body-400 font-medium text-2xl">
          Failed to fetch data!
        </p>
        <button
          type="button"
          onClick={refetch}
          className="underline hover:text-body-500 cursor-pointerz">
          Retry
        </button>
      </div>
    );
  }
  console.log("yeh naya wala data", data);
  return data?.length ? (
    tableOptions.isPaginated ? (
      <PaginatedTable
        queryPageIndex={tableOptions.queryPageIndex}
        queryPageSize={tableOptions.queryPageSize}
        dispatch={tableOptions.dispatch}
        hasmore={tableOptions.hasmore}
        searchText={searchText}
        data={data}
        columns={columns}
      />
    ) : (
      <Table searchText={searchText} data={data} columns={columns} />
    )
  ) : (
    <div className="flex-grow flex flex-col items-center justify-center text-center">
      <p className="text-body-300 font-medium text-2xl">No data to display.</p>
      <button
        type="button"
        onClick={refetch}
        className="underline hover:text-body-500 cursor-pointer">
        Refresh
      </button>
    </div>
  );
}
