import { useState } from "react";
import { useNavigate } from "react-router-dom";

function ConnectElderly() {

    const navigate = useNavigate();

    const user = JSON.parse(
        localStorage.getItem("mycaretaker_user")
    );

    const [connectionCode, setConnectionCode] = useState("");
    const [message, setMessage] = useState("");

    const handleConnect = async (e) => {

        e.preventDefault();

        setMessage("");

        if (!connectionCode.trim()) {
            setMessage("Please enter the connection code.");
            return;
        }

        try {

            // Find the Elderly person using the connection code
            const elderlyResponse = await fetch(
                `http://localhost:8080/api/elderly/connection/${connectionCode.trim()}`
            );

            if (!elderlyResponse.ok) {
                throw new Error("Connection code not found");
            }

            const elderly = await elderlyResponse.json();

            const elderlyId = elderly.elderlyId;

            // Connect Family Member to Elderly
            const response = await fetch(
                `http://localhost:8080/api/family-members/user/${user.userId}/elderly/${elderlyId}`,
                {
                    method: "PUT"
                }
            );

            if (!response.ok) {
                throw new Error("Unable to connect");
            }

            setMessage(
                "Elderly person connected successfully!"
            );

        } catch (error) {

            console.error(error);

            setMessage(
                "Invalid connection code. Please check the code and try again."
            );
        }
    };

    return (
        <div>

            <h1>MyCaretaker</h1>

            <h2>Connect to Elderly Person</h2>

            <hr />

            <p>
                Ask the elderly person to share their
                MyCaretaker connection code with you.
            </p>

            <form onSubmit={handleConnect}>

                <label>
                    Connection Code:
                </label>

                <br />

                <input
                    type="text"
                    value={connectionCode}
                    onChange={(e) =>
                        setConnectionCode(e.target.value)
                    }
                    placeholder="Example: MC-A7F92B31"
                />

                <br />
                <br />

                <button type="submit">
                    Connect
                </button>

            </form>

            <br />

            {message && (
                <p>{message}</p>
            )}

            <br />

            <button
                onClick={() =>
                    navigate("/family/elderly")
                }
            >
                View My Elderly
            </button>

            <br />
            <br />

            <button
                onClick={() =>
                    navigate("/family/dashboard")
                }
            >
                Back to Dashboard
            </button>

        </div>
    );
}

export default ConnectElderly;