import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function CaretakerSchedule() {

    const navigate = useNavigate();

    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const savedUser =
            localStorage.getItem("mycaretaker_user");

        if (!savedUser) {

            alert("Please login first.");
            navigate("/login");
            return;
        }

        const user = JSON.parse(savedUser);

        const fetchCaretakerSchedule = async () => {

            try {

                const profileResponse = await fetch(
                    `http://localhost:8080/api/caretakers/user/${user.userId}`
                );

                if (!profileResponse.ok) {

                    throw new Error(
                        "Caretaker profile not found"
                    );
                }

                const caretaker =
                    await profileResponse.json();

                const scheduleResponse = await fetch(
                    `http://localhost:8080/api/care-schedules/caretaker/${caretaker.caretakerId}`
                );

                if (!scheduleResponse.ok) {

                    throw new Error(
                        "Failed to load care schedule"
                    );
                }

                const result =
                    await scheduleResponse.json();

                setSchedules(result);

            } catch (error) {

                console.error(
                    "Failed to load caretaker schedule:",
                    error
                );

                alert(
                    "Failed to load care schedule."
                );

            } finally {

                setLoading(false);
            }
        };

        fetchCaretakerSchedule();

    }, [navigate]);


    const updateScheduleStatus = async (
        scheduleId,
        status
    ) => {

        try {

            const response = await fetch(
                `http://localhost:8080/api/care-schedules/${scheduleId}/status?status=${status}`,
                {
                    method: "PUT"
                }
            );

            if (!response.ok) {

                const errorMessage =
                    await response.text();

                throw new Error(errorMessage);
            }

            const updatedSchedule =
                await response.json();

            setSchedules(
                (previousSchedules) =>
                    previousSchedules.map(
                        (item) =>
                            item.scheduleId === scheduleId
                                ? updatedSchedule
                                : item
                    )
            );

            if (status === "COMPLETED") {

                alert(
                    "Schedule marked as completed!"
                );

            } else if (status === "CANCELLED") {

                alert(
                    "Schedule cancelled successfully!"
                );
            }

        } catch (error) {

            console.error(
                "Failed to update schedule:",
                error
            );

            alert(
                "Failed to update schedule: " +
                error.message
            );
        }
    };


    if (loading) {

        return (
            <div>

                <h1>Care Schedule</h1>

                <p>
                    Loading care schedule...
                </p>

            </div>
        );
    }


    return (
        <div>

            <h1>Care Schedule</h1>

            <p>
                View your scheduled care appointments.
            </p>

            <hr />

            {schedules.length === 0 ? (

                <div>

                    <h2>No Care Schedule</h2>

                    <p>
                        You currently have no scheduled
                        care appointments.
                    </p>

                </div>

            ) : (

                <div>

                    <h2>
                        Your Schedules: {schedules.length}
                    </h2>

                    {schedules.map((schedule) => (

                        <div
                            key={schedule.scheduleId}
                            style={{
                                border: "1px solid #ccc",
                                padding: "15px",
                                marginBottom: "15px"
                            }}
                        >

                            <h3>
                                Schedule #
                                {schedule.scheduleId}
                            </h3>

                            <p>
                                <strong>
                                    Elderly Person:
                                </strong>{" "}
                                {schedule.elderly?.user?.firstName}{" "}
                                {schedule.elderly?.user?.lastName}
                            </p>

                            <p>
                                <strong>Email:</strong>{" "}
                                {schedule.elderly?.user?.email}
                            </p>

                            <p>
                                <strong>Phone:</strong>{" "}
                                {schedule.elderly?.user?.phone}
                            </p>

                            <p>
                                <strong>Date:</strong>{" "}
                                {schedule.scheduleDate}
                            </p>

                            <p>
                                <strong>Start Time:</strong>{" "}
                                {schedule.startTime}
                            </p>

                            <p>
                                <strong>End Time:</strong>{" "}
                                {schedule.endTime}
                            </p>

                            <p>
                                <strong>Notes:</strong>{" "}
                                {schedule.notes ||
                                    "No notes"}
                            </p>

                            <p>
                                <strong>Status:</strong>{" "}
                                {schedule.status}
                            </p>


                            {schedule.status === "SCHEDULED" && (

                                <div>

                                    <button
                                        onClick={() =>
                                            updateScheduleStatus(
                                                schedule.scheduleId,
                                                "COMPLETED"
                                            )
                                        }
                                    >
                                        Mark as Completed
                                    </button>

                                    {" "}

                                    <button
                                        onClick={() => {

                                            const confirmed =
                                                window.confirm(
                                                    "Are you sure you want to cancel this schedule?"
                                                );

                                            if (confirmed) {

                                                updateScheduleStatus(
                                                    schedule.scheduleId,
                                                    "CANCELLED"
                                                );
                                            }

                                        }}
                                    >
                                        Cancel Schedule
                                    </button>

                                </div>

                            )}


                            {schedule.status === "COMPLETED" && (

                                <p>
                                    This schedule has been completed.
                                </p>

                            )}


                            {schedule.status === "CANCELLED" && (

                                <p>
                                    This schedule has been cancelled.
                                </p>

                            )}

                        </div>

                    ))}

                </div>
            )}

            <br />

            <button
                onClick={() =>
                    navigate("/caretaker/dashboard")
                }
            >
                Back to Dashboard
            </button>

        </div>
    );
}

export default CaretakerSchedule;