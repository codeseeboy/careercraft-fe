"use client"

import { LayoutDashboard, FileText, SearchCheck, GraduationCap, Briefcase, CheckCircle, User2 } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import Link from "next/link"

const items = [
  { title: "Overview", url: "/dashboard", icon: LayoutDashboard },
  { title: "Profile", url: "/dashboard/profile", icon: User2 },
  { title: "Resume Builder", url: "/dashboard/resume-builder", icon: FileText },
  { title: "JD Matcher", url: "/dashboard/jd-matcher", icon: SearchCheck },
  { title: "Learning Hub", url: "/dashboard/learning", icon: GraduationCap },
  { title: "Jobs", url: "/dashboard/jobs", icon: Briefcase },
  { title: "Assessments", url: "/dashboard/assessments", icon: CheckCircle },
]

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="px-2 py-1.5 text-sm font-medium text-sidebar-foreground/70">CareerCraft AI</div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
