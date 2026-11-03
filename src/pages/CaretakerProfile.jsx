
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CaretakerProfile.css";

function CaretakerProfile() {

    const navigate = useNavigate();

    const user = JSON.parse(
        localStorage.getItem("mycaretaker_user") || "null"
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
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

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
                        qualification: result.qualification || "",
                        skills: result.skills || "",
                        availability: result.availability || "",
                        hourlyRate: result.hourlyRate ?? "",
                        about: result.about || ""
                    });

                    setProfileExists(true);
                }

            } catch (error) {

                console.error(
                    "Failed to load caretaker profile:",
                    error
                );

                setError("Unable to load your profile. Please try again.");

            } finally {

                setLoading(false);
            }
        };

        fetchProfile();

    }, [navigate]);

    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!user) {
            navigate("/login");
            return;
        }

        setSaving(true);
        setError("");

        try {

            const method = profileExists ? "PUT" : "POST";

            const response = await fetch(
                `http://localhost:8080/api/caretakers/user/${user.userId}`,
                {
                    method,
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        experience: formData.experience,
                        qualification: formData.qualification,
                        skills: formData.skills,
                        availability: formData.availability,
                        hourlyRate: Number(formData.hourlyRate),
                        about: formData.about
                    })
                }
            );

            if (!response.ok) {

                const errorMessage = await response.text();

                throw new Error(
                    errorMessage || "Unable to save profile."
                );
            }

            const result = await response.json();

            console.log("Caretaker profile saved:", result);

            setProfileExists(true);

            alert(
                profileExists
                    ? "Caretaker profile updated successfully!"
                    : "Caretaker profile created successfully!"
            );

            navigate("/caretaker/dashboard");

        } catch (error) {

            console.error("Caretaker profile save failed:", error);

            setError(
                "Profile save failed: " + error.message
            );

        } finally {

            setSaving(false);
        }
    };

    if (loading) {

        return (
            <div className="caretaker-profile-loading">
                <div className="profile-loader"></div>
                <p>Loading your profile...</p>
            </div>
        );
    }

    return (

        <div className="caretaker-profile-page">

            {/* Header */}

            <header className="profile-header">

                <div className="profile-brand">
                    <span>💙</span>
                    <h2>MyCaretaker</h2>
                </div>

                <button
                    className="profile-back-btn"
                    onClick={() => navigate("/caretaker/dashboard")}
                >
                    ← Back to Dashboard
                </button>

            </header>

            {/* Main Content */}

            <main className="profile-container">

                <div className="profile-page-heading">

                    <div>
                        <p className="profile-subtitle">
                            CARETAKER ACCOUNT
                        </p>

                        <h1>My Profile</h1>

                        <p>
                            Manage your personal and professional information.
                        </p>
                    </div>

                    <div className="profile-heading-icon">
                        👤
                    </div>

                </div>

                {/* Personal Information */}

                <section className="personal-info-card">

                    <div className="profile-section-heading">
                        <div className="section-icon">👤</div>

                        <div>
                            <h2>Personal Information</h2>
                            <p>Your registered account details</p>
                        </div>
                    </div>

                    <div className="personal-info-grid">

                        <div className="personal-info-item">
                            <label>Full Name</label>
                            <p>
                                {user?.firstName || ""} {user?.lastName || ""}
                            </p>
                        </div>

                        <div className="personal-info-item">
                            <label>Email Address</label>
                            <p>{user?.email || "Not available"}</p>
                        </div>

                        <div className="personal-info-item">
                            <label>Phone Number</label>
                            <p>{user?.phone || "Not available"}</p>
                        </div>

                    </div>

                </section>

                {/* Professional Information */}

                <section className="professional-info-card">

                    <div className="profile-section-heading">
                        <div className="section-icon">💼</div>

                        <div>
                            <h2>Professional Information</h2>
                            <p>
                                Help elderly people understand your experience
                                and services.
                            </p>
                        </div>
                    </div>

                    {error && (
                        <div className="profile-error">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>

                        <div className="profile-form-grid">

                            <div className="profile-form-group full-width">
                                <label>
                                    Experience <span>*</span>
                                </label>

                                <textarea
                                    name="experience"
                                    value={formData.experience}
                                    onChange={handleChange}
                                    placeholder="Example: 3 years of experience caring for elderly people."
                                    rows="3"
                                    required
                                />
                            </div>

                            <div className="profile-form-group">
                                <label>
                                    Qualification <span>*</span>
                                </label>

                                <input
                                    type="text"
                                    name="qualification"
                                    value={formData.qualification}
                                    onChange={handleChange}
                                    placeholder="Example: Nursing Assistant"
                                    required
                                />
                            </div>

                            <div className="profile-form-group">
                                <label>
                                    Availability <span>*</span>
                                </label>

                                <select
                                    name="availability"
                                    value={formData.availability}
                                    onChange={handleChange}
                                    required
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

                            <div className="profile-form-group full-width">
                                <label>
                                    Skills <span>*</span>
                                </label>

                                <textarea
                                    name="skills"
                                    value={formData.skills}
                                    onChange={handleChange}
                                    placeholder="Example: Medication reminders, mobility assistance, cooking, companionship..."
                                    rows="3"
                                    required
                                />
                            </div>

                            <div className="profile-form-group">
                                <label>
                                    Hourly Rate (₹) <span>*</span>
                                </label>

                                <input
                                    type="number"
                                    name="hourlyRate"
                                    value={formData.hourlyRate}
                                    onChange={handleChange}
                                    min="0"
                                    placeholder="Enter your hourly rate"
                                    required
                                />
                            </div>

                            <div className="profile-form-group full-width">
                                <label>
                                    About You <span>*</span>
                                </label>

                                <textarea
                                    name="about"
                                    value={formData.about}
                                    onChange={handleChange}
                                    placeholder="Introduce yourself and explain why you enjoy providing elderly care..."
                                    rows="5"
                                    required
                                />
                            </div>

                        </div>

                        <div className="profile-form-actions">

                            <button
                                type="button"
                                className="profile-cancel-btn"
                                onClick={() =>
                                    navigate("/caretaker/dashboard")
                                }
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                className="profile-save-btn"
                                disabled={saving}
                            >
                                {saving
                                    ? "Saving..."
                                    : profileExists
                                        ? "Update Profile"
                                        : "Save Profile"}
                            </button>

                        </div>

                    </form>

                </section>

                <footer className="profile-footer">
                    © 2026 MyCaretaker. Caring with compassion.
                </footer>

            </main>

        </div>
    );
}

export default CaretakerProfile;
