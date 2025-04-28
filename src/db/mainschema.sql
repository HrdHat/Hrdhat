-- Create the profiles table for user profiles
create table public.profiles (
  id uuid primary key references auth.users(id), -- Supabase Auth UID
  email text unique not null,
  password_hash text, -- Optional, only if you manage your own auth
  full_name text not null,
  phone_number text,
  company text,
  position_title text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  last_login timestamp with time zone,
  is_active boolean default true not null,
  logo_url text,
  default_form_name text
);

-- Optional: Add a trigger to update the updated_at column automatically
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language 'plpgsql';

create trigger update_profiles_updated_at
before update on public.profiles
for each row
execute procedure update_updated_at_column();

-- Table to list all different kinds of forms available in the system
create table public.form_list (
  id uuid primary key default uuid_generate_v4(),
  name text not null unique,         -- e.g., "Safety Inspection", "Incident Report"
  description text,                  -- Optional: description of the form type
  is_active boolean default true,    -- If false, this form type is not available for new forms
  is_enabled boolean default true not null, -- If false, form type is not available for form generation
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Optional: Trigger to auto-update updated_at
create or replace function update_form_list_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language 'plpgsql';

create trigger update_form_list_updated_at
before update on public.form_list
for each row
execute procedure update_form_list_updated_at_column();

-- Table to list all different kinds of modules available for forms
create table public.module_list (
  id uuid primary key default uuid_generate_v4(),
  name text not null unique,         -- e.g., "Checklist", "Photo Upload", "Signature"
  description text,                  -- Optional: description of the module
  is_active boolean default true,    -- If false, this module type is not available for new forms
  is_enabled boolean default true not null, -- If false, module is not available for form generation
  is_default boolean default false not null, -- If true, this module is default for new forms
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Optional: Trigger to auto-update updated_at
create or replace function update_module_list_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language 'plpgsql';

create trigger update_module_list_updated_at
before update on public.module_list
for each row
execute procedure update_module_list_updated_at_column();

-- Insert default modules for FLRA forms
insert into public.module_list (id, name, description, is_active, is_enabled, is_default, created_at, updated_at)
values
  (uuid_generate_v4(), 'FLRA Header', 'Header section for FLRA forms', true, true, true, now(), now()),
  (uuid_generate_v4(), 'General Information', 'General info section for FLRA forms', true, true, true, now(), now()),
  (uuid_generate_v4(), 'Pre Job/Task Checklist', 'Checklist before starting the job/task', true, true, true, now(), now()),
  (uuid_generate_v4(), 'PPE & Equipment Checklist', 'Checklist for PPE and equipment', true, true, true, now(), now()),
  (uuid_generate_v4(), 'Task Hazard Control Module', 'Module for identifying and controlling hazards', true, true, true, now(), now()),
  (uuid_generate_v4(), 'FLRA Photos', 'Section for uploading photos', true, true, true, now(), now()),
  (uuid_generate_v4(), 'Signatures', 'Section for signatures', true, true, true, now(), now());

-- FLRA Header Module Table
create table public.flra_header (
  id uuid primary key default uuid_generate_v4(),         -- Unique, not editable
  form_module_id uuid references public.form_modules(id),
  form_number text,                                       -- Editable by user
  form_name text,                                         -- Editable by user
  form_date date,                                         -- Editable by user
  created_at timestamp with time zone default timezone('utc'::text, now()) not null  -- Not editable
);

-- General Information Module Table
create table public.general_information (
  id uuid primary key default uuid_generate_v4(),
  form_module_id uuid references public.form_modules(id),
  project_name text,
  project_address text,         -- Added field
  task_location text,
  supervisor_name text,
  supervisor_contact text,
  date date,
  crew_members_count integer,
  task_description text,
  start_time time,
  end_time time,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Pre Job/Task Checklist Module Table
create table public.pre_job_task_checklist (
  id uuid primary key default uuid_generate_v4(),
  form_id uuid not null references public.forms(id),  -- Enforces link to a form
  form_module_id uuid references public.form_modules(id),
  is_fit_for_duty boolean,
  reviewed_work_area_for_hazards boolean,
  required_ppe_for_today boolean,
  equipment_inspection_up_to_date boolean,
  completed_flra_hazard_assessment boolean,
  safety_signage_installed_and_checked boolean,
  working_alone_today boolean,
  required_permits_for_tasks boolean,
  barricades_signage_barriers_installed_good boolean,
  clear_access_to_emergency_exits boolean,
  trained_and_competent_for_tasks boolean,
  inspected_tools_and_equipment boolean,
  reviewed_control_measures_needed boolean,
  reviewed_emergency_procedures boolean,
  all_required_permits_in_place boolean,
  communicated_with_crew_about_plan boolean,
  need_for_spotters_barricades_special_controls boolean,
  weather_suitable_for_work boolean,
  know_designated_first_aid_attendant boolean,
  aware_of_site_notices_or_bulletins boolean,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);


-- Task Hazard Control Module Table
create table public.task_hazard_control (
  id uuid primary key default uuid_generate_v4(),
  form_id uuid not null references public.forms(id),
  form_module_id uuid references public.form_modules(id),
  task text not null,
  hazard text not null,
  risk_level_before integer,      -- Risk level before control
  control text not null,
  risk_level_after integer,       -- Risk level after control
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- FLRA Photos Module Table
create table public.flra_photos (
  id uuid primary key default uuid_generate_v4(),
  form_id uuid not null references public.forms(id),
  form_module_id uuid references public.form_modules(id),
  photo_url text not null,                -- URL to the uploaded photo in Supabase Storage
  description text,                       -- Optional: user-provided description
  uploaded_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Signatures Module Table
create table public.signatures (
  id uuid primary key default uuid_generate_v4(),
  form_id uuid not null references public.forms(id),
  form_module_id uuid references public.form_modules(id),
  worker_name text not null,           -- Name of the worker signing
  signature_url text not null,         -- URL to the signature image in Supabase Storage
  signed_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- PPE & Equipment Checklist Module Table
create table public.ppe_platform_inspection (
  id uuid primary key default uuid_generate_v4(),
  form_id uuid not null references public.forms(id),
  form_module_id uuid references public.form_modules(id),
  -- PPE
  ppe_hardhat boolean,
  ppe_safety_vest boolean,
  ppe_safety_glasses boolean,
  ppe_fall_protection boolean,
  ppe_coveralls boolean,
  ppe_gloves boolean,
  ppe_mask boolean,
  ppe_respirator boolean,
  -- Equipment Platforms
  platform_ladder boolean,
  platform_step_bench boolean,
  platform_sawhorses boolean,
  platform_baker_scaffold boolean,
  platform_scaffold boolean,
  platform_scissor_lift boolean,
  platform_boom_lift boolean,
  platform_swing_stage boolean,
  platform_hydro_lift boolean,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.forms (
  id uuid primary key default uuid_generate_v4(),
  form_number text unique not null,
  -- ... other fields ...
);

-- FORM TEMPLATE MODULES JOIN TABLE
create table public.form_template_modules (
  id uuid primary key default uuid_generate_v4(),
  form_list_id uuid not null references public.form_list(id),
  module_list_id uuid not null references public.module_list(id),
  module_order integer not null, -- for ordering modules in the form
  is_required boolean default true not null
);

-- FORM MODULES: Stores actual module instances that are part of a specific form submission.
-- Key difference from form_template_modules: These are the concrete instances users interact with,
-- while templates define the structure.
create table public.form_modules (
  id uuid primary key default uuid_generate_v4(),
  form_id uuid not null references public.forms(id),
  module_list_id uuid not null references public.module_list(id),
  module_order integer not null,
  is_required boolean default true not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- USER FORM MODULE PREFERENCES: Stores user-specific customizations for how modules appear in forms.
-- Key difference: This overrides the default template settings on a per-user basis.
create table public.user_form_module_preferences (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id),
  form_list_id uuid not null references public.form_list(id),
  module_list_id uuid not null references public.module_list(id),
  module_order integer not null,
  is_required boolean default true not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
); 