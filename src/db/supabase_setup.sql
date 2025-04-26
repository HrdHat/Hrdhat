-- HRDHAT FLRA Database Setup Script
-- This script sets up the complete database schema with tables, indexes, and RLS policies

-- Clean up existing objects
DROP TRIGGER IF EXISTS handle_form_modules_updated_at ON public.form_modules;
DROP TRIGGER IF EXISTS handle_profiles_updated_at ON public.profiles;
DROP TRIGGER IF EXISTS handle_forms_updated_at ON public.forms;
DROP TRIGGER IF EXISTS handle_checklist_responses_updated_at ON public.checklist_responses;
DROP TRIGGER IF EXISTS handle_task_hazard_controls_updated_at ON public.task_hazard_controls;
DROP TRIGGER IF EXISTS handle_form_attachments_updated_at ON public.form_attachments;
DROP FUNCTION IF EXISTS public.handle_updated_at() CASCADE;

-- Drop existing policies
DO $$ BEGIN
    DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
    DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
    
    DROP POLICY IF EXISTS "Users can view own forms" ON public.forms;
    DROP POLICY IF EXISTS "Users can create forms" ON public.forms;
    DROP POLICY IF EXISTS "Users can update own forms" ON public.forms;
    DROP POLICY IF EXISTS "Users can delete own forms" ON public.forms;
    
    DROP POLICY IF EXISTS "Users can view own checklist responses" ON public.checklist_responses;
    DROP POLICY IF EXISTS "Users can create checklist responses" ON public.checklist_responses;
    DROP POLICY IF EXISTS "Users can update own checklist responses" ON public.checklist_responses;
    DROP POLICY IF EXISTS "Users can delete own checklist responses" ON public.checklist_responses;
    
    DROP POLICY IF EXISTS "Users can view own task hazard controls" ON public.task_hazard_controls;
    DROP POLICY IF EXISTS "Users can create task hazard controls" ON public.task_hazard_controls;
    DROP POLICY IF EXISTS "Users can update own task hazard controls" ON public.task_hazard_controls;
    DROP POLICY IF EXISTS "Users can delete own task hazard controls" ON public.task_hazard_controls;
    
    DROP POLICY IF EXISTS "Users can view own attachments" ON public.form_attachments;
    DROP POLICY IF EXISTS "Users can create attachments" ON public.form_attachments;
    DROP POLICY IF EXISTS "Users can update own attachments" ON public.form_attachments;
    DROP POLICY IF EXISTS "Users can delete own attachments" ON public.form_attachments;
    
    DROP POLICY IF EXISTS "Users can view form signatures" ON public.form_signatures;
    DROP POLICY IF EXISTS "Users can create signatures" ON public.form_signatures;
    DROP POLICY IF EXISTS "Users can delete signatures" ON public.form_signatures;
    
    DROP POLICY IF EXISTS "Users can view own form modules" ON public.form_modules;
    DROP POLICY IF EXISTS "Supervisors can view team form modules" ON public.form_modules;
    DROP POLICY IF EXISTS "Users can create modules for own forms" ON public.form_modules;
    DROP POLICY IF EXISTS "Users can update own form modules" ON public.form_modules;
    DROP POLICY IF EXISTS "Users can delete own form modules" ON public.form_modules;
END $$;

-- Enable Row Level Security
ALTER TABLE IF EXISTS public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.checklist_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.task_hazard_controls ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.form_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.form_signatures ENABLE ROW LEVEL SECURITY;

-- Create Tables

-- User Profiles
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE,
    full_name TEXT,
    company TEXT,
    department TEXT,
    role TEXT,
    supervisor_id UUID REFERENCES public.profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add supervisor_id column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'profiles' 
        AND column_name = 'supervisor_id'
    ) THEN
        ALTER TABLE public.profiles 
        ADD COLUMN supervisor_id UUID REFERENCES public.profiles(id);
    END IF;
END $$;

-- Create index for supervisor lookups
CREATE INDEX IF NOT EXISTS profiles_supervisor_id_idx ON public.profiles(supervisor_id);

-- Forms
CREATE TABLE IF NOT EXISTS public.forms (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    form_number TEXT DEFAULT 'HRDHAT-FLRA-001',
    status TEXT CHECK (status IN ('draft', 'submitted', 'archived')) DEFAULT 'draft',
    created_by UUID REFERENCES public.profiles(id),
    
    -- General Information Fields
    project_name TEXT,
    task_location TEXT,
    supervisor_name TEXT,
    supervisor_contact TEXT,
    todays_date DATE NOT NULL,
    crew_members INTEGER,
    todays_task TEXT,
    start_time TIME WITH TIME ZONE,
    end_time TIME WITH TIME ZONE,
    
    -- Metadata and Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    submitted_at TIMESTAMP WITH TIME ZONE,
    last_modified_by UUID REFERENCES public.profiles(id)
);

