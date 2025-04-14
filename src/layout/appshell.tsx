import { ReactNode } from "react";
import { Link } from "react-router-dom";

type AppShellProps = {
  children: ReactNode;
};

const AppShell = ({ children }: AppShellProps) => {
  return (
    <div className="app-shell">
      <header className="app-header"></header>
      <main className="app-content">{children}</main>
    </div>
  );
};

export default AppShell;
