import type { Form } from "../types/form";

interface FormState {
  activeForms: Form[];
  currentForm: Form | null;
  formHistory: Form[];
}

class FormStateManager {
  private state: FormState;
  private static instance: FormStateManager;

  private constructor() {
    this.state = this.loadFromLocalStorage();
  }

  static getInstance(): FormStateManager {
    if (!FormStateManager.instance) {
      FormStateManager.instance = new FormStateManager();
    }
    return FormStateManager.instance;
  }

  getCurrentForm(): Form | null {
    return this.state.currentForm;
  }

  getActiveForms(): Form[] {
    return this.state.activeForms;
  }

  getFormHistory(): Form[] {
    return this.state.formHistory;
  }

  setCurrentForm(form: Form | null): void {
    this.state.currentForm = form;
    this.saveToLocalStorage();
  }

  addActiveForm(form: Form): void {
    this.state.activeForms.push(form);
    this.saveToLocalStorage();
  }

  removeActiveForm(formId: string): void {
    this.state.activeForms = this.state.activeForms.filter(
      (form) => form.id !== formId
    );
    this.saveToLocalStorage();
  }

  updateForm(updatedForm: Form): void {
    const index = this.state.activeForms.findIndex(
      (form) => form.id === updatedForm.id
    );
    if (index !== -1) {
      this.state.activeForms[index] = updatedForm;
      if (this.state.currentForm?.id === updatedForm.id) {
        this.state.currentForm = updatedForm;
      }
      this.saveToLocalStorage();
    }
  }

  completeForm(formId: string): void {
    const form = this.state.activeForms.find((f) => f.id === formId);
    if (form) {
      form.status = "completed";
      this.state.formHistory.push(form);
      this.removeActiveForm(formId);
      this.saveToLocalStorage();
    }
  }

  private saveToLocalStorage(): void {
    try {
      localStorage.setItem("formState", JSON.stringify(this.state));
    } catch (error) {
      console.error("Error saving form state to localStorage:", error);
    }
  }

  private loadFromLocalStorage(): FormState {
    try {
      const savedState = localStorage.getItem("formState");
      if (savedState) {
        return JSON.parse(savedState);
      }
    } catch (error) {
      console.error("Error loading form state from localStorage:", error);
    }

    return {
      activeForms: [],
      currentForm: null,
      formHistory: [],
    };
  }
}

export { FormStateManager };
export type { FormState };
