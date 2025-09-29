-- Create app_settings table for storing configuration
CREATE TABLE IF NOT EXISTS app_settings (
    id SERIAL PRIMARY KEY,
    category VARCHAR(100) NOT NULL UNIQUE,
    settings JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_app_settings_category ON app_settings(category);

-- Insert default SSO/API configuration
INSERT INTO app_settings (category, settings) 
VALUES ('sso_api', '{
    "sso": {
        "enabled": false,
        "webhookUrl": "",
        "webhookSecret": "",
        "autoProvision": true,
        "defaultRole": "user",
        "syncInterval": 300
    },
    "api": {
        "enabled": true,
        "apiKey": "",
        "rateLimitEnabled": true,
        "rateLimitRequests": 100,
        "rateLimitWindow": 3600,
        "allowBulkOperations": true,
        "requireApiKeyForBulk": true
    }
}')
ON CONFLICT (category) DO NOTHING;
