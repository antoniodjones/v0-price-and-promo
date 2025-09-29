"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Sparkles,
  Code,
  Download,
  Play,
  Brain,
  Target,
  Zap,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Settings,
} from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

interface GeneratedTest {
  id: string
  name: string
  type: "unit" | "integration" | "e2e"
  code: string
  description: string
  coverage: string[]
  complexity: "low" | "medium" | "high"
  confidence: number
  estimatedRunTime: number
  dependencies: string[]
  tags: string[]
}

interface TestAnalysis {
  id: string
  testName: string
  issues: Array<{
    type: "performance" | "reliability" | "maintainability" | "coverage"
    severity: "low" | "medium" | "high" | "critical"
    description: string
    suggestion: string
  }>
  score: number
  recommendations: string[]
}

interface TestMetrics {
  generatedTests: number
  codeQuality: number
  coverageImprovement: number
  timesSaved: number
  issuesDetected: number
  automationLevel: number
}

export function AITestGenerator() {
  const [generatedTests, setGeneratedTests] = useState<GeneratedTest[]>([])
  const [testAnalyses, setTestAnalyses] = useState<TestAnalysis[]>([])
  const [metrics, setMetrics] = useState<TestMetrics | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [selectedComponent, setSelectedComponent] = useState("")
  const [testRequirements, setTestRequirements] = useState("")
  const [generationMode, setGenerationMode] = useState<"component" | "api" | "workflow">("component")

  useEffect(() => {
    generateMockMetrics()
    generateMockAnalyses()
  }, [])

  const generateMockMetrics = () => {
    setMetrics({
      generatedTests: 156,
      codeQuality: 94.2,
      coverageImprovement: 23.5,
      timesSaved: 47.8,
      issuesDetected: 23,
      automationLevel: 87.3,
    })
  }

  const generateMockAnalyses = () => {
    const mockAnalyses: TestAnalysis[] = [
      {
        id: "1",
        testName: "PricingCalculator.calculateDiscount",
        score: 85,
        issues: [
          {
            type: "performance",
            severity: "medium",
            description: "Test execution time exceeds 2 seconds",
            suggestion: "Consider mocking external API calls to improve test speed",
          },
          {
            type: "coverage",
            severity: "low",
            description: "Edge case for negative discount values not covered",
            suggestion: "Add test case for negative discount validation",
          },
        ],
        recommendations: [
          "Add boundary value testing for discount percentages",
          "Include performance benchmarks in test assertions",
          "Consider parameterized tests for multiple discount scenarios",
        ],
      },
      {
        id: "2",
        testName: "PromotionEngine.validatePromotion",
        score: 92,
        issues: [
          {
            type: "reliability",
            severity: "high",
            description: "Test fails intermittently due to timing issues",
            suggestion: "Use deterministic date mocking instead of system time",
          },
        ],
        recommendations: [
          "Implement proper test isolation",
          "Add retry logic for flaky assertions",
          "Use test fixtures for consistent data setup",
        ],
      },
    ]
    setTestAnalyses(mockAnalyses)
  }

  const generateTests = async () => {
    setIsGenerating(true)

    // Simulate AI test generation
    await new Promise((resolve) => setTimeout(resolve, 3000))

    const mockTests: GeneratedTest[] = [
      {
        id: "gen_1",
        name: `${selectedComponent || "PricingCalculator"}.calculateBulkDiscount`,
        type: "unit",
        code: `describe('${selectedComponent || "PricingCalculator"}.calculateBulkDiscount', () => {
  it('should apply bulk discount for quantities over 10', () => {
    const calculator = new PricingCalculator()
    const result = calculator.calculateBulkDiscount(15, 100)
    expect(result.discount).toBe(10)
    expect(result.finalPrice).toBe(90)
  })

  it('should not apply bulk discount for small quantities', () => {
    const calculator = new PricingCalculator()
    const result = calculator.calculateBulkDiscount(5, 100)
    expect(result.discount).toBe(0)
    expect(result.finalPrice).toBe(100)
  })

  it('should handle edge case of exactly 10 items', () => {
    const calculator = new PricingCalculator()
    const result = calculator.calculateBulkDiscount(10, 100)
    expect(result.discount).toBe(0)
    expect(result.finalPrice).toBe(100)
  })
})`,
        description: "Tests bulk discount calculation logic with various quantity scenarios",
        coverage: ["calculateBulkDiscount", "applyDiscount", "validateQuantity"],
        complexity: "medium",
        confidence: 94,
        estimatedRunTime: 1200,
        dependencies: ["PricingCalculator", "DiscountEngine"],
        tags: ["pricing", "discounts", "bulk-orders"],
      },
      {
        id: "gen_2",
        name: "API Integration: POST /api/pricing/bulk-calculate",
        type: "integration",
        code: `describe('POST /api/pricing/bulk-calculate', () => {
  it('should calculate bulk pricing for multiple products', async () => {
    const response = await request(app)
      .post('/api/pricing/bulk-calculate')
      .send({
        products: [
          { id: '1', quantity: 15, basePrice: 100 },
          { id: '2', quantity: 8, basePrice: 50 }
        ]
      })
      .expect(200)

    expect(response.body.calculations).toHaveLength(2)
    expect(response.body.calculations[0].discount).toBeGreaterThan(0)
    expect(response.body.totalSavings).toBeGreaterThan(0)
  })

  it('should handle invalid product data gracefully', async () => {
    const response = await request(app)
      .post('/api/pricing/bulk-calculate')
      .send({ products: [] })
      .expect(400)

    expect(response.body.error).toContain('products array cannot be empty')
  })
})`,
        description: "Integration tests for bulk pricing API endpoint",
        coverage: ["bulk-calculate endpoint", "validation middleware", "pricing service"],
        complexity: "high",
        confidence: 89,
        estimatedRunTime: 2500,
        dependencies: ["supertest", "pricing-service", "validation-middleware"],
        tags: ["api", "integration", "bulk-pricing"],
      },
    ]

    setGeneratedTests(mockTests)
    setIsGenerating(false)
  }

  const analyzeTests = async () => {
    setIsAnalyzing(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    generateMockAnalyses()
    setIsAnalyzing(false)
  }

  const downloadTestCode = (test: GeneratedTest) => {
    const blob = new Blob([test.code], { type: "text/javascript" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${test.name.replace(/[^a-zA-Z0-9]/g, "_")}.test.js`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-100 text-red-800"
      case "high":
        return "bg-orange-100 text-orange-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const pieData = [
    { name: "Unit Tests", value: 45, color: "#3b82f6" },
    { name: "Integration", value: 30, color: "#10b981" },
    { name: "E2E Tests", value: 25, color: "#f59e0b" },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-2">
            <Sparkles className="h-8 w-8 text-purple-500" />
            AI Test Generator
          </h2>
          <p className="text-muted-foreground">Intelligent test generation and analysis powered by AI</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={analyzeTests} disabled={isAnalyzing}>
            <Brain className="h-4 w-4 mr-2" />
            {isAnalyzing ? "Analyzing..." : "Analyze Tests"}
          </Button>
          <Button onClick={generateTests} disabled={isGenerating}>
            <Sparkles className="h-4 w-4 mr-2" />
            {isGenerating ? "Generating..." : "Generate Tests"}
          </Button>
        </div>
      </div>

      {/* Metrics Overview */}
      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Code className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium">Generated Tests</span>
              </div>
              <div className="text-2xl font-bold text-blue-600">{metrics.generatedTests}</div>
              <div className="text-sm text-muted-foreground">+23 this week</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Target className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium">Code Quality</span>
              </div>
              <div className="text-2xl font-bold text-green-600">{metrics.codeQuality}%</div>
              <div className="text-sm text-muted-foreground">Quality score</div>
              <Progress value={metrics.codeQuality} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-purple-500" />
                <span className="text-sm font-medium">Coverage Boost</span>
              </div>
              <div className="text-2xl font-bold text-purple-600">+{metrics.coverageImprovement}%</div>
              <div className="text-sm text-muted-foreground">Improvement gained</div>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="generator" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="generator">Test Generator</TabsTrigger>
          <TabsTrigger value="analysis">Test Analysis</TabsTrigger>
          <TabsTrigger value="generated">Generated Tests</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="generator" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Test Generation Settings</CardTitle>
                <CardDescription>Configure AI test generation parameters</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="generation-mode">Generation Mode</Label>
                  <Select value={generationMode} onValueChange={(value: any) => setGenerationMode(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="component">Component Testing</SelectItem>
                      <SelectItem value="api">API Testing</SelectItem>
                      <SelectItem value="workflow">User Workflow</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="component">Target Component/API</Label>
                  <Input
                    id="component"
                    placeholder="e.g., PricingCalculator, /api/pricing/calculate"
                    value={selectedComponent}
                    onChange={(e) => setSelectedComponent(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="requirements">Test Requirements</Label>
                  <Textarea
                    id="requirements"
                    placeholder="Describe what you want to test, edge cases, business rules, etc."
                    value={testRequirements}
                    onChange={(e) => setTestRequirements(e.target.value)}
                    rows={4}
                  />
                </div>

                <Button onClick={generateTests} disabled={isGenerating} className="w-full">
                  <Sparkles className="h-4 w-4 mr-2" />
                  {isGenerating ? "Generating Tests..." : "Generate AI Tests"}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Generation Statistics</CardTitle>
                <CardDescription>AI test generation breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="text-center p-3 border rounded">
                      <div className="text-lg font-bold text-blue-600">47.8h</div>
                      <div className="text-muted-foreground">Time Saved</div>
                    </div>
                    <div className="text-center p-3 border rounded">
                      <div className="text-lg font-bold text-green-600">87.3%</div>
                      <div className="text-muted-foreground">Automation</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>AI Test Analysis</CardTitle>
              <CardDescription>Intelligent analysis of existing tests with improvement suggestions</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-4">
                  {testAnalyses.map((analysis) => (
                    <div key={analysis.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{analysis.testName}</h4>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">Score: {analysis.score}/100</Badge>
                          {analysis.score >= 90 ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <AlertTriangle className="h-4 w-4 text-yellow-500" />
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h5 className="text-sm font-medium text-muted-foreground">Issues Detected:</h5>
                        {analysis.issues.map((issue, index) => (
                          <div key={index} className="flex items-start gap-2 p-2 bg-muted rounded">
                            <Badge className={getSeverityColor(issue.severity)} variant="outline">
                              {issue.severity}
                            </Badge>
                            <div className="flex-1 text-sm">
                              <div className="font-medium">{issue.description}</div>
                              <div className="text-muted-foreground mt-1">{issue.suggestion}</div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="space-y-2">
                        <h5 className="text-sm font-medium text-muted-foreground">AI Recommendations:</h5>
                        <ul className="text-sm space-y-1">
                          {analysis.recommendations.map((rec, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="text-blue-500">•</span>
                              <span>{rec}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="generated" className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            {generatedTests.map((test) => (
              <Card key={test.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{test.name}</CardTitle>
                      <CardDescription>{test.description}</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{test.type}</Badge>
                      <Badge
                        className={
                          test.complexity === "high"
                            ? "bg-red-100 text-red-800"
                            : test.complexity === "medium"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-green-100 text-green-800"
                        }
                      >
                        {test.complexity}
                      </Badge>
                      <Badge variant="outline">{test.confidence}% confidence</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Coverage:</span>
                      <div className="mt-1">
                        {test.coverage.map((item, index) => (
                          <Badge key={index} variant="outline" className="mr-1 mb-1 text-xs">
                            {item}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Dependencies:</span>
                      <div className="mt-1">
                        {test.dependencies.map((dep, index) => (
                          <Badge key={index} variant="outline" className="mr-1 mb-1 text-xs">
                            {dep}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Tags:</span>
                      <div className="mt-1">
                        {test.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="mr-1 mb-1 text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Generated Test Code:</Label>
                    <div className="bg-muted p-4 rounded-lg">
                      <pre className="text-sm overflow-x-auto">
                        <code>{test.code}</code>
                      </pre>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => downloadTestCode(test)}>
                      <Download className="h-3 w-3 mr-1" />
                      Download
                    </Button>
                    <Button size="sm" variant="outline">
                      <Play className="h-3 w-3 mr-1" />
                      Run Test
                    </Button>
                    <Button size="sm" variant="ghost">
                      <Settings className="h-3 w-3 mr-1" />
                      Customize
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Testing Insights</CardTitle>
                <CardDescription>AI-powered recommendations for your testing strategy</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Alert>
                    <Brain className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Coverage Gap Detected:</strong> Your pricing calculation logic has 73% coverage. Consider
                      adding edge case tests for negative values and boundary conditions.
                    </AlertDescription>
                  </Alert>

                  <Alert>
                    <TrendingUp className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Performance Opportunity:</strong> 15% of your tests take longer than 2 seconds. Mock
                      external dependencies to improve test speed by an estimated 40%.
                    </AlertDescription>
                  </Alert>

                  <Alert>
                    <Zap className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Automation Suggestion:</strong> Your promotion validation tests follow a pattern that
                      could be parameterized, reducing code duplication by 60%.
                    </AlertDescription>
                  </Alert>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quality Trends</CardTitle>
                <CardDescription>Test quality metrics over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart
                    data={[
                      { date: "Mon", quality: 85, coverage: 78 },
                      { date: "Tue", quality: 87, coverage: 81 },
                      { date: "Wed", quality: 89, coverage: 83 },
                      { date: "Thu", quality: 91, coverage: 85 },
                      { date: "Fri", quality: 94, coverage: 87 },
                    ]}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="quality" stroke="#3b82f6" name="Quality Score" />
                    <Line type="monotone" dataKey="coverage" stroke="#10b981" name="Coverage %" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recommended Actions</CardTitle>
              <CardDescription>Priority improvements based on AI analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  {
                    priority: "High",
                    action: "Add integration tests for payment processing workflow",
                    impact: "Reduce production bugs by 35%",
                    effort: "2-3 hours",
                  },
                  {
                    priority: "Medium",
                    action: "Implement visual regression testing for pricing UI",
                    impact: "Catch UI breaking changes automatically",
                    effort: "4-5 hours",
                  },
                  {
                    priority: "Low",
                    action: "Add performance benchmarks to existing tests",
                    impact: "Monitor performance regressions",
                    effort: "1-2 hours",
                  },
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge
                          className={
                            item.priority === "High"
                              ? "bg-red-100 text-red-800"
                              : item.priority === "Medium"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-green-100 text-green-800"
                          }
                        >
                          {item.priority}
                        </Badge>
                        <span className="font-medium text-sm">{item.action}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Impact: {item.impact} • Effort: {item.effort}
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      Generate
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
