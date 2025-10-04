-- Tier Management Test Suite
-- Comprehensive test cases for tier management functionality (TM-031)

-- Insert comprehensive test suite for tier management
INSERT INTO ai_generated_tests (
    test_name,
    test_type,
    generated_code,
    description,
    target_component,
    confidence_score,
    complexity_level,
    estimated_runtime_ms,
    coverage_areas,
    dependencies,
    tags
) VALUES

-- ============================================================================
-- API ENDPOINT TESTS - Discount Rules
-- ============================================================================

(
    'GET /api/discount-rules - List all discount rules',
    'integration',
    'describe("GET /api/discount-rules", () => {
  it("should return all discount rules with pagination", async () => {
    const response = await fetch("/api/discount-rules");
    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(Array.isArray(data.data)).toBe(true);
    expect(data.data.length).toBeGreaterThan(0);
    
    // Verify rule structure
    const rule = data.data[0];
    expect(rule).toHaveProperty("id");
    expect(rule).toHaveProperty("name");
    expect(rule).toHaveProperty("rule_type");
    expect(rule).toHaveProperty("status");
  });

  it("should filter rules by status", async () => {
    const response = await fetch("/api/discount-rules?status=active");
    const data = await response.json();
    
    expect(response.status).toBe(200);
    data.data.forEach(rule => {
      expect(rule.status).toBe("active");
    });
  });

  it("should handle empty results gracefully", async () => {
    const response = await fetch("/api/discount-rules?status=nonexistent");
    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(data.data).toEqual([]);
  });
})',
    'Tests the discount rules list endpoint with various filters and edge cases',
    '/api/discount-rules',
    95.0,
    'medium',
    1500,
    '["discount-rules API", "pagination", "filtering"]',
    '["fetch", "database"]',
    '["api", "discount-rules", "integration"]'
),

(
    'POST /api/discount-rules - Create new discount rule',
    'integration',
    'describe("POST /api/discount-rules", () => {
  it("should create a new discount rule with valid data", async () => {
    const newRule = {
      name: "Test Volume Discount",
      description: "Test discount for volume purchases",
      rule_type: "volume",
      status: "active",
      start_date: "2025-01-01",
      end_date: "2025-12-31"
    };

    const response = await fetch("/api/discount-rules", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newRule)
    });
    const data = await response.json();
    
    expect(response.status).toBe(201);
    expect(data.success).toBe(true);
    expect(data.data.name).toBe(newRule.name);
    expect(data.data.rule_type).toBe(newRule.rule_type);
  });

  it("should reject rule with missing required fields", async () => {
    const invalidRule = {
      name: "Incomplete Rule"
      // Missing rule_type, status, dates
    };

    const response = await fetch("/api/discount-rules", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(invalidRule)
    });
    
    expect(response.status).toBe(400);
  });

  it("should reject rule with invalid rule_type", async () => {
    const invalidRule = {
      name: "Invalid Type Rule",
      rule_type: "invalid_type",
      status: "active",
      start_date: "2025-01-01"
    };

    const response = await fetch("/api/discount-rules", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(invalidRule)
    });
    
    expect(response.status).toBe(400);
  });

  it("should reject rule with end_date before start_date", async () => {
    const invalidRule = {
      name: "Invalid Date Rule",
      rule_type: "volume",
      status: "active",
      start_date: "2025-12-31",
      end_date: "2025-01-01"
    };

    const response = await fetch("/api/discount-rules", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(invalidRule)
    });
    
    expect(response.status).toBe(400);
  });
})',
    'Tests discount rule creation with validation and error handling',
    '/api/discount-rules',
    93.0,
    'high',
    2000,
    '["discount-rules API", "validation", "error-handling"]',
    '["fetch", "database", "validation"]',
    '["api", "discount-rules", "validation", "integration"]'
),

(
    'GET /api/discount-rules/[id] - Get discount rule details',
    'integration',
    'describe("GET /api/discount-rules/[id]", () => {
  it("should return rule details with tiers", async () => {
    const ruleId = "test-rule-id";
    const response = await fetch(`/api/discount-rules/${ruleId}`);
    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data.id).toBe(ruleId);
    expect(Array.isArray(data.data.tiers)).toBe(true);
  });

  it("should return 404 for non-existent rule", async () => {
    const response = await fetch("/api/discount-rules/non-existent-id");
    
    expect(response.status).toBe(404);
  });

  it("should include tier configuration in response", async () => {
    const ruleId = "test-rule-id";
    const response = await fetch(`/api/discount-rules/${ruleId}`);
    const data = await response.json();
    
    expect(data.data.tiers.length).toBeGreaterThan(0);
    const tier = data.data.tiers[0];
    expect(tier).toHaveProperty("tier_name");
    expect(tier).toHaveProperty("discount_percentage");
  });
})',
    'Tests fetching individual discount rule details including tier configuration',
    '/api/discount-rules/[id]',
    92.0,
    'medium',
    1200,
    '["discount-rules API", "rule-details", "tiers"]',
    '["fetch", "database"]',
    '["api", "discount-rules", "integration"]'
),

(
    'PUT /api/discount-rules/[id] - Update discount rule',
    'integration',
    'describe("PUT /api/discount-rules/[id]", () => {
  it("should update rule with valid data", async () => {
    const ruleId = "test-rule-id";
    const updates = {
      name: "Updated Rule Name",
      description: "Updated description",
      status: "inactive"
    };

    const response = await fetch(`/api/discount-rules/${ruleId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates)
    });
    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(data.data.name).toBe(updates.name);
    expect(data.data.status).toBe(updates.status);
  });

  it("should return 404 for non-existent rule", async () => {
    const response = await fetch("/api/discount-rules/non-existent-id", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Test" })
    });
    
    expect(response.status).toBe(404);
  });

  it("should reject invalid status values", async () => {
    const ruleId = "test-rule-id";
    const response = await fetch(`/api/discount-rules/${ruleId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "invalid_status" })
    });
    
    expect(response.status).toBe(400);
  });
})',
    'Tests updating discount rules with validation',
    '/api/discount-rules/[id]',
    91.0,
    'medium',
    1800,
    '["discount-rules API", "update", "validation"]',
    '["fetch", "database", "validation"]',
    '["api", "discount-rules", "update", "integration"]'
),

