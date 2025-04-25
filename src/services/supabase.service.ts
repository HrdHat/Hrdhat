import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { FLRADraft } from "../utils/flrasessionmanager";
import { errorService } from "./error.service";
import { Database } from "../types/supabase";

type SupabaseConfig = {
  url: string;
  anonKey: string;
};

export class SupabaseService {
  private static instance: SupabaseService;
  private client: SupabaseClient<Database> | null = null;
  private isInitialized = false;

  private constructor() {
    // Don't automatically initialize - wait for explicit initialization
  }

  static getInstance(): SupabaseService {
    if (!SupabaseService.instance) {
      SupabaseService.instance = new SupabaseService();
    }
    return SupabaseService.instance;
  }

  async initialize(config: SupabaseConfig): Promise<void> {
    try {
      this.client = createClient<Database>(config.url, config.anonKey);

      // Test connection
      const { error } = await this.client.from("forms").select("count");
      if (error) throw error;

      this.isInitialized = true;
      console.log("Supabase connection established");
    } catch (error) {
      this.client = null;
      this.isInitialized = false;
      await errorService.handleError(error, {
        type: "network",
        severity: "high",
        operation: "SupabaseService.initialize",
        retry: false,
      });
      throw new Error("Failed to initialize Supabase client");
    }
  }

  getClient(): SupabaseClient<Database> | null {
    return this.client;
  }

  isConnected(): boolean {
    return this.isInitialized && this.client !== null;
  }

  async createForm(draft: FLRADraft): Promise<void> {
    if (!this.isConnected()) return; // Silently return if not connected

    try {
      const { error } = await this.client!.from("forms").insert({
        id: draft.id,
        general_info: draft.generalInfo,
        modules: draft.modules,
        status: draft.status,
        last_modified: draft.lastModified,
        created_by: (await this.client!.auth.getUser()).data.user?.id,
      });

      if (error) throw error;
    } catch (error) {
      await errorService.handleError(error, {
        type: "system",
        severity: "high",
        operation: "SupabaseService.createForm",
        retry: true,
      });
      throw error;
    }
  }

  async updateForm(draft: FLRADraft): Promise<void> {
    if (!this.isConnected()) return; // Silently return if not connected

    try {
      const { error } = await this.client!.from("forms")
        .update({
          general_info: draft.generalInfo,
          modules: draft.modules,
          status: draft.status,
          last_modified: draft.lastModified,
        })
        .eq("id", draft.id);

      if (error) throw error;
    } catch (error) {
      await errorService.handleError(error, {
        type: "system",
        severity: "medium",
        operation: "SupabaseService.updateForm",
        retry: true,
      });
      throw error;
    }
  }

  async deleteForm(formId: string): Promise<void> {
    if (!this.isConnected()) return; // Silently return if not connected

    try {
      const { error } = await this.client!.from("forms")
        .delete()
        .eq("id", formId);

      if (error) throw error;
    } catch (error) {
      await errorService.handleError(error, {
        type: "system",
        severity: "medium",
        operation: "SupabaseService.deleteForm",
        retry: false,
      });
      throw error;
    }
  }

  async getForms(): Promise<FLRADraft[]> {
    if (!this.isConnected()) return []; // Return empty array if not connected

    try {
      const { data, error } = await this.client!.from("forms").select("*");

      if (error) throw error;
      if (!data) return [];

      return data.map((form) => ({
        id: form.id,
        generalInfo: form.general_info,
        modules: form.modules,
        status: form.status as FLRADraft["status"],
        lastModified: form.last_modified,
      }));
    } catch (error) {
      await errorService.handleError(error, {
        type: "network",
        severity: "medium",
        operation: "SupabaseService.getForms",
        retry: true,
      });
      throw error;
    }
  }
}

export const supabaseService = SupabaseService.getInstance();
