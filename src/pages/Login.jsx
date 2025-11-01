import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export const Login = (props) => {
    const [form, setForm] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const [buttonText, setButtonText] = useState("Login");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError("");
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (form.email === "" || form.password === "") {
            setError("Please fill in all fields.");
            return;
        }
        setButtonText(prevText => "Logging you in...");
        
        setTimeout(() => {
            navigate("/get-started");
            props.setIsLoggedIn(true);
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userEmail', form.email);
        },2000);
        
        
    };

    return (
        <main className="about-main">
            <div className="body-container">
                <h1>Login to Quizathon</h1>
                <p>Access your account and start your quiz journey!</p>
                {error && <p style={{ color: "#ff6f61", fontWeight: "bold" }}>{error}</p>}
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "18px", maxWidth: "350px", margin: "0 auto" }}>
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        style={{
                            padding: "12px",
                            borderRadius: "6px",
                            border: "1px solid #ffd700",
                            background: "rgba(30,32,40,0.35)",
                            color: "#fff",
                            fontSize: "1rem"
                        }}
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={form.password}
                        onChange={handleChange}
                        required
                        style={{
                            padding: "12px",
                            borderRadius: "6px",
                            border: "1px solid #ffd700",
                            background: "rgba(30,32,40,0.35)",
                            color: "#fff",
                            fontSize: "1rem"
                        }}
                    />
                    <button type="submit" style={{
                        background: "linear-gradient(90deg, #4e54c8 0%, #8f94fb 100%)",
                        color: "#fff",
                        border: "none",
                        borderRadius: "6px",
                        padding: "12px",
                        fontSize: "1.1rem",
                        fontWeight: "600",
                        cursor: "pointer"
                    }}>
                        {buttonText}
                    </button>
                </form>
                <p style={{ marginTop: "18px", color: "#ffd700" }}>
                    Don't have an account? <a href="/register" style={{ color: "#ffd700", textDecoration: "underline" }}>Register here</a>
                </p>
            </div>
        </main>
    );
};