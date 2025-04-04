import { useContext, useEffect, useState, useRef } from "react";
import { AuthContext } from "../../../context/authContext";
import { FaUserDoctor } from "react-icons/fa6";
import { IoSend } from "react-icons/io5";
import { get, post } from "../../../utils/api";
import { toast } from "react-toastify";
import { ADToBS } from "bikram-sambat-js";
import socket from "./socket";

const Chat = () => {
  const { currentUser } = useContext(AuthContext);
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef(null);

  // Socket connection
  useEffect(() => {
    if (!socket.connected) socket.connect();

    const onConnect = () => {
      setIsConnected(true);
      if (currentUser?.id) socket.emit("join", currentUser.id);
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", () => setIsConnected(false));

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect");
    };
  }, [currentUser?.id]);

  // Fetch doctors
  useEffect(() => {
    if (!currentUser?.id) return;

    const fetchDoctors = async () => {
      try {
        const res = await get(`/api/getAppointmentByUser/${currentUser.id}`);
        setDoctors(res);
        if (res.length > 0 && !selectedDoctor) setSelectedDoctor(res[0]);
      } catch (error) {
        toast.error("Failed to load doctors");
        console.error(error);
      }
    };

    fetchDoctors();
  }, [currentUser?.id]);

  // Fetch messages when doctor is selected
  useEffect(() => {
    if (!selectedDoctor) return;

    const fetchMessages = async () => {
      try {
        const res = await get(
          `/api/chat/get-messages?senderId=${currentUser.id}&receiverId=${selectedDoctor.doctor_id}`
        );
        setMessages(res);
      } catch (error) {
        toast.error("Failed to load messages");
        console.error(error);
      }
    };

    fetchMessages();

    const handleNewMessage = (newMessage) => {
      if (
        (newMessage.senderId === currentUser.id &&
          newMessage.receiverId === selectedDoctor.doctor_id) ||
        (newMessage.senderId === selectedDoctor.doctor_id &&
          newMessage.receiverId === currentUser.id)
      ) {
        setMessages((prev) =>
          prev.some((msg) => msg.id === newMessage.id)
            ? prev
            : [...prev, newMessage]
        );
      }
    };

    socket.on("receiveMessage", handleNewMessage);
    return () => socket.off("receiveMessage", handleNewMessage);
  }, [selectedDoctor, currentUser?.id]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!selectedDoctor) return toast.error("Please select a doctor");
    if (!message.trim()) return toast.error("Message cannot be empty");

    // Optimistic update
    const tempId = Date.now();
    const newMessage = {
      id: tempId,
      senderId: currentUser.id,
      receiverId: selectedDoctor.doctor_id,
      message: message.trim(),
      timestamp: new Date(),
      isOwn: true,
    };

    setMessages((prev) => [...prev, newMessage]);
    setMessage("");

    try {
      const res = await post("/api/chat/send-message", {
        senderId: currentUser.id,
        receiverId: selectedDoctor.doctor_id,
        message: message.trim(),
      });

      if (!res.success) throw new Error(res.error || "Failed to send message");

      // Replace with server response
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === tempId ? { ...msg, ...res.message } : msg
        )
      );
    } catch (error) {
      console.error(error);
      toast.error("Failed to send message");
      setMessages((prev) => prev.filter((msg) => msg.id !== tempId));
    }
  };

  return (
    <div className="flex gap-8 h-[calc(100vh-5rem)]">
      {/* Doctors List */}
      <div className="w-1/4 bg-gray-100 p-4 rounded-lg shadow">
        <h1 className="text-xl font-bold mb-2">Doctors</h1>
        <div
          className={`text-sm mb-4 ${
            isConnected ? "text-green-500" : "text-red-500"
          }`}
        >
          {/* {isConnected ? "Online" : "Offline"} */}
        </div>

        <ul className="space-y-2">
          {doctors.map((doctor) => (
            <li
              key={doctor.doctor_id}
              className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${
                selectedDoctor?.doctor_id === doctor.doctor_id
                  ? "bg-blue-500 text-white"
                  : "hover:bg-gray-200"
              }`}
              onClick={() => setSelectedDoctor(doctor)}
            >
              <FaUserDoctor className="mr-3" />
              {doctor.doctor_name}
            </li>
          ))}
        </ul>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col border rounded-lg shadow bg-white">
        {/* Chat Header */}
        <div className="bg-blue-500 text-white p-4 rounded-t-lg">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-white text-blue-500 rounded-full flex items-center justify-center font-bold mr-3">
              {selectedDoctor?.doctor_name.charAt(0) || "D"}
            </div>
            <h2 className="text-lg font-semibold">
              {selectedDoctor?.doctor_name || "Select a doctor"}
            </h2>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 mt-10">
              {selectedDoctor ? "No messages yet" : "Select a doctor to chat"}
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex mb-4 ${
                  msg.isOwn ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-3/4 p-3 rounded-lg ${
                    msg.isOwn
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  <p>{msg.message}</p>
                  <div className="text-xs mt-1 opacity-70">
                    {msg.created_at
                      ? `${ADToBS(
                          new Date(msg.created_at).toISOString().split("T")[0]
                        )} | 
       ${new Date(msg.created_at).toLocaleTimeString("ne-NP")}`
                      : "Loading..."}
                  </div>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="p-4 border-t">
          <div className="flex items-center">
            <input
              type="text"
              className="flex-1 border rounded-l-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
              disabled={!selectedDoctor}
            />
            <button
              className="bg-blue-500 text-white p-3 rounded-r-lg hover:bg-blue-600 disabled:opacity-50"
              onClick={sendMessage}
              disabled={!selectedDoctor || !message.trim()}
            >
              <IoSend />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
