-- Drop all triggers if they exist
do $$ 
declare
    _tbl text;
    _trigger text;
begin
    for _tbl, _trigger in (
        select tbl.table_name, trg.trigger_name
        from information_schema.triggers trg
        join information_schema.tables tbl 
            on trg.event_object_table = tbl.table_name
        where trg.trigger_name like 'handle_%_updated_at'
        and tbl.table_schema = 'public'
    ) loop
        execute format('drop trigger if exists %I on public.%I', _trigger, _tbl);
    end loop;
end $$;

-- Drop function with CASCADE
drop function if exists public.handle_updated_at() CASCADE;

-- Drop tables if they exist
drop table if exists public.form_signatures cascade;
drop table if exists public.form_attachments cascade;
drop table if exists public.task_hazard_controls cascade;
drop table if exists public.checklist_responses cascade;
drop table if exists public.forms cascade;
drop table if exists public.profiles cascade; 