(
    'DELETE /api/discount-rules/[id] - Delete discount rule',
    'integration',
    'describe("DELETE /api/discount-rules/[id]", () => {
  it("should delete rule and cascade to assignments", async () => {
    const ruleId = "test-rule-id";
    const response = await fetch(`/api/discount-rules/${ruleId}`, {
      method: "DELETE"
    });
    
    expect(response.status).toBe(200);
    
    // Verify rule is deleted
    const getResponse = await fetch(`/api/discount-rules/${ruleId}`);
    expect(getResponse.status).toBe(404);
  });

  it("should return 404 for non-existent rule", async () => {
    const response = await fetch("/api/discount-rules/non-existent-id", {
      method: "DELETE"
    });
    
    expect(response.status).toBe(404);
  });

  it("should prevent deletion of active rules with assignments", async () => {
    const ruleId = "active-rule-with-assignments";
    const response = await fetch(`/api/discount-rules/${ruleId}`, {
      method: "DELETE"
    });
    
    // Should either prevent deletion or require force flag
    expect([400, 409]).toContain(response.status);
  });
})',
    'Tests discount rule deletion with cascade and safety checks',
    '/api/discount-rules/[id]',
    89.0,
    'high',
    1500,
    '["discount-rules API", "delete", "cascade"]',
    '["fetch", "database"]',
    '["api", "discount-rules", "delete", "integration"]'
),

-- ============================================================================
-- API ENDPOINT TESTS - Tier Assignments
-- ============================================================================

(
    'GET /api/discount-rules/[id]/assignments - List tier assignments',
    'integration',
    'describe("GET /api/discount-rules/[id]/assignments", () => {
  it("should return all assignments for a rule", async () => {
    const ruleId = "test-rule-id";
    const response = await fetch(`/api/discount-rules/${ruleId}/assignments`);
    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(Array.isArray(data.data)).toBe(true);
    
    if (data.data.length > 0) {
      const assignment = data.data[0];
      expect(assignment).toHaveProperty("customer_id");
      expect(assignment).toHaveProperty("tier");
      expect(assignment).toHaveProperty("customer");
    }
  });

  it("should include customer details in assignments", async () => {
    const ruleId = "test-rule-id";
    const response = await fetch(`/api/discount-rules/${ruleId}/assignments`);
    const data = await response.json();
    
    if (data.data.length > 0) {
      expect(data.data[0].customer).toHaveProperty("name");
      expect(data.data[0].customer).toHaveProperty("email");
    }
  });

  it("should return empty array for rule with no assignments", async () => {
    const ruleId = "rule-without-assignments";
    const response = await fetch(`/api/discount-rules/${ruleId}/assignments`);
    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(data.data).toEqual([]);
  });
})',
    'Tests fetching tier assignments for a discount rule',
    '/api/discount-rules/[id]/assignments',
    94.0,
    'medium',
    1400,
    '["tier-assignments API", "list", "customer-details"]',
    '["fetch", "database"]',
    '["api", "tier-assignments", "integration"]'
),

(
    'POST /api/discount-rules/[id]/assignments - Assign customer to tier',
    'integration',
    'describe("POST /api/discount-rules/[id]/assignments", () => {
  it("should assign customer to tier successfully", async () => {
    const ruleId = "test-rule-id";
    const assignment = {
      customer_id: "customer-123",
      tier: "A"
    };

    const response = await fetch(`/api/discount-rules/${ruleId}/assignments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(assignment)
    });
    const data = await response.json();
    
    expect(response.status).toBe(201);
    expect(data.data.customer_id).toBe(assignment.customer_id);
    expect(data.data.tier).toBe(assignment.tier);
  });

  it("should reject assignment with missing customer_id", async () => {
    const ruleId = "test-rule-id";
    const response = await fetch(`/api/discount-rules/${ruleId}/assignments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tier: "A" })
    });
    
    expect(response.status).toBe(400);
  });

  it("should reject assignment with invalid tier", async () => {
    const ruleId = "test-rule-id";
    const response = await fetch(`/api/discount-rules/${ruleId}/assignments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ customer_id: "customer-123", tier: "Z" })
    });
    
    expect(response.status).toBe(400);
  });

  it("should prevent duplicate assignments", async () => {
    const ruleId = "test-rule-id";
    const assignment = {
      customer_id: "existing-customer",
      tier: "A"
    };

    // First assignment should succeed
    await fetch(`/api/discount-rules/${ruleId}/assignments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(assignment)
    });

    // Duplicate should fail
    const response = await fetch(`/api/discount-rules/${ruleId}/assignments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(assignment)
    });
    
    expect(response.status).toBe(409);
  });

  it("should reject assignment to non-existent customer", async () => {
    const ruleId = "test-rule-id";
    const response = await fetch(`/api/discount-rules/${ruleId}/assignments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ customer_id: "non-existent", tier: "A" })
    });
    
    expect(response.status).toBe(404);
  });
})',
    'Tests assigning customers to tiers with comprehensive validation',
    '/api/discount-rules/[id]/assignments',
    96.0,
    'high',
    2200,
    '["tier-assignments API", "create", "validation", "duplicates"]',
    '["fetch", "database", "validation"]',
    '["api", "tier-assignments", "validation", "integration"]'
),

