
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function CareSchedule() {

    const navigate = useNavigate();

    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const elderlyId =
            localStorage.getItem("mycaretaker_elderlyId");

        if (!elderlyId) {

            alert(
                "Elderly profile not found."
            );

            navigate("/elderly/profile");
            return;
        }

        const fetchSchedules = async () => {

            try {

                const response = await fetch(
                    `http://localhost:8080/api/care-schedules/elderly/${elderlyId}`
                );

                if (!response.ok) {

                    throw new Error(
                        "Failed to load care schedules"
                    );
                }

                const result =
                    await response.json();

                setSchedules(result);

            } catch (error) {

                console.error(
                    "Failed to load schedules:",
                    error
                );

                alert(
                    "Failed to load care schedules."
                );

            } finally {

                setLoading(false);
            }
        };

        fetchSchedules();

    }, [navigate]);

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
                                <strong>Caretaker:</strong>{" "}
                                {schedule.caretaker?.user?.firstName}{" "}
                                {schedule.caretaker?.user?.lastName}
                            </p>

                            <p>
                                <strong>Email:</strong>{" "}
                                {schedule.caretaker?.user?.email}
                            </p>

                            <p>
                                <strong>Phone:</strong>{" "}
                                {schedule.caretaker?.user?.phone}
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

                        </div>

                    ))}

                </div>
            )}

            <br />

            <button
                onClick={() =>
                    navigate("/elderly/dashboard")
                }
            >
                Back to Dashboard
            </button>

        </div>
    );
}

export default CareSchedule;

