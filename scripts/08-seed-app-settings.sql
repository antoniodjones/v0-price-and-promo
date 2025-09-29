-- Seed application settings
INSERT INTO app_settings (id, category, settings, created_at, updated_at) VALUES
(1, 'pricing', '{
  "defaultMarkup": 100,
  "minimumMargin": 20,
  "maxDiscountPercentage": 50,
  "autoDiscountEnabled": true,
  "conflictResolution": "highest_discount",
  "roundingRules": {
    "method": "nearest_dollar",
    "precision": 2
  }
}', NOW(), NOW()),

(2, 'notifications', '{
  "emailEnabled": true,
  "slackEnabled": false,
  "discountAlerts": true,
  "inventoryAlerts": true,
  "performanceReports": true,
  "weeklyDigest": true
}', NOW(), NOW()),

(3, 'integrations', '{
  "posSystem": "treez",
  "inventorySystem": "metrc",
  "analyticsEnabled": true,
  "webhooksEnabled": true,
  "apiRateLimit": 1000
}', NOW(), NOW()),

(4, 'markets', '{
  "supportedMarkets": ["Illinois", "Pennsylvania"],
  "defaultMarket": "Illinois",
  "marketSpecificRules": {
    "Illinois": {
      "taxRate": 0.25,
      "maxDiscountStack": 3
    },
    "Pennsylvania": {
      "taxRate": 0.06,
      "maxDiscountStack": 2
    }
  }
}', NOW(), NOW());
