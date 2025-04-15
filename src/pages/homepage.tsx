import { Link } from "react-router-dom";
import "../modules/modules.css"; // Make sure the CSS is applied
import SettingIcon from "../assets/settings_24dp_1F1F1F_FILL0_wght400_GRAD0_opsz24.svg";
import NewFormIcon from "../assets/note_add_24dp_1F1F1F_FILL0_wght400_GRAD0_opsz24.svg";
import SavedFormsIcon from "../assets/home_storage_24dp_1F1F1F_FILL0_wght400_GRAD0_opsz24.svg";

const HomePage = () => {
  return (
    <div>
      <div className="home-button-container">
        <Link to="/flra" className="start-flra-button">
          <img src={NewFormIcon} alt="New Form" className="icon" />
          Start new FLRA form
        </Link>
        <Link to="/saved" className="home-button">
          <img src={SavedFormsIcon} alt="New Form" className="icon" />
          View Saved Forms
        </Link>
        <Link to="/settings" className="home-button">
          <img src={SettingIcon} alt="New Form" className="icon" />
          Account Settings
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
