
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { saveHealthInformation } from "../services/userService";
import "./HealthInformation.css";

function HealthInformation() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        bloodGroup: "",
        medicalConditions: "",
        allergies: "",
        currentMedications: "",
        pastSurgeries: "",
        mobilityStatus: "",
        dietaryRequirements: "",
        doctorName: "",
        doctorContact: "",
        additionalHealthInformation: ""
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({
        type: "",
        text: ""
    });

    useEffect(() => {

        const elderlyId = localStorage.getItem(
            "mycaretaker_elderlyId"
        );

        if (!elderlyId) {
            navigate("/elderly/profile");
            return;
        }

        const fetchHealthInformation = async () => {

            try {

                const response = await fetch(
                    `http://localhost:8080/api/health-information/elderly/${elderlyId}`
                );

                if (response.ok) {

                    const result = await response.json();

                    setFormData({
                        bloodGroup: result.bloodGroup || "",
                        medicalConditions: result.medicalConditions || "",
                        allergies: result.allergies || "",
                        currentMedications: result.currentMedications || "",
                        pastSurgeries: result.pastSurgeries || "",
                        mobilityStatus: result.mobilityStatus || "",
                        dietaryRequirements: result.dietaryRequirements || "",
                        doctorName: result.doctorName || "",
                        doctorContact: result.doctorContact || "",
                        additionalHealthInformation:
                            result.additionalHealthInformation || ""
                    });

                } else if (response.status !== 404) {
                    throw new Error("Unable to load health information.");
                }

            } catch (error) {

                console.error("Failed to load health information:", error);

                setMessage({
                    type: "error",
                    text: "Unable to load your health information. Please refresh the page."
                });

            } finally {
                setLoading(false);
            }
        };

        fetchHealthInformation();

    }, [navigate]);

    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData(previousData => ({
            ...previousData,
            [name]: value
        }));

        if (message.text) {
            setMessage({ type: "", text: "" });
        }
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        setMessage({ type: "", text: "" });

        try {

            const user = JSON.parse(
                localStorage.getItem("mycaretaker_user") || "null"
            );

            if (!user) {
                navigate("/login");
                return;
            }

            const elderlyId = localStorage.getItem(
                "mycaretaker_elderlyId"
            );

            if (!elderlyId) {
                navigate("/elderly/profile");
                return;
            }

            setSaving(true);

            const result = await saveHealthInformation(
                elderlyId,
                formData
            );

            console.log("Health information saved:", result);

            setMessage({
                type: "success",
                text: "Your health information has been saved successfully."
            });

        } catch (error) {

            console.error("Failed to save health information:", error);

            setMessage({
                type: "error",
                text: error.message || "Failed to save health information. Please try again."
            });

        } finally {
            setSaving(false);
        }
    };

    if (loading) {

        return (
            <div className="health-loading-page">
                <div className="health-spinner"></div>
                <h3>Loading Health Information</h3>
                <p>Please wait...</p>
            </div>
        );
    }

    return (

        <div className="health-page">

            {/* Page Header */}

            <div className="health-page-header">

                <div>
                    <p className="health-eyebrow">YOUR WELLNESS</p>

                    <h1>Health Information</h1>

                    <p className="health-description">
                        Keep your medical information updated so
                        your caretaker can better understand your needs.
                    </p>
                </div>

                <div className="health-header-icon">
                    ♡
                </div>

            </div>

            {/* Information Notice */}

            <div className="health-notice">
                <span className="notice-icon">ⓘ</span>

                <p>
                    Please provide accurate health information.
                    This information can help your care team understand
                    your medical needs.
                </p>
            </div>

            {/* Form */}

            <form
                className="health-form"
                onSubmit={handleSubmit}
            >

                {/* Medical Details */}

                <section className="health-form-section">

                    <div className="health-section-heading">

                        <div className="health-section-icon">
                            ✚
                        </div>

                        <div>
                            <h2>Medical Details</h2>
                            <p>
                                Basic information about your health.
                            </p>
                        </div>

                    </div>

                    <div className="health-fields-grid">

                        <div className="health-field">
                            <label htmlFor="bloodGroup">
                                Blood Group
                            </label>

                            <select
                                id="bloodGroup"
                                name="bloodGroup"
                                value={formData.bloodGroup}
                                onChange={handleChange}
                            >
                                <option value="">Select Blood Group</option>
                                <option value="A+">A+</option>
                                <option value="A-">A-</option>
                                <option value="B+">B+</option>
                                <option value="B-">B-</option>
                                <option value="AB+">AB+</option>
                                <option value="AB-">AB-</option>
                                <option value="O+">O+</option>
                                <option value="O-">O-</option>
                            </select>
                        </div>

                        <div className="health-field">
                            <label htmlFor="mobilityStatus">
                                Mobility Status
                            </label>

                            <select
                                id="mobilityStatus"
                                name="mobilityStatus"
                                value={formData.mobilityStatus}
                                onChange={handleChange}
                            >
                                <option value="">Select Mobility Status</option>
                                <option value="Independent">Independent</option>
                                <option value="Needs Assistance">
                                    Needs Assistance
                                </option>
                                <option value="Wheelchair">Wheelchair</option>
                                <option value="Bedridden">Bedridden</option>
                            </select>
                        </div>

                        <div className="health-field full-width">
                            <label htmlFor="medicalConditions">
                                Medical Conditions
                            </label>

                            <textarea
                                id="medicalConditions"
                                name="medicalConditions"
                                value={formData.medicalConditions}
                                onChange={handleChange}
                                placeholder="Example: Diabetes, hypertension, heart condition..."
                                rows="3"
                            />
                        </div>

                        <div className="health-field full-width">
                            <label htmlFor="allergies">
                                Allergies
                            </label>

                            <textarea
                                id="allergies"
                                name="allergies"
                                value={formData.allergies}
                                onChange={handleChange}
                                placeholder="Mention any known food, medicine or other allergies..."
                                rows="3"
                            />
                        </div>

                    </div>

                </section>

                {/* Medication and History */}

                <section className="health-form-section">

                    <div className="health-section-heading">

                        <div className="health-section-icon">
                            ♡
                        </div>

                        <div>
                            <h2>Medication & Medical History</h2>
                            <p>
                                Provide details about treatments and
                                previous medical procedures.
                            </p>
                        </div>

                    </div>

                    <div className="health-fields-grid">

                        <div className="health-field full-width">
                            <label htmlFor="currentMedications">
                                Current Medications
                            </label>

                            <textarea
                                id="currentMedications"
                                name="currentMedications"
                                value={formData.currentMedications}
                                onChange={handleChange}
                                placeholder="Mention medication names and dosage, if known..."
                                rows="3"
                            />
                        </div>

                        <div className="health-field full-width">
                            <label htmlFor="pastSurgeries">
                                Past Surgeries
                            </label>

                            <textarea
                                id="pastSurgeries"
                                name="pastSurgeries"
                                value={formData.pastSurgeries}
                                onChange={handleChange}
                                placeholder="Mention previous surgeries and approximate dates..."
                                rows="3"
                            />
                        </div>

                    </div>

                </section>

                {/* Lifestyle and Dietary Requirements */}

                <section className="health-form-section">

                    <div className="health-section-heading">

                        <div className="health-section-icon">
                            ♧
                        </div>

                        <div>
                            <h2>Dietary Requirements</h2>
                            <p>
                                Share any special dietary needs.
                            </p>
                        </div>

                    </div>

                    <div className="health-fields-grid">

                        <div className="health-field full-width">
                            <label htmlFor="dietaryRequirements">
                                Dietary Requirements
                            </label>

                            <textarea
                                id="dietaryRequirements"
                                name="dietaryRequirements"
                                value={formData.dietaryRequirements}
                                onChange={handleChange}
                                placeholder="Example: Low-salt diet, low-sugar diet, food restrictions..."
                                rows="3"
                            />
                        </div>

                    </div>

                </section>

                {/* Doctor Information */}

                <section className="health-form-section">

                    <div className="health-section-heading">

                        <div className="health-section-icon">
                            ✚
                        </div>

                        <div>
                            <h2>Doctor Information</h2>
                            <p>
                                Contact details of your doctor.
                            </p>
                        </div>

                    </div>

                    <div className="health-fields-grid">

                        <div className="health-field">
                            <label htmlFor="doctorName">
                                Doctor Name
                            </label>

                            <input
                                id="doctorName"
                                type="text"
                                name="doctorName"
                                value={formData.doctorName}
                                onChange={handleChange}
                                placeholder="Enter doctor's name"
                            />
                        </div>

                        <div className="health-field">
                            <label htmlFor="doctorContact">
                                Doctor Contact
                            </label>

                            <input
                                id="doctorContact"
                                type="text"
                                name="doctorContact"
                                value={formData.doctorContact}
                                onChange={handleChange}
                                placeholder="Enter contact number"
                            />
                        </div>

                        <div className="health-field full-width">
                            <label htmlFor="additionalHealthInformation">
                                Additional Health Information
                            </label>

                            <textarea
                                id="additionalHealthInformation"
                                name="additionalHealthInformation"
                                value={formData.additionalHealthInformation}
                                onChange={handleChange}
                                placeholder="Add any other important health information..."
                                rows="4"
                            />
                        </div>

                    </div>

                </section>

                {/* Save Message */}

                {message.text && (
                    <div className={`health-feedback ${message.type}`}>
                        <span>
                            {message.type === "success" ? "✓" : "!"}
                        </span>
                        {message.text}
                    </div>
                )}

                {/* Form Actions */}

                <div className="health-form-actions">

                    <button
                        type="button"
                        className="health-back-button"
                        onClick={() => navigate("/elderly/dashboard")}
                    >
                        ← Back to Dashboard
                    </button>

                    <button
                        type="submit"
                        className="health-save-button"
                        disabled={saving}
                    >
                        {saving ? "Saving..." : "Save Health Information"}
                    </button>

                </div>

            </form>

            <p className="health-footer-note">
                Your health information should be kept accurate and up to date.
            </p>

        </div>
    );
}

export default HealthInformation;
