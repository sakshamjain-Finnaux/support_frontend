import React, { useMemo } from "react";
import TableView from "../../../../components/table_view/TableView";
import useUI from "../../../../contexts/UIContext";
import { useData } from "../../../../contexts/DataContext";
import { RefreshIcon } from "../../../../assets/Icons/Icons";
import { useQuery } from "@tanstack/react-query";
import Button from "../../../../components/ui/button/Button";
import IssueTimeLineView from "../IssueTimeLineView";
import ActionMenu from "../../../../components/action_menu/ActionMenu";
import usePageReducer from "../../../../reducers/PageReducer";

export default function ClientsResolvedIssues() {
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
        Header: "Created By",
        accessor: "username",
      },
      {
        Header: "Company",
        accessor: "company",
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
        Header: "Created On",
        accessor: "created_on",
      },
      {
        Header: "Resolved On",
        accessor: "resolved_on",
      },
      {
        Header: "Action",
        accessor: "action",
      },
    ],
    [],
  );

  async function fetchData(pageIndex, pageSize) {
    console.log("pageIndex", pageIndex);
    console.log("pageSize", pageSize);

    const result = await networkRequest("clients_resolved_issues", {
      pageIndex,
      pageSize,
    });
    if (!result.success) throw result;
    return result.data;
  }

  const query = useQuery({
    queryKey: ["issues", "clients", "resolved", queryPageIndex, queryPageSize],
    queryFn: fetchData.bind(null, queryPageIndex, queryPageSize),
  });

  const data = useMemo(() => {
    const data = query.data?.rows.map((row) => {
      row = { ...row };
      row["action"] = (
        <ActionMenu>
          <button
            onClick={() =>
              showInOverlay(
                <IssueTimeLineView
                  networkRequest={networkRequest}
                  issueId={row.issue_id}
                />,
                false,
              )
            }>
            View
          </button>
        </ActionMenu>
      );
      return row;
    });

    return data;
  }, [query.data]);

  return (
    <div className="flex flex-grow w-full gap-4 flex-col">
      {!(query.isLoading || query.isRefetching) && (
        <div className="inline-flex ml-auto gap-4 text-xs">
          <Button onClick={query.refetch}>
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
          dispatch,
          hasmore: query.data?.hasmore,
        }}
      />
    </div>
  );
}