-- Checklist Responses
CREATE TABLE IF NOT EXISTS public.checklist_responses (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    form_id UUID REFERENCES public.forms(id) ON DELETE CASCADE,
    checklist_type TEXT CHECK (checklist_type IN ('pre_job', 'ppe', 'platform')),
    responses JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Task Hazard Controls
CREATE TABLE IF NOT EXISTS public.task_hazard_controls (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    form_id UUID REFERENCES public.forms(id) ON DELETE CASCADE,
    task TEXT NOT NULL,
    hazard TEXT NOT NULL,
    hazard_risk INTEGER CHECK (hazard_risk BETWEEN 1 AND 10),
    control TEXT NOT NULL,
    residual_risk INTEGER CHECK (residual_risk BETWEEN 1 AND 10),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Form Attachments
CREATE TABLE IF NOT EXISTS public.form_attachments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    form_id UUID REFERENCES public.forms(id) ON DELETE CASCADE,
    file_path TEXT NOT NULL,
    file_type TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Form Signatures
CREATE TABLE IF NOT EXISTS public.form_signatures (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    form_id UUID REFERENCES public.forms(id) ON DELETE CASCADE,
    signer_name TEXT NOT NULL,
    signature_data TEXT NOT NULL,
    signature_type TEXT CHECK (signature_type IN ('worker', 'supervisor')) NOT NULL,
    signed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Form Modules
CREATE TABLE IF NOT EXISTS public.form_modules (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    form_id UUID REFERENCES public.forms(id) ON DELETE CASCADE,
    module_type TEXT NOT NULL,
    module_data JSONB DEFAULT '{}'::jsonb,
    is_complete BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create Indexes
CREATE INDEX IF NOT EXISTS forms_created_by_idx ON public.forms(created_by);
CREATE INDEX IF NOT EXISTS forms_status_idx ON public.forms(status);
CREATE INDEX IF NOT EXISTS checklist_responses_form_id_idx ON public.checklist_responses(form_id);
CREATE INDEX IF NOT EXISTS task_hazard_controls_form_id_idx ON public.task_hazard_controls(form_id);
CREATE INDEX IF NOT EXISTS form_attachments_form_id_idx ON public.form_attachments(form_id);
CREATE INDEX IF NOT EXISTS form_signatures_form_id_idx ON public.form_signatures(form_id);
CREATE INDEX IF NOT EXISTS form_modules_form_id_idx ON public.form_modules(form_id);
CREATE INDEX IF NOT EXISTS form_modules_type_idx ON public.form_modules(module_type);
CREATE INDEX IF NOT EXISTS form_modules_complete_idx ON public.form_modules(is_complete);
CREATE INDEX IF NOT EXISTS form_modules_type_complete_idx ON public.form_modules(module_type, is_complete);

-- Create Updated At Function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create Updated At Triggers
CREATE TRIGGER handle_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_forms_updated_at
    BEFORE UPDATE ON public.forms
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_checklist_responses_updated_at
    BEFORE UPDATE ON public.checklist_responses
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_task_hazard_controls_updated_at
    BEFORE UPDATE ON public.task_hazard_controls
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_form_attachments_updated_at
    BEFORE UPDATE ON public.form_attachments
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Create RLS Policies
-- Profiles
CREATE POLICY "Users can view own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

-- Forms
CREATE POLICY "Users can view own forms"
    ON public.forms FOR SELECT
    USING (auth.uid() = created_by);

CREATE POLICY "Users can create forms"
    ON public.forms FOR INSERT
    WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update own forms"
    ON public.forms FOR UPDATE
    USING (auth.uid() = created_by);

CREATE POLICY "Users can delete own forms"
    ON public.forms FOR DELETE
    USING (auth.uid() = created_by);

-- Checklist Responses
CREATE POLICY "Users can view own checklist responses"
    ON public.checklist_responses FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM public.forms
        WHERE forms.id = checklist_responses.form_id
        AND forms.created_by = auth.uid()
    ));

CREATE POLICY "Users can create checklist responses"
    ON public.checklist_responses FOR INSERT
    WITH CHECK (EXISTS (
        SELECT 1 FROM public.forms
        WHERE forms.id = checklist_responses.form_id
        AND forms.created_by = auth.uid()
    ));

CREATE POLICY "Users can update own checklist responses"
    ON public.checklist_responses FOR UPDATE
    USING (EXISTS (
        SELECT 1 FROM public.forms
        WHERE forms.id = checklist_responses.form_id
        AND forms.created_by = auth.uid()
    ));

CREATE POLICY "Users can delete own checklist responses"
    ON public.checklist_responses FOR DELETE
    USING (EXISTS (
        SELECT 1 FROM public.forms
        WHERE forms.id = checklist_responses.form_id
        AND forms.created_by = auth.uid()
    ));

-- Task Hazard Controls
CREATE POLICY "Users can view own task hazard controls"
    ON public.task_hazard_controls FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM public.forms
        WHERE forms.id = task_hazard_controls.form_id
        AND forms.created_by = auth.uid()
    ));

CREATE POLICY "Users can create task hazard controls"
    ON public.task_hazard_controls FOR INSERT
    WITH CHECK (EXISTS (
        SELECT 1 FROM public.forms
        WHERE forms.id = task_hazard_controls.form_id
        AND forms.created_by = auth.uid()
    ));

