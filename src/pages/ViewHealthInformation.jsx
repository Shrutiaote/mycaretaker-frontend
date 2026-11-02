
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ViewHealthInformation.css";

function ViewHealthInformation() {

    const navigate = useNavigate();

    const [healthData, setHealthData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {

        const fetchHealthInformation = async () => {

            const elderlyId = localStorage.getItem(
                "mycaretaker_elderlyId"
            );

            if (!elderlyId) {
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
                        "Failed to load health information."
                    );
                }

                const result = await response.json();
                setHealthData(result);

            } catch (error) {

                console.error(
                    "Failed to load health information:",
                    error
                );

                setError(
                    "Unable to load your health information. Please try again."
                );

            } finally {
                setLoading(false);
            }
        };

        fetchHealthInformation();

    }, [navigate]);

    const getValue = (value) => {
        return value && String(value).trim()
            ? value
            : "Not provided";
    };

    const DetailCard = ({ icon, title, value }) => (

        <div className="health-detail-card">

            <div className="health-detail-card-heading">
                <span className="health-detail-icon">{icon}</span>
                <h3>{title}</h3>
            </div>

            <p className={
                value === "Not provided"
                    ? "health-detail-value not-provided"
                    : "health-detail-value"
            }>
                {value}
            </p>

        </div>
    );

    if (loading) {

        return (
            <div className="view-health-loading">
                <div className="view-health-spinner"></div>
                <h3>Loading Health Information</h3>
                <p>Please wait while we retrieve your records.</p>
            </div>
        );
    }

    return (

        <div className="view-health-page">

            {/* Page Header */}

            <div className="view-health-header">

                <div>
                    <p className="view-health-eyebrow">
                        HEALTH RECORDS
                    </p>

                    <h1>My Health Information</h1>

                    <p>
                        View your medical details and important
                        health information in one place.
                    </p>
                </div>

                {healthData && (
                    <button
                        className="edit-health-button"
                        onClick={() =>
                            navigate("/elderly/health-information")
                        }
                    >
                        ✎ Edit Information
                    </button>
                )}

            </div>

            {/* Error State */}

            {error ? (

                <div className="view-health-empty error-state">
                    <div className="view-health-empty-icon">!</div>
                    <h2>Unable to Load Records</h2>
                    <p>{error}</p>

                    <button
                        className="edit-health-button"
                        onClick={() => window.location.reload()}
                    >
                        Try Again
                    </button>
                </div>

            ) : !healthData ? (

                /* Empty State */

                <div className="view-health-empty">

                    <div className="view-health-empty-icon">
                        ♡
                    </div>

                    <h2>No Health Information Yet</h2>

                    <p>
                        You haven't added your medical details yet.
                        Add your health information to keep your
                        medical records organized.
                    </p>

                    <button
                        className="edit-health-button"
                        onClick={() =>
                            navigate("/elderly/health-information")
                        }
                    >
                        + Add Health Information
                    </button>

                </div>

            ) : (

                <>

                    {/* Summary Cards */}

                    <div className="health-overview-grid">

                        <div className="health-overview-card">
                            <div className="overview-icon blood-icon">
                                ✚
                            </div>

                            <div>
                                <p>Blood Group</p>
                                <h2>{getValue(healthData.bloodGroup)}</h2>
                            </div>
                        </div>

                        <div className="health-overview-card">
                            <div className="overview-icon mobility-icon">
                                ♿
                            </div>

                            <div>
                                <p>Mobility Status</p>
                                <h2>
                                    {getValue(healthData.mobilityStatus)}
                                </h2>
                            </div>
                        </div>

                        <div className="health-overview-card">
                            <div className="overview-icon doctor-icon">
                                ♡
                            </div>

                            <div>
                                <p>Doctor</p>
                                <h2>{getValue(healthData.doctorName)}</h2>
                            </div>
                        </div>

                    </div>

                    {/* Medical Details */}

                    <section className="view-health-section">

                        <div className="view-health-section-heading">
                            <span>✚</span>

                            <div>
                                <h2>Medical Details</h2>
                                <p>
                                    Your health conditions and allergies.
                                </p>
                            </div>
                        </div>

                        <div className="health-detail-grid">

                            <DetailCard
                                icon="♡"
                                title="Medical Conditions"
                                value={getValue(healthData.medicalConditions)}
                            />

                            <DetailCard
                                icon="!"
                                title="Allergies"
                                value={getValue(healthData.allergies)}
                            />

                        </div>

                    </section>

                    {/* Medication and History */}

                    <section className="view-health-section">

                        <div className="view-health-section-heading">
                            <span>▤</span>

                            <div>
                                <h2>Medication & Medical History</h2>
                                <p>
                                    Your current treatments and previous surgeries.
                                </p>
                            </div>
                        </div>

                        <div className="health-detail-grid">

                            <DetailCard
                                icon="✚"
                                title="Current Medications"
                                value={getValue(healthData.currentMedications)}
                            />

                            <DetailCard
                                icon="▤"
                                title="Past Surgeries"
                                value={getValue(healthData.pastSurgeries)}
                            />

                        </div>

                    </section>

                    {/* Dietary Information */}

                    <section className="view-health-section">

                        <div className="view-health-section-heading">
                            <span>♡</span>

                            <div>
                                <h2>Dietary Requirements</h2>
                                <p>
                                    Special dietary needs and restrictions.
                                </p>
                            </div>
                        </div>

                        <div className="health-detail-grid">

                            <DetailCard
                                icon="♧"
                                title="Dietary Requirements"
                                value={getValue(healthData.dietaryRequirements)}
                            />

                        </div>

                    </section>

                    {/* Doctor Information */}

                    <section className="view-health-section">

                        <div className="view-health-section-heading">
                            <span>✚</span>

                            <div>
                                <h2>Doctor Information</h2>
                                <p>
                                    Your doctor's contact details.
                                </p>
                            </div>
                        </div>

                        <div className="health-detail-grid">

                            <DetailCard
                                icon="♙"
                                title="Doctor Name"
                                value={getValue(healthData.doctorName)}
                            />

                            <DetailCard
                                icon="☎"
                                title="Doctor Contact"
                                value={getValue(healthData.doctorContact)}
                            />

                        </div>

                    </section>

                    {/* Additional Information */}

                    <section className="view-health-section">

                        <div className="view-health-section-heading">
                            <span>ⓘ</span>

                            <div>
                                <h2>Additional Information</h2>
                                <p>
                                    Other important details about your health.
                                </p>
                            </div>
                        </div>

                        <div className="health-detail-grid">

                            <DetailCard
                                icon="▤"
                                title="Additional Health Information"
                                value={getValue(
                                    healthData.additionalHealthInformation
                                )}
                            />

                        </div>

                    </section>

                </>

            )}

            {/* Bottom Navigation */}

            <div className="view-health-bottom-actions">

                <button
                    className="view-health-back-button"
                    onClick={() =>
                        navigate("/elderly/dashboard")
                    }
                >
                    ← Back to Dashboard
                </button>

                {healthData && (
                    <button
                        className="edit-health-button"
                        onClick={() =>
                            navigate("/elderly/health-information")
                        }
                    >
                        Edit Health Information
                    </button>
                )}

            </div>

        </div>
    );
}

export default ViewHealthInformation;
