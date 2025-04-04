const Table = ({ data }) => (
      <div className="overflow-x-auto my-6">
        <table className="min-w-full table-auto border-separate border-spacing-0">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-700">ID</th>
              <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-700">Name</th>
              <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-700">Age</th>
              <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-700">Country</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border-b text-sm text-gray-800">{row.id}</td>
                <td className="px-4 py-2 border-b text-sm text-gray-800">{row.name}</td>
                <td className="px-4 py-2 border-b text-sm text-gray-800">{row.age}</td>
                <td className="px-4 py-2 border-b text-sm text-gray-800">{row.country}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
    export default Table;