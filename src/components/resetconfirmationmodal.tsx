// ResetConfirmationModal.tsx
import React from "react";
import "./modal.css"; // Adjust the path as necessary

// Define the expected props for our modal
interface ResetConfirmationModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const ResetConfirmationModal: React.FC<ResetConfirmationModalProps> = ({
  isOpen,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null; // Do not render modal if it's not open

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Confirm Reset</h2>
        <p>
          Are you sure you want to reset the form? This will clear all your
          inputs.
        </p>
        <div className="modal-actions">
          <button onClick={onConfirm}>Yes, Reset</button>
          <button onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default ResetConfirmationModal;
