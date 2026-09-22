import { useState } from "react";
import { loginUser } from "../services/userService";
import { useNavigate } from "react-router-dom";

function Login() {

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
    e.preventDefault();

    try {

        const result = await loginUser(formData);

        console.log("Login successful:", result);

        localStorage.setItem(
        "mycaretaker_user",
        JSON.stringify(result)
        );

alert("Login successful!");

if (result.role.roleName === "ELDERLY_PERSON") {
    navigate("/elderly/dashboard");
} 
else if (result.role.roleName === "FAMILY_MEMBER") {
    navigate("/family/dashboard");
} 
else if (result.role.roleName === "CARETAKER") {
    navigate("/caretaker/dashboard");
}

    } catch (error) {

        console.error("Login failed:", error);

        alert("Login failed: " + error.message);
    }
};

    return (
        <div>

            <h1>MyCaretaker Login</h1>

            <form onSubmit={handleSubmit}>

                <div>
                    <label>Email</label>

                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
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
                        required
                    />
                </div>

                <br />

                <button type="submit">
                    Login
                </button>

            </form>

        </div>
    );
}

export default Login;