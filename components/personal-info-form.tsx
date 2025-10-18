"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { ResumeData } from "../resume-builder"

interface PersonalInfoFormProps {
  data: ResumeData
  onChange: (data: ResumeData) => void
}

export function PersonalInfoForm({ data, onChange }: PersonalInfoFormProps) {
  const updatePersonalInfo = (field: keyof ResumeData["personalInfo"], value: string) => {
    onChange({
      ...data,
      personalInfo: {
        ...data.personalInfo,
        [field]: value,
      },
    })
  }

  return (
    <div className="space-y-6">
      <Card className="border border-gray-200">
        <CardHeader className="bg-gray-50">
          <CardTitle className="text-lg text-gray-900">Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-gray-700 font-medium">
                Full Name *
              </Label>
              <Input
                id="fullName"
                value={data.personalInfo.fullName}
                onChange={(e) => updatePersonalInfo("fullName", e.target.value)}
                placeholder="Michael Harris"
                className="w-full border-gray-300"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700 font-medium">
                Email Address *
              </Label>
              <Input
                id="email"
                type="email"
                value={data.personalInfo.email}
                onChange={(e) => updatePersonalInfo("email", e.target.value)}
                placeholder="michael.harris@email.com"
                className="w-full border-gray-300"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-gray-700 font-medium">
                Phone Number *
              </Label>
              <Input
                id="phone"
                value={data.personalInfo.phone}
                onChange={(e) => updatePersonalInfo("phone", e.target.value)}
                placeholder="+61 412 345 678"
                className="w-full border-gray-300"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location" className="text-gray-700 font-medium">
                Location *
              </Label>
              <Input
                id="location"
                value={data.personalInfo.location}
                onChange={(e) => updatePersonalInfo("location", e.target.value)}
                placeholder="Sydney, Australia"
                className="w-full border-gray-300"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="linkedin" className="text-gray-700 font-medium">
                LinkedIn Profile
              </Label>
              <Input
                id="linkedin"
                value={data.personalInfo.linkedin || ""}
                onChange={(e) => updatePersonalInfo("linkedin", e.target.value)}
                placeholder="linkedin.com/in/michaelharris"
                className="w-full border-gray-300"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="github" className="text-gray-700 font-medium">
                GitHub Profile
              </Label>
              <Input
                id="github"
                value={data.personalInfo.github || ""}
                onChange={(e) => updatePersonalInfo("github", e.target.value)}
                placeholder="github.com/michaelharris"
                className="w-full border-gray-300"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="website" className="text-gray-700 font-medium">
              Personal Website
            </Label>
            <Input
              id="website"
              value={data.personalInfo.website || ""}
              onChange={(e) => updatePersonalInfo("website", e.target.value)}
              placeholder="michaelharris.com"
              className="w-full border-gray-300"
            />
          </div>
        </CardContent>
      </Card>

      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h4 className="font-medium text-blue-900 mb-2">ATS Tip</h4>
        <p className="text-sm text-blue-800">
          Use a professional email address and include your location (city, country) as many employers filter by
          location. LinkedIn profiles increase your chances of being contacted by 71%.
        </p>
      </div>
    </div>
  )
}
