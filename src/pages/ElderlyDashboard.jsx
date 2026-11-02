
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ElderlyDashboard.css";

function ElderlyDashboard() {
    const navigate = useNavigate();

    const user = (() => {
        try {
            return JSON.parse(localStorage.getItem("mycaretaker_user")) || {};
        } catch {
            return {};
        }
    })();

    const [connectionCode, setConnectionCode] = useState("");
    const [message, setMessage] = useState("");
    const [copyMessage, setCopyMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem("mycaretaker_user");
        navigate("/login");
    };

    const generateConnectionCode = async () => {
        if (!user.userId) {
            setMessage("User information not found. Please log in again.");
            return;
        }

        setLoading(true);
        setMessage("");
        setCopyMessage("");

        try {
            const response = await fetch(
                `http://localhost:8080/api/elderly/user/${user.userId}/connection-code`,
                { method: "POST" }
            );

            if (!response.ok) {
                throw new Error("Unable to generate connection code.");
            }

            const code = await response.text();
            setConnectionCode(code);
            setMessage("Your connection code is ready!");
        } catch (error) {
            console.error(error);
            setMessage("Unable to generate connection code. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const copyCode = async () => {
        try {
            await navigator.clipboard.writeText(connectionCode);
            setCopyMessage("Connection code copied!");
        } catch (error) {
            console.error(error);
            setCopyMessage("Unable to copy. Please copy the code manually.");
        }
    };

    const menuItems = [
        { icon: "⌂", label: "Dashboard", path: "/elderly/dashboard", active: true },
        { icon: "◎", label: "My Profile", path: "/elderly/profile" },
        { icon: "♡", label: "Health Information", path: "/elderly/health-information" },
        { icon: "⌕", label: "Find Caretaker", path: "/elderly/find-caretaker" },
        { icon: "▤", label: "Care Requests", path: "/elderly/care-requests" },
        { icon: "▦", label: "Care Schedule", path: "/elderly/care-schedule" },
        { icon: "♧", label: "Notifications", path: "/notifications" }
    ];

    return (
        <div className="elderly-layout">

            {/* Sidebar */}
            <aside className="elderly-sidebar">

                <div className="elderly-brand">
                    <div className="brand-symbol">M</div>

                    <div>
                        <h2>MyCaretaker</h2>
                        <span>CARE & WELLNESS</span>
                    </div>
                </div>

                <div className="sidebar-section-label">
                    MAIN MENU
                </div>

                <nav className="elderly-navigation">
                    {menuItems.map((item) => (
                        <button
                            key={item.label}
                            className={`sidebar-link ${item.active ? "active" : ""}`}
                            onClick={() => navigate(item.path)}
                        >
                            <span className="sidebar-icon">{item.icon}</span>
                            <span>{item.label}</span>
                        </button>
                    ))}
                </nav>

                <div className="sidebar-help">
                    <div className="help-icon">?</div>
                    <h3>Need assistance?</h3>
                    <p>
                        We're here to help you with your care journey.
                    </p>

                    <button onClick={() => navigate("/notifications")}>
                        Get Support →
                    </button>
                </div>

                <button className="sidebar-logout" onClick={handleLogout}>
                    <span>↪</span> Sign out
                </button>

            </aside>

            {/* Main Content */}
            <main className="elderly-main">

                {/* Topbar */}
                <header className="elderly-topbar">

                    <div>
                        <span className="topbar-caption">
                            MY SPACE / DASHBOARD
                        </span>
                        <h2>Dashboard</h2>
                    </div>

                    <div className="topbar-user">

                        <button
                            className="topbar-notification"
                            onClick={() => navigate("/notifications")}
                            aria-label="Notifications"
                        >
                            ♧
                        </button>

                        <div className="user-avatar">
                            {(user.firstName || "E").charAt(0).toUpperCase()}
                        </div>

                        <div className="topbar-user-info">
                            <strong>
                                {user.firstName || "Elderly Person"}
                            </strong>
                            <span>Elderly Member</span>
                        </div>

                    </div>
                </header>

                <div className="elderly-content">

                    {/* Welcome Banner */}
                    <section className="welcome-banner">

                        <div className="welcome-content">

                            <span className="welcome-tag">
                                YOUR CARE, YOUR COMFORT
                            </span>

                            <h1>
                                Welcome back, {user.firstName || "Friend"}!
                            </h1>

                            <p>
                                Your wellbeing matters. Manage your care,
                                stay connected with family and keep your
                                health information up to date.
                            </p>

                            <button
                                className="welcome-button"
                                onClick={() => navigate("/elderly/profile")}
                            >
                                View My Profile <span>→</span>
                            </button>

                        </div>

                        <div className="welcome-decoration">
                            <div className="welcome-circle">
                                <span>♡</span>
                            </div>
                            <div className="welcome-small-circle"></div>
                        </div>

                    </section>

                    {/* Family Connection */}
                    <section className="connection-section">

                        <div className="section-heading">
                            <div>
                                <span className="section-eyebrow">
                                    STAY CONNECTED
                                </span>

                                <h2>Connect with your family</h2>

                                <p>
                                    Invite a family member to stay connected
                                    with your care.
                                </p>
                            </div>
                        </div>

                        <div className="connection-card">

                            <div className="connection-icon">
                                ⌘
                            </div>

                            <div className="connection-details">

                                <h3>Your family connection</h3>

                                <p>
                                    Generate a secure connection code and
                                    share it with your family member.
                                </p>

                                {connectionCode && (
                                    <div className="connection-code-box">
                                        <span>{connectionCode}</span>

                                        <button onClick={copyCode}>
                                            Copy code
                                        </button>
                                    </div>
                                )}

                                {message && (
                                    <p className="connection-message">
                                        {message}
                                    </p>
                                )}

                                {copyMessage && (
                                    <p className="connection-message">
                                        {copyMessage}
                                    </p>
                                )}

                            </div>

                            <button
                                className="generate-code-button"
                                onClick={generateConnectionCode}
                                disabled={loading}
                            >
                                {loading ? "Generating..." : "+ Generate code"}
                            </button>

                        </div>
                    </section>

                    {/* Dashboard Overview */}
                    <section className="overview-section">

                        <div className="section-heading">
                            <div>
                                <span className="section-eyebrow">
                                    YOUR CARE OVERVIEW
                                </span>

                                <h2>Manage your wellbeing</h2>

                                <p>
                                    Keep track of your care and health activities.
                                </p>
                            </div>
                        </div>

                        <div className="overview-grid">

                            {/* Care Requests */}
                            <div className="overview-card">

                                <div className="overview-icon requests-icon">
                                    <span>▤</span>
                                </div>

                                <h3>Care Requests</h3>

                                <p>
                                    Review the caretaker requests you have
                                    created and check their status.
                                </p>

                                <button
                                    onClick={() => navigate("/elderly/care-requests")}
                                >
                                    View Requests →
                                </button>

                            </div>

                            {/* Care Schedule */}
                            <div className="overview-card">

                                <div className="overview-icon schedule-icon">
                                    <span>▦</span>
                                </div>

                                <h3>Care Schedule</h3>

                                <p>
                                    Check your planned care activities
                                    and upcoming appointments.
                                </p>

                                <button
                                    onClick={() => navigate("/elderly/care-schedule")}
                                >
                                    View Schedule →
                                </button>

                            </div>

                            {/* Health Information */}
                            <div className="overview-card">

                                <div className="overview-icon health-icon">
                                    <span>♡</span>
                                </div>

                                <h3>Health Information</h3>

                                <p>
                                    Review and update your health
                                    and medical information.
                                </p>

                                <button
                                    onClick={() => navigate("/elderly/health-information")}
                                >
                                    View Health Details →
                                </button>

                            </div>

                        </div>
                    </section>

                    {/* Footer */}
                    <footer className="elderly-footer">
                        <span>
                            © {new Date().getFullYear()} MyCaretaker
                        </span>

                        <span>
                            Care with compassion. Support with dignity.
                        </span>
                    </footer>

                </div>
            </main>
        </div>
    );
}

export default ElderlyDashboard;
