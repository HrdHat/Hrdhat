import React, { useState, useEffect } from "react";
import { archiveService, ArchivedForm } from "../services/archive.service";
import "../styles/archivedformscontent.css";

interface ArchivedFormsListProps {
  onClose: () => void;
}

const ArchivedFormsList: React.FC<ArchivedFormsListProps> = ({ onClose }) => {
  const [forms, setForms] = useState<ArchivedForm[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadArchivedForms();
  }, []);

  const loadArchivedForms = async () => {
    try {
      const archivedForms = await archiveService.getArchive();
      setForms(archivedForms);
    } catch (error) {
      console.error("Error loading archived forms:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    const confirm = window.confirm(
      "Are you sure you want to permanently delete this form from the archive?"
    );
    if (confirm) {
      try {
        await archiveService.deleteFromArchive(id);
        setForms(forms.filter((form) => form.id !== id));
      } catch (error) {
        console.error("Error deleting archived form:", error);
      }
    }
  };

  const handleView = (id: string) => {
    // Placeholder function - to be implemented later
    alert("View functionality coming soon!");
  };

  if (loading) {
    return <div className="loading">Loading archived forms...</div>;
  }

  return (
    <div className="archived-forms-content">
      {forms.length === 0 ? (
        <p className="no-forms-msg">No archived forms found.</p>
      ) : (
        forms.map((form) => (
          <div key={form.id} className="archived-form-card">
            <div className="form-info">
              <strong>{form.title || "Untitled Form"}</strong>
              <div className="form-details">
                <small>
                  Submitted: {new Date(form.submittedAt).toLocaleString()}
                </small>
                <small>Type: {form.submissionType}</small>
              </div>
            </div>
            <div className="form-actions">
              <button
                onClick={() => handleView(form.id)}
                className="view-btn"
                title="View form"
              >
                👁️
              </button>
              <button
                onClick={() => handleDelete(form.id)}
                className="delete-btn"
                title="Delete permanently"
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

export default ArchivedFormsList;
