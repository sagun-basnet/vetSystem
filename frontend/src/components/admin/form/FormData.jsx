import axios from "axios";
import React, { useEffect, useState } from "react";

const FormData = () => {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState([]);
  const [id, setId] = useState(null);

  const fetchData = async () => {
    try {
      const res = await axios.get("http://localhost:5050/api/form-data");
      setData(res.data.formResponses);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="flex-1 shadow-lg shadow-gray-300 rounded-md px-6 py-4">
      <h1 className="font-semibold text-[26px] text-primary mb-4">Form Data</h1>

      {/* Responsive Table Container */}
      <div className="overflow-auto rounded-lg border border-gray-200">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-gray-700 text-sm text-center">
              {[
                "Date",
                "Name",
                "Address",
                "Contact",
                "Registration Number",
                "Pan Number",
                "Agricultural Business",
                "Production Details",
                "Action",
              ].map((heading, index) => (
                <th key={index} className="px-6 py-3 border min-w-[180px]">
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((response, rowIndex) => (
              <tr key={rowIndex} className="text-center text-gray-800 text-sm even:bg-gray-50">
                {Object.values(response).map((value, colIndex) => (
                  <td key={colIndex} className="px-6 py-3 border min-w-[180px] whitespace-nowrap">
                    {value}
                  </td>
                ))}
                <td className="px-6 py-3 border flex justify-center gap-4">
                  <button className="bg-blue-500 text-white px-4 py-2 rounded-md">
                    Update
                  </button>
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded-md"
                    onClick={() => {
                      setId(response.id);
                      setOpen(true);
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation */}
      {open && (
        <div className="absolute top-1/4 left-1/3 bg-white shadow-lg p-6 rounded-md">
          <p className="mb-4">Are you sure you want to delete this user?</p>
          <div className="flex justify-between">
            <button className="bg-red-500 text-white px-4 py-2 rounded-md">
              Delete
            </button>
            <button
              className="bg-gray-500 text-white px-4 py-2 rounded-md"
              onClick={() => setOpen(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormData;
