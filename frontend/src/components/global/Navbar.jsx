import { useState, useContext } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import { FaHouseUser } from "react-icons/fa6";
import { IoLogOut } from "react-icons/io5";
import { toast } from "react-toastify";

const Navbar = () => {
  const { currentUser, logout } = useContext(AuthContext);
  console.log(currentUser);
  const [open, setOpen] = useState(false);
  const [log, setLog] = useState(false);

  const handleLinkClick = () => setOpen(false);

  const handleLogout = () => {
    logout();
    setLog(false);
    toast.success("Logout successful");
  };

  return (
    <div className="flex justify-center h-[64px] bg-white sticky top-0 text-[#272D37] lg:h-[86px]">
      <nav className="flex justify-between items-center max-w-[343px] w-full md:max-w-[704px] lg:max-w-full relative">
        <div className="flex items-center h-[32px] justify-between lg:w-full">
          <div className="flex items-center gap-[64px]">
            <Link to="/" onClick={handleLinkClick}>
              AgroHealth&Services
            </Link>
            <div className="hidden lg:flex items-center">
              <ul className="flex items-center gap-[32px] font-semibold text-[15px] leading-[22px]">
                <Link to="/" onClick={handleLinkClick}>
                  <li>Home</li>
                </Link>

                <li>Post</li>
                <li className="flex gap-[8px] items-center">
                  <span>Resources</span>
                </li>
                <Link to="/contact" onClick={handleLinkClick}>
                  <li>Contacts</li>
                </Link>
                {currentUser && (
                  <Link
                    to={
                      currentUser.role_id === 1
                        ? "/admin"
                        : currentUser.role_id === 2
                        ? "/doctor"
                        : "/user"
                    }
                    onClick={handleLinkClick}
                    className="py-[1rem] px-[2rem] bg-primary text-white rounded-sm"
                  >
                    <li className="bg-primary text-white">Dashboard</li>
                  </Link>
                )}
              </ul>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-2">
            {currentUser ? (
              <div
                onClick={() => setLog(!log)}
                className="cursor-pointer w-[3rem] h-[3rem] bg-primary rounded-full grid place-items-center text-[2rem] font-sm text-white"
              >
                {currentUser?.name.charAt(0).toUpperCase()}
              </div>
            ) : (
              <>
                <Link to="/signup">
                  <button className="px-[28px] py-[12px] font-semibold text-[15px] leading-[22px] text-primary rounded-sm">
                    Sign Up
                  </button>
                </Link>
                <Link to="/login">
                  <button className="px-[28px] py-[12px] bg-primary font-semibold text-[15px] leading-[22px] text-white rounded-sm">
                    Log In
                  </button>
                </Link>
              </>
            )}
          </div>
        </div>

        <div className="lg:hidden">
          {open ? (
            <FaTimes
              className="text-xl h-[17px] w-[17px]"
              onClick={() => setOpen((prev) => !prev)}
            />
          ) : (
            <FaBars
              className="text-xl h-[17px] w-[17px] font-thin"
              onClick={() => setOpen((prev) => !prev)}
            />
          )}

          {open && (
            <div className="absolute top-[64px] right-0 bg-white flex justify-center items-center px-16 py-10 md:px-[170px] border rounded-sm border-[#EAEBF0]">
              <ul className="flex flex-col items-center gap-[48px] font-semibold text-[15px] leading-[22px]">
                <Link to="/" onClick={handleLinkClick}>
                  <li>Home</li>
                </Link>
                <li>Our Products</li>
                <li className="flex gap-[8px] items-center">
                  <span>Resources</span>
                </li>
                <Link to="/contact" onClick={handleLinkClick}>
                  <li>Contacts</li>
                </Link>
                {currentUser && (
                  <Link
                    to={
                      currentUser.role_id === 1
                        ? "/admin"
                        : currentUser.role_id === 2
                        ? "/doctor"
                        : "/user"
                    }
                    onClick={handleLinkClick}
                    className="py-[1rem] px-[2rem] bg-primary text-white rounded-sm"
                  >
                    <li className="bg-primary text-white">Dashboard</li>
                  </Link>
                )}
                {currentUser ? (
                  <div>{currentUser?.name}</div>
                ) : (
                  <>
                    <Link to="/signup">
                      <button className="px-6 py-3 font-semibold text-[15px] leading-[22px] text-primary rounded-sm">
                        Sign Up
                      </button>
                    </Link>
                    <Link to="/login">
                      <button className="px-6 py-3 bg-primary font-semibold text-[15px] leading-[22px] text-white rounded-sm">
                        Log In
                      </button>
                    </Link>
                  </>
                )}
              </ul>
            </div>
          )}
        </div>
      </nav>
      {log && (
        <div className=" w-[15rem] bg-white rounded-md shadow-lg absolute top-[4.4rem] right-0 p-4 border-2 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="w-full text-center font-bold text-2xl">
              {currentUser?.name}
            </span>
          </div>
          <Link to="/user">
            <button className="flex justify-center items-center gap-2 text-lg hover:bg-green-600 transition-all px-4 w-full py-2 bg-primary text-white rounded-md">
              <FaHouseUser /> Profile
            </button>
          </Link>

          <button
            onClick={handleLogout}
            className="flex justify-center items-center gap-2 text-lg hover:bg-red-600 transition-all px-4 w-full py-2 bg-red-500 text-white rounded-md"
          >
            <IoLogOut /> Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default Navbar;
