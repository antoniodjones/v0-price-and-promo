"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CustomArrow } from "@/components/ui/custom-arrow"
import { ChevronLeft } from "lucide-react"

const BundleWizard = () => {
  const [currentStep, setCurrentStep] = useState(0)
  const steps = ["Step 1", "Step 2", "Step 3"]

  const nextStep = () => {
    setCurrentStep(currentStep + 1)
  }

  const prevStep = () => {
    setCurrentStep(currentStep - 1)
  }

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>{steps[currentStep]}</CardTitle>
          <CardDescription>
            Step {currentStep + 1} of {steps.length}
          </CardDescription>
        </CardHeader>
        <CardContent>{/* Content for each step goes here */}</CardContent>
      </Card>
      <div className="flex justify-between mt-4">
        {currentStep > 0 && (
          <Button onClick={prevStep} className="bg-gti-bright-green hover:bg-gti-medium-green text-white">
            Previous
            <ChevronLeft className="ml-2 h-4 w-4" />
          </Button>
        )}
        {currentStep < steps.length - 1 ? (
          <Button onClick={nextStep} className="bg-gti-bright-green hover:bg-gti-medium-green text-white">
            Next
            <CustomArrow className="ml-2 h-4 w-4" color="#ffffff" />
          </Button>
        ) : (
          <Button className="bg-gti-bright-green hover:bg-gti-medium-green text-white">Finish</Button>
        )}
      </div>
    </div>
  )
}

export default BundleWizard
