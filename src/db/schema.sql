-- Enable RLS (Row Level Security)
alter table if exists public.profiles enable row level security;
alter table if exists public.forms enable row level security;
alter table if exists public.form_modules enable row level security;

-- Create a table for user profiles
create table if not exists public.profiles (
    id uuid references auth.users on delete cascade primary key,
    email text unique,
    full_name text,
    company text,
    department text,
    role text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create a table for forms
create table if not exists public.forms (
    id uuid default uuid_generate_v4() primary key,
    title text,
    status text check (status in ('draft', 'submitted', 'archived')) default 'draft',
    created_by uuid references public.profiles(id),
    supervisor_name text,
    supervisor_contact text,
    project_name text,
    task_location text,
    crew_members integer,
    todays_task text,
    start_time timestamp with time zone,
    end_time timestamp with time zone,
    submission_type text check (submission_type in ('as-is', 'validated')),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    submitted_at timestamp with time zone,
    metadata jsonb default '{}'::jsonb
);

-- Create a table for form modules (for future extensibility)
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
create index if not exists form_modules_form_id_idx on public.form_modules(form_id);

-- Create a function to automatically update updated_at timestamp
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

create trigger handle_form_modules_updated_at
    before update on public.form_modules
    for each row
    execute function public.handle_updated_at();

-- RLS Policies
-- Profiles: Users can only read/update their own profile
create policy "Users can view own profile"
    on public.profiles for select
    using ( auth.uid() = id );

create policy "Users can update own profile"
    on public.profiles for update
    using ( auth.uid() = id );

-- Forms: Users can CRUD their own forms
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