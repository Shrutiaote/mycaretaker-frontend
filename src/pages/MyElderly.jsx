import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function MyElderly() {

    const navigate = useNavigate();

    const user = JSON.parse(
        localStorage.getItem("mycaretaker_user")
    );

    const [elderly, setElderly] = useState(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    useEffect(() => {

        if (!user) {
            navigate("/login");
            return;
        }

        fetch(
            `http://localhost:8080/api/family-members/user/${user.userId}/elderly`
        )
            .then(response => {

                if (response.ok) {
                    return response.json();
                }

                throw new Error("No elderly person connected");
            })
            .then(data => {

                setElderly(data);
                setLoading(false);
            })
            .catch(() => {

                setMessage(
                    "No elderly person is connected to your account yet."
                );

                setLoading(false);
            });

    }, [navigate, user?.userId]);


    if (loading) {
        return <p>Loading...</p>;
    }


    return (
        <div>

            <h1>MyCaretaker</h1>

            <h2>My Elderly</h2>

            <hr />

            {elderly ? (

                <div>

                    <h3>
                        {elderly.user?.firstName}{" "}
                        {elderly.user?.lastName}
                    </h3>

                    <p>
                        <strong>Email:</strong>{" "}
                        {elderly.user?.email}
                    </p>

                    <p>
                        <strong>Phone:</strong>{" "}
                        {elderly.user?.phone}
                    </p>

                    <p>
                        <strong>Gender:</strong>{" "}
                        {elderly.gender || "Not provided"}
                    </p>

                    <p>
                        <strong>Care Requirements:</strong>{" "}
                        {elderly.careRequirements ||
                            "Not provided"}
                    </p>

                    <p>
                        <strong>Emergency Contact Name:</strong>{" "}
                        {elderly.emergencyContactName ||
                            "Not provided"}
                    </p>

                    <p>
                        <strong>Emergency Contact Relationship:</strong>{" "}
                        {elderly.emergencyContactRelationship ||
                            "Not provided"}
                    </p>

                    <p>
                        <strong>Emergency Contact Phone:</strong>{" "}
                        {elderly.emergencyContactPhone ||
                            "Not provided"}
                    </p>

                    <p>
                        <strong>Preferred Care Type:</strong>{" "}
                        {elderly.preferredCareType ||
                            "Not provided"}
                    </p>

                    <p>
                        <strong>Additional Information:</strong>{" "}
                        {elderly.additionalInformation ||
                            "Not provided"}
                    </p>

                    <br />

                   <button
                      onClick={() =>
                      navigate("/family/elderly-health-information")
                     }
                    >
                     View Health Information
                    </button>

                </div>

            ) : (

                <div>

                    <p>{message}</p>

                    <p>
                        You need to connect your account
                        to an elderly person.
                    </p>

                </div>

            )}

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

export default MyElderly;