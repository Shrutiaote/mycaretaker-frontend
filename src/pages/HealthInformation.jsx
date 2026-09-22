import { useEffect, useState } from "react";
import { saveHealthInformation } from "../services/userService";
import { useNavigate } from "react-router-dom";

function HealthInformation() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        bloodGroup: "",
        medicalConditions: "",
        allergies: "",
        currentMedications: "",
        pastSurgeries: "",
        mobilityStatus: "",
        dietaryRequirements: "",
        doctorName: "",
        doctorContact: "",
        additionalHealthInformation: ""
    });

    useEffect(() => {

    const fetchHealthInformation = async () => {

        const elderlyId = localStorage.getItem(
            "mycaretaker_elderlyId"
        );

        if (!elderlyId) {
            alert("Please complete your elderly profile first.");
            navigate("/elderly/profile");
            return;
        }

        try {

            const response = await fetch(
                `http://localhost:8080/api/health-information/elderly/${elderlyId}`
            );

            if (response.ok) {

                const result = await response.json();

                setFormData({
                    bloodGroup: result.bloodGroup || "",
                    medicalConditions:
                        result.medicalConditions || "",
                    allergies:
                        result.allergies || "",
                    currentMedications:
                        result.currentMedications || "",
                    pastSurgeries:
                        result.pastSurgeries || "",
                    mobilityStatus:
                        result.mobilityStatus || "",
                    dietaryRequirements:
                        result.dietaryRequirements || "",
                    doctorName:
                        result.doctorName || "",
                    doctorContact:
                        result.doctorContact || "",
                    additionalHealthInformation:
                        result.additionalHealthInformation || ""
                });
            }

        } catch (error) {

            console.error(
                "Failed to load health information:",
                error
            );
        }
    };

    fetchHealthInformation();

}, []);

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

   const handleSubmit = async (e) => {

    e.preventDefault();

    try {

        const user = JSON.parse(
            localStorage.getItem("mycaretaker_user")
        );

        if (!user) {
            alert("Please login first.");
            return;
        }

       const elderlyId = localStorage.getItem(
    "mycaretaker_elderlyId"
);

if (!elderlyId) {
    alert("Please complete your elderly profile first.");
    navigate("/elderly/profile");
    return;
}

        const result = await saveHealthInformation(
            elderlyId,
            formData
        );

        console.log(
            "Health information saved:",
            result
        );

        alert("Health information saved successfully!");

    } catch (error) {

        console.error(
            "Failed to save health information:",
            error
        );

        alert(
            "Failed to save health information: " +
            error.message
        );
    }
};

    return (
        <div>

            <h1>Health Information</h1>

            <form onSubmit={handleSubmit}>

                <div>
                    <label>Blood Group</label>

                    <select
                        name="bloodGroup"
                        value={formData.bloodGroup}
                        onChange={handleChange}
                    >
                        <option value="">Select Blood Group</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                    </select>
                </div>

                <br />

                <div>
                    <label>Medical Conditions</label>

                    <textarea
                        name="medicalConditions"
                        value={formData.medicalConditions}
                        onChange={handleChange}
                        placeholder="Example: Diabetes, hypertension..."
                    />
                </div>

                <br />

                <div>
                    <label>Allergies</label>

                    <textarea
                        name="allergies"
                        value={formData.allergies}
                        onChange={handleChange}
                        placeholder="List any known allergies"
                    />
                </div>

                <br />

                <div>
                    <label>Current Medications</label>

                    <textarea
                        name="currentMedications"
                        value={formData.currentMedications}
                        onChange={handleChange}
                        placeholder="List current medications"
                    />
                </div>

                <br />

                <div>
                    <label>Past Surgeries</label>

                    <textarea
                        name="pastSurgeries"
                        value={formData.pastSurgeries}
                        onChange={handleChange}
                        placeholder="Mention previous surgeries if any"
                    />
                </div>

                <br />

                <div>
                    <label>Mobility Status</label>

                    <select
                        name="mobilityStatus"
                        value={formData.mobilityStatus}
                        onChange={handleChange}
                    >
                        <option value="">Select Mobility Status</option>
                        <option value="Independent">Independent</option>
                        <option value="Needs Assistance">
                            Needs Assistance
                        </option>
                        <option value="Wheelchair">
                            Wheelchair
                        </option>
                        <option value="Bedridden">
                            Bedridden
                        </option>
                    </select>
                </div>

                <br />

                <div>
                    <label>Dietary Requirements</label>

                    <textarea
                        name="dietaryRequirements"
                        value={formData.dietaryRequirements}
                        onChange={handleChange}
                        placeholder="Example: Low-salt diet..."
                    />
                </div>

                <br />

                <div>
                    <label>Doctor Name</label>

                    <input
                        type="text"
                        name="doctorName"
                        value={formData.doctorName}
                        onChange={handleChange}
                    />
                </div>

                <br />

                <div>
                    <label>Doctor Contact</label>

                    <input
                        type="text"
                        name="doctorContact"
                        value={formData.doctorContact}
                        onChange={handleChange}
                    />
                </div>

                <br />

                <div>
                    <label>Additional Health Information</label>

                    <textarea
                        name="additionalHealthInformation"
                        value={formData.additionalHealthInformation}
                        onChange={handleChange}
                        placeholder="Any other important health information"
                    />
                </div>

                <br />

                <button type="submit">
                   Save / Update Health Information
                </button>

                <br />
                <br />

              <button
                type="button"
                onClick={() =>
                navigate("/elderly/dashboard")
                }
            > Back to Dashboard
             </button>
            </form>

        </div>
    );
}

export default HealthInformation;