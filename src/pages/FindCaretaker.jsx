
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function FindCaretaker() {

    const navigate = useNavigate();

    const [caretakers, setCaretakers] = useState([]);
    const [loading, setLoading] = useState(true);

    const [selectedCaretaker, setSelectedCaretaker] = useState(null);
    const [message, setMessage] = useState("");

    useEffect(() => {

        const fetchCaretakers = async () => {

            try {

                const response = await fetch(
                    "http://localhost:8080/api/caretakers/verified"
                );

                if (!response.ok) {
                    throw new Error(
                        "Failed to load caretakers"
                    );
                }

                const result = await response.json();

                setCaretakers(result);

            } catch (error) {

                console.error(
                    "Failed to load caretakers:",
                    error
                );

                alert(
                    "Failed to load caretakers."
                );

            } finally {

                setLoading(false);
            }
        };

        fetchCaretakers();

    }, []);

    const handleSendRequest = (caretaker) => {

        setSelectedCaretaker(caretaker);
        setMessage("");
    };

    const submitCareRequest = async () => {

        const savedUser =
            localStorage.getItem("mycaretaker_user");

        const user = savedUser
            ? JSON.parse(savedUser)
            : null;

        if (!user) {

            alert("Please login first.");
            navigate("/login");
            return;
        }

        const elderlyId =
            localStorage.getItem("mycaretaker_elderlyId");

        if (!elderlyId) {

            alert(
                "Elderly profile not found. Please create your profile first."
            );

            navigate("/elderly/profile");
            return;
        }

        if (!message.trim()) {

            alert(
                "Please enter a message."
            );

            return;
        }

        try {

            const response = await fetch(
                `http://localhost:8080/api/care-requests/elderly/${elderlyId}/caretaker/${selectedCaretaker.caretakerId}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "text/plain"
                    },
                    body: message
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
                "Care request created:",
                result
            );

            alert(
                "Care request sent successfully!"
            );

            setSelectedCaretaker(null);
            setMessage("");

        } catch (error) {

            console.error(
                "Failed to send care request:",
                error
            );

            alert(
                "Failed to send care request: " +
                error.message
            );
        }
    };

    if (loading) {

        return (
            <div>
                <h1>Find a Caretaker</h1>
                <p>Loading caretakers...</p>
            </div>
        );
    }

    return (
        <div>

            <h1>Find a Caretaker</h1>

            <p>
                Find a suitable caretaker for your care needs.
            </p>

            <hr />

            {caretakers.length === 0 ? (

                <div>

                    <h2>No Caretakers Available</h2>

                    <p>
                        There are currently no verified
                        caretakers available.
                    </p>

                </div>

            ) : (

                <div>

                    <h2>Available Caretakers</h2>

                    {caretakers.map((caretaker) => (

                        <div
                            key={caretaker.caretakerId}
                            style={{
                                border: "1px solid #ccc",
                                padding: "15px",
                                marginBottom: "15px"
                            }}
                        >

                            <h3>
                                {caretaker.user?.firstName}{" "}
                                {caretaker.user?.lastName}
                            </h3>

                            <p>
                                <strong>Email:</strong>{" "}
                                {caretaker.user?.email}
                            </p>

                            <p>
                                <strong>Phone:</strong>{" "}
                                {caretaker.user?.phone}
                            </p>

                            <p>
                                <strong>Experience:</strong>{" "}
                                {caretaker.experience ||
                                    "Not provided"}
                            </p>

                            <p>
                                <strong>Qualification:</strong>{" "}
                                {caretaker.qualification ||
                                    "Not provided"}
                            </p>

                            <p>
                                <strong>Skills:</strong>{" "}
                                {caretaker.skills ||
                                    "Not provided"}
                            </p>

                            <p>
                                <strong>Availability:</strong>{" "}
                                {caretaker.availability ||
                                    "Not provided"}
                            </p>

                            <p>
                                <strong>Hourly Rate:</strong>{" "}
                                ₹{caretaker.hourlyRate}
                            </p>

                            <p>
                                <strong>About:</strong>{" "}
                                {caretaker.about ||
                                    "Not provided"}
                            </p>

                            <button
                                onClick={() =>
                                    handleSendRequest(caretaker)
                                }
                            >
                                Send Care Request
                            </button>

                        </div>
                    ))}

                </div>
            )}

            {selectedCaretaker && (

                <div
                    style={{
                        border: "1px solid #999",
                        padding: "20px",
                        marginTop: "20px"
                    }}
                >

                    <h2>
                        Send Care Request
                    </h2>

                    <p>
                        <strong>Caretaker:</strong>{" "}
                        {selectedCaretaker.user?.firstName}{" "}
                        {selectedCaretaker.user?.lastName}
                    </p>

                    <label>
                        Message
                    </label>

                    <br />

                    <textarea
                        rows="5"
                        cols="50"
                        placeholder="Describe your care requirements..."
                        value={message}
                        onChange={(e) =>
                            setMessage(e.target.value)
                        }
                    ></textarea>

                    <br />
                    <br />

                    <button
                        onClick={submitCareRequest}
                    >
                        Send Request
                    </button>

                    {" "}

                    <button
                        onClick={() => {
                            setSelectedCaretaker(null);
                            setMessage("");
                        }}
                    >
                        Cancel
                    </button>

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

export default FindCaretaker;

