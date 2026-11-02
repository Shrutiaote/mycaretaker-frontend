import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function FamilyMemberProfile() {

    const navigate = useNavigate();

    const user = JSON.parse(
        localStorage.getItem("mycaretaker_user")
    );

    const [formData, setFormData] = useState({
        relationshipWithElderly: "",
        emergencyContact: ""
    });

    const [profileExists, setProfileExists] = useState(false);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [elderly, setElderly] = useState(null);

   useEffect(() => {

    if (!user) {
        navigate("/login");
        return;
    }

    const loadProfile = async () => {

        try {

            const profileResponse = await fetch(
                `http://localhost:8080/api/family-members/user/${user.userId}`
            );

            if (profileResponse.ok) {

                const data = await profileResponse.json();

                setFormData({
                    relationshipWithElderly:
                        data.relationshipWithElderly || "",

                    emergencyContact:
                        data.emergencyContact || ""
                });

                setProfileExists(true);
            } else {

                setProfileExists(false);
            }

            const elderlyResponse = await fetch(
                `http://localhost:8080/api/family-members/user/${user.userId}/elderly`
            );

            if (elderlyResponse.ok) {

                const elderlyData =
                    await elderlyResponse.json();

                setElderly(elderlyData);
            }

        } catch (error) {

            console.error(error);

        } finally {

            setLoading(false);
        }
    };

    loadProfile();

}, [navigate, user?.userId]);


    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };


    const handleSubmit = async (e) => {

        e.preventDefault();

        setMessage("");

        try {

            const method = profileExists
                ? "PUT"
                : "POST";

            const response = await fetch(
                `http://localhost:8080/api/family-members/user/${user.userId}`,
                {
                    method: method,

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(formData)
                }
            );

            if (!response.ok) {
                throw new Error("Failed to save profile");
            }

            setProfileExists(true);

            setMessage(
                profileExists
                    ? "Profile updated successfully!"
                    : "Profile created successfully!"
            );

        } catch (error) {

            console.error(error);

            setMessage(
                "Unable to save profile."
            );
        }
    };


    if (loading) {
        return <p>Loading profile...</p>;
    }


    return (
        <div>

            <h1>MyCaretaker</h1>

            <h2>Family Member Profile</h2>

            <hr />

            <p>
                <strong>Name:</strong>{" "}
                {user?.firstName} {user?.lastName}
            </p>

            <p>
                <strong>Email:</strong>{" "}
                {user?.email}
            </p>

            <p>
                <strong>Phone:</strong>{" "}
                {user?.phone}
            </p>

            <hr />

            {elderly && (
    <div>

        <h3>Connected Elderly</h3>

        <p>
            <strong>Name:</strong>{" "}
            {elderly.user?.firstName}{" "}
            {elderly.user?.lastName}
        </p>

        <p>
            <strong>Email:</strong>{" "}
            {elderly.user?.email}
        </p>

        <p>
            <strong>Phone:</strong>{" "}
            {elderly.user?.phone}
        </p>

        <br />

        <button
            type="button"
            onClick={() =>
                navigate("/family/elderly")
            }
        >
            View Elderly Details
        </button>

        <hr />

    </div>
)}

            <form onSubmit={handleSubmit}>

                <div>

                    <label>
                        Relationship with Elderly:
                    </label>

                    <br />

                    <input
                        type="text"
                        name="relationshipWithElderly"
                        value={
                            formData.relationshipWithElderly
                        }
                        onChange={handleChange}
                        placeholder="Example: Daughter"
                    />

                </div>

                <br />

                <div>

                    <label>
                        Emergency Contact:
                    </label>

                    <br />

                    <input
                        type="text"
                        name="emergencyContact"
                        value={
                            formData.emergencyContact
                        }
                        onChange={handleChange}
                        placeholder="Enter emergency contact"
                    />

                </div>

                <br />

                <button type="submit">
                    Save Profile
                </button>

            </form>

            <br />

            {message && (
                <p>{message}</p>
            )}

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

export default FamilyMemberProfile;