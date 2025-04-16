import React, { useState, useEffect } from "react";
import { GeneralInfoData } from "../types/generalInfo";
import { generalInfoFields } from "../data/formschema";
import "../styles/modules.css";
import { FLRASessionManager } from "../utils/flrasessionmanager";
import { ViewMode } from "../types/viewmode";

interface Props {
  view: ViewMode;
  draftId: string;
}

const GeneralInformation: React.FC<Props> = ({ view, draftId }) => {
  const [formData, setFormData] = useState<GeneralInfoData>(() => {
    const draft = FLRASessionManager.loadDraft(draftId);
    return (
      draft?.data?.generalInfo ||
      generalInfoFields.reduce((acc, field) => {
        acc[field.name as keyof GeneralInfoData] = "";
        return acc;
      }, {} as GeneralInfoData)
    );
  });

  useEffect(() => {
    const draft = FLRASessionManager.loadDraft(draftId);
    if (draft) {
      draft.data.generalInfo = formData;
      FLRASessionManager.saveDraft(draftId, draft);
    }
  }, [formData, draftId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const [fieldIndex, setFieldIndex] = useState(0);

  if (view === "guided") {
    const currentField = generalInfoFields[fieldIndex];

    const handleNext = () => {
      if (fieldIndex < generalInfoFields.length - 1) {
        setFieldIndex((prev) => prev + 1);
      }
    };

    const handleBack = () => {
      if (fieldIndex > 0) {
        setFieldIndex((prev) => prev - 1);
      }
    };

    const handleNextModule = () => {
      console.log("TODO: Move to next module");
    };

    return (
      <section className="module-box zoomed-view">
        <div className="zoomed-field">
          <label htmlFor={currentField.name}>{currentField.label}</label>
          <input
            type={currentField.type}
            id={currentField.name}
            name={currentField.name}
            value={(formData as any)[currentField.name]}
            onChange={handleChange}
            autoFocus
            required
          />
        </div>

        <div className="zoomed-nav">
          {fieldIndex > 0 && <button onClick={handleBack}>← Back</button>}
          {fieldIndex < generalInfoFields.length - 1 ? (
            <button onClick={handleNext}>Next →</button>
          ) : (
            <button onClick={handleNextModule}>Next Module →</button>
          )}
        </div>
      </section>
    );
  }

  if (view === "quickfill") {
    return (
      <section className={`module-box ${view}-view`}>
        <div className="module-content">
          <span className="module-label">General Information</span>
          <div className="two-column-form">
            {generalInfoFields.map((field) => (
              <div className="field-row" key={field.name}>
                <label htmlFor={field.name}>{field.label}</label>
                <input
                  type={field.type}
                  id={field.name}
                  name={field.name}
                  value={(formData as any)[field.name]}
                  onChange={handleChange}
                  required
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (view === "printview") {
    return (
      <section className="module-box print-view">
        <span className="module-label">General Information</span>
        <div className="print-columns">
          {generalInfoFields.map((field) => (
            <div className="field-row" key={field.name}>
              <label htmlFor={field.name}>{field.label}</label>
              <input
                type={field.type}
                id={field.name}
                name={field.name}
                value={(formData as any)[field.name]}
                readOnly
              />
            </div>
          ))}
        </div>
      </section>
    );
  }

  return null;
};

export default GeneralInformation;
