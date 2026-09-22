import { useState } from "react";
import { registerUser } from "../services/userService";

function Register() {

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        phone: "",
        address: "",
        role: "ELDERLY_PERSON"
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
    e.preventDefault();

    try {

        const result = await registerUser(formData);

        console.log("Registration successful:", result);

        alert("Registration successful!");

    } catch (error) {

        console.error("Registration failed:", error);

        alert("Registration failed: " + error.message);
    }
};

    return (
        <div>

            <h1>MyCaretaker Registration</h1>

            <form onSubmit={handleSubmit}>

                <div>
                    <label>First Name</label>
                    <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                    />
                </div>

                <br />

                <div>
                    <label>Last Name</label>
                    <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                    />
                </div>

                <br />

                <div>
                    <label>Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                </div>

                <br />

                <div>
                    <label>Password</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                    />
                </div>

                <br />

                <div>
                    <label>Phone</label>
                    <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                    />
                </div>

                <br />

                <div>
                    <label>Address</label>
                    <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                    ></textarea>
                </div>

                <br />

                <div>
                    <label>Register As</label>

                    <select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                    >
                        <option value="ELDERLY_PERSON">
                            Elderly Person
                        </option>

                        <option value="FAMILY_MEMBER">
                            Family Member
                        </option>

                        <option value="CARETAKER">
                            Caretaker
                        </option>
                    </select>
                </div>

                <br />

                <button type="submit">
                    Register
                </button>

            </form>

        </div>
    );
}

export default Register;