import React from "react";
import { Link, useLocation } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import SignUpPage from "../pages/SignUpPage";
import "../styles/loggedoutappshell.css";
import Logo from "../assets/logo/HRDHAT LOGO & ICONT XL.svg";

interface LoggedOutAppShellProps {
  children?: React.ReactNode;
}

const LoggedOutAppShell: React.FC<LoggedOutAppShellProps> = () => {
  const location = useLocation();

  let sidebarContent;
  if (location.pathname === "/login") {
    sidebarContent = <LoginPage sidebarMode />;
  } else if (location.pathname === "/signup") {
    sidebarContent = <SignUpPage sidebarMode />;
  } else {
    sidebarContent = (
      <>
        <Link to="/" className="logo">
          <img src="/logo.svg" alt="HRDHAT" />
        </Link>
        <nav className="sidebar-nav">
          <Link to="/login" className="nav-link">
            Sign In
          </Link>
          <Link to="/signup" className="nav-link primary">
            Sign Up
          </Link>
        </nav>
      </>
    );
  }

  return (
    <div className="logged-out-layout">
      <div className="nav-region">
        <div className="sidebar">
          <div className="sidebar-content">{sidebarContent}</div>
        </div>
      </div>
      <div className="content-region">
        <main className="logged-out-main">
          <div className="welcome-message">
            <img src={Logo} alt="HRDHAT" className="welcome-logo" />
            <p>Sign in or create an account to start your FLRA.</p>
          </div>
        </main>
        <footer className="logged-out-footer">
          <div className="footer-content">
            <p>© {new Date().getFullYear()} HRDHAT. All rights reserved.</p>
            <div className="footer-links">
              <Link to="/privacy">Privacy Policy</Link>
              <Link to="/terms">Terms of Service</Link>
              <Link to="/contact">Contact Us</Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default LoggedOutAppShell;
