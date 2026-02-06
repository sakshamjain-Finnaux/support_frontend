import React, { useMemo, useState } from "react";
import TableView from "../../../components/table_view/TableView";
import { useData } from "../../../contexts/DataContext";
import { RefreshIcon, PlusIcon } from "../../../assets/Icons/Icons";
import { useQuery } from "@tanstack/react-query";
import Button from "../../../components/ui/button/Button";
import { Link } from "react-router-dom";
import ActionMenu from "../../../components/action_menu/ActionMenu";
import usePageReducer from "../../../reducers/PageReducer";

export default function Employees() {
  const [searchText, setSearchText] = useState("");
  const [debouncedSearchText, setDebouncedSearchText] = useState("");
  const [{ queryPageIndex, queryPageSize }, dispatch] = usePageReducer();

  const { networkRequest } = useData();

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchText(searchText);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchText]);

  const columns = useMemo(
    () => [
      {
        Header: "Employee Id",
        accessor: "emp_id",
      },
      {
        Header: "Name",
        accessor: "first_name",
      },
      {
        Header: "Designation",
        accessor: "designation",
      },
      {
        Header: "Phone",
        accessor: "primary_phone",
      },
      {
        Header: "Email",
        accessor: "email",
      },
      {
        Header: "Action",
        accessor: "action",
      },
    ],
    [],
  );

  async function fetchData(pageIndex, pageSize, searchText) {
    const result = await networkRequest("get_employees", {
      pageIndex,
      pageSize,
      searchText,
    });
    if (!result.success) throw result;
    return result.data;
  }

  const query = useQuery({
    queryKey: ["employees", queryPageIndex, queryPageSize, debouncedSearchText],
    queryFn: fetchData.bind(
      null,
      queryPageIndex,
      queryPageSize,
      debouncedSearchText,
    ),
  });

  const data = useMemo(() => {
    const data = query.data?.rows.map((row) => {
      row = { ...row };
      row["action"] = (
        <ActionMenu>
          {/* <div> */}
          <Link
            className="w-full text-center"
            to={"/employees/edit/" + row.emp_id}
          >
            Edit Details
          </Link>
          {/* </div> */}
        </ActionMenu>
      );
      return row;
    });

    return data;
  }, [query.data]);

  return (
    <div className="flex flex-grow w-full gap-4 flex-col">
      {!query.isFetching && (
        <div className="flex flex-col sm:flex-row justify-between gap-4 text-xs">
          <input
            type="text"
            className="border-2 bg-body-940 rounded-lg p-2 focus:ring-1 ring-opacity-50 ring-offset-1 ring-offset-transparent outline-none placeholder:text-body-500 border-body-700 hover:border-body-800 ring-primary-700 w-full sm:w-64"
            placeholder="Search..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <div className="inline-flex ml-auto gap-4">
            <Link to="/employees/add">
              <Button variant="blue" className="">
                Add Employee
                <PlusIcon />
              </Button>
            </Link>

            <Button className="" onClick={query.refetch}>
              Refresh
              <RefreshIcon className="inline ml-1 text-lg" />
            </Button>
          </div>
        </div>
      )}

      <TableView
        searchText={searchText}
        columns={columns}
        data={data}
        isError={query.isError}
        isLoading={query.isFetching}
        refetch={query.refetch}
        tableOptions={{
          isPaginated: true,
          queryPageIndex,
          queryPageSize,
          dispatch,
          hasmore: query.data?.hasmore,
        }}
      />
    </div>
  );
}
