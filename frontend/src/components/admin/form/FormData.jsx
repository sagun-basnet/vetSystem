import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const FormData = () => {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState([]);

  const fecthData = async () => {
    await axios
      .get("http://localhost:5050/api/form-data")
      .then((res) => {
        console.log(res.data.formResponses);

        setData(res.data.formResponses);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const obj = {};

  useEffect(() => {
    fecthData();
  }, []);
  return (
    <div className="flex-1 shadow-lg shadow-gray-300 rounded-md px-3 py-3">
      <div className="flex justify-between">
        <h1 className="font-medium text-[30px] text-primary">Form Data</h1>
      </div>
      <div className="overflow-x-auto my-6">
        <table className="min-w-full table-auto border-separate border-spacing-0">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-700">
                Date
              </th>
              <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-700">
                Name
              </th>
              <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-700">
                Address
              </th>
              <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-700">
                Contact
              </th>
              <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-700">
                Registration Number
              </th>
              <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-700">
                Pan Number
              </th>
              <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-700">
                Type of Agricultural Business
              </th>
              <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-700">
                Type and Quantity of Production
              </th>
              <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-700">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="h-[calc(100vh-20rem)] overflow-y-scroll">
            {data.map((response, rowIndex) => (
              <tr key={rowIndex} className="border">
                {Object.values(response).map((value, colIndex) => (
                  <td key={colIndex} className="border p-2">
                    {value}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {open && (
        <div className="absolute top-[10%] right-[30%] py-9 px-7 bg-gray-50 shadow-lg shadow-gray-300 rounded-md">
          <div className="space-y-3">
            <div>
              <p>Are you want to delete this user</p>
            </div>
            <div className="flex justify-between">
              <button
                className="bg-red-500 text-white px-6 py-2 rounded-md"
                onClick={() => handleDelete()}
              >
                Delete
              </button>
              <button
                className="bg-[#437EF7] text-white px-6 py-2 rounded-md"
                onClick={() => setOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormData;
