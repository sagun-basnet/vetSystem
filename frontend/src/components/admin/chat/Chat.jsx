import { useContext, useEffect, useState, useRef } from "react";
import { AuthContext } from "../../../context/authContext";
import { FaUserDoctor } from "react-icons/fa6";
import { IoSend } from "react-icons/io5";
import { AiOutlineSearch } from "react-icons/ai";
import { BsThreeDotsVertical, BsEmojiSmile } from "react-icons/bs";
import { FiPaperclip } from "react-icons/fi";
import { IoCallOutline } from "react-icons/io5";
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
    <div className="flex h-[calc(100vh-5rem)]">
      {/* Doctors List */}
      <div className="w-96 border-r flex flex-col">
        <div className="p-4 border-b">
          <h1 className="text-2xl font-bold">Messages</h1>
        </div>
        
        {/* Search */}
        <div className="px-4 py-3">
          <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2">
            <AiOutlineSearch className="text-gray-500 mr-2" />
            <input
              type="text"
              placeholder="Search patients..."
              className="bg-transparent border-none w-full focus:outline-none text-gray-700"
            />
          </div>
        </div>
        
        {/* Doctors List */}
        <div className="flex-1 overflow-y-auto">
          {[...new Map(doctors.map((doc) => [doc.doctor_name, doc])).values()].map((doctor, index) => (
            <div
              key={doctor.doctor_id}
              className={`flex items-center p-4 cursor-pointer hover:bg-gray-50 border-b ${
                selectedDoctor?.doctor_id === doctor.doctor_id ? "bg-gray-50" : ""
              }`}
              onClick={() => setSelectedDoctor(doctor)}
            >
              <div className="h-12 w-12 rounded-full bg-pink-500 flex items-center justify-center text-white font-bold text-xl mr-3">
                {doctor.doctor_name.charAt(0)}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium text-gray-800">{doctor.doctor_name}</h3>
                  <span className="text-xs text-gray-500">
                    {index === 0 ? "12:49 PM" : "Apr 25"}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <p className="text-sm text-gray-600 truncate">{index === 0 ? "hello" : ""}</p>
                  {index === 0 && (
                    <span className="bg-green-500 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs">
                      1
                    </span>
                  )}
                  {index === 1 && (
                    <span className="bg-green-500 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs">
                      13
                    </span>
                  )}
                  {index === 2 && (
                    <span className="bg-green-500 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs">
                      7
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-white">
        {/* Chat Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center">
            <div className="h-12 w-12 rounded-full bg-pink-500 flex items-center justify-center text-white font-bold text-xl mr-3">
              {selectedDoctor?.doctor_name.charAt(0) || "S"}
            </div>
            <div>
              <h2 className="font-medium text-lg">{selectedDoctor?.doctor_name || "Select a doctor"}</h2>
              <p className="text-sm text-green-500">
                <span className="inline-block h-2 w-2 bg-green-500 rounded-full mr-1"></span>
                Online
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button className="text-gray-500 hover:text-gray-700">
              <IoCallOutline size={20} />
            </button>
            <button className="text-gray-500 hover:text-gray-700">
              <BsThreeDotsVertical size={20} />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
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
                  className={`max-w-md p-3 rounded-lg shadow-sm ${
                    msg.isOwn
                      ? "bg-blue-500 text-white"
                      : "bg-white text-gray-800"
                  }`}
                >
                  <p>{msg.message}</p>
                  <div className="text-xs mt-1 opacity-70 text-right">
                    {msg.created_at
                      ? `${new Date(msg.created_at).toLocaleTimeString("ne-NP", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}`
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
          <div className="flex items-center bg-gray-50 rounded-full px-4 py-1">
            <button className="text-gray-500 p-2">
              <BsEmojiSmile size={20} />
            </button>
            <button className="text-gray-500 p-2">
              <FiPaperclip size={20} />
            </button>
            <input
              type="text"
              className="flex-1 border-none bg-transparent px-2 py-2 focus:outline-none"
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
              disabled={!selectedDoctor}
            />
            <button
              className="bg-green-500 text-white p-2 rounded-full disabled:opacity-50"
              onClick={sendMessage}
              disabled={!selectedDoctor || !message.trim()}
            >
              <IoSend size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;