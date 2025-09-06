-- Final Stage Plot Setup for Supabase
-- Copy and paste this entire script into your Supabase SQL Editor

-- Step 1: Create the stageplots table
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

-- Step 2: Create indexes
CREATE INDEX IF NOT EXISTS idx_stageplots_user_id ON stageplots(user_id);
CREATE INDEX IF NOT EXISTS idx_stageplots_rider_id ON stageplots(rider_id);
CREATE INDEX IF NOT EXISTS idx_stageplots_created_at ON stageplots(created_at DESC);

-- Step 3: Enable RLS
ALTER TABLE stageplots ENABLE ROW LEVEL SECURITY;

-- Step 4: Create security policies (without IF NOT EXISTS)
CREATE POLICY "stageplots_select_policy" ON stageplots
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "stageplots_insert_policy" ON stageplots
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "stageplots_update_policy" ON stageplots
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "stageplots_delete_policy" ON stageplots
  FOR DELETE USING (auth.uid() = user_id);

-- Step 5: Create trigger for updated_at
CREATE TRIGGER update_stageplots_updated_at BEFORE UPDATE ON stageplots
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
