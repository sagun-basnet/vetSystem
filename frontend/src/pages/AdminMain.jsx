import { Outlet } from "react-router-dom";
import AdminSidebar from "../components/admin/global/AdminSidebar";
import Topbar from "../components/admin/global/TopBar";
// import AdminSidebar from "./AdminSidebar";
// import BotImg from '../../images/bot.png'
// import Topbar from "./Topbar";

const AdminMain = () => {
    return (
        <div className="flex">
            <div className="h-[100vh] w-[260px] ">
                <AdminSidebar />
            </div>
            <div className="w-[82%] h-[100vh] flex flex-col ">
            {/* bg-[#F1F5F9] */}
                <Topbar />
                <div className="h-[calc(100vh - 5rem)] relative ml-2 p-4">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default AdminMain;
