-- Manual table creation script for Supabase
-- Run this in your Supabase SQL Editor if automatic creation fails

-- Create productivity_sessions table
CREATE TABLE IF NOT EXISTS productivity_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  date DATE NOT NULL,
  check_in_time TIME,
  check_out_time TIME,
  total_awake_time INTEGER DEFAULT 0,
  total_productive_time INTEGER DEFAULT 0,
  total_non_productive_time INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  session_id UUID REFERENCES productivity_sessions(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  duration INTEGER DEFAULT 0,
  is_running BOOLEAN DEFAULT FALSE,
  is_paused BOOLEAN DEFAULT FALSE,
  last_start_time TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_productivity_sessions_user_date ON productivity_sessions(user_id, date);
CREATE INDEX IF NOT EXISTS idx_tasks_session_id ON tasks(session_id);
CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id);

-- Enable Row Level Security (optional - for better security)
ALTER TABLE productivity_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Create policies (optional - allows all operations for now)
CREATE POLICY "Allow all operations on productivity_sessions" ON productivity_sessions
  FOR ALL USING (true);

CREATE POLICY "Allow all operations on tasks" ON tasks
  FOR ALL USING (true);
