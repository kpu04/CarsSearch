import React, { useState, useEffect } from "react";
import { useTable, useSortBy, usePagination } from "react-table";

import "./AdminCatalog.css";
const AdminMenu = () => {
  const [dishes, setDishes] = useState([]);


  const fetchDishes = () => {
    const PORT = import.meta.env.VITE_PORT;

    fetch(`http://localhost:${PORT}/api/car/`)
      .then((response) => response.json())
      .then((jsonData) => {
        if (Array.isArray(jsonData)) {
          setDishes(jsonData);
        } else {
          console.error("Received data is not an array:", jsonData);
          setDishes([]);
        }
      })
      .catch((error) => console.error("Error fetching dishes:", error));
  };


  useEffect(() => {
    fetchDishes();
  }, []);

  const columns = React.useMemo(
    () => [
      { Header: "Brand", accessor: "brand" },
      { Header: "Model", accessor: "model" },
      { Header: "Year", accessor: "year" },
      { Header: "engineVolume", accessor: "engineVolume" },
      { Header: "Transmission", accessor: "transmission" },
      { Header: "Fuel", accessor: "fuelType" },
      { Header: "Mileage", accessor: "mileage" },
      { Header: "Price", accessor: "price" },
    ],
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable(
      {
        columns,
        data: dishes,
        initialState: { pageIndex: 0 },
      },
      useSortBy,
      usePagination
    );

  return (
    <div className="adminMenu">
      <table {...getTableProps()} className="table">
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
              {headerGroup.headers.map((column) => (
                <th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  key={column.id}
                >
                  {column.render("Header")}
                  <span>
                    {column.isSorted
                      ? column.isSortedDesc
                        ? " 🔽"
                        : " 🔼"
                      : ""}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()} key={row.id}>
                {row.cells.map((cell) => (
                  <td {...cell.getCellProps()} key={cell.column.id}>
                    {cell.render("Cell")}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
{}
    </div>
  );
};

export default AdminMenu;
