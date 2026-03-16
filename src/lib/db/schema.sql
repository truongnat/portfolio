-- Skill Tree Donation System Database Schema
-- For Cloudflare D1 (SQLite)

-- Skills table
CREATE TABLE IF NOT EXISTS skills (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  category TEXT NOT NULL,
  cost INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'locked' CHECK (status IN ('locked', 'funding', 'unlocked', 'completed', 'mastered')),
  prerequisites TEXT DEFAULT '[]', -- JSON array of skill IDs
  position_x REAL NOT NULL DEFAULT 0,
  position_y REAL NOT NULL DEFAULT 0,
  color TEXT NOT NULL DEFAULT 'gray',
  total_donated INTEGER NOT NULL DEFAULT 0,
  progress REAL NOT NULL DEFAULT 0,
  metadata TEXT, -- JSON metadata
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Donations table
CREATE TABLE IF NOT EXISTS donations (
  id TEXT PRIMARY KEY,
  donator_id TEXT NOT NULL,
  donator_name TEXT NOT NULL,
  donator_email TEXT,
  amount INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  skill_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  payment_method TEXT NOT NULL CHECK (payment_method IN ('stripe', 'crypto', 'paypal', 'manual')),
  transaction_id TEXT,
  message TEXT,
  is_anonymous INTEGER NOT NULL DEFAULT 0,
  badge_earned_id TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (skill_id) REFERENCES skills(id)
);

-- Donators table (for tracking repeat donators)
CREATE TABLE IF NOT EXISTS donators (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE,
  total_donated INTEGER NOT NULL DEFAULT 0,
  skills_unlocked TEXT DEFAULT '[]', -- JSON array of skill IDs
  badges_earned TEXT DEFAULT '[]', -- JSON array of badge IDs
  joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  is_anonymous INTEGER NOT NULL DEFAULT 0,
  leaderboard_rank INTEGER
);

-- Badges table
CREATE TABLE IF NOT EXISTS badges (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  color TEXT NOT NULL,
  requirement_type TEXT NOT NULL CHECK (requirement_type IN ('single', 'category', 'total')),
  requirement_amount INTEGER NOT NULL,
  requirement_skill_id TEXT,
  requirement_category TEXT
);

-- Certificates table
CREATE TABLE IF NOT EXISTS certificates (
  id TEXT PRIMARY KEY,
  donator_id TEXT NOT NULL,
  donator_name TEXT NOT NULL,
  skill_id TEXT NOT NULL,
  skill_name TEXT NOT NULL,
  amount INTEGER NOT NULL,
  issued_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  certificate_url TEXT,
  verification_hash TEXT UNIQUE,
  FOREIGN KEY (donator_id) REFERENCES donators(id),
  FOREIGN KEY (skill_id) REFERENCES skills(id)
);

-- Crypto payments table
CREATE TABLE IF NOT EXISTS crypto_payments (
  id TEXT PRIMARY KEY,
  skill_id TEXT NOT NULL,
  skill_name TEXT NOT NULL,
  amount_usd INTEGER NOT NULL,
  crypto_currency TEXT NOT NULL,
  crypto_amount TEXT NOT NULL,
  wallet_address TEXT NOT NULL,
  donator_name TEXT NOT NULL,
  donator_email TEXT NOT NULL,
  is_anonymous INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'expired')),
  qr_code_data TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  expires_at DATETIME NOT NULL,
  confirmed_at DATETIME,
  transaction_hash TEXT,
  FOREIGN KEY (skill_id) REFERENCES skills(id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_donations_skill_id ON donations(skill_id);
CREATE INDEX IF NOT EXISTS idx_donations_status ON donations(status);
CREATE INDEX IF NOT EXISTS idx_donations_donator_id ON donations(donator_id);
CREATE INDEX IF NOT EXISTS idx_donations_created_at ON donations(created_at);
CREATE INDEX IF NOT EXISTS idx_skills_category ON skills(category);
CREATE INDEX IF NOT EXISTS idx_skills_status ON skills(status);
CREATE INDEX IF NOT EXISTS idx_certificates_donator_id ON certificates(donator_id);
CREATE INDEX IF NOT EXISTS idx_crypto_payments_status ON crypto_payments(status);

-- Trigger to update skills.total_donated and progress when donation is completed
CREATE TRIGGER IF NOT EXISTS update_skill_on_donation
AFTER UPDATE OF status ON donations
WHEN NEW.status = 'completed' AND OLD.status != 'completed'
BEGIN
  UPDATE skills SET
    total_donated = total_donated + NEW.amount,
    progress = MIN(100, ROUND((total_donated + NEW.amount) * 100.0 / cost, 2)),
    status = CASE
      WHEN total_donated + NEW.amount >= cost THEN 'unlocked'
      WHEN total_donated + NEW.amount > 0 THEN 'funding'
      ELSE status
    END,
    updated_at = CURRENT_TIMESTAMP
  WHERE id = NEW.skill_id;
END;

-- Trigger to update donator total when donation is completed
CREATE TRIGGER IF NOT EXISTS update_donator_on_donation
AFTER UPDATE OF status ON donations
WHEN NEW.status = 'completed' AND OLD.status != 'completed'
BEGIN
  UPDATE donators SET
    total_donated = total_donated + NEW.amount,
    updated_at = CURRENT_TIMESTAMP
  WHERE id = NEW.donator_id;
END;

-- Insert default badges
INSERT OR IGNORE INTO badges (id, name, description, icon, color, requirement_type, requirement_amount, requirement_category) VALUES
  ('first-unlock', 'First Unlock', 'Unlock your first skill', 'Unlock', 'green', 'single', 1, NULL),
  ('ai-sponsor', 'AI Sponsor', 'Sponsor $100+ in AI/ML skills', 'Bot', 'violet', 'category', 100, 'ai-ml'),
  ('generous-learner', 'Generous Learner', 'Donate $500+ total', 'Heart', 'rose', 'total', 500, NULL),
  ('skill-master', 'Skill Master', 'Fully fund a $300+ skill', 'Crown', 'yellow', 'single', 300, NULL);
