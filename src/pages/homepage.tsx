import React from "react";
import "../styles/layout.css"; // 👈 contains your grid background styling

const HomePage = () => {
  React.useEffect(() => {
    console.log("[HomePage] Loaded");
  }, []);
  return (
    <div className="homepage">
      <h1>Homepage Heading</h1>
    </div>
  );
};

export default HomePage;
