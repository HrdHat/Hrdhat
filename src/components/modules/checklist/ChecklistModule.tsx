import React, { useEffect, useState } from "react";
import { moduleService } from "../../../services/module.service";
import { ChecklistResponse, ChecklistType } from "../../../types/modules";
import { flraChecklistQuestions } from "../../../data/formschema";
import "./ChecklistModule.css";

interface ChecklistModuleProps {
  formId: string;
  type: ChecklistType;
}

export const ChecklistModule: React.FC<ChecklistModuleProps> = ({
  formId,
  type,
}) => {
  const [loading, setLoading] = useState(true);
  const [checklist, setChecklist] = useState<ChecklistResponse[]>([]);

  useEffect(() => {
    loadChecklistData();
  }, [formId, type]);

  const loadChecklistData = async () => {
    try {
      const responses = await moduleService.getChecklistResponses(formId, type);
      setChecklist(responses);
    } catch (error) {
      console.error("Error loading checklist data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckboxChange = async (
    questionId: string,
    isChecked: boolean
  ) => {
    try {
      const updatedChecklist = checklist.map((response) => {
        if (response.id === questionId) {
          return {
            ...response,
            responses: {
              ...response.responses,
              items: response.responses.items.map((item) =>
                item.id === questionId ? { ...item, isChecked } : item
              ),
            },
          };
        }
        return response;
      });

      setChecklist(updatedChecklist);

      // Save to service
      await moduleService.saveChecklistResponses({
        form_id: formId,
        checklist_type: type,
        responses: {
          items:
            updatedChecklist.length > 0
              ? updatedChecklist[0].responses.items
              : [{ id: questionId, isChecked }],
          completedAt: new Date().toISOString(),
        },
      });
    } catch (error) {
      console.error("Error saving checklist response:", error);
    }
  };

  if (loading) {
    return <div className="checklist-loading">Loading checklist...</div>;
  }

  return (
    <div className="module-box">
      <span className="module-label">
        {type === "pre_job"
          ? "Pre-Job Checklist"
          : type === "ppe"
          ? "PPE Checklist"
          : "Platform Inspection Checklist"}
      </span>
      <div className="checklist-grid">
        {flraChecklistQuestions.map((question, index) => (
          <label key={index} className="check-item">
            <input
              type="checkbox"
              checked={checklist[0]?.responses.items[index]?.isChecked || false}
              onChange={(e) =>
                handleCheckboxChange(`q${index}`, e.target.checked)
              }
            />
            {question}
          </label>
        ))}
      </div>
    </div>
  );
};
