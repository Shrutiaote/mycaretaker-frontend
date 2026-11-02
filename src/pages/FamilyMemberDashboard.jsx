import { useNavigate } from "react-router-dom";

function FamilyMemberDashboard() {

    const navigate = useNavigate();

    const user = JSON.parse(
        localStorage.getItem("mycaretaker_user")
    );

    const handleLogout = () => {
        localStorage.removeItem("mycaretaker_user");
        navigate("/login");
    };

    return (
        <div>

            <h1>MyCaretaker</h1>

            <h2>
                Welcome, {user?.firstName || "Family Member"}!
            </h2>

            <p>
                This is your Family Member Dashboard.
            </p>

            <hr />

            <h3>Quick Actions</h3>

            <button
                onClick={() =>
                    navigate("/family/profile")
                }
            >
                My Profile
            </button>

            <br /><br />

            <button
                onClick={() =>
                    navigate("/family/elderly")
                }
            >
                My Elderly
            </button>

            <br /><br />

            <button
               onClick={() =>
               navigate("/family/connect-elderly")
               }
            >
              Connect to Elderly
            </button>

            <br /><br />

            <button
                onClick={() =>
                    navigate("/family/find-caretaker")
                }
            >
                Find a Caretaker
            </button>

            <br /><br />

            <button
                onClick={() =>
                    navigate("/family/care-requests")
                }
            >
                Care Requests
            </button>

            <br /><br />

            <button
                onClick={() =>
                    navigate("/family/care-schedule")
                }
            >
                Care Schedule
            </button>

            <br /><br />

            <button
                onClick={() =>
                    navigate("/notifications")
                }
            >
                Notifications
            </button>

            <br /><br />

            <button onClick={handleLogout}>
                Logout
            </button>

        </div>
    );
}

export default FamilyMemberDashboard;