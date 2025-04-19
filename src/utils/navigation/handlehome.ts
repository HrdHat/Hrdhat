export const handleHome = ({
  activePanel,
  setActivePanel,
  setSidebarVisible,
  navigate,
}: {
  activePanel: "create" | "activeForms" | null;
  setActivePanel: (p: "create" | "activeForms" | null) => void;
  setSidebarVisible: (b: boolean) => void;
  navigate: (path: string) => void;
}) => {
  if (activePanel === "create") {
    const confirmClose = window.confirm(
      "Are you sure you want to close this form?\n\nIt has been saved under Active Forms."
    );
    if (!confirmClose) return;
  }

  setActivePanel(null);
  setSidebarVisible(true);
  navigate("/");
};
