import React, { useState, useEffect } from "react";
import {
  Search,
  User,
  Star,
  MapPin,
  Calendar,
  CheckCircle,
} from "lucide-react";
import { get } from "../utils/api";

export default function DoctorListPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch doctors from the backend API
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await get("/api/get-doctors");
        console.log(response, "doctors");

        setDoctors(response);
      } catch (error) {
        console.error("Error fetching doctors:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  // Filter doctors based on search term and availability
  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSearch =
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialty?.toLowerCase().includes(searchTerm.toLowerCase());

    if (filter === "all") return matchesSearch;
    if (filter === "available") return matchesSearch && doctor.available;
    return matchesSearch;
  });

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="bg-green-50 rounded-lg p-8 mb-10">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Our Expert Doctors
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl">
            Meet our team of specialized professionals dedicated to the
            well-being of your farms and livestock.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by name or specialty"
              className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex gap-2">
            <button
              className={`px-4 py-2 rounded-lg ${
                filter === "all"
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 text-gray-800"
              }`}
              onClick={() => setFilter("all")}
            >
              All Doctors
            </button>
            <button
              className={`px-4 py-2 rounded-lg ${
                filter === "available"
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 text-gray-800"
              }`}
              onClick={() => setFilter("available")}
            >
              Available Today
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <p className="text-center text-gray-500">Loading doctors...</p>
        ) : (
          <>
            {/* Doctor Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredDoctors.map((doctor) => (
                <div
                  key={doctor.id}
                  className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="p-6">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <img
                          src={`http://localhost:5050/images/${doctor.profile}`}
                          alt={doctor.name}
                          className="h-20 w-20 rounded-full object-cover"
                        />
                      </div>
                      <div className="ml-4 flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="text-xl font-semibold text-gray-800">
                            {doctor.name}
                          </h3>
                        </div>
                        <p className="text-green-600 font-medium">
                          {doctor.specialty || "Specialist"}
                        </p>

                        <div className="grid grid-cols-2 gap-2 mt-4">
                          <div className="flex items-center text-gray-600">
                            <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                            <span className="text-sm">
                              {doctor.address || "N/A"}
                            </span>
                          </div>
                        </div>

                        <div className="mt-4 text-sm text-gray-600">
                          📞 {doctor.phone} <br />
                          📧 {doctor.email}
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 flex justify-between items-center">
                      <div className="flex items-center">
                        {doctor.available ? (
                          <>
                            <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                            <span className="text-green-600 text-sm font-medium">
                              Available Today
                            </span>
                          </>
                        ) : (
                          <>
                            <Calendar className="h-5 w-5 text-orange-500 mr-2" />
                            <span className="text-orange-600 text-sm font-medium">
                              Schedule Appointment
                            </span>
                          </>
                        )}
                      </div>
                      <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                        Book Consultation
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* No Results */}
            {filteredDoctors.length === 0 && (
              <div className="text-center py-12">
                <User className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-800 mb-2">
                  No doctors found
                </h3>
                <p className="text-gray-600">
                  Try adjusting your search criteria
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
