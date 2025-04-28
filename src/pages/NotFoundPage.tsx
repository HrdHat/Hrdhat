import React from "react";
import { Link } from "react-router-dom";
import "../styles/notfound.css";

const NotFoundPage: React.FC = () => {
  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <h1>404</h1>
        <h2>Page Not Found</h2>
        <p>
          Sorry, the page you're looking for doesn't exist or has been moved.
        </p>
        <div className="not-found-actions">
          <Link to="/" className="not-found-button primary">
            Go Home
          </Link>
          <button
            className="not-found-button secondary"
            onClick={() => window.history.back()}
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
