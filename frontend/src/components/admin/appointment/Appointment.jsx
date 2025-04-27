import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { get, post } from "../../../utils/api";
import { AuthContext } from "../../../context/authContext";
import { toast } from "react-toastify";
import {
  MdCancel,
  MdOutlineCalendarMonth,
  MdOutlineSearch,
  MdFilterList,
  MdOutlineRefresh,
  MdOutlineVisibility,
  MdOutlineDelete,
  MdOutlineAddCircle,
  MdClose,
} from "react-icons/md";

const Appointment = () => {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState({ field: "date", direction: "desc" });
  const [openModal, setOpenModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  console.log(selectedAppointment, ":Selected Appointment");

  const [confirmDelete, setConfirmDelete] = useState(null);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await get(`/api/getAppointmentByUser/${currentUser.id}`, {});
      setData(res);
    } catch (error) {
      toast.error("Failed to fetch appointments");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchSingleAppointment = async (appointmentId, doctor_name) => {
    try {
      const res = await get(`/api/get-appointment/${appointmentId}`, {});
      // console.log(res, ":Single Appointment");

      // Add doctor_name into the res object
      const updatedRes = { ...res, doctor_name };
      console.log(updatedRes, ":Updated Single Appointment");

      setSelectedAppointment(updatedRes);
      setOpenModal(true);
    } catch (error) {
      toast.error("Failed to fetch appointment details");
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await post(`/api/cancel-appointment/${id}`);
      if (res.success === 1) {
        toast.success(res.message);
        fetchData();
        setConfirmDelete(null);
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      toast.error("Failed to cancel appointment");
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleSort = (field) => {
    if (sortBy.field === field) {
      setSortBy({
        field,
        direction: sortBy.direction === "asc" ? "desc" : "asc",
      });
    } else {
      setSortBy({
        field,
        direction: "asc",
      });
    }
  };

  const filteredData = data
    .filter((appointment) => {
      // Search filter
      const searchLower = searchTerm.toLowerCase();
      return (
        appointment.service.toLowerCase().includes(searchLower) ||
        appointment.doctor_name.toLowerCase().includes(searchLower) ||
        appointment.status.toLowerCase().includes(searchLower)
      );
    })
    .filter((appointment) => {
      // Status filter
      if (statusFilter === "all") return true;
      return appointment.status.toLowerCase() === statusFilter.toLowerCase();
    })
    .sort((a, b) => {
      // Sorting
      const direction = sortBy.direction === "asc" ? 1 : -1;
      if (sortBy.field === "date") {
        return direction * (new Date(a.date) - new Date(b.date));
      }
      if (a[sortBy.field] < b[sortBy.field]) return -1 * direction;
      if (a[sortBy.field] > b[sortBy.field]) return 1 * direction;
      return 0;
    });

  return (
    <div className="flex-1 bg-white rounded-lg shadow-md p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center">
          <MdOutlineCalendarMonth className="mr-2 text-blue-600" />
          My Appointments
        </h1>
        <Link to="/user/addappointment">
          <button className="mt-4 sm:mt-0 bg-blue-600 hover:bg-blue-700 transition-colors py-2 px-6 rounded-md text-white font-medium flex items-center">
            <MdOutlineAddCircle className="mr-2" /> New Appointment
          </button>
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <MdOutlineSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search appointments..."
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <select
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="confirmed">Confirmed</option>
            <option value="pending">Pending</option>
            <option value="cancelled">Cancelled</option>
            <option value="completed">Completed</option>
          </select>

          <button
            onClick={fetchData}
            className="p-2 border border-gray-300 rounded-md hover:bg-gray-100"
            title="Refresh"
          >
            <MdOutlineRefresh />
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : filteredData.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("service")}
                >
                  <div className="flex items-center">
                    Service
                    {sortBy.field === "service" && (
                      <span className="ml-1">
                        {sortBy.direction === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("date")}
                >
                  <div className="flex items-center">
                    Date & Time
                    {sortBy.field === "date" && (
                      <span className="ml-1">
                        {sortBy.direction === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("doctor_name")}
                >
                  <div className="flex items-center">
                    Doctor
                    {sortBy.field === "doctor_name" && (
                      <span className="ml-1">
                        {sortBy.direction === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("status")}
                >
                  <div className="flex items-center">
                    Status
                    {sortBy.field === "status" && (
                      <span className="ml-1">
                        {sortBy.direction === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredData.map((appointment, index) => (
                <tr
                  key={appointment.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">
                      {appointment.service}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-gray-900">
                      {formatDate(appointment.date)}
                    </div>
                    <div className="text-gray-500 text-sm">
                      {formatTime(appointment.date)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-gray-900">
                      {appointment.doctor_name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        appointment.status
                      )}`}
                    >
                      {appointment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() =>
                          fetchSingleAppointment(
                            appointment.id,
                            appointment.doctor_name
                          )
                        }
                        className="text-blue-600 hover:text-blue-900 flex items-center"
                      >
                        <MdOutlineVisibility className="mr-1" /> View
                      </button>
                      {appointment.status !== "cancelled" &&
                        appointment.status !== "completed" && (
                          <button
                            onClick={() => setConfirmDelete(appointment.id)}
                            className="text-red-600 hover:text-red-900 flex items-center ml-3"
                          >
                            <MdOutlineDelete className="mr-1" /> Cancel
                          </button>
                        )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-gray-50 rounded-md p-8 text-center">
          <div className="text-gray-500 mb-4">No appointments found</div>
          <Link to="/user/addappointment">
            <button className="bg-blue-600 hover:bg-blue-700 transition-colors py-2 px-6 rounded-md text-white font-medium">
              Schedule Your First Appointment
            </button>
          </Link>
        </div>
      )}

      {/* Appointment Details Modal */}
      {openModal && selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 overflow-hidden">
            <div className="flex justify-between items-center border-b px-6 py-4">
              <h3 className="text-lg font-bold text-gray-900">
                Appointment Details
              </h3>
              <button
                onClick={() => {
                  setOpenModal(false);
                  setSelectedAppointment(null);
                }}
                className="text-gray-400 hover:text-gray-500"
              >
                <MdClose className="text-2xl" />
              </button>
            </div>

            <div className="px-6 py-4">
              <div className="mb-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    selectedAppointment.status
                  )}`}
                >
                  {selectedAppointment.status}
                </span>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Service</p>
                  <p className="font-medium">{selectedAppointment.service}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Date & Time</p>
                  <p className="font-medium">
                    {formatDate(selectedAppointment.date)} at{" "}
                    {formatTime(selectedAppointment.date)}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Doctor</p>
                  <p className="font-medium">
                    {selectedAppointment.doctor_name}
                  </p>
                </div>

                {selectedAppointment.notes && (
                  <div>
                    <p className="text-sm text-gray-500">Notes</p>
                    <p>{selectedAppointment.notes}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
              {selectedAppointment.status !== "cancelled" &&
                selectedAppointment.status !== "completed" && (
                  <button
                    onClick={() => {
                      setConfirmDelete(selectedAppointment.id);
                      setOpenModal(false);
                    }}
                    className="px-4 py-2 border border-red-600 text-red-600 rounded-md hover:bg-red-50"
                  >
                    Cancel Appointment
                  </button>
                )}
              <button
                onClick={() => {
                  setOpenModal(false);
                  setSelectedAppointment(null);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Confirm Cancellation
              </h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to cancel this appointment? This action
                cannot be undone.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setConfirmDelete(null)}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  No, Keep It
                </button>
                <button
                  onClick={() => handleDelete(confirmDelete)}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Yes, Cancel It
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointment;
