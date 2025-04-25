import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../../context/authContext";
import { get, post } from "../../../utils/api";
import { toast } from "react-toastify";
import { 
  MdCalendarMonth, 
  MdMedicalServices, 
  MdPerson, 
  MdPayment, 
  MdArrowBack,
  MdInfo
} from "react-icons/md";
import esewaLogo from "../../../image/esewa-icon-large.webp";

const AppointmentAdd = () => {
  const navigate = useNavigate();
  const [esewaData, setEsewaData] = useState(null);
  const { currentUser } = useContext(AuthContext);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    date: "",
    service: "",
    doctor_id: "",
    user_id: currentUser.id,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const fetchDoctors = async () => {
    try {
      const res = await get("/api/get-doctors", {});
      setDoctors(res);
    } catch (error) {
      toast.error("Failed to fetch doctors");
    }
  };

  const fetchEsewa = async () => {
    try {
      const res = await get("/api/verifyEsewa");
      setEsewaData(res);
    } catch (error) {
      toast.error("Failed to verify eSewa");
    }
  };

  useEffect(() => {
    fetchDoctors();
    fetchEsewa();
  }, []);

  const validateForm = () => {
    if (!formData.date) {
      toast.error("Please select an appointment date");
      return false;
    }
    if (!formData.service.trim()) {
      toast.error("Please enter the service required");
      return false;
    }
    if (!formData.doctor_id) {
      toast.error("Please select a doctor");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      // Store appointment data in localStorage for use after payment
      localStorage.setItem("appointmentData", JSON.stringify(formData));

      // Create eSewa payment form
      const form = document.createElement("form");
      form.method = "POST";
      form.action = "https://rc-epay.esewa.com.np/api/epay/main/v2/form";

      const fields = {
        amount: 500, // Total amount for the payment
        total_amount: 500, // Total amount to be paid
        failure_url: "http://localhost:5050/esewa-payment-failure", // Failure URL
        product_code: "EPAYTEST", // Product code
        signature: esewaData?.signature, // Signature from eSewa response
        success_url: "http://localhost:5050/api/success", // Success URL
        transaction_uuid: esewaData?.uuid, // Transaction UUID from eSewa response
        signed_field_names: "total_amount,transaction_uuid,product_code", // List of field names that are signed
        tax_amount: 0, // Tax amount
        product_service_charge: 0,
        product_delivery_charge: 0,
      };

      // Create hidden inputs for all fields
      for (const key in fields) {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = fields[key];
        form.appendChild(input);
      }

      // Append the form to the body and submit it
      document.body.appendChild(form);
      form.submit();
    } catch (error) {
      toast.error("Payment processing failed. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center py-12 px-4 bg-gray-50 h-full">
      <div className=" w-[70%] bg-white rounded-lg shadow-lg">
        {/* Header */}
        <div className="bg-primary text-white px-6 py-4 rounded-t-lg">
          <div className="flex justify-between items-center">
            <button
              onClick={() => navigate('/user/userappointment')}
              className="p-1 hover:bg-blue-600 rounded-full transition-colors"
              title="Go back"
            >
              <MdArrowBack className="text-xl" />
            </button>
            <h1 className="text-xl font-semibold">Book Appointment</h1>
            <div className="w-6"></div> {/* Empty div for centering */}
          </div>
        </div>
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Date Field */}
          <div className="mb-5">
            <label className="block text-gray-700 text-sm font-medium mb-2 flex items-center gap-1">
              <MdCalendarMonth className="text-primary" />
              Appointment Date
            </label>
            <input
              name="date"
              id="date"
              onChange={handleChange}
              type="date"
              value={formData.date}
              className="shadow-sm border border-gray-300 rounded-md w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              min={new Date().toISOString().split('T')[0]} // Prevent past dates
            />
          </div>
          
          {/* Service Field */}
          <div className="mb-5">
            <label className="block text-gray-700 text-sm font-medium mb-2 flex items-center gap-1">
              <MdMedicalServices className="text-primary" />
              Service Required
            </label>
            <textarea
              name="service"
              id="service"
              onChange={handleChange}
              value={formData.service}
              placeholder="Describe the service you need"
              className="shadow-sm border border-gray-300 rounded-md w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
              rows="3"
            />
          </div>
          
          {/* Doctor Selection Field */}
          <div className="mb-5">
            <label className="block text-gray-700 text-sm font-medium mb-2 flex items-center gap-1">
              <MdPerson className="text-primary" />
              Select Doctor
            </label>
            <div className="relative">
              <select
                name="doctor_id"
                id="doctor"
                onChange={handleChange}
                value={formData.doctor_id}
                className="shadow-sm border border-gray-300 rounded-md w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all appearance-none"
              >
                <option value="">Choose a doctor</option>
                {doctors.map((doctor) => (
                  <option key={doctor.id} value={doctor.id}>
                    Dr. {doctor.name}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>
          
          {/* Payment Notice */}
          <div className="mb-6 bg-blue-50 p-3 rounded-md flex items-start gap-2">
            <MdInfo className="text-blue-500 text-lg mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-blue-800 text-sm font-medium">Payment Required</p>
              <p className="text-blue-600 text-xs">
                You will be redirected to eSewa to complete the payment of NPR 500
              </p>
            </div>
          </div>
          
          {/* Payment method display */}
          <div className="mb-6 flex items-center justify-center">
            <div className="px-4 py-2 border border-gray-200 rounded-md flex items-center">
              <MdPayment className="text-gray-500 mr-2" />
              <span className="text-gray-700 mr-3">Payment via</span>
              <img src={esewaLogo} alt="eSewa" className="h-8" />
            </div>
          </div>
          
          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-primary hover:bg-blue-600 text-white py-3 rounded-md font-medium tracking-wide transition-colors flex items-center justify-center gap-2 ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              <>
                <MdPayment className="text-lg" />
                Pay & Book Appointment
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AppointmentAdd;