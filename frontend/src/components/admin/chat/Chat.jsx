import { useContext, useEffect, useState, useRef } from "react";
import { AuthContext } from "../../../context/authContext";
import { FaUserDoctor } from "react-icons/fa6";
import { IoSend } from "react-icons/io5";
import { get, post } from "../../../utils/api";
import { io } from "socket.io-client";
import { toast } from "react-toastify";

const socket = io("http://localhost:5050", {
  autoConnect: false,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

const Chat = () => {
  const { currentUser } = useContext(AuthContext);
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [messages, setMessages] = useState([]);
  const [clientMessage, setClientMessage] = useState("");
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

  // Fetch doctors
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await get("/api/get-doctors");
        setDoctors(res);
        if (res.length > 0 && !selectedDoctor) {
          setSelectedDoctor(res[0]);
        }
      } catch (error) {
        console.error("Error fetching doctors:", error);
        toast.error("Failed to load doctors");
      }
    };
    fetchDoctors();
  }, []);

  // Fetch messages when doctor is selected
  useEffect(() => {
    if (!selectedDoctor) return;

    const fetchMessages = async () => {
      try {
        const response = await get(
          `/api/chat/get-messages?senderId=${currentUser.id}&receiverId=${selectedDoctor.id}`
        );
        setMessages(response);
      } catch (error) {
        console.error("Error fetching messages:", error);
        toast.error("Failed to load messages");
      }
    };

    fetchMessages();

    const handleNewMessage = (newMessage) => {
      setMessages((prev) => {
        // Only add if message belongs to current conversation
        if (
          (newMessage.senderId === currentUser.id &&
            newMessage.receiverId === selectedDoctor.id) ||
          (newMessage.senderId === selectedDoctor.id &&
            newMessage.receiverId === currentUser.id)
        ) {
          // Prevent duplicates
          if (prev.some((msg) => msg.id === newMessage.id)) return prev;
          return [...prev, newMessage];
        }
        return prev;
      });
    };

    socket.on("receiveMessage", handleNewMessage);

    return () => {
      socket.off("receiveMessage", handleNewMessage);
    };
  }, [selectedDoctor, currentUser.id]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!selectedDoctor) {
      toast.error("Please select a doctor first");
      return;
    }

    const trimmedMessage = clientMessage.trim();
    if (!trimmedMessage) {
      toast.error("Message cannot be empty");
      return;
    }

    // Optimistic update
    const tempId = Date.now();
    const newMessage = {
      id: tempId,
      senderId: currentUser.id,
      receiverId: selectedDoctor.id,
      message: trimmedMessage,
      timestamp: new Date(),
      isOwn: true,
    };

    setMessages((prev) => [...prev, newMessage]);
    setClientMessage("");

    try {
      const response = await post("/api/chat/send-message", {
        senderId: currentUser.id,
        receiverId: selectedDoctor.id,
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
      // Remove optimistic message
      setMessages((prev) => prev.filter((msg) => msg.id !== tempId));
    }
  };

  return (
    <div className="flex gap-8">
      {/* Doctors List */}
      <div className="flex flex-col w-[20%] shadow-2xl bg-gray-400 p-4 rounded-lg">
        <h1 className="font-bold text-2xl">Doctors List:</h1>
        <div
          className={`text-sm mb-2 ${
            isConnected ? "text-green-500" : "text-red-500"
          }`}
        >
          Status: {isConnected ? "Connected" : "Disconnected"}
        </div>
        <ul className="flex flex-col gap-2 mt-4">
          {doctors.map((doc) => (
            <li
              key={doc.id}
              className={`flex gap-2 items-center text-lg cursor-pointer p-2 rounded-md ${
                selectedDoctor?.id === doc.id ? "bg-gray-600 text-white" : ""
              }`}
              onClick={() => setSelectedDoctor(doc)}
            >
              <FaUserDoctor /> {doc.name}
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
                {selectedDoctor
                  ? selectedDoctor.name.charAt(0).toUpperCase()
                  : currentUser.name.charAt(0).toUpperCase()}
              </div>
              <span className="font-bold">
                {selectedDoctor ? selectedDoctor.name : "Select a Doctor"}
              </span>
            </div>
          </div>

          {/* Messages */}
          <div className="flex flex-col p-4 mt-2 gap-4 overflow-y-auto h-full">
            {messages.length === 0 && (
              <div className="text-center text-gray-500 mt-4">
                {selectedDoctor
                  ? "No messages yet. Start the conversation!"
                  : "Select a doctor to start chatting"}
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
                      : "bg-slate-500 text-black"
                  }`}
                >
                  {msg.message}
                  <div className="text-xs mt-1 opacity-70">
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </div>
                </span>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Box */}
          <div className="h-[5rem] rounded-ee-lg rounded-es-lg bg-slate-500 flex px-4 p-2 justify-evenly items-center">
            <textarea
              className="resize-none p-2 font-bold outline-none w-[28rem] rounded-md"
              placeholder="Type your message..."
              rows={1}
              value={clientMessage}
              onChange={(e) => setClientMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              disabled={!selectedDoctor}
            />
            <IoSend
              className={`text-3xl cursor-pointer ${
                !selectedDoctor ? "opacity-50" : ""
              }`}
              onClick={sendMessage}
              title={!selectedDoctor ? "Select a doctor first" : "Send message"}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;