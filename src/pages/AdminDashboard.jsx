import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {

    const navigate = useNavigate();

    const [caretakers, setCaretakers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        fetch("http://localhost:8080/api/caretakers")
            .then((response) => {

                if (!response.ok) {
                    throw new Error(
                        "Failed to load caretakers"
                    );
                }

                return response.json();
            })
            .then((data) => {

                console.log(
                    "Caretakers received:",
                    data
                );

                setCaretakers(data);
            })
            .catch((error) => {

                console.error(
                    "Error loading caretakers:",
                    error
                );

                alert(
                    "Failed to load caretakers."
                );
            })
            .finally(() => {

                setLoading(false);
            });

    }, []);

    const verifyCaretaker = async (caretakerId) => {

        try {

            const response = await fetch(
                `http://localhost:8080/api/admin/caretakers/${caretakerId}/verify`,
                {
                    method: "PUT"
                }
            );

            if (!response.ok) {

                const errorMessage =
                    await response.text();

                throw new Error(errorMessage);
            }

            const verifiedCaretaker =
                await response.json();

            console.log(
                "Verified caretaker:",
                verifiedCaretaker
            );

            setCaretakers((previousCaretakers) =>
                previousCaretakers.map((caretaker) =>
                    caretaker.caretakerId === caretakerId
                        ? verifiedCaretaker
                        : caretaker
                )
            );

            alert(
                "Caretaker verified successfully!"
            );

        } catch (error) {

            console.error(
                "Verification failed:",
                error
            );

            alert(
                "Verification failed: " +
                error.message
            );
        }
    };

    const handleLogout = () => {

        localStorage.removeItem(
            "mycaretaker_user"
        );

        navigate("/login");
    };

    if (loading) {

        return (
            <div>

                <h1>Admin Dashboard</h1>

                <p>
                    Loading caretakers...
                </p>

            </div>
        );
    }

    return (
        <div>

            <h1>MyCaretaker - Admin Dashboard</h1>

            <hr />

            <h2>
                Registered Caretakers:
                {" "}
                {caretakers.length}
            </h2>

            {caretakers.length === 0 ? (

                <div>

                    <p>
                        No caretakers registered yet.
                    </p>

                </div>

            ) : (

                caretakers.map((caretaker) => (

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
                            <strong>Status:</strong>{" "}
                            {caretaker.verificationStatus}
                        </p>

                        {caretaker.verificationStatus !==
                            "VERIFIED" && (

                            <button
                                onClick={() =>
                                    verifyCaretaker(
                                        caretaker.caretakerId
                                    )
                                }
                            >
                                Verify Caretaker
                            </button>
                        )}

                    </div>

                ))

            )}

            <br />

            <button onClick={handleLogout}>
                Logout
            </button>

        </div>
    );
}

export default AdminDashboard;