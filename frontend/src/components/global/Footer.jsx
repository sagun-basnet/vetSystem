import React from "react";
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";

const Footer = () => {
    return (
        <footer className="bg-gray-800 text-white py-10">
            <div className="container mx-auto px-4">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 w-full justify-between gap-8">
                    {/* Logo and Description */}
                    <div className="w-full ">
                        <h2 className="text-2xl font-bold mb-4">
                            AgroHealth&Services
                        </h2>
                        <p className="text-sm text-gray-400">
                            Agro Health Services ensures healthier farms and
                            animals through expert care, prevention, and
                            guidance.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="w-full">
                        <h3 className="text-lg font-semibold mb-4">
                            Quick Links
                        </h3>
                        <ul className="space-y-2">
                            <li>
                                <a
                                    href="/about"
                                    className="text-gray-400 hover:text-white transition"
                                >
                                    About Us
                                </a>
                            </li>
                            <li>
                                <a
                                    href="/services"
                                    className="text-gray-400 hover:text-white transition"
                                >
                                    Services
                                </a>
                            </li>
                            <li>
                                <a
                                    href="/blog"
                                    className="text-gray-400 hover:text-white transition"
                                >
                                    Blog
                                </a>
                            </li>
                            <li>
                                <a
                                    href="/contact"
                                    className="text-gray-400 hover:text-white transition"
                                >
                                    Contact
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Social Media Links */}
                    <div className="w-full">
                        <h3 className="text-lg font-semibold mb-4">
                            Follow Us
                        </h3>
                        <div className="flex space-x-4">
                            <a
                                href="https://twitter.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-white transition"
                            >
                                <FaTwitter className="text-2xl" />
                            </a>
                            <a
                                href="https://facebook.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-white transition"
                            >
                                <FaFacebook className="text-2xl" />
                            </a>
                            <a
                                href="https://instagram.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-white transition"
                            >
                                <FaInstagram className="text-2xl" />
                            </a>
                            <a
                                href="https://linkedin.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-white transition"
                            >
                                <FaLinkedin className="text-2xl" />
                            </a>
                        </div>
                    </div>
                    <div className="w-full ">
                        <h3 className="text-lg font-semibold mb-4">
                            Newsletter
                        </h3>
                        <form className="flex flex-col space-y-2">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className=" w-full p-2 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                            <button
                                type="submit"
                                className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
                            >
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>

                {/* Copyright Notice */}
                <div className="border-t border-gray-700 mt-8 pt-8 text-center">
                    <p className="text-sm text-gray-400">
                        &copy; {new Date().getFullYear()} AgroHealth&Services.
                        All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