(
    'DELETE /api/discount-rules/[id]/assignments/[customerId] - Remove assignment',
    'integration',
    'describe("DELETE /api/discount-rules/[id]/assignments/[customerId]", () => {
  it("should remove customer tier assignment", async () => {
    const ruleId = "test-rule-id";
    const customerId = "customer-123";
    
    const response = await fetch(
      `/api/discount-rules/${ruleId}/assignments/${customerId}`,
      { method: "DELETE" }
    );
    
    expect(response.status).toBe(200);
    
    // Verify assignment is removed
    const getResponse = await fetch(`/api/discount-rules/${ruleId}/assignments`);
    const data = await getResponse.json();
    const assignment = data.data.find(a => a.customer_id === customerId);
    expect(assignment).toBeUndefined();
  });

  it("should return 404 for non-existent assignment", async () => {
    const response = await fetch(
      "/api/discount-rules/rule-id/assignments/non-existent-customer",
      { method: "DELETE" }
    );
    
    expect(response.status).toBe(404);
  });

  it("should create audit log entry on deletion", async () => {
    const ruleId = "test-rule-id";
    const customerId = "customer-123";
    
    await fetch(
      `/api/discount-rules/${ruleId}/assignments/${customerId}`,
      { method: "DELETE" }
    );
    
    // Check audit log
    const auditResponse = await fetch(
      `/api/tier-assignments/audit?customer_id=${customerId}`
    );
    const auditData = await auditResponse.json();
    
    expect(auditData.data.some(log => log.action === "removed")).toBe(true);
  });
})',
    'Tests removing tier assignments with audit logging',
    '/api/discount-rules/[id]/assignments/[customerId]',
    90.0,
    'medium',
    1600,
    '["tier-assignments API", "delete", "audit"]',
    '["fetch", "database", "audit"]',
    '["api", "tier-assignments", "delete", "integration"]'
),

(
    'GET /api/customers/[id]/tiers - Get customer tier assignments',
    'integration',
    'describe("GET /api/customers/[id]/tiers", () => {
  it("should return all tiers for a customer", async () => {
    const customerId = "customer-123";
    const response = await fetch(`/api/customers/${customerId}/tiers`);
    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(Array.isArray(data.data)).toBe(true);
    
    if (data.data.length > 0) {
      const tier = data.data[0];
      expect(tier).toHaveProperty("rule_id");
      expect(tier).toHaveProperty("tier");
      expect(tier).toHaveProperty("discount_rule");
    }
  });

  it("should include discount rule details", async () => {
    const customerId = "customer-123";
    const response = await fetch(`/api/customers/${customerId}/tiers`);
    const data = await response.json();
    
    if (data.data.length > 0) {
      expect(data.data[0].discount_rule).toHaveProperty("name");
      expect(data.data[0].discount_rule).toHaveProperty("status");
    }
  });

  it("should return empty array for customer with no tiers", async () => {
    const customerId = "customer-without-tiers";
    const response = await fetch(`/api/customers/${customerId}/tiers`);
    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(data.data).toEqual([]);
  });

  it("should return 404 for non-existent customer", async () => {
    const response = await fetch("/api/customers/non-existent/tiers");
    
    expect(response.status).toBe(404);
  });
})',
    'Tests fetching all tier assignments for a specific customer',
    '/api/customers/[id]/tiers',
    93.0,
    'medium',
    1300,
    '["customer-tiers API", "list", "rule-details"]',
    '["fetch", "database"]',
    '["api", "customer-tiers", "integration"]'
),

-- ============================================================================
-- API ENDPOINT TESTS - Bulk Operations
-- ============================================================================

(
    'POST /api/tier-assignments/bulk - Bulk tier assignment',
    'integration',
    'describe("POST /api/tier-assignments/bulk", () => {
  it("should process bulk assignments successfully", async () => {
    const bulkData = {
      rule_id: "test-rule-id",
      assignments: [
        { customer_id: "customer-1", tier: "A" },
        { customer_id: "customer-2", tier: "B" },
        { customer_id: "customer-3", tier: "C" }
      ]
    };

    const response = await fetch("/api/tier-assignments/bulk", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bulkData)
    });
    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(data.data.successful).toBe(3);
    expect(data.data.failed).toBe(0);
  });

  it("should handle partial failures gracefully", async () => {
    const bulkData = {
      rule_id: "test-rule-id",
      assignments: [
        { customer_id: "valid-customer", tier: "A" },
        { customer_id: "invalid-customer", tier: "Z" },
        { customer_id: "another-valid", tier: "B" }
      ]
    };

    const response = await fetch("/api/tier-assignments/bulk", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bulkData)
    });
    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(data.data.successful).toBe(2);
    expect(data.data.failed).toBe(1);
    expect(data.data.errors.length).toBe(1);
  });

  it("should validate all assignments before processing", async () => {
    const bulkData = {
      rule_id: "test-rule-id",
      assignments: [
        { customer_id: "customer-1" }, // Missing tier
        { tier: "A" } // Missing customer_id
      ]
    };

    const response = await fetch("/api/tier-assignments/bulk", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bulkData)
    });
    
    expect(response.status).toBe(400);
  });

  it("should handle large bulk operations efficiently", async () => {
    const assignments = Array.from({ length: 100 }, (_, i) => ({
      customer_id: `customer-${i}`,
      tier: ["A", "B", "C"][i % 3]
    }));

    const startTime = Date.now();
    const response = await fetch("/api/tier-assignments/bulk", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rule_id: "test-rule-id", assignments })
    });
    const duration = Date.now() - startTime;
    
    expect(response.status).toBe(200);
    expect(duration).toBeLessThan(5000); // Should complete within 5 seconds
  });
})',
    'Tests bulk tier assignment operations with validation and error handling',
    '/api/tier-assignments/bulk',
    94.0,
    'high',
    3000,
    '["bulk-operations", "tier-assignments", "validation", "performance"]',
    '["fetch", "database", "validation"]',
    '["api", "bulk-operations", "performance", "integration"]'
),

