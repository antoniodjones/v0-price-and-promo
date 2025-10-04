import { BulkTierAssignment } from "@/components/tier-management/bulk-tier-assignment"

export default function BulkTierUploadPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Bulk Tier Assignment</h1>
        <p className="text-muted-foreground mt-1">Upload a CSV file to assign multiple customers to tiers</p>
      </div>
      <BulkTierAssignment />
    </div>
  )
}
