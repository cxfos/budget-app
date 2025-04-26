-- Add deleted_at column to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;

-- Add deleted_at column to expenses table
ALTER TABLE expenses ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;

-- Create index on deleted_at for faster soft delete queries
CREATE INDEX IF NOT EXISTS idx_expenses_deleted_at ON expenses(deleted_at);
CREATE INDEX IF NOT EXISTS idx_users_deleted_at ON users(deleted_at); 