(
    'POST /api/tier-assignments/validate-bulk - Validate bulk assignments',
    'integration',
    'describe("POST /api/tier-assignments/validate-bulk", () => {
  it("should validate bulk data without saving", async () => {
    const bulkData = {
      rule_id: "test-rule-id",
      assignments: [
        { customer_id: "customer-1", tier: "A" },
        { customer_id: "customer-2", tier: "B" }
      ]
    };

    const response = await fetch("/api/tier-assignments/validate-bulk", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bulkData)
    });
    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(data.data.valid).toBe(true);
    expect(data.data.errors).toEqual([]);
  });

  it("should detect invalid customer IDs", async () => {
    const bulkData = {
      rule_id: "test-rule-id",
      assignments: [
        { customer_id: "non-existent", tier: "A" }
      ]
    };

    const response = await fetch("/api/tier-assignments/validate-bulk", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bulkData)
    });
    const data = await response.json();
    
    expect(data.data.valid).toBe(false);
    expect(data.data.errors.length).toBeGreaterThan(0);
  });

  it("should detect invalid tier values", async () => {
    const bulkData = {
      rule_id: "test-rule-id",
      assignments: [
        { customer_id: "customer-1", tier: "InvalidTier" }
      ]
    };

    const response = await fetch("/api/tier-assignments/validate-bulk", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bulkData)
    });
    const data = await response.json();
    
    expect(data.data.valid).toBe(false);
  });

  it("should detect duplicate assignments", async () => {
    const bulkData = {
      rule_id: "test-rule-id",
      assignments: [
        { customer_id: "customer-1", tier: "A" },
        { customer_id: "customer-1", tier: "B" }
      ]
    };

    const response = await fetch("/api/tier-assignments/validate-bulk", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bulkData)
    });
    const data = await response.json();
    
    expect(data.data.warnings).toContain("Duplicate customer assignments detected");
  });
})',
    'Tests bulk assignment validation without database modifications',
    '/api/tier-assignments/validate-bulk',
    92.0,
    'medium',
    1800,
    '["bulk-operations", "validation", "dry-run"]',
    '["fetch", "validation"]',
    '["api", "bulk-operations", "validation", "integration"]'
),

(
    'GET /api/tier-assignments/audit - Tier assignment audit log',
    'integration',
    'describe("GET /api/tier-assignments/audit", () => {
  it("should return audit log entries", async () => {
    const response = await fetch("/api/tier-assignments/audit");
    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(Array.isArray(data.data)).toBe(true);
    
    if (data.data.length > 0) {
      const entry = data.data[0];
      expect(entry).toHaveProperty("customer_id");
      expect(entry).toHaveProperty("action");
      expect(entry).toHaveProperty("changed_at");
    }
  });

  it("should filter by customer_id", async () => {
    const customerId = "customer-123";
    const response = await fetch(`/api/tier-assignments/audit?customer_id=${customerId}`);
    const data = await response.json();
    
    data.data.forEach(entry => {
      expect(entry.customer_id).toBe(customerId);
    });
  });

  it("should filter by rule_id", async () => {
    const ruleId = "rule-123";
    const response = await fetch(`/api/tier-assignments/audit?rule_id=${ruleId}`);
    const data = await response.json();
    
    data.data.forEach(entry => {
      expect(entry.rule_id).toBe(ruleId);
    });
  });

  it("should filter by date range", async () => {
    const startDate = "2025-01-01";
    const endDate = "2025-12-31";
    const response = await fetch(
      `/api/tier-assignments/audit?start_date=${startDate}&end_date=${endDate}`
    );
    const data = await response.json();
    
    data.data.forEach(entry => {
      const entryDate = new Date(entry.changed_at);
      expect(entryDate >= new Date(startDate)).toBe(true);
      expect(entryDate <= new Date(endDate)).toBe(true);
    });
  });

  it("should include action types (assigned, updated, removed)", async () => {
    const response = await fetch("/api/tier-assignments/audit");
    const data = await response.json();
    
    const actions = data.data.map(entry => entry.action);
    const validActions = ["assigned", "updated", "removed"];
    actions.forEach(action => {
      expect(validActions).toContain(action);
    });
  });
})',
    'Tests tier assignment audit log with various filters',
    '/api/tier-assignments/audit',
    91.0,
    'medium',
    1500,
    '["audit-log", "filtering", "date-range"]',
    '["fetch", "database"]',
    '["api", "audit", "integration"]'
),

-- ============================================================================
-- COMPONENT TESTS - UI Components
-- ============================================================================

