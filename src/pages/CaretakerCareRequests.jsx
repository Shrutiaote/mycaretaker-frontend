
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function CaretakerCareRequests() {

    const navigate = useNavigate();

    const user = JSON.parse(
        localStorage.getItem("mycaretaker_user")
    );

    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    const loadRequests = async () => {

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

            const response = await fetch(
                `http://localhost:8080/api/care-requests/caretaker/${caretaker.caretakerId}`
            );

            if (!response.ok) {
                throw new Error(
                    "Unable to load care requests"
                );
            }

            const data = await response.json();

            setRequests(data);

        } catch (error) {

            console.error(error);

            setMessage(
                "Unable to load care requests."
            );

        } finally {

            setLoading(false);
        }
    };


    useEffect(() => {

        if (!user) {
            navigate("/login");
            return;
        }

        loadRequests();

    }, [navigate, user?.userId]);


    const updateStatus = async (
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
                throw new Error(
                    "Unable to update request status"
                );
            }

            alert(
                `Care request ${status.toLowerCase()} successfully!`
            );

            loadRequests();

        } catch (error) {

            console.error(error);

            alert(
                "Unable to update care request."
            );
        }
    };


    if (loading) {
        return <p>Loading care requests...</p>;
    }


    return (
        <div>

            <h1>MyCaretaker</h1>

            <h2>Care Requests</h2>

            <hr />

            {message && (
                <p>{message}</p>
            )}


            {requests.length === 0 ? (

                <p>
                    No care requests found.
                </p>

            ) : (

                requests.map((request) => (

                    <div
                        key={request.careRequestId}
                        style={{
                            border: "1px solid #ccc",
                            padding: "15px",
                            marginBottom: "20px"
                        }}
                    >

                        <h3>
                            Care Request #
                            {request.careRequestId}
                        </h3>


                        <p>
                            <strong>Request Type:</strong>{" "}
                            {request.familyMember
                                ? "FAMILY_MEMBER_REQUEST"
                                : "ELDERLY_REQUEST"}
                        </p>


                        <hr />


                        <h3>
                            Elderly Person
                        </h3>

                        <p>
                            <strong>Name:</strong>{" "}
                            {request.elderly?.user?.firstName}{" "}
                            {request.elderly?.user?.lastName}
                        </p>

                        <p>
                            <strong>Email:</strong>{" "}
                            {request.elderly?.user?.email}
                        </p>

                        <p>
                            <strong>Phone:</strong>{" "}
                            {request.elderly?.user?.phone}
                        </p>


                        {request.familyMember && (
                            <div>

                                <hr />

                                <h3>
                                    Requested By
                                </h3>

                                <p>
                                    <strong>Name:</strong>{" "}
                                    {request.familyMember?.user?.firstName}{" "}
                                    {request.familyMember?.user?.lastName}
                                </p>

                                <p>
                                    <strong>Email:</strong>{" "}
                                    {request.familyMember?.user?.email}
                                </p>

                                <p>
                                    <strong>Phone:</strong>{" "}
                                    {request.familyMember?.user?.phone}
                                </p>

                            </div>
                        )}


                        <hr />


                        <h3>
                            Request Details
                        </h3>

                        <p>
                            <strong>Message:</strong>{" "}
                            {request.message ||
                                "No message provided"}
                        </p>

                        <p>
                            <strong>Status:</strong>{" "}
                            {request.status}
                        </p>

                        <p>
                            <strong>Request Date:</strong>{" "}
                            {request.requestDate
                                ? new Date(
                                    request.requestDate
                                ).toLocaleString()
                                : "Not available"}
                        </p>


                        <hr />


                        {request.status === "PENDING" && (

                            <div>

                                <button
                                    onClick={() =>
                                        updateStatus(
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
                                        updateStatus(
                                            request.careRequestId,
                                            "REJECTED"
                                        )
                                    }
                                >
                                    Reject
                                </button>

                            </div>

                        )}


                        {request.status === "ACCEPTED" && (

                            <div>

                                <p>
                                    This request has been
                                    accepted.
                                </p>

                                <button
                                    onClick={() =>
                                        navigate(
                                            `/caretaker/create-schedule/${request.careRequestId}`
                                        )
                                    }
                                >
                                    Create Care Schedule
                                </button>

                            </div>

                        )}


                        {request.status === "REJECTED" && (

                            <p>
                                This request has been
                                rejected.
                            </p>

                        )}

                    </div>

                ))

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