CREATE POLICY "Users can update own task hazard controls"
    ON public.task_hazard_controls FOR UPDATE
    USING (EXISTS (
        SELECT 1 FROM public.forms
        WHERE forms.id = task_hazard_controls.form_id
        AND forms.created_by = auth.uid()
    ));

CREATE POLICY "Users can delete own task hazard controls"
    ON public.task_hazard_controls FOR DELETE
    USING (EXISTS (
        SELECT 1 FROM public.forms
        WHERE forms.id = task_hazard_controls.form_id
        AND forms.created_by = auth.uid()
    ));

-- Attachments
CREATE POLICY "Users can view own attachments"
    ON public.form_attachments FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM public.forms
        WHERE forms.id = form_attachments.form_id
        AND forms.created_by = auth.uid()
    ));

CREATE POLICY "Users can create attachments"
    ON public.form_attachments FOR INSERT
    WITH CHECK (EXISTS (
        SELECT 1 FROM public.forms
        WHERE forms.id = form_attachments.form_id
        AND forms.created_by = auth.uid()
    ));

CREATE POLICY "Users can update own attachments"
    ON public.form_attachments FOR UPDATE
    USING (EXISTS (
        SELECT 1 FROM public.forms
        WHERE forms.id = form_attachments.form_id
        AND forms.created_by = auth.uid()
    ));

CREATE POLICY "Users can delete own attachments"
    ON public.form_attachments FOR DELETE
    USING (EXISTS (
        SELECT 1 FROM public.forms
        WHERE forms.id = form_attachments.form_id
        AND forms.created_by = auth.uid()
    ));

-- Signatures
CREATE POLICY "Users can view form signatures"
    ON public.form_signatures FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM public.forms
        WHERE forms.id = form_signatures.form_id
        AND forms.created_by = auth.uid()
    ));

CREATE POLICY "Users can create signatures"
    ON public.form_signatures FOR INSERT
    WITH CHECK (EXISTS (
        SELECT 1 FROM public.forms
        WHERE forms.id = form_signatures.form_id
        AND forms.created_by = auth.uid()
    ));

CREATE POLICY "Users can delete signatures"
    ON public.form_signatures FOR DELETE
    USING (EXISTS (
        SELECT 1 FROM public.forms
        WHERE forms.id = form_signatures.form_id
        AND forms.created_by = auth.uid()
    ));

-- Form Modules
CREATE POLICY "Users can view own form modules"
    ON public.form_modules FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM public.forms
        WHERE forms.id = form_modules.form_id
        AND forms.created_by = auth.uid()
    ));

CREATE POLICY "Supervisors can view team form modules"
    ON public.form_modules FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.forms f
            JOIN public.profiles p ON f.created_by = p.id
            WHERE f.id = form_modules.form_id
            AND p.supervisor_id = auth.uid()
            AND p.supervisor_id IS NOT NULL
        )
    );

CREATE POLICY "Users can create modules for own forms"
    ON public.form_modules FOR INSERT
    WITH CHECK (EXISTS (
        SELECT 1 FROM public.forms
        WHERE forms.id = form_modules.form_id
        AND forms.created_by = auth.uid()
    ));

CREATE POLICY "Users can update own form modules"
    ON public.form_modules FOR UPDATE
    USING (EXISTS (
        SELECT 1 FROM public.forms
        WHERE forms.id = form_modules.form_id
        AND forms.created_by = auth.uid()
    ));

CREATE POLICY "Users can delete own form modules"
    ON public.form_modules FOR DELETE
    USING (EXISTS (
        SELECT 1 FROM public.forms
        WHERE forms.id = form_modules.form_id
        AND forms.created_by = auth.uid()
    ));

-- Additional Supervisor Policies
CREATE POLICY "Supervisors can view team forms"
    ON public.forms FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles p
            WHERE p.id = forms.created_by
            AND p.supervisor_id = auth.uid()
        )
    );

CREATE POLICY "Supervisors can view team checklist responses"
    ON public.checklist_responses FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.forms f
            JOIN public.profiles p ON f.created_by = p.id
            WHERE f.id = checklist_responses.form_id
            AND p.supervisor_id = auth.uid()
            AND p.supervisor_id IS NOT NULL
        )
    );

CREATE POLICY "Supervisors can view team task hazard controls"
    ON public.task_hazard_controls FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.forms f
            JOIN public.profiles p ON f.created_by = p.id
            WHERE f.id = task_hazard_controls.form_id
            AND p.supervisor_id = auth.uid()
            AND p.supervisor_id IS NOT NULL
        )
    );

CREATE POLICY "Supervisors can view team attachments"
    ON public.form_attachments FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.forms f
            JOIN public.profiles p ON f.created_by = p.id
            WHERE f.id = form_attachments.form_id
            AND p.supervisor_id = auth.uid()
            AND p.supervisor_id IS NOT NULL
        )
    );

CREATE POLICY "Supervisors can view team signatures"
    ON public.form_signatures FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.forms f
            JOIN public.profiles p ON f.created_by = p.id
            WHERE f.id = form_signatures.form_id
            AND p.supervisor_id = auth.uid()
            AND p.supervisor_id IS NOT NULL
        )
    ); 