# Phase 1: Code Structure Implementation Guide

## Overview

Phase 1 focuses on establishing the foundational code structure, with emphasis on type definitions, UI/CSS guidelines, state management, module system, and form builder. This phase is critical for ensuring a scalable and maintainable application.

## 1. Type Definitions

### Module Types (`src/types/module.ts`)

```typescript
interface ModuleField {
  id: string;
  type: "text" | "number" | "date" | "time" | "checkbox" | "select";
  label: string;
  required: boolean;
  validation?: {
    pattern?: string;
    min?: number;
    max?: number;
    custom?: (value: any) => boolean;
  };
}

interface Module {
  id: string;
  name: string;
  required: boolean;
  order: number;
  fields: ModuleField[];
  dependencies?: string[];
  viewModes?: {
    print?: boolean;
    guided?: boolean;
    quickFill?: boolean;
  };
}

interface ModuleConfig {
  modules: Module[];
  defaultOrder: string[];
  requiredModules: string[];
}
```

### Form Types (`src/types/form.ts`)

```typescript
interface FormData {
  [moduleId: string]: {
    [fieldId: string]: any;
  };
}

interface Form {
  id: string;
  type: string;
  status: "active" | "completed";
  modules: Module[];
  data: FormData;
  createdAt: Date;
  updatedAt: Date;
}

interface FormConfig {
  type: string;
  modules: ModuleConfig;
  validation: {
    requireAllFields?: boolean;
    customValidation?: (form: Form) => boolean;
  };
}
```

### User Types (`src/types/user.ts`)

```typescript
interface UserPreferences {
  defaultViewMode: "guided" | "quickfill" | "print";
  defaultFormType: string;
  customModules: string[];
  theme?: "light" | "dark";
}

interface UserSettings {
  email: string;
  notifications: boolean;
  language: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  preferences: UserPreferences;
  settings: UserSettings;
}
```

## 2. UI/CSS Guidelines

### Base Variables (`src/styles/base/variables.css`)

```css
:root {
  /* Colors */
  --primary-color: #007bff;
  --secondary-color: #6c757d;
  --success-color: #28a745;
  --danger-color: #dc3545;
  --warning-color: #ffc107;
  --info-color: #17a2b8;

  /* Spacing */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;

  /* Typography */
  --font-family-base: "Arial", sans-serif;
  --font-size-base: 1rem;
  --line-height-base: 1.5;

  /* Breakpoints */
  --mobile-breakpoint: 768px;
  --tablet-breakpoint: 1024px;
  --desktop-breakpoint: 1280px;
}
```

### Base Module Styles (`src/styles/base/module.css`)

```css
/* Base Module Container */
.module-container {
  padding: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
  border: 1px solid var(--border-color);
  border-radius: 4px;
}

/* View Mode Variations */
.module-container[data-view-mode="print"] {
  /* Two column layout for print */
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-sm);
}

.module-container[data-view-mode="quick-fill"] {
  /* Responsive layout for quick fill */
  @media (max-width: var(--mobile-breakpoint)) {
    display: flex;
    flex-direction: column;
  }

  @media (min-width: var(--mobile-breakpoint)) {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--spacing-md);
  }
}

.module-container[data-view-mode="guided"] {
  /* Single field focus for guided mode */
  display: flex;
  flex-direction: column;
  align-items: center;
}
```

### Field Styles (`src/styles/base/fields.css`)

```css
.field-container {
  margin-bottom: var(--spacing-md);
}

/* View Mode Variations */
.field-container[data-view-mode="print"] {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.field-container[data-view-mode="quick-fill"] {
  @media (max-width: var(--mobile-breakpoint)) {
    display: flex;
    flex-direction: column;
  }
}

.field-container[data-view-mode="guided"] {
  &:not(.active) {
    display: none;
  }

  &.active {
    width: 100%;
    text-align: center;
  }
}
```

### Override Structure

```
src/styles/overrides/
├── special-module.css
├── custom-grid.css
└── README.md  # Documentation for overrides
```

## 3. State Management

### Form State (`src/state/formState.ts`)

```typescript
interface FormState {
  activeForms: Form[];
  currentForm: Form | null;
  formHistory: Form[];
}

class FormStateManager {
  constructor() {
    // Initialize with localStorage data
  }

  getCurrentForm(): Form | null;
  updateForm(form: Form): void;
  saveToLocalStorage(): void;
  loadFromLocalStorage(): void;
}
```

### User State (`src/state/userState.ts`)

```typescript
interface UserState {
  user: User | null;
  preferences: UserPreferences;
  settings: UserSettings;
}

class UserStateManager {
  constructor() {
    // Initialize with localStorage data
  }

  updatePreferences(prefs: Partial<UserPreferences>): void;
  updateSettings(settings: Partial<UserSettings>): void;
  saveToLocalStorage(): void;
  loadFromLocalStorage(): void;
}
```

## Testing Checklist

### Type Definitions

- [ ] Test type compatibility with existing components
- [ ] Verify module type constraints
- [ ] Test form data structure
- [ ] Validate user preferences types

### UI/CSS

- [ ] Test base module styles in all view modes
- [ ] Verify responsive layouts
- [ ] Test field styles across different devices
- [ ] Validate override system

### State Management

- [ ] Test localStorage persistence
- [ ] Verify state updates
- [ ] Test form state transitions
- [ ] Validate user preference updates

## Implementation Order

1. Set up type definitions
2. Implement base CSS structure
3. Create state management system
4. Test and validate all components

## Notes

- All modules should use base styles by default
- Create overrides only when necessary
- Document all overrides
- Test thoroughly on mobile and desktop
- Maintain type safety throughout
- Follow accessibility guidelines
