import { useContext, useEffect, useState, useRef } from "react";
import { AuthContext } from "../../../context/authContext";
import { get, post } from "../../../utils/api";
import { toast } from "react-toastify";
import { ADToBS } from "bikram-sambat-js";
import socket from "./socket";
import {
  MdSend,
  MdPersonOutline,
  MdSearch,
  MdCircle,
  MdOutlineEmojiEmotions,
  MdAttachFile,
  MdMoreVert,
  MdPhoneInTalk,
} from "react-icons/md";

const DoctorChat = () => {
  const { currentUser } = useContext(AuthContext);
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [messages, setMessages] = useState([]);
  const [replyMessage, setReplyMessage] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef(null);
  const messageContainerRef = useRef(null);
  const textareaRef = useRef(null);

  // Initialize socket connection
  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }

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
    };
  }, [currentUser?.id]);

  // Fetch patients who have messaged this doctor
  useEffect(() => {
    if (!currentUser?.id) return;

    const fetchPatients = async () => {
      try {
        const res = await get(`/api/chat/conversations/${currentUser.id}`);
        setPatients(res);
        setFilteredPatients(res);
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
        (newMessage.senderId === currentUser.id &&
          newMessage.receiverId === selectedPatient?.id) ||
        (newMessage.senderId === selectedPatient?.id &&
          newMessage.receiverId === currentUser.id)
      ) {
        setMessages((prev) => {
          if (prev.some((msg) => msg.id === newMessage.id)) return prev; // Prevent duplicates
          return [...prev, newMessage];
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

  // Focus textarea when patient changes
  useEffect(() => {
    if (selectedPatient && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [selectedPatient]);

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
      setMessages((prev) => prev.filter((msg) => msg.id !== tempId)); // Remove optimistic message
    }
  };

  // Format the date in a readable format
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      const today = new Date();

      // For today's messages, just show time
      if (date.toDateString() === today.toDateString()) {
        return date.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
      }

      // For messages from this year, show month and day
      if (date.getFullYear() === today.getFullYear()) {
        return (
          date.toLocaleDateString([], { month: "short", day: "numeric" }) +
          " • " +
          date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        );
      }

      // For older messages, show full date
      return (
        date.toLocaleDateString([], {
          year: "numeric",
          month: "short",
          day: "numeric",
        }) +
        " • " +
        date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      );
    } catch (error) {
      return "Invalid date";
    }
  };

  // Generate the avatar initials and color
  const getAvatarDetails = (name) => {
    if (!name) return { initials: "?", color: "bg-gray-400" };

    const firstLetter = name.charAt(0).toUpperCase();

    // Generate a consistent color based on the name
    const colors = [
      "bg-blue-500",
      "bg-green-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-yellow-500",
      "bg-red-500",
      "bg-indigo-500",
      "bg-teal-500",
    ];

    const colorIndex = name.charCodeAt(0) % colors.length;
    return { initials: firstLetter, color: colors[colorIndex] };
  };

  return (
    <div className="flex h-[calc(100vh-6rem)] bg-gray-50 rounded-lg overflow-hidden shadow-lg">
      {/* Patients Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Sidebar Header */}
        <div className="px-4 py-3 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Messages</h2>

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
            {filteredPatients.map((patient) => {
              const avatar = getAvatarDetails(patient.name);

              return (
                <li
                  key={patient.id}
                  className={`cursor-pointer hover:bg-gray-50 transition-colors ${
                    selectedPatient?.id === patient.id ? "bg-blue-50" : ""
                  }`}
                  onClick={() => setSelectedPatient(patient)}
                >
                  <div className="flex items-center p-3">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-medium ${avatar.color}`}
                    >
                      {avatar.initials}
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
                        {/* Time of last message could go here */}
                        <p className="text-xs text-gray-500">
                          {patient.last_message_time
                            ? formatDate(patient.last_message_time)
                            : ""}
                        </p>
                      </div>
                    </div>
                    {patient.unread_count > 0 && (
                      <span className="ml-2 bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                        {patient.unread_count}
                      </span>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-gray-100">
        {/* Chat Header */}
        {selectedPatient ? (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-b border-gray-200">
            <div className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${
                  getAvatarDetails(selectedPatient.name).color
                }`}
              >
                {getAvatarDetails(selectedPatient.name).initials}
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
          style={{
            backgroundImage:
              'url("data:image/svg+xml,%3Csvg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z" fill="%23f3f4f6" fill-opacity="0.5" fill-rule="evenodd"/%3E%3C/svg%3E")',
          }}
        >
          {selectedPatient ? (
            messages.length > 0 ? (
              messages.map((msg, index) => {
                const isFirstInGroup =
                  index === 0 || messages[index - 1].isOwn !== msg.isOwn;

                const isLastInGroup =
                  index === messages.length - 1 ||
                  messages[index + 1].isOwn !== msg.isOwn;

                return (
                  <div
                    key={msg.id}
                    className={`flex ${
                      msg.isOwn ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[70%] ${
                        isLastInGroup ? "mb-3" : "mb-1"
                      }`}
                    >
                      {/* Message bubble */}
                      <div
                        className={`px-4 py-2 rounded-2xl ${
                          msg.isOwn
                            ? "bg-primary text-white"
                            : "bg-white text-gray-800 border border-gray-200"
                        } ${
                          isFirstInGroup && isLastInGroup
                            ? msg.isOwn
                              ? "rounded-tr-md"
                              : "rounded-tl-md"
                            : isFirstInGroup
                            ? msg.isOwn
                              ? "rounded-tr-md rounded-br-sm"
                              : "rounded-tl-md rounded-bl-sm"
                            : isLastInGroup
                            ? msg.isOwn
                              ? "rounded-tr-sm rounded-br-md"
                              : "rounded-tl-sm rounded-bl-md"
                            : msg.isOwn
                            ? "rounded-tr-sm rounded-br-sm"
                            : "rounded-tl-sm rounded-bl-sm"
                        }`}
                      >
                        <p className="whitespace-pre-wrap break-words">
                          {msg.message}
                        </p>
                      </div>

                      {/* Timestamp (only show for last message in group) */}
                      {isLastInGroup && (
                        <div
                          className={`text-xs text-gray-500 mt-1 ${
                            msg.isOwn ? "text-right mr-1" : "ml-1"
                          }`}
                        >
                          {msg.created_at
                            ? formatDate(msg.created_at)
                            : "Sending..."}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
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
            <div className="flex items-center bg-gray-100 rounded-lg px-3">
              <button className="text-gray-500 hover:text-primary">
                <MdOutlineEmojiEmotions size={22} />
              </button>
              <button className="text-gray-500 hover:text-primary ml-2">
                <MdAttachFile size={22} />
              </button>
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
                style={{ minHeight: "42px" }}
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
