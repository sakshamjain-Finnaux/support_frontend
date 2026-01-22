import React, { useMemo } from 'react'
import TableView from '../../../components/table_view/TableView';
import useUI from '../../../contexts/UIContext';
import { useData } from '../../../contexts/DataContext';
import { RefreshIcon } from '../../../assets/Icons/Icons';
import { useQuery } from '@tanstack/react-query';
import Button from '../../../components/ui/button/Button';
import ActionMenu from '../../../components/action_menu/ActionMenu';
import usePageReducer from '../../../reducers/PageReducer';
import IssueTimeLineView from '../issues/IssueTimeLineView';

export default function MyAssignedTasks() {

    const [{ queryPageIndex, queryPageSize }, dispatch] = usePageReducer();
    const { networkRequest } = useData();
    const { showInOverlay } = useUI();

    const columns = useMemo(() => (
        [
            {
                Header: "Issue ID",
                accessor: "issue_id"
            },
            {
                Header: "Title",
                accessor: "title"
            },
            {
                Header: "Type",
                accessor: "issue_type"
            },
            {
                Header: "Priority",
                accessor: "priority"
            },
            {
                Header: "Assigned To",
                accessor: "assigned_to"
            },
            {
                Header: "Created On",
                accessor: "created_on"
            },
            {
                Header: "Action",
                accessor: "action"
            }

        ]
    ), []);

    async function fetchData(pageIndex, pageSize) {
        const result = await networkRequest("user_assigned_tasks", { pageIndex, pageSize });
        if (!result.success) throw result;
        return result.data;
    }

    const query = useQuery({
        queryKey: ["tasks", "user", "assigned", queryPageIndex, queryPageSize],
        queryFn: fetchData.bind(null, queryPageIndex, queryPageSize),
    })

    const data = useMemo(() => {
        let cur_date = new Date();
        const data = query.data?.rows?.map(row => {
            row = { ...row };
            row["action"] = (
                <ActionMenu>

                    <button
                        onClick={() => showInOverlay(<IssueTimeLineView networkRequest={networkRequest} issueId={row.issue_id} />)}
                    >
                        View
                    </button>

                </ActionMenu>
            )
            if (cur_date > new Date(row.target_date)) row["variant"] = "red";
            return row;
        });
        // console.log(data);

        return data;
    }, [query.data]);


    return (
        <div className='flex flex-grow w-full gap-4 flex-col'>
            {!(query.isLoading || query.isRefetching) &&


                <div className='inline-flex gap-4 text-xs ml-auto'>

                    <Button
                        className="!gap-0"
                        onClick={query.refetch}>
                        Refresh<RefreshIcon className='inline ml-1 text-lg' />
                    </Button>
                </div>


            }

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
    )
}
