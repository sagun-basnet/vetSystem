import React, { useEffect, useState } from "react";
import { get, post } from "../../../utils/api";
import { toast } from "react-toastify";
import { FaCheck, FaHourglassHalf, FaTimes, FaSearch, FaCalendar, FaFilter } from "react-icons/fa";
import { format } from "date-fns";

const AppointmentAdmin = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all"); // all, pending, approved
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("date");
  const [sortDirection, setSortDirection] = useState("desc");

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const res = await get(`/api/get-appointment`, {});
      setAppointments(res || []);
      setError(null);
    } catch (err) {
      console.error("Error fetching appointments:", err);
      setError("Failed to load appointments. Please try again.");
      toast.error("Could not fetch appointments");
    } finally {
      setLoading(false);
    }
  };

  const handleStatus = async (id, currentStatus) => {
    try {
      // Optimistically update UI
      const updatedAppointments = appointments.map(app => 
        app.appo_id === id ? {...app, status: currentStatus === "pending" ? "approved" : "pending"} : app
      );
      setAppointments(updatedAppointments);
      
      const res = await post(`/api/accept-appoinment/${id}`, {});
      
      if (res.success === 1) {
        toast.success(res.message || "Status updated successfully");
        fetchAppointments(); // Refresh to get the accurate data from server
      } else {
        toast.error(res.message || "Failed to update status");
        fetchAppointments(); // Revert back to accurate data
      }
    } catch (err) {
      toast.error("An error occurred while updating status");
      fetchAppointments(); // Revert back to accurate data
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return format(date, 'MMM dd, yyyy');
    } catch (err) {
      return "Invalid date";
    }
  };

  // Filter and sort appointments
  const filteredAppointments = appointments
    .filter(appointment => {
      // Apply status filter
      if (filter !== "all" && appointment.status !== filter) {
        return false;
      }
      
      // Apply search filter
      if (searchTerm && !Object.values(appointment).some(
        value => String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )) {
        return false;
      }
      
      return true;
    })
    .sort((a, b) => {
      // Apply sorting
      if (sortField === "date") {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
      } else if (sortField === "service") {
        return sortDirection === "asc" 
          ? a.service.localeCompare(b.service) 
          : b.service.localeCompare(a.service);
      }
      return 0;
    });

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const StatusBadge = ({ status }) => {
    let bgColor = "";
    let icon = null;
    
    if (status === "pending") {
      bgColor = "bg-yellow-100 text-yellow-800 border-yellow-200";
      icon = <FaHourglassHalf className="mr-1" />;
    } else if (status === "approved") {
      bgColor = "bg-green-100 text-green-800 border-green-200";
      icon = <FaCheck className="mr-1" />;
    } else if (status === "rejected") {
      bgColor = "bg-red-100 text-red-800 border-red-200";
      icon = <FaTimes className="mr-1" />;
    }
    
    return (
      <span className={`px-3 py-1 inline-flex items-center rounded-full text-xs font-medium ${bgColor} border`}>
        {icon}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">
          Appointment Management
        </h1>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search appointments..."
              className="pl-9 pr-4 py-2 border border-gray-300 rounded-md w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          
          {/* Filter */}
          <div className="relative">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="pl-9 pr-4 py-2 border border-gray-300 rounded-md w-full appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
            <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          
          <button 
            onClick={fetchAppointments}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors flex items-center justify-center"
          >
            <FaCalendar className="mr-2" />
            Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : filteredAppointments.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                  onClick={() => toggleSort("service")}
                >
                  <div className="flex items-center">
                    Service
                    {sortField === "service" && (
                      <span className="ml-1">
                        {sortDirection === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                  onClick={() => toggleSort("date")}
                >
                  <div className="flex items-center">
                    Date
                    {sortField === "date" && (
                      <span className="ml-1">
                        {sortDirection === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Doctor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAppointments.map((appointment, index) => (
                <tr key={appointment.appo_id || index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{appointment.appo_id || index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {appointment.service}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {formatDate(appointment.date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    <div className="font-medium">{appointment.name}</div>
                    {appointment.specialty && (
                      <div className="text-xs text-gray-500">{appointment.specialty}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={appointment.status} />
                  </td>
                  <td className="flex justify-center px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => handleStatus(appointment.appo_id, appointment.status)}
                      className={`px-4 p-2 rounded text-white text-sm transition-colors ${
                        appointment.status === "pending" 
                          ? "bg-green-600 hover:bg-green-700" 
                          : "bg-yellow-500 hover:bg-yellow-600"
                      }`}
                    >
                      {appointment.status === "pending" ? "Approve" : "Reset to Pending"}
                    </button>
                    
                    
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <svg className="w-12 h-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          <p className="text-gray-500 mb-1">No appointments found</p>
          <p className="text-gray-400 text-sm">
            {filter !== "all" || searchTerm 
              ? "Try changing your filters or search term" 
              : "New appointments will appear here"}
          </p>
        </div>
      )}
      
      {filteredAppointments.length > 0 && (
        <div className="mt-4 flex justify-between items-center text-sm text-gray-500">
          <div>
            Showing {filteredAppointments.length} of {appointments.length} appointments
          </div>
          <div>
            Last updated: {new Date().toLocaleTimeString()}
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentAdmin;