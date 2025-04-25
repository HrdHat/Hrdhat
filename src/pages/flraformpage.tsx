import React, { useEffect, useState } from "react";
import { useLocation, Navigate } from "react-router-dom";
import { ViewMode } from "../types/viewmode";
import HeaderModule from "../components/headermodule";
import { formService } from "../services/form.service";
import { moduleService } from "../services/module.service";
import { FLRADraft } from "../utils/flrasessionmanager";
import { FormErrorBoundary } from "../components/ErrorBoundary";
import GeneralInformation from "../modules/generalinformation";
import { ChecklistModule } from "../components/modules/checklist/ChecklistModule";
import { supabaseService } from "../services/supabase.service";
import "../styles/flraformpage.css";

interface Props {
  viewMode?: ViewMode;
  draftId?: string;
}

interface UserModule {
  module_type: string;
  module_data: any;
  is_required: boolean;
  display_order: number;
}

const FlraFormPage: React.FC<Props> = ({ viewMode, draftId }) => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const urlView = params.get("view") as ViewMode;
  const currentView = viewMode || urlView || "guided";
  const [formData, setFormData] = useState<FLRADraft | null>(null);
  const [userModules, setUserModules] = useState<UserModule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load user's module configuration
  useEffect(() => {
    const loadUserModules = async () => {
      console.group("Module Loading");
      console.log("Starting to load user modules...");
      try {
        const result = await moduleService.getUserModules();
        if (!result.success) {
          console.warn("Failed to load modules:", result.error);
          throw new Error(result.error);
        }
        console.log("Successfully loaded modules:", result.data);
        setUserModules(result.data || []);
      } catch (err) {
        console.error("Error loading user modules:", err);
        console.log("Falling back to default modules");
        // Fallback to default modules if there's an error
        setUserModules([
          {
            module_type: "general_info",
            module_data: {},
            is_required: true,
            display_order: 0,
          },
          {
            module_type: "pre_job",
            module_data: {},
            is_required: true,
            display_order: 1,
          },
          {
            module_type: "ppe",
            module_data: {},
            is_required: true,
            display_order: 2,
          },
          {
            module_type: "platform",
            module_data: {},
            is_required: true,
            display_order: 3,
          },
        ]);
      } finally {
        console.groupEnd();
      }
    };

    loadUserModules();
  }, []);

  useEffect(() => {
    const loadFormData = async () => {
      if (!draftId) return;

      try {
        setLoading(true);
        const result = await formService.getFormById(draftId);

        if (!result.success || !result.data) {
          throw new Error(result.error || "Failed to load form data");
        }

        setFormData(result.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    loadFormData();
  }, [draftId]);

  // Helper function to render the appropriate module component
  const renderModule = (moduleType: string, moduleData: any) => {
    console.group(`Rendering Module: ${moduleType}`);
    console.log("Module data:", moduleData);

    let component;
    switch (moduleType) {
      case "general_info":
        console.log("Rendering GeneralInformation module");
        component = (
          <GeneralInformation view={currentView} draftId={draftId!} />
        );
        break;
      case "pre_job":
      case "ppe":
      case "platform":
        console.log(`Rendering ChecklistModule of type: ${moduleType}`);
        component = <ChecklistModule formId={draftId!} type={moduleType} />;
        break;
      default:
        console.warn(`Unknown module type: ${moduleType}`);
        component = null;
    }

    console.groupEnd();
    return component;
  };

  // If no draftId is provided, redirect to home
  if (!draftId) {
    return <Navigate to="/" replace />;
  }

  if (loading) {
    return (
      <div className="form-page">
        <div className="loading-state">Loading form data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="form-page">
        <div className="error-state">
          <p>Error: {error}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <FormErrorBoundary>
      <div className="form-page">
        <HeaderModule
          title="Field Level Risk Assessment"
          formId={draftId}
          createdDate={
            formData?.lastModified || new Date().toISOString().split("T")[0]
          }
          currentModule="General Information"
          viewMode={currentView}
          logoSrc="../assets/logo/engineer.png"
        />

        {userModules.map((module) => (
          <React.Fragment key={module.module_type}>
            {renderModule(module.module_type, module.module_data)}
          </React.Fragment>
        ))}
      </div>
    </FormErrorBoundary>
  );
};

export default FlraFormPage;
