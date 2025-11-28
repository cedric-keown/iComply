-- AI Chatbot Tables Migration
-- Creates tables for chatbot interactions and feedback

-- Chatbot interactions log
CREATE TABLE IF NOT EXISTS chatbot_interactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    response TEXT NOT NULL,
    context JSONB DEFAULT '{}',
    module VARCHAR(100),
    response_time_ms INTEGER,
    usage JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chatbot feedback
CREATE TABLE IF NOT EXISTS chatbot_feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    interaction_id UUID REFERENCES chatbot_interactions(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    helpful BOOLEAN,
    feedback_text TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_chatbot_interactions_user_id ON chatbot_interactions(user_id);
CREATE INDEX IF NOT EXISTS idx_chatbot_interactions_created_at ON chatbot_interactions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_chatbot_interactions_module ON chatbot_interactions(module);
CREATE INDEX IF NOT EXISTS idx_chatbot_feedback_interaction_id ON chatbot_feedback(interaction_id);
CREATE INDEX IF NOT EXISTS idx_chatbot_feedback_user_id ON chatbot_feedback(user_id);

-- Enable Row Level Security
ALTER TABLE chatbot_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chatbot_feedback ENABLE ROW LEVEL SECURITY;

-- RLS Policies for chatbot_interactions
CREATE POLICY "Users can view their own interactions"
    ON chatbot_interactions FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own interactions"
    ON chatbot_interactions FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- RLS Policies for chatbot_feedback
CREATE POLICY "Users can view their own feedback"
    ON chatbot_feedback FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own feedback"
    ON chatbot_feedback FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Optional: Admin policy (if you have an admin role)
-- CREATE POLICY "Admins can view all interactions"
--     ON chatbot_interactions FOR SELECT
--     USING (
--         EXISTS (
--             SELECT 1 FROM user_profiles
--             WHERE user_profiles.user_id = auth.uid()
--             AND user_profiles.role = 'admin'
--         )
--     );

-- Function to auto-delete old interactions (optional - for data retention)
CREATE OR REPLACE FUNCTION cleanup_old_chatbot_interactions()
RETURNS void AS $$
BEGIN
    -- Delete interactions older than 90 days
    DELETE FROM chatbot_interactions
    WHERE created_at < NOW() - INTERVAL '90 days';
END;
$$ LANGUAGE plpgsql;

-- Optional: Schedule cleanup (requires pg_cron extension)
-- SELECT cron.schedule('cleanup-chatbot-interactions', '0 2 * * *', 'SELECT cleanup_old_chatbot_interactions();');

-- Comments for documentation
COMMENT ON TABLE chatbot_interactions IS 'Stores all chatbot interactions for audit and analytics';
COMMENT ON TABLE chatbot_feedback IS 'Stores user feedback on chatbot responses';
COMMENT ON COLUMN chatbot_interactions.context IS 'JSON object containing module, page, user role, and other context';
COMMENT ON COLUMN chatbot_interactions.usage IS 'JSON object containing token usage information from AI API';

