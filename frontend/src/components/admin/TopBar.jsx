import React, { useContext, useState } from "react";
import { IoMdNotificationsOutline } from "react-icons/io";
import { IoIosLogOut } from "react-icons/io";
import { FaSearch } from "react-icons/fa";
import { AiOutlineMessage } from "react-icons/ai";
import { FaUser } from "react-icons/fa";
import { AuthContext } from "../../Context/authContext";

const Topbar = () => {
    const { currentUser } = useContext(AuthContext);
    const [modle, setModle] = useState(false);
    console.log(modle);

    return (
        <header class="sticky top-0 inset-x-0 flex z-[48] w-full bg-white  text-sm py-2.5">
            <nav class="px-4 sm:px-6 flex basis-full items-center w-full mx-auto">
                <div class="me-5 lg:me-0 lg:hidden">
                    <span>Vet System</span>
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
                                <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                                <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                            </svg>
                            <span class="sr-only">Notifications</span>
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
                                    src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=320&h=320&q=80"
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
                                        <a
                                            class="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-300 dark:focus:bg-neutral-700 dark:focus:text-neutral-300"
                                            href="#"
                                        >
                                            <svg
                                                class="shrink-0 size-4"
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="24"
                                                height="24"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                stroke-width="2"
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                            >
                                                <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
                                                <path d="M12 12v9" />
                                                <path d="m8 17 4 4 4-4" />
                                            </svg>
                                            Downloads
                                        </a>
                                        <a
                                            class="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-red-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 dark:hover:bg-neutral-700  dark:focus:bg-neutral-700 dark:focus:text-neutral-300"
                                            href="#"
                                        >
                                            <IoIosLogOut className=" h-[18px] w-[18px]" />
                                            Logout
                                        </a>
                                    </div>
                                </div>
                            )}

                            {/* {modle && (
              )} */}
                        </div>
                        {/* <!-- End Dropdown --> */}
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default Topbar;
