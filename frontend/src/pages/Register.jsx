import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../service/api";
import "./Register.css";

function Register() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");
        setSuccess("");

        if (
            !formData.name ||
            !formData.email ||
            !formData.password ||
            !formData.confirmPassword
        ) {
            setError("Please fill all fields.");
            return;
        }

        if (formData.password.length < 6) {
            setError("Password must contain at least 6 characters.");
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {

            setLoading(true);

            const response = await api.post("/auth/register", {
                name: formData.name,
                email: formData.email,
                password: formData.password
            });

            console.log("Register response:", response.data);

            setSuccess(
                "Account created successfully. Redirecting to login..."
            );

            setTimeout(() => {
                navigate("/login");
            }, 1500);

        } catch (error) {

            console.error("Register error:", error);

            setError(
                error.response?.data?.message ||
                "Registration failed. Please try again."
            );

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-page">

            <div className="register-grid"></div>

            <div className="register-glow glow-one"></div>
            <div className="register-glow glow-two"></div>

            <div className="register-wrapper">

                {/* LEFT */}

                <div className="register-info">

                    <div className="register-brand">

                        <div className="register-brand-icon">
                            ⚡
                        </div>

                        <div>
                            <h1>GridWeaver</h1>
                            <span>SMART MICROGRID</span>
                        </div>

                    </div>

                    <div className="register-hero">

                        <div className="register-label">
                            JOIN THE GRID
                        </div>

                        <h2>
                            Build a
                            <span> Smarter Energy Future.</span>
                        </h2>

                        <p>
                            Create your GridWeaver account and get
                            access to real-time microgrid monitoring,
                            analytics and intelligent energy management.
                        </p>

                        <div className="stats">

                            <div>
                                <strong>50K+</strong>
                                <small>IoT Nodes</small>
                            </div>

                            <div>
                                <strong>99.9%</strong>
                                <small>Grid Uptime</small>
                            </div>

                            <div>
                                <strong>&lt;1s</strong>
                                <small>Live Updates</small>
                            </div>

                        </div>

                    </div>

                </div>

                {/* REGISTER CARD */}

                <div className="register-card">

                    <div className="register-card-header">

                        <div className="signup-icon">
                            ✦
                        </div>

                        <h2>Create Account</h2>

                        <p>
                            Start monitoring your microgrid today
                        </p>

                    </div>

                    {error && (
                        <div className="register-error">
                            ⚠ {error}
                        </div>
                    )}

                    {success && (
                        <div className="register-success">
                            ✓ {success}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>

                        <div className="register-input">

                            <label>Full Name</label>

                            <input
                                type="text"
                                name="name"
                                placeholder="Enter your full name"
                                value={formData.name}
                                onChange={handleChange}
                            />

                        </div>

                        <div className="register-input">

                            <label>Email Address</label>

                            <input
                                type="email"
                                name="email"
                                placeholder="admin@gridweaver.com"
                                value={formData.email}
                                onChange={handleChange}
                            />

                        </div>

                        <div className="register-input">

                            <label>Password</label>

                            <input
                                type="password"
                                name="password"
                                placeholder="Minimum 6 characters"
                                value={formData.password}
                                onChange={handleChange}
                            />

                        </div>

                        <div className="register-input">

                            <label>Confirm Password</label>

                            <input
                                type="password"
                                name="confirmPassword"
                                placeholder="Confirm your password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                            />

                        </div>

                        <label className="terms">

                            <input type="checkbox" required />

                            <span>
                                I agree to the GridWeaver
                                <a href="#terms"> Terms & Conditions</a>
                            </span>

                        </label>

                        <button
                            className="register-button"
                            type="submit"
                            disabled={loading}
                        >

                            {loading
                                ? "Creating Account..."
                                : "Create Account →"
                            }

                        </button>

                    </form>

                    <div className="already">

                        Already have an account?

                        <Link to="/login">
                            Sign In
                        </Link>

                    </div>

                    <div className="register-security">
                        🔒 Your account is protected with secure JWT authentication
                    </div>

                </div>

            </div>

        </div>
    );
}

export default Register;