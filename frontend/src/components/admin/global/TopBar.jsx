import React, { useContext, useEffect, useState } from "react";
import { IoMdNotificationsOutline } from "react-icons/io";
import { IoIosLogOut } from "react-icons/io";
import { FaSearch } from "react-icons/fa";
import { AiOutlineMessage } from "react-icons/ai";
import { FaUser } from "react-icons/fa";
// import { AuthContext } from "../../../Context/authContext";
import Notification from "../notification/Notification";
import { MdMessage } from "react-icons/md";
import { FaLink } from "react-icons/fa";
import { get } from "../../../utils/api";
import { io } from "socket.io-client";
import { AuthContext } from "../../../context/authContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
const socket = io("http://localhost:5050");

const Topbar = () => {
  const { currentUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [modle, setModle] = useState(false);
  const [openNotification, setOpenNotification] = useState(false);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false); // Track unread notifications
  console.log(modle);
  //NOTIFICATION
  const [notifications, setNotifications] = useState([]);
  console.log(notifications);

  const [notification, setNotification] = useState([]);

  useEffect(() => {
    const fetchApi = async () => {
      try {
        // Fetch stored notifications from MySQL
        const res = await get("/notifications");
        console.log(res);

        setNotifications(res); // No need for `.json()`, Axios already parses JSON

        // Listen for real-time notifications
        socket.on("notification", (newNotification) => {
          setNotification((prev) => [newNotification, ...prev]);
        });
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchApi(); // Call the async function

    return () => {
      socket.off("notification"); // Clean up the socket listener
    };
  }, [notification]);

  return (
    <header class="sticky top-0 inset-x-0 flex z-[48] w-full bg-white  text-sm py-2.5">
      <nav class="px-4 sm:px-6 flex basis-full items-center w-full mx-auto">
        <div class="me-5 lg:me-0 lg:hidden">
          <span>AgroHealth&Services</span>
        </div>
        <div class="w-full flex items-center justify-end ms-auto md:justify-between gap-x-1 md:gap-x-3">
          <div class="hidden md:block">
            {/* <!-- Search Input --> */}
            <div class="relative">
              <div class="absolute inset-y-0 start-0 flex items-center pointer-events-none z-20 ps-3.5">
                <svg
                  class="shrink-0 size-4 text-gray-400 "
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
              </div>
              <input
                type="text"
                class="py-2 ps-10 pe-16 block w-full bg-white border-gray-200 border-2 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none "
                placeholder="Search"
              />
              <div class="hidden absolute inset-y-0 end-0 flex items-center pointer-events-none z-20 pe-1">
                <button
                  type="button"
                  class="inline-flex shrink-0 justify-center items-center size-6 rounded-full text-gray-500 hover:text-blue-600 focus:outline-none focus:text-blue-600 "
                  aria-label="Close"
                >
                  <span class="sr-only">Close</span>
                  <svg
                    class="shrink-0 size-4"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="m15 9-6 6" />
                    <path d="m9 9 6 6" />
                  </svg>
                </button>
              </div>
              <div class="absolute inset-y-0 end-0 flex items-center pointer-events-none z-20 pe-3 text-gray-400">
                <svg
                  class="shrink-0 size-3 text-gray-400 "
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
                </svg>
                <span class="mx-1">
                  <svg
                    class="shrink-0 size-3 text-gray-400 "
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14" />
                    <path d="M12 5v14" />
                  </svg>
                </span>
                <span class="text-xs">/</span>
              </div>
            </div>
            {/* <!-- End Search Input --> */}
          </div>

          <div class="flex flex-row items-center justify-end gap-1">
            <button
              type="button"
              class="md:hidden size-[38px] relative inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-full border border-transparent text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none "
            >
              <svg
                class="shrink-0 size-4"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <span class="sr-only">Search</span>
            </button>

            <button
              type="button"
              onClick={() => setOpenNotification(!openNotification)}
              className="size-[38px] relative inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-full border border-transparent text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none"
            >
              <svg
                className="shrink-0 size-4"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
              </svg>
              {hasUnreadNotifications && (
                <span className="absolute top-0 right-0 block w-2.5 h-2.5 bg-red-500 rounded-full"></span>
              )}
              <span className="sr-only">Notifications</span>
            </button>

            <button
              type="button"
              class="size-[38px] relative inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-full border border-transparent text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none "
            >
              <svg
                class="shrink-0 size-4"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
              <span class="sr-only">Activity</span>
            </button>

            {/* <!-- Dropdown --> */}
            <div className="hs-dropdown [--placement:bottom-right] relative inline-flex">
              <button
                onClick={() => setModle(!modle)}
                id="hs-dropdown-account"
                type="button"
                className="size-[38px] inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-full border border-transparent text-gray-800 focus:outline-none "
              >
                <img
                  className="shrink-0 size-[38px] rounded-full"
                  src={`http://localhost:5050/images/${currentUser?.profile}`}
                  alt="Avatar"
                />
              </button>
              {modle && (
                <div
                  class="min-w-60 bg-white shadow-md rounded-lg absolute top-12 right-0"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="hs-dropdown-account"
                >
                  <div class="py-3 px-5 bg-gray-100 rounded-t-lg dark:bg-neutral-700">
                    <p class="text-sm text-gray-500 dark:text-neutral-500">
                      Signed in as
                    </p>
                    <p class="text-sm font-medium text-gray-800 dark:text-neutral-200">
                      james@site.com
                    </p>
                  </div>
                  <div class="p-1.5 space-y-0.5">
                    <span
                      class="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-red-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 dark:hover:bg-neutral-700  dark:focus:bg-neutral-700 dark:focus:text-neutral-300"
                      onClick={() => {
                        logout();
                        navigate("/login");
                        toast.success("Logout successfully");
                      }}
                    >
                      <IoIosLogOut className=" h-[18px] w-[18px]" />
                      Logout
                    </span>
                  </div>
                </div>
              )}

              {/* {modle && (
              )} */}
            </div>
            {/* <!-- End Dropdown --> */}
          </div>
          {/* {openNotification && */}
          {/* // <div className="absolute top-14 right-24 rounded-md">
            //     <Notification />
            // </div> */}
          {/* Notification Panel */}
          {openNotification && (
            <div className="absolute top-14 right-12 w-80 md:w-96 bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 z-50 animate-fade-in-down">
              <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-gray-50">
                <h2 className="text-lg font-semibold text-gray-800">
                  Notifications
                </h2>
                <div className="flex items-center gap-2">
                  {notifications.length > 0 && (
                    <button
                      onClick={() => toast.info("Mark all as read")}
                      className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Mark all as read
                    </button>
                  )}
                  <button
                    onClick={() => setOpenNotification(false)}
                    className="p-1 rounded-full hover:bg-gray-200 transition-colors"
                  >
                    <svg
                      className="w-5 h-5 text-gray-500"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>
              </div>

              <div className="max-h-96 overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map((notif, index) => (
                    <div
                      key={index}
                      className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer ${
                        notif.isRead ? "" : "bg-blue-50"
                      }`}
                      onClick={() => {
                        // Mark as read functionality
                        if (!notif.isRead) {
                          // Update read status logic would go here
                        }

                        // Navigate if there's a link
                        if (notif.link) {
                          window.open(notif.link, "_blank");
                        }
                      }}
                    >
                      <div className="flex gap-3">
                        <div className="flex-shrink-0 mt-1">
                          {/* Different icons based on notification type */}
                          {notif.type === "message" ? (
                            <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center">
                              <MdMessage className="text-blue-600 text-lg" />
                            </div>
                          ) : notif.type === "alert" ? (
                            <div className="w-9 h-9 rounded-full bg-red-100 flex items-center justify-center">
                              <svg
                                className="w-5 h-5 text-red-600"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                                <line x1="12" y1="9" x2="12" y2="13"></line>
                                <line x1="12" y1="17" x2="12.01" y2="17"></line>
                              </svg>
                            </div>
                          ) : (
                            <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center">
                              <svg
                                className="w-5 h-5 text-green-600"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                <polyline points="22 4 12 14.01 9 11.01"></polyline>
                              </svg>
                            </div>
                          )}
                          {!notif.isRead && (
                            <div className="w-2 h-2 bg-blue-600 rounded-full absolute ml-7"></div>
                          )}
                        </div>

                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900 mb-1">
                            {notif.message}
                          </p>

                          {notif.link && (
                            <div className="mb-2">
                              <span className="inline-flex items-center gap-1 text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
                                <FaLink className="text-xs text-gray-500" />
                                <span className="truncate max-w-[200px]">
                                  {notif.link}
                                </span>
                              </span>
                            </div>
                          )}

                          <p className="text-xs text-gray-500 flex items-center gap-1">
                            <svg
                              className="w-3 h-3"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <circle cx="12" cy="12" r="10"></circle>
                              <polyline points="12 6 12 12 16 14"></polyline>
                            </svg>
                            {new Date(notif.created_at).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </p>
                        </div>

                        <div className="flex-shrink-0">
                          <button
                            className="p-1 rounded-full hover:bg-gray-200 text-gray-400 hover:text-gray-600"
                            onClick={(e) => {
                              e.stopPropagation();
                              // Delete notification logic
                              toast.info(`Notification deleted`);
                            }}
                          >
                            <svg
                              className="w-4 h-4"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <polyline points="3 6 5 6 21 6"></polyline>
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                      <svg
                        className="w-8 h-8 text-gray-400"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path>
                        <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path>
                      </svg>
                    </div>
                    <h3 className="text-gray-700 font-medium mb-1">
                      No notifications yet
                    </h3>
                    <p className="text-gray-500 text-sm">
                      We'll notify you when something arrives
                    </p>
                  </div>
                )}
              </div>

              {notifications.length > 0 && (
                <div className="p-3 border-t border-gray-200 bg-gray-50">
                  <button
                    className="w-full py-2 px-3 text-sm text-blue-600 hover:text-blue-800 font-medium text-center"
                    onClick={() => {
                      // View all notifications page
                      navigate("/notifications");
                      setOpenNotification(false);
                    }}
                  >
                    View all notifications
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Topbar;
