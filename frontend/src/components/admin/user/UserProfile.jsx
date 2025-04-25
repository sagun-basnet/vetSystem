import React, { useContext, useEffect, useState } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Edit,
  Calendar,
  Bell,
  MessageSquare,
  Award,
  FileText,
} from "lucide-react";
import { AuthContext } from "../../../context/authContext";
import axios from "axios";
import { get } from "../../../utils/api";

const UserProfile = () => {
  const { currentUser } = useContext(AuthContext);
  console.log(currentUser);
  const [count, setCount] = useState(0);
  const [user, setUser] = useState({
    name: "Sagun Basnet",
    email: "testpp@gmail.com",
    phone: "9812384199",
    address: "Itahari-19",
    role: "Premium Member",
    joinedDate: "April 2023",
    bio: "Agricultural enthusiast with 5+ years of experience in sustainable farming practices.",
  });

  const fetchAppointmentCount = async () => {
    await get(`/api/getAppointmentByDoctor/${parseInt(currentUser?.id)}`)
      .then((res) => {
        setCount(res.length);
        console.log(res, "Appointment Count", res.length);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    fetchAppointmentCount();
  }, []);
  return (
    <div className="bg-gray-50 p-6 rounded-lg">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Profile Card */}
        <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center w-full md:w-1/3">
          <div className="relative">
            <div className="w-32 h-32 rounded-full overflow-hidden mb-4 bg-gray-100">
              <img
                src={`http://localhost:5050/images/${currentUser?.profile}`}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <button className="absolute bottom-0 right-0 bg-green-500 p-2 rounded-full text-white">
              <Edit className="h-4 w-4" />
            </button>
          </div>

          <h2 className="text-xl font-bold mt-2">{currentUser?.name}</h2>
          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium mt-2">
            {currentUser?.role_id === 3
              ? "User"
              : currentUser?.role_id === 2
              ? "Doctor"
              : "Admin"}
          </span>
          <p className="text-gray-500 text-sm mt-1">
            Member since{" "}
            {new Date(currentUser?.created_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>

          <div className="w-full border-t mt-4 pt-4">
            <p className="text-gray-600 text-sm">{user.bio}</p>
          </div>

          <button className="mt-4 w-full bg-green-600 text-white py-2 rounded-lg">
            Edit Profile
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Personal Info */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Personal Information</h3>
              <button className="text-green-600 flex items-center gap-1">
                <Edit className="h-4 w-4" />
                <span className="text-sm">Edit</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="bg-green-100 p-2 rounded-full text-green-600">
                  <User className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Full Name</p>
                  <p className="font-medium">{currentUser?.name}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-green-100 p-2 rounded-full text-green-600">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{currentUser?.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-green-100 p-2 rounded-full text-green-600">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium">{currentUser?.phone}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-green-100 p-2 rounded-full text-green-600">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Address</p>
                  <p className="font-medium">{currentUser?.address}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow p-4 flex items-center gap-4">
              <div className="bg-green-100 p-3 rounded-full text-green-600">
                <Calendar className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-2xl font-bold">{count}</h4>
                <p className="text-gray-500">Appointments</p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4 flex items-center gap-4">
              <div className="bg-green-100 p-3 rounded-full text-green-600">
                <MessageSquare className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-2xl font-bold">24</h4>
                <p className="text-gray-500">Messages</p>
              </div>
            </div>

            {currentUser?.role_id === 3 && (
              <div className="bg-white rounded-lg shadow p-4 flex items-center gap-4">
                <div className="bg-green-100 p-3 rounded-full text-green-600">
                  <Award className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-2xl font-bold">8</h4>
                  <p className="text-gray-500">Services Used</p>
                </div>
              </div>
            )}
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Recent Activity</h3>
              <a href="#" className="text-green-600 text-sm">
                View All
              </a>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3 pb-3 border-b">
                <div className="bg-blue-100 p-2 rounded-full text-blue-600 mt-1">
                  <Calendar className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-medium">Appointment Confirmed</p>
                  <p className="text-sm text-gray-500">
                    Your appointment with Dr. Robin has been confirmed
                  </p>
                  <p className="text-xs text-gray-400 mt-1">Today, 10:30 AM</p>
                </div>
              </div>

              <div className="flex items-start gap-3 pb-3 border-b">
                <div className="bg-green-100 p-2 rounded-full text-green-600 mt-1">
                  <FileText className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-medium">Report Available</p>
                  <p className="text-sm text-gray-500">
                    Your soil analysis report is now available
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Yesterday, 5:15 PM
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-amber-100 p-2 rounded-full text-amber-600 mt-1">
                  <Bell className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-medium">Reminder</p>
                  <p className="text-sm text-gray-500">
                    Crop rotation schedule for next month is due
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Apr 22, 2025, 9:00 AM
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
