
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ElderlyProfile.css";

function ElderlyProfile() {
    const navigate = useNavigate();

    const [user, setUser] = useState(null);

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
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        const savedUser = localStorage.getItem("mycaretaker_user");
        const loggedInUser = savedUser ? JSON.parse(savedUser) : null;

        if (!loggedInUser) {
            navigate("/login");
            return;
        }

        setUser(loggedInUser);

        const fetchProfile = async () => {
            try {
                const response = await fetch(
                    `http://localhost:8080/api/elderly/user/${loggedInUser.userId}`
                );

                if (response.ok) {
                    const result = await response.json();

                    setFormData({
                        gender: result.gender || "",
                        careRequirements: result.careRequirements || "",
                        emergencyContactName: result.emergencyContactName || "",
                        emergencyContactRelationship:
                            result.emergencyContactRelationship || "",
                        emergencyContactPhone: result.emergencyContactPhone || "",
                        preferredCareType: result.preferredCareType || "",
                        additionalInformation: result.additionalInformation || ""
                    });

                    if (result.elderlyId != null) {
                        localStorage.setItem(
                            "mycaretaker_elderlyId",
                            result.elderlyId
                        );
                    }

                    setProfileExists(true);
                } else if (response.status === 404) {
                    setProfileExists(false);
                } else {
                    throw new Error("Unable to load your profile.");
                }
            } catch (err) {
                console.error("Failed to load elderly profile:", err);
                setError(err.message || "Something went wrong while loading your profile.");
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((previousData) => ({
            ...previousData,
            [name]: value
        }));

        setSuccess("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user) {
            navigate("/login");
            return;
        }

        try {
            setSaving(true);
            setError("");
            setSuccess("");

            const method = profileExists ? "PUT" : "POST";

            const response = await fetch(
                `http://localhost:8080/api/elderly/user/${user.userId}`,
                {
                    method,
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(formData)
                }
            );

            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(errorMessage || "Failed to save profile.");
            }

            const result = await response.json();

            console.log("Elderly profile saved:", result);

            if (result.elderlyId != null) {
                localStorage.setItem(
                    "mycaretaker_elderlyId",
                    result.elderlyId
                );
            }

            setProfileExists(true);

            setSuccess(
                profileExists
                    ? "Your profile has been updated successfully."
                    : "Your profile has been created successfully."
            );

        } catch (err) {
            console.error("Profile save failed:", err);
            setError(err.message || "Unable to save your profile.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="elderly-profile-page">
                <div className="profile-loading">
                    <div className="profile-spinner"></div>
                    <h2>Loading your profile...</h2>
                    <p>Please wait a moment.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="elderly-profile-page">

            <div className="profile-page-header">
                <div>
                    <span className="profile-eyebrow">MYCARETAKER ACCOUNT</span>
                    <h1>My Profile</h1>
                    <p>
                        Keep your personal and care information up to date
                        so we can better support your needs.
                    </p>
                </div>

                <div className="profile-header-icon">♙</div>
            </div>

            {error && (
                <div className="profile-message profile-error">
                    <strong>Unable to continue</strong>
                    <p>{error}</p>
                </div>
            )}

            {success && (
                <div className="profile-message profile-success">
                    <strong>Success</strong>
                    <p>{success}</p>
                </div>
            )}

            <div className="profile-layout">

                <aside className="profile-sidebar-card">
                    <div className="profile-avatar">
                        {user?.firstName?.charAt(0)?.toUpperCase() || "U"}
                    </div>

                    <h2>
                        {user?.firstName} {user?.lastName}
                    </h2>

                    <span className="profile-account-label">
                        Elderly Account
                    </span>

                    <div className="profile-personal-details">
                        <div>
                            <span>Email</span>
                            <p>{user?.email || "Not provided"}</p>
                        </div>

                        <div>
                            <span>Phone</span>
                            <p>{user?.phone || "Not provided"}</p>
                        </div>

                        <div>
                            <span>Address</span>
                            <p>{user?.address || "Not provided"}</p>
                        </div>
                    </div>

                    <div className="profile-sidebar-note">
                        <span>♡</span>
                        <p>
                            Your personal information helps us connect
                            you with suitable care services.
                        </p>
                    </div>
                </aside>

                <main className="profile-form-card">

                    <div className="profile-form-heading">
                        <div>
                            <h2>
                                {profileExists
                                    ? "Update Your Profile"
                                    : "Complete Your Profile"}
                            </h2>

                            <p>
                                Fill in the details below.
                            </p>
                        </div>

                        <span className={`profile-status ${profileExists ? "status-complete" : "status-new"}`}>
                            {profileExists ? "Profile Created" : "New Profile"}
                        </span>
                    </div>

                    <form onSubmit={handleSubmit}>

                        <section className="profile-form-section">
                            <div className="form-section-heading">
                                <span className="form-section-icon">♙</span>
                                <div>
                                    <h3>Basic Information</h3>
                                    <p>Tell us a little about yourself.</p>
                                </div>
                            </div>

                            <div className="profile-form-group">
                                <label htmlFor="gender">
                                    Gender <span className="required-star">*</span>
                                </label>

                                <select
                                    id="gender"
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                        </section>

                        <section className="profile-form-section">
                            <div className="form-section-heading">
                                <span className="form-section-icon">♡</span>
                                <div>
                                    <h3>Care Requirements</h3>
                                    <p>Describe the assistance you need.</p>
                                </div>
                            </div>

                            <div className="profile-form-group">
                                <label htmlFor="careRequirements">
                                    What kind of assistance do you need?
                                </label>

                                <textarea
                                    id="careRequirements"
                                    name="careRequirements"
                                    rows="4"
                                    value={formData.careRequirements}
                                    onChange={handleChange}
                                    placeholder="Example: Walking assistance, medication reminders, bathing assistance, meal assistance..."
                                />
                            </div>
                        </section>

                        <section className="profile-form-section">
                            <div className="form-section-heading">
                                <span className="form-section-icon">◷</span>
                                <div>
                                    <h3>Preferred Care Type</h3>
                                    <p>Choose the type of care you prefer.</p>
                                </div>
                            </div>

                            <div className="profile-form-group">
                                <label htmlFor="preferredCareType">
                                    Preferred Care Type
                                </label>

                                <select
                                    id="preferredCareType"
                                    name="preferredCareType"
                                    value={formData.preferredCareType}
                                    onChange={handleChange}
                                >
                                    <option value="">Select Care Type</option>
                                    <option value="Daily Care">Daily Care</option>
                                    <option value="Part-Time Care">Part-Time Care</option>
                                    <option value="Full-Time Care">Full-Time Care</option>
                                    <option value="Night Care">Night Care</option>
                                    <option value="Companionship">Companionship</option>
                                    <option value="Medical Assistance">Medical Assistance</option>
                                </select>
                            </div>
                        </section>

                        <section className="profile-form-section">
                            <div className="form-section-heading">
                                <span className="form-section-icon">☎</span>
                                <div>
                                    <h3>Emergency Contact</h3>
                                    <p>Provide someone we can contact in an emergency.</p>
                                </div>
                            </div>

                            <div className="profile-form-grid">
                                <div className="profile-form-group">
                                    <label htmlFor="emergencyContactName">
                                        Contact Name
                                    </label>

                                    <input
                                        id="emergencyContactName"
                                        type="text"
                                        name="emergencyContactName"
                                        value={formData.emergencyContactName}
                                        onChange={handleChange}
                                        placeholder="Enter contact name"
                                    />
                                </div>

                                <div className="profile-form-group">
                                    <label htmlFor="emergencyContactRelationship">
                                        Relationship
                                    </label>

                                    <select
                                        id="emergencyContactRelationship"
                                        name="emergencyContactRelationship"
                                        value={formData.emergencyContactRelationship}
                                        onChange={handleChange}
                                    >
                                        <option value="">Select Relationship</option>
                                        <option value="Son">Son</option>
                                        <option value="Daughter">Daughter</option>
                                        <option value="Spouse">Spouse</option>
                                        <option value="Brother">Brother</option>
                                        <option value="Sister">Sister</option>
                                        <option value="Friend">Friend</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>

                                <div className="profile-form-group profile-full-width">
                                    <label htmlFor="emergencyContactPhone">
                                        Emergency Contact Phone
                                    </label>

                                    <input
                                        id="emergencyContactPhone"
                                        type="tel"
                                        name="emergencyContactPhone"
                                        value={formData.emergencyContactPhone}
                                        onChange={handleChange}
                                        placeholder="Enter emergency contact number"
                                    />
                                </div>
                            </div>
                        </section>

                        <section className="profile-form-section">
                            <div className="form-section-heading">
                                <span className="form-section-icon">✎</span>
                                <div>
                                    <h3>Additional Information</h3>
                                    <p>Share any other important details.</p>
                                </div>
                            </div>

                            <div className="profile-form-group">
                                <label htmlFor="additionalInformation">
                                    Additional Information
                                </label>

                                <textarea
                                    id="additionalInformation"
                                    name="additionalInformation"
                                    rows="4"
                                    value={formData.additionalInformation}
                                    onChange={handleChange}
                                    placeholder="Enter any other important information..."
                                />
                            </div>
                        </section>

                        <div className="profile-form-actions">
                            <button
                                type="button"
                                className="profile-cancel-btn"
                                onClick={() => navigate("/elderly/dashboard")}
                                disabled={saving}
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
                </main>
            </div>
        </div>
    );
}

export default ElderlyProfile;
