import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { get } from "../../../utils/api";
import { Search, RefreshCw, FileText, Edit, Trash2, Image } from "lucide-react";

const Post = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await get("/api/get-posts", {});
      setData(res);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdatePost = (id) => {
    navigate(`/admin/updatepost/${id}`, {
      state: { post_id: id },
    });
  };

  const filteredData = data.filter(
    (post) =>
      post.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRefresh = () => {
    fetchData();
  };

  // Truncate long text
  const truncateText = (text, maxLength = 35) => {
    if (!text) return "";
    return text.length > maxLength
      ? `${text.substring(0, maxLength)}...`
      : text;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center mb-6">
        <div className="flex items-center">
          <div className="bg-purple-100 p-3 rounded-full mr-4">
            <FileText className="h-6 w-6 text-purple-600" />
          </div>
          <h1 className="text-2xl font-bold">Post Management</h1>
        </div>
        <div className="ml-auto flex items-center space-x-3">
          <button
            onClick={handleRefresh}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            title="Refresh"
          >
            <RefreshCw className="h-5 w-5 text-gray-600" />
          </button>
          <button
            onClick={() => navigate("/admin/addpost")}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
          >
            <FileText className="h-5 w-5 mr-2" />
            Add Post
          </button>
        </div>
      </div>

      <div className="mb-6 flex justify-between items-center">
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search posts by title or description..."
            className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="text-gray-500 ml-4">
          {filteredData.length} posts found
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg overflow-hidden">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                ID
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                TITLE
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                DESCRIPTION
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                IMAGE
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                ACTIONS
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {isLoading ? (
              <tr>
                <td colSpan="5" className="px-6 py-12 text-center">
                  <div className="flex justify-center">
                    <svg
                      className="animate-spin h-8 w-8 text-purple-600"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  </div>
                </td>
              </tr>
            ) : filteredData.length === 0 ? (
              <tr>
                <td
                  colSpan="5"
                  className="px-6 py-12 text-center text-gray-500"
                >
                  No posts found matching your search criteria
                </td>
              </tr>
            ) : (
              filteredData.map((post) => (
                <tr key={post.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-700">
                    #{post.id}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {post.title}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-700">
                      {truncateText(post.description)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      {post.image ? (
                        <div className="h-20 w-28 rounded bg-gray-100 flex items-center justify-center">
                          <img
                            className="h-full w-full"
                            src={`http://localhost:5050/images/${post.image}`}
                            alt=""
                          />
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500">No image</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleUpdatePost(post.id)}
                        className="flex items-center px-3 py-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </button>
                      <button className="flex items-center px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors">
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Post;
