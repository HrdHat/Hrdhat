import { FLRADraft } from "../utils/flrasessionmanager";
import { errorService } from "./error.service";
import { supabaseService } from "./supabase.service";
import jsPDF from "jspdf";

export interface PDFGenerationOptions {
  includeSignatures?: boolean;
  includeTimestamp?: boolean;
  quality?: "draft" | "final";
  watermark?: string;
}

export interface PDFGenerationResult {
  success: boolean;
  url?: string;
  blob?: Blob;
  error?: string;
}

class PDFService {
  private static instance: PDFService;
  private isOnline: boolean = navigator.onLine;

  private constructor() {
    window.addEventListener("online", () => (this.isOnline = true));
    window.addEventListener("offline", () => (this.isOnline = false));
  }

  static getInstance(): PDFService {
    if (!PDFService.instance) {
      PDFService.instance = new PDFService();
    }
    return PDFService.instance;
  }

  async generatePDF(
    draft: FLRADraft,
    options: PDFGenerationOptions = {}
  ): Promise<PDFGenerationResult> {
    try {
      const doc = new jsPDF();

      // Add header
      doc.setFontSize(20);
      doc.text("FLRA Form", 20, 20);

      // Add form details
      doc.setFontSize(12);
      doc.text(`Title: ${draft.title}`, 20, 40);
      doc.text(`ID: ${draft.id}`, 20, 50);
      doc.text(
        `Created: ${new Date(draft.createdAt).toLocaleString()}`,
        20,
        60
      );

      // Add general info
      const generalInfo = draft.data.generalInfo;
      if (generalInfo) {
        doc.text("General Information", 20, 80);
        doc.text(`Project: ${generalInfo.projectName}`, 30, 90);
        doc.text(`Location: ${generalInfo.taskLocation}`, 30, 100);
        doc.text(`Supervisor: ${generalInfo.supervisorName}`, 30, 110);
        doc.text(`Date: ${generalInfo.todaysDate}`, 30, 120);
      }

      // Add watermark if specified
      if (options.watermark) {
        doc.setTextColor(200);
        doc.setFontSize(40);
        doc.text(options.watermark, 20, doc.internal.pageSize.height - 20);
        doc.setTextColor(0);
      }

      // Add timestamp if specified
      if (options.includeTimestamp) {
        doc.setFontSize(8);
        doc.text(
          `Generated: ${new Date().toISOString()}`,
          doc.internal.pageSize.width - 60,
          doc.internal.pageSize.height - 10
        );
      }

      const pdfBlob = doc.output("blob");
      const url = URL.createObjectURL(pdfBlob);

      return {
        success: true,
        url,
        blob: pdfBlob,
      };
    } catch (error) {
      errorService.handleError(error, {
        type: "system",
        severity: "medium",
        operation: "PDFService.generatePDF",
        retry: true,
      });
      return { success: false, error: "Failed to generate PDF" };
    }
  }

  async generateBatchPDF(
    drafts: FLRADraft[],
    options: PDFGenerationOptions = {}
  ): Promise<PDFGenerationResult> {
    try {
      const doc = new jsPDF();
      let yOffset = 20;

      drafts.forEach((draft, index) => {
        if (index > 0) {
          doc.addPage();
          yOffset = 20;
        }

        // Add header
        doc.setFontSize(20);
        doc.text("FLRA Form", 20, yOffset);
        yOffset += 20;

        // Add form details
        doc.setFontSize(12);
        doc.text(`Title: ${draft.title}`, 20, yOffset);
        yOffset += 10;
        doc.text(`ID: ${draft.id}`, 20, yOffset);
        yOffset += 10;

        // Add general info
        const generalInfo = draft.data.generalInfo;
        if (generalInfo) {
          doc.text("General Information", 20, yOffset);
          yOffset += 10;
          doc.text(`Project: ${generalInfo.projectName}`, 30, yOffset);
          yOffset += 10;
          doc.text(`Location: ${generalInfo.taskLocation}`, 30, yOffset);
        }

        // Add watermark if specified
        if (options.watermark) {
          doc.setTextColor(200);
          doc.setFontSize(40);
          doc.text(options.watermark, 20, doc.internal.pageSize.height - 20);
          doc.setTextColor(0);
        }
      });

      const pdfBlob = doc.output("blob");
      const url = URL.createObjectURL(pdfBlob);

      return {
        success: true,
        url,
        blob: pdfBlob,
      };
    } catch (error) {
      errorService.handleError(error, {
        type: "system",
        severity: "medium",
        operation: "PDFService.generateBatchPDF",
        retry: true,
      });
      return { success: false, error: "Failed to generate batch PDF" };
    }
  }

  async savePDF(
    draft: FLRADraft,
    options: PDFGenerationOptions = {}
  ): Promise<PDFGenerationResult> {
    try {
      const result = await this.generatePDF(draft, options);
      if (!result.success || !result.blob) {
        throw new Error("PDF generation failed");
      }

      if (this.isOnline) {
        // Save to Supabase storage
        const { error } = await supabaseService.uploadPDF(
          draft.id,
          result.blob
        );
        if (error) throw error;

        // Get the signed URL
        const url = await supabaseService.getPDFUrl(draft.id);
        return { success: true, url };
      }

      // Fallback to local URL if offline
      return {
        success: true,
        url: result.url,
        blob: result.blob,
      };
    } catch (error) {
      errorService.handleError(error, {
        type: "storage",
        severity: "medium",
        operation: "PDFService.savePDF",
        retry: this.isOnline,
      });
      return { success: false, error: "Failed to save PDF" };
    }
  }

  revokeURL(url: string): void {
    try {
      // Only revoke if it's a local blob URL
      if (url.startsWith("blob:")) {
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      errorService.handleError(error, {
        type: "system",
        severity: "low",
        operation: "PDFService.revokeURL",
      });
    }
  }
}

export const pdfService = PDFService.getInstance();
