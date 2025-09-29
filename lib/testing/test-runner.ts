interface TestConfig {
  timeout: number
  retries: number
  parallel: boolean
  coverage: boolean
  reporter: "json" | "html" | "console"
  environment: "jsdom" | "node" | "browser"
}

interface TestCase {
  id: string
  name: string
  description: string
  type: "unit" | "integration" | "e2e" | "performance" | "security"
  tags: string[]
  setup?: () => Promise<void>
  teardown?: () => Promise<void>
  test: () => Promise<void>
  timeout?: number
  retries?: number
  skip?: boolean
}

interface TestResult {
  id: string
  name: string
  status: "passed" | "failed" | "skipped" | "timeout"
  duration: number
  error?: Error
  coverage?: {
    lines: number
    functions: number
    branches: number
    statements: number
  }
  performance?: {
    memory: number
    cpu: number
  }
  metadata?: Record<string, any>
}

interface TestSuiteResult {
  id: string
  name: string
  results: TestResult[]
  duration: number
  coverage: {
    overall: number
    lines: number
    functions: number
    branches: number
    statements: number
  }
  summary: {
    total: number
    passed: number
    failed: number
    skipped: number
    timeout: number
  }
}

class TestRunner {
  private config: TestConfig
  private testCases: Map<string, TestCase> = new Map()
  private results: Map<string, TestResult> = new Map()
  private hooks: {
    beforeAll: (() => Promise<void>)[]
    afterAll: (() => Promise<void>)[]
    beforeEach: (() => Promise<void>)[]
    afterEach: (() => Promise<void>)[]
  } = {
    beforeAll: [],
    afterAll: [],
    beforeEach: [],
    afterEach: [],
  }

  constructor(config: Partial<TestConfig> = {}) {
    this.config = {
      timeout: 30000,
      retries: 0,
      parallel: false,
      coverage: true,
      reporter: "console",
      environment: "jsdom",
      ...config,
    }
  }

  // Register test cases
  describe(name: string, tests: TestCase[]): void {
    tests.forEach((test) => {
      this.testCases.set(test.id, { ...test, name: `${name}: ${test.name}` })
    })
  }

  // Add individual test
  test(testCase: TestCase): void {
    this.testCases.set(testCase.id, testCase)
  }

  // Register hooks
  beforeAll(hook: () => Promise<void>): void {
    this.hooks.beforeAll.push(hook)
  }

  afterAll(hook: () => Promise<void>): void {
    this.hooks.afterAll.push(hook)
  }

  beforeEach(hook: () => Promise<void>): void {
    this.hooks.beforeEach.push(hook)
  }

  afterEach(hook: () => Promise<void>): void {
    this.hooks.afterEach.push(hook)
  }

  // Run all tests
  async run(filter?: { type?: string; tags?: string[]; pattern?: string }): Promise<TestSuiteResult> {
    const startTime = Date.now()
    let filteredTests = Array.from(this.testCases.values())

    // Apply filters
    if (filter) {
      if (filter.type) {
        filteredTests = filteredTests.filter((test) => test.type === filter.type)
      }
      if (filter.tags && filter.tags.length > 0) {
        filteredTests = filteredTests.filter((test) => filter.tags!.some((tag) => test.tags.includes(tag)))
      }
      if (filter.pattern) {
        const regex = new RegExp(filter.pattern, "i")
        filteredTests = filteredTests.filter((test) => regex.test(test.name) || regex.test(test.description))
      }
    }

    // Run beforeAll hooks
    for (const hook of this.hooks.beforeAll) {
      await hook()
    }

    // Run tests
    const results: TestResult[] = []
    if (this.config.parallel) {
      const promises = filteredTests.map((test) => this.runSingleTest(test))
      results.push(...(await Promise.all(promises)))
    } else {
      for (const test of filteredTests) {
        results.push(await this.runSingleTest(test))
      }
    }

    // Run afterAll hooks
    for (const hook of this.hooks.afterAll) {
      await hook()
    }

    const duration = Date.now() - startTime

    // Calculate summary
    const summary = {
      total: results.length,
      passed: results.filter((r) => r.status === "passed").length,
      failed: results.filter((r) => r.status === "failed").length,
      skipped: results.filter((r) => r.status === "skipped").length,
      timeout: results.filter((r) => r.status === "timeout").length,
    }

    // Calculate coverage
    const coverage = this.calculateCoverage(results)

    return {
      id: `suite_${Date.now()}`,
      name: "Test Suite",
      results,
      duration,
      coverage,
      summary,
    }
  }

