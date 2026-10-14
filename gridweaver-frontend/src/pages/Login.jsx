import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../service/api";
import "./Login.css";

function Login() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));

        // Remove old error when user starts typing again
        if (error) {
            setError("");
        }
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");

        const email = formData.email.trim();
        const password = formData.password;

        if (!email || !password) {
            setError("Please enter email and password.");
            return;
        }

        try {

            setLoading(true);

            console.log("================================");
            console.log("GRIDWEAVER LOGIN");
            console.log("================================");
            console.log("Email:", email);
            console.log("Password entered:", password ? "YES" : "NO");

            const response = await api.post(
                "/auth/login",
                {
                    email: email,
                    password: password
                }
            );

            console.log("Login status:", response.status);
            console.log("Login response:", response.data);

            /*
             * Supports these backend responses:
             *
             * 1.
             * {
             *   token: "...",
             *   id: 1,
             *   name: "...",
             *   email: "..."
             * }
             *
             * 2.
             * {
             *   token: "...",
             *   user: {...}
             * }
             *
             * 3.
             * {
             *   data: {
             *      token: "...",
             *      user: {...}
             *   }
             * }
             */

            const data = response.data || {};

            const token =
                data.token ||
                data.data?.token ||
                data.accessToken ||
                data.data?.accessToken;

            const user =
                data.user ||
                data.data?.user ||
                {
                    id: data.id || data.data?.id,
                    name: data.name || data.data?.name,
                    email: data.email || data.data?.email
                };

            if (!token) {

                console.error(
                    "Token not found in backend response:",
                    response.data
                );

                setError(
                    "Login response received, but JWT token was not returned."
                );

                return;
            }

            // Remove old authentication data
            localStorage.removeItem("token");
            localStorage.removeItem("user");

            // Save new JWT
            localStorage.setItem("token", token);

            // Save user
            if (user && (user.email || user.name || user.id)) {
                localStorage.setItem(
                    "user",
                    JSON.stringify(user)
                );
            }

            console.log("JWT token saved successfully.");
            console.log(
                "Token exists:",
                !!localStorage.getItem("token")
            );

            console.log("User:", user);

            console.log("Redirecting to dashboard...");

            navigate("/dashboard", {
                replace: true
            });

        } catch (err) {

            // console.error("================================");
            // console.error("LOGIN FAILED");
            // console.error("================================");

            // console.error("Error:", err);

            console.error(
                "HTTP status:",
                err.response?.status
            );

            // console.error(
            //     "Backend response:",
            //     err.response?.data
            // );

            if (err.response?.status === 401) {

                setError(
                    "Invalid email or password."
                );

            } else if (err.response?.status === 403) {

                setError(
                    "Access denied. Please check backend security configuration."
                );

            } else if (err.response?.status === 400) {

                setError(
                    err.response?.data?.message ||
                    "Invalid login request."
                );

            } else if (err.response?.status === 404) {

                setError(
                    "Login API not found. Check the backend URL."
                );

            } else if (!err.response) {

                setError(
                    "Unable to connect to GridWeaver backend."
                );

            } else {

                setError(
                    err.response?.data?.message ||
                    "Login failed. Please try again."
                );
            }

        } finally {

            setLoading(false);

        }
    };

    return (
        <div className="auth-page">

            <div className="grid-background"></div>

            <div className="energy-circle circle-one"></div>
            <div className="energy-circle circle-two"></div>

            <div className="auth-container">

                {/* LEFT SIDE */}

                <div className="auth-info">

                    <div className="brand">

                        <div className="brand-icon">
                            ⚡
                        </div>

                        <div>
                            <h1>GridWeaver</h1>
                            <span>SMART MICROGRID</span>
                        </div>

                    </div>

                    <div className="hero-content">

                        <div className="status">

                            <span className="status-dot"></span>

                            SYSTEM ONLINE

                        </div>

                        <h2>
                            Powering the
                            <span> Future of Energy</span>
                        </h2>

                        <p>
                            Monitor, analyze and control your
                            decentralized microgrid infrastructure
                            in real time.
                        </p>

                        <div className="features">

                            <div className="feature">

                                <span>◉</span>

                                <div>
                                    <strong>
                                        Real-time Monitoring
                                    </strong>

                                    <small>
                                        Monitor thousands of IoT nodes
                                    </small>
                                </div>

                            </div>

                            <div className="feature">

                                <span>⚡</span>

                                <div>
                                    <strong>
                                        Smart Energy Flow
                                    </strong>

                                    <small>
                                        Intelligent power distribution
                                    </small>
                                </div>

                            </div>

                            <div className="feature">

                                <span>◆</span>

                                <div>
                                    <strong>
                                        Grid Intelligence
                                    </strong>

                                    <small>
                                        Advanced microgrid analytics
                                    </small>
                                </div>

                            </div>

                        </div>

                    </div>

                </div>

                {/* RIGHT SIDE */}

                <div className="auth-card">

                    <div className="mobile-brand">

                        <div className="brand-icon">
                            ⚡
                        </div>

                        <h1>
                            GridWeaver
                        </h1>

                    </div>

                    <div className="card-header">

                        <div className="login-icon">
                            🔐
                        </div>

                        <h2>
                            Welcome Back
                        </h2>

                        <p>
                            Sign in to access your microgrid dashboard
                        </p>

                    </div>

                    {error && (

                        <div className="error-message">
                            ⚠ {error}
                        </div>

                    )}

                    <form onSubmit={handleSubmit}>

                        <div className="input-group">

                            <label>
                                Email Address
                            </label>

                            <div className="input-wrapper">

                                <span>
                                    ✉
                                </span>

                                <input
                                    type="email"
                                    name="email"
                                    placeholder="admin@gridweaver.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    autoComplete="email"
                                    disabled={loading}
                                />

                            </div>

                        </div>

                        <div className="input-group">

                            <label>
                                Password
                            </label>

                            <div className="input-wrapper">

                                <span>
                                    🔒
                                </span>

                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Enter your password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    autoComplete="current-password"
                                    disabled={loading}
                                />

                            </div>

                        </div>

                        <div className="form-options">

                            <label className="remember">

                                <input
                                    type="checkbox"
                                    disabled={loading}
                                />

                                <span>
                                    Remember me
                                </span>

                            </label>

                            <button
                                type="button"
                                className="forgot"
                            >
                                Forgot password?
                            </button>

                        </div>

                        <button
                            type="submit"
                            className="login-button"
                            disabled={loading}
                        >

                            {loading ? (
                                <>
                                    <span className="spinner"></span>
                                    Signing in...
                                </>
                            ) : (
                                <>
                                    Sign In
                                    <span>→</span>
                                </>
                            )}

                        </button>

                    </form>

                    <div className="divider">
                        <span>OR</span>
                    </div>

                    <p className="register-text">

                        Don't have an account?{" "}

                        <Link to="/register">
                            Create Account
                        </Link>

                    </p>

                    <div className="security-note">
                        🔒 Secure authentication • JWT protected
                    </div>

                </div>

            </div>

            <div className="copyright">
                © 2026 GridWeaver • Microgrid Infrastructure Platform
            </div>

        </div>
    );
}

export default Login;