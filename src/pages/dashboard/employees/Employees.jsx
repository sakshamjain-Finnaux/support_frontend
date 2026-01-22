import React, { useMemo } from 'react'
import TableView from '../../../components/table_view/TableView';
import { useData } from '../../../contexts/DataContext';
import { RefreshIcon, PlusIcon } from '../../../assets/Icons/Icons';
import { useQuery } from '@tanstack/react-query';
import Button from '../../../components/ui/button/Button';
import { Link } from 'react-router-dom';
import ActionMenu from '../../../components/action_menu/ActionMenu';
import usePageReducer from '../../../reducers/PageReducer';


export default function Employees() {

  const [{ queryPageIndex, queryPageSize }, dispatch] = usePageReducer();

  const { networkRequest } = useData();


  const columns = useMemo(() => (
    [
      {
        Header: "Employee Id",
        accessor: "emp_id"
      },
      {
        Header: "Name",
        accessor: "first_name"
      },
      {
        Header: "Designation",
        accessor: "designation"
      },
      {
        Header: "Phone",
        accessor: "primary_phone"
      },
      {
        Header: "Email",
        accessor: "email"
      },
      {
        Header: "Action",
        accessor: "action"
      }


    ]
  ), []);

  async function fetchData(pageIndex, pageSize) {
    const result = await networkRequest("get_employees", { pageIndex, pageSize });
    if (!result.success) throw result;
    return result.data;
  }


  const query = useQuery({
    queryKey: ["employees", queryPageIndex, queryPageSize],
    queryFn: fetchData.bind(null, queryPageIndex, queryPageSize),
  })

  const data = useMemo(() => {

    const data = query.data?.rows.map(row => {
      row = { ...row };
      row["action"] = (
        <ActionMenu>

          {/* <div> */}
          <Link
            className='w-full text-center'
            to={"/employees/edit/" + row.emp_id}
          >
            Edit Details
          </Link>
          {/* </div> */}


        </ActionMenu>
      )
      return row;
    });

    return data;
  }, [query.data]);

  return (
    <div className='flex flex-grow w-full gap-4 flex-col'>
      {!(query.isFetching) &&
        <div className='inline-flex ml-auto gap-4 text-xs'>

          <Link to="/employees/add">
            <Button
              variant='blue'
              className=""
            >
              Add Employee<PlusIcon />
            </Button>
          </Link>

          <Button
            className=""
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
          dispatch,
          hasmore: query.data?.hasmore
        }}
      />
    </div>
  )
}
