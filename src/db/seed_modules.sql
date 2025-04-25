-- First, clear existing modules (if any)
DELETE FROM public.form_modules;

-- Insert core modules
INSERT INTO public.form_modules 
(module_type, module_data, is_complete)
VALUES
-- General Information module (always required)
(
  'general_info',
  jsonb_build_object(
    'title', 'General Information',
    'fields', jsonb_build_array(
      jsonb_build_object(
        'id', 'worker_name',
        'label', 'Worker Name',
        'type', 'text',
        'required', true
      ),
      jsonb_build_object(
        'id', 'date',
        'label', 'Date',
        'type', 'date',
        'required', true
      ),
      jsonb_build_object(
        'id', 'location',
        'label', 'Work Location',
        'type', 'text',
        'required', true
      )
    ),
    'order', 0,
    'required', true
  ),
  false
),

-- Pre-job Safety Checklist
(
  'pre_job',
  jsonb_build_object(
    'title', 'Pre-job Safety Checklist',
    'description', 'Complete before starting work',
    'questions', jsonb_build_array(
      'Work area inspected for hazards',
      'Required PPE available and in good condition',
      'Tools and equipment inspected',
      'Emergency procedures reviewed'
    ),
    'order', 1,
    'required', true
  ),
  false
),

-- PPE Requirements
(
  'ppe',
  jsonb_build_object(
    'title', 'Personal Protective Equipment',
    'description', 'Required PPE for this task',
    'equipment', jsonb_build_array(
      'Hard Hat',
      'Safety Glasses',
      'Steel-toed Boots',
      'High-visibility Vest'
    ),
    'order', 2,
    'required', true
  ),
  false
),

-- Work Platform Safety
(
  'platform',
  jsonb_build_object(
    'title', 'Work Platform Safety',
    'description', 'Platform and elevation safety checks',
    'checkpoints', jsonb_build_array(
      'Platform stability verified',
      'Guardrails in place',
      'Access points secure',
      'Load limits checked'
    ),
    'order', 3,
    'required', true
  ),
  false
);

-- Add index if not exists
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE tablename = 'form_modules' 
    AND indexname = 'idx_form_modules_type'
  ) THEN
    CREATE INDEX idx_form_modules_type ON public.form_modules(module_type);
  END IF;
END $$; 