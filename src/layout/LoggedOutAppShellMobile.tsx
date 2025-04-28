import React, { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import SignUpPage from "../pages/SignUpPage";
import "../styles/loggedoutappshell.css";

const LoggedOutAppShellMobile: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  let sidebarContent;
  if (location.pathname === "/login") {
    sidebarContent = <LoginPage sidebarMode />;
  } else if (location.pathname === "/signup") {
    sidebarContent = <SignUpPage sidebarMode />;
  } else {
    sidebarContent = (
      <>
        <Link to="/" className="logo" onClick={() => setIsMenuOpen(false)}>
          <img src="/logo.svg" alt="HRDHAT" />
        </Link>
        <nav className="sidebar-nav">
          <Link
            to="/login"
            className="nav-link"
            onClick={() => setIsMenuOpen(false)}
          >
            Sign In
          </Link>
          <Link
            to="/signup"
            className="nav-link primary"
            onClick={() => setIsMenuOpen(false)}
          >
            Sign Up
          </Link>
        </nav>
      </>
    );
  }

  return (
    <div className="logged-out-layout">
      <div className="nav-region">
        <div className={`sidebar ${isMenuOpen ? "visible" : ""}`}>
          <div className="sidebar-content">{sidebarContent}</div>
        </div>
      </div>

      <div className="content-region">
        <button
          className="sidebar-toggle-left"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          ☰ Menu
        </button>

        <main className="logged-out-main">
          <div className="welcome-message">
            Welcome to HRDHAT.
            <br />
            <span style={{ color: "#2cb75c", fontWeight: 600 }}>
              Sign in{" "}
              <span style={{ fontSize: "2rem", verticalAlign: "middle" }}>
                ←
              </span>{" "}
              in the Sidebar.
            </span>
          </div>
        </main>

        <footer className="logged-out-footer">
          <div className="footer-content">
            <p>
              &copy; {new Date().getFullYear()} HRDHAT. All rights reserved.
            </p>
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

export default LoggedOutAppShellMobile;
