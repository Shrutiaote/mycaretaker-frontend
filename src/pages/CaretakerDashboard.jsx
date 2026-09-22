import { useNavigate } from "react-router-dom";

function CaretakerDashboard() {

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
                Welcome, {user?.firstName || "Caretaker"}!
            </h2>

            <p>
                This is your Caretaker Dashboard.
            </p>

            <hr />

            <h3>Quick Actions</h3>

            <button
                onClick={() =>
                    navigate("/caretaker/profile")
                }
            >
                My Profile
            </button>

            <br />
            <br />

           <button
             onClick={() =>
             navigate("/caretaker/care-requests")
             }
        >
         Care Requests
        </button>

            <br />
            <br />

           <button
             onClick={() =>
             navigate("/caretaker/care-schedule")
            }
            > Care Schedule
            </button>

            
            <br />
            <br />

            <button
                onClick={() =>
                navigate("/notifications")
                }
            >
            Notifications
            </button>

            <br />
            <br />

            <button onClick={handleLogout}>
                Logout
            </button>

        </div>
    );
}

export default CaretakerDashboard;