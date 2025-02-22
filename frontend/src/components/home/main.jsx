import React from "react";
import Mysvg from "../../image/svg/home.svg";
import { FaArrowCircleRight, FaArrowRight } from "react-icons/fa";

const Main = () => {
    return (
        <div className="flex justify-between items-center flex-col md:flex-row gap-8  md:h-[70vh] pb-6 md:p-0">

            <div className="md:flex-1">
                <img src={Mysvg} alt="Vet System" className="w-full h-auto" />
            </div>


            <div className="md:flex-1 flex flex-col gap-4 justify-center items-center">
                <div className="space-y-3 flex flex-col">
                    <h1 className="font-bold text-[35px] md:text-[45px] lg:text-[55px] text-primary">
                        Growing Dreams, <br />Harvesting Success
                    </h1>
                    <p className="font-medium text-justify text-sm sm:text-base md:text-lg">
                        Agro Health Services is dedicated to promoting the well-being of both agriculture and livestock.
                        We provide expert healthcare solutions, preventive measures, and guidance for healthier farms and animals.
                    </p>
                    <div className="flex justify-center md:justify-end">
                        <button className="flex gap-2 items-center px-9 bg-primary border-2 border-primary text-white py-3 rounded-sm font-semibold transition-all duration-500 ease-in-out hover:bg-white hover:text-primary">
                            Post <FaArrowRight />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Main;
