import { useNavigate } from "react-router-dom";

function ElderlyDashboard() {

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

            <h2>Welcome, {user?.firstName || "Elderly Person"}!</h2>

            <p>
                This is your Elderly Dashboard.
            </p>

            <hr />

            <h3>Quick Actions</h3>

            <button onClick={() => navigate("/elderly/profile")}>
              My Profile
            </button>

            <br />
            <br />

            <button onClick={() => navigate("/elderly/health-information")}>
               Health Information
            </button>

            <br />
            <br />

            <button
               onClick={() =>
               navigate("/elderly/view-health-information")
               }
            > View Health Information
            </button>

            <br />
            <br />

            <button
                 onClick={() =>
                 navigate("/elderly/find-caretaker")
                  }
            > Find a Caretaker
            </button>

            <br />
            <br />

           <button
              onClick={() =>
              navigate("/elderly/care-requests")
            }
            > My Care Requests
          </button>

            <br />
            <br />

           <button
              onClick={() =>
              navigate("/elderly/care-schedule")
           }
           >
           Care Schedule
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

export default ElderlyDashboard;