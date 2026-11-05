-- Core CancerCompanion data model. All patient-owned rows are scoped by user_id.

create table if not exists profiles (
  id text primary key references "user"(id) on delete cascade,
  full_name text not null default '',
  email text not null default '',
  phone text not null default '',
  date_of_birth date,
  diagnosis text not null default '',
  diagnosis_date date,
  cancer_stage text not null default '',
  treatment_center text not null default '',
  role text not null default 'patient',
  is_admin boolean not null default false,
  onboarding_complete boolean not null default false,
  theme text not null default 'system',
  local_emergency_number text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists caregivers (
  id text primary key,
  patient_id text not null,
  caregiver_user_id text references "user"(id) on delete set null,
  invite_email text not null,
  status text not null default 'pending',
  display_name text not null default '',
  relationship text not null default '',
  created_at timestamptz not null default now(),
  accepted_at timestamptz
);
create index if not exists caregivers_patient_idx on caregivers (patient_id);
create index if not exists caregivers_user_idx on caregivers (caregiver_user_id);
create index if not exists caregivers_email_idx on caregivers (invite_email);

create table if not exists caregiver_permissions (
  id text primary key,
  caregiver_id text not null references caregivers(id) on delete cascade,
  resource text not null,
  can_view boolean not null default true,
  can_edit boolean not null default false
);
create unique index if not exists caregiver_permissions_uniq on caregiver_permissions (caregiver_id, resource);

create table if not exists appointments (
  id text primary key,
  user_id text not null references "user"(id) on delete cascade,
  doctor_name text not null,
  hospital text not null default '',
  type text not null default '',
  starts_at timestamptz not null,
  notes text not null default '',
  questions text not null default '',
  status text not null default 'scheduled',
  created_at timestamptz not null default now()
);
create index if not exists appointments_user_idx on appointments (user_id, starts_at);

create table if not exists medications (
  id text primary key,
  user_id text not null references "user"(id) on delete cascade,
  name text not null,
  dosage text not null default '',
  frequency text not null default '',
  start_date date,
  end_date date,
  instructions text not null default '',
  prescribing_doctor text not null default '',
  reminder_times text not null default '[]',
  active boolean not null default true,
  created_at timestamptz not null default now()
);
create index if not exists medications_user_idx on medications (user_id);

create table if not exists medication_logs (
  id text primary key,
  user_id text not null references "user"(id) on delete cascade,
  medication_id text not null references medications(id) on delete cascade,
  taken_at timestamptz not null default now(),
  status text not null default 'taken',
  note text not null default ''
);
create index if not exists medication_logs_user_idx on medication_logs (user_id, taken_at);

create table if not exists treatments (
  id text primary key,
  user_id text not null references "user"(id) on delete cascade,
  title text not null,
  type text not null default '',
  start_date date,
  end_date date,
  location text not null default '',
  notes text not null default '',
  status text not null default 'planned',
  created_at timestamptz not null default now()
);
create index if not exists treatments_user_idx on treatments (user_id);

create table if not exists symptoms (
  id text primary key,
  user_id text not null references "user"(id) on delete cascade,
  logged_at timestamptz not null default now(),
  pain int,
  fatigue int,
  nausea int,
  appetite int,
  sleep int,
  mood int,
  temperature double precision,
  other_label text not null default '',
  other_severity int,
  notes text not null default ''
);
create index if not exists symptoms_user_idx on symptoms (user_id, logged_at);

create table if not exists wellbeing_entries (
  id text primary key,
  user_id text not null references "user"(id) on delete cascade,
  entry_date date not null,
  mood int not null,
  energy int not null,
  notes text not null default ''
);
create unique index if not exists wellbeing_user_date_idx on wellbeing_entries (user_id, entry_date);

create table if not exists journal_entries (
  id text primary key,
  user_id text not null references "user"(id) on delete cascade,
  title text not null default '',
  body text not null,
  created_at timestamptz not null default now()
);
create index if not exists journal_user_idx on journal_entries (user_id, created_at);

create table if not exists medical_documents (
  id text primary key,
  user_id text not null references "user"(id) on delete cascade,
  title text not null,
  category text not null default 'other',
  file_name text not null default '',
  mime_type text not null default '',
  content_base64 text not null default '',
  notes text not null default '',
  created_at timestamptz not null default now()
);
create index if not exists documents_user_idx on medical_documents (user_id);

create table if not exists emergency_contacts (
  id text primary key,
  user_id text not null references "user"(id) on delete cascade,
  name text not null,
  relationship text not null default '',
  phone text not null,
  is_primary boolean not null default false
);
create index if not exists emergency_contacts_user_idx on emergency_contacts (user_id);

create table if not exists healthcare_providers (
  id text primary key,
  user_id text not null references "user"(id) on delete cascade,
  name text not null,
  specialty text not null default '',
  hospital text not null default '',
  phone text not null default '',
  email text not null default '',
  notes text not null default ''
);
create index if not exists providers_user_idx on healthcare_providers (user_id);

create table if not exists expenses (
  id text primary key,
  user_id text not null references "user"(id) on delete cascade,
  category text not null,
  amount double precision not null,
  currency text not null default 'USD',
  occurred_on date not null,
  note text not null default '',
  created_at timestamptz not null default now()
);
create index if not exists expenses_user_idx on expenses (user_id, occurred_on);

create table if not exists support_resources (
  id text primary key,
  title text not null,
  category text not null,
  summary text not null,
  body text not null,
  source_label text not null default '',
  published boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists ai_conversations (
  id text primary key,
  user_id text not null references "user"(id) on delete cascade,
  title text not null default 'Guardian chat',
  created_at timestamptz not null default now()
);
create index if not exists ai_conversations_user_idx on ai_conversations (user_id);

create table if not exists ai_messages (
  id text primary key,
  conversation_id text not null references ai_conversations(id) on delete cascade,
  user_id text not null references "user"(id) on delete cascade,
  role text not null,
  content text not null,
  flagged boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists ai_messages_conv_idx on ai_messages (conversation_id, created_at);

create table if not exists notifications (
  id text primary key,
  user_id text not null references "user"(id) on delete cascade,
  type text not null,
  title text not null,
  body text not null,
  read_at timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists notifications_user_idx on notifications (user_id, created_at);

create table if not exists notification_prefs (
  user_id text primary key references "user"(id) on delete cascade,
  medications boolean not null default true,
  appointments boolean not null default true,
  wellbeing boolean not null default true,
  caregivers boolean not null default true,
  app_events boolean not null default true
);

create table if not exists subscriptions (
  id text primary key,
  user_id text not null references "user"(id) on delete cascade,
  tier text not null default 'free',
  status text not null default 'active',
  current_period_end timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists subscriptions_user_idx on subscriptions (user_id);

create table if not exists payments (
  id text primary key,
  user_id text not null default '',
  subscription_id text,
  provider text not null default 'webhook',
  provider_event_id text unique,
  amount double precision,
  currency text,
  status text not null,
  raw_payload text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists audit_logs (
  id text primary key,
  actor_id text not null,
  action text not null,
  resource text not null,
  resource_id text,
  metadata text not null default '',
  created_at timestamptz not null default now()
);
create index if not exists audit_logs_actor_idx on audit_logs (actor_id, created_at);
create index if not exists audit_logs_created_idx on audit_logs (created_at);

create table if not exists admin_access_grants (
  id text primary key,
  admin_id text not null,
  patient_id text not null,
  reason text not null,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

create table if not exists system_settings (
  key text primary key,
  value text not null
);
insert into system_settings (key, value) values
  ('ai_enabled', 'true'),
  ('max_ai_messages_free', '12'),
  ('max_ai_messages_plus', '80'),
  ('maintenance_mode', 'false')
on conflict (key) do nothing;

-- RLS is enabled for patient data. The app database role must be the trusted owner
-- and server functions must always scope patient data to the verified session id.
alter table profiles enable row level security;
alter table caregivers enable row level security;
alter table caregiver_permissions enable row level security;
alter table appointments enable row level security;
alter table medications enable row level security;
alter table medication_logs enable row level security;
alter table treatments enable row level security;
alter table symptoms enable row level security;
alter table wellbeing_entries enable row level security;
alter table journal_entries enable row level security;
alter table medical_documents enable row level security;
alter table emergency_contacts enable row level security;
alter table healthcare_providers enable row level security;
alter table expenses enable row level security;
alter table ai_conversations enable row level security;
alter table ai_messages enable row level security;
alter table notifications enable row level security;
alter table notification_prefs enable row level security;
alter table subscriptions enable row level security;
alter table payments enable row level security;
alter table audit_logs enable row level security;
alter table admin_access_grants enable row level security;
