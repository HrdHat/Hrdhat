import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "../styles/auth.css";
import { getLoginErrorMessage } from "../utils/authErrorMessages";

interface LoginPageProps {
  sidebarMode?: boolean;
}

const LoginPage: React.FC<LoginPageProps> = ({ sidebarMode }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
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

  const formContent = (
    <>
      <h1>Welcome Back</h1>
      <p className="auth-subtitle">Sign in to your account</p>

      {error && <div className="auth-error">{error}</div>}

      <form onSubmit={handleSubmit} className="auth-form">
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
            placeholder="Enter your password"
          />
        </div>

        <button type="submit" className="auth-button" disabled={loading}>
          {loading ? "Signing in..." : "Sign In"}
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
