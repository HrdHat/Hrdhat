import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "../styles/auth.css";
import { getLoginErrorMessage } from "../utils/authErrorMessages";
import GoogleIcon from "../assets/icons8-google.svg";
import AppleIcon from "../assets/apple-14.svg";

interface LoginPageProps {
  sidebarMode?: boolean;
}

const LoginPage: React.FC<LoginPageProps> = ({ sidebarMode }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { signIn, signInWithGoogle, signInWithApple } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await signIn(email, password);
      navigate("/");
    } catch (err) {
      if (err instanceof Error) {
        console.error("Login error:", err);
        setError(getLoginErrorMessage(err));
      } else {
        console.error("Login error (unknown):", err);
        setError("An error occurred during sign in");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setError("");
      setLoading(true);
      await signInWithGoogle();
      navigate("/");
    } catch (err) {
      setError("Failed to sign in with Google");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAppleSignIn = async () => {
    try {
      setError("");
      setLoading(true);
      await signInWithApple();
      navigate("/");
    } catch (err) {
      setError("Failed to sign in with Apple");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formContent = (
    <>
      <h1>Welcome Back</h1>
      <p className="auth-subtitle">Sign in to your account</p>

      {error && <div className="auth-error">{error}</div>}

      <form onSubmit={handleSubmit} className="auth-form">
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
            autoComplete="current-password"
          />
          <label htmlFor="password">Password</label>
        </div>

        <button type="submit" className="auth-button" disabled={loading}>
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>

      <div className="auth-divider">
        <span>or</span>
      </div>

      <div className="social-login">
        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="social-button google"
        >
          <img src={GoogleIcon} alt="Google" className="auth-icon" />
          Continue with Google
        </button>
        <button
          onClick={handleAppleSignIn}
          disabled={loading}
          className="social-button apple"
        >
          <img src={AppleIcon} alt="Apple" className="auth-icon" />
          Continue with Apple
        </button>
      </div>

      <p className="auth-footer">
        Don't have an account?{" "}
        <Link to="/signup" className="auth-link">
          Sign up
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

export default LoginPage;
