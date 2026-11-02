import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function FamilyCareRequests() {

    const navigate = useNavigate();

    const user = JSON.parse(
        localStorage.getItem("mycaretaker_user")
    );

    const [familyMember, setFamilyMember] = useState(null);
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    useEffect(() => {

        if (!user) {
            navigate("/login");
            return;
        }

        const loadRequests = async () => {

            try {

                // Get Family Member profile
                const profileResponse = await fetch(
                    `http://localhost:8080/api/family-members/user/${user.userId}`
                );

                if (!profileResponse.ok) {
                    throw new Error(
                        "Family member profile not found"
                    );
                }

                const familyMemberData =
                    await profileResponse.json();

                setFamilyMember(familyMemberData);

                // Get Care Requests
                const response = await fetch(
                    `http://localhost:8080/api/care-requests/family-member/${familyMemberData.familyMemberId}`
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

        loadRequests();

    }, [navigate, user?.userId]);


    if (loading) {
        return <p>Loading care requests...</p>;
    }


    return (
        <div>

            <h1>MyCaretaker</h1>

            <h2>My Care Requests</h2>

            <hr />

            {message && (
                <p>{message}</p>
            )}

            {requests.length === 0 ? (

                <p>
                    You have not sent any care requests yet.
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
                            <strong>Elderly Person:</strong>{" "}
                            {request.elderly?.user?.firstName}{" "}
                            {request.elderly?.user?.lastName}
                        </p>

                        <p>
                            <strong>Caretaker:</strong>{" "}
                            {request.caretaker?.user?.firstName}{" "}
                            {request.caretaker?.user?.lastName}
                        </p>

                        <p>
                            <strong>Caretaker Email:</strong>{" "}
                            {request.caretaker?.user?.email}
                        </p>

                        <p>
                            <strong>Caretaker Phone:</strong>{" "}
                            {request.caretaker?.user?.phone}
                        </p>

                        <hr />

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

                    </div>

                ))

            )}

            <br />

            <button
                onClick={() =>
                    navigate("/family/find-caretaker")
                }
            >
                Find a Caretaker
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

export default FamilyCareRequests;