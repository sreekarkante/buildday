-- BuildDay Database Schema
-- Run this in Supabase SQL Editor

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Colleges table (seeded with 100+ colleges)
CREATE TABLE IF NOT EXISTS colleges (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL
);

-- Champions table
CREATE TABLE IF NOT EXISTS champions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  college_id INTEGER REFERENCES colleges(id),
  code TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Registrants table
CREATE TABLE IF NOT EXISTS registrants (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  college_id INTEGER REFERENCES colleges(id),
  college_other TEXT,
  branch TEXT NOT NULL,
  grad_year INTEGER NOT NULL,
  slot TEXT NOT NULL,
  consent BOOLEAN NOT NULL DEFAULT false,
  ref_code TEXT UNIQUE NOT NULL,
  referred_by_code TEXT,
  champion_code TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_content TEXT,
  device TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Referrals table
CREATE TABLE IF NOT EXISTS referrals (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  referrer_id UUID NOT NULL REFERENCES registrants(id),
  referred_id UUID NOT NULL REFERENCES registrants(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(referrer_id, referred_id)
);

-- Analytics events table
CREATE TABLE IF NOT EXISTS events (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  session_id TEXT NOT NULL,
  type TEXT NOT NULL,
  step INTEGER,
  meta JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Rewards config table
CREATE TABLE IF NOT EXISTS rewards_config (
  id SERIAL PRIMARY KEY,
  threshold INTEGER NOT NULL,
  reward_name TEXT NOT NULL,
  description TEXT
);

-- Rewards unlocked table
CREATE TABLE IF NOT EXISTS rewards_unlocked (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  registrant_id UUID NOT NULL REFERENCES registrants(id),
  reward_id INTEGER NOT NULL REFERENCES rewards_config(id),
  unlocked_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(registrant_id, reward_id)
);

-- Matcher results table
CREATE TABLE IF NOT EXISTS matcher_results (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  session_id TEXT NOT NULL,
  branch TEXT,
  interest TEXT,
  level TEXT,
  result JSONB,
  registrant_id UUID REFERENCES registrants(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Submissions table (workshop day)
CREATE TABLE IF NOT EXISTS submissions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  registrant_id UUID NOT NULL REFERENCES registrants(id),
  link TEXT,
  answers JSONB,
  score INTEGER,
  feedback JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Daily college rank snapshot
CREATE TABLE IF NOT EXISTS daily_college_rank (
  id SERIAL PRIMARY KEY,
  date DATE NOT NULL,
  college_id INTEGER NOT NULL REFERENCES colleges(id),
  rank INTEGER NOT NULL,
  count INTEGER NOT NULL,
  UNIQUE(date, college_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_registrants_phone ON registrants(phone);
CREATE INDEX IF NOT EXISTS idx_registrants_email ON registrants(email);
CREATE INDEX IF NOT EXISTS idx_registrants_ref_code ON registrants(ref_code);
CREATE INDEX IF NOT EXISTS idx_registrants_referred_by ON registrants(referred_by_code);
CREATE INDEX IF NOT EXISTS idx_registrants_college ON registrants(college_id);
CREATE INDEX IF NOT EXISTS idx_registrants_champion ON registrants(champion_code);
CREATE INDEX IF NOT EXISTS idx_registrants_created ON registrants(created_at);
CREATE INDEX IF NOT EXISTS idx_events_session ON events(session_id);
CREATE INDEX IF NOT EXISTS idx_events_type ON events(type);
CREATE INDEX IF NOT EXISTS idx_events_created ON events(created_at);
CREATE INDEX IF NOT EXISTS idx_referrals_referrer ON referrals(referrer_id);
CREATE INDEX IF NOT EXISTS idx_champions_code ON champions(code);

-- Row Level Security
ALTER TABLE registrants ENABLE ROW LEVEL SECURITY;
ALTER TABLE colleges ENABLE ROW LEVEL SECURITY;
ALTER TABLE champions ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE rewards_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE rewards_unlocked ENABLE ROW LEVEL SECURITY;
ALTER TABLE matcher_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_college_rank ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Block all public access. Only service_role (used by API routes) can read/write.
-- Public (anon) gets read access ONLY to colleges (for the dropdown) and aggregate stats.

-- Colleges: public can read (for dropdown), only service_role can write
CREATE POLICY "Public can read colleges" ON colleges FOR SELECT TO anon USING (true);
CREATE POLICY "Service role full access to colleges" ON colleges FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Registrants: no public access at all (protects phone/email). Only service_role.
CREATE POLICY "Service role full access to registrants" ON registrants FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Events: no public access. Only service_role.
CREATE POLICY "Service role full access to events" ON events FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Referrals: no public access. Only service_role.
CREATE POLICY "Service role full access to referrals" ON referrals FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Rewards config: public can read (to show tiers), only service_role writes.
CREATE POLICY "Public can read rewards config" ON rewards_config FOR SELECT TO anon USING (true);
CREATE POLICY "Service role full access to rewards_config" ON rewards_config FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Rewards unlocked: no public access. Only service_role.
CREATE POLICY "Service role full access to rewards_unlocked" ON rewards_unlocked FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Matcher results: no public access. Only service_role.
CREATE POLICY "Service role full access to matcher_results" ON matcher_results FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Submissions: no public access. Only service_role.
CREATE POLICY "Service role full access to submissions" ON submissions FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Daily college rank: no public access. Only service_role.
CREATE POLICY "Service role full access to daily_college_rank" ON daily_college_rank FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Champions: no public access. Only service_role.
CREATE POLICY "Service role full access to champions" ON champions FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Seed rewards config
INSERT INTO rewards_config (threshold, reward_name, description) VALUES
  (3, 'AI Starter Kit', '5 AI project blueprints with step-by-step guides'),
  (5, 'Priority Seat + Certificate of Merit', 'Front-row access and a special certificate'),
  (10, 'Campus Champion Badge + Shoutout', 'Featured on our leaderboard and social media');

-- Seed colleges (100+ from Telangana, Andhra Pradesh, Karnataka)
INSERT INTO colleges (name, city, state) VALUES
  -- TELANGANA (40 colleges)
  ('JNTU Hyderabad', 'Hyderabad', 'Telangana'),
  ('Osmania University College of Engineering', 'Hyderabad', 'Telangana'),
  ('CBIT - Chaitanya Bharathi Institute of Technology', 'Hyderabad', 'Telangana'),
  ('VNRVJIET - VNR Vignana Jyothi Institute', 'Hyderabad', 'Telangana'),
  ('Vasavi College of Engineering', 'Hyderabad', 'Telangana'),
  ('MGIT - Mahatma Gandhi Institute of Technology', 'Hyderabad', 'Telangana'),
  ('MVSR Engineering College', 'Hyderabad', 'Telangana'),
  ('BVRIT - B V Raju Institute of Technology', 'Narsapur', 'Telangana'),
  ('GRIET - Gokaraju Rangaraju Institute', 'Hyderabad', 'Telangana'),
  ('CVR College of Engineering', 'Hyderabad', 'Telangana'),
  ('SNIST - Sreenidhi Institute of Science and Technology', 'Hyderabad', 'Telangana'),
  ('MLRIT - MLR Institute of Technology', 'Hyderabad', 'Telangana'),
  ('KMIT - Keshav Memorial Institute of Technology', 'Hyderabad', 'Telangana'),
  ('KITS - Kakatiya Institute of Technology and Science', 'Warangal', 'Telangana'),
  ('CMR College of Engineering and Technology', 'Hyderabad', 'Telangana'),
  ('CMR Institute of Technology', 'Hyderabad', 'Telangana'),
  ('TKR College of Engineering and Technology', 'Hyderabad', 'Telangana'),
  ('Vardhaman College of Engineering', 'Hyderabad', 'Telangana'),
  ('Malla Reddy College of Engineering', 'Hyderabad', 'Telangana'),
  ('Malla Reddy Engineering College', 'Hyderabad', 'Telangana'),
  ('Anurag University', 'Hyderabad', 'Telangana'),
  ('Guru Nanak Institutions Technical Campus', 'Hyderabad', 'Telangana'),
  ('IIIT Hyderabad', 'Hyderabad', 'Telangana'),
  ('BITS Pilani Hyderabad Campus', 'Hyderabad', 'Telangana'),
  ('Nalla Malla Reddy Engineering College', 'Hyderabad', 'Telangana'),
  ('Muffakham Jah College of Engineering', 'Hyderabad', 'Telangana'),
  ('Deccan College of Engineering and Technology', 'Hyderabad', 'Telangana'),
  ('IST - Institute of Science and Technology', 'Hyderabad', 'Telangana'),
  ('Lords Institute of Engineering and Technology', 'Hyderabad', 'Telangana'),
  ('Stanley College of Engineering and Technology', 'Hyderabad', 'Telangana'),
  ('St. Martin''s Engineering College', 'Hyderabad', 'Telangana'),
  ('Geethanjali College of Engineering and Technology', 'Hyderabad', 'Telangana'),
  ('Joginpally B.R. Engineering College', 'Hyderabad', 'Telangana'),
  ('Matrusri Engineering College', 'Hyderabad', 'Telangana'),
  ('Vignan Institute of Technology and Science', 'Hyderabad', 'Telangana'),
  ('Sreyas Institute of Engineering and Technology', 'Hyderabad', 'Telangana'),
  ('Aurora''s Engineering College', 'Hyderabad', 'Telangana'),
  ('Methodist College of Engineering and Technology', 'Hyderabad', 'Telangana'),
  ('NIT Warangal', 'Warangal', 'Telangana'),
  ('Kakatiya University College of Engineering', 'Warangal', 'Telangana'),

  -- ANDHRA PRADESH (35 colleges)
  ('JNTU Kakinada', 'Kakinada', 'Andhra Pradesh'),
  ('JNTU Anantapur', 'Anantapur', 'Andhra Pradesh'),
  ('Andhra University College of Engineering', 'Visakhapatnam', 'Andhra Pradesh'),
  ('SVUCE - Sri Venkateswara University', 'Tirupati', 'Andhra Pradesh'),
  ('RVR & JC College of Engineering', 'Guntur', 'Andhra Pradesh'),
  ('KL University (KL Deemed)', 'Vijayawada', 'Andhra Pradesh'),
  ('VIT-AP University', 'Amaravati', 'Andhra Pradesh'),
  ('SRM University AP', 'Amaravati', 'Andhra Pradesh'),
  ('GITAM University', 'Visakhapatnam', 'Andhra Pradesh'),
  ('Vignan''s University', 'Guntur', 'Andhra Pradesh'),
  ('Sasi Institute of Technology and Engineering', 'Tadepalligudem', 'Andhra Pradesh'),
  ('NEC - Narasaraopeta Engineering College', 'Narasaraopet', 'Andhra Pradesh'),
  ('Anil Neerukonda Institute of Technology', 'Visakhapatnam', 'Andhra Pradesh'),
  ('MVGR College of Engineering', 'Vizianagaram', 'Andhra Pradesh'),
  ('Raghu Engineering College', 'Visakhapatnam', 'Andhra Pradesh'),
  ('GMR Institute of Technology', 'Rajam', 'Andhra Pradesh'),
  ('Lakireddy Bali Reddy College of Engineering', 'Mylavaram', 'Andhra Pradesh'),
  ('Velagapudi Ramakrishna Siddhartha Engineering College', 'Vijayawada', 'Andhra Pradesh'),
  ('Prasad V Potluri Siddhartha Institute of Technology', 'Vijayawada', 'Andhra Pradesh'),
  ('Potti Sriramulu Chalavadi Mallikarjuna Rao College', 'Vijayawada', 'Andhra Pradesh'),
  ('Gudlavalleru Engineering College', 'Gudlavalleru', 'Andhra Pradesh'),
  ('Bapatla Engineering College', 'Bapatla', 'Andhra Pradesh'),
  ('SVEC - Sri Vasavi Engineering College', 'Tadepalligudem', 'Andhra Pradesh'),
  ('QIS College of Engineering and Technology', 'Ongole', 'Andhra Pradesh'),
  ('Vignan''s Institute of Engineering for Women', 'Visakhapatnam', 'Andhra Pradesh'),
  ('IIIT Sri City', 'Sri City', 'Andhra Pradesh'),
  ('IIIT RK Valley', 'Kadapa', 'Andhra Pradesh'),
  ('NIT Andhra Pradesh', 'Tadepalligudem', 'Andhra Pradesh'),
  ('Centurion University', 'Vizianagaram', 'Andhra Pradesh'),
  ('SRKR Engineering College', 'Bhimavaram', 'Andhra Pradesh'),
  ('DNR College of Engineering and Technology', 'Bhimavaram', 'Andhra Pradesh'),
  ('Chirala Engineering College', 'Chirala', 'Andhra Pradesh'),
  ('Audisankara College of Engineering', 'Gudur', 'Andhra Pradesh'),
  ('Sree Vidyanikethan Engineering College', 'Tirupati', 'Andhra Pradesh'),
  ('NBKR Institute of Science and Technology', 'Nellore', 'Andhra Pradesh'),

  -- KARNATAKA (35 colleges)
  ('BMS College of Engineering', 'Bengaluru', 'Karnataka'),
  ('RV College of Engineering', 'Bengaluru', 'Karnataka'),
  ('PES University', 'Bengaluru', 'Karnataka'),
  ('MS Ramaiah Institute of Technology', 'Bengaluru', 'Karnataka'),
  ('Dayananda Sagar College of Engineering', 'Bengaluru', 'Karnataka'),
  ('BMS Institute of Technology', 'Bengaluru', 'Karnataka'),
  ('RNSIT - RNS Institute of Technology', 'Bengaluru', 'Karnataka'),
  ('NMIT - Nitte Meenakshi Institute of Technology', 'Bengaluru', 'Karnataka'),
  ('Sapthagiri College of Engineering', 'Bengaluru', 'Karnataka'),
  ('CMR Institute of Technology Bengaluru', 'Bengaluru', 'Karnataka'),
  ('AMC Engineering College', 'Bengaluru', 'Karnataka'),
  ('NIE - National Institute of Engineering', 'Mysuru', 'Karnataka'),
  ('SJCE - Sri Jayachamarajendra College of Engineering', 'Mysuru', 'Karnataka'),
  ('BIT - B.M.S. Institute of Technology', 'Bengaluru', 'Karnataka'),
  ('JSS Science and Technology University', 'Mysuru', 'Karnataka'),
  ('Siddaganga Institute of Technology', 'Tumkur', 'Karnataka'),
  ('Nitte Institute of Technology', 'Mangaluru', 'Karnataka'),
  ('PESIT - PES Institute of Technology South Campus', 'Bengaluru', 'Karnataka'),
  ('Cambridge Institute of Technology', 'Bengaluru', 'Karnataka'),
  ('East West Institute of Technology', 'Bengaluru', 'Karnataka'),
  ('MVJ College of Engineering', 'Bengaluru', 'Karnataka'),
  ('Vidyavardhaka College of Engineering', 'Mysuru', 'Karnataka'),
  ('KLE Technological University', 'Hubballi', 'Karnataka'),
  ('SDM College of Engineering and Technology', 'Dharwad', 'Karnataka'),
  ('Basaveshwar Engineering College', 'Bagalkot', 'Karnataka'),
  ('RVCE - Rashtreeya Vidyalaya College', 'Bengaluru', 'Karnataka'),
  ('Sir M Visvesvaraya Institute of Technology', 'Bengaluru', 'Karnataka'),
  ('New Horizon College of Engineering', 'Bengaluru', 'Karnataka'),
  ('Global Academy of Technology', 'Bengaluru', 'Karnataka'),
  ('Nagarjuna College of Engineering and Technology', 'Bengaluru', 'Karnataka'),
  ('BMSCE - Bangalore Medical Sciences College of Engineering', 'Bengaluru', 'Karnataka'),
  ('DSCE - Dayananda Sagar College', 'Bengaluru', 'Karnataka'),
  ('IIIT Dharwad', 'Dharwad', 'Karnataka'),
  ('NIT Karnataka Surathkal', 'Mangaluru', 'Karnataka'),
  ('NITK Surathkal', 'Surathkal', 'Karnataka');
