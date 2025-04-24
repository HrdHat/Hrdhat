import { FLRADraft } from "../utils/flrasessionmanager";

export interface ArchivedForm extends FLRADraft {
  submittedAt: string;
  submissionType: "as-is" | "validated";
}

const ARCHIVE_STORAGE_KEY = "flra_archive";

class ArchiveService {
  private static instance: ArchiveService;

  private constructor() {}

  static getInstance(): ArchiveService {
    if (!ArchiveService.instance) {
      ArchiveService.instance = new ArchiveService();
    }
    return ArchiveService.instance;
  }

  async archiveForm(
    form: FLRADraft,
    submissionType: "as-is" | "validated"
  ): Promise<void> {
    const archivedForm: ArchivedForm = {
      ...form,
      submittedAt: new Date().toISOString(),
      submissionType,
    };

    const archive = await this.getArchive();
    archive.push(archivedForm);
    localStorage.setItem(ARCHIVE_STORAGE_KEY, JSON.stringify(archive));

    // TODO: When Supabase is integrated:
    // await supabase
    //     .from('forms')
    //     .update({
    //         status: 'archived',
    //         submitted_at: new Date().toISOString(),
    //         submission_type: submissionType
    //     })
    //     .eq('id', form.id);
  }

  async getArchive(): Promise<ArchivedForm[]> {
    const archiveStr = localStorage.getItem(ARCHIVE_STORAGE_KEY);
    return archiveStr ? JSON.parse(archiveStr) : [];

    // TODO: When Supabase is integrated:
    // const { data, error } = await supabase
    //     .from('forms')
    //     .select('*')
    //     .eq('status', 'archived')
    //     .order('submitted_at', { ascending: false });
    // return data || [];
  }

  async deleteFromArchive(id: string): Promise<void> {
    const archive = await this.getArchive();
    const updatedArchive = archive.filter((form) => form.id !== id);
    localStorage.setItem(ARCHIVE_STORAGE_KEY, JSON.stringify(updatedArchive));

    // TODO: When Supabase is integrated:
    // await supabase
    //     .from('forms')
    //     .delete()
    //     .eq('id', id);
  }
}

export const archiveService = ArchiveService.getInstance();
