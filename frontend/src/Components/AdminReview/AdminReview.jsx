import React, { useState, useEffect } from "react";
import { useTable } from "react-table";

const AdminReview = () => {
  const [data, setData] = useState([]);

  const fetchData = () => {
    const PORT = import.meta.env.VITE_PORT;

    fetch(`http://localhost:${PORT}/api/review/`)
      .then((response) => response.json())
      .then((jsonData) => {
        if (Array.isArray(jsonData)) {
          setData(jsonData);
        } else {
          setData([]);
        }
      })
      .catch((error) => console.error("Error fetching data:", error));
  };


  useEffect(() => {
    fetchData();
  }, []);

  const columns = React.useMemo(
    () => [
      {
        Header: "User",
        accessor: "user.username",
      },
      {
        Header: "Review",
        accessor: "coment",
      },
    ],
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({
      columns,
      data,
    });

  return (
    <div className="adminMenu">
      <table {...getTableProps()} className="table2">
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()} key={column.id}>
                  {column.render("Header")}
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

      {data.length === 0 && (
        <div>
          <img src="./Images/LightLogo.png" alt="No reviews" />
          <p>No Review Yet</p>
        </div>
      )}
    </div>
  );
};

export default AdminReview;
