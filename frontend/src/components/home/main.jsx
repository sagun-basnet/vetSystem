import React from "react";
import Mysvg from "../../image/svg/home.svg";
import { FaArrowCircleRight, FaArrowRight } from "react-icons/fa";

const Main = () => {
    return (
        <div className="flex justify-between gap-8 items-center h-[90vh]">
            {/* Left side for image */}
            <div className="flex-1">
                <img src={Mysvg} alt="Vet System" className="w-full h-auto" />
            </div>

            {/* Right side for text and button */}
            <div className="flex-1 flex flex-col gap-4 justify-center items-center">
                <div className="space-y-3 flex flex-col">
                    <h1 className="font-bold text-[55px] text-primary">
                    Growing Dreams, <br/>Harvesting Success
                    </h1>
                    <p className="font-medium text-justify">
                        Lorem, ipsum dolor sit amet consectetur adipisicing
                        elit. Vero veritatis possimus soluta sit cupiditate,
                        nemo, modi corrupti quaerat eius dolorum reiciendis
                        quasi magnam obcaecati eaque? Iste nobis aliquam eveniet
                        vero.
                    </p>
                    <div className="flex justify-end">
                        <button className=" flex  gap-2 items-center px-9 bg-primary border-2 border-primary text-white py-3 rounded-sm font-semibold transition-all duration-500 ease-in-out hover:bg-white hover:text-primary">
                            Post <FaArrowRight/>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Main;
