import { useContext, useEffect, useState, useRef } from "react";
import { AuthContext } from "../../../context/authContext";
import { get, post } from "../../../utils/api";
import { uploadImage } from "../../../utils/imageUpload";
import { toast } from "react-toastify";
import socket from "./socket";
import {
  MdSend,
  MdPersonOutline,
  MdSearch,
  MdCircle,
  MdOutlineEmojiEmotions,
  MdImage,
  MdClose,
  MdMoreVert,
  MdPhoneInTalk,
} from "react-icons/md";

const DoctorChat = () => {
  const { currentUser } = useContext(AuthContext);
  const [selectedImage, setSelectedImage] = useState(null);
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [messages, setMessages] = useState([]);
  const [replyMessage, setReplyMessage] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef(null);
  const messageContainerRef = useRef(null);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  // Debugging state
  const [connectionStatus, setConnectionStatus] = useState("Disconnected");
  const [lastError, setLastError] = useState(null);

  // Initialize socket connection with better error handling
  useEffect(() => {
    console.log("Initializing socket connection...");
    setConnectionStatus("Connecting...");

    const onConnect = () => {
      console.log("Socket connected");
      setIsConnected(true);
      setConnectionStatus("Connected");
      if (currentUser?.id) {
        console.log(`Joining room for user ${currentUser.id}`);
        socket.emit("join", currentUser.id);
      }
    };

    const onDisconnect = () => {
      console.log("Socket disconnected");
      setIsConnected(false);
      setConnectionStatus("Disconnected");
    };

    const onConnectError = (error) => {
      console.error("Socket connection error:", error);
      setLastError(`Socket error: ${error.message}`);
      setConnectionStatus("Connection failed");
    };

    const onError = (error) => {
      console.error("Socket error:", error);
      setLastError(`Socket error: ${error.message}`);
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("connect_error", onConnectError);
    socket.on("error", onError);

    if (!socket.connected) {
      socket.connect();
    }

    return () => {
      console.log("Cleaning up socket listeners");
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("connect_error", onConnectError);
      socket.off("error", onError);
    };
  }, [currentUser?.id]);

  // Fetch patients who have messaged this doctor with better error handling
  useEffect(() => {
    if (!currentUser?.id) return;

    const fetchPatients = async () => {
      try {
        console.log(`Fetching conversations for user ${currentUser.id}`);
        const res = await get(`/api/chat/conversations/${currentUser.id}`);
        console.log("Fetched patients:", res);

        if (!Array.isArray(res)) {
          throw new Error("Invalid response format - expected array");
        }

        setPatients(res);
        setFilteredPatients(res);

        if (res.length > 0 && !selectedPatient) {
          console.log("Setting initial patient:", res[0]);
          setSelectedPatient(res[0]);
        }
      } catch (error) {
        console.error("Error fetching patients:", error);
        setLastError(`Failed to load patients: ${error.message}`);
        toast.error("Failed to load patients");
      }
    };

    fetchPatients();
  }, [currentUser.id]);

  // Filter patients when search query changes
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredPatients(patients);
    } else {
      const filtered = patients.filter((patient) =>
        patient.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredPatients(filtered);
    }
  }, [searchQuery, patients]);

  // Fetch messages when patient is selected with better error handling
  useEffect(() => {
    if (!selectedPatient || !currentUser?.id) return;

    const fetchMessages = async () => {
      try {
        console.log(
          `Fetching messages between ${currentUser.id} and ${selectedPatient.id}`
        );
        const response = await get(
          `/api/chat/get-messages?senderId=${selectedPatient.id}&receiverId=${currentUser.id}`
        );

        console.log("Fetched messages:", response);

        if (!Array.isArray(response)) {
          throw new Error("Invalid response format - expected array");
        }

        const formattedMessages = response.map((msg) => ({
          ...msg,
          isOwn: msg.sender_id === currentUser.id,
        }));

        setMessages(formattedMessages);
      } catch (error) {
        console.error("Error fetching messages:", error);
        setLastError(`Failed to load messages: ${error.message}`);
        toast.error("Failed to load messages");
      }
    };

    fetchMessages();

    const handleNewMessage = (newMessage) => {
      console.log("Received new message:", newMessage);
      if (
        (newMessage.senderId === currentUser.id &&
          newMessage.receiverId === selectedPatient?.id) ||
        (newMessage.senderId === selectedPatient?.id &&
          newMessage.receiverId === currentUser.id)
      ) {
        // Check if message already exists to prevent duplicates
        if (messages.some((msg) => msg.id === newMessage.id)) {
          console.log("Duplicate message detected, ignoring");
          return;
        }

        setMessages((prev) => [
          ...prev,
          {
            ...newMessage,
            isOwn: newMessage.senderId === currentUser.id,
          },
        ]);
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

  // Focus textarea when patient changes
  useEffect(() => {
    if (selectedPatient && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [selectedPatient]);

  // ... (keep your existing handleImageUpload, removeSelectedImage, sendImage functions)

  const sendReply = async () => {
    if (!selectedPatient) {
      toast.error("Please select a patient first");
      return;
    }

    if (selectedImage) {
      await sendImage();
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
      console.log("Sending message:", {
        senderId: currentUser.id,
        receiverId: selectedPatient.id,
        message: trimmedMessage,
      });

      const response = await post("/api/chat/send-message", {
        senderId: currentUser.id,
        receiverId: selectedPatient.id,
        message: trimmedMessage,
      });

      console.log("Send message response:", response);

      if (response.success) {
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
      setLastError(`Failed to send message: ${error.message}`);
      toast.error("Failed to send message");
      setMessages((prev) => prev.filter((msg) => msg.id !== tempId));
    }
  };

  // Debug panel component
  const DebugPanel = () => (
    <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg border border-red-200 z-50 max-w-xs">
      <h3 className="font-bold text-red-600">Debug Information</h3>
      <div className="mt-2 space-y-1 text-sm">
        <p>
          <strong>Socket Status:</strong> {connectionStatus}
        </p>
        <p>
          <strong>Current User ID:</strong> {currentUser?.id || "None"}
        </p>
        <p>
          <strong>Selected Patient ID:</strong> {selectedPatient?.id || "None"}
        </p>
        <p>
          <strong>Message Count:</strong> {messages.length}
        </p>
        {lastError && (
          <p className="text-red-500">
            <strong>Last Error:</strong> {lastError}
          </p>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex h-[calc(100vh-6rem)] bg-gray-50 rounded-lg overflow-hidden shadow-lg">
      {/* Debug panel - remove in production */}
      <DebugPanel />

      {/* Patients Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Sidebar Header */}
        <div className="px-4 py-3 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Messages</h2>
          <div className="text-xs text-gray-500 mt-1">
            Status: {isConnected ? "Connected" : "Disconnected"}
          </div>

          {/* Search Box */}
          <div className="mt-3 relative">
            <input
              type="text"
              placeholder="Search patients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-2 bg-gray-100 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <MdSearch className="absolute left-2 top-2.5 text-gray-500" />
          </div>
        </div>

        {/* Patients List */}
        <div className="flex-1 overflow-y-auto">
          {filteredPatients.length === 0 && (
            <div className="text-center text-gray-500 p-4">
              {searchQuery
                ? "No matching patients found"
                : "No conversations yet"}
            </div>
          )}

          <ul className="divide-y divide-gray-200">
            {filteredPatients.map((patient) => (
              <li
                key={patient.id}
                className={`cursor-pointer hover:bg-gray-50 transition-colors ${
                  selectedPatient?.id === patient.id ? "bg-blue-50" : ""
                }`}
                onClick={() => {
                  console.log("Selecting patient:", patient);
                  setSelectedPatient(patient);
                }}
              >
                <div className="flex items-center p-3">
                  <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
                    {patient.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="ml-3 flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p
                        className={`text-sm font-medium truncate ${
                          selectedPatient?.id === patient.id
                            ? "text-primary"
                            : "text-gray-900"
                        }`}
                      >
                        {patient.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {patient.last_message_time
                          ? new Date(
                              patient.last_message_time
                            ).toLocaleTimeString()
                          : ""}
                      </p>
                    </div>
                    {patient.unread_count > 0 && (
                      <span className="ml-2 bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                        {patient.unread_count}
                      </span>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-gray-100">
        {/* Chat Header */}
        {selectedPatient ? (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-b border-gray-200">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white">
                {selectedPatient.name.charAt(0).toUpperCase()}
              </div>
              <div className="ml-3">
                <h3 className="font-medium text-gray-900">
                  {selectedPatient.name}
                </h3>
                <div className="flex items-center text-xs text-gray-500">
                  <MdCircle className="text-green-500 mr-1" size={8} />
                  Online
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="p-2 text-gray-500 hover:text-primary hover:bg-gray-100 rounded-full">
                <MdPhoneInTalk size={20} />
              </button>
              <button className="p-2 text-gray-500 hover:text-primary hover:bg-gray-100 rounded-full">
                <MdMoreVert size={20} />
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white px-4 py-3 border-b border-gray-200">
            <h3 className="font-medium text-gray-500">
              Select a patient to start chatting
            </h3>
          </div>
        )}

        {/* Messages Container */}
        <div
          ref={messageContainerRef}
          className="flex-1 overflow-y-auto p-4 space-y-4"
        >
          {selectedPatient ? (
            messages.length > 0 ? (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.isOwn ? "justify-end" : "justify-start"
                  }`}
                >
                  <div className="max-w-[70%] mb-3">
                    <div
                      className={`px-4 py-2 rounded-2xl ${
                        msg.isOwn
                          ? "bg-primary text-white rounded-tr-md"
                          : "bg-white text-gray-800 border border-gray-200 rounded-tl-md"
                      }`}
                    >
                      {msg.imageUrl ? (
                        <div className="max-w-xs">
                          <img
                            src={msg.imageUrl}
                            alt="Sent content"
                            className="rounded-lg max-h-60 object-contain"
                          />
                          <p className="mt-2 whitespace-pre-wrap break-words">
                            {msg.message}
                          </p>
                        </div>
                      ) : (
                        <p className="whitespace-pre-wrap break-words">
                          {msg.message}
                        </p>
                      )}
                    </div>
                    <div
                      className={`text-xs text-gray-500 mt-1 ${
                        msg.isOwn ? "text-right mr-1" : "ml-1"
                      }`}
                    >
                      {msg.created_at
                        ? new Date(msg.created_at).toLocaleTimeString()
                        : "Sending..."}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center text-gray-500">
                  <MdPersonOutline className="mx-auto text-5xl mb-2 text-gray-400" />
                  <p>No messages with this patient yet.</p>
                  <p className="text-sm">
                    Send a message to start the conversation!
                  </p>
                </div>
              </div>
            )
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-gray-500">
                <MdPersonOutline className="mx-auto text-5xl mb-2 text-gray-400" />
                <p>Select a patient to start messaging</p>
                <p className="text-sm">Your conversations will appear here</p>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        {selectedPatient && (
          <div className="bg-white p-3 border-t border-gray-200">
            <div className="flex gap-2 items-center bg-gray-100 rounded-lg px-3">
              <button className="text-gray-500 hover:text-primary">
                <MdOutlineEmojiEmotions size={22} />
              </button>
              <label className="cursor-pointer">
                <MdImage className="text-gray-600 text-lg hover:text-green-400" />
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={uploadImage}
                />
              </label>
              <textarea
                ref={textareaRef}
                className="flex-1 bg-transparent border-none resize-none py-3 px-2 focus:outline-none max-h-20"
                placeholder="Type your message..."
                rows={1}
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendReply();
                  }
                }}
              />
              <button
                onClick={sendReply}
                disabled={!replyMessage.trim()}
                className={`p-2 rounded-full ${
                  replyMessage.trim()
                    ? "bg-primary text-white hover:bg-blue-600"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                } transition-colors ml-2`}
                title="Send message"
              >
                <MdSend />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorChat;
