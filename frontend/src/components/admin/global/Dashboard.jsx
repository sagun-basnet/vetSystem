import React, { useEffect, useState } from "react";
import {
  Users,
  UserRound,
  FileText,
  Activity,
  RefreshCw,
  ChevronRight,
  Calendar,
  MapPin,
  Mail,
} from "lucide-react";
import Table from "./Table";
import { get } from "../../../utils/api";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  console.log(users, "users");

  const [userCount, setUserCount] = useState(0);
  const [doctorCount, setDoctorCount] = useState(0);
  const [posts, setPosts] = useState([]);
  console.log(posts, "posts");
  const [postCount, setPostCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [usersRes, doctorsRes, postsRes] = await Promise.all([
        get("/api/get-user"),
        get("/api/get-doctors"),
        get("/api/get-posts"),
      ]);

      setUsers(usersRes);
      setUserCount(usersRes.length);
      setDoctorCount(doctorsRes.length);
      setPosts(postsRes);
      setPostCount(postsRes.length);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Format date function
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return isNaN(date) ? "N/A" : date.toLocaleDateString(); // or any desired format
  };

  // Recent users table data (assuming users have these properties)
  const recentUsers = users.slice(0, 5).map((user) => ({
    id: user.id || Math.random().toString(36).substr(2, 9),
    name: user.name || "N/A",
    email: user.email || "N/A",
    joinDate: formatDate(user.created_at) || "N/A",
    location: user.address || "N/A",
  }));

  // Recent posts table data (assuming posts have these properties)
  const recentPosts = posts.slice(0, 5).map((post) => ({
    id: post.id || Math.random().toString(36).substr(2, 9),
    title: post.title || "N/A",
    author: post.author?.name || "N/A",
    date: formatDate(post.created_at),
    status: post.status || "Published",
  }));

  return (
    <div className="bg-gray-50 p-6 min-h-screen">
      {/* Dashboard Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
        <button
          onClick={fetchData}
          className="flex items-center gap-2 bg-white text-blue-600 px-4 py-2 rounded-lg shadow hover:bg-blue-50 transition-all"
        >
          <RefreshCw size={16} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Users Card */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 transition-all hover:shadow-lg">
          <div className="flex p-6">
            <div className="bg-blue-100 p-4 rounded-lg">
              <UserRound size={28} className="text-blue-600" />
            </div>
            <div className="ml-6">
              <p className="text-sm font-medium text-gray-500">Total Users</p>
              <div className="flex items-end mt-1">
                <h3 className="text-3xl font-bold text-gray-900">
                  {isLoading ? "..." : userCount}
                </h3>
                <span className="ml-2 text-sm text-green-500 flex items-center">
                  <Activity size={14} className="mr-1" />
                  Active
                </span>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-6 py-3">
            <a
              href="/users"
              className="text-sm text-blue-600 font-medium flex items-center"
            >
              View all users
              <ChevronRight size={16} className="ml-1" />
            </a>
          </div>
        </div>

        {/* Doctors Card */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 transition-all hover:shadow-lg">
          <div className="flex p-6">
            <div className="bg-purple-100 p-4 rounded-lg">
              <Users size={28} className="text-purple-600" />
            </div>
            <div className="ml-6">
              <p className="text-sm font-medium text-gray-500">Total Doctors</p>
              <div className="flex items-end mt-1">
                <h3 className="text-3xl font-bold text-gray-900">
                  {isLoading ? "..." : doctorCount}
                </h3>
                <span className="ml-2 text-sm text-green-500 flex items-center">
                  <Activity size={14} className="mr-1" />
                  Verified
                </span>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-6 py-3">
            <a
              href="/doctors"
              className="text-sm text-purple-600 font-medium flex items-center"
            >
              View all doctors
              <ChevronRight size={16} className="ml-1" />
            </a>
          </div>
        </div>

        {/* Posts Card */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 transition-all hover:shadow-lg">
          <div className="flex p-6">
            <div className="bg-green-100 p-4 rounded-lg">
              <FileText size={28} className="text-green-600" />
            </div>
            <div className="ml-6">
              <p className="text-sm font-medium text-gray-500">Total Posts</p>
              <div className="flex items-end mt-1">
                <h3 className="text-3xl font-bold text-gray-900">
                  {isLoading ? "..." : postCount}
                </h3>
                <span className="ml-2 text-sm text-green-500 flex items-center">
                  <Activity size={14} className="mr-1" />
                  Published
                </span>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-6 py-3">
            <a
              href="/posts"
              className="text-sm text-green-600 font-medium flex items-center"
            >
              View all posts
              <ChevronRight size={16} className="ml-1" />
            </a>
          </div>
        </div>
      </div>

      {/* Tables Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Posts Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800">
              Recent Posts
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Author
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {isLoading ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-6 py-4 text-center text-sm text-gray-500"
                    >
                      Loading...
                    </td>
                  </tr>
                ) : recentPosts.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-6 py-4 text-center text-sm text-gray-500"
                    >
                      No posts found
                    </td>
                  </tr>
                ) : (
                  recentPosts.map((post) => (
                    <tr key={post.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {post.title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        Admin
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 flex items-center">
                        <Calendar size={14} className="mr-1 text-gray-400" />
                        {post.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${
                            post.status === "Published"
                              ? "bg-green-100 text-green-800"
                              : post.status === "Draft"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {post.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="bg-gray-50 px-6 py-3">
            <Link
              to="/admin/post"
              className="text-sm text-blue-600 font-medium flex items-center"
            >
              View all posts
              <ChevronRight size={16} className="ml-1" />
            </Link>
          </div>
        </div>

        {/* Recent Users Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800">
              Recent Users
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Join Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {isLoading ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-6 py-4 text-center text-sm text-gray-500"
                    >
                      Loading...
                    </td>
                  </tr>
                ) : recentUsers.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-6 py-4 text-center text-sm text-gray-500"
                    >
                      No users found
                    </td>
                  </tr>
                ) : (
                  recentUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center">
                            <UserRound size={16} className="text-gray-500" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {user.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 flex items-center">
                        <Mail size={14} className="mr-1 text-gray-400" />
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500  items-center">
                        {/* <Calendar size={14} className="mr-1 text-gray-400" /> */}
                        {user.joinDate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500  items-center">
                        {/* <MapPin size={14} className="mr-1 text-gray-400" /> */}
                        {user.location}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="bg-gray-50 px-6 py-3">
            <Link
              to="/admin/user"
              className="text-sm text-blue-600 font-medium flex items-center"
            >
              View all users
              <ChevronRight size={16} className="ml-1" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