(
    'DiscountRulesList - Display and filter discount rules',
    'unit',
    'describe("DiscountRulesList Component", () => {
  it("should render list of discount rules", () => {
    const rules = [
      { id: "1", name: "Rule 1", status: "active", rule_type: "volume" },
      { id: "2", name: "Rule 2", status: "inactive", rule_type: "customer_tier" }
    ];
    
    const { getByText } = render(<DiscountRulesList rules={rules} />);
    
    expect(getByText("Rule 1")).toBeInTheDocument();
    expect(getByText("Rule 2")).toBeInTheDocument();
  });

  it("should filter rules by status", () => {
    const rules = [
      { id: "1", name: "Active Rule", status: "active" },
      { id: "2", name: "Inactive Rule", status: "inactive" }
    ];
    
    const { getByText, queryByText } = render(<DiscountRulesList rules={rules} />);
    
    // Apply active filter
    fireEvent.click(getByText("Active"));
    
    expect(getByText("Active Rule")).toBeInTheDocument();
    expect(queryByText("Inactive Rule")).not.toBeInTheDocument();
  });

  it("should open edit modal on edit button click", () => {
    const onEdit = jest.fn();
    const rules = [{ id: "1", name: "Test Rule", status: "active" }];
    
    const { getByRole } = render(<DiscountRulesList rules={rules} onEdit={onEdit} />);
    
    fireEvent.click(getByRole("button", { name: /edit/i }));
    
    expect(onEdit).toHaveBeenCalledWith(rules[0]);
  });

  it("should display empty state when no rules", () => {
    const { getByText } = render(<DiscountRulesList rules={[]} />);
    
    expect(getByText(/no discount rules found/i)).toBeInTheDocument();
  });

  it("should sort rules by name", () => {
    const rules = [
      { id: "1", name: "Zebra Rule", status: "active" },
      { id: "2", name: "Alpha Rule", status: "active" }
    ];
    
    const { getAllByRole } = render(<DiscountRulesList rules={rules} />);
    
    // Click sort button
    fireEvent.click(getByText("Sort by Name"));
    
    const ruleNames = getAllByRole("row").map(row => row.textContent);
    expect(ruleNames[0]).toContain("Alpha Rule");
    expect(ruleNames[1]).toContain("Zebra Rule");
  });
})',
    'Tests the discount rules list component with filtering and sorting',
    'components/tier-management/discount-rules-list.tsx',
    88.0,
    'medium',
    1200,
    '["ui-components", "filtering", "sorting"]',
    '["react", "testing-library"]',
    '["component", "ui", "tier-management"]'
),

(
    'TierAssignmentMatrix - Customer tier assignment interface',
    'unit',
    'describe("TierAssignmentMatrix Component", () => {
  it("should render customer list with tier dropdowns", () => {
    const customers = [
      { id: "1", name: "Customer A", email: "a@test.com" },
      { id: "2", name: "Customer B", email: "b@test.com" }
    ];
    
    const { getByText } = render(<TierAssignmentMatrix customers={customers} />);
    
    expect(getByText("Customer A")).toBeInTheDocument();
    expect(getByText("Customer B")).toBeInTheDocument();
  });

  it("should allow tier selection for each customer", () => {
    const onAssign = jest.fn();
    const customers = [{ id: "1", name: "Customer A" }];
    
    const { getByRole } = render(
      <TierAssignmentMatrix customers={customers} onAssign={onAssign} />
    );
    
    // Select tier A
    const select = getByRole("combobox");
    fireEvent.change(select, { target: { value: "A" } });
    
    expect(onAssign).toHaveBeenCalledWith("1", "A");
  });

  it("should display current tier assignments", () => {
    const customers = [{ id: "1", name: "Customer A", currentTier: "B" }];
    
    const { getByDisplayValue } = render(<TierAssignmentMatrix customers={customers} />);
    
    expect(getByDisplayValue("B")).toBeInTheDocument();
  });

  it("should filter customers by search term", () => {
    const customers = [
      { id: "1", name: "Alice", email: "alice@test.com" },
      { id: "2", name: "Bob", email: "bob@test.com" }
    ];
    
    const { getByPlaceholderText, queryByText } = render(
      <TierAssignmentMatrix customers={customers} />
    );
    
    const searchInput = getByPlaceholderText(/search/i);
    fireEvent.change(searchInput, { target: { value: "Alice" } });
    
    expect(queryByText("Alice")).toBeInTheDocument();
    expect(queryByText("Bob")).not.toBeInTheDocument();
  });

  it("should show validation error for invalid tier", () => {
    const customers = [{ id: "1", name: "Customer A" }];
    
    const { getByText, getByRole } = render(<TierAssignmentMatrix customers={customers} />);
    
    const select = getByRole("combobox");
    fireEvent.change(select, { target: { value: "InvalidTier" } });
    
    expect(getByText(/invalid tier/i)).toBeInTheDocument();
  });
})',
    'Tests the tier assignment matrix component for bulk customer assignment',
    'components/tier-management/tier-assignment-matrix.tsx',
    90.0,
    'high',
    1800,
    '["ui-components", "tier-assignment", "validation"]',
    '["react", "testing-library"]',
    '["component", "ui", "tier-management"]'
),

