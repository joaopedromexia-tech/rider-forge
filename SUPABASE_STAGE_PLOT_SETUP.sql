-- Stage Plot Database Setup for Supabase
-- Run this in your Supabase SQL Editor

-- 1. Create stage plots table
CREATE TABLE IF NOT EXISTS stageplots (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  rider_id UUID REFERENCES riders(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  layout_data JSONB NOT NULL DEFAULT '{}',
  png_data TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(rider_id)
);

-- 2. Create indexes
CREATE INDEX IF NOT EXISTS idx_stageplots_user_id ON stageplots(user_id);
CREATE INDEX IF NOT EXISTS idx_stageplots_rider_id ON stageplots(rider_id);
CREATE INDEX IF NOT EXISTS idx_stageplots_created_at ON stageplots(created_at DESC);

-- 3. Enable RLS
ALTER TABLE stageplots ENABLE ROW LEVEL SECURITY;

-- 4. Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Users can view own stage plots" ON stageplots;
DROP POLICY IF EXISTS "Users can insert own stage plots" ON stageplots;
DROP POLICY IF EXISTS "Users can update own stage plots" ON stageplots;
DROP POLICY IF EXISTS "Users can delete own stage plots" ON stageplots;

-- 5. Create security policies
CREATE POLICY "Users can view own stage plots" ON stageplots
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own stage plots" ON stageplots
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own stage plots" ON stageplots
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own stage plots" ON stageplots
  FOR DELETE USING (auth.uid() = user_id);

-- 6. Create trigger for updated_at (only if function exists)
DROP TRIGGER IF EXISTS update_stageplots_updated_at ON stageplots;
CREATE TRIGGER update_stageplots_updated_at BEFORE UPDATE ON stageplots
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
