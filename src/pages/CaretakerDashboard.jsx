
import { useNavigate } from "react-router-dom";
import "./CaretakerDashboard.css";

function CaretakerDashboard() {
    const navigate = useNavigate();

    const user = JSON.parse(
        localStorage.getItem("mycaretaker_user") || "null"
    );

    const handleLogout = () => {
        localStorage.removeItem("mycaretaker_user");
        navigate("/login");
    };

    const firstName = user?.firstName || "Caretaker";
    const initial = firstName.charAt(0).toUpperCase();

    return (
        <div className="caretaker-dashboard">

            {/* Sidebar */}
            <aside className="caretaker-sidebar">

                <div className="caretaker-brand">
                    <span className="brand-icon">💙</span>
                    <h2>MyCaretaker</h2>
                </div>

                <div className="sidebar-menu">
                    <p className="sidebar-heading">MAIN MENU</p>

                    <button
                        className="sidebar-link active"
                        onClick={() => navigate("/caretaker/dashboard")}
                    >
                        <span>🏠</span>
                        Dashboard
                    </button>

                    <button
                        className="sidebar-link"
                        onClick={() => navigate("/caretaker/profile")}
                    >
                        <span>👤</span>
                        My Profile
                    </button>

                    <button
                        className="sidebar-link"
                        onClick={() => navigate("/caretaker/care-requests")}
                    >
                        <span>📩</span>
                        Care Requests
                    </button>

                    <button
                        className="sidebar-link"
                        onClick={() => navigate("/caretaker/care-schedule")}
                    >
                        <span>📅</span>
                        Care Schedule
                    </button>

                    <button
                        className="sidebar-link"
                        onClick={() => navigate("/notifications")}
                    >
                        <span>🔔</span>
                        Notifications
                    </button>
                </div>

                <div className="sidebar-bottom">
                    <div className="sidebar-help">
                        <span>💙</span>
                        <div>
                            <h4>Care with kindness</h4>
                            <p>Every little act makes a difference.</p>
                        </div>
                    </div>

                    <button
                        className="sidebar-logout"
                        onClick={handleLogout}
                    >
                        <span>↪</span>
                        Logout
                    </button>
                </div>

            </aside>

            {/* Main Content */}
            <main className="caretaker-main">

                {/* Topbar */}
                <header className="caretaker-topbar">
                    <div>
                        <p className="topbar-label">CARETAKER PORTAL</p>
                        <h2>Dashboard</h2>
                    </div>

                    <div className="topbar-user">
                        <div className="profile-avatar">
                            {initial}
                        </div>

                        <div className="topbar-user-info">
                            <strong>{firstName}</strong>
                            <span>Caretaker</span>
                        </div>
                    </div>
                </header>

                {/* Welcome Banner */}
                <section className="caretaker-welcome">
                    <div className="welcome-content">
                        <p className="welcome-label">WELCOME BACK</p>

                        <h1>Hello, {firstName}! 👋</h1>

                        <p>
                            Thank you for being a part of MyCaretaker.
                            Your compassion and dedication help make
                            everyday life better for those who need care.
                        </p>

                        <div className="welcome-tag">
                            <span>💙</span>
                            Making care more meaningful
                        </div>
                    </div>

                    <div className="welcome-illustration">
                        <span>🤝</span>
                        <div className="illustration-circle"></div>
                    </div>
                </section>

                {/* Dashboard Overview */}
                <section className="dashboard-overview">

                    <div className="overview-heading">
                        <div>
                            <h2>Your Care Workspace</h2>
                            <p>
                                A few things to keep in mind during your
                                caregiving journey.
                            </p>
                        </div>
                    </div>

                    <div className="overview-grid">

                        <div className="overview-card requests-card">
                            <div className="overview-icon">📩</div>

                            <h3>Stay Connected</h3>

                            <p>
                                Respond to care requests promptly and
                                communicate clearly with elderly users
                                and their family members.
                            </p>

                            <span className="overview-note">
                                Good communication builds trust.
                            </span>
                        </div>

                        <div className="overview-card schedule-card">
                            <div className="overview-icon">📅</div>

                            <h3>Manage Your Time</h3>

                            <p>
                                Keep track of your assigned care schedules
                                and make sure you are prepared for each
                                appointment.
                            </p>

                            <span className="overview-note">
                                Be punctual and stay organised.
                            </span>
                        </div>

                        <div className="overview-card profile-card">
                            <div className="overview-icon">👤</div>

                            <h3>Maintain Your Profile</h3>

                            <p>
                                Keep your qualifications, experience,
                                skills and availability information
                                accurate and up to date.
                            </p>

                            <span className="overview-note">
                                A complete profile builds confidence.
                            </span>
                        </div>

                    </div>
                </section>

                {/* Caregiving Reminder */}
                <section className="care-reminder">
                    <div className="reminder-icon">🌷</div>

                    <div>
                        <h3>A Little Reminder</h3>

                        <p>
                            Great caregiving is not only about completing
                            tasks. It is also about patience, respect,
                            understanding and making someone feel valued.
                        </p>
                    </div>
                </section>

                <footer className="caretaker-footer">
                    © 2026 MyCaretaker. Caring with compassion.
                </footer>

            </main>
        </div>
    );
}

export default CaretakerDashboard;
