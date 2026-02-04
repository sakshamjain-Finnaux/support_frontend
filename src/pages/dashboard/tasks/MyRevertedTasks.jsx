import React, { useMemo } from "react";
import TableView from "../../../components/table_view/TableView";
import useUI from "../../../contexts/UIContext";
import { useData } from "../../../contexts/DataContext";
import { RefreshIcon } from "../../../assets/Icons/Icons";
import { useQuery } from "@tanstack/react-query";
import Button from "../../../components/ui/button/Button";
import ActionMenu from "../../../components/action_menu/ActionMenu";
import IssueTimeLineWithForm from "../issues/IssueTimeLineWithForm";
import usePageReducer from "../../../reducers/PageReducer";

export default function MyRevertedTasks() {
  const [{ queryPageIndex, queryPageSize }, dispatch] = usePageReducer();
  const { networkRequest } = useData();
  const { showInOverlay } = useUI();

  const columns = useMemo(
    () => [
      {
        Header: "S. No.",
        accessor: (row, index) => index + 1,
      },
      {
        Header: "Issue ID",
        accessor: "issue_id",
      },
      {
        Header: "Title",
        accessor: "title",
      },
      {
        Header: "Type",
        accessor: "issue_type",
      },
      {
        Header: "Priority",
        accessor: "priority",
      },
      {
        Header: "Created On",
        accessor: "created_on",
      },
      {
        Header: "Reverted By",
        accessor: "reverted_by",
      },
      {
        Header: "Progress",
        accessor: "progress",
        Cell: ({ value }) => (
          <span
            className={`text-xs px-2 py-1 rounded ${
              value && value.includes("reverted")
                ? "bg-red-600 text-white"
                : value && value.includes("completed")
                  ? "bg-green-600 text-white"
                  : "bg-yellow-600 text-white"
            }`}
          >
            {value || "Pending"}
          </span>
        ),
      },
      {
        Header: "Action",
        accessor: "action",
      },
    ],
    [],
  );

  async function fetchData(pageIndex, pageSize) {
    const result = await networkRequest("user_reverted_tasks", {
      pageIndex,
      pageSize,
    });
    if (!result.success) throw result;
    return result.data;
  }

  const query = useQuery({
    queryKey: ["tasks", "user", "reverted", queryPageIndex, queryPageSize],
    queryFn: fetchData.bind(null, queryPageIndex, queryPageSize),
  });

  const data = useMemo(() => {
    let cur_date = new Date();
    const data = query.data?.rows?.map((row) => {
      row = { ...row };
      row["action"] = (
        <ActionMenu>
          <button
            className="text-white"
            onClick={() =>
              showInOverlay(
                <IssueTimeLineWithForm
                  networkRequest={networkRequest}
                  issueId={row.issue_id}
                />,
              )
            }
          >
            View
          </button>
        </ActionMenu>
      );
      if (cur_date > new Date(row.target_date)) row["variant"] = "red";
      return row;
    });

    return data;
  }, [query.data]);

  return (
    <div className="flex flex-grow w-full gap-4 flex-col">
      {!(query.isLoading || query.isRefetching) && (
        <div className="inline-flex gap-4 text-xs ml-auto">
          <Button
            variant="dark"
            size="sm"
            className="!gap-0"
            onClick={query.refetch}
          >
            Refresh
            <RefreshIcon className="inline ml-1 text-lg" />
          </Button>
        </div>
      )}

      <TableView
        columns={columns}
        data={data}
        isError={query.isError}
        isLoading={query.isFetching}
        refetch={query.refetch}
        tableOptions={{
          isPaginated: true,
          queryPageIndex,
          queryPageSize,
          hasmore: query.data?.hasmore,
          dispatch,
        }}
      />
    </div>
  );
}
