// Custom report generation API

import { type NextRequest, NextResponse } from "next/server"
import { createApiResponse, handleApiError, validateRequiredFields } from "@/lib/api/utils"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const validationError = validateRequiredFields(body, ["reportType", "dateRange"])
    if (validationError) {
      return NextResponse.json(createApiResponse(null, validationError, false), { status: 400 })
    }

    const validReportTypes = ["discount_performance", "customer_insights", "rebate_summary", "market_analysis"]
    if (!validReportTypes.includes(body.reportType)) {
      return NextResponse.json(
        createApiResponse(null, `Report type must be one of: ${validReportTypes.join(", ")}`, false),
        { status: 400 },
      )
    }

    // Generate mock report based on type
    let reportData = {}

    switch (body.reportType) {
      case "discount_performance":
        reportData = {
          title: "Discount Performance Report",
          period: body.dateRange,
          summary: {
            totalDiscounts: 23,
            totalSavings: 125430.5,
            averageDiscountRate: 12.5,
            topPerformingDiscount: "Tier A Volume Discount",
          },
          details: [
            { name: "Tier A Volume Discount", usage: 1245, savings: 45600.0, roi: 3.2 },
            { name: "Expiring Inventory Auto-Discount", usage: 892, savings: 28900.0, roi: 2.8 },
          ],
          recommendations: [
            "Increase Tier A discount rate to improve customer retention",
            "Expand inventory discount automation to more categories",
          ],
        }
        break

      case "customer_insights":
        reportData = {
          title: "Customer Insights Report",
          period: body.dateRange,
          summary: {
            totalCustomers: 1247,
            tierACustomers: 234,
            tierBCustomers: 456,
            tierCCustomers: 557,
            averageLoyaltyScore: 82.5,
          },
          segmentAnalysis: [
            { tier: "A", avgSpend: 536.75, avgDiscount: 15.2, loyaltyScore: 92 },
            { tier: "B", avgSpend: 415.35, avgDiscount: 12.8, loyaltyScore: 85 },
            { tier: "C", avgSpend: 301.25, avgDiscount: 8.5, loyaltyScore: 71 },
          ],
          riskAnalysis: {
            highRiskCustomers: 45,
            churnPrediction: 3.2,
            retentionOpportunities: 128,
          },
        }
        break

      case "rebate_summary":
        reportData = {
          title: "Vendor Rebate Summary",
          period: body.dateRange,
          summary: {
            totalVendors: 12,
            totalRebates: 15678.45,
            pendingApprovals: 8,
            approvedRebates: 4,
          },
          vendorBreakdown: [
            { vendor: "Rythm", rebate: 2826.0, status: "pending" },
            { vendor: "Dogwalkers", rebate: 1287.36, status: "approved" },
          ],
        }
        break

      case "market_analysis":
        reportData = {
          title: "Market Performance Analysis",
          period: body.dateRange,
          summary: {
            totalMarkets: 8,
            topPerformingMarket: "Illinois",
            totalRevenue: 2456789.0,
            totalDiscounts: 245678.9,
          },
          marketBreakdown: [
            { market: "Illinois", revenue: 856789.0, discounts: 85678.9, customers: 456 },
            { market: "Pennsylvania", revenue: 645123.0, discounts: 64512.3, customers: 334 },
          ],
        }
        break
    }

    const report = {
      id: Date.now().toString(),
      ...reportData,
      generatedAt: new Date().toISOString(),
      generatedBy: "system",
      format: body.format || "json",
      filters: body.filters || {},
    }

    return NextResponse.json(createApiResponse(report, "Report generated successfully"), { status: 201 })
  } catch (error) {
    return handleApiError(error)
  }
}

export async function GET(request: NextRequest) {
  try {
    // Mock list of available reports
    const availableReports = [
      {
        id: "1",
        name: "Weekly Discount Performance",
        type: "discount_performance",
        schedule: "weekly",
        lastGenerated: "2024-01-20T09:00:00Z",
        status: "active",
      },
      {
        id: "2",
        name: "Monthly Customer Insights",
        type: "customer_insights",
        schedule: "monthly",
        lastGenerated: "2024-01-01T00:00:00Z",
        status: "active",
      },
      {
        id: "3",
        name: "Quarterly Rebate Summary",
        type: "rebate_summary",
        schedule: "quarterly",
        lastGenerated: "2024-01-01T00:00:00Z",
        status: "active",
      },
    ]

    return NextResponse.json(createApiResponse(availableReports, "Available reports retrieved successfully"))
  } catch (error) {
    return handleApiError(error)
  }
}
