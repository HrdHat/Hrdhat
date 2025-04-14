import React, { useState, useEffect } from "react";
import { GeneralInfoData } from "../../types/generalInfo";
import "../modules/modules.css";

interface Props {
  view: "zoomed" | "mid" | "full";
}

const GeneralInformation: React.FC<Props> = ({ view }) => {
  const [formData, setFormData] = useState<GeneralInfoData>(() => {
    const saved = localStorage.getItem("generalInfo");
    return saved
      ? JSON.parse(saved)
      : {
          projectName: "",
          taskLocation: "",
          supervisorName: "",
          supervisorContact: "",
          todaysDate: "",
          crewMembers: "",
          todaysTask: "",
          startTime: "",
          endTime: "",
        };
  });

  useEffect(() => {
    localStorage.setItem("generalInfo", JSON.stringify(formData));
  }, [formData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const [fieldIndex, setFieldIndex] = useState(0); // ✅ move this here

  if (view === "zoomed") {
    const fields = [
      { name: "projectName", label: "Project Name", type: "text" },
      { name: "taskLocation", label: "Task Location", type: "text" },
      { name: "supervisorName", label: "Supervisor's Name", type: "text" },
      {
        name: "supervisorContact",
        label: "Supervisor's Contact #",
        type: "text",
      },
      { name: "todaysDate", label: "Today's Date", type: "date" },
      { name: "crewMembers", label: "# of Crew Members", type: "text" },
      { name: "todaysTask", label: "Today's Task", type: "text" },
      { name: "startTime", label: "Start Time", type: "time" },
      { name: "endTime", label: "End Time", type: "time" },
    ];

    const currentField = fields[fieldIndex];

    const handleNext = () => {
      if (fieldIndex < fields.length - 1) {
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
      // Later this will update a shared form step state
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
          {fieldIndex < fields.length - 1 ? (
            <button onClick={handleNext}>Next →</button>
          ) : (
            <button onClick={handleNextModule}>Next Module →</button>
          )}
        </div>
      </section>
    );
  }

  if (view === "mid") {
    return (
      <section className={`module-box ${view}-view`}>
        <div className="module-content">
          <span className="module-label">General Information</span>
          <div className="two-column-form">
            {[
              {
                id: "project-name",
                name: "projectName",
                label: "Project Name",
                type: "text",
              },
              {
                id: "task-location",
                name: "taskLocation",
                label: "Task Location",
                type: "text",
              },
              {
                id: "supervisor-name",
                name: "supervisorName",
                label: "Supervisor's Name",
                type: "text",
              },
              {
                id: "supervisor-contact",
                name: "supervisorContact",
                label: "Supervisor's Contact #",
                type: "text",
              },
              {
                id: "todays-date",
                name: "todaysDate",
                label: "Today's Date",
                type: "date",
              },
              {
                id: "crew-members",
                name: "crewMembers",
                label: "# of Crew Members",
                type: "text",
              },
              {
                id: "todays-task",
                name: "todaysTask",
                label: "Today's Task",
                type: "text",
              },
              {
                id: "start-time",
                name: "startTime",
                label: "Start Time",
                type: "time",
              },
              {
                id: "end-time",
                name: "endTime",
                label: "End Time",
                type: "time",
              },
            ].map((field) => (
              <div className="field-row" key={field.id}>
                <label htmlFor={field.id}>{field.label}</label>
                <input
                  type={field.type}
                  id={field.id}
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

  if (view === "full") {
    return (
      <section className="module-box print-view">
        <span className="module-label">General Information</span>
        <div className="print-columns">
          {/* Same inputs as mid, but styled for print */}
        </div>
      </section>
    );
  }

  return null;
};

export default GeneralInformation;