(
    'BulkTierAssignment - CSV upload and processing',
    'unit',
    'describe("BulkTierAssignment Component", () => {
  it("should accept CSV file upload", () => {
    const { getByLabelText } = render(<BulkTierAssignment />);
    
    const fileInput = getByLabelText(/upload csv/i);
    const file = new File(["customer_id,tier\\n1,A\\n2,B"], "test.csv", { type: "text/csv" });
    
    fireEvent.change(fileInput, { target: { files: [file] } });
    
    expect(fileInput.files[0]).toBe(file);
  });

  it("should parse CSV and display preview", async () => {
    const { getByLabelText, getByText } = render(<BulkTierAssignment />);
    
    const fileInput = getByLabelText(/upload csv/i);
    const csvContent = "customer_id,tier\\ncustomer-1,A\\ncustomer-2,B";
    const file = new File([csvContent], "test.csv", { type: "text/csv" });
    
    fireEvent.change(fileInput, { target: { files: [file] } });
    
    await waitFor(() => {
      expect(getByText("customer-1")).toBeInTheDocument();
      expect(getByText("customer-2")).toBeInTheDocument();
    });
  });

  it("should validate CSV format", async () => {
    const { getByLabelText, getByText } = render(<BulkTierAssignment />);
    
    const fileInput = getByLabelText(/upload csv/i);
    const invalidCsv = "wrong,headers\\ndata,here";
    const file = new File([invalidCsv], "test.csv", { type: "text/csv" });
    
    fireEvent.change(fileInput, { target: { files: [file] } });
    
    await waitFor(() => {
      expect(getByText(/invalid csv format/i)).toBeInTheDocument();
    });
  });

  it("should show validation errors for invalid data", async () => {
    const { getByLabelText, getByText } = render(<BulkTierAssignment />);
    
    const fileInput = getByLabelText(/upload csv/i);
    const csvContent = "customer_id,tier\\ncustomer-1,InvalidTier";
    const file = new File([csvContent], "test.csv", { type: "text/csv" });
    
    fireEvent.change(fileInput, { target: { files: [file] } });
    
    await waitFor(() => {
      expect(getByText(/invalid tier/i)).toBeInTheDocument();
    });
  });

  it("should submit bulk assignments on confirm", async () => {
    const onSubmit = jest.fn();
    const { getByLabelText, getByRole } = render(
      <BulkTierAssignment onSubmit={onSubmit} />
    );
    
    const fileInput = getByLabelText(/upload csv/i);
    const csvContent = "customer_id,tier\\ncustomer-1,A";
    const file = new File([csvContent], "test.csv", { type: "text/csv" });
    
    fireEvent.change(fileInput, { target: { files: [file] } });
    
    await waitFor(() => {
      const submitButton = getByRole("button", { name: /submit/i });
      fireEvent.click(submitButton);
    });
    
    expect(onSubmit).toHaveBeenCalled();
  });
})',
    'Tests bulk tier assignment component with CSV upload and validation',
    'components/tier-management/bulk-tier-assignment.tsx',
    92.0,
    'high',
    2000,
    '["ui-components", "csv-upload", "validation", "bulk-operations"]',
    '["react", "testing-library", "file-upload"]',
    '["component", "ui", "bulk-operations"]'
),

(
    'CustomerTierDashboard - Customer tier overview',
    'unit',
    'describe("CustomerTierDashboard Component", () => {
  it("should display tier distribution chart", () => {
    const tierData = {
      A: 10,
      B: 20,
      C: 30
    };
    
    const { getByText } = render(<CustomerTierDashboard tierData={tierData} />);
    
    expect(getByText("Tier A: 10")).toBeInTheDocument();
    expect(getByText("Tier B: 20")).toBeInTheDocument();
    expect(getByText("Tier C: 30")).toBeInTheDocument();
  });

  it("should show customer list with tier badges", () => {
    const customers = [
      { id: "1", name: "Customer A", tier: "A" },
      { id: "2", name: "Customer B", tier: "B" }
    ];
    
    const { getByText } = render(<CustomerTierDashboard customers={customers} />);
    
    expect(getByText("Customer A")).toBeInTheDocument();
    expect(getByText("Tier A")).toBeInTheDocument();
  });

  it("should allow exporting tier data to CSV", () => {
    const customers = [{ id: "1", name: "Customer A", tier: "A" }];
    
    const { getByRole } = render(<CustomerTierDashboard customers={customers} />);
    
    const exportButton = getByRole("button", { name: /export/i });
    fireEvent.click(exportButton);
    
    // Verify download was triggered
    expect(document.querySelector("a[download]")).toBeTruthy();
  });

  it("should filter customers by tier", () => {
    const customers = [
      { id: "1", name: "Customer A", tier: "A" },
      { id: "2", name: "Customer B", tier: "B" }
    ];
    
    const { getByText, queryByText } = render(<CustomerTierDashboard customers={customers} />);
    
    // Filter by Tier A
    fireEvent.click(getByText("Filter: Tier A"));
    
    expect(getByText("Customer A")).toBeInTheDocument();
    expect(queryByText("Customer B")).not.toBeInTheDocument();
  });
})',
    'Tests customer tier dashboard with charts and filtering',
    'components/tier-management/customer-tier-dashboard.tsx',
    87.0,
    'medium',
    1500,
    '["ui-components", "dashboard", "charts", "export"]',
    '["react", "testing-library", "recharts"]',
    '["component", "ui", "dashboard"]'
),

(
    'TierAuditLog - Audit trail display',
    'unit',
    'describe("TierAuditLog Component", () => {
  it("should display audit log entries", () => {
    const auditEntries = [
      {
        id: "1",
        customer_id: "customer-1",
        action: "assigned",
        tier: "A",
        changed_at: "2025-01-01T10:00:00Z"
      }
    ];
    
    const { getByText } = render(<TierAuditLog entries={auditEntries} />);
    
    expect(getByText(/assigned/i)).toBeInTheDocument();
    expect(getByText("Tier A")).toBeInTheDocument();
  });

  it("should format timestamps correctly", () => {
    const auditEntries = [
      {
        id: "1",
        customer_id: "customer-1",
        action: "assigned",
        changed_at: "2025-01-01T10:00:00Z"
      }
    ];
    
    const { getByText } = render(<TierAuditLog entries={auditEntries} />);
    
    expect(getByText(/Jan 1, 2025/i)).toBeInTheDocument();
  });

  it("should filter by action type", () => {
    const auditEntries = [
      { id: "1", action: "assigned", customer_id: "c1" },
      { id: "2", action: "removed", customer_id: "c2" }
    ];
    
    const { getByText, queryByText } = render(<TierAuditLog entries={auditEntries} />);
    
    // Filter by assigned
    fireEvent.click(getByText("Show Assigned Only"));
    
    expect(getByText(/assigned/i)).toBeInTheDocument();
    expect(queryByText(/removed/i)).not.toBeInTheDocument();
  });

  it("should paginate long audit logs", () => {
    const auditEntries = Array.from({ length: 50 }, (_, i) => ({
      id: `${i}`,
      action: "assigned",
      customer_id: `customer-${i}`
    }));
    
    const { getByText, queryByText } = render(<TierAuditLog entries={auditEntries} />);
    
    expect(getByText("customer-0")).toBeInTheDocument();
    expect(queryByText("customer-49")).not.toBeInTheDocument();
    
    // Go to next page
    fireEvent.click(getByText("Next"));
    
    expect(queryByText("customer-0")).not.toBeInTheDocument();
  });
})',
    'Tests tier audit log component with filtering and pagination',
    'components/tier-management/tier-audit-log.tsx',
    86.0,
    'medium',
    1400,
    '["ui-components", "audit-log", "pagination"]',
    '["react", "testing-library"]',
    '["component", "ui", "audit"]'
),

