import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="home-page">
      <h1>Welcome to HRDHat</h1>
      <p>Start your daily FLRA checklist below.</p>

      <Link to="/flra" className="start-flra-button">
        📝 Start New FLRA
      </Link>
    </div>
  );
};

export default HomePage;
