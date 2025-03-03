import { useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";

// Establish socket connection
const socket = io("http://localhost:3000");

export default function Notification() {
    const [notifications, setNotifications] = useState([]);

//     useEffect(() => {
//         // Fetch stored notifications using Axios
//         axios.get("http://localhost:3000/notifications")
//             .then((response) => {
//                 setNotifications(response.data); // Assuming the response is in the expected format
//             })
//             .catch((error) => {
//                 console.error("Error fetching notifications", error);
//             });

//         // Listen for real-time notifications
//         socket.on("notification", (newNotification) => {
//             setNotifications((prev) => [newNotification, ...prev]);
//         });

//         // Clean up the socket listener when the component unmounts
//         return () => socket.off("notification");
//     }, []);

    return (
        <div className="p-4">
            <ul className="mt-2">
                {/* {notifications.map((notif) => (
                    <li key={notif.id} className="p-2 bg-gray-200 my-1 rounded">
                        {notif.message} <br />
                        <small>
                            {new Date(notif.created_at).toLocaleString()}
                        </small>
                    </li>
                ))} */}

                <li key="1" className="p-2 bg-gray-200 my-1 rounded">
                    Notification 1 <br />
                    <small>
                        {new Date().toLocaleString()}
                    </small>
                </li>
            </ul>
        </div>
    );
}
