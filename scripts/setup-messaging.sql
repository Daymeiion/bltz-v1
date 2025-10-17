-- Messaging system schema for BLTZ Platform
-- This script creates the necessary tables for admin-to-user messaging

-- Messages table
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  recipient_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  content TEXT NOT NULL,
  message_type TEXT NOT NULL DEFAULT 'admin_to_user' CHECK (message_type IN ('admin_to_user', 'user_to_admin', 'user_to_user')),
  priority TEXT NOT NULL DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  status TEXT NOT NULL DEFAULT 'sent' CHECK (status IN ('draft', 'sent', 'delivered', 'read', 'archived')),
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Message attachments table
CREATE TABLE IF NOT EXISTS public.message_attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id UUID NOT NULL REFERENCES public.messages(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  mime_type TEXT NOT NULL,
  file_type TEXT NOT NULL DEFAULT 'image' CHECK (file_type IN ('image', 'document', 'video', 'audio')),
  width INTEGER, -- For images
  height INTEGER, -- For images
  thumbnail_path TEXT, -- For images
  is_compressed BOOLEAN NOT NULL DEFAULT FALSE,
  original_size INTEGER, -- Original file size before compression
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Message threads table (for grouping related messages)
CREATE TABLE IF NOT EXISTS public.message_threads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject TEXT NOT NULL,
  last_message_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add thread_id to messages table
ALTER TABLE public.messages 
ADD COLUMN IF NOT EXISTS thread_id UUID REFERENCES public.message_threads(id) ON DELETE SET NULL;

-- Message recipients table (for group messages)
CREATE TABLE IF NOT EXISTS public.message_recipients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id UUID NOT NULL REFERENCES public.messages(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(message_id, user_id)
);

-- Message templates table (for admin to use pre-written messages)
CREATE TABLE IF NOT EXISTS public.message_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  subject TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'general' CHECK (category IN ('general', 'welcome', 'warning', 'notification', 'announcement')),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_recipients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_templates ENABLE ROW LEVEL SECURITY;

-- RLS Policies for messages table
CREATE POLICY "Users can view their own messages" ON public.messages
  FOR SELECT USING (
    auth.uid() = sender_id OR 
    auth.uid() = recipient_id OR
    EXISTS (
      SELECT 1 FROM public.message_recipients mr 
      WHERE mr.message_id = messages.id AND mr.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can insert messages" ON public.messages
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

CREATE POLICY "Users can insert messages to other users" ON public.messages
  FOR INSERT WITH CHECK (
    sender_id = auth.uid() AND 
    message_type = 'user_to_user' AND
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = recipient_id AND p.role IN ('player', 'publisher', 'fan')
    )
  );

CREATE POLICY "Admins can update messages" ON public.messages
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

CREATE POLICY "Admins can delete messages" ON public.messages
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

-- RLS Policies for message_attachments table
CREATE POLICY "Users can view attachments for their messages" ON public.message_attachments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.messages m
      WHERE m.id = message_attachments.message_id AND (
        m.sender_id = auth.uid() OR 
        m.recipient_id = auth.uid() OR
        EXISTS (
          SELECT 1 FROM public.message_recipients mr 
          WHERE mr.message_id = m.id AND mr.user_id = auth.uid()
        )
      )
    )
  );

CREATE POLICY "Admins can manage attachments" ON public.message_attachments
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

-- RLS Policies for message_threads table
CREATE POLICY "Users can view threads they participate in" ON public.message_threads
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.messages m
      WHERE m.thread_id = message_threads.id AND (
        m.sender_id = auth.uid() OR 
        m.recipient_id = auth.uid() OR
        EXISTS (
          SELECT 1 FROM public.message_recipients mr 
          WHERE mr.message_id = m.id AND mr.user_id = auth.uid()
        )
      )
    )
  );

CREATE POLICY "Admins can manage threads" ON public.message_threads
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

-- RLS Policies for message_recipients table
CREATE POLICY "Users can view their message recipients" ON public.message_recipients
  FOR SELECT USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.messages m
      WHERE m.id = message_recipients.message_id AND m.sender_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage recipients" ON public.message_recipients
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

-- RLS Policies for message_templates table
CREATE POLICY "Admins can manage templates" ON public.message_templates
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON public.messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_recipient_id ON public.messages(recipient_id);
CREATE INDEX IF NOT EXISTS idx_messages_thread_id ON public.messages(thread_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON public.messages(created_at);
CREATE INDEX IF NOT EXISTS idx_messages_status ON public.messages(status);
CREATE INDEX IF NOT EXISTS idx_messages_is_read ON public.messages(is_read);

CREATE INDEX IF NOT EXISTS idx_message_recipients_user_id ON public.message_recipients(user_id);
CREATE INDEX IF NOT EXISTS idx_message_recipients_message_id ON public.message_recipients(message_id);

CREATE INDEX IF NOT EXISTS idx_message_attachments_message_id ON public.message_attachments(message_id);
CREATE INDEX IF NOT EXISTS idx_message_attachments_file_type ON public.message_attachments(file_type);
CREATE INDEX IF NOT EXISTS idx_message_attachments_file_size ON public.message_attachments(file_size);

-- Insert some default message templates
INSERT INTO public.message_templates (name, subject, content, category, created_by) VALUES
  ('Welcome Message', 'Welcome to BLTZ Platform!', 'Welcome to the BLTZ platform! We''re excited to have you join our community of athletes and fans. If you have any questions, feel free to reach out to our support team.', 'welcome', (SELECT id FROM auth.users WHERE email = 'admin@bltz.com' LIMIT 1)),
  ('Account Verification', 'Please Verify Your Account', 'Thank you for signing up! Please verify your email address to complete your account setup and start using all platform features.', 'notification', (SELECT id FROM auth.users WHERE email = 'admin@bltz.com' LIMIT 1)),
  ('Platform Update', 'Important Platform Update', 'We''re excited to share some important updates about the BLTZ platform. Please check our latest features and improvements.', 'announcement', (SELECT id FROM auth.users WHERE email = 'admin@bltz.com' LIMIT 1))
ON CONFLICT DO NOTHING;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_messages_updated_at BEFORE UPDATE ON public.messages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_message_threads_updated_at BEFORE UPDATE ON public.message_threads FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_message_templates_updated_at BEFORE UPDATE ON public.message_templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
