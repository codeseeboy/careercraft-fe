import Link from "next/link"
import { ArrowRight, Sparkles, Brain, FileText, BadgeCheck, Briefcase } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">CareerCraft AI</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <Link href="#vision" className="transition-colors hover:text-primary">
              Vision
            </Link>
            <Link href="#features" className="transition-colors hover:text-primary">
              Features
            </Link>
            <Link href="#workflow" className="transition-colors hover:text-primary">
              Workflow
            </Link>
          </nav>
          <div className="flex items-center gap-2">
            <Link href="/auth/sign-in" className="hidden sm:block">
              <Button variant="outline">Sign in</Button>
            </Link>
            <Link href="/auth/sign-up">
              <Button className="gap-2">
                <span className="hidden sm:inline">Create account</span>
                <span className="sm:hidden">Sign up</span> 
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="relative">
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
          </div>

          <div className="container relative">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 py-12 sm:py-24">
              <div className="space-y-6 sm:space-y-8 px-4 sm:px-0">
                <div className="space-y-4 sm:space-y-6">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
                    Build, Match, Learn, and Land Your Next Role with{" "}
                    <span className="bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent">
                      CareerCraft AI
                    </span>
                  </h1>
                  <p className="max-w-[42rem] text-sm leading-normal text-muted-foreground sm:text-xl sm:leading-8">
                    Create ATS‑friendly resumes, match to any JD, bridge skill gaps with guided learning, and track
                    every application—end to end.
                  </p>
                </div>
                <div className="flex flex-wrap gap-4">
                  <Link href="/auth/sign-up" className="w-full sm:w-auto">
                    <Button size="lg" className="gap-2 w-full sm:w-auto">
                      Get Started <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="#features" className="w-full sm:w-auto">
                    <Button size="lg" variant="outline" className="w-full sm:w-auto">
                      Explore Features
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="relative hidden lg:block">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/10 rounded-2xl blur-3xl" />
                <div className="relative bg-card rounded-2xl border p-6 shadow-2xl">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <h3 className="font-semibold">CareerCraft AI Overview</h3>
                        <p className="text-sm text-muted-foreground">Your career hub</p>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <Link href="/auth/sign-up">Join Free</Link>
                      </Button>
                    </div>
                    <div className="aspect-[4/3] rounded-lg bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 flex items-center justify-center">
                      <Brain className="h-24 w-24 text-primary/40" />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      {[{ label: "Resumes" }, { label: "Matches" }, { label: "Jobs" }].map((item) => (
                        <div key={item.label} className="space-y-2">
                          <div className="h-2 rounded-full bg-primary/20" />
                          <div className="h-2 w-2/3 rounded-full bg-muted" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="vision" className="py-10 sm:py-16">
          <div className="container space-y-4 px-4 sm:px-8">
            <h2 className="text-2xl font-bold tracking-tighter sm:text-4xl">Project Vision</h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-3xl">
              CareerCraft AI supports a continuous cycle: resume creation, JD matching, improvement and learning,
              verification, and proactive job discovery—with everything centrally tracked.
            </p>
          </div>
        </section>

        <section id="features" className="bg-muted/50 py-12 sm:py-16">
          <div className="container space-y-8 sm:space-y-10 px-4 sm:px-8">
            <h2 className="text-2xl font-bold tracking-tighter text-center sm:text-4xl">Core Features</h2>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-4 sm:gap-6 md:grid-cols-3">
              <Card className="h-full">
                <CardContent className="p-4 sm:p-6 space-y-2 flex flex-col h-full">
                  <FileText className="h-10 w-10 sm:h-12 sm:w-12 text-primary" />
                  <h3 className="text-lg sm:text-xl font-bold">AI Resume Builder</h3>
                  <p className="text-sm text-muted-foreground">
                    Templates, live preview, and real-time score with feedback.
                  </p>
                </CardContent>
              </Card>
              <Card className="h-full">
                <CardContent className="p-4 sm:p-6 space-y-2 flex flex-col h-full">
                  <BadgeCheck className="h-10 w-10 sm:h-12 sm:w-12 text-primary" />
                  <h3 className="text-lg sm:text-xl font-bold">JD Matcher & Learning</h3>
                  <p className="text-sm text-muted-foreground">
                    Match to JD, then upskill with roadmaps and assessments.
                  </p>
                </CardContent>
              </Card>
              <Card className="h-full">
                <CardContent className="p-4 sm:p-6 space-y-2 flex flex-col h-full">
                  <Briefcase className="h-10 w-10 sm:h-12 sm:w-12 text-primary" />
                  <h3 className="text-lg sm:text-xl font-bold">Proactive Job Search</h3>
                  <p className="text-sm text-muted-foreground">
                    Find best matches, apply, and track application status.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section id="workflow" className="py-10 sm:py-16">
          <div className="container space-y-4 sm:space-y-6 px-4 sm:px-8">
            <h2 className="text-2xl font-bold tracking-tighter sm:text-4xl">Core User Workflow</h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-4xl overflow-x-auto pb-2">
              Creation → Storage → Analysis → Improvement → Verification → Enhancement → Discovery → Application &
              Tracking
            </p>
            <div className="pt-2">
              <Link href="/auth/sign-up" className="w-full sm:w-auto inline-block">
                <Button size="lg" className="gap-2 w-full sm:w-auto">
                  Start Free <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-6 sm:py-8">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row px-4 sm:px-8">
          <p className="text-xs sm:text-sm text-muted-foreground text-center md:text-left">
            © {new Date().getFullYear()} CareerCraft AI. All rights reserved.
          </p>
          <div className="flex items-center space-x-4">
            <Link href="#" className="text-xs sm:text-sm text-muted-foreground hover:text-primary">
              Terms
            </Link>
            <Link href="#" className="text-xs sm:text-sm text-muted-foreground hover:text-primary">
              Privacy
            </Link>
            <Link href="#" className="text-xs sm:text-sm text-muted-foreground hover:text-primary">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
