-- Drop existing triggers first (after tables exist)
drop trigger if exists handle_form_modules_updated_at on public.form_modules;
drop trigger if exists handle_profiles_updated_at on public.profiles;
drop trigger if exists handle_forms_updated_at on public.forms;
drop trigger if exists handle_checklist_responses_updated_at on public.checklist_responses;
drop trigger if exists handle_task_hazard_controls_updated_at on public.task_hazard_controls;
drop trigger if exists handle_form_attachments_updated_at on public.form_attachments;

-- Drop function with CASCADE to handle dependencies
drop function if exists public.handle_updated_at() CASCADE;

-- Enable RLS (Row Level Security)
alter table if exists public.profiles enable row level security;
alter table if exists public.forms enable row level security;
alter table if exists public.checklist_responses enable row level security;
alter table if exists public.task_hazard_controls enable row level security;
alter table if exists public.form_attachments enable row level security;
alter table if exists public.form_signatures enable row level security;

-- Create a table for user profiles
create table if not exists public.profiles (
    id uuid references auth.users on delete cascade primary key,
    email text unique,
    full_name text,
    company text,
    department text,
    role text,
    supervisor_id uuid references public.profiles(id),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create a table for forms
create table if not exists public.forms (
    id uuid default uuid_generate_v4() primary key,
    form_number text default 'HRDHAT-FLRA-001',
    status text check (status in ('draft', 'submitted', 'archived')) default 'draft',
    created_by uuid references public.profiles(id),
    
    -- General Information Fields
    project_name text,
    task_location text,
    supervisor_name text,
    supervisor_contact text,
    todays_date date not null,
    crew_members integer,
    todays_task text,
    start_time time with time zone,
    end_time time with time zone,
    
    -- Metadata and Timestamps
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    submitted_at timestamp with time zone,
    last_modified_by uuid references public.profiles(id)
);

-- Create a table for FLRA checklist responses
create table if not exists public.checklist_responses (
    id uuid default uuid_generate_v4() primary key,
    form_id uuid references public.forms(id) on delete cascade,
    checklist_type text check (checklist_type in ('pre_job', 'ppe', 'platform')),
    responses jsonb not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create a table for task hazard control entries
create table if not exists public.task_hazard_controls (
    id uuid default uuid_generate_v4() primary key,
    form_id uuid references public.forms(id) on delete cascade,
    task text not null,
    hazard text not null,
    hazard_risk integer check (hazard_risk between 1 and 10),
    control text not null,
    residual_risk integer check (residual_risk between 1 and 10),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create a table for form attachments (pictures)
create table if not exists public.form_attachments (
    id uuid default uuid_generate_v4() primary key,
    form_id uuid references public.forms(id) on delete cascade,
    file_path text not null,
    file_type text not null,
    description text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create a table for signatures
create table if not exists public.form_signatures (
    id uuid default uuid_generate_v4() primary key,
    form_id uuid references public.forms(id) on delete cascade,
    signer_name text not null,
    signature_data text not null,
    signature_type text check (signature_type in ('worker', 'supervisor')) not null,
    signed_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create a table for form modules
create table if not exists public.form_modules (
    id uuid default uuid_generate_v4() primary key,
    form_id uuid references public.forms(id) on delete cascade,
    module_type text not null,
    module_data jsonb default '{}'::jsonb,
    is_complete boolean default false,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create indexes for better query performance
create index if not exists forms_created_by_idx on public.forms(created_by);
create index if not exists forms_status_idx on public.forms(status);
create index if not exists checklist_responses_form_id_idx on public.checklist_responses(form_id);
create index if not exists task_hazard_controls_form_id_idx on public.task_hazard_controls(form_id);
create index if not exists form_attachments_form_id_idx on public.form_attachments(form_id);
create index if not exists form_signatures_form_id_idx on public.form_signatures(form_id);
create index if not exists form_modules_form_id_idx on public.form_modules(form_id);
create index if not exists form_modules_type_idx on public.form_modules(module_type);
create index if not exists form_modules_complete_idx on public.form_modules(is_complete);
create index if not exists form_modules_type_complete_idx on public.form_modules(module_type, is_complete);

-- Create the updated_at function
create or replace function public.handle_updated_at()
returns trigger as $$
begin
    new.updated_at = timezone('utc'::text, now());
    return new;
end;
$$ language plpgsql;

-- Create triggers for updated_at
create trigger handle_profiles_updated_at
    before update on public.profiles
    for each row
    execute function public.handle_updated_at();

create trigger handle_forms_updated_at
    before update on public.forms
    for each row
    execute function public.handle_updated_at();

create trigger handle_checklist_responses_updated_at
    before update on public.checklist_responses
    for each row
    execute function public.handle_updated_at();

create trigger handle_task_hazard_controls_updated_at
    before update on public.task_hazard_controls
    for each row
    execute function public.handle_updated_at();

create trigger handle_form_attachments_updated_at
    before update on public.form_attachments
    for each row
    execute function public.handle_updated_at();

-- RLS Policies
-- Profiles
create policy "Users can view own profile"
    on public.profiles for select
    using ( auth.uid() = id );

create policy "Users can update own profile"
    on public.profiles for update
    using ( auth.uid() = id );

-- Forms
create policy "Users can view own forms"
    on public.forms for select
    using ( auth.uid() = created_by );

create policy "Users can create forms"
    on public.forms for insert
    with check ( auth.uid() = created_by );

create policy "Users can update own forms"
    on public.forms for update
    using ( auth.uid() = created_by );

create policy "Users can delete own forms"
    on public.forms for delete
    using ( auth.uid() = created_by );

-- Checklist Responses
create policy "Users can view own checklist responses"
    on public.checklist_responses for select
    using ( 
        exists (
            select 1 from public.forms
            where forms.id = checklist_responses.form_id
            and forms.created_by = auth.uid()
        )
    );

create policy "Users can create checklist responses"
    on public.checklist_responses for insert
    with check (
        exists (
            select 1 from public.forms
            where forms.id = checklist_responses.form_id
            and forms.created_by = auth.uid()
        )
    );

create policy "Users can update own checklist responses"
    on public.checklist_responses for update
    using (
        exists (
            select 1 from public.forms
            where forms.id = checklist_responses.form_id
            and forms.created_by = auth.uid()
        )
    );

create policy "Users can delete own checklist responses"
    on public.checklist_responses for delete
    using (
        exists (
            select 1 from public.forms
            where forms.id = checklist_responses.form_id
            and forms.created_by = auth.uid()
        )
    );

-- Task Hazard Controls
create policy "Users can view own task hazard controls"
    on public.task_hazard_controls for select
    using ( 
        exists (
            select 1 from public.forms
            where forms.id = task_hazard_controls.form_id
            and forms.created_by = auth.uid()
        )
    );

create policy "Users can create task hazard controls"
    on public.task_hazard_controls for insert
    with check (
        exists (
            select 1 from public.forms
            where forms.id = task_hazard_controls.form_id
            and forms.created_by = auth.uid()
        )
    );

create policy "Users can update own task hazard controls"
    on public.task_hazard_controls for update
    using (
        exists (
            select 1 from public.forms
            where forms.id = task_hazard_controls.form_id
            and forms.created_by = auth.uid()
        )
    );

create policy "Users can delete own task hazard controls"
    on public.task_hazard_controls for delete
    using (
        exists (
            select 1 from public.forms
            where forms.id = task_hazard_controls.form_id
            and forms.created_by = auth.uid()
        )
    );

-- Attachments
create policy "Users can view own attachments"
    on public.form_attachments for select
    using ( 
        exists (
            select 1 from public.forms
            where forms.id = form_attachments.form_id
            and forms.created_by = auth.uid()
        )
    );

create policy "Users can create attachments"
    on public.form_attachments for insert
    with check (
        exists (
            select 1 from public.forms
            where forms.id = form_attachments.form_id
            and forms.created_by = auth.uid()
        )
    );

create policy "Users can update own attachments"
    on public.form_attachments for update
    using (
        exists (
            select 1 from public.forms
            where forms.id = form_attachments.form_id
            and forms.created_by = auth.uid()
        )
    );

create policy "Users can delete own attachments"
    on public.form_attachments for delete
    using (
        exists (
            select 1 from public.forms
            where forms.id = form_attachments.form_id
            and forms.created_by = auth.uid()
        )
    );

-- Signatures
create policy "Users can view form signatures"
    on public.form_signatures for select
    using ( 
        exists (
            select 1 from public.forms
            where forms.id = form_signatures.form_id
            and forms.created_by = auth.uid()
        )
    );

create policy "Users can create signatures"
    on public.form_signatures for insert
    with check (
        exists (
            select 1 from public.forms
            where forms.id = form_signatures.form_id
            and forms.created_by = auth.uid()
        )
    );

create policy "Users can delete signatures"
    on public.form_signatures for delete
    using (
        exists (
            select 1 from public.forms
            where forms.id = form_signatures.form_id
            and forms.created_by = auth.uid()
        )
    );

-- Form Modules: Users can CRUD modules of their own forms
create policy "Users can view own form modules"
    on public.form_modules for select
    using ( 
        exists (
            select 1 from public.forms
            where forms.id = form_modules.form_id
            and forms.created_by = auth.uid()
        )
    );

create policy "Supervisors can view team form modules"
    on public.form_modules for select
    using (
        exists (
            select 1 from public.forms f
            join public.profiles p on f.created_by = p.id
            where f.id = form_modules.form_id
            and p.supervisor_id = auth.uid()
        )
    );

create policy "Users can create modules for own forms"
    on public.form_modules for insert
    with check (
        exists (
            select 1 from public.forms
            where forms.id = form_modules.form_id
            and forms.created_by = auth.uid()
        )
    );

create policy "Users can update own form modules"
    on public.form_modules for update
    using (
        exists (
            select 1 from public.forms
            where forms.id = form_modules.form_id
            and forms.created_by = auth.uid()
        )
    );

create policy "Users can delete own form modules"
    on public.form_modules for delete
    using (
        exists (
            select 1 from public.forms
            where forms.id = form_modules.form_id
            and forms.created_by = auth.uid()
        )
    ); 