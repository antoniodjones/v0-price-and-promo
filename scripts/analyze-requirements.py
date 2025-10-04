import requests
import csv
import json
from io import StringIO
from datetime import datetime

# Fetch the CSV file
csv_url = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Price%20and%20Promo%20Requirments%20v6%20-%20Price%20-GbfHeuW4RNqc8EdEfdINMIF58GQvOQ.csv"

print("[v0] Fetching requirements CSV...")
response = requests.get(csv_url)
response.raise_for_status()

# Parse CSV
csv_content = StringIO(response.text)
csv_reader = csv.DictReader(csv_content)

requirements = []
for row in csv_reader:
    requirements.append(row)

print(f"[v0] Found {len(requirements)} requirements")
print("\n" + "="*80)
print("COMPREHENSIVE POST-BUILD DETAIL REVIEW")
print("GTI Pricing & Promotions Engine")
print(f"Analysis Date: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
print("="*80 + "\n")

# Organize requirements by type
pricing_requirements = []
promo_requirements = []

for req in requirements:
    req_type = req.get('Type', '').strip()
    if req_type in ['Base Price', 'Customer Discounts', 'Volume Discounts', 'Tiered Pricing']:
        pricing_requirements.append(req)
    else:
        promo_requirements.append(req)

print("\n📊 REQUIREMENTS SUMMARY")
print("-" * 80)
print(f"Total Requirements: {len(requirements)}")
print(f"Pricing Requirements: {len(pricing_requirements)}")
print(f"Promotion Requirements: {len(promo_requirements)}")

print("\n\n🎯 PRICING REQUIREMENTS BREAKDOWN")
print("=" * 80)

for idx, req in enumerate(pricing_requirements, 1):
    print(f"\n{idx}. {req.get('Type', 'N/A')}")
    print(f"   Ref #: {req.get('Ref #', 'N/A')}")
    print(f"   MVP Priority: {req.get('MVP Priority', 'N/A')}")
    print(f"   Description: {req.get('Description', 'N/A')[:100]}...")
    
    details = req.get('Details', '')
    if details:
        print(f"   Key Details:")
        for line in details.split('\n')[:3]:
            if line.strip():
                print(f"      • {line.strip()[:80]}")

print("\n\n🎁 PROMOTION REQUIREMENTS BREAKDOWN")
print("=" * 80)

for idx, req in enumerate(promo_requirements, 1):
    print(f"\n{idx}. {req.get('Type', 'N/A')}")
    print(f"   Ref #: {req.get('Ref #', 'N/A')}")
    print(f"   MVP Priority: {req.get('MVP Priority', 'N/A')}")
    print(f"   Description: {req.get('Description', 'N/A')[:100]}...")
    
    details = req.get('Details', '')
    if details:
        print(f"   Key Details:")
        for line in details.split('\n')[:3]:
            if line.strip():
                print(f"      • {line.strip()[:80]}")

# Priority Analysis
print("\n\n⭐ MVP PRIORITY ANALYSIS")
print("=" * 80)

priority_map = {}
for req in requirements:
    priority = req.get('MVP Priority', 'Not Specified').strip()
    if priority not in priority_map:
        priority_map[priority] = []
    priority_map[priority].append(req.get('Type', 'Unknown'))

for priority in sorted(priority_map.keys()):
    print(f"\n{priority}:")
    for req_type in priority_map[priority]:
        print(f"   • {req_type}")

# UI Complexity Analysis
print("\n\n🎨 UI COMPLEXITY ANALYSIS")
print("=" * 80)

for req in requirements:
    ui_notes = req.get('Comments/Notes', '')
    if 'complex UI' in ui_notes.lower() or 'UI' in ui_notes:
        print(f"\n{req.get('Type', 'N/A')}:")
        print(f"   {ui_notes[:150]}...")

print("\n\n✅ ANALYSIS COMPLETE")
print("="*80)
