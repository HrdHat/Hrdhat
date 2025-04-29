import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "../styles/auth.css";
import { getSignUpErrorMessage } from "../utils/authErrorMessages";
import GoogleIcon from "../assets/icons8-google.svg";
import AppleIcon from "../assets/apple-14.svg";

interface SignUpPageProps {
  sidebarMode?: boolean;
}

const SignUpPage: React.FC<SignUpPageProps> = ({ sidebarMode }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      await signUp(email, password, { full_name: fullName });
      navigate("/");
    } catch (err) {
      if (err instanceof Error) {
        console.error("Signup error:", err);
        setError(getSignUpErrorMessage(err));
      } else {
        console.error("Signup error (unknown):", err);
        setError("An error occurred during sign up");
      }
    } finally {
      setLoading(false);
    }
  };

  const formContent = (
    <>
      <h1>Create Account</h1>
      <p className="auth-subtitle">Sign up to get started</p>

      {error && <div className="auth-error">{error}</div>}

      <form onSubmit={handleSubmit} className="auth-form">
        <div
          className={`form-group floating-label${
            fullName ? " has-content" : ""
          }`}
        >
          <input
            id="fullName"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            autoComplete="name"
          />
          <label htmlFor="fullName">Full Name</label>
        </div>

        <div
          className={`form-group floating-label${email ? " has-content" : ""}`}
        >
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="username"
          />
          <label htmlFor="email">Email</label>
        </div>

        <div
          className={`form-group floating-label${
            password ? " has-content" : ""
          }`}
        >
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="new-password"
          />
          <label htmlFor="password">Password</label>
        </div>

        <div
          className={`form-group floating-label${
            confirmPassword ? " has-content" : ""
          }`}
        >
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            autoComplete="new-password"
          />
          <label htmlFor="confirmPassword">Confirm Password</label>
        </div>

        <button type="submit" className="auth-button" disabled={loading}>
          {loading ? "Creating account..." : "Create Account"}
        </button>
      </form>

      <div className="auth-divider">
        <span>or</span>
      </div>

      <div className="social-login">
        <button className="social-button google">
          <img src={GoogleIcon} alt="Google" className="auth-icon" />
          Continue with Google
        </button>
        <button className="social-button apple">
          <img src={AppleIcon} alt="Apple" className="auth-icon" />
          Continue with Apple
        </button>
      </div>

      <p className="auth-footer">
        Already have an account?{" "}
        <Link to="/login" className="auth-link">
          Sign in
        </Link>
      </p>
    </>
  );

  if (sidebarMode) {
    return <div className="auth-sidebar-form">{formContent}</div>;
  }

  return (
    <div className="auth-container">
      <div className="auth-card">{formContent}</div>
    </div>
  );
};

export default SignUpPage;
