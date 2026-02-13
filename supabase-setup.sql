-- ============================================
-- Roomates - Supabase Database Setup
-- Run this in Supabase SQL Editor
-- ============================================

-- Profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  age INTEGER NOT NULL CHECK (age >= 16 AND age <= 99),
  major TEXT,
  gender TEXT CHECK (gender IN ('male', 'female', 'non-binary', 'other')),
  location TEXT NOT NULL,
  same_gender_pref TEXT DEFAULT 'no_preference' CHECK (same_gender_pref IN ('yes', 'no', 'no_preference')),
  max_price INTEGER,
  move_in_date DATE,
  job_type TEXT CHECK (job_type IN ('internship', 'full_time')),
  bio TEXT,
  contact_info TEXT,
  photo_urls TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_profiles_user_id ON profiles(user_id);
CREATE INDEX idx_profiles_location ON profiles(location);
CREATE INDEX idx_profiles_gender ON profiles(gender);
CREATE INDEX idx_profiles_is_active ON profiles(is_active);
CREATE INDEX idx_profiles_max_price ON profiles(max_price);

-- Swipes table
CREATE TABLE swipes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  swiper_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  swiped_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL CHECK (action IN ('interested', 'pass')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(swiper_id, swiped_id)
);

CREATE INDEX idx_swipes_swiper ON swipes(swiper_id);
CREATE INDEX idx_swipes_swiped ON swipes(swiped_id);

-- Matches table
CREATE TABLE matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user1_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user2_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user1_id, user2_id)
);

CREATE INDEX idx_matches_user1 ON matches(user1_id);
CREATE INDEX idx_matches_user2 ON matches(user2_id);

-- ============================================
-- Auto-create match on mutual interest
-- ============================================
CREATE OR REPLACE FUNCTION check_and_create_match()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.action = 'interested' THEN
    IF EXISTS (
      SELECT 1 FROM swipes
      WHERE swiper_id = NEW.swiped_id
        AND swiped_id = NEW.swiper_id
        AND action = 'interested'
    ) THEN
      INSERT INTO matches (user1_id, user2_id)
      VALUES (
        LEAST(NEW.swiper_id, NEW.swiped_id),
        GREATEST(NEW.swiper_id, NEW.swiped_id)
      )
      ON CONFLICT DO NOTHING;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_swipe_check_match
  AFTER INSERT ON swipes
  FOR EACH ROW
  EXECUTE FUNCTION check_and_create_match();

-- ============================================
-- Auto-update updated_at on profile change
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_profile_update
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- ============================================
-- Row Level Security
-- ============================================

-- Profiles RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Active profiles viewable by authenticated users"
  ON profiles FOR SELECT
  USING (auth.role() = 'authenticated' AND (is_active = TRUE OR auth.uid() = user_id));

CREATE POLICY "Users can create own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own profile"
  ON profiles FOR DELETE
  USING (auth.uid() = user_id);

-- Swipes RLS
ALTER TABLE swipes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can create own swipes"
  ON swipes FOR INSERT
  WITH CHECK (auth.uid() = swiper_id);

CREATE POLICY "Users can read own swipes"
  ON swipes FOR SELECT
  USING (auth.uid() = swiper_id);

-- Matches RLS
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can see own matches"
  ON matches FOR SELECT
  USING (auth.uid() = user1_id OR auth.uid() = user2_id);

-- ============================================
-- Storage: Create profile-photos bucket
-- Do this in Supabase Dashboard:
-- 1. Go to Storage > New Bucket
-- 2. Name: "profile-photos"
-- 3. Public: ON
-- 4. Add these policies:
-- ============================================

-- Storage policies (run after creating the bucket):
-- Allow authenticated users to upload to their own folder
-- INSERT policy: bucket_id = 'profile-photos' AND auth.uid()::text = (storage.foldername(name))[1]
-- DELETE policy: bucket_id = 'profile-photos' AND auth.uid()::text = (storage.foldername(name))[1]
-- SELECT policy: bucket_id = 'profile-photos' (public read)
