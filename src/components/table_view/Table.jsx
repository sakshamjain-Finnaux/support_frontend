import React, { useEffect } from 'react'
import { ArrowIcon } from '../../assets/Icons/Icons';

import { useTable, useSortBy, useGlobalFilter } from "react-table";


function Table({ data, columns, searchText }) {

    columns = columns ?? React.useMemo(() => (

        Object.keys(data[0]).map(key => (
            {
                Header: key.toUpperCase(),
                accessor: key
            }
        ))
    ), [])




    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow, setGlobalFilter } = useTable({ columns, data }, useGlobalFilter, useSortBy);

    useEffect(() => {
        setGlobalFilter(searchText);
    }, [searchText]);

    return (
        <div className="text-sm max-w-full md:rounded-lg border-2 border-body-800 overflow-x-auto">
            <table className="w-full sm:shadow-sm" {...getTableProps()}>
                <thead className="text-uppercase select-none">
                    {
                        headerGroups.map((headerGroup) => (
                            <tr className='bg-nav text-body-400 font-bold' {...headerGroup.getHeaderGroupProps()}>
                                {headerGroup.headers.map((column) => {
                                    return (
                                        <th
                                            {...column.getHeaderProps(column.Header.toLowerCase() === "action" || column.getSortByToggleProps())}
                                            className='p-2 text-xs hover:bg-body-800 font-semibold w-10'
                                        >
                                            {column.render("Header")}
                                            {column.isSorted ? (<ArrowIcon className={`ml-1 inline text-base duration-200 ${column.isSortedDesc ? "rotate-180" : ""}`} />) : ""}
                                        </th>
                                    )
                                })}
                            </tr>
                        ))
                    }
                </thead>


                <tbody {...getTableBodyProps()} className="flex-1 sm:flex-none">
                    {rows.map((row) => {
                        prepareRow(row);
                        return (
                            <tr {...row.getRowProps()} className='text-center duration-150 hover:bg-body-940 even:bg-body-800'>
                                {row.cells.map((cell) => {
                                    return (
                                        <td
                                            {...cell.getCellProps()}
                                            className="text-sm first:font-medium border border-b-0 border-r-0 border-body-700 py-2 px-2 relative"
                                        >
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
    )
}

export default Table;