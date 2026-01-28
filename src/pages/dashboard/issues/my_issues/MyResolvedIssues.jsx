import React, { useMemo } from "react";
import TableView from "../../../../components/table_view/TableView";
import useUI from "../../../../contexts/UIContext";
import { useData } from "../../../../contexts/DataContext";
import { RefreshIcon, PlusIcon } from "../../../../assets/Icons/Icons";
import { useQuery } from "@tanstack/react-query";
import Button from "../../../../components/ui/button/Button";
import ActionMenu from "../../../../components/action_menu/ActionMenu";
import usePageReducer from "../../../../reducers/PageReducer";
import IssueTimeLineView from "../IssueTimeLineView";
import CreateIssue from "../CreateIssue";

export default function MyResolvedIssues() {
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
    const result = await networkRequest("user_resolved_issues", {
      pageIndex,
      pageSize,
    });
    if (!result.success) throw result;
    return result.data;
  }

  const query = useQuery({
    queryKey: ["issues", "user", "resolved", queryPageIndex, queryPageSize],
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
        <div className="inline-flex gap-4 text-xs ml-auto">
          <Button
            variant="blue"
            size="sm"
            className="!gap-1"
            onClick={() =>
              showInOverlay(
                <CreateIssue networkRequest={networkRequest} />,
                false,
              )
            }>
            New Issue
            <PlusIcon />
          </Button>

          <Button size="sm" variant="dark" onClick={query.refetch}>
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
