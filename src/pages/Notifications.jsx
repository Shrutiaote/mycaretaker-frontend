import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Notifications() {

    const navigate = useNavigate();

    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {

        const savedUser =
            localStorage.getItem("mycaretaker_user");

        if (!savedUser) {

            navigate("/login");
            return;
        }

        const user = JSON.parse(savedUser);

        const fetchNotifications = async () => {

            try {

                const response = await fetch(
                    `http://localhost:8080/api/notifications/user/${user.userId}`
                );

                if (!response.ok) {

                    throw new Error(
                        "Failed to load notifications"
                    );
                }

                const result =
                    await response.json();

                setNotifications(result);
                setError("");

            } catch (error) {

                console.error(
                    "Failed to load notifications:",
                    error
                );

                setError(
                    "Unable to load notifications. Please make sure the backend is running."
                );

            } finally {

                setLoading(false);
            }
        };

        fetchNotifications();

    }, [navigate]);


    const markAsRead = async (notificationId) => {

        try {

            const response = await fetch(
                `http://localhost:8080/api/notifications/${notificationId}/read`,
                {
                    method: "PUT"
                }
            );

            if (!response.ok) {

                throw new Error(
                    "Failed to mark notification as read"
                );
            }

            const updatedNotification =
                await response.json();

            setNotifications((previousNotifications) =>
                previousNotifications.map(
                    (notification) =>
                        notification.notificationId === notificationId
                            ? updatedNotification
                            : notification
                )
            );

        } catch (error) {

            console.error(
                "Failed to mark notification as read:",
                error
            );

            setError(
                "Unable to mark notification as read."
            );
        }
    };


    const markAllAsRead = async () => {

        const savedUser =
            localStorage.getItem("mycaretaker_user");

        if (!savedUser) {
            return;
        }

        const user = JSON.parse(savedUser);

        try {

            const response = await fetch(
                `http://localhost:8080/api/notifications/user/${user.userId}/read-all`,
                {
                    method: "PUT"
                }
            );

            if (!response.ok) {

                throw new Error(
                    "Failed to mark all notifications as read"
                );
            }

            setNotifications(
                (previousNotifications) =>
                    previousNotifications.map(
                        (notification) => ({
                            ...notification,
                            readStatus: true
                        })
                    )
            );

        } catch (error) {

            console.error(
                "Failed to mark all notifications as read:",
                error
            );

            setError(
                "Unable to mark all notifications as read."
            );
        }
    };


    const getDashboardPath = () => {

        const savedUser =
            localStorage.getItem("mycaretaker_user");

        if (!savedUser) {
            return "/login";
        }

        const user = JSON.parse(savedUser);

        if (user.role?.roleName === "CARETAKER") {
            return "/caretaker/dashboard";
        }

        if (user.role?.roleName === "ADMIN") {
            return "/admin/dashboard";
        }

        return "/elderly/dashboard";
    };


    if (loading) {

        return (
            <div>

                <h1>Notifications</h1>

                <p>
                    Loading notifications...
                </p>

            </div>
        );
    }


    const unreadCount =
        notifications.filter(
            (notification) =>
                !notification.readStatus
        ).length;


    return (
        <div>

            <h1>Notifications</h1>

            <p>
                You have {unreadCount} unread notification
                {unreadCount !== 1 ? "s" : ""}.
            </p>

            {error && (

                <p>
                    <strong>
                        {error}
                    </strong>
                </p>

            )}

            <hr />

            {notifications.length === 0 ? (

                <div>

                    <h2>No Notifications</h2>

                    <p>
                        You currently have no notifications.
                    </p>

                </div>

            ) : (

                <div>

                    <button
                        onClick={markAllAsRead}
                    >
                        Mark All as Read
                    </button>

                    <br />
                    <br />

                    {notifications.map(
                        (notification) => (

                            <div
                                key={
                                    notification.notificationId
                                }
                                style={{
                                    border: "1px solid #ccc",
                                    padding: "15px",
                                    marginBottom: "15px",
                                    backgroundColor:
                                        notification.readStatus
                                            ? "#f5f5f5"
                                            : "#e8f4ff"
                                }}
                            >

                                <p>
                                    <strong>
                                        {notification.message}
                                    </strong>
                                </p>

                                <p>
                                    Date:{" "}
                                    {notification.notificationDate
                                        ? new Date(
                                            notification.notificationDate
                                        ).toLocaleString()
                                        : "Not available"}
                                </p>

                                <p>
                                    Status:{" "}
                                    {notification.readStatus
                                        ? "Read"
                                        : "Unread"}
                                </p>

                                {!notification.readStatus && (

                                    <button
                                        onClick={() =>
                                            markAsRead(
                                                notification.notificationId
                                            )
                                        }
                                    >
                                        Mark as Read
                                    </button>

                                )}

                            </div>

                        )
                    )}

                </div>

            )}

            <br />

            <button
                onClick={() =>
                    navigate(getDashboardPath())
                }
            >
                Back to Dashboard
            </button>

        </div>
    );
}

export default Notifications;