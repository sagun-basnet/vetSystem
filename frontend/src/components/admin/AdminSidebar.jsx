import React, { useState } from "react";
// import "./style.css";
import { IoChatboxEllipsesOutline } from "react-icons/io5";
import { MdOutlineDashboard } from "react-icons/md";
import { MdOutlineManageAccounts } from "react-icons/md";
import { LuUsers } from "react-icons/lu";
import { PiProjectorScreenChart } from "react-icons/pi";
import { FaQrcode } from "react-icons/fa6";
import { FaLaptopMedical } from "react-icons/fa";
import { MdManageHistory } from "react-icons/md";
import { Link } from "react-router-dom";
import { FaBox, FaUser } from "react-icons/fa6";
// import { FormInput } from "lucide-react";

const AdminSidebar = () => {
    const [activeSection, setActiveSection] = useState("");
    const [showCategories, setShowCategories] = useState(false); // To toggle categories

    const handleClick = (section) => {
        setActiveSection(section);
    };

    const toggleCategories = () => {
        setShowCategories(!showCategories); // Toggle category dropdown
    };

    return (
        <>
            {/* <!-- ========== MAIN CONTENT ========== --> */}
            {/* <!-- Breadcrumb --> */}
            {/* <div class="sticky top-0 inset-x-0 z-20 bg-white border-y px-0 sm:px-6 lg:px-8 lg:hidden dark:bg-neutral-800 dark:border-neutral-700">
                <div class="flex items-center py-2">
                    <button
                        type="button"
                        class="size-8 flex justify-center items-center gap-x-2 border border-gray-200 text-gray-800 hover:text-gray-500 rounded-lg focus:outline-none focus:text-gray-500 disabled:opacity-50 disabled:pointer-events-none dark:border-neutral-700 dark:text-neutral-200 dark:hover:text-neutral-500 dark:focus:text-neutral-500"
                        aria-haspopup="dialog"
                        aria-expanded="false"
                        aria-controls="hs-application-sidebar"
                        aria-label="Toggle navigation"
                        data-hs-overlay="#hs-application-sidebar"
                    >
                        <span class="sr-only">Toggle Navigation</span>
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
                            <rect width="18" height="18" x="3" y="3" rx="2" />
                            <path d="M15 3v18" />
                            <path d="m8 9 3 3-3 3" />
                        </svg>
                    </button>
                    <ol class="ms-3 flex items-center whitespace-nowrap">
                        <li class="flex items-center text-sm text-gray-800 dark:text-neutral-400">
                            Application Layout
                            <svg
                                class="shrink-0 mx-3 overflow-visible size-2.5 text-gray-400 dark:text-neutral-500"
                                width="16"
                                height="16"
                                viewBox="0 0 16 16"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M5 1L10.6869 7.16086C10.8637 7.35239 10.8637 7.64761 10.6869 7.83914L5 14"
                                    stroke="currentColor"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                />
                            </svg>
                        </li>
                        <li
                            class="text-sm font-semibold text-gray-800 truncate dark:text-neutral-400"
                            aria-current="page"
                        >
                            Dashboard
                        </li>
                    </ol>
                </div>
            </div> */}
            {/* <!-- End Breadcrumb --> */}

            {/* <!-- Sidebar --> */}
            <div
                id="hs-application-sidebar"
                class="hs-overlay [--auto-close:lg]  hs-overlay-open:translate-x-0  -translate-x-full transition-all duration-300 transform  w-[260px] h-full  hidden  fixed inset-y-0 start-0 z-[60]  bg-gray-900  lg:block lg:translate-x-0 lg:end-auto lg:bottom-0  dark:bg-neutral-800 dark:border-neutral-700"
                role="dialog"
                tabindex="-1"
                aria-label="Sidebar"
            >
                <div class="relative flex flex-col h-full max-h-full">
                    <div class="px-8 pt-4">
                        {/* <!-- Logo --> */}
                        <a
                            class="flex-none rounded-xl text-xl inline-block font-semibold focus:outline-none focus:opacity-80"
                            href="#"
                            aria-label="Preline"
                        >
                            <h2 className="text-white">AroHealth</h2>
                        </a>
                        {/* <!-- End Logo --> */}
                    </div>

                    {/* <!-- Content --> */}
                    <div class="h-full overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500">
                        <nav
                            class="hs-accordion-group p-3 w-full flex flex-col flex-wrap"
                            data-hs-accordion-always-open
                        >
                            <ul class="flex flex-col space-y-1">
                                <li class="hs-accordion" id="users-accordion">
                                    <Link to="/user/dashboard">
                                        <button
                                            type="button"
                                            class="hs-accordion-toggle w-full text-start flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-white rounded-lg hover:bg-white/10 focus:outline-none focus:bg-white/10"
                                            aria-expanded="true"
                                            aria-controls="users-accordion-child"
                                        >
                                            <MdOutlineDashboard className="text-lg" />
                                            Dashboard
                                        </button>
                                    </Link>
                                </li>
                                <li class="hs-accordion" id="users-accordion">
                                    <Link to="/user/dashboard/chat">
                                        <button
                                            type="button"
                                            class="hs-accordion-toggle w-full text-start flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-white rounded-lg hover:bg-white/10 focus:outline-none focus:bg-white/10"
                                            aria-expanded="true"
                                            aria-controls="users-accordion-child"
                                        >
                                            <IoChatboxEllipsesOutline className="text-lg" />
                                            A
                                        </button>
                                    </Link>
                                </li>

                                <li
                                    class="hs-accordion"
                                    id="projects-accordion"
                                >
                                    <Link to="/user/dashboard/medical-history/">
                                        <button
                                            type="button"
                                            class="hs-accordion-toggle w-full text-start flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-white rounded-lg hover:bg-white/10 focus:outline-none focus:bg-white/10"
                                            aria-expanded="true"
                                            aria-controls="projects-accordion-child"
                                        >
                                            <FaLaptopMedical className="text-lg" />
                                            B
                                        </button>
                                    </Link>
                                </li>
                                <li
                                    class="hs-accordion"
                                    id="projects-accordion"
                                >
                                    <Link to="/user/dashboard/Consultation-history/">
                                        <button
                                            type="button"
                                            class="hs-accordion-toggle w-full text-start flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-white rounded-lg hover:bg-white/10 focus:outline-none focus:bg-white/10"
                                            aria-expanded="true"
                                            aria-controls="projects-accordion-child"
                                        >
                                            <MdManageHistory className="text-lg" />
                                            C
                                        </button>
                                    </Link>
                                </li>
                                <li
                                    class="hs-accordion"
                                    id="projects-accordion"
                                >
                                    <Link to="/user/dashboard/qrcode/">
                                        <button
                                            type="button"
                                            class="hs-accordion-toggle w-full text-start flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-white rounded-lg hover:bg-white/10 focus:outline-none focus:bg-white/10"
                                            aria-expanded="true"
                                            aria-controls="projects-accordion-child"
                                        >
                                            <FaQrcode className="text-lg" />
                                            D
                                        </button>
                                    </Link>
                                </li>
                                <li
                                    class="hs-accordion"
                                    id="projects-accordion"
                                >
                                    
                                </li>
                            </ul>
                        </nav>
                    </div>
                    {/* <!-- End Content --> */}
                </div>
            </div>
            {/* <!-- End Sidebar --> */}
        </>
    );
};

export default AdminSidebar;
