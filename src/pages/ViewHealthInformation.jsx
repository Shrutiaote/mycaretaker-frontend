import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function ViewHealthInformation() {

    const navigate = useNavigate();

    const [healthData, setHealthData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const fetchHealthInformation = async () => {

            const elderlyId = localStorage.getItem(
                "mycaretaker_elderlyId"
            );

            if (!elderlyId) {
                alert(
                    "Please complete your elderly profile first."
                );
                navigate("/elderly/profile");
                return;
            }

            try {

                const response = await fetch(
                    `http://localhost:8080/api/health-information/elderly/${elderlyId}`
                );

                if (response.status === 404) {
                    setHealthData(null);
                    return;
                }

                if (!response.ok) {
                    throw new Error(
                        "Failed to load health information"
                    );
                }

                const result = await response.json();

                setHealthData(result);

            } catch (error) {

                console.error(
                    "Failed to load health information:",
                    error
                );

                alert(
                    "Failed to load health information."
                );

            } finally {

                setLoading(false);
            }
        };

        fetchHealthInformation();

    }, [navigate]);

    if (loading) {

        return (
            <div>
                <h1>Health Information</h1>
                <p>Loading health information...</p>
            </div>
        );
    }

    return (
        <div>

            <h1>My Health Information</h1>

            <hr />

            {!healthData ? (

                <div>

                    <p>
                        No health information has been
                        added yet.
                    </p>

                    <button
                        onClick={() =>
                            navigate(
                                "/elderly/health-information"
                            )
                        }
                    >
                        Add Health Information
                    </button>

                </div>

            ) : (

                <div>

                    <p>
                        <strong>Blood Group:</strong>{" "}
                        {healthData.bloodGroup || "Not provided"}
                    </p>

                    <p>
                        <strong>
                            Medical Conditions:
                        </strong>{" "}
                        {healthData.medicalConditions ||
                            "Not provided"}
                    </p>

                    <p>
                        <strong>Allergies:</strong>{" "}
                        {healthData.allergies ||
                            "Not provided"}
                    </p>

                    <p>
                        <strong>
                            Current Medications:
                        </strong>{" "}
                        {healthData.currentMedications ||
                            "Not provided"}
                    </p>

                    <p>
                        <strong>Past Surgeries:</strong>{" "}
                        {healthData.pastSurgeries ||
                            "Not provided"}
                    </p>

                    <p>
                        <strong>
                            Mobility Status:
                        </strong>{" "}
                        {healthData.mobilityStatus ||
                            "Not provided"}
                    </p>

                    <p>
                        <strong>
                            Dietary Requirements:
                        </strong>{" "}
                        {healthData.dietaryRequirements ||
                            "Not provided"}
                    </p>

                    <p>
                        <strong>Doctor Name:</strong>{" "}
                        {healthData.doctorName ||
                            "Not provided"}
                    </p>

                    <p>
                        <strong>Doctor Contact:</strong>{" "}
                        {healthData.doctorContact ||
                            "Not provided"}
                    </p>

                    <p>
                        <strong>
                            Additional Information:
                        </strong>{" "}
                        {healthData.additionalHealthInformation ||
                            "Not provided"}
                    </p>

                    <br />

                    <button
                        onClick={() =>
                            navigate(
                                "/elderly/health-information"
                            )
                        }
                    >
                        Edit Health Information
                    </button>

                    <button
                        onClick={() =>
                            navigate(
                                "/elderly/dashboard"
                            )
                        }
                        style={{
                            marginLeft: "10px"
                        }}
                    >
                        Back to Dashboard
                    </button>

                </div>
            )}

        </div>
    );
}

export default ViewHealthInformation;