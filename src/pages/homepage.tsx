import { Link } from "react-router-dom";
import "../modules/modules.css"; // Make sure the CSS is applied

const HomePage = () => {
  return (
    <div>
      <div className="home-button-container">
        <Link to="/flra" className="start-flra-button">
          📝 Start new FLRA form
        </Link>
        <Link to="/saved" className="home-button">
          📂 View Saved Forms
        </Link>
        <Link to="/settings" className="home-button">
          ⚙️ Account Settings
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
