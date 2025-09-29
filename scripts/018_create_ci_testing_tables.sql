-- Continuous Integration and Testing Tables
-- This script creates tables for storing CI/CD pipeline data and advanced testing metrics

-- CI Pipeline executions
CREATE TABLE IF NOT EXISTS ci_pipeline_executions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pipeline_name VARCHAR(200) NOT NULL,
    branch_name VARCHAR(100) NOT NULL,
    commit_hash VARCHAR(40),
    status VARCHAR(20) NOT NULL, -- running, passed, failed, cancelled, queued
    triggered_by VARCHAR(100),
    start_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    end_time TIMESTAMP WITH TIME ZONE,
    duration_ms INTEGER,
    
    -- Test results
    total_tests INTEGER DEFAULT 0,
    passed_tests INTEGER DEFAULT 0,
    failed_tests INTEGER DEFAULT 0,
    skipped_tests INTEGER DEFAULT 0,
    
    -- Coverage metrics
    code_coverage DECIMAL(5,2) DEFAULT 0,
    line_coverage DECIMAL(5,2) DEFAULT 0,
    branch_coverage DECIMAL(5,2) DEFAULT 0,
    
    -- Artifacts and logs
    artifacts JSONB DEFAULT '[]',
    build_logs TEXT,
    error_logs TEXT,
    
    -- Metadata
    environment VARCHAR(50) DEFAULT 'development',
    pipeline_config JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- CI Pipeline stages
CREATE TABLE IF NOT EXISTS ci_pipeline_stages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pipeline_execution_id UUID NOT NULL REFERENCES ci_pipeline_executions(id) ON DELETE CASCADE,
    stage_name VARCHAR(100) NOT NULL,
    stage_order INTEGER NOT NULL,
    status VARCHAR(20) NOT NULL, -- running, passed, failed, skipped, pending
    start_time TIMESTAMP WITH TIME ZONE,
    end_time TIMESTAMP WITH TIME ZONE,
    duration_ms INTEGER,
    logs TEXT,
    error_message TEXT,
    stage_config JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Generated tests from AI
CREATE TABLE IF NOT EXISTS ai_generated_tests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    test_name VARCHAR(200) NOT NULL,
    test_type VARCHAR(50) NOT NULL, -- unit, integration, e2e, performance, security
    generated_code TEXT NOT NULL,
    description TEXT,
    target_component VARCHAR(200),
    
    -- AI metrics
    confidence_score DECIMAL(5,2) DEFAULT 0, -- 0-100
    complexity_level VARCHAR(20) DEFAULT 'medium', -- low, medium, high
    estimated_runtime_ms INTEGER,
    
    -- Coverage and dependencies
    coverage_areas JSONB DEFAULT '[]',
    dependencies JSONB DEFAULT '[]',
    tags JSONB DEFAULT '[]',
    
    -- Execution results
    execution_count INTEGER DEFAULT 0,
    success_count INTEGER DEFAULT 0,
    last_executed TIMESTAMP WITH TIME ZONE,
    last_result VARCHAR(20), -- passed, failed, skipped
    
    -- Metadata
    generated_by VARCHAR(100),
    generation_prompt TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Test analysis results
CREATE TABLE IF NOT EXISTS test_analysis_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    test_identifier VARCHAR(200) NOT NULL, -- test name or file path
    analysis_type VARCHAR(50) NOT NULL, -- ai_analysis, performance_analysis, quality_analysis
    
    -- Analysis scores
    overall_score DECIMAL(5,2) DEFAULT 0, -- 0-100
    performance_score DECIMAL(5,2) DEFAULT 0,
    reliability_score DECIMAL(5,2) DEFAULT 0,
    maintainability_score DECIMAL(5,2) DEFAULT 0,
    coverage_score DECIMAL(5,2) DEFAULT 0,
    
    -- Issues detected
    issues_detected JSONB DEFAULT '[]', -- array of issue objects
    recommendations JSONB DEFAULT '[]', -- array of recommendation strings
    
    -- Metrics
    execution_time_ms INTEGER,
    memory_usage_mb DECIMAL(8,2),
    flakiness_score DECIMAL(5,2) DEFAULT 0,
    
    -- Analysis metadata
    analyzed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    analyzer_version VARCHAR(20),
    analysis_config JSONB DEFAULT '{}'
);