-- ============================================================================
-- WORKFLOW TESTS - End-to-End Scenarios
-- ============================================================================

(
    'Tier Management Wizard - Complete workflow',
    'e2e',
    'describe("Tier Management Wizard Workflow", () => {
  it("should complete full tier setup workflow", async () => {
    // Step 1: Rule Configuration
    const { getByLabelText, getByRole } = render(<TierManagementWizard />);
    
    fireEvent.change(getByLabelText(/rule name/i), {
      target: { value: "Test Volume Discount" }
    });
    fireEvent.change(getByLabelText(/rule type/i), {
      target: { value: "volume" }
    });
    fireEvent.click(getByRole("button", { name: /next/i }));
    
    // Step 2: Tier Configuration
    await waitFor(() => {
      expect(getByText(/configure tiers/i)).toBeInTheDocument();
    });
    
    fireEvent.change(getByLabelText(/tier a discount/i), {
      target: { value: "10" }
    });
    fireEvent.change(getByLabelText(/tier b discount/i), {
      target: { value: "15" }
    });
    fireEvent.click(getByRole("button", { name: /next/i }));
    
    // Step 3: Customer Assignment
    await waitFor(() => {
      expect(getByText(/assign customers/i)).toBeInTheDocument();
    });
    
    fireEvent.click(getByText("Customer 1"));
    fireEvent.change(getByRole("combobox"), { target: { value: "A" } });
    fireEvent.click(getByRole("button", { name: /next/i }));
    
    // Step 4: Review and Submit
    await waitFor(() => {
      expect(getByText(/review/i)).toBeInTheDocument();
    });
    
    fireEvent.click(getByRole("button", { name: /submit/i }));
    
    await waitFor(() => {
      expect(getByText(/success/i)).toBeInTheDocument();
    });
  });

  it("should validate each step before proceeding", async () => {
    const { getByRole, getByText } = render(<TierManagementWizard />);
    
    // Try to proceed without filling required fields
    fireEvent.click(getByRole("button", { name: /next/i }));
    
    expect(getByText(/rule name is required/i)).toBeInTheDocument();
  });

  it("should allow going back to previous steps", async () => {
    const { getByRole, getByLabelText } = render(<TierManagementWizard />);
    
    // Fill step 1 and proceed
    fireEvent.change(getByLabelText(/rule name/i), {
      target: { value: "Test Rule" }
    });
    fireEvent.click(getByRole("button", { name: /next/i }));
    
    // Go back
    fireEvent.click(getByRole("button", { name: /back/i }));
    
    // Verify we are back on step 1
    expect(getByLabelText(/rule name/i)).toHaveValue("Test Rule");
  });

  it("should save draft and resume later", async () => {
    const { getByRole, getByLabelText } = render(<TierManagementWizard />);
    
    // Fill partial data
    fireEvent.change(getByLabelText(/rule name/i), {
      target: { value: "Draft Rule" }
    });
    
    // Save draft
    fireEvent.click(getByRole("button", { name: /save draft/i }));
    
    // Reload component
    const { getByLabelText: getByLabelText2 } = render(<TierManagementWizard />);
    
    // Verify draft is loaded
    expect(getByLabelText2(/rule name/i)).toHaveValue("Draft Rule");
  });
})',
    'Tests complete tier management wizard workflow from start to finish',
    'components/tier-management/wizard',
    95.0,
    'high',
    3500,
    '["e2e", "wizard", "workflow", "validation"]',
    '["react", "testing-library", "user-flow"]',
    '["e2e", "workflow", "tier-management"]'
),

(
    'Tier Assignment Lifecycle - Create, Update, Delete',
    'e2e',
    'describe("Tier Assignment Lifecycle", () => {
  it("should handle complete assignment lifecycle", async () => {
    // Create assignment
    const createResponse = await fetch("/api/discount-rules/rule-1/assignments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ customer_id: "customer-1", tier: "A" })
    });
    expect(createResponse.status).toBe(201);
    const created = await createResponse.json();
    
    // Verify assignment exists
    const getResponse = await fetch("/api/discount-rules/rule-1/assignments");
    const assignments = await getResponse.json();
    expect(assignments.data.some(a => a.customer_id === "customer-1")).toBe(true);
    
    // Update assignment (reassign to different tier)
    const updateResponse = await fetch("/api/discount-rules/rule-1/assignments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ customer_id: "customer-1", tier: "B" })
    });
    expect(updateResponse.status).toBe(200);
    
    // Verify audit log
    const auditResponse = await fetch("/api/tier-assignments/audit?customer_id=customer-1");
    const audit = await auditResponse.json();
    expect(audit.data.length).toBeGreaterThan(1);
    
    // Delete assignment
    const deleteResponse = await fetch(
      "/api/discount-rules/rule-1/assignments/customer-1",
      { method: "DELETE" }
    );
    expect(deleteResponse.status).toBe(200);
    
    // Verify deletion
    const finalGetResponse = await fetch("/api/discount-rules/rule-1/assignments");
    const finalAssignments = await finalGetResponse.json();
    expect(finalAssignments.data.some(a => a.customer_id === "customer-1")).toBe(false);
  });
})',
    'Tests complete lifecycle of tier assignments including audit trail',
    'Tier Assignment APIs',
    93.0,
    'high',
    2800,
    '["e2e", "lifecycle", "crud", "audit"]',
    '["fetch", "database", "audit"]',
    '["e2e", "integration", "tier-assignments"]'
),

