import { useContext, useEffect, useState, useRef } from "react";
import { AuthContext } from "../../../context/authContext";
import { FaUser } from "react-icons/fa";
import { IoSend } from "react-icons/io5";
import { get, post } from "../../../utils/api";
import { io } from "socket.io-client";
import { toast } from "react-toastify";

const socket = io("http://localhost:5050", {
  autoConnect: false,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

const DoctorChat = () => {
  const { currentUser } = useContext(AuthContext);
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [messages, setMessages] = useState([]);
  const [replyMessage, setReplyMessage] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef(null);

  // Initialize socket connection
  useEffect(() => {
    socket.connect();

    const onConnect = () => {
      setIsConnected(true);
      if (currentUser?.id) {
        socket.emit("join", currentUser.id);
      }
    };

    const onDisconnect = () => {
      setIsConnected(false);
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.disconnect();
    };
  }, [currentUser?.id]);

  // Fetch patients who have messaged this doctor
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await get(`/api/chat/conversations/${currentUser.id}`);
        setPatients(res);
        if (res.length > 0 && !selectedPatient) {
          setSelectedPatient(res[0]);
        }
      } catch (error) {
        console.error("Error fetching patients:", error);
        toast.error("Failed to load patients");
      }
    };
    fetchPatients();
  }, [currentUser.id]);

  // Fetch messages when patient is selected
  useEffect(() => {
    if (!selectedPatient) return;

    const fetchMessages = async () => {
      try {
        const response = await get(
          `/api/chat/get-messages?senderId=${selectedPatient.id}&receiverId=${currentUser.id}`
        );
        setMessages(
          response.map((msg) => ({
            ...msg,
            isOwn: msg.sender_id === currentUser.id,
          }))
        );
      } catch (error) {
        console.error("Error fetching messages:", error);
        toast.error("Failed to load messages");
      }
    };

    fetchMessages();

    const handleNewMessage = (newMessage) => {
      if (
        newMessage.senderId === selectedPatient.id &&
        newMessage.receiverId === currentUser.id
      ) {
        setMessages((prev) => {
          if (prev.some((msg) => msg.id === newMessage.id)) return prev;
          return [...prev, { ...newMessage, isOwn: false }];
        });
      }
    };

    socket.on("receiveMessage", handleNewMessage);

    return () => {
      socket.off("receiveMessage", handleNewMessage);
    };
  }, [selectedPatient, currentUser.id]);

  // Auto-scroll to newest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendReply = async () => {
    if (!selectedPatient) {
      toast.error("Please select a patient first");
      return;
    }

    const trimmedMessage = replyMessage.trim();
    if (!trimmedMessage) {
      toast.error("Message cannot be empty");
      return;
    }

    // Optimistic update
    const tempId = Date.now();
    const newMessage = {
      id: tempId,
      senderId: currentUser.id,
      receiverId: selectedPatient.id,
      message: trimmedMessage,
      timestamp: new Date(),
      isOwn: true,
    };

    setMessages((prev) => [...prev, newMessage]);
    setReplyMessage("");

    try {
      const response = await post("/api/chat/send-message", {
        senderId: currentUser.id,
        receiverId: selectedPatient.id,
        message: trimmedMessage,
      });

      if (response.success) {
        // Replace optimistic message with server response
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === tempId ? { ...response.message, isOwn: true } : msg
          )
        );
      } else {
        throw new Error(response.error || "Failed to send message");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
      setMessages((prev) => prev.filter((msg) => msg.id !== tempId));
    }
  };

  return (
    <div className="flex gap-8">
      {/* Patients List */}
      <div className="flex flex-col w-[20%] shadow-2xl bg-gray-400 p-4 rounded-lg">
        <h1 className="font-bold text-2xl">Patients:</h1>
        <div
          className={`text-sm mb-2 ${
            isConnected ? "text-green-500" : "text-red-500"
          }`}
        >
          Status: {isConnected ? "Connected" : "Disconnected"}
        </div>
        <ul className="flex flex-col gap-2 mt-4">
          {patients.map((patient) => (
            <li
              key={patient.id}
              className={`flex gap-2 items-center text-lg cursor-pointer p-2 rounded-md ${
                selectedPatient?.id === patient.id
                  ? "bg-gray-600 text-white"
                  : ""
              }`}
              onClick={() => setSelectedPatient(patient)}
            >
              <FaUser /> {patient.name.split(" ")[0]}
              {patient.unread_count > 0 && (
                <span className="ml-auto bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
                  {patient.unread_count}
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* Chat Section */}
      <div className="h-[calc(100vh-5rem)] w-[80%] flex justify-center">
        <div className="flex flex-col w-full h-full rounded-xl shadow-2xl">
          {/* Chat Header */}
          <div className="flex rounded-se-lg rounded-ss-lg bg-slate-500 h-[5rem] items-center p-2 px-4 justify-between">
            <div className="flex items-center gap-4">
              <div className="w-[4rem] h-[4rem] bg-blue-500 rounded-full grid place-items-center text-2xl font-bold">
                {selectedPatient
                  ? selectedPatient.name.charAt(0).toUpperCase()
                  : currentUser.name.charAt(0).toUpperCase()}
              </div>
              <span className="font-bold">
                {selectedPatient ? selectedPatient.name : "Select a Patient"}
              </span>
            </div>
          </div>

          {/* Messages */}
          <div className="flex flex-col p-4 mt-2 gap-4 overflow-y-auto h-full">
            {messages.length === 0 && (
              <div className="text-center text-gray-500 mt-4">
                {selectedPatient
                  ? "No messages yet. Start the conversation!"
                  : "Select a patient to view messages"}
              </div>
            )}
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.isOwn ? "justify-end" : "justify-start"
                } w-full`}
              >
                <span
                  className={`w-[60%] text-justify p-2 rounded-lg ${
                    msg.isOwn
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-black"
                  }`}
                >
                  {msg.message}
                  <div className="text-xs mt-1 opacity-70">
                    {new Date(msg.timestamp).toLocaleTimeString()}
                    {msg.isOwn ? " • Sent" : " • Received"}
                  </div>
                </span>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Reply Box */}
          <div className="h-[5rem] rounded-ee-lg rounded-es-lg bg-slate-500 flex px-4 p-2 justify-evenly items-center">
            <textarea
              className="resize-none p-2 font-bold outline-none w-[28rem] rounded-md"
              placeholder="Type your reply..."
              rows={1}
              value={replyMessage}
              onChange={(e) => setReplyMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendReply();
                }
              }}
              disabled={!selectedPatient}
            />
            <IoSend
              className={`text-3xl cursor-pointer ${
                !selectedPatient ? "opacity-50" : ""
              }`}
              onClick={sendReply}
              title={!selectedPatient ? "Select a patient first" : "Send reply"}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorChat;
