import { ReactNode } from "react";
import { Link } from "react-router-dom";

type AppShellProps = {
  children: ReactNode;
};

const AppShell = ({ children }: AppShellProps) => {
  return (
    <div className="app-shell">
      <header className="app-header">
        <h1>🛠️ HRDHat</h1>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/flra">FLRA Form</Link>
        </nav>
      </header>
      <main className="app-content">{children}</main>
    </div>
  );
};

export default AppShell;
