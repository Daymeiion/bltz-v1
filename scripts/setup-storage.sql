-- Storage bucket setup for message images
-- Run this in Supabase SQL editor after creating the messaging tables

-- Create storage bucket for message images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'message-images',
  'message-images',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
) ON CONFLICT (id) DO NOTHING;

-- Create RLS policies for message-images bucket
CREATE POLICY "Users can view message images" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'message-images' AND
    (
      -- Users can view images from their own messages
      EXISTS (
        SELECT 1 FROM public.messages m
        JOIN public.message_attachments ma ON ma.message_id = m.id
        WHERE ma.file_path LIKE '%' || name || '%'
        AND (m.sender_id = auth.uid() OR m.recipient_id = auth.uid())
      ) OR
      -- Admins can view all images
      EXISTS (
        SELECT 1 FROM public.profiles p
        WHERE p.id = auth.uid() AND p.role = 'admin'
      )
    )
  );

CREATE POLICY "Users can upload message images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'message-images' AND
    auth.uid() IS NOT NULL
  );

CREATE POLICY "Users can update their message images" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'message-images' AND
    auth.uid() IS NOT NULL
  );

CREATE POLICY "Users can delete their message images" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'message-images' AND
    auth.uid() IS NOT NULL
  );

-- Create function to clean up orphaned images
CREATE OR REPLACE FUNCTION cleanup_orphaned_images()
RETURNS void AS $$
BEGIN
  -- Delete images that are no longer referenced by any message attachments
  DELETE FROM storage.objects
  WHERE bucket_id = 'message-images'
  AND NOT EXISTS (
    SELECT 1 FROM public.message_attachments ma
    WHERE ma.file_path LIKE '%' || name || '%'
  );
END;
$$ LANGUAGE plpgsql;

-- Create a scheduled job to clean up orphaned images (optional)
-- This would need to be set up in Supabase dashboard or via cron
-- SELECT cron.schedule('cleanup-orphaned-images', '0 2 * * *', 'SELECT cleanup_orphaned_images();');
