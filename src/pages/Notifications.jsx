
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Notifications.css";

function Notifications() {
    const navigate = useNavigate();

    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [updatingId, setUpdatingId] = useState(null);
    const [markingAll, setMarkingAll] = useState(false);

    const getSavedUser = () => {
        const savedUser = localStorage.getItem("mycaretaker_user");

        if (!savedUser) {
            return null;
        }

        try {
            return JSON.parse(savedUser);
        } catch {
            return null;
        }
    };

    useEffect(() => {
        const user = getSavedUser();

        if (!user?.userId) {
            navigate("/login");
            return;
        }

        const fetchNotifications = async () => {
            try {
                const response = await fetch(
                    `http://localhost:8080/api/notifications/user/${user.userId}`
                );

                if (!response.ok) {
                    throw new Error("Failed to load notifications.");
                }

                const result = await response.json();
                setNotifications(result);
                setError("");
            } catch (error) {
                console.error("Failed to load notifications:", error);
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
        setUpdatingId(notificationId);
        setError("");

        try {
            const response = await fetch(
                `http://localhost:8080/api/notifications/${notificationId}/read`,
                {
                    method: "PUT"
                }
            );

            if (!response.ok) {
                throw new Error("Failed to mark notification as read.");
            }

            const updatedNotification = await response.json();

            setNotifications((previousNotifications) =>
                previousNotifications.map((notification) =>
                    notification.notificationId === notificationId
                        ? updatedNotification
                        : notification
                )
            );
        } catch (error) {
            console.error("Failed to mark notification as read:", error);
            setError("Unable to mark notification as read. Please try again.");
        } finally {
            setUpdatingId(null);
        }
    };

    const markAllAsRead = async () => {
        const user = getSavedUser();

        if (!user?.userId) {
            navigate("/login");
            return;
        }

        setMarkingAll(true);
        setError("");

        try {
            const response = await fetch(
                `http://localhost:8080/api/notifications/user/${user.userId}/read-all`,
                {
                    method: "PUT"
                }
            );

            if (!response.ok) {
                throw new Error("Failed to mark all notifications as read.");
            }

            setNotifications((previousNotifications) =>
                previousNotifications.map((notification) => ({
                    ...notification,
                    readStatus: true
                }))
            );
        } catch (error) {
            console.error("Failed to mark all notifications as read:", error);
            setError("Unable to mark all notifications as read. Please try again.");
        } finally {
            setMarkingAll(false);
        }
    };

    const getDashboardPath = () => {
        const user = getSavedUser();

        if (!user) {
            return "/login";
        }

        const roleName = user.role?.roleName;

        if (roleName === "CARETAKER") {
            return "/caretaker/dashboard";
        }

        if (roleName === "ADMIN") {
            return "/admin/dashboard";
        }

        if (roleName === "FAMILY_MEMBER") {
            return "/family/dashboard";
        }

        return "/elderly/dashboard";
    };

    const unreadCount = notifications.filter(
        (notification) => !notification.readStatus
    ).length;

    const formatDate = (date) => {
        if (!date) {
            return "Date not available";
        }

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) {
            return "Date not available";
        }

        return parsedDate.toLocaleString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    if (loading) {
        return (
            <div className="notifications-page">
                <div className="notifications-loading">
                    <div className="notifications-spinner"></div>
                    <h2>Loading notifications</h2>
                    <p>Please wait while we retrieve your updates.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="notifications-page">

            <div className="notifications-header">
                <div>
                    <span className="notifications-eyebrow">
                        MYCARETAKER
                    </span>
                    <h1>Notifications</h1>
                    <p>
                        Stay updated with your latest activities and important messages.
                    </p>
                </div>

                <div className="notifications-header-icon">
                    ♧
                </div>
            </div>

            <div className="notifications-overview">
                <div className="notifications-overview-icon">
                    ♧
                </div>

                <div>
                    <span>Unread Notifications</span>
                    <h2>{unreadCount}</h2>
                    <p>
                        {unreadCount === 0
                            ? "You're all caught up!"
                            : `You have ${unreadCount} unread notification${unreadCount !== 1 ? "s" : ""}.`}
                    </p>
                </div>
            </div>

            {error && (
                <div className="notifications-error">
                    <span>{error}</span>
                </div>
            )}

            <div className="notifications-section-header">
                <div>
                    <h2>All Notifications</h2>
                    <p>
                        {notifications.length} notification
                        {notifications.length !== 1 ? "s" : ""}
                    </p>
                </div>

                {unreadCount > 0 && (
                    <button
                        className="mark-all-btn"
                        onClick={markAllAsRead}
                        disabled={markingAll}
                    >
                        {markingAll ? "Updating..." : "✓ Mark All as Read"}
                    </button>
                )}
            </div>

            {notifications.length === 0 ? (
                <div className="notifications-empty">
                    <div className="notifications-empty-icon">
                        ♧
                    </div>
                    <h2>No Notifications Yet</h2>
                    <p>
                        You currently have no notifications.
                        New updates will appear here when available.
                    </p>
                </div>
            ) : (
                <div className="notifications-list">
                    {notifications.map((notification) => (
                        <div
                            key={notification.notificationId}
                            className={`notification-card ${
                                notification.readStatus
                                    ? "notification-read"
                                    : "notification-unread"
                            }`}
                        >
                            <div className="notification-icon">
                                {notification.readStatus ? "✓" : "●"}
                            </div>

                            <div className="notification-content">
                                <div className="notification-message">
                                    <p>{notification.message}</p>

                                    {!notification.readStatus && (
                                        <span className="unread-indicator">
                                            New
                                        </span>
                                    )}
                                </div>

                                <div className="notification-meta">
                                    <span>
                                        ◷ {formatDate(notification.notificationDate)}
                                    </span>

                                    <span
                                        className={`notification-status ${
                                            notification.readStatus
                                                ? "read-label"
                                                : "unread-label"
                                        }`}
                                    >
                                        {notification.readStatus ? "Read" : "Unread"}
                                    </span>
                                </div>

                                {!notification.readStatus && (
                                    <button
                                        className="mark-read-btn"
                                        onClick={() =>
                                            markAsRead(notification.notificationId)
                                        }
                                        disabled={
                                            updatingId === notification.notificationId
                                        }
                                    >
                                        {updatingId === notification.notificationId
                                            ? "Updating..."
                                            : "Mark as Read"}
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="notifications-footer">
                <button
                    className="notifications-back-btn"
                    onClick={() => navigate(getDashboardPath())}
                >
                    ← Back to Dashboard
                </button>
            </div>

        </div>
    );
}

export default Notifications;
