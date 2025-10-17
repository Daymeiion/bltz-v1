-- with-supabase-app/scripts/setup-settings.sql
-- Settings schema for admin dashboard

-- Site Configuration Table
create table if not exists public.site_configuration (
  id uuid primary key default gen_random_uuid(),
  site_name text not null default 'BLTZ Platform',
  site_description text,
  site_url text not null default 'https://bltz.com',
  maintenance_mode boolean not null default false,
  registration_enabled boolean not null default true,
  public_registration boolean not null default true,
  default_user_role text not null default 'fan' check (default_user_role in ('fan', 'player', 'publisher')),
  max_file_size integer not null default 10, -- MB
  allowed_file_types text[] not null default array['jpg', 'jpeg', 'png', 'mp4', 'mov'],
  timezone text not null default 'America/New_York',
  language text not null default 'en',
  theme text not null default 'dark' check (theme in ('dark', 'light', 'auto')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- User Management Settings Table
create table if not exists public.user_management_settings (
  id uuid primary key default gen_random_uuid(),
  require_email_verification boolean not null default true,
  allow_username_changes boolean not null default false,
  max_username_length integer not null default 20,
  min_password_length integer not null default 8,
  require_strong_password boolean not null default true,
  session_timeout integer not null default 24, -- hours
  max_login_attempts integer not null default 5,
  lockout_duration integer not null default 30, -- minutes
  enable_two_factor boolean not null default true,
  require_two_factor_for_admins boolean not null default true,
  user_registration_approval boolean not null default false,
  auto_approve_verified_users boolean not null default true,
  profile_picture_required boolean not null default false,
  bio_max_length integer not null default 500,
  allow_profile_customization boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Content Moderation Settings Table
create table if not exists public.content_moderation_settings (
  id uuid primary key default gen_random_uuid(),
  auto_moderation_enabled boolean not null default true,
  profanity_filter boolean not null default true,
  spam_detection boolean not null default true,
  image_moderation boolean not null default true,
  video_moderation boolean not null default false,
  report_threshold integer not null default 3,
  auto_hide_threshold integer not null default 5,
  auto_delete_threshold integer not null default 10,
  moderation_queue_size integer not null default 50,
  require_approval_for_new_users boolean not null default false,
  require_approval_for_verified_users boolean not null default false,
  allow_user_reports boolean not null default true,
  allow_anonymous_reports boolean not null default false,
  moderation_response_time integer not null default 24, -- hours
  escalation_enabled boolean not null default true,
  escalation_threshold integer not null default 2,
  appeal_process_enabled boolean not null default true,
  appeal_deadline integer not null default 7, -- days
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Email Notification Settings Table
create table if not exists public.email_notification_settings (
  id uuid primary key default gen_random_uuid(),
  smtp_enabled boolean not null default true,
  smtp_host text not null default 'smtp.gmail.com',
  smtp_port integer not null default 587,
  smtp_username text,
  smtp_password text,
  smtp_secure boolean not null default true,
  from_email text not null default 'noreply@bltz.com',
  from_name text not null default 'BLTZ Platform',
  welcome_email_enabled boolean not null default true,
  password_reset_enabled boolean not null default true,
  email_verification_enabled boolean not null default true,
  notification_digest_enabled boolean not null default true,
  digest_frequency text not null default 'daily' check (digest_frequency in ('daily', 'weekly', 'monthly', 'disabled')),
  marketing_emails_enabled boolean not null default false,
  system_alerts_enabled boolean not null default true,
  moderation_alerts_enabled boolean not null default true,
  user_reports_enabled boolean not null default true,
  admin_notifications_enabled boolean not null default true,
  email_templates_enabled boolean not null default true,
  email_tracking_enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Security Settings Table
create table if not exists public.security_settings (
  id uuid primary key default gen_random_uuid(),
  require_https boolean not null default true,
  session_timeout integer not null default 24, -- hours
  max_login_attempts integer not null default 5,
  lockout_duration integer not null default 30, -- minutes
  password_min_length integer not null default 8,
  require_strong_password boolean not null default true,
  password_expiry_days integer not null default 90,
  two_factor_required boolean not null default false,
  two_factor_required_for_admins boolean not null default true,
  ip_whitelist_enabled boolean not null default false,
  allowed_ips text[],
  rate_limiting_enabled boolean not null default true,
  rate_limit_requests integer not null default 100,
  rate_limit_window integer not null default 15, -- minutes
  csrf_protection boolean not null default true,
  xss_protection boolean not null default true,
  sql_injection_protection boolean not null default true,
  file_upload_security boolean not null default true,
  audit_logging boolean not null default true,
  security_headers boolean not null default true,
  cors_enabled boolean not null default true,
  cors_origins text not null default '*',
  api_key_required boolean not null default false,
  api_rate_limit integer not null default 1000, -- requests per hour
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- System Settings Table
create table if not exists public.system_settings (
  id uuid primary key default gen_random_uuid(),
  maintenance_mode boolean not null default false,
  debug_mode boolean not null default false,
  log_level text not null default 'info' check (log_level in ('error', 'warn', 'info', 'debug')),
  cache_enabled boolean not null default true,
  cache_ttl integer not null default 3600, -- seconds
  database_pool_size integer not null default 10,
  max_connections integer not null default 100,
  backup_enabled boolean not null default true,
  backup_frequency text not null default 'daily' check (backup_frequency in ('hourly', 'daily', 'weekly', 'monthly')),
  backup_retention integer not null default 30, -- days
  monitoring_enabled boolean not null default true,
  performance_monitoring boolean not null default true,
  error_tracking boolean not null default true,
  analytics_enabled boolean not null default true,
  cdn_enabled boolean not null default false,
  cdn_url text,
  compression_enabled boolean not null default true,
  image_optimization boolean not null default true,
  video_processing boolean not null default true,
  thumbnail_generation boolean not null default true,
  max_upload_size integer not null default 100, -- MB
  max_concurrent_uploads integer not null default 5,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Integration Settings Table
create table if not exists public.integration_settings (
  id uuid primary key default gen_random_uuid(),
  -- Social Media
  twitter_enabled boolean not null default false,
  twitter_api_key text,
  twitter_api_secret text,
  facebook_enabled boolean not null default false,
  facebook_app_id text,
  facebook_app_secret text,
  instagram_enabled boolean not null default false,
  instagram_client_id text,
  instagram_client_secret text,
  youtube_enabled boolean not null default false,
  youtube_api_key text,
  tiktok_enabled boolean not null default false,
  tiktok_client_key text,
  tiktok_client_secret text,
  -- Payment
  stripe_enabled boolean not null default false,
  stripe_publishable_key text,
  stripe_secret_key text,
  paypal_enabled boolean not null default false,
  paypal_client_id text,
  paypal_client_secret text,
  -- Analytics
  google_analytics_enabled boolean not null default false,
  google_analytics_id text,
  mixpanel_enabled boolean not null default false,
  mixpanel_token text,
  amplitude_enabled boolean not null default false,
  amplitude_api_key text,
  -- Communication
  sendgrid_enabled boolean not null default false,
  sendgrid_api_key text,
  twilio_enabled boolean not null default false,
  twilio_account_sid text,
  twilio_auth_token text,
  slack_enabled boolean not null default false,
  slack_webhook_url text,
  -- Storage
  aws_s3_enabled boolean not null default false,
  aws_access_key_id text,
  aws_secret_access_key text,
  aws_bucket_name text,
  cloudinary_enabled boolean not null default false,
  cloudinary_cloud_name text,
  cloudinary_api_key text,
  cloudinary_api_secret text,
  -- AI/ML
  openai_enabled boolean not null default false,
  openai_api_key text,
  moderation_api_enabled boolean not null default false,
  moderation_api_key text,
  image_recognition_enabled boolean not null default false,
  image_recognition_api_key text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Enable RLS on all tables
alter table public.site_configuration enable row level security;
alter table public.user_management_settings enable row level security;
alter table public.content_moderation_settings enable row level security;
alter table public.email_notification_settings enable row level security;
alter table public.security_settings enable row level security;
alter table public.system_settings enable row level security;
alter table public.integration_settings enable row level security;

-- Create RLS policies for admin-only access
create policy "Admins can read site configuration" on public.site_configuration
  for select using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

create policy "Admins can write site configuration" on public.site_configuration
  for all using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  ) with check (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

create policy "Admins can read user management settings" on public.user_management_settings
  for select using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

create policy "Admins can write user management settings" on public.user_management_settings
  for all using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  ) with check (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

create policy "Admins can read content moderation settings" on public.content_moderation_settings
  for select using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

create policy "Admins can write content moderation settings" on public.content_moderation_settings
  for all using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  ) with check (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

create policy "Admins can read email notification settings" on public.email_notification_settings
  for select using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

create policy "Admins can write email notification settings" on public.email_notification_settings
  for all using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  ) with check (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

create policy "Admins can read security settings" on public.security_settings
  for select using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

create policy "Admins can write security settings" on public.security_settings
  for all using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  ) with check (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

create policy "Admins can read system settings" on public.system_settings
  for select using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

create policy "Admins can write system settings" on public.system_settings
  for all using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  ) with check (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

create policy "Admins can read integration settings" on public.integration_settings
  for select using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

create policy "Admins can write integration settings" on public.integration_settings
  for all using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  ) with check (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- Insert default settings
insert into public.site_configuration (site_name, site_description, site_url, maintenance_mode, registration_enabled, public_registration, default_user_role, max_file_size, allowed_file_types, timezone, language, theme)
values (
  'BLTZ Platform',
  'The ultimate social media platform for athletes and fans',
  'https://bltz.com',
  false,
  true,
  true,
  'fan',
  10,
  array['jpg', 'jpeg', 'png', 'mp4', 'mov'],
  'America/New_York',
  'en',
  'dark'
) on conflict do nothing;

insert into public.user_management_settings (require_email_verification, allow_username_changes, max_username_length, min_password_length, require_strong_password, session_timeout, max_login_attempts, lockout_duration, enable_two_factor, require_two_factor_for_admins, user_registration_approval, auto_approve_verified_users, profile_picture_required, bio_max_length, allow_profile_customization)
values (
  true, false, 20, 8, true, 24, 5, 30, true, true, false, true, false, 500, true
) on conflict do nothing;

insert into public.content_moderation_settings (auto_moderation_enabled, profanity_filter, spam_detection, image_moderation, video_moderation, report_threshold, auto_hide_threshold, auto_delete_threshold, moderation_queue_size, require_approval_for_new_users, require_approval_for_verified_users, allow_user_reports, allow_anonymous_reports, moderation_response_time, escalation_enabled, escalation_threshold, appeal_process_enabled, appeal_deadline)
values (
  true, true, true, true, false, 3, 5, 10, 50, false, false, true, false, 24, true, 2, true, 7
) on conflict do nothing;

insert into public.email_notification_settings (smtp_enabled, smtp_host, smtp_port, smtp_secure, from_email, from_name, welcome_email_enabled, password_reset_enabled, email_verification_enabled, notification_digest_enabled, digest_frequency, marketing_emails_enabled, system_alerts_enabled, moderation_alerts_enabled, user_reports_enabled, admin_notifications_enabled, email_templates_enabled, email_tracking_enabled)
values (
  true, 'smtp.gmail.com', 587, true, 'noreply@bltz.com', 'BLTZ Platform', true, true, true, true, 'daily', false, true, true, true, true, true, true
) on conflict do nothing;

insert into public.security_settings (require_https, session_timeout, max_login_attempts, lockout_duration, password_min_length, require_strong_password, password_expiry_days, two_factor_required, two_factor_required_for_admins, ip_whitelist_enabled, rate_limiting_enabled, rate_limit_requests, rate_limit_window, csrf_protection, xss_protection, sql_injection_protection, file_upload_security, audit_logging, security_headers, cors_enabled, cors_origins, api_key_required, api_rate_limit)
values (
  true, 24, 5, 30, 8, true, 90, false, true, false, true, 100, 15, true, true, true, true, true, true, true, '*', false, 1000
) on conflict do nothing;

insert into public.system_settings (maintenance_mode, debug_mode, log_level, cache_enabled, cache_ttl, database_pool_size, max_connections, backup_enabled, backup_frequency, backup_retention, monitoring_enabled, performance_monitoring, error_tracking, analytics_enabled, cdn_enabled, compression_enabled, image_optimization, video_processing, thumbnail_generation, max_upload_size, max_concurrent_uploads)
values (
  false, false, 'info', true, 3600, 10, 100, true, 'daily', 30, true, true, true, true, false, true, true, true, true, 100, 5
) on conflict do nothing;

insert into public.integration_settings (twitter_enabled, facebook_enabled, instagram_enabled, youtube_enabled, tiktok_enabled, stripe_enabled, paypal_enabled, google_analytics_enabled, mixpanel_enabled, amplitude_enabled, sendgrid_enabled, twilio_enabled, slack_enabled, aws_s3_enabled, cloudinary_enabled, openai_enabled, moderation_api_enabled, image_recognition_enabled)
values (
  false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false
) on conflict do nothing;
