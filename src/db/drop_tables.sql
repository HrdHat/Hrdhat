-- Drop existing tables and related objects
drop trigger if exists handle_form_modules_updated_at on public.form_modules;
drop trigger if exists handle_forms_updated_at on public.forms;
drop trigger if exists handle_profiles_updated_at on public.profiles;

drop function if exists public.handle_updated_at();

drop table if exists public.form_modules;
drop table if exists public.forms;
drop table if exists public.profiles; 