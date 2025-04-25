-- Development seed script for testing RLS policies
-- NOTE: This script assumes you have already created the users in Supabase Auth
-- and obtained their UUIDs. Replace the placeholder UUIDs below with actual UUIDs.

BEGIN;

DO $$
DECLARE
    worker_user_id UUID := '11111111-1111-1111-1111-111111111111'::UUID;
    supervisor_user_id UUID := '22222222-2222-2222-2222-222222222222'::UUID;
    test_form_id UUID := 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::UUID;
BEGIN
    -- Create users in auth.users first
    INSERT INTO auth.users (
        id,
        email,
        email_confirmed_at,
        created_at,
        updated_at,
        raw_app_meta_data,
        raw_user_meta_data,
        is_super_admin,
        encrypted_password
    ) VALUES 
        (
            worker_user_id,
            'worker@example.com',
            now(),
            now(),
            now(),
            '{"provider":"email","providers":["email"]}',
            '{}',
            false,
            crypt('password123', gen_salt('bf')) -- This is just a placeholder password
        ),
        (
            supervisor_user_id,
            'supervisor@example.com',
            now(),
            now(),
            now(),
            '{"provider":"email","providers":["email"]}',
            '{}',
            false,
            crypt('password123', gen_salt('bf')) -- This is just a placeholder password
        )
    ON CONFLICT (id) DO UPDATE
    SET
        email = EXCLUDED.email,
        email_confirmed_at = EXCLUDED.email_confirmed_at,
        updated_at = now();

    -- Create profiles for test users
    INSERT INTO public.profiles (id, email, full_name, company, department, role)
    VALUES
        (worker_user_id, 'worker@example.com', 'Test Worker', 'ACME Corp', 'Field Ops', 'worker'),
        (supervisor_user_id, 'supervisor@example.com', 'Test Supervisor', 'ACME Corp', 'Field Ops', 'supervisor')
    ON CONFLICT (id) DO UPDATE
    SET 
        email = EXCLUDED.email,
        full_name = EXCLUDED.full_name,
        company = EXCLUDED.company,
        department = EXCLUDED.department,
        role = EXCLUDED.role;

    -- Set up supervisor relationship
    UPDATE public.profiles
    SET supervisor_id = supervisor_user_id
    WHERE id = worker_user_id;

    -- Create a test form for the worker
    INSERT INTO public.forms (
        id,
        form_number,
        status,
        created_by,
        project_name,
        task_location,
        supervisor_name,
        supervisor_contact,
        todays_date,
        crew_members,
        todays_task
    )
    VALUES (
        test_form_id,
        'TEST-FORM-001',
        'draft',
        worker_user_id,
        'Test Project',
        'Test Location',
        'Test Supervisor',
        '555-0123',
        CURRENT_DATE,
        2,
        'Testing RLS Policies'
    )
    ON CONFLICT (id) DO UPDATE
    SET
        status = EXCLUDED.status,
        project_name = EXCLUDED.project_name,
        task_location = EXCLUDED.task_location,
        supervisor_name = EXCLUDED.supervisor_name,
        supervisor_contact = EXCLUDED.supervisor_contact,
        todays_date = EXCLUDED.todays_date,
        crew_members = EXCLUDED.crew_members,
        todays_task = EXCLUDED.todays_task;

    -- Add some test modules to the form
    INSERT INTO public.form_modules (
        form_id,
        module_type,
        module_data,
        is_complete
    )
    VALUES
        (
            test_form_id,
            'pre_job',
            '{"responses": {"area_inspected": true, "ppe_checked": true}}',
            true
        ),
        (
            test_form_id,
            'ppe',
            '{"equipment": ["hard_hat", "safety_glasses"]}',
            true
        )
    ON CONFLICT (id) DO NOTHING;

    -- Add test checklist responses
    INSERT INTO public.checklist_responses (
        form_id,
        checklist_type,
        responses
    )
    VALUES
        (
            test_form_id,
            'pre_job',
            '{"q1": true, "q2": false, "comments": "Test response"}'
        )
    ON CONFLICT (id) DO NOTHING;

    -- Add test hazard controls
    INSERT INTO public.task_hazard_controls (
        form_id,
        task,
        hazard,
        hazard_risk,
        control,
        residual_risk
    )
    VALUES
        (
            test_form_id,
            'Test Task',
            'Test Hazard',
            8,
            'Test Control',
            3
        )
    ON CONFLICT (id) DO NOTHING;
END $$;

COMMIT;

-- Instructions for use:
-- 1. Replace the placeholder UUIDs in this script:
--    - worker_user_id with a valid UUID (e.g., use gen_random_uuid())
--    - supervisor_user_id with a valid UUID
-- 2. Run this script in the Supabase SQL Editor
-- 3. Test the following scenarios:
--    a) Log in as worker and verify they can:
--       - View and edit their own forms
--       - View and edit their own modules
--       - Cannot view other users' forms
--    b) Log in as supervisor and verify they can:
--       - View their team members' forms
--       - View their team members' modules
--       - Cannot edit team members' forms
--       - Cannot view forms from other teams

-- Note: The passwords are set to 'password123' for testing.
-- In a real environment, you should:
-- 1. Use Supabase Authentication UI/API to create users
-- 2. Let users set their own secure passwords
-- 3. Never store plaintext passwords in scripts 