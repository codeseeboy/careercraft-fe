"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { loadProfile, saveProfile } from "@/lib/store"

export default function ProfilePage() {
  const [profile, setProfile] = useState({
    name: "",
    title: "",
    education: "",
    college: "",
    cgpa: "",
    achievements: "",
    skills: "",
  })

  useEffect(() => {
    const p = loadProfile()
    if (p) setProfile({ ...profile, ...p })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function onSave() {
    saveProfile(profile)
    alert("Profile saved.")
  }

  return (
    <main className="container py-6">
      <Card>
        <CardHeader>
          <CardTitle>My Profile</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="grid gap-2">
            <Label>Name</Label>
            <Input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
          </div>
          <div className="grid gap-2">
            <Label>Title</Label>
            <Input value={profile.title} onChange={(e) => setProfile({ ...profile, title: e.target.value })} />
          </div>
          <div className="grid gap-2">
            <Label>College</Label>
            <Input value={profile.college} onChange={(e) => setProfile({ ...profile, college: e.target.value })} />
          </div>
          <div className="grid gap-2">
            <Label>CGPA</Label>
            <Input value={profile.cgpa} onChange={(e) => setProfile({ ...profile, cgpa: e.target.value })} />
          </div>
          <div className="grid gap-2 md:col-span-2">
            <Label>Education</Label>
            <Textarea
              rows={3}
              value={profile.education}
              onChange={(e) => setProfile({ ...profile, education: e.target.value })}
            />
          </div>
          <div className="grid gap-2 md:col-span-2">
            <Label>Achievements</Label>
            <Textarea
              rows={3}
              value={profile.achievements}
              onChange={(e) => setProfile({ ...profile, achievements: e.target.value })}
            />
          </div>
          <div className="grid gap-2 md:col-span-2">
            <Label>Skills (comma separated)</Label>
            <Input value={profile.skills} onChange={(e) => setProfile({ ...profile, skills: e.target.value })} />
          </div>
          <div className="md:col-span-2">
            <Button onClick={onSave}>Save Profile</Button>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
