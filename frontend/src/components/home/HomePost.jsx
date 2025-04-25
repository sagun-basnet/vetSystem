import React, { useEffect, useState } from "react";
import { get } from "../../utils/api";
import { Calendar, User, Eye, ArrowRight, Plus, X } from "lucide-react";

const HomePost = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visiblePosts, setVisiblePosts] = useState(6);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await get("/api/get-posts");
        setPosts(response);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const handleLoadMore = () => {
    setVisiblePosts((prevCount) => prevCount + 6);
  };

  const openPostModal = (post) => {
    setSelectedPost(post);
    setShowModal(true);
    document.body.style.overflow = "hidden"; // Prevent background scrolling
  };

  const closePostModal = () => {
    setShowModal(false);
    document.body.style.overflow = "auto"; // Re-enable scrolling
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-gray-300 mb-2"></div>
          <div className="text-gray-500">Loading posts...</div>
        </div>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-center">
          <div className="text-gray-500 mb-2">No posts found</div>
        </div>
      </div>
    );
  }

  const displayedPosts = posts.slice(0, visiblePosts);
  const hasMorePosts = visiblePosts < posts.length;

  return (
    <div id="post" className=" flex flex-col items-center mt-8">
      <h1 className="text-5xl font-bold text-center">Our Post:</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8 w-full">
        {displayedPosts.map((post) => (
          <div
            key={post.id}
            className="flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-md"
          >
            <div className="relative">
              <img
                src={`http://localhost:5050/images/${post.image}`}
                alt={post.title}
                className="w-full h-52 object-cover"
              />
              <div className="absolute top-4 right-4 bg-white py-1 px-2 rounded-md text-xs font-medium shadow-sm flex items-center">
                <Calendar size={12} className="mr-1 text-blue-600" />
                {new Date(post.createdAt || Date.now()).toLocaleDateString()}
              </div>
            </div>

            <div className="flex flex-col px-5 py-4 flex-grow">
              <div className="flex items-center mb-2 text-xs text-gray-500">
                <div className="flex items-center mr-4">
                  <User size={14} className="mr-1 text-blue-600" />
                  <span>{post.author || "Admin"}</span>
                </div>
              </div>

              <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2">
                {post.title}
              </h3>

              <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                {post.description}
              </p>

              <div className="mt-auto flex justify-end pt-2">
                <button
                  onClick={() => openPostModal(post)}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium transition-colors hover:bg-blue-700"
                >
                  Read more
                  <ArrowRight size={16} className="ml-1" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {hasMorePosts && (
        <div className="mt-8 mb-10">
          <button
            onClick={handleLoadMore}
            className="flex items-center px-6 py-3 bg-white border border-gray-300 text-blue-600 rounded-md text-sm font-medium transition-colors hover:bg-gray-50"
          >
            <Plus size={16} className="mr-2" />
            See More Posts
          </button>
        </div>
      )}

      {/* Modal */}
      {showModal && selectedPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-xl font-semibold text-gray-800">
                {selectedPost.title}
              </h2>
              <button
                onClick={closePostModal}
                className="p-1 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            <div className="overflow-y-auto p-5">
              <div className="relative mb-6">
                <img
                  src={`http://localhost:5050/images/${selectedPost.image}`}
                  alt={selectedPost.title}
                  className="w-full h-80 object-cover rounded-lg"
                />
              </div>

              <div className="flex items-center mb-4 text-sm text-gray-500">
                <div className="flex items-center mr-6">
                  <User size={16} className="mr-2 text-blue-600" />
                  <span>{selectedPost.author || "Admin"}</span>
                </div>
                <div className="flex items-center mr-6">
                  <Calendar size={16} className="mr-2 text-blue-600" />
                  <span>
                    {new Date(
                      selectedPost.createdAt || Date.now()
                    ).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="prose max-w-none">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  {selectedPost.title}
                </h3>
                <p className="text-gray-700 mb-4">{selectedPost.description}</p>
                <p className="text-gray-700">
                  {selectedPost.content ||
                    "No content available for this post."}
                </p>
              </div>
            </div>

            <div className="border-t p-4 flex justify-end">
              <button
                onClick={closePostModal}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePost;