-- ============================================================================
-- EDGE CASE AND ERROR HANDLING TESTS
-- ============================================================================

(
    'Tier Management - Edge Cases and Error Handling',
    'integration',
    'describe("Tier Management Edge Cases", () => {
  it("should handle concurrent tier assignments", async () => {
    const assignments = Array.from({ length: 10 }, (_, i) => 
      fetch("/api/discount-rules/rule-1/assignments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customer_id: `customer-${i}`, tier: "A" })
      })
    );
    
    const results = await Promise.all(assignments);
    const successCount = results.filter(r => r.status === 201).length;
    
    expect(successCount).toBe(10);
  });

  it("should handle expired discount rules", async () => {
    const expiredRule = {
      name: "Expired Rule",
      rule_type: "volume",
      status: "active",
      start_date: "2024-01-01",
      end_date: "2024-12-31"
    };
    
    const response = await fetch("/api/discount-rules", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(expiredRule)
    });
    
    // Should create but mark as expired
    expect(response.status).toBe(201);
    const data = await response.json();
    expect(data.data.is_expired).toBe(true);
  });

  it("should handle customer with multiple tier assignments", async () => {
    const customerId = "multi-tier-customer";
    
    // Assign to multiple rules
    await fetch("/api/discount-rules/rule-1/assignments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ customer_id: customerId, tier: "A" })
    });
    
    await fetch("/api/discount-rules/rule-2/assignments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ customer_id: customerId, tier: "B" })
    });
    
    // Get all tiers for customer
    const response = await fetch(`/api/customers/${customerId}/tiers`);
    const data = await response.json();
    
    expect(data.data.length).toBe(2);
  });

  it("should handle malformed request bodies", async () => {
    const response = await fetch("/api/discount-rules", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "invalid json"
    });
    
    expect(response.status).toBe(400);
  });

  it("should handle database connection failures gracefully", async () => {
    // Simulate database error
    const response = await fetch("/api/discount-rules?simulate_db_error=true");
    
    expect(response.status).toBe(500);
    const data = await response.json();
    expect(data.error).toContain("database");
  });

  it("should prevent SQL injection in filters", async () => {
    const maliciousInput = "1; DROP TABLE discount_rules; --";
    const response = await fetch(
      `/api/discount-rules?name=${encodeURIComponent(maliciousInput)}`
    );
    
    expect(response.status).toBe(200);
    // Should return empty results, not execute SQL
    const data = await response.json();
    expect(Array.isArray(data.data)).toBe(true);
  });
})',
    'Tests edge cases, error handling, and security for tier management',
    'Tier Management System',
    94.0,
    'high',
    2500,
    '["edge-cases", "error-handling", "security", "concurrency"]',
    '["fetch", "database", "security"]',
    '["integration", "security", "edge-cases"]'
),

-- ============================================================================
-- PERFORMANCE TESTS
-- ============================================================================

(
    'Tier Management - Performance Tests',
    'performance',
    'describe("Tier Management Performance", () => {
  it("should handle 1000 tier assignments efficiently", async () => {
    const startTime = Date.now();
    
    const assignments = Array.from({ length: 1000 }, (_, i) => ({
      customer_id: `customer-${i}`,
      tier: ["A", "B", "C"][i % 3]
    }));
    
    const response = await fetch("/api/tier-assignments/bulk", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rule_id: "test-rule", assignments })
    });
    
    const duration = Date.now() - startTime;
    
    expect(response.status).toBe(200);
    expect(duration).toBeLessThan(10000); // Should complete within 10 seconds
  });

  it("should query customer tiers with sub-200ms response time", async () => {
    const startTime = Date.now();
    
    const response = await fetch("/api/customers/customer-1/tiers");
    
    const duration = Date.now() - startTime;
    
    expect(response.status).toBe(200);
    expect(duration).toBeLessThan(200);
  });

  it("should handle concurrent rule creation", async () => {
    const startTime = Date.now();
    
    const rules = Array.from({ length: 50 }, (_, i) => 
      fetch("/api/discount-rules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `Concurrent Rule ${i}`,
          rule_type: "volume",
          status: "active",
          start_date: "2025-01-01"
        })
      })
    );
    
    const results = await Promise.all(rules);
    const duration = Date.now() - startTime;
    
    const successCount = results.filter(r => r.status === 201).length;
    expect(successCount).toBe(50);
    expect(duration).toBeLessThan(15000);
  });

  it("should paginate large result sets efficiently", async () => {
    const startTime = Date.now();
    
    const response = await fetch("/api/discount-rules?limit=100&offset=0");
    
    const duration = Date.now() - startTime;
    
    expect(response.status).toBe(200);
    expect(duration).toBeLessThan(500);
  });
})',
    'Performance tests for tier management operations',
    'Tier Management System',
    91.0,
    'high',
    5000,
    '["performance", "load-testing", "response-time"]',
    '["fetch", "performance"]',
    '["performance", "load-testing"]'
);

-- Update test execution counts
UPDATE ai_generated_tests 
SET execution_count = 0, success_count = 0
WHERE test_name LIKE '%tier%' OR test_name LIKE '%discount-rules%';

COMMENT ON TABLE ai_generated_tests IS 'Comprehensive test suite for tier management functionality (TM-031)';
