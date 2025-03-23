import React from "react";
import { FaUser, FaBloggerB } from "react-icons/fa";

import { FaUserDoctor } from "react-icons/fa6";
import Table from "./Table";

const Dashboard = () => {
  // Data for tables
  const tableData = [
    { id: 1, name: "John Doe", age: 28, country: "USA" },
    { id: 2, name: "Jane Smith", age: 32, country: "Canada" },
    { id: 3, name: "Sam Brown", age: 45, country: "UK" },
    { id: 4, name: "Lucy Green", age: 25, country: "Australia" },
  ];

  return (
    <div className="space-y-10 p-6">
      {/* Stat Cards Section */}
      <div className="flex justify-between gap-5">
        {/* Users Card */}
        <div className="flex flex-col items-center shadow-lg shadow-gray-300 gap-3 py-6 px-[50px] rounded-md">
          <FaUser className="text-[80px] text-blue-400" />
          <span className="text-[30px] font-medium">6</span>
          <span className="text-[15px] text-gray-500 font-medium">
            Total Number of Users
          </span>
        </div>

        {/* Doctors Card */}
        <div className="flex flex-col items-center shadow-lg shadow-gray-300 gap-3 py-6 px-[50px] rounded-md">
          <FaUserDoctor className="text-[80px] text-red-400" />
          <span className="text-[30px] font-medium">6</span>
          <span className="text-[15px] text-gray-500 font-medium">
            Total Number of Doctors
          </span>
        </div>

        {/* Posts Card */}
        <div className="flex flex-col items-center shadow-lg shadow-gray-300 gap-3 py-6 px-[50px] rounded-md">
          <FaBloggerB className="text-[80px] text-primary" />
          <span className="text-[30px] font-medium">6</span>
          <span className="text-[15px] text-gray-500 font-medium">
            Total Number of Posts
          </span>
        </div>
      </div>

      {/* Tables Section */}
      <div className="flex gap-6">
        {/* Recent Posts Table */}
        <div className="flex-1 shadow-lg shadow-gray-300 rounded-md px-3 py-3">
          <h1 className="font-semibold text-[30px] text-primary">Recent Posts</h1>
          <Table data={tableData} />
        </div>

        {/* Recent Users Table */}
        <div className="flex-1 shadow-lg shadow-gray-300 rounded-md px-3 py-3">
          <h1 className="font-semibold text-[30px] text-primary">Recent Users</h1>
          <Table data={tableData} />
        </div>
      </div>
    </div>
  );
};

// Reusable Table Component


export default Dashboard;