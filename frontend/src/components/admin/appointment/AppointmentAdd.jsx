import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../../context/authContext";
import { ImCross } from "react-icons/im";
import { TiTick } from "react-icons/ti";
import { get, post } from "../../../utils/api";
import { toast } from "react-toastify";
import esewa from "../../../image/esewa-icon-large.webp";

const AppointmentAdd = () => {
  const navigate = useNavigate();
  const [esewa, setEsewa] = useState([]);
  const { currentUser } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    date: "",
    service: "",
    doctor_id: "",
    user_id: currentUser.id,
  });
  console.log(formData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const [doctor, setDoctor] = useState([]);

  const fetchDoctor = async () => {
    const res = await get("/api/get-doctors", {});
    setDoctor(res);
  };
  const fetchEsewa = async () => {
    const res = await get("/api/verifyEsewa");
    console.log(res, "res");

    setEsewa(res);
  };
  useEffect(() => {
    fetchDoctor();
    fetchEsewa();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      formData.date === "" ||
      formData.service === "" ||
      formData.doctor_id === ""
    ) {
      toast.error("All fields are required");
      return;
    }

    localStorage.setItem("appointmentData", JSON.stringify(formData));

    // Dynamically create form and submit
    const form = document.createElement("form");
    form.method = "POST";
    form.action = "https://rc-epay.esewa.com.np/api/epay/main/v2/form";

    const fields = {
      amount: 500, // Total amount for the payment
      total_amount: 500, // Total amount to be paid
      failure_url: "http://localhost:5050/esewa-payment-failure", // Failure URL
      product_code: "EPAYTEST", // Product code, adjust it as needed
      signature: esewa?.signature, // Signature from eSewa response
      success_url: "http://localhost:5050/api/success", // Success URL
      transaction_uuid: esewa?.uuid, // Transaction UUID from eSewa response
      signed_field_names: "total_amount,transaction_uuid,product_code", // List of field names that are signed
      tax_amount: 0, // Tax amount, if applicable
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
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   if (
  //     formData.date == "" ||
  //     formData.service == "" ||
  //     formData.doctor_id == ""
  //   ) {
  //     toast.error("All fields are required");
  //     return;
  //   }
  //   const res = await post("/api/book-appointment", formData);
  //   if (res.success == 1) {
  //     toast.success(res.message);
  //     navigate("/user/userappointment");
  //   } else {
  //     toast.error(res.message);
  //   }
  // };

  return (
    <div>
      <div className="flex items-center justify-center h-[90vh]">
        <div className="max-w-[343px] md:max-w-[550px] w-full flex flex-col gap-5 bg-white px-4 md:px-8 py-6 md:py-8 rounded-md shadow-lg shadow-gray-300">
          <h1 className="text-center font-bold text-3xl">Add Appointment</h1>

          <div className="flex flex-col w-full gap-2">
            <label className="font-medium text-[14px] leading-[20px] tracking-[-0.28px]">
              Date
            </label>
            <input
              name="date"
              id="date"
              onChange={handleChange}
              type="date"
              value={formData.date}
              className="border-2 border-[#5c5c5c] outline-none py-3 px-2 w-full rounded-sm text-[14px] leading-[20px] tracking-[-0.28px]"
            />
          </div>
          <div className="flex flex-col w-full gap-2">
            <label className="font-medium text-[14px] leading-[20px] tracking-[-0.28px]">
              Service
            </label>
            <textarea
              name="service"
              id="service"
              onChange={handleChange}
              type="text"
              value={formData.service}
              className="border-2 border-[#5c5c5c] outline-none py-3 px-2 w-full rounded-sm text-[14px] leading-[20px] tracking-[-0.28px]"
            />
          </div>
          <div className="flex flex-col w-full gap-2">
            <label className="font-medium text-[14px] leading-[20px] tracking-[-0.28px]">
              Doctor
            </label>
            <select
              name="doctor_id"
              id="doctor"
              onChange={handleChange}
              value={formData.doctor_id}
              className="border-2 border-[#5c5c5c] outline-none py-3 px-2 w-full rounded-sm text-[14px] leading-[20px] tracking-[-0.28px]"
            >
              <option value="">Choose Doctor</option>{" "}
              {doctor.map((doc) => (
                <option key={doc.id} value={doc.id}>
                  {doc.name}{" "}
                </option>
              ))}
            </select>
          </div>
          <span className="font-bold text-blue-700">
            you will be redirect to esewa for payment
          </span>
          <button
            onClick={handleSubmit}
            className="bg-[#437EF7] text-white py-3 rounded-sm font-semibold tracking-[0.48px]"
          >
            Add Appointment
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppointmentAdd;
