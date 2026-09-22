import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function ElderlyProfile() {

    const navigate = useNavigate();

    const user = JSON.parse(
        localStorage.getItem("mycaretaker_user")
    );

    const [formData, setFormData] = useState({
        gender: "",
        careRequirements: "",
        emergencyContactName: "",
        emergencyContactRelationship: "",
        emergencyContactPhone: "",
        preferredCareType: "",
        additionalInformation: ""
    });

    const [profileExists, setProfileExists] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

    const fetchProfile = async () => {

        if (!user) {
            navigate("/login");
            return;
        }

        try {

            const response = await fetch(
                `http://localhost:8080/api/elderly/user/${user.userId}`
            );

            if (response.ok) {

                const result = await response.json();

                setFormData({
                    gender: result.gender || "",
                    careRequirements:
                        result.careRequirements || "",
                    emergencyContactName:
                        result.emergencyContactName || "",
                    emergencyContactRelationship:
                        result.emergencyContactRelationship || "",
                    emergencyContactPhone:
                        result.emergencyContactPhone || "",
                    preferredCareType:
                        result.preferredCareType || "",
                    additionalInformation:
                        result.additionalInformation || ""
                });

                localStorage.setItem(
                    "mycaretaker_elderlyId",
                    result.elderlyId
                );

                setProfileExists(true);
            }

        } catch (error) {

            console.error(
                "Failed to load elderly profile:",
                error
            );

        } finally {

            setLoading(false);
        }
    };

    fetchProfile();

}, []);

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {

    e.preventDefault();

    if (!user) {
        alert("Please login first.");
        navigate("/login");
        return;
    }

    try {

        const method = profileExists ? "PUT" : "POST";

        const response = await fetch(
            `http://localhost:8080/api/elderly/user/${user.userId}`,
            {
                method: method,
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            }
        );

        if (!response.ok) {

            const errorMessage =
                await response.text();

            throw new Error(errorMessage);
        }

        const result = await response.json();

        console.log(
            "Elderly profile saved:",
            result
        );

        localStorage.setItem(
            "mycaretaker_elderlyId",
            result.elderlyId
        );

        setProfileExists(true);

        alert(
            profileExists
                ? "Profile updated successfully!"
                : "Profile created successfully!"
        );

        navigate("/elderly/dashboard");

    } catch (error) {

        console.error(
            "Profile save failed:",
            error
        );

        alert(
            "Profile save failed: " +
            error.message
        );
    }
};

    return (
        <div>

            <h1>MyCaretaker - Elderly Profile</h1>

            <p>
                Complete your profile so we can provide
                suitable care services.
            </p>

            <hr />

            <h2>Personal Information</h2>

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

            <p>
                <strong>Address:</strong>{" "}
                {user?.address}
            </p>

            <hr />

            <form onSubmit={handleSubmit}>

                <h2>Basic Information</h2>

                <div>
                    <label>Gender</label>
                    <br />

                    <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        required
                    >

                        <option value="">
                            Select Gender
                        </option>

                        <option value="Male">
                            Male
                        </option>

                        <option value="Female">
                            Female
                        </option>

                        <option value="Other">
                            Other
                        </option>

                    </select>
                </div>

                <br />

                <h2>Care Requirements</h2>

                <div>
                    <label>
                        What kind of assistance do you need?
                    </label>
                    <br />

                    <textarea
                        name="careRequirements"
                        value={formData.careRequirements}
                        onChange={handleChange}
                        placeholder="Example: Walking assistance, medication reminders, bathing assistance, meal assistance..."
                        rows="5"
                    />
                </div>

                <br />

                <h2>Preferred Care Type</h2>

                <div>
                    <label>
                        Preferred Care Type
                    </label>
                    <br />

                    <select
                        name="preferredCareType"
                        value={formData.preferredCareType}
                        onChange={handleChange}
                    >

                        <option value="">
                            Select Care Type
                        </option>

                        <option value="Daily Care">
                            Daily Care
                        </option>

                        <option value="Part-Time Care">
                            Part-Time Care
                        </option>

                        <option value="Full-Time Care">
                            Full-Time Care
                        </option>

                        <option value="Night Care">
                            Night Care
                        </option>

                        <option value="Companionship">
                            Companionship
                        </option>

                        <option value="Medical Assistance">
                            Medical Assistance
                        </option>

                    </select>
                </div>

                <br />

                <h2>Emergency Contact</h2>

                <div>
                    <label>
                        Emergency Contact Name
                    </label>
                    <br />

                    <input
                        type="text"
                        name="emergencyContactName"
                        value={
                            formData.emergencyContactName
                        }
                        onChange={handleChange}
                        placeholder="Enter emergency contact name"
                    />
                </div>

                <br />

                <div>
                    <label>
                        Relationship
                    </label>
                    <br />

                    <select
                        name="emergencyContactRelationship"
                        value={
                            formData.emergencyContactRelationship
                        }
                        onChange={handleChange}
                    >

                        <option value="">
                            Select Relationship
                        </option>

                        <option value="Son">
                            Son
                        </option>

                        <option value="Daughter">
                            Daughter
                        </option>

                        <option value="Spouse">
                            Spouse
                        </option>

                        <option value="Brother">
                            Brother
                        </option>

                        <option value="Sister">
                            Sister
                        </option>

                        <option value="Friend">
                            Friend
                        </option>

                        <option value="Other">
                            Other
                        </option>

                    </select>
                </div>

                <br />

                <div>
                    <label>
                        Emergency Contact Phone
                    </label>
                    <br />

                    <input
                        type="tel"
                        name="emergencyContactPhone"
                        value={
                            formData.emergencyContactPhone
                        }
                        onChange={handleChange}
                        placeholder="Enter emergency contact number"
                    />
                </div>

                <br />

                <h2>Additional Information</h2>

                <div>
                    <label>
                        Additional Information
                    </label>
                    <br />

                    <textarea
                        name="additionalInformation"
                        value={
                            formData.additionalInformation
                        }
                        onChange={handleChange}
                        placeholder="Enter any other important information..."
                        rows="5"
                    />
                </div>

                <br />

               <button type="submit">
                   {profileExists ? "Update Profile" : "Save Profile"}
               </button>

                <button
                    type="button"
                    onClick={() =>
                        navigate("/elderly/dashboard")
                    }
                    style={{
                        marginLeft: "10px"
                    }}
                >
                    Cancel
                </button>

            </form>

        </div>
    );
}

export default ElderlyProfile;