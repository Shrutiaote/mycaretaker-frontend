
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./MyCareRequests.css";

function MyCareRequests() {

    const navigate = useNavigate();

    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {

        const elderlyId = localStorage.getItem(
            "mycaretaker_elderlyId"
        );

        if (!elderlyId) {
            setError("Elderly profile not found. Please complete your profile.");
            setLoading(false);
            return;
        }

        const fetchRequests = async () => {

            try {

                const response = await fetch(
                    `http://localhost:8080/api/care-requests/elderly/${elderlyId}`
                );

                if (!response.ok) {
                    throw new Error("Failed to load care requests.");
                }

                const result = await response.json();

                setRequests(Array.isArray(result) ? result : []);

            } catch (error) {

                console.error("Failed to load care requests:", error);
                setError("Unable to load your care requests. Please try again.");

            } finally {
                setLoading(false);
            }
        };

        fetchRequests();

    }, []);

    const getStatusClass = (status) => {

        const normalizedStatus = (status || "PENDING").toUpperCase();

        if (normalizedStatus === "ACCEPTED") {
            return "accepted";
        }

        if (
            normalizedStatus === "REJECTED" ||
            normalizedStatus === "CANCELLED"
        ) {
            return "rejected";
        }

        return "pending";
    };

    const formatDate = (date) => {

        if (!date) {
            return "Not available";
        }

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) {
            return "Not available";
        }

        return parsedDate.toLocaleString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    const totalRequests = requests.length;

    const pendingRequests = requests.filter(
        request => getStatusClass(request.status) === "pending"
    ).length;

    const acceptedRequests = requests.filter(
        request => getStatusClass(request.status) === "accepted"
    ).length;

    const rejectedRequests = requests.filter(
        request => getStatusClass(request.status) === "rejected"
    ).length;

    return (

        <div className="care-requests-page">

            <div className="care-requests-header">

                <div>
                    <p className="page-eyebrow">MY CARE</p>

                    <h1>My Care Requests</h1>

                    <p className="page-description">
                        Keep track of your caretaker requests
                        and stay updated on their progress.
                    </p>
                </div>

                <button
                    className="primary-button"
                    onClick={() => navigate("/elderly/find-caretaker")}
                >
                    + Find a Caretaker
                </button>

            </div>

            {loading ? (

                <div className="care-requests-message">
                    <div className="loading-spinner"></div>
                    <h3>Loading your requests...</h3>
                    <p>Please wait while we fetch your information.</p>
                </div>

            ) : error ? (

                <div className="care-requests-message error-message">
                    <h3>Something went wrong</h3>
                    <p>{error}</p>

                    <button
                        className="primary-button"
                        onClick={() => navigate("/elderly/profile")}
                    >
                        Go to Profile
                    </button>
                </div>

            ) : (

                <>

                    <div className="request-summary-grid">

                        <div className="summary-card total-card">
                            <div className="summary-icon">▤</div>
                            <div>
                                <p>Total Requests</p>
                                <h2>{totalRequests}</h2>
                            </div>
                        </div>

                        <div className="summary-card pending-card">
                            <div className="summary-icon">◷</div>
                            <div>
                                <p>Pending</p>
                                <h2>{pendingRequests}</h2>
                            </div>
                        </div>

                        <div className="summary-card accepted-card">
                            <div className="summary-icon">✓</div>
                            <div>
                                <p>Accepted</p>
                                <h2>{acceptedRequests}</h2>
                            </div>
                        </div>

                        <div className="summary-card rejected-card">
                            <div className="summary-icon">×</div>
                            <div>
                                <p>Rejected</p>
                                <h2>{rejectedRequests}</h2>
                            </div>
                        </div>

                    </div>

                    <div className="requests-section">

                        <div className="section-heading">
                            <div>
                                <h2>Your Requests</h2>
                                <p>
                                    View the details and status of your
                                    caretaker requests.
                                </p>
                            </div>

                            <span className="request-count">
                                {totalRequests}{" "}
                                {totalRequests === 1 ? "Request" : "Requests"}
                            </span>
                        </div>

                        {requests.length === 0 ? (

                            <div className="empty-requests">

                                <div className="empty-icon">♡</div>

                                <h3>No Care Requests Yet</h3>

                                <p>
                                    You haven't sent any care requests.
                                    Find a suitable caretaker to get started
                                    with your care journey.
                                </p>

                                <button
                                    className="primary-button"
                                    onClick={() =>
                                        navigate("/elderly/find-caretaker")
                                    }
                                >
                                    Find a Caretaker
                                </button>

                            </div>

                        ) : (

                            <div className="requests-list">

                                {requests.map((request) => {

                                    const caretaker = request.caretaker?.user || {};

                                    const statusClass = getStatusClass(
                                        request.status
                                    );

                                    return (

                                        <div
                                            className="request-card"
                                            key={request.careRequestId}
                                        >

                                            <div className="request-card-top">

                                                <div className="request-id">
                                                    <span className="request-id-icon">
                                                        ♧
                                                    </span>

                                                    <div>
                                                        <h3>
                                                            Care Request #
                                                            {request.careRequestId}
                                                        </h3>

                                                        <p>
                                                            Submitted on{" "}
                                                            {formatDate(request.requestDate)}
                                                        </p>
                                                    </div>
                                                </div>

                                                <span
                                                    className={`status-badge ${statusClass}`}
                                                >
                                                    {request.status || "PENDING"}
                                                </span>

                                            </div>

                                            <div className="request-divider"></div>

                                            <div className="caretaker-details">

                                                <div className="caretaker-avatar">
                                                    {caretaker.firstName
                                                        ? caretaker.firstName.charAt(0).toUpperCase()
                                                        : "C"}
                                                </div>

                                                <div className="caretaker-info">

                                                    <p className="detail-label">
                                                        CARETAKER
                                                    </p>

                                                    <h3>
                                                        {caretaker.firstName || "Name unavailable"}{" "}
                                                        {caretaker.lastName || ""}
                                                    </h3>

                                                    <div className="contact-details">

                                                        <span>
                                                            ✉ {caretaker.email || "Email unavailable"}
                                                        </span>

                                                        <span>
                                                            ☎ {caretaker.phone || "Phone unavailable"}
                                                        </span>

                                                    </div>

                                                </div>

                                            </div>

                                            <div className="request-message-box">

                                                <p className="detail-label">
                                                    YOUR MESSAGE
                                                </p>

                                                <p>
                                                    {request.message || "No message provided."}
                                                </p>

                                            </div>

                                            <div className="request-card-footer">

                                                <span>
                                                    Request ID: #{request.careRequestId}
                                                </span>

                                                <span className={`footer-status ${statusClass}`}>
                                                    {statusClass === "accepted"
                                                        ? "Caretaker accepted your request"
                                                        : statusClass === "rejected"
                                                            ? "Request was not accepted"
                                                            : "Waiting for caretaker response"}
                                                </span>

                                            </div>

                                        </div>

                                    );

                                })}

                            </div>

                        )}

                    </div>

                </>

            )}

            <button
                className="back-button"
                onClick={() => navigate("/elderly/dashboard")}
            >
                ← Back to Dashboard
            </button>

        </div>
    );
}

export default MyCareRequests;
