import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";

const Navbar = () => {
    const [open, setOpen] = useState(false);

    return (
        <div className="flex justify-center  bg-white sticky top-0 text-[#272D37] h-[86px]">
            <nav className="flex justify-between items-center  w-full max-w-[1200px] relative">
                <div className="flex items-center w-[128px] h-[32px] justify-between lg:w-full">
                    <label className="font-semibold text-[18px] leading-[22px] ">
                        Vet System
                    </label>

                    <div className="flex items-center">
                        <ul className="flex gap-[32px] font-semibold text-[15px] leading-[22px]">
                            <li>Home</li>

                            <li>Our Products</li>

                            <li className="flex gap-[8px] items-center">
                                <span>About Us</span>
                            </li>

                            <li>Contacts Us</li>
                        </ul>
                    </div>

                    <div className="flex items-center gap-2">
                        <Link to='/signup'>
                            <button className="px-[28px] py-[12px] font-semibold text-[15px] leading-[22px] text-primary rounded-sm">
                                Sign Up
                            </button>
                        </Link>
                        <Link to='/login'>
                            <button className="px-[28px] py-[12px] bg-primary font-semibold text-[15px] leading-[22px] text-white rounded-sm ">
                                Log In
                            </button>
                        </Link>
                    </div>
                </div>
            </nav>
        </div>
    );
};

export default Navbar;
