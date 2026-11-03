
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CaretakerCareRequest.css";

function CaretakerCareRequests() {

    const navigate = useNavigate();

    const user = JSON.parse(
        localStorage.getItem("mycaretaker_user") || "null"
    );

    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [filter, setFilter] = useState("ALL");
    const [updatingId, setUpdatingId] = useState(null);

    const loadRequests = async () => {

        if (!user) {
            navigate("/login");
            return;
        }

        try {

            setMessage("");

            const profileResponse = await fetch(
                `http://localhost:8080/api/caretakers/user/${user.userId}`
            );

            if (!profileResponse.ok) {
                throw new Error("Caretaker profile not found.");
            }

            const caretaker = await profileResponse.json();

            const response = await fetch(
                `http://localhost:8080/api/care-requests/caretaker/${caretaker.caretakerId}`
            );

            if (!response.ok) {
                throw new Error("Unable to load care requests.");
            }

            const data = await response.json();

            setRequests(Array.isArray(data) ? data : []);

        } catch (error) {

            console.error("Care requests loading failed:", error);

            setMessage(
                error.message || "Unable to load care requests."
            );

        } finally {

            setLoading(false);
        }
    };

    useEffect(() => {

        if (!user) {
            navigate("/login");
            return;
        }

        loadRequests();

    }, [navigate, user?.userId]);

    const updateStatus = async (careRequestId, status) => {

        try {

            setUpdatingId(careRequestId);
            setMessage("");

            const response = await fetch(
                `http://localhost:8080/api/care-requests/${careRequestId}/status?status=${status}`,
                {
                    method: "PUT"
                }
            );

            if (!response.ok) {
                throw new Error("Unable to update request status.");
            }

            await loadRequests();

            alert(
                `Care request ${status.toLowerCase()} successfully!`
            );

        } catch (error) {

            console.error("Request status update failed:", error);

            setMessage(
                error.message || "Unable to update care request."
            );

        } finally {

            setUpdatingId(null);
        }
    };

    const totalRequests = requests.length;

    const pendingRequests = requests.filter(
        request => request.status === "PENDING"
    ).length;

    const acceptedRequests = requests.filter(
        request => request.status === "ACCEPTED"
    ).length;

    const rejectedRequests = requests.filter(
        request => request.status === "REJECTED"
    ).length;

    const filteredRequests = requests.filter(request => {

        if (filter === "ALL") {
            return true;
        }

        return request.status === filter;
    });

    const formatDate = (date) => {

        if (!date) {
            return "Not available";
        }

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) {
            return "Not available";
        }

        return parsedDate.toLocaleString();
    };

    if (loading) {

        return (
            <div className="care-requests-loading">
                <div className="requests-loader"></div>
                <p>Loading care requests...</p>
            </div>
        );
    }

    return (

        <div className="caretaker-requests-page">

            {/* Header */}

            <header className="requests-header">

                <div className="requests-brand">
                    <span>💙</span>
                    <h2>MyCaretaker</h2>
                </div>

                <button
                    className="requests-back-btn"
                    onClick={() => navigate("/caretaker/dashboard")}
                >
                    ← Dashboard
                </button>

            </header>

            <main className="requests-container">

                {/* Page Heading */}

                <div className="requests-page-heading">

                    <div>
                        <p className="requests-subtitle">
                            CARETAKER PORTAL
                        </p>

                        <h1>Care Requests</h1>

                        <p>
                            Manage care requests received from elderly
                            people and their family members.
                        </p>
                    </div>

                    <div className="requests-heading-icon">
                        📩
                    </div>

                </div>

                {/* Summary Cards */}

                <section className="requests-summary">

                    <div className="request-summary-card">
                        <div className="summary-icon total-icon">📋</div>
                        <div>
                            <p>Total Requests</p>
                            <h2>{totalRequests}</h2>
                        </div>
                    </div>

                    <div className="request-summary-card">
                        <div className="summary-icon pending-icon">⏳</div>
                        <div>
                            <p>Pending</p>
                            <h2>{pendingRequests}</h2>
                        </div>
                    </div>

                    <div className="request-summary-card">
                        <div className="summary-icon accepted-icon">✓</div>
                        <div>
                            <p>Accepted</p>
                            <h2>{acceptedRequests}</h2>
                        </div>
                    </div>

                    <div className="request-summary-card">
                        <div className="summary-icon rejected-icon">✕</div>
                        <div>
                            <p>Rejected</p>
                            <h2>{rejectedRequests}</h2>
                        </div>
                    </div>

                </section>

                {/* Request List Heading */}

                <section className="requests-list-section">

                    <div className="requests-list-heading">
                        <div>
                            <h2>Received Requests</h2>
                            <p>Review and manage your care requests.</p>
                        </div>
                    </div>

                    {/* Filters */}

                    <div className="request-filters">

                        {[
                            { label: "All Requests", value: "ALL" },
                            { label: "Pending", value: "PENDING" },
                            { label: "Accepted", value: "ACCEPTED" },
                            { label: "Rejected", value: "REJECTED" }
                        ].map(item => (

                            <button
                                key={item.value}
                                className={
                                    filter === item.value
                                        ? "request-filter active"
                                        : "request-filter"
                                }
                                onClick={() => setFilter(item.value)}
                            >
                                {item.label}
                            </button>

                        ))}

                    </div>

                    {message && (
                        <div className="requests-error">
                            {message}
                            <button onClick={loadRequests}>
                                Retry
                            </button>
                        </div>
                    )}

                    {/* Empty State */}

                    {filteredRequests.length === 0 ? (

                        <div className="requests-empty">

                            <div className="empty-icon">
                                📭
                            </div>

                            <h3>
                                {requests.length === 0
                                    ? "No care requests yet"
                                    : "No requests in this category"}
                            </h3>

                            <p>
                                {requests.length === 0
                                    ? "New care requests will appear here when someone contacts you."
                                    : "Try selecting another status filter to see more requests."}
                            </p>

                            {filter !== "ALL" && (
                                <button
                                    onClick={() => setFilter("ALL")}
                                >
                                    View All Requests
                                </button>
                            )}

                        </div>

                    ) : (

                        <div className="requests-card-list">

                            {filteredRequests.map(request => (

                                <article
                                    className="care-request-card"
                                    key={request.careRequestId}
                                >

                                    {/* Card Header */}

                                    <div className="request-card-header">

                                        <div>
                                            <span className="request-number">
                                                REQUEST #{request.careRequestId}
                                            </span>

                                            <p className="request-date">
                                                📅 {formatDate(request.requestDate)}
                                            </p>
                                        </div>

                                        <span
                                            className={`request-status ${request.status?.toLowerCase()}`}
                                        >
                                            {request.status || "UNKNOWN"}
                                        </span>

                                    </div>

                                    <div className="request-card-divider"></div>

                                    {/* Elderly Details */}

                                    <div className="request-person-section">

                                        <h3>👴 Elderly Person</h3>

                                        <div className="request-details-grid">

                                            <div>
                                                <label>Name</label>
                                                <p>
                                                    {request.elderly?.user?.firstName || ""}
                                                    {" "}
                                                    {request.elderly?.user?.lastName || "Not available"}
                                                </p>
                                            </div>

                                            <div>
                                                <label>Email</label>
                                                <p>
                                                    {request.elderly?.user?.email || "Not available"}
                                                </p>
                                            </div>

                                            <div>
                                                <label>Phone</label>
                                                <p>
                                                    {request.elderly?.user?.phone || "Not available"}
                                                </p>
                                            </div>

                                        </div>

                                    </div>

                                    {/* Family Member Details */}

                                    {request.familyMember && (

                                        <div className="request-person-section family-requester">

                                            <h3>👨‍👩‍👧 Requested By (Family Member)</h3>

                                            <div className="request-details-grid">

                                                <div>
                                                    <label>Name</label>
                                                    <p>
                                                        {request.familyMember?.user?.firstName || ""}
                                                        {" "}
                                                        {request.familyMember?.user?.lastName || "Not available"}
                                                    </p>
                                                </div>

                                                <div>
                                                    <label>Email</label>
                                                    <p>
                                                        {request.familyMember?.user?.email || "Not available"}
                                                    </p>
                                                </div>

                                                <div>
                                                    <label>Phone</label>
                                                    <p>
                                                        {request.familyMember?.user?.phone || "Not available"}
                                                    </p>
                                                </div>

                                            </div>

                                        </div>

                                    )}

                                    {/* Request Message */}

                                    <div className="request-message-section">

                                        <h3>Request Message</h3>

                                        <p>
                                            {request.message ||
                                                "No message provided."}
                                        </p>

                                    </div>

                                    {/* Request Type */}

                                    <div className="request-type">
                                        <span>Request Type:</span>

                                        <strong>
                                            {request.familyMember
                                                ? "Family Member Request"
                                                : "Elderly Person Request"}
                                        </strong>
                                    </div>

                                    {/* Actions */}

                                    <div className="request-card-actions">

                                        {request.status === "PENDING" && (

                                            <>
                                                <button
                                                    className="accept-request-btn"
                                                    disabled={updatingId === request.careRequestId}
                                                    onClick={() =>
                                                        updateStatus(
                                                            request.careRequestId,
                                                            "ACCEPTED"
                                                        )
                                                    }
                                                >
                                                    {updatingId === request.careRequestId
                                                        ? "Updating..."
                                                        : "✓ Accept Request"}
                                                </button>

                                                <button
                                                    className="reject-request-btn"
                                                    disabled={updatingId === request.careRequestId}
                                                    onClick={() =>
                                                        updateStatus(
                                                            request.careRequestId,
                                                            "REJECTED"
                                                        )
                                                    }
                                                >
                                                    ✕ Reject Request
                                                </button>
                                            </>

                                        )}

                                        {request.status === "ACCEPTED" && (

                                            <>
                                                <p className="accepted-message">
                                                    ✓ You have accepted this request.
                                                </p>

                                                <button
                                                    className="schedule-request-btn"
                                                    onClick={() =>
                                                        navigate(
                                                            `/caretaker/create-schedule/${request.careRequestId}`
                                                        )
                                                    }
                                                >
                                                    📅 Create Care Schedule
                                                </button>
                                            </>

                                        )}

                                        {request.status === "REJECTED" && (

                                            <p className="rejected-message">
                                                This request has been rejected.
                                            </p>

                                        )}

                                    </div>

                                </article>

                            ))}

                        </div>

                    )}

                </section>

                <footer className="requests-footer">
                    © 2026 MyCaretaker. Caring with compassion.
                </footer>

            </main>

        </div>
    );
}

export default CaretakerCareRequests;
