import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { get, post } from "../../../utils/api";
import { AuthContext } from "../../../context/authContext";
import { toast } from "react-toastify";
import {
  MdCancel,
  MdCalendarMonth,
  MdPerson,
  MdMedicalServices,
  MdAdd,
  MdVisibility,
  MdCheck,
  MdDelete,
  MdClose,
} from "react-icons/md";

const AppointmentDoctor = () => {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [id, setId] = useState(null);
  const [singleAppointment, setSingleAppointment] = useState(null);

  const fetchData = async () => {
    const res = await get(`/api/getAppointmentByDoctor/${currentUser.id}`, {});
    setData(res);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleView = (rowId) => {
    setId(rowId);
    setSingleAppointment(rowId);
    setOpen(true);
  };

  const handleDelete = async (id) => {
    const res = await post(`/api/cancel-appointment/${id}`);
    if (res.success === 1) {
      toast.success(res.message);
      fetchData();
    } else {
      toast.error(res.message);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-CA");
  };

  const handleAcceptAppointment = async (id) => {
    const res = await post(`/api/accept-appoinment/${id}`);
    if (res.success === 1) {
      toast.success(res.message);
      fetchData();
    } else {
      toast.error(res.message);
    }
  };

  // Function to render status with appropriate styling and icons
  const renderStatus = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return (
          <div className="flex items-center gap-2 py-1 px-3 bg-yellow-100 text-yellow-800 rounded-full w-fit">
            <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
            <span className="text-sm font-medium">Pending</span>
          </div>
        );
      case "accepted":
      case "confirmed":
        return (
          <div className="flex items-center gap-2 py-1 px-3 bg-green-100 text-green-800 rounded-full w-fit">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span className="text-sm font-medium">Confirmed</span>
          </div>
        );
      case "completed":
        return (
          <div className="flex items-center gap-2 py-1 px-3 bg-blue-100 text-blue-800 rounded-full w-fit">
            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
            <span className="text-sm font-medium">Completed</span>
          </div>
        );
      case "cancelled":
        return (
          <div className="flex items-center gap-2 py-1 px-3 bg-red-100 text-red-800 rounded-full w-fit">
            <div className="w-2 h-2 rounded-full bg-red-500"></div>
            <span className="text-sm font-medium">Cancelled</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-2 py-1 px-3 bg-gray-100 text-gray-800 rounded-full w-fit">
            <div className="w-2 h-2 rounded-full bg-gray-500"></div>
            <span className="text-sm font-medium">{status}</span>
          </div>
        );
    }
  };

  return (
    <div className="flex-1 shadow-lg shadow-gray-300 rounded-md px-6 py-6 bg-white">
      <div className="flex justify-between items-center border-b pb-4">
        <h1 className="font-semibold text-2xl text-gray-800 flex items-center gap-2">
          <MdCalendarMonth className="text-primary" />
          Appointment Dashboard
        </h1>
        <Link to="/user/addappointment">
          <button className="bg-primary hover:bg-blue-600 py-2 px-4 rounded-md text-white flex items-center gap-2 transition-all">
            <MdAdd className="text-lg" />
            <span>New Appointment</span>
          </button>
        </Link>
      </div>

      {data.length > 0 ? (
        <div className="overflow-x-auto my-6 rounded-lg border border-gray-200">
          <table className="min-w-full table-auto border-separate border-spacing-0">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-3 border-b border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  #
                </th>
                <th className="px-4 py-3 border-b border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  <div className="flex items-center gap-1">
                    <MdMedicalServices className="text-primary" />
                    Service
                  </div>
                </th>
                <th className="px-4 py-3 border-b border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  <div className="flex items-center gap-1">
                    <MdCalendarMonth className="text-primary" />
                    Date
                  </div>
                </th>
                <th className="px-4 py-3 border-b border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  <div className="flex items-center gap-1">
                    <MdPerson className="text-primary" />
                    Patient
                  </div>
                </th>
                <th className="px-4 py-3 border-b border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 border-b border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map((row, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                    {index + 1}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-800">
                    {row.service}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                    {formatDate(row.date)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                    {row.name}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {renderStatus(row.status)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleView(row)}
                        className="p-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                        title="View Details"
                      >
                        <MdVisibility />
                      </button>
                      <button
                        onClick={() => handleAcceptAppointment(row.appo_id)}
                        className="p-2 bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors"
                        title="Accept Appointment"
                      >
                        <MdCheck />
                      </button>
                      <button
                        onClick={() => handleDelete(row.appo_id)}
                        className="p-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
                        title="Cancel Appointment"
                      >
                        <MdDelete />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-gray-500">
          <MdCalendarMonth className="text-5xl mb-3 text-gray-300" />
          <p className="text-lg">No appointments found.</p>
          <p className="text-sm text-gray-400">
            New appointments will appear here.
          </p>
        </div>
      )}

      {/* Appointment details modal */}
      {open && singleAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="font-semibold text-lg text-gray-800">
                Appointment Details
              </h3>
              <button
                onClick={() => {
                  setOpen(false);
                  setId(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <MdClose className="text-xl" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-start gap-3">
                <MdMedicalServices className="text-primary text-lg mt-1" />
                <div>
                  <p className="text-sm text-gray-500">Service</p>
                  <p className="font-medium">{singleAppointment.service}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MdCalendarMonth className="text-primary text-lg mt-1" />
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-medium">
                    {formatDate(singleAppointment.date)}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MdPerson className="text-primary text-lg mt-1" />
                <div>
                  <p className="text-sm text-gray-500">Patient Name</p>
                  <p className="font-medium">{singleAppointment.name}</p>
                </div>
              </div>

              <div className="mt-2">
                <p className="text-sm text-gray-500 mb-2">Status</p>
                {renderStatus(singleAppointment.status)}
              </div>
            </div>

            <div className="border-t p-4 flex justify-end gap-3">
              {singleAppointment.status.toLowerCase() !== "accepted" &&
                singleAppointment.status.toLowerCase() !== "confirmed" && (
                  <button
                    onClick={() =>
                      handleAcceptAppointment(singleAppointment.appo_id)
                    }
                    className="px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-600 flex items-center gap-1"
                  >
                    <MdCheck />
                    <span>Accept</span>
                  </button>
                )}
              <button
                onClick={() => {
                  setOpen(false);
                  setId(null);
                }}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentDoctor;
