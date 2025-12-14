import React, { useState, useEffect } from "react";
import { useTable } from "react-table";

const AdminResults = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = () => {
    const PORT = import.meta.env.VITE_PORT;
    const API_URL = import.meta.env.VITE_API_URL || `http://localhost:${PORT}`;

    fetch(`${API_URL}/api/search/`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((jsonData) => {
        console.log("Response data:", jsonData); 

        if (jsonData.success && Array.isArray(jsonData.data)) {
          setData(jsonData.data);
        } else {
          console.error("Invalid data format:", jsonData);
          setData([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setError(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const columns = React.useMemo(
    () => [
      {
        Header: "ID",
        accessor: "id",
      },
      {
        Header: "Car Model",
        accessor: "detectedCarModel",
      },
      {
        Header: "Confidence",
        accessor: "confidence",
        Cell: ({ value }) => `${value.toFixed(2)}%`,
      },
      {
        Header: "Created",
        accessor: "createdAt",
        Cell: ({ value }) => new Date(value).toLocaleString(),
      },
    ],
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({
      columns,
      data,
    });

  if (loading) {
    return <div className="adminMenu">Loading...</div>;
  }

  if (error) {
    return (
      <div className="adminMenu">
        <p>Error: {error}</p>
        <button onClick={fetchData}>Retry</button>
      </div>
    );
  }

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
          <img src="./Images/LightLogo.png" alt="No results" />
          <p>No search results yet</p>
        </div>
      )}
    </div>
  );
};

export default AdminResults;
