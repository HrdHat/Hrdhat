import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "../styles/auth.css";
import { getSignUpErrorMessage } from "../utils/authErrorMessages";

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
      await signUp(email, password, fullName);
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
        <div className="form-group">
          <label htmlFor="fullName">Full Name</label>
          <input
            id="fullName"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            placeholder="Enter your full name"
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Enter your email"
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Create a password"
          />
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            placeholder="Confirm your password"
          />
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
          <img src="/google-icon.svg" alt="Google" />
          Continue with Google
        </button>
        <button className="social-button github">
          <img src="/github-icon.svg" alt="GitHub" />
          Continue with GitHub
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
