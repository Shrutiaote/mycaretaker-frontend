import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function CaretakerProfile() {

    const navigate = useNavigate();

    const user = JSON.parse(
        localStorage.getItem("mycaretaker_user")
    );

    const [formData, setFormData] = useState({
        experience: "",
        qualification: "",
        skills: "",
        availability: "",
        hourlyRate: "",
        about: ""
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
                    `http://localhost:8080/api/caretakers/user/${user.userId}`
                );

                if (response.ok) {

                    const result = await response.json();

                    setFormData({
                        experience: result.experience || "",
                        qualification:
                            result.qualification || "",
                        skills:
                            result.skills || "",
                        availability:
                            result.availability || "",
                        hourlyRate:
                            result.hourlyRate || "",
                        about:
                            result.about || ""
                    });

                    setProfileExists(true);
                }

            } catch (error) {

                console.error(
                    "Failed to load caretaker profile:",
                    error
                );

            } finally {

                setLoading(false);
            }
        };

        fetchProfile();

    }, [navigate]);

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

            const method =
                profileExists ? "PUT" : "POST";

            const response = await fetch(
                `http://localhost:8080/api/caretakers/user/${user.userId}`,
                {
                    method: method,
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        experience: formData.experience,
                        qualification:
                            formData.qualification,
                        skills:
                            formData.skills,
                        availability:
                            formData.availability,
                        hourlyRate:
                            Number(formData.hourlyRate),
                        about:
                            formData.about
                    })
                }
            );

            if (!response.ok) {

                const errorMessage =
                    await response.text();

                throw new Error(errorMessage);
            }

            const result = await response.json();

            console.log(
                "Caretaker profile saved:",
                result
            );

            setProfileExists(true);

            alert(
                profileExists
                    ? "Caretaker profile updated successfully!"
                    : "Caretaker profile created successfully!"
            );

            navigate("/caretaker/dashboard");

        } catch (error) {

            console.error(
                "Caretaker profile save failed:",
                error
            );

            alert(
                "Profile save failed: " +
                error.message
            );
        }
    };

    if (loading) {

        return (
            <div>
                <h1>Caretaker Profile</h1>
                <p>Loading profile...</p>
            </div>
        );
    }

    return (
        <div>

            <h1>MyCaretaker - Caretaker Profile</h1>

            <p>
                Complete your profile so elderly people
                can find suitable care services.
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

            <hr />

            <form onSubmit={handleSubmit}>

                <h2>Professional Information</h2>

                <div>
                    <label>
                        Experience
                    </label>
                    <br />

                    <textarea
                        name="experience"
                        value={formData.experience}
                        onChange={handleChange}
                        placeholder="Example: 3 years experience caring for elderly people"
                        rows="4"
                    />
                </div>

                <br />

                <div>
                    <label>
                        Qualification
                    </label>
                    <br />

                    <input
                        type="text"
                        name="qualification"
                        value={formData.qualification}
                        onChange={handleChange}
                        placeholder="Example: Nursing Assistant / Caregiver Training"
                    />
                </div>

                <br />

                <div>
                    <label>
                        Skills
                    </label>
                    <br />

                    <textarea
                        name="skills"
                        value={formData.skills}
                        onChange={handleChange}
                        placeholder="Example: Medication reminders, mobility assistance, cooking, companionship"
                        rows="4"
                    />
                </div>

                <br />

                <div>
                    <label>
                        Availability
                    </label>
                    <br />

                    <select
                        name="availability"
                        value={formData.availability}
                        onChange={handleChange}
                    >
                        <option value="">
                            Select Availability
                        </option>

                        <option value="Full-Time">
                            Full-Time
                        </option>

                        <option value="Part-Time">
                            Part-Time
                        </option>

                        <option value="Day Shift">
                            Day Shift
                        </option>

                        <option value="Night Shift">
                            Night Shift
                        </option>
                    </select>
                </div>

                <br />

                <div>
                    <label>
                        Hourly Rate (₹)
                    </label>
                    <br />

                    <input
                        type="number"
                        name="hourlyRate"
                        value={formData.hourlyRate}
                        onChange={handleChange}
                        min="0"
                        placeholder="Enter hourly rate"
                    />
                </div>

                <br />

                <div>
                    <label>
                        About You
                    </label>
                    <br />

                    <textarea
                        name="about"
                        value={formData.about}
                        onChange={handleChange}
                        placeholder="Tell elderly people about yourself..."
                        rows="5"
                    />
                </div>

                <br />

                <button type="submit">
                    {profileExists
                        ? "Update Profile"
                        : "Save Profile"}
                </button>

                <button
                    type="button"
                    onClick={() =>
                        navigate("/caretaker/dashboard")
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

export default CaretakerProfile;