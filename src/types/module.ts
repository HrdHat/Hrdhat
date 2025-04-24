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

export type { ModuleField, Module, ModuleConfig };
