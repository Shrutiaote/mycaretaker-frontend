import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function FamilyFindCaretaker() {

    const navigate = useNavigate();

    const user = JSON.parse(
        localStorage.getItem("mycaretaker_user")
    );

    const [caretakers, setCaretakers] = useState([]);
    const [elderly, setElderly] = useState(null);
    const [familyMember, setFamilyMember] = useState(null);

    const [message, setMessage] = useState("");
    const [requestMessage, setRequestMessage] = useState("");

    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);

    useEffect(() => {

        if (!user) {
            navigate("/login");
            return;
        }

        const loadData = async () => {

            try {

                // Get connected elderly person
                const elderlyResponse = await fetch(
                    `http://localhost:8080/api/family-members/user/${user.userId}/elderly`
                );

                if (!elderlyResponse.ok) {
                    throw new Error(
                        "No elderly person connected"
                    );
                }

                const elderlyData =
                    await elderlyResponse.json();

                setElderly(elderlyData);


                // Get verified caretakers
                const caretakerResponse = await fetch(
                    "http://localhost:8080/api/caretakers/verified"
                );

                if (!caretakerResponse.ok) {
                    throw new Error(
                        "Unable to load caretakers"
                    );
                }

                const caretakerData =
                    await caretakerResponse.json();

                setCaretakers(caretakerData);

            } catch (error) {

                console.error(error);

                setMessage(
                    "Unable to load caretaker information."
                );

            } finally {

                setLoading(false);
            }

            const familyResponse = await fetch(
    `http://localhost:8080/api/family-members/user/${user.userId}`
     );

         if (!familyResponse.ok) {
            throw new Error(
           "Family member profile not found"
          );
         }

        const familyData =
           await familyResponse.json();

         setFamilyMember(familyData);
           };

           loadData();

          }, [navigate, user?.userId]);


    const sendCareRequest = async (caretakerId) => {

       if (!familyMember) {
      alert(
        "Family member profile not found."
      );
     return;
    }

     if (!elderly) {
       alert(
        "Please connect to an elderly person first."
      );
      return;
    }

        if (!requestMessage.trim()) {
            alert(
                "Please enter a message before sending the request."
            );
            return;
        }

        setSending(true);

        try {

            const response = await fetch(
               `http://localhost:8080/api/care-requests/family-member/${familyMember.familyMemberId}/caretaker/${caretakerId}`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "text/plain"
                    },

                    body: requestMessage
                }
            );

            if (!response.ok) {
                throw new Error(
                    "Unable to send care request"
                );
            }

            alert(
                "Care request sent successfully!"
            );

            setRequestMessage("");

        } catch (error) {

            console.error(error);

            alert(
                "Unable to send care request."
            );

        } finally {

            setSending(false);
        }
    };


    if (loading) {
        return <p>Loading caretakers...</p>;
    }


    return (
        <div>

            <h1>MyCaretaker</h1>

            <h2>Find a Caretaker</h2>

            <hr />

            {message && (
                <p>{message}</p>
            )}


            {elderly && (
                <div>

                    <h3>
                        Requesting Care For
                    </h3>

                    <p>
                        <strong>Name:</strong>{" "}
                        {elderly.user?.firstName}{" "}
                        {elderly.user?.lastName}
                    </p>

                    <hr />

                </div>
            )}


            <h3>
                Care Request Message
            </h3>

            <textarea
                value={requestMessage}
                onChange={(e) =>
                    setRequestMessage(e.target.value)
                }
                placeholder="Example: Need assistance with daily activities and medication reminders."
                rows="4"
                cols="50"
            />


            <br />
            <br />


            {caretakers.length === 0 ? (

                <p>
                    No verified caretakers are available
                    right now.
                </p>

            ) : (

                caretakers.map((caretaker) => (

                    <div
                        key={caretaker.caretakerId}
                        style={{
                            border: "1px solid #ccc",
                            padding: "15px",
                            marginBottom: "15px"
                        }}
                    >

                        <h3>
                            {caretaker.user?.firstName}{" "}
                            {caretaker.user?.lastName}
                        </h3>

                        <p>
                            <strong>Email:</strong>{" "}
                            {caretaker.user?.email}
                        </p>

                        <p>
                            <strong>Phone:</strong>{" "}
                            {caretaker.user?.phone}
                        </p>

                        <p>
                            <strong>Experience:</strong>{" "}
                            {caretaker.experience ||
                                "Not provided"}
                        </p>

                        <p>
                            <strong>Qualification:</strong>{" "}
                            {caretaker.qualification ||
                                "Not provided"}
                        </p>

                        <p>
                            <strong>Skills:</strong>{" "}
                            {caretaker.skills ||
                                "Not provided"}
                        </p>

                        <p>
                            <strong>Availability:</strong>{" "}
                            {caretaker.availability ||
                                "Not provided"}
                        </p>

                        <p>
                            <strong>Hourly Rate:</strong>{" "}
                            {caretaker.hourlyRate ||
                                "Not provided"}
                        </p>

                        <p>
                            <strong>About:</strong>{" "}
                            {caretaker.about ||
                                "Not provided"}
                        </p>

                        <p>
                            <strong>Status:</strong>{" "}
                            {caretaker.verificationStatus}
                        </p>


                        <br />


                        <button
                            onClick={() =>
                                sendCareRequest(
                                    caretaker.caretakerId
                                )
                            }
                            disabled={sending}
                        >
                            {sending
                                ? "Sending..."
                                : "Send Care Request"}
                        </button>

                    </div>

                ))

            )}


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

export default FamilyFindCaretaker;