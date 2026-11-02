
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CareSchedule.css";

function CareSchedule() {
    const navigate = useNavigate();

    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const elderlyId = localStorage.getItem("mycaretaker_elderlyId");

        if (!elderlyId) {
            alert("Elderly profile not found.");
            navigate("/elderly/profile");
            return;
        }

        const fetchSchedules = async () => {
            try {
                const response = await fetch(
                    `http://localhost:8080/api/care-schedules/elderly/${elderlyId}`
                );

                if (!response.ok) {
                    throw new Error("Failed to load care schedules.");
                }

                const result = await response.json();
                setSchedules(result);
            } catch (error) {
                console.error("Failed to load schedules:", error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchSchedules();
    }, [navigate]);

    const formatDate = (date) => {
        if (!date) return "Date not provided";

        const parsedDate = new Date(`${date}T00:00:00`);

        if (Number.isNaN(parsedDate.getTime())) {
            return date;
        }

        return parsedDate.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "long",
            year: "numeric"
        });
    };

    const formatTime = (time) => {
        if (!time) return "Not provided";

        const [hours, minutes] = time.split(":");
        const parsedHours = Number(hours);

        if (Number.isNaN(parsedHours)) return time;

        const period = parsedHours >= 12 ? "PM" : "AM";
        const displayHours = parsedHours % 12 || 12;

        return `${displayHours}:${minutes || "00"} ${period}`;
    };

    const getStatusClass = (status) => {
        const normalizedStatus = (status || "").toUpperCase();

        if (normalizedStatus === "COMPLETED") {
            return "schedule-status-completed";
        }

        if (normalizedStatus === "CANCELLED" || normalizedStatus === "REJECTED") {
            return "schedule-status-cancelled";
        }

        if (normalizedStatus === "PENDING") {
            return "schedule-status-pending";
        }

        if (normalizedStatus === "CONFIRMED" || normalizedStatus === "ACCEPTED") {
            return "schedule-status-confirmed";
        }

        return "schedule-status-default";
    };

    if (loading) {
        return (
            <div className="care-schedule-page">
                <div className="schedule-loading">
                    <div className="schedule-spinner"></div>
                    <h2>Loading your care schedule</h2>
                    <p>Please wait while we retrieve your appointments.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="care-schedule-page">

            <div className="schedule-page-header">
                <div>
                    <span className="schedule-eyebrow">MYCARETAKER</span>
                    <h1>Care Schedule</h1>
                    <p>
                        Keep track of your planned care appointments
                        and caretaker visits.
                    </p>
                </div>

                <div className="schedule-header-icon">▦</div>
            </div>

            <div className="schedule-summary-card">
                <div className="schedule-summary-icon">▣</div>

                <div>
                    <span>Total Care Schedules</span>
                    <h2>{schedules.length}</h2>
                    <p>
                        {schedules.length === 1
                            ? "Appointment scheduled"
                            : "Appointments scheduled"}
                    </p>
                </div>
            </div>

            <div className="schedule-section-heading">
                <div>
                    <h2>Your Appointments</h2>
                    <p>Review your caretaker visits and their details.</p>
                </div>
            </div>

            {error ? (
                <div className="schedule-error">
                    <h3>Unable to load your schedule</h3>
                    <p>{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="schedule-retry-btn"
                    >
                        Try Again
                    </button>
                </div>
            ) : schedules.length === 0 ? (
                <div className="schedule-empty">
                    <div className="schedule-empty-icon">▦</div>
                    <h2>No Care Schedule Yet</h2>
                    <p>
                        You currently have no scheduled care appointments.
                        Once a care schedule is created, it will appear here.
                    </p>

                    <button
                        onClick={() => navigate("/elderly/find-caretaker")}
                    >
                        Find a Caretaker
                    </button>
                </div>
            ) : (
                <div className="schedule-list">
                    {schedules.map((schedule) => {
                        const caretakerName = [
                            schedule.caretaker?.user?.firstName,
                            schedule.caretaker?.user?.lastName
                        ].filter(Boolean).join(" ");

                        const initials = caretakerName
                            .split(" ")
                            .map((part) => part.charAt(0))
                            .join("")
                            .slice(0, 2)
                            .toUpperCase();

                        return (
                            <div
                                className="schedule-card"
                                key={schedule.scheduleId}
                            >
                                <div className="schedule-card-header">
                                    <div>
                                        <span className="schedule-number">
                                            APPOINTMENT #{schedule.scheduleId}
                                        </span>
                                        <h3>Care Visit</h3>
                                    </div>

                                    <span
                                        className={`schedule-status ${getStatusClass(schedule.status)}`}
                                    >
                                        {schedule.status || "Status unavailable"}
                                    </span>
                                </div>

                                <div className="schedule-date-time">
                                    <div className="schedule-detail-box">
                                        <span className="schedule-detail-icon">▦</span>
                                        <div>
                                            <small>Appointment Date</small>
                                            <strong>
                                                {formatDate(schedule.scheduleDate)}
                                            </strong>
                                        </div>
                                    </div>

                                    <div className="schedule-detail-box">
                                        <span className="schedule-detail-icon">◷</span>
                                        <div>
                                            <small>Start Time</small>
                                            <strong>
                                                {formatTime(schedule.startTime)}
                                            </strong>
                                        </div>
                                    </div>

                                    <div className="schedule-detail-box">
                                        <span className="schedule-detail-icon">◷</span>
                                        <div>
                                            <small>End Time</small>
                                            <strong>
                                                {formatTime(schedule.endTime)}
                                            </strong>
                                        </div>
                                    </div>
                                </div>

                                <div className="schedule-caretaker-section">
                                    <div className="schedule-caretaker-avatar">
                                        {initials || "C"}
                                    </div>

                                    <div className="schedule-caretaker-info">
                                        <small>Your Caretaker</small>
                                        <h4>{caretakerName || "Name not provided"}</h4>
                                        <p>
                                            {schedule.caretaker?.user?.email ||
                                                "Email not provided"}
                                        </p>
                                        <p>
                                            {schedule.caretaker?.user?.phone ||
                                                "Phone not provided"}
                                        </p>
                                    </div>
                                </div>

                                <div className="schedule-notes">
                                    <strong>Appointment Notes</strong>
                                    <p>
                                        {schedule.notes || "No notes provided."}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            <div className="schedule-back-section">
                <button
                    onClick={() => navigate("/elderly/dashboard")}
                    className="schedule-back-btn"
                >
                    ← Back to Dashboard
                </button>
            </div>

        </div>
    );
}

export default CareSchedule;
