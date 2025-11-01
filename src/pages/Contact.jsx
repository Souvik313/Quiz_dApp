import React, { useState } from "react";

export const Contact = () => {
    const [form, setForm] = useState({ name: "", email: "", message: "" });
    const [submitted, setSubmitted] = useState(false);
    const [header, setHeader] = useState("Have a question? Any suggestions in mind? Fill out the contacct form and let us know!!");
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
        setHeader("Form submitted successfully!");
        // Here you can add logic to send the form data to your backend or email service
    };

    return (
        <main className="about-main">
            <div className="body-container transparent-bg">
                <h1>Contact Us</h1>
                <p>
                    {header}
                </p>
                {submitted ? (
                    <p style={{ color: "#ffd700", fontWeight: "bold" }}>
                        Thank you for reaching out! We'll respond as soon as possible.
                    </p>
                ) : (
                    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "18px", maxWidth: "400px", margin: "0 auto" }}>
                        <input
                            type="text"
                            name="name"
                            placeholder="Your Name"
                            value={form.name}
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
                            type="email"
                            name="email"
                            placeholder="Your Email"
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
                        <textarea
                            name="message"
                            placeholder="Your Message"
                            value={form.message}
                            onChange={handleChange}
                            required
                            rows={5}
                            style={{
                                padding: "12px",
                                borderRadius: "6px",
                                border: "1px solid #ffd700",
                                background: "rgba(30,32,40,0.35)",
                                color: "#fff",
                                fontSize: "1rem",
                                resize: "vertical"
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
                            Send Message
                        </button>
                    </form>
                )}
                <p style={{ marginTop: "24px", fontSize: "1rem", color: "#ffd700" }}>
                    Or email us directly at <a href="mailto:roysouvik8220@gmail.com" style={{ color: "#ffd700", textDecoration: "underline" }}>roysouvik8220@gmail.com</a>
                </p>
            </div>
        </main>
    );
};