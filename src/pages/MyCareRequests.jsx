
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function MyCareRequests() {

    const navigate = useNavigate();

    const [requests, setRequests] = useState([]);
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

        const fetchRequests = async () => {

            try {

                const response = await fetch(
                    `http://localhost:8080/api/care-requests/elderly/${elderlyId}`
                );

                if (!response.ok) {

                    throw new Error(
                        "Failed to load care requests"
                    );
                }

                const result =
                    await response.json();

                setRequests(result);

            } catch (error) {

                console.error(
                    "Failed to load care requests:",
                    error
                );

                alert(
                    "Failed to load care requests."
                );

            } finally {

                setLoading(false);
            }
        };

        fetchRequests();

    }, [navigate]);

    if (loading) {

        return (
            <div>

                <h1>My Care Requests</h1>

                <p>
                    Loading care requests...
                </p>

            </div>
        );
    }

    return (
        <div>

            <h1>My Care Requests</h1>

            <p>
                View the care requests you have sent
                to caretakers.
            </p>

            <hr />

            {requests.length === 0 ? (

                <div>

                    <h2>No Care Requests</h2>

                    <p>
                        You have not sent any care requests yet.
                    </p>

                    <button
                        onClick={() =>
                            navigate(
                                "/elderly/find-caretaker"
                            )
                        }
                    >
                        Find a Caretaker
                    </button>

                </div>

            ) : (

                <div>

                    <h2>
                        Your Requests: {requests.length}
                    </h2>

                    {requests.map((request) => (

                        <div
                            key={request.careRequestId}
                            style={{
                                border: "1px solid #ccc",
                                padding: "15px",
                                marginBottom: "15px"
                            }}
                        >

                            <h3>
                                Care Request #
                                {request.careRequestId}
                            </h3>

                            <p>
                                <strong>Caretaker:</strong>{" "}
                                {request.caretaker?.user?.firstName}{" "}
                                {request.caretaker?.user?.lastName}
                            </p>

                            <p>
                                <strong>Email:</strong>{" "}
                                {request.caretaker?.user?.email}
                            </p>

                            <p>
                                <strong>Phone:</strong>{" "}
                                {request.caretaker?.user?.phone}
                            </p>

                            <p>
                                <strong>Message:</strong>{" "}
                                {request.message}
                            </p>

                            <p>
                                <strong>Request Date:</strong>{" "}
                                {request.requestDate
                                    ? new Date(
                                        request.requestDate
                                    ).toLocaleString()
                                    : "Not available"}
                            </p>

                            <p>
                                <strong>Status:</strong>{" "}
                                {request.status}
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

export default MyCareRequests;

