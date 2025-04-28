-- MEMORY ORDERED SCHEMA FOR ORGANIZATION

-- 1. TABLES (dependency order)

-- profiles (no dependencies)
create table public.profiles (
  id uuid primary key references auth.users(id),
  email text unique not null,
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

-- form_list (no dependencies)
create table public.form_list (
  id uuid primary key default uuid_generate_v4(),
  name text not null unique,
  description text,
  is_active boolean default true,
  is_enabled boolean default true not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- module_list (no dependencies)
create table public.module_list (
  id uuid primary key default uuid_generate_v4(),
  name text not null unique,
  description text,
  is_active boolean default true,
  is_enabled boolean default true not null,
  is_default boolean default false not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- forms (depends on profiles)
create table public.forms (
  id uuid primary key default uuid_generate_v4(),
  form_number text unique not null,
  created_by uuid references public.profiles(id)
);

-- form_template_modules (depends on form_list, module_list)
create table public.form_template_modules (
  id uuid primary key default uuid_generate_v4(),
  form_list_id uuid not null references public.form_list(id),
  module_list_id uuid not null references public.module_list(id),
  module_order integer not null,
  is_required boolean default true not null
);

-- form_modules (depends on forms, module_list)
create table public.form_modules (
  id uuid primary key default uuid_generate_v4(),
  form_id uuid not null references public.forms(id),
  module_list_id uuid not null references public.module_list(id),
  module_order integer not null,
  is_required boolean default true not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- user_form_module_preferences (depends on profiles, form_list, module_list)
create table public.user_form_module_preferences (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id),
  form_list_id uuid not null references public.form_list(id),
  module_list_id uuid not null references public.module_list(id),
  module_order integer not null,
  is_required boolean default true not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- flra_header (depends on form_modules)
create table public.flra_header (
  id uuid primary key default uuid_generate_v4(),
  form_module_id uuid references public.form_modules(id),
  form_number text,
  form_name text,
  form_date date,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- general_information (depends on form_modules)
create table public.general_information (
  id uuid primary key default uuid_generate_v4(),
  form_module_id uuid references public.form_modules(id),
  project_name text,
  project_address text,
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

-- pre_job_task_checklist (depends on forms, form_modules)
create table public.pre_job_task_checklist (
  id uuid primary key default uuid_generate_v4(),
  form_id uuid not null references public.forms(id),
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

-- task_hazard_control (depends on forms, form_modules)
create table public.task_hazard_control (
  id uuid primary key default uuid_generate_v4(),
  form_id uuid not null references public.forms(id),
  form_module_id uuid references public.form_modules(id),
  task text not null,
  hazard text not null,
  risk_level_before integer,
  control text not null,
  risk_level_after integer,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- flra_photos (depends on forms, form_modules)
create table public.flra_photos (
  id uuid primary key default uuid_generate_v4(),
  form_id uuid not null references public.forms(id),
  form_module_id uuid references public.form_modules(id),
  photo_url text not null,
  description text,
  uploaded_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- signatures (depends on forms, form_modules)
create table public.signatures (
  id uuid primary key default uuid_generate_v4(),
  form_id uuid not null references public.forms(id),
  form_module_id uuid references public.form_modules(id),
  worker_name text not null,
  signature_url text not null,
  signed_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ppe_platform_inspection (depends on forms, form_modules)
create table public.ppe_platform_inspection (
  id uuid primary key default uuid_generate_v4(),
  form_id uuid not null references public.forms(id),
  form_module_id uuid references public.form_modules(id),
  ppe_hardhat boolean,
  ppe_safety_vest boolean,
  ppe_safety_glasses boolean,
  ppe_fall_protection boolean,
  ppe_coveralls boolean,
  ppe_gloves boolean,
  ppe_mask boolean,
  ppe_respirator boolean,
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

-- 2. TRIGGERS, FUNCTIONS, INSERTS
-- (add your triggers, functions, and inserts here, after all tables)

-- 3. RLS, POLICIES, INDEXES
-- (add your RLS, policies, and indexes here, after all tables) 