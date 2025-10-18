"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { ResumeData } from "../resume-editor"

interface PersonalInfoStepProps {
  data: ResumeData
  onChange: (data: ResumeData) => void
}

export function PersonalInfoStep({ data, onChange }: PersonalInfoStepProps) {
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
    <Card>
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name *</Label>
            <Input
              id="fullName"
              value={data.personalInfo.fullName}
              onChange={(e) => updatePersonalInfo("fullName", e.target.value)}
              placeholder="John Doe"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="jobTitle">Job Title *</Label>
            <Input
              id="jobTitle"
              value={data.personalInfo.jobTitle}
              onChange={(e) => updatePersonalInfo("jobTitle", e.target.value)}
              placeholder="Software Engineer"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={data.personalInfo.email}
              onChange={(e) => updatePersonalInfo("email", e.target.value)}
              placeholder="john@example.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone *</Label>
            <Input
              id="phone"
              value={data.personalInfo.phone}
              onChange={(e) => updatePersonalInfo("phone", e.target.value)}
              placeholder="+1 (555) 123-4567"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            value={data.personalInfo.location}
            onChange={(e) => updatePersonalInfo("location", e.target.value)}
            placeholder="New York, NY"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="linkedin">LinkedIn</Label>
            <Input
              id="linkedin"
              value={data.personalInfo.linkedin}
              onChange={(e) => updatePersonalInfo("linkedin", e.target.value)}
              placeholder="linkedin.com/in/johndoe"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="github">GitHub</Label>
            <Input
              id="github"
              value={data.personalInfo.github}
              onChange={(e) => updatePersonalInfo("github", e.target.value)}
              placeholder="github.com/johndoe"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              value={data.personalInfo.website}
              onChange={(e) => updatePersonalInfo("website", e.target.value)}
              placeholder="johndoe.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="twitter">Twitter</Label>
            <Input
              id="twitter"
              value={data.personalInfo.twitter}
              onChange={(e) => updatePersonalInfo("twitter", e.target.value)}
              placeholder="@johndoe"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
