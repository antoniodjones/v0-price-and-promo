-- ============================================================================
-- Script 128: Create Jira & GitLab Integration User Stories
-- ============================================================================
-- Purpose: Create comprehensive user stories for Jira and GitLab integration
-- Epic: Integration Management
-- Total Tasks: 11 (79 story points)
-- ============================================================================

BEGIN;

-- ============================================================================
-- PHASE 1: JIRA INTEGRATION (24 Story Points)
-- ============================================================================

-- Task 1.1: Build Jira API Service Layer
INSERT INTO user_stories (
  story_id, title, description, acceptance_criteria, technical_notes,
  epic, tags, status, priority, story_points,
  created_by, updated_by, created_at, updated_at
)
VALUES (
  'CS-004-A',
  'Build Jira API Service Layer',
  'As a developer, I need a robust Jira API service layer so that I can programmatically interact with Jira issues from the pricing engine.',
  '### Scenario 1: Initialize Jira Client
\`\`\`gherkin
Given valid Jira credentials are configured
When the Jira API client initializes
Then it should authenticate successfully with Jira
And provide methods for CRUD operations on issues
And handle API rate limiting gracefully
And log all API interactions
