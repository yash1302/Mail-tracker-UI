const Table = ({ columns, data }) => {
  return (
    <table className="w-full bg-white shadow rounded-lg">

      <thead className="bg-gray-100">
        <tr>
          {columns.map((col) => (
            <th key={col} className="p-3 text-left text-sm">
              {col}
            </th>
          ))}
        </tr>
      </thead>

      <tbody>

        {data.map((row, index) => (
          <tr key={index} className="border-t">

            {Object.values(row).map((cell, i) => (
              <td key={i} className="p-3 text-sm">
                {cell}
              </td>
            ))}

          </tr>
        ))}

      </tbody>

    </table>
  );
};

export default Table;