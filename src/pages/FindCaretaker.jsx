
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./FindCaretaker.css";

function FindCaretaker() {
    const navigate = useNavigate();

    const [caretakers, setCaretakers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [selectedCaretaker, setSelectedCaretaker] = useState(null);
    const [message, setMessage] = useState("");
    const [sending, setSending] = useState(false);

    useEffect(() => {
        const fetchCaretakers = async () => {
            try {
                const response = await fetch(
                    "http://localhost:8080/api/caretakers/verified"
                );

                if (!response.ok) {
                    throw new Error("Failed to load caretakers.");
                }

                const result = await response.json();
                setCaretakers(result);
            } catch (error) {
                console.error("Failed to load caretakers:", error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCaretakers();
    }, []);

    const handleSendRequest = (caretaker) => {
        setSelectedCaretaker(caretaker);
        setMessage("");
    };

    const closeRequestForm = () => {
        setSelectedCaretaker(null);
        setMessage("");
    };

    const submitCareRequest = async () => {
        const savedUser = localStorage.getItem("mycaretaker_user");
        const user = savedUser ? JSON.parse(savedUser) : null;

        if (!user) {
            alert("Please login first.");
            navigate("/login");
            return;
        }

        const elderlyId = localStorage.getItem("mycaretaker_elderlyId");

        if (!elderlyId) {
            alert("Elderly profile not found. Please create your profile first.");
            navigate("/elderly/profile");
            return;
        }

        if (!message.trim()) {
            alert("Please enter a message.");
            return;
        }

        if (!selectedCaretaker) return;

        try {
            setSending(true);

            const response = await fetch(
                `http://localhost:8080/api/care-requests/elderly/${elderlyId}/caretaker/${selectedCaretaker.caretakerId}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "text/plain"
                    },
                    body: message.trim()
                }
            );

            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(errorMessage);
            }

            const result = await response.json();
            console.log("Care request created:", result);

            alert("Care request sent successfully!");
            closeRequestForm();

        } catch (error) {
            console.error("Failed to send care request:", error);
            alert("Failed to send care request: " + error.message);
        } finally {
            setSending(false);
        }
    };

    const getInitials = (caretaker) => {
        const firstName = caretaker.user?.firstName || "";
        const lastName = caretaker.user?.lastName || "";

        return (
            (firstName.charAt(0) + lastName.charAt(0)).toUpperCase() || "C"
        );
    };

    if (loading) {
        return (
            <div className="find-caretaker-page">
                <div className="caretaker-loading">
                    <div className="caretaker-spinner"></div>
                    <h2>Finding verified caretakers</h2>
                    <p>Please wait while we load available profiles.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="find-caretaker-page">

            <div className="caretaker-page-header">
                <div>
                    <span className="caretaker-eyebrow">
                        CARE SUPPORT
                    </span>

                    <h1>Find a Caretaker</h1>

                    <p>
                        Discover verified caretakers who can support
                        your daily care and personal needs.
                    </p>
                </div>

                <div className="caretaker-header-icon">
                    <span>♡</span>
                </div>
            </div>

            <div className="caretaker-info-banner">
                <div className="info-icon">i</div>

                <div>
                    <h3>Choose the right care partner</h3>
                    <p>
                        Review caretaker experience, qualifications,
                        skills and availability before sending a request.
                    </p>
                </div>
            </div>

            <div className="caretaker-section-heading">
                <div>
                    <h2>Available Caretakers</h2>
                    <p>Browse our verified care professionals.</p>
                </div>

                <span className="caretaker-count">
                    {caretakers.length} Available
                </span>
            </div>

            {error ? (
                <div className="caretaker-error">
                    <h3>Unable to load caretakers</h3>
                    <p>{error}</p>

                    <button
                        onClick={() => window.location.reload()}
                        className="caretaker-retry-btn"
                    >
                        Try Again
                    </button>
                </div>
            ) : caretakers.length === 0 ? (
                <div className="caretaker-empty">
                    <div className="empty-icon">♡</div>
                    <h2>No Caretakers Available</h2>
                    <p>
                        There are currently no verified caretakers available.
                        Please check again later.
                    </p>
                </div>
            ) : (
                <div className="caretaker-grid">
                    {caretakers.map((caretaker) => (
                        <div
                            className="caretaker-card"
                            key={caretaker.caretakerId}
                        >
                            <div className="caretaker-card-top">
                                <div className="caretaker-avatar">
                                    {getInitials(caretaker)}
                                </div>

                                <span className="verified-badge">
                                    ✓ Verified
                                </span>
                            </div>

                            <h3>
                                {caretaker.user?.firstName}{" "}
                                {caretaker.user?.lastName}
                            </h3>

                            <p className="caretaker-email">
                                {caretaker.user?.email || "Email not provided"}
                            </p>

                            <div className="caretaker-rate">
                                <span>Hourly Rate</span>
                                <strong>
                                    {caretaker.hourlyRate != null
                                        ? `₹${caretaker.hourlyRate}`
                                        : "Not provided"}
                                </strong>
                            </div>

                            <div className="caretaker-details">
                                <div className="caretaker-detail">
                                    <span className="detail-icon">✦</span>
                                    <div>
                                        <small>Experience</small>
                                        <p>{caretaker.experience || "Not provided"}</p>
                                    </div>
                                </div>

                                <div className="caretaker-detail">
                                    <span className="detail-icon">▣</span>
                                    <div>
                                        <small>Qualification</small>
                                        <p>{caretaker.qualification || "Not provided"}</p>
                                    </div>
                                </div>

                                <div className="caretaker-detail">
                                    <span className="detail-icon">♡</span>
                                    <div>
                                        <small>Skills</small>
                                        <p>{caretaker.skills || "Not provided"}</p>
                                    </div>
                                </div>

                                <div className="caretaker-detail">
                                    <span className="detail-icon">◷</span>
                                    <div>
                                        <small>Availability</small>
                                        <p>{caretaker.availability || "Not provided"}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="caretaker-about">
                                <h4>About</h4>
                                <p>
                                    {caretaker.about || "No introduction provided."}
                                </p>
                            </div>

                            <div className="caretaker-contact">
                                <span>Phone</span>
                                <strong>
                                    {caretaker.user?.phone || "Not provided"}
                                </strong>
                            </div>

                            <button
                                className="send-care-request-btn"
                                onClick={() => handleSendRequest(caretaker)}
                            >
                                Send Care Request
                                <span>→</span>
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {selectedCaretaker && (
                <div
                    className="care-request-overlay"
                    onClick={(e) => {
                        if (e.target === e.currentTarget && !sending) {
                            closeRequestForm();
                        }
                    }}
                >
                    <div className="care-request-modal">
                        <button
                            className="modal-close-btn"
                            onClick={closeRequestForm}
                            disabled={sending}
                            aria-label="Close"
                        >
                            ×
                        </button>

                        <div className="modal-icon">♡</div>

                        <span className="caretaker-eyebrow">
                            CARE REQUEST
                        </span>

                        <h2>Send a Care Request</h2>

                        <p className="modal-description">
                            Introduce your care needs to the selected caretaker.
                        </p>

                        <div className="selected-caretaker-info">
                            <div className="caretaker-avatar">
                                {getInitials(selectedCaretaker)}
                            </div>

                            <div>
                                <strong>
                                    {selectedCaretaker.user?.firstName}{" "}
                                    {selectedCaretaker.user?.lastName}
                                </strong>
                                <p>
                                    {selectedCaretaker.user?.email}
                                </p>
                            </div>
                        </div>

                        <label htmlFor="care-message">
                            Your Message
                        </label>

                        <textarea
                            id="care-message"
                            rows="5"
                            placeholder="Describe your care requirements, preferred schedule, or any important details..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            disabled={sending}
                        />

                        <p className="message-hint">
                            Please provide enough details so the caretaker
                            can understand your requirements.
                        </p>

                        <div className="modal-actions">
                            <button
                                className="modal-cancel-btn"
                                onClick={closeRequestForm}
                                disabled={sending}
                            >
                                Cancel
                            </button>

                            <button
                                className="modal-submit-btn"
                                onClick={submitCareRequest}
                                disabled={sending}
                            >
                                {sending ? "Sending..." : "Send Request"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="caretaker-back-section">
                <button
                    className="caretaker-back-btn"
                    onClick={() => navigate("/elderly/dashboard")}
                >
                    ← Back to Dashboard
                </button>
            </div>

        </div>
    );
}

export default FindCaretaker;
