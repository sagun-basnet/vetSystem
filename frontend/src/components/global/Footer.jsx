import React from "react";
import { Link } from "react-router-dom";
 
const Footer = () => {
    return (
        <div className=" flex justify-around py-5 gap-[2rem] border-t border-black">
            <div className="flex-1 flex flex-col gap-3 text-justify">
                  <Link>
                  <p className="text-[1.2rem] font-semibold">AgroHealth&Services</p>
                  </Link>
                <p>
                Agro Health Services is dedicated to promoting the well-being of both agriculture and livestock. 
                We provide expert healthcare solutions, preventive measures, and guidance for healthier farms and animals.
                </p>
            </div>
            <div className="flex-1">
                <form action="" className="space-y-3">
                    <input
                        type="text"
                        name="email"
                        id="email"
                        placeholder="Email"
                        className="w-full outline-none border-2 border-gray-300 px-4 py-3 rounded-sm focus:ring-2 focus:border-none focus:ring-primary transition-all"
                    />
                    <textarea
                        type="text"
                        name="message"
                        id="message"
                        placeholder="Message"
                        className="w-full outline-none border-2 border-gray-300 px-4 py-3 rounded-sm focus:ring-2 focus:border-none focus:ring-primary transition-all"
                    />
                    <button
                        type="submit"
                        className="w-full bg-primary border-2 border-primary text-white py-3 text-[15px] rounded-sm font-semibold transition-all duration-500 ease-in-out hover:bg-white hover:text-primary"
                    >
                        Send
                    </button>
                </form>
            </div>
            <div className="flex-[0.7]  ">
                    <div className="flex  flex-col  gap-[1rem]">
                        <Link to="/" className="text-[1.2rem] font-semibold">
                            AgroHealth&Services
                        </Link>
                        <div className="">
                            <ul className="flex  flex-col gap-[1rem] font-medium text-[15px] leading-[22px]">
                                <li>Home</li>

                                <li>Post</li>
                                <li>

                                <Link to="/signup">
                                    
                                        Sign Up
                                    
                                </Link>
                                </li>
                                <li>

                                <Link to="/login">
                                   
                                        Log In
                                    
                                </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
            </div>
        </div>
    );
};

export default Footer;
