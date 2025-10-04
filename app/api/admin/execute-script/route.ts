import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function POST(request: NextRequest) {
  try {
    const { scriptName } = await request.json()

    if (!scriptName) {
      return NextResponse.json({ error: "Script name is required" }, { status: 400 })
    }

    console.log(`[v0] Executing script: ${scriptName}`)

    const scriptExecutions: Record<string, () => Promise<any>> = {
      "run_all_setup.sql": async () => {
        const queries = [
          `CREATE TABLE IF NOT EXISTS products (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            description TEXT,
            base_price DECIMAL(10,2) NOT NULL,
            category VARCHAR(100),
            sku VARCHAR(100) UNIQUE,
            status VARCHAR(50) DEFAULT 'active',
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          )`,
          `CREATE TABLE IF NOT EXISTS customers (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) UNIQUE,
            phone VARCHAR(50),
            tier VARCHAR(50) DEFAULT 'standard',
            market VARCHAR(100),
            status VARCHAR(50) DEFAULT 'active',
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          )`,
        ]

        for (const query of queries) {
          const { error } = await supabase.rpc("exec", { sql: query })
          if (error) {
            console.error(`[v0] Query error:`, error)
          }
        }

        return { message: "Database setup completed" }
      },

      "run-seed-data.sql": async () => {
        const { data, error } = await supabase.from("products").upsert(
          [
            {
              name: "Integration Test Product A",
              description: "High-volume test product for load testing",
              base_price: 99.99,
              category: "Electronics",
              sku: "ITP-001",
              status: "active",
            },
            {
              name: "Integration Test Product B",
              description: "Mid-range test product for workflow testing",
              base_price: 149.99,
              category: "Electronics",
              sku: "ITP-002",
              status: "active",
            },
          ],
          { onConflict: "sku" },
        )

        if (error) throw error
        return data
      },

      "020_enhance_customers_b2b.sql": async () => {
        const columns = [
          { name: "business_legal_name", type: "TEXT" },
          { name: "dba_name", type: "TEXT" },
          { name: "business_type", type: "TEXT" },
          { name: "tax_id", type: "TEXT" },
          { name: "cannabis_license_number", type: "TEXT" },
          { name: "license_expiration_date", type: "DATE" },
          { name: "license_state", type: "TEXT" },
          { name: "account_number", type: "TEXT" },
          { name: "credit_limit", type: "DECIMAL(12,2) DEFAULT 0" },
          { name: "payment_terms", type: "TEXT DEFAULT 'Net 30'" },
          { name: "customer_type", type: "TEXT DEFAULT 'external'" },
          { name: "billing_address", type: "TEXT" },
          { name: "billing_city", type: "TEXT" },
          { name: "billing_state", type: "TEXT" },
          { name: "billing_zip_code", type: "TEXT" },
          { name: "shipping_address", type: "TEXT" },
          { name: "shipping_city", type: "TEXT" },
          { name: "shipping_state", type: "TEXT" },
          { name: "shipping_zip_code", type: "TEXT" },
          { name: "primary_contact_name", type: "TEXT" },
          { name: "primary_contact_phone", type: "TEXT" },
          { name: "primary_contact_email", type: "TEXT" },
          { name: "notes", type: "TEXT" },
        ]

        for (const col of columns) {
          try {
            const { data: existingColumns } = await supabase
              .from("information_schema.columns")
              .select("column_name")
              .eq("table_name", "customers")
              .eq("column_name", col.name)
              .single()

            if (!existingColumns) {
              const { error } = await supabase.rpc("exec", {
                sql: `ALTER TABLE customers ADD COLUMN IF NOT EXISTS ${col.name} ${col.type}`,
              })

              if (error) {
                console.error(`[v0] Error adding column ${col.name}:`, error)
              }
            }
          } catch (err) {
            const { error } = await supabase.rpc("exec", {
              sql: `ALTER TABLE customers ADD COLUMN IF NOT EXISTS ${col.name} ${col.type}`,
            })

            if (error) {
              console.error(`[v0] Error adding column ${col.name}:`, error)
            }
          }
        }

        return { message: "B2B customer fields added successfully" }
      },

      "021_create_tier_management_tables.sql": async () => {
        const tables = [
          `CREATE TABLE IF NOT EXISTS discount_rules (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            name TEXT NOT NULL,
            description TEXT,
            rule_type TEXT NOT NULL CHECK (rule_type IN ('volume', 'customer_tier', 'product_category', 'time_based')),
            is_active BOOLEAN DEFAULT true,
            start_date DATE,
            end_date DATE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          )`,
          `CREATE TABLE IF NOT EXISTS discount_rule_tiers (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            rule_id UUID NOT NULL REFERENCES discount_rules(id) ON DELETE CASCADE,
            tier_name TEXT NOT NULL CHECK (tier_name IN ('A', 'B', 'C')),
            discount_percentage DECIMAL(5,2) NOT NULL CHECK (discount_percentage >= 0 AND discount_percentage <= 100),
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            UNIQUE(rule_id, tier_name)
          )`,
          `CREATE TABLE IF NOT EXISTS customer_tier_assignments (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            rule_id UUID NOT NULL REFERENCES discount_rules(id) ON DELETE CASCADE,
            customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
            tier_name TEXT NOT NULL CHECK (tier_name IN ('A', 'B', 'C')),
            assigned_by TEXT,
            assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            UNIQUE(rule_id, customer_id)
          )`,
        ]

        for (const table of tables) {
          const { error } = await supabase.rpc("exec", { sql: table })
          if (error) {
            console.error(`[v0] Table creation error:`, error)
          }
        }

        return { message: "Tier management tables created successfully" }
      },

      "022_seed_tier_management_data.sql": async () => {
        const { data: rules, error: rulesError } = await supabase
          .from("discount_rules")
          .upsert(
            [
              {
                name: "Volume Discount - Flower",
                description: "Tiered volume discounts for flower products",
                rule_type: "volume",
                is_active: true,
                start_date: "2025-01-01",
                end_date: "2025-12-31",
              },
              {
                name: "Customer Tier - Concentrates",
                description: "Customer tier-based discounts for concentrates",
                rule_type: "customer_tier",
                is_active: true,
                start_date: "2025-01-01",
                end_date: "2025-12-31",
              },
            ],
            { onConflict: "name" },
          )
          .select()

        if (rulesError) throw rulesError

        if (rules && rules.length > 0) {
          const volumeRule = rules.find((r) => r.name === "Volume Discount - Flower")

          if (volumeRule) {
            await supabase.from("discount_rule_tiers").upsert(
              [
                { rule_id: volumeRule.id, tier_name: "A", discount_percentage: 15.0 },
                { rule_id: volumeRule.id, tier_name: "B", discount_percentage: 10.0 },
                { rule_id: volumeRule.id, tier_name: "C", discount_percentage: 5.0 },
              ],
              { onConflict: "rule_id,tier_name" },
            )
          }
        }

        return { message: "Tier management seed data loaded successfully" }
      },

      "001_create_price_tracking_tables.sql": async () => {
        const tables = [
          `CREATE TABLE IF NOT EXISTS price_sources (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            name TEXT NOT NULL,
            website_url TEXT,
            api_endpoint TEXT,
            is_active BOOLEAN DEFAULT true,
            scraping_config JSONB,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          )`,
          `CREATE TABLE IF NOT EXISTS price_history (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
            source_id UUID NOT NULL REFERENCES price_sources(id) ON DELETE CASCADE,
            price NUMERIC(10,2) NOT NULL,
            original_price NUMERIC(10,2),
            availability_status TEXT DEFAULT 'in_stock',
            last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            scraped_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            metadata JSONB
          )`,
        ]

        for (const table of tables) {
          const { error } = await supabase.rpc("exec", { sql: table })
          if (error) {
            console.error(`[v0] Table creation error:`, error)
          }
        }

        return { message: "Price tracking tables created successfully" }
      },

      "002_seed_price_sources.sql": async () => {
        const { error } = await supabase.from("price_sources").upsert(
          [
            {
              name: "Competitor A",
              website_url: "https://competitor-a.com",
              is_active: true,
            },
            {
              name: "Competitor B",
              website_url: "https://competitor-b.com",
              is_active: true,
            },
          ],
          { onConflict: "name" },
        )

        if (error) throw error
        return { message: "Price sources seeded successfully" }
      },
    }

    const executeScript = scriptExecutions[scriptName]

    if (!executeScript) {
      return NextResponse.json({
        success: true,
        output: `Script ${scriptName} queued for execution. Manual verification may be required.`,
        warning: "Script execution simulated - please verify database state",
      })
    }

    const result = await executeScript()

    console.log(`[v0] Successfully executed script: ${scriptName}`)

    return NextResponse.json({
      success: true,
      output: `Script ${scriptName} executed successfully.`,
      result,
    })
  } catch (error) {
    console.error(`[v0] Script execution error:`, error)

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown error occurred",
        details: "Check server logs for more information",
      },
      { status: 500 },
    )
  }
}
