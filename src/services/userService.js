const API_URL = "http://localhost:8080/api";

export const registerUser = async (userData) => {

    const response = await fetch(
        `${API_URL}/users/register?role=${userData.role}`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                firstName: userData.firstName,
                lastName: userData.lastName,
                email: userData.email,
                password: userData.password,
                phone: userData.phone,
                address: userData.address
            })
        }
    );

    if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage);
    }

    return await response.json();
};


export const loginUser = async (loginData) => {

    const response = await fetch(
        `${API_URL}/auth/login`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: loginData.email,
                password: loginData.password
            })
        }
    );

    if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage);
    }

    return await response.json();
};

export const saveHealthInformation = async (elderlyId, healthData) => {

    const response = await fetch(
        `http://localhost:8080/api/health-information/elderly/${elderlyId}`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(healthData)
        }
    );

    if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage);
    }

    return await response.json();
};