-- Create enquiries table for storing contact form submissions
CREATE TABLE IF NOT EXISTS enquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  name text NOT NULL,
  email text NOT NULL,
  service text,
  message text,
  file_urls text[],
  page_url text
);

-- Enable RLS but allow public inserts (no auth required for enquiry form)
ALTER TABLE enquiries ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert enquiries (public contact form)
CREATE POLICY "Allow public inserts" ON enquiries
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Only authenticated users (admin) can view enquiries
CREATE POLICY "Allow authenticated reads" ON enquiries
  FOR SELECT
  TO authenticated
  USING (true);
