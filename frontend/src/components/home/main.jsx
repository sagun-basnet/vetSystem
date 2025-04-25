import React from "react";
import Mysvg from "../../image/svg/home.svg";
import { ArrowRight, Leaf, Shield, Sun, Droplet } from "lucide-react";

const Main = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-white to-green-50 py-12 md:py-0">
      {/* Background elements */}
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-green-100 rounded-full opacity-20 blur-3xl" />
      <div className="absolute -bottom-32 -left-20 w-80 h-80 bg-green-100 rounded-full opacity-20 blur-3xl" />

      <div className="container mx-auto px-4 flex justify-between items-center flex-col md:flex-row gap-8 md:h-[70vh]">
        {/* Left column - Image */}
        <div className="md:flex-1 relative order-2 md:order-1 w-full">
          <div className="relative z-10 transform transition-transform duration-500 hover:scale-105">
            <img
              src={Mysvg}
              alt="Agro Health Services"
              className="w-full h-auto max-w-lg mx-auto drop-shadow-xl"
            />
          </div>

          {/* Floating badges */}
          <div className="absolute top-10 left-10 bg-white shadow-lg rounded-lg p-3 hidden md:flex items-center">
            <Sun className="text-yellow-500 mr-2" size={20} />
            <span className="text-sm font-medium">Sustainable Farming</span>
          </div>

          <div className="absolute bottom-10 right-10 bg-white shadow-lg rounded-lg p-3 hidden md:flex items-center">
            <Shield className="text-green-600 mr-2" size={20} />
            <span className="text-sm font-medium">Animal Welfare</span>
          </div>
        </div>

        {/* Right column - Content */}
        <div className="md:flex-1 flex flex-col gap-6 order-1 md:order-2 z-10">
          <div className="inline-flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium self-start">
            <Leaf size={16} className="mr-2" />
            <span>Eco-friendly Solutions</span>
          </div>

          <h1 className="font-bold text-4xl md:text-5xl lg:text-6xl tracking-tight text-gray-900">
            Growing Dreams, <br />
            <span className="text-primary">Harvesting Success</span>
          </h1>

          <p className="font-medium text-gray-600 text-lg max-w-xl">
            Agro Health Services is dedicated to promoting the well-being of
            both agriculture and livestock. We provide expert healthcare
            solutions, preventive measures, and guidance for healthier farms and
            animals.
          </p>

          <div className="flex flex-wrap gap-4 mt-2">
            <div className="flex items-center">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-100 mr-3">
                <Droplet size={20} className="text-primary" />
              </div>
              <span className="font-medium">Sustainable Practices</span>
            </div>

            <div className="flex items-center">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-100 mr-3">
                <Shield size={20} className="text-primary" />
              </div>
              <span className="font-medium">Expert Guidance</span>
            </div>
          </div>

          <div className="flex flex-wrap mt-6 gap-4">
            <button className="flex items-center gap-2 px-8 py-3 bg-primary rounded-md font-semibold text-white shadow-md hover:shadow-lg transition-all duration-300 hover:bg-primary/90">
              Explore Services
              <ArrowRight size={18} />
            </button>

            <button className="flex items-center gap-2 px-8 py-3 bg-white border-2 border-gray-200 rounded-md font-semibold text-gray-700 hover:bg-gray-50 transition-all duration-300">
              <a href="#post">View Posts</a>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Main;
