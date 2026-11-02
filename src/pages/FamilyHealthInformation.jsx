import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function FamilyHealthInformation() {

    const navigate = useNavigate();

    const user = JSON.parse(
        localStorage.getItem("mycaretaker_user")
    );

    const [healthInformation, setHealthInformation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    useEffect(() => {

        if (!user) {
            navigate("/login");
            return;
        }

        const loadHealthInformation = async () => {

            try {

                // First get the connected elderly person
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

                // Then get the elderly person's health information
                const healthResponse = await fetch(
                    `http://localhost:8080/api/health-information/elderly/${elderly.elderlyId}`
                );

                if (!healthResponse.ok) {
                    throw new Error(
                        "Health information not found"
                    );
                }

                const healthData =
                    await healthResponse.json();

                setHealthInformation(healthData);

            } catch (error) {

                console.error(error);

                setMessage(
                    "Unable to load health information."
                );

            } finally {

                setLoading(false);
            }
        };

        loadHealthInformation();

    }, [navigate, user?.userId]);


    if (loading) {
        return <p>Loading health information...</p>;
    }


    return (
        <div>

            <h1>MyCaretaker</h1>

            <h2>
                Elderly Health Information
            </h2>

            <hr />

            {healthInformation ? (

                <div>

                    <p>
                        <strong>Blood Group:</strong>{" "}
                        {healthInformation.bloodGroup ||
                            "Not provided"}
                    </p>

                    <p>
                        <strong>Medical Conditions:</strong>{" "}
                        {healthInformation.medicalConditions ||
                            "Not provided"}
                    </p>

                    <p>
                        <strong>Allergies:</strong>{" "}
                        {healthInformation.allergies ||
                            "Not provided"}
                    </p>

                    <p>
                        <strong>Current Medications:</strong>{" "}
                        {healthInformation.currentMedications ||
                            "Not provided"}
                    </p>

                    <p>
                        <strong>Past Surgeries:</strong>{" "}
                        {healthInformation.pastSurgeries ||
                            "Not provided"}
                    </p>

                    <p>
                        <strong>Mobility Status:</strong>{" "}
                        {healthInformation.mobilityStatus ||
                            "Not provided"}
                    </p>

                    <p>
                        <strong>Dietary Requirements:</strong>{" "}
                        {healthInformation.dietaryRequirements ||
                            "Not provided"}
                    </p>

                    <p>
                        <strong>Doctor Name:</strong>{" "}
                        {healthInformation.doctorName ||
                            "Not provided"}
                    </p>

                    <p>
                        <strong>Doctor Contact:</strong>{" "}
                        {healthInformation.doctorContact ||
                            "Not provided"}
                    </p>

                    <p>
                        <strong>Additional Health Information:</strong>{" "}
                        {healthInformation.additionalHealthInformation ||
                            "Not provided"}
                    </p>

                </div>

            ) : (

                <p>
                    {message ||
                        "No health information available."}
                </p>

            )}

            <br />

            <button
                onClick={() =>
                    navigate("/family/elderly")
                }
            >
                Back to My Elderly
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

export default FamilyHealthInformation;