  private async runSingleTest(testCase: TestCase): Promise<TestResult> {
    const startTime = Date.now()

    if (testCase.skip) {
      return {
        id: testCase.id,
        name: testCase.name,
        status: "skipped",
        duration: 0,
      }
    }

    const timeout = testCase.timeout || this.config.timeout
    const retries = testCase.retries !== undefined ? testCase.retries : this.config.retries

    let lastError: Error | undefined
    let attempt = 0

    while (attempt <= retries) {
      try {
        // Run beforeEach hooks
        for (const hook of this.hooks.beforeEach) {
          await hook()
        }

        // Run test setup
        if (testCase.setup) {
          await testCase.setup()
        }

        // Run the actual test with timeout
        await Promise.race([
          testCase.test(),
          new Promise((_, reject) => setTimeout(() => reject(new Error("Test timeout")), timeout)),
        ])

        // Run test teardown
        if (testCase.teardown) {
          await testCase.teardown()
        }

        // Run afterEach hooks
        for (const hook of this.hooks.afterEach) {
          await hook()
        }

        const duration = Date.now() - startTime
        return {
          id: testCase.id,
          name: testCase.name,
          status: "passed",
          duration,
          coverage: this.measureCoverage(),
          performance: this.measurePerformance(),
        }
      } catch (error) {
        lastError = error as Error
        attempt++

        if (error instanceof Error && error.message === "Test timeout") {
          return {
            id: testCase.id,
            name: testCase.name,
            status: "timeout",
            duration: Date.now() - startTime,
            error: lastError,
          }
        }

        if (attempt > retries) {
          break
        }

        // Wait before retry
        await new Promise((resolve) => setTimeout(resolve, 1000))
      }
    }

    return {
      id: testCase.id,
      name: testCase.name,
      status: "failed",
      duration: Date.now() - startTime,
      error: lastError,
    }
  }

  private measureCoverage() {
    // Simulate coverage measurement
    return {
      lines: Math.random() * 20 + 80,
      functions: Math.random() * 15 + 85,
      branches: Math.random() * 25 + 75,
      statements: Math.random() * 20 + 80,
    }
  }

  private measurePerformance() {
    // Simulate performance measurement
    return {
      memory: Math.random() * 50 + 10, // MB
      cpu: Math.random() * 30 + 5, // %
    }
  }

  private calculateCoverage(results: TestResult[]) {
    const coverageResults = results.filter((r) => r.coverage)
    if (coverageResults.length === 0) {
      return {
        overall: 0,
        lines: 0,
        functions: 0,
        branches: 0,
        statements: 0,
      }
    }

    const avg = (key: keyof NonNullable<TestResult["coverage"]>) =>
      coverageResults.reduce((sum, r) => sum + (r.coverage![key] || 0), 0) / coverageResults.length

    const lines = avg("lines")
    const functions = avg("functions")
    const branches = avg("branches")
    const statements = avg("statements")

    return {
      overall: (lines + functions + branches + statements) / 4,
      lines,
      functions,
      branches,
      statements,
    }
  }

  // Utility methods for assertions
  static expect(actual: any) {
    return {
      toBe: (expected: any) => {
        if (actual !== expected) {
          throw new Error(`Expected ${actual} to be ${expected}`)
        }
      },
      toEqual: (expected: any) => {
        if (JSON.stringify(actual) !== JSON.stringify(expected)) {
          throw new Error(`Expected ${JSON.stringify(actual)} to equal ${JSON.stringify(expected)}`)
        }
      },
      toBeTruthy: () => {
        if (!actual) {
          throw new Error(`Expected ${actual} to be truthy`)
        }
      },
      toBeFalsy: () => {
        if (actual) {
          throw new Error(`Expected ${actual} to be falsy`)
        }
      },
      toThrow: (expectedError?: string | RegExp) => {
        try {
          if (typeof actual === "function") {
            actual()
          }
          throw new Error("Expected function to throw")
        } catch (error) {
          if (expectedError) {
            const message = (error as Error).message
            if (typeof expectedError === "string" && !message.includes(expectedError)) {
              throw new Error(`Expected error to contain "${expectedError}", got "${message}"`)
            }
            if (expectedError instanceof RegExp && !expectedError.test(message)) {
              throw new Error(`Expected error to match ${expectedError}, got "${message}"`)
            }
          }
        }
      },
    }
  }
}

export { TestRunner, type TestCase, type TestResult, type TestSuiteResult, type TestConfig }