-- Test execution history
CREATE TABLE IF NOT EXISTS test_execution_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    test_identifier VARCHAR(200) NOT NULL,
    execution_context VARCHAR(100), -- ci_pipeline, manual, scheduled
    pipeline_execution_id UUID REFERENCES ci_pipeline_executions(id),
    
    -- Execution details
    status VARCHAR(20) NOT NULL, -- passed, failed, skipped, error
    start_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    end_time TIMESTAMP WITH TIME ZONE,
    duration_ms INTEGER,
    
    -- Test results
    assertions_total INTEGER DEFAULT 0,
    assertions_passed INTEGER DEFAULT 0,
    assertions_failed INTEGER DEFAULT 0,
    
    -- Error details
    error_message TEXT,
    stack_trace TEXT,
    failure_reason VARCHAR(200),
    
    -- Performance metrics
    memory_peak_mb DECIMAL(8,2),
    cpu_usage_percent DECIMAL(5,2),
    
    -- Metadata
    test_runner VARCHAR(50),
    environment VARCHAR(50),
    browser VARCHAR(50), -- for e2e tests
    device VARCHAR(50), -- for mobile tests
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Performance benchmarks
CREATE TABLE IF NOT EXISTS performance_benchmarks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    benchmark_name VARCHAR(200) NOT NULL,
    test_category VARCHAR(50) NOT NULL, -- api_response, page_load, database_query, calculation
    
    -- Performance metrics
    avg_response_time_ms DECIMAL(10,2) NOT NULL,
    min_response_time_ms DECIMAL(10,2) NOT NULL,
    max_response_time_ms DECIMAL(10,2) NOT NULL,
    p95_response_time_ms DECIMAL(10,2),
    p99_response_time_ms DECIMAL(10,2),
    
    -- Throughput metrics
    requests_per_second DECIMAL(10,2),
    concurrent_users INTEGER,
    success_rate DECIMAL(5,2) DEFAULT 100,
    
    -- Resource usage
    cpu_usage_avg DECIMAL(5,2),
    memory_usage_avg_mb DECIMAL(10,2),
    disk_io_mb DECIMAL(10,2),
    network_io_mb DECIMAL(10,2),
    
    -- Benchmark metadata
    measured_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    measurement_duration_ms INTEGER,
    environment VARCHAR(50),
    load_profile JSONB DEFAULT '{}',
    
    -- Comparison data
    baseline_response_time_ms DECIMAL(10,2),
    performance_change_percent DECIMAL(5,2),
    regression_detected BOOLEAN DEFAULT FALSE
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_ci_executions_status ON ci_pipeline_executions(status);
CREATE INDEX IF NOT EXISTS idx_ci_executions_branch ON ci_pipeline_executions(branch_name);
CREATE INDEX IF NOT EXISTS idx_ci_executions_created_at ON ci_pipeline_executions(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_ci_stages_pipeline_id ON ci_pipeline_stages(pipeline_execution_id);
CREATE INDEX IF NOT EXISTS idx_ci_stages_status ON ci_pipeline_stages(status);

CREATE INDEX IF NOT EXISTS idx_ai_tests_type ON ai_generated_tests(test_type);
CREATE INDEX IF NOT EXISTS idx_ai_tests_confidence ON ai_generated_tests(confidence_score DESC);
CREATE INDEX IF NOT EXISTS idx_ai_tests_created_at ON ai_generated_tests(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_test_analysis_identifier ON test_analysis_results(test_identifier);
CREATE INDEX IF NOT EXISTS idx_test_analysis_score ON test_analysis_results(overall_score DESC);
CREATE INDEX IF NOT EXISTS idx_test_analysis_analyzed_at ON test_analysis_results(analyzed_at DESC);

CREATE INDEX IF NOT EXISTS idx_test_execution_identifier ON test_execution_history(test_identifier);
CREATE INDEX IF NOT EXISTS idx_test_execution_status ON test_execution_history(status);
CREATE INDEX IF NOT EXISTS idx_test_execution_created_at ON test_execution_history(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_performance_benchmarks_name ON performance_benchmarks(benchmark_name);
CREATE INDEX IF NOT EXISTS idx_performance_benchmarks_category ON performance_benchmarks(test_category);
CREATE INDEX IF NOT EXISTS idx_performance_benchmarks_measured_at ON performance_benchmarks(measured_at DESC);

-- Functions for CI/CD operations

-- Function to create a new pipeline execution
CREATE OR REPLACE FUNCTION create_pipeline_execution(
    p_pipeline_name VARCHAR(200),
    p_branch_name VARCHAR(100),
    p_commit_hash VARCHAR(40) DEFAULT NULL,
    p_triggered_by VARCHAR(100) DEFAULT NULL,
    p_environment VARCHAR(50) DEFAULT 'development'
)
RETURNS UUID AS $$
DECLARE
    execution_id UUID;
BEGIN
    INSERT INTO ci_pipeline_executions (
        pipeline_name,
        branch_name,
        commit_hash,
        triggered_by,
        environment,
        status
    ) VALUES (
        p_pipeline_name,
        p_branch_name,
        p_commit_hash,
        p_triggered_by,
        p_environment,
        'queued'
    ) RETURNING id INTO execution_id;
    
    RETURN execution_id;
END;
$$ LANGUAGE plpgsql;

-- Function to update pipeline execution status
CREATE OR REPLACE FUNCTION update_pipeline_execution(
    p_execution_id UUID,
    p_status VARCHAR(20),
    p_total_tests INTEGER DEFAULT NULL,
    p_passed_tests INTEGER DEFAULT NULL,
    p_failed_tests INTEGER DEFAULT NULL,
    p_skipped_tests INTEGER DEFAULT NULL,
    p_code_coverage DECIMAL(5,2) DEFAULT NULL
)
RETURNS void AS $$
BEGIN
    UPDATE ci_pipeline_executions SET
        status = p_status,
        end_time = CASE WHEN p_status IN ('passed', 'failed', 'cancelled') THEN NOW() ELSE end_time END,
        duration_ms = CASE WHEN p_status IN ('passed', 'failed', 'cancelled') THEN EXTRACT(EPOCH FROM (NOW() - start_time)) * 1000 ELSE duration_ms END,
        total_tests = COALESCE(p_total_tests, total_tests),
        passed_tests = COALESCE(p_passed_tests, passed_tests),
        failed_tests = COALESCE(p_failed_tests, failed_tests),
        skipped_tests = COALESCE(p_skipped_tests, skipped_tests),
        code_coverage = COALESCE(p_code_coverage, code_coverage)
    WHERE id = p_execution_id;
END;
$$ LANGUAGE plpgsql;

-- Function to record test execution
CREATE OR REPLACE FUNCTION record_test_execution(
    p_test_identifier VARCHAR(200),
    p_status VARCHAR(20),
    p_duration_ms INTEGER,
    p_pipeline_execution_id UUID DEFAULT NULL,
    p_error_message TEXT DEFAULT NULL,
    p_assertions_total INTEGER DEFAULT 0,
    p_assertions_passed INTEGER DEFAULT 0
)
RETURNS UUID AS $$
DECLARE
    execution_id UUID;
BEGIN
    INSERT INTO test_execution_history (
        test_identifier,
        status,
        duration_ms,
        pipeline_execution_id,
        error_message,
        assertions_total,
        assertions_passed,
        assertions_failed,
        end_time
    ) VALUES (
        p_test_identifier,
        p_status,
        p_duration_ms,
        p_pipeline_execution_id,
        p_error_message,
        p_assertions_total,
        p_assertions_passed,
        p_assertions_total - p_assertions_passed,
        NOW()
    ) RETURNING id INTO execution_id;
    
    RETURN execution_id;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate test reliability score
CREATE OR REPLACE FUNCTION calculate_test_reliability(p_test_identifier VARCHAR(200))
RETURNS DECIMAL(5,2) AS $$
DECLARE
    total_executions INTEGER;
    successful_executions INTEGER;
    reliability_score DECIMAL(5,2);
BEGIN
    SELECT 
        COUNT(*),
        COUNT(*) FILTER (WHERE status = 'passed')
    INTO total_executions, successful_executions
    FROM test_execution_history 
    WHERE test_identifier = p_test_identifier
    AND created_at >= NOW() - INTERVAL '30 days';
    
    IF total_executions = 0 THEN
        RETURN 0;
    END IF;
    
    reliability_score := (successful_executions::DECIMAL / total_executions) * 100;
    RETURN reliability_score;
END;
$$ LANGUAGE plpgsql;

-- Function to detect performance regressions
CREATE OR REPLACE FUNCTION detect_performance_regression(
    p_benchmark_name VARCHAR(200),
    p_current_response_time DECIMAL(10,2),
    p_threshold_percent DECIMAL(5,2) DEFAULT 20.0
)
RETURNS BOOLEAN AS $$
DECLARE
    baseline_time DECIMAL(10,2);
    regression_detected BOOLEAN := FALSE;
BEGIN
    -- Get the average response time from the last 7 days (excluding today)
    SELECT AVG(avg_response_time_ms)
    INTO baseline_time
    FROM performance_benchmarks
    WHERE benchmark_name = p_benchmark_name
    AND measured_at >= NOW() - INTERVAL '7 days'
    AND measured_at < CURRENT_DATE;
    
    IF baseline_time IS NOT NULL AND baseline_time > 0 THEN
        IF ((p_current_response_time - baseline_time) / baseline_time * 100) > p_threshold_percent THEN
            regression_detected := TRUE;
        END IF;
    END IF;
    
    RETURN regression_detected;
END;
$$ LANGUAGE plpgsql;

-- Insert sample data for testing
INSERT INTO ci_pipeline_executions (pipeline_name, branch_name, status, total_tests, passed_tests, failed_tests, code_coverage) VALUES
('GTI Pricing Engine - Main', 'main', 'passed', 247, 231, 12, 87.3),
('GTI Pricing Engine - Develop', 'develop', 'passed', 234, 228, 6, 89.1),
('GTI Pricing Engine - Feature', 'feature/bulk-pricing', 'running', 0, 0, 0, 0);

INSERT INTO ai_generated_tests (test_name, test_type, generated_code, description, confidence_score, complexity_level) VALUES
('PricingCalculator.calculateBulkDiscount', 'unit', 'describe("calculateBulkDiscount", () => { /* test code */ })', 'Tests bulk discount calculation logic', 94.5, 'medium'),
('API Integration: POST /api/pricing/bulk-calculate', 'integration', 'describe("POST /api/pricing/bulk-calculate", () => { /* test code */ })', 'Integration tests for bulk pricing API', 89.2, 'high');

COMMENT ON TABLE ci_pipeline_executions IS 'Stores CI/CD pipeline execution records and results';
COMMENT ON TABLE ci_pipeline_stages IS 'Individual stages within CI/CD pipeline executions';
COMMENT ON TABLE ai_generated_tests IS 'AI-generated test cases with metadata and execution tracking';
COMMENT ON TABLE test_analysis_results IS 'AI-powered analysis results for test quality and performance';
COMMENT ON TABLE test_execution_history IS 'Historical record of all test executions';
COMMENT ON TABLE performance_benchmarks IS 'Performance benchmark results and regression detection';
