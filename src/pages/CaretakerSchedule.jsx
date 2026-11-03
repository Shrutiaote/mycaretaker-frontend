
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CaretakerSchedule.css";

function CaretakerSchedule() {

    const navigate = useNavigate();

    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [filter, setFilter] = useState("ALL");
    const [updatingId, setUpdatingId] = useState(null);

    useEffect(() => {

        const savedUser = localStorage.getItem("mycaretaker_user");

        if (!savedUser) {
            navigate("/login");
            return;
        }

        let user;

        try {
            user = JSON.parse(savedUser);
        } catch {
            localStorage.removeItem("mycaretaker_user");
            navigate("/login");
            return;
        }

        const fetchCaretakerSchedule = async () => {

            try {

                setError("");

                const profileResponse = await fetch(
                    `http://localhost:8080/api/caretakers/user/${user.userId}`
                );

                if (!profileResponse.ok) {
                    throw new Error("Caretaker profile not found.");
                }

                const caretaker = await profileResponse.json();

                const scheduleResponse = await fetch(
                    `http://localhost:8080/api/care-schedules/caretaker/${caretaker.caretakerId}`
                );

                if (!scheduleResponse.ok) {
                    throw new Error("Failed to load care schedule.");
                }

                const result = await scheduleResponse.json();

                setSchedules(Array.isArray(result) ? result : []);

            } catch (error) {

                console.error(
                    "Failed to load caretaker schedule:",
                    error
                );

                setError(
                    error.message || "Failed to load care schedule."
                );

            } finally {

                setLoading(false);
            }
        };

        fetchCaretakerSchedule();

    }, [navigate]);

    const updateScheduleStatus = async (scheduleId, status) => {

        try {

            setUpdatingId(scheduleId);
            setError("");

            const response = await fetch(
                `http://localhost:8080/api/care-schedules/${scheduleId}/status?status=${status}`,
                {
                    method: "PUT"
                }
            );

            if (!response.ok) {

                const errorMessage = await response.text();

                throw new Error(
                    errorMessage || "Unable to update schedule."
                );
            }

            const updatedSchedule = await response.json();

            setSchedules(previousSchedules =>
                previousSchedules.map(item =>
                    item.scheduleId === scheduleId
                        ? updatedSchedule
                        : item
                )
            );

            alert(
                status === "COMPLETED"
                    ? "Schedule marked as completed!"
                    : "Schedule cancelled successfully!"
            );

        } catch (error) {

            console.error(
                "Failed to update schedule:",
                error
            );

            setError(
                "Failed to update schedule: " + error.message
            );

        } finally {

            setUpdatingId(null);
        }
    };

    const handleCancel = (scheduleId) => {

        const confirmed = window.confirm(
            "Are you sure you want to cancel this schedule?"
        );

        if (confirmed) {
            updateScheduleStatus(scheduleId, "CANCELLED");
        }
    };

    const formatDate = (date) => {

        if (!date) {
            return "Not available";
        }

        const parsedDate = new Date(date + "T00:00:00");

        if (Number.isNaN(parsedDate.getTime())) {
            return date;
        }

        return parsedDate.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "long",
            year: "numeric"
        });
    };

    const formatTime = (time) => {

        if (!time) {
            return "Not available";
        }

        const parts = time.split(":");

        if (parts.length < 2) {
            return time;
        }

        const hours = Number(parts[0]);
        const minutes = Number(parts[1]);

        if (Number.isNaN(hours) || Number.isNaN(minutes)) {
            return time;
        }

        const parsedTime = new Date();
        parsedTime.setHours(hours, minutes, 0, 0);

        return parsedTime.toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true
        });
    };

    const totalSchedules = schedules.length;

    const scheduledCount = schedules.filter(
        item => item.status === "SCHEDULED"
    ).length;

    const completedCount = schedules.filter(
        item => item.status === "COMPLETED"
    ).length;

    const cancelledCount = schedules.filter(
        item => item.status === "CANCELLED"
    ).length;

    const filteredSchedules = schedules.filter(schedule => {

        if (filter === "ALL") {
            return true;
        }

        return schedule.status === filter;
    });

    if (loading) {

        return (
            <div className="caretaker-schedule-loading">
                <div className="schedule-loader"></div>
                <p>Loading your care schedules...</p>
            </div>
        );
    }

    return (

        <div className="caretaker-schedule-page">

            {/* Header */}

            <header className="schedule-header">

                <div className="schedule-brand">
                    <span>💙</span>
                    <h2>MyCaretaker</h2>
                </div>

                <button
                    className="schedule-back-btn"
                    onClick={() => navigate("/caretaker/dashboard")}
                >
                    ← Dashboard
                </button>

            </header>

            <main className="schedule-container">

                {/* Page Heading */}

                <section className="schedule-page-heading">

                    <div>
                        <p className="schedule-subtitle">
                            CARETAKER PORTAL
                        </p>

                        <h1>My Care Schedule</h1>

                        <p>
                            Manage your assigned care appointments
                            and track their progress.
                        </p>
                    </div>

                    <div className="schedule-heading-icon">
                        📅
                    </div>

                </section>

                {/* Summary Cards */}

                <section className="schedule-summary">

                    <div className="schedule-summary-card">
                        <div className="schedule-summary-icon total">📋</div>
                        <div>
                            <p>Total Schedules</p>
                            <h2>{totalSchedules}</h2>
                        </div>
                    </div>

                    <div className="schedule-summary-card">
                        <div className="schedule-summary-icon scheduled">📅</div>
                        <div>
                            <p>Scheduled</p>
                            <h2>{scheduledCount}</h2>
                        </div>
                    </div>

                    <div className="schedule-summary-card">
                        <div className="schedule-summary-icon completed">✓</div>
                        <div>
                            <p>Completed</p>
                            <h2>{completedCount}</h2>
                        </div>
                    </div>

                    <div className="schedule-summary-card">
                        <div className="schedule-summary-icon cancelled">✕</div>
                        <div>
                            <p>Cancelled</p>
                            <h2>{cancelledCount}</h2>
                        </div>
                    </div>

                </section>

                {/* Schedule List */}

                <section className="schedule-list-section">

                    <div className="schedule-list-heading">
                        <div>
                            <h2>Your Appointments</h2>
                            <p>View and manage your care schedules.</p>
                        </div>
                    </div>

                    {/* Filters */}

                    <div className="schedule-filters">

                        {[
                            { label: "All Schedules", value: "ALL" },
                            { label: "Scheduled", value: "SCHEDULED" },
                            { label: "Completed", value: "COMPLETED" },
                            { label: "Cancelled", value: "CANCELLED" }
                        ].map(item => (

                            <button
                                key={item.value}
                                className={
                                    filter === item.value
                                        ? "schedule-filter active"
                                        : "schedule-filter"
                                }
                                onClick={() => setFilter(item.value)}
                            >
                                {item.label}
                            </button>

                        ))}

                    </div>

                    {error && (
                        <div className="schedule-error">
                            <span>{error}</span>
                            <button onClick={() => window.location.reload()}>
                                Reload
                            </button>
                        </div>
                    )}

                    {/* Empty State */}

                    {filteredSchedules.length === 0 ? (

                        <div className="schedule-empty">

                            <div className="schedule-empty-icon">
                                📭
                            </div>

                            <h3>
                                {schedules.length === 0
                                    ? "No Care Schedules Yet"
                                    : "No Schedules Found"}
                            </h3>

                            <p>
                                {schedules.length === 0
                                    ? "Your assigned care appointments will appear here."
                                    : "There are no schedules in this category."}
                            </p>

                            {filter !== "ALL" && (
                                <button onClick={() => setFilter("ALL")}>
                                    View All Schedules
                                </button>
                            )}

                        </div>

                    ) : (

                        <div className="schedule-card-list">

                            {filteredSchedules.map(schedule => (

                                <article
                                    className="caretaker-schedule-card"
                                    key={schedule.scheduleId}
                                >

                                    {/* Card Header */}

                                    <div className="schedule-card-header">

                                        <div>
                                            <span className="schedule-number">
                                                SCHEDULE #{schedule.scheduleId}
                                            </span>

                                            <h3>
                                                👴 {" "}
                                                {schedule.elderly?.user?.firstName || ""}
                                                {" "}
                                                {schedule.elderly?.user?.lastName || "Elderly Person"}
                                            </h3>
                                        </div>

                                        <span
                                            className={`schedule-status ${schedule.status?.toLowerCase()}`}
                                        >
                                            {schedule.status || "UNKNOWN"}
                                        </span>

                                    </div>

                                    <div className="schedule-divider"></div>

                                    {/* Elderly Details */}

                                    <div className="schedule-details-section">

                                        <h4>Contact Information</h4>

                                        <div className="schedule-details-grid">

                                            <div>
                                                <label>Email Address</label>
                                                <p>
                                                    {schedule.elderly?.user?.email || "Not available"}
                                                </p>
                                            </div>

                                            <div>
                                                <label>Phone Number</label>
                                                <p>
                                                    {schedule.elderly?.user?.phone || "Not available"}
                                                </p>
                                            </div>

                                        </div>

                                    </div>

                                    {/* Date and Time */}

                                    <div className="schedule-timing-section">

                                        <div className="schedule-timing-item">
                                            <span>📅</span>
                                            <div>
                                                <label>Schedule Date</label>
                                                <p>
                                                    {formatDate(schedule.scheduleDate)}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="schedule-timing-item">
                                            <span>🕒</span>
                                            <div>
                                                <label>Start Time</label>
                                                <p>
                                                    {formatTime(schedule.startTime)}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="schedule-timing-item">
                                            <span>🕒</span>
                                            <div>
                                                <label>End Time</label>
                                                <p>
                                                    {formatTime(schedule.endTime)}
                                                </p>
                                            </div>
                                        </div>

                                    </div>

                                    {/* Notes */}

                                    <div className="schedule-notes">

                                        <h4>Care Instructions / Notes</h4>

                                        <p>
                                            {schedule.notes || "No additional notes provided."}
                                        </p>

                                    </div>

                                    {/* Actions */}

                                    <div className="schedule-actions">

                                        {schedule.status === "SCHEDULED" && (

                                            <>
                                                <button
                                                    className="complete-schedule-btn"
                                                    disabled={updatingId === schedule.scheduleId}
                                                    onClick={() =>
                                                        updateScheduleStatus(
                                                            schedule.scheduleId,
                                                            "COMPLETED"
                                                        )
                                                    }
                                                >
                                                    {updatingId === schedule.scheduleId
                                                        ? "Updating..."
                                                        : "✓ Mark as Completed"}
                                                </button>

                                                <button
                                                    className="cancel-schedule-btn"
                                                    disabled={updatingId === schedule.scheduleId}
                                                    onClick={() =>
                                                        handleCancel(schedule.scheduleId)
                                                    }
                                                >
                                                    Cancel Schedule
                                                </button>
                                            </>

                                        )}

                                        {schedule.status === "COMPLETED" && (
                                            <p className="schedule-completed-message">
                                                ✓ This schedule has been completed.
                                            </p>
                                        )}

                                        {schedule.status === "CANCELLED" && (
                                            <p className="schedule-cancelled-message">
                                                This schedule has been cancelled.
                                            </p>
                                        )}

                                    </div>

                                </article>

                            ))}

                        </div>

                    )}

                </section>

                <footer className="schedule-footer">
                    © 2026 MyCaretaker. Caring with compassion.
                </footer>

            </main>

        </div>
    );
}

export default CaretakerSchedule;
