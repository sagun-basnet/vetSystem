import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { post } from "../../../utils/api";
import { toast } from "react-toastify";

const EsewaSuccess = () => {
  const navigate = useNavigate();
  const hasRunRef = useRef(false); // Won't trigger re-renders

  useEffect(() => {
    if (hasRunRef.current) return;
    hasRunRef.current = true;

    const bookAppointment = async () => {
      const formData = JSON.parse(localStorage.getItem("appointmentData"));

      if (!formData) {
        toast.error("No appointment data found.");
        navigate("/");
        return;
      }

      try {
        const res = await post("/api/book-appointment", formData);

        if (res.success === 1) {
          toast.success("Appointment Booked Successfully!");
          localStorage.removeItem("appointmentData");
          navigate("/user/userappointment");
        } else {
          toast.error(res.message);
        }
      } catch (error) {
        toast.error("An error occurred while booking the appointment.");
      }
    };

    bookAppointment();
  }, [navigate]); // Empty array would work too with ref

  return <h1>Payment Successful. Booking your appointment...</h1>;
};

export default EsewaSuccess;
