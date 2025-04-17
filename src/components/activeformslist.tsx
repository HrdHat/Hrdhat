import React, { useState } from "react";
import { FLRASessionManager, FLRADraft } from "../utils/flrasessionmanager";
import "../styles/activeformscontent.css";

interface ActiveFormsContentProps {
  onResume: (id: string) => void;
  onClose: () => void;
}

const ActiveFormsContent: React.FC<ActiveFormsContentProps> = ({
  onResume,
  onClose,
}) => {
  const [drafts, setDrafts] = useState<FLRADraft[]>(
    FLRASessionManager.listDrafts()
  );

  const handleResume = (id: string) => {
    onResume(id);
    onClose();
  };

  const handleDelete = (id: string) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this form?"
    );
    if (confirm) {
      FLRASessionManager.deleteDraft(id);
      setDrafts(FLRASessionManager.listDrafts()); // ✅ Refresh list locally
    }
  };

  return (
    <div className="active-forms-content">
      {drafts.length === 0 ? (
        <p className="no-drafts-msg">No active forms found.</p>
      ) : (
        drafts.map((draft) => (
          <div key={draft.id} className="draft-card">
            <div className="draft-info">
              <strong>{draft.title || "Untitled Form"}</strong>
              <small>{new Date(draft.updatedAt).toLocaleString()}</small>
            </div>
            <div className="draft-actions">
              <button onClick={() => handleResume(draft.id)}>Resume</button>
              <button
                onClick={() => handleDelete(draft.id)}
                className="delete-btn"
              >
                ✕
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ActiveFormsContent;
