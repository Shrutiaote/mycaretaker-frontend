
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function CaretakerCareRequests() {

    const navigate = useNavigate();

    const [requests, setRequests] = useState([]);
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

        const fetchCaretakerProfile = async () => {

            try {

                const response = await fetch(
                    `http://localhost:8080/api/caretakers/user/${user.userId}`
                );

                if (!response.ok) {

                    throw new Error(
                        "Caretaker profile not found"
                    );
                }

                const caretaker =
                    await response.json();

                await fetchRequests(
                    caretaker.caretakerId
                );

            } catch (error) {

                console.error(
                    "Failed to load caretaker profile:",
                    error
                );

                alert(
                    "Unable to load caretaker profile."
                );

                setLoading(false);
            }
        };


        const fetchRequests = async (caretakerId) => {

            try {

                const response = await fetch(
                    `http://localhost:8080/api/care-requests/caretaker/${caretakerId}`
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


        fetchCaretakerProfile();

    }, [navigate]);


    const updateRequestStatus = async (
        careRequestId,
        status
    ) => {

        try {

            const response = await fetch(
                `http://localhost:8080/api/care-requests/${careRequestId}/status?status=${status}`,
                {
                    method: "PUT"
                }
            );

            if (!response.ok) {

                const errorMessage =
                    await response.text();

                throw new Error(errorMessage);
            }

            const updatedRequest =
                await response.json();

            setRequests((previousRequests) =>
                previousRequests.map((request) =>
                    request.careRequestId === careRequestId
                        ? updatedRequest
                        : request
                )
            );

            alert(
                `Care request ${status.toLowerCase()} successfully!`
            );

        } catch (error) {

            console.error(
                "Failed to update request:",
                error
            );

            alert(
                "Failed to update request: " +
                error.message
            );
        }
    };


    if (loading) {

        return (
            <div>

                <h1>Care Requests</h1>

                <p>
                    Loading care requests...
                </p>

            </div>
        );
    }


    return (
        <div>

            <h1>Care Requests</h1>

            <p>
                View and manage requests from elderly persons.
            </p>

            <hr />

            {requests.length === 0 ? (

                <div>

                    <h2>No Care Requests</h2>

                    <p>
                        You currently have no care requests.
                    </p>

                </div>

            ) : (

                <div>

                    <h2>
                        Requests: {requests.length}
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
                                <strong>
                                    Elderly Person:
                                </strong>{" "}
                                {request.elderly?.user?.firstName}{" "}
                                {request.elderly?.user?.lastName}
                            </p>

                            <p>
                                <strong>
                                    Email:
                                </strong>{" "}
                                {request.elderly?.user?.email}
                            </p>

                            <p>
                                <strong>
                                    Phone:
                                </strong>{" "}
                                {request.elderly?.user?.phone}
                            </p>

                            <p>
                                <strong>
                                    Message:
                                </strong>{" "}
                                {request.message}
                            </p>

                            <p>
                                <strong>
                                    Request Date:
                                </strong>{" "}
                                {request.requestDate
                                    ? new Date(
                                        request.requestDate
                                    ).toLocaleString()
                                    : "Not available"}
                            </p>

                            <p>
                                <strong>
                                    Status:
                                </strong>{" "}
                                {request.status}
                            </p>


                           <div>

                          <button
                           onClick={() =>
                            navigate(`/caretaker/create-schedule/${request.careRequestId}` )
                            }
                            >Create Care Schedule
                            </button>

                            </div>


                            {request.status?.trim().toUpperCase() === "PENDING" && (

                                <div>

                                    <button
                                        onClick={() =>
                                            updateRequestStatus(
                                                request.careRequestId,
                                                "ACCEPTED"
                                            )
                                        }
                                    >
                                        Accept
                                    </button>

                                    {" "}

                                    <button
                                        onClick={() =>
                                            updateRequestStatus(
                                                request.careRequestId,
                                                "REJECTED"
                                            )
                                        }
                                    >
                                        Reject
                                    </button>

                                </div>

                            )}


                            {request.status?.trim().toUpperCase() === "REJECTED" && (

                                <p>
                                    This care request was rejected.
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

export default CaretakerCareRequests;

