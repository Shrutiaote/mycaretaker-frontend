import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function CreateCareSchedule() {

    const navigate = useNavigate();
    const { careRequestId } = useParams();

    const [careRequest, setCareRequest] = useState(null);

    const [formData, setFormData] = useState({
        scheduleDate: "",
        startTime: "",
        endTime: "",
        notes: ""
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const loadCareRequest = async () => {

            try {

                const response = await fetch(
                    `http://localhost:8080/api/care-requests/${careRequestId}`
                );

                if (!response.ok) {

                    throw new Error(
                        "Unable to load care request"
                    );
                }

                const data = await response.json();

                if (data.status !== "ACCEPTED") {

                    alert(
                        "Only accepted care requests can be scheduled."
                    );

                    navigate("/caretaker/care-requests");

                    return;
                }

                setCareRequest(data);

            } catch (error) {

                console.error(
                    "Failed to load care request:",
                    error
                );

                alert(
                    "Failed to load care request: " +
                    error.message
                );

                navigate("/caretaker/care-requests");

            } finally {

                setLoading(false);
            }
        };

        loadCareRequest();

    }, [careRequestId, navigate]);


    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };


    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!careRequest) {
            alert("Care request information is not available.");
            return;
        }

        try {

            const elderlyId =
                careRequest.elderly.elderlyId;

            const caretakerId =
                careRequest.caretaker.caretakerId;

            const response = await fetch(
                `http://localhost:8080/api/care-schedules/elderly/${elderlyId}/caretaker/${caretakerId}`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        scheduleDate:
                            formData.scheduleDate,

                        startTime:
                            formData.startTime,

                        endTime:
                            formData.endTime,

                        notes:
                            formData.notes
                    })
                }
            );

            if (!response.ok) {

                const errorMessage =
                    await response.text();

                throw new Error(errorMessage);
            }

            const result =
                await response.json();

            console.log(
                "Care schedule created:",
                result
            );

            alert(
                "Care schedule created successfully!"
            );

            navigate(
                "/caretaker/care-schedule"
            );

        } catch (error) {

            console.error(
                "Schedule creation failed:",
                error
            );

            alert(
                "Failed to create schedule: " +
                error.message
            );
        }
    };


    if (loading) {

        return (
            <div>

                <h1>Create Care Schedule</h1>

                <p>
                    Loading care request...
                </p>

            </div>
        );
    }


    return (
        <div>

            <h1>Create Care Schedule</h1>

            <p>
                Care Request #{careRequestId}
            </p>

            <hr />

            {careRequest && (

                <div>

                    <h3>
                        Elderly Person
                    </h3>

                    <p>
                        Name:{" "}
                        {careRequest.elderly.user.firstName}{" "}
                        {careRequest.elderly.user.lastName}
                    </p>

                    <p>
                        Email:{" "}
                        {careRequest.elderly.user.email}
                    </p>

                    <p>
                        Phone:{" "}
                        {careRequest.elderly.user.phone}
                    </p>

                    <h3>
                        Request Message
                    </h3>

                    <p>
                        {careRequest.message}
                    </p>

                    <p>
                        Status:{" "}
                        {careRequest.status}
                    </p>

                    <hr />

                    <form onSubmit={handleSubmit}>

                        <div>

                            <label>
                                Schedule Date
                            </label>

                            <br />

                            <input
                                type="date"
                                name="scheduleDate"
                                value={
                                    formData.scheduleDate
                                }
                                onChange={handleChange}
                                required
                            />

                        </div>

                        <br />

                        <div>

                            <label>
                                Start Time
                            </label>

                            <br />

                            <input
                                type="time"
                                name="startTime"
                                value={
                                    formData.startTime
                                }
                                onChange={handleChange}
                                required
                            />

                        </div>

                        <br />

                        <div>

                            <label>
                                End Time
                            </label>

                            <br />

                            <input
                                type="time"
                                name="endTime"
                                value={
                                    formData.endTime
                                }
                                onChange={handleChange}
                                required
                            />

                        </div>

                        <br />

                        <div>

                            <label>
                                Notes
                            </label>

                            <br />

                            <textarea
                                name="notes"
                                rows="5"
                                cols="50"
                                placeholder="Enter any important information..."
                                value={
                                    formData.notes
                                }
                                onChange={handleChange}
                            ></textarea>

                        </div>

                        <br />

                        <button type="submit">
                            Create Schedule
                        </button>

                        {" "}

                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    "/caretaker/care-requests"
                                )
                            }
                        >
                            Cancel
                        </button>

                    </form>

                </div>
            )}

        </div>
    );
}

export default CreateCareSchedule;