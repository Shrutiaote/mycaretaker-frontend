import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function FamilyCareSchedule() {

    const navigate = useNavigate();

    const user = JSON.parse(
        localStorage.getItem("mycaretaker_user")
    );

    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    useEffect(() => {

        if (!user) {
            navigate("/login");
            return;
        }

        const loadSchedules = async () => {

            try {

                // Get connected elderly person
                const elderlyResponse = await fetch(
                    `http://localhost:8080/api/family-members/user/${user.userId}/elderly`
                );

                if (!elderlyResponse.ok) {
                    throw new Error(
                        "No elderly person connected"
                    );
                }

                const elderly =
                    await elderlyResponse.json();

                // Get care schedules for elderly
                const scheduleResponse = await fetch(
                    `http://localhost:8080/api/care-schedules/elderly/${elderly.elderlyId}`
                );

                if (!scheduleResponse.ok) {
                    throw new Error(
                        "Unable to load care schedules"
                    );
                }

                const data =
                    await scheduleResponse.json();

                setSchedules(data);

            } catch (error) {

                console.error(error);

                setMessage(
                    "Unable to load care schedules."
                );

            } finally {

                setLoading(false);
            }
        };

        loadSchedules();

    }, [navigate, user?.userId]);


    if (loading) {
        return <p>Loading care schedules...</p>;
    }


    return (
        <div>

            <h1>MyCaretaker</h1>

            <h2>Care Schedule</h2>

            <hr />

            {message && (
                <p>{message}</p>
            )}

            {schedules.length === 0 ? (

                <p>
                    No care schedules found.
                </p>

            ) : (

                schedules.map((schedule) => (

                    <div
                        key={schedule.scheduleId}
                        style={{
                            border: "1px solid #ccc",
                            padding: "15px",
                            marginBottom: "20px"
                        }}
                    >

                        <h3>
                            Care Schedule #
                            {schedule.scheduleId}
                        </h3>

                        <p>
                            <strong>Caretaker:</strong>{" "}
                            {schedule.caretaker?.user?.firstName}{" "}
                            {schedule.caretaker?.user?.lastName}
                        </p>

                        <p>
                            <strong>Caretaker Email:</strong>{" "}
                            {schedule.caretaker?.user?.email}
                        </p>

                        <p>
                            <strong>Caretaker Phone:</strong>{" "}
                            {schedule.caretaker?.user?.phone}
                        </p>

                        <hr />

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
                                "No notes provided"}
                        </p>

                        <p>
                            <strong>Status:</strong>{" "}
                            {schedule.status}
                        </p>

                    </div>

                ))

            )}

            <br />

            <button
                onClick={() =>
                    navigate("/family/care-requests")
                }
            >
                My Care Requests
            </button>

            <br />
            <br />

            <button
                onClick={() =>
                    navigate("/family/dashboard")
                }
            >
                Back to Dashboard
            </button>

        </div>
    );
}

export default FamilyCareSchedule;