import { ModuleData } from "./modules";
import { Module, ModuleVersion, ModuleMetadata } from "./module";
import { ModuleErrorType } from "./moduleError";

export interface UserModuleState {
  isValid: boolean;
  isDirty: boolean;
  isLoading: boolean;
  lastSync?: string;
  errors?: ModuleErrorType[];
}

export interface UserModule extends Omit<Module, "data"> {
  module_type: Module["type"];
  module_data: ModuleData;
  is_required: boolean;
  display_order: number;
  state: UserModuleState;
  version: ModuleVersion;
  metadata: ModuleMetadata;
}
