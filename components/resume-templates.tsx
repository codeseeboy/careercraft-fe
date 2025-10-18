"use client"

export type ResumeData = {
  name?: string
  role?: string
  summary?: string
  experience?: string
  education?: string
  skills?: string
  contact?: {
    email?: string
    phone?: string
    location?: string
    links?: { label: string; url: string }[]
  }
}

export type TemplateKey = "simple-ats" | "modern-ats" | "twocol-ats"

export function ResumeTemplateRenderer({ template, data }: { template: TemplateKey; data: ResumeData }) {
  if (template === "modern-ats") return <ModernATS data={data} />
  if (template === "twocol-ats") return <TwoColATS data={data} />
  return <SimpleATS data={data} />
}

// Simple, clean ATS-friendly single-column
function SimpleATS({ data }: { data: ResumeData }) {
  return (
    <div className="mx-auto max-w-3xl bg-white text-black p-8 leading-relaxed print:p-0">
      <header className="border-b pb-2">
        <h1 className="text-3xl font-bold">{data.name || "Your Name"}</h1>
        <div className="text-sm text-neutral-700">{data.role || "Target Role"}</div>
        <div className="mt-1 text-xs text-neutral-600">
          {[data.contact?.email, data.contact?.phone, data.contact?.location].filter(Boolean).join(" | ")}
        </div>
        {data.contact?.links?.length ? (
          <div className="mt-1 text-xs text-neutral-600">
            {data.contact.links.map((l, i) => (
              <span key={i}>
                {l.label}
                {i < (data.contact?.links?.length || 0) - 1 ? " · " : ""}
              </span>
            ))}
          </div>
        ) : null}
      </header>

      <section className="mt-4">
        <h2 className="font-semibold uppercase text-sm tracking-wide">Summary</h2>
        <p className="text-sm whitespace-pre-wrap">{data.summary || "A concise, impact-focused summary."}</p>
      </section>

      <section className="mt-4">
        <h2 className="font-semibold uppercase text-sm tracking-wide">Experience</h2>
        <p className="text-sm whitespace-pre-wrap">{data.experience || "Recent roles with quantified impact."}</p>
      </section>

      <section className="mt-4">
        <h2 className="font-semibold uppercase text-sm tracking-wide">Education</h2>
        <p className="text-sm whitespace-pre-wrap">{data.education || "Degree, institution, GPA."}</p>
      </section>

      <section className="mt-4">
        <h2 className="font-semibold uppercase text-sm tracking-wide">Skills</h2>
        <p className="text-sm">{data.skills || "List of key skills"}</p>
      </section>
    </div>
  )
}

// Modern ATS with subtle headings
function ModernATS({ data }: { data: ResumeData }) {
  return (
    <div className="mx-auto max-w-3xl bg-white text-black p-8 leading-relaxed print:p-0">
      <header className="pb-3">
        <h1 className="text-3xl font-extrabold tracking-tight">{data.name || "Your Name"}</h1>
        <div className="text-sm text-neutral-700">{data.role || "Target Role"}</div>
        <div className="mt-1 flex flex-wrap gap-2 text-xs text-neutral-600">
          {data.contact?.email && <span>{data.contact.email}</span>}
          {data.contact?.phone && <span>• {data.contact.phone}</span>}
          {data.contact?.location && <span>• {data.contact.location}</span>}
          {data.contact?.links?.map((l, i) => (
            <span key={i}>• {l.label}</span>
          ))}
        </div>
      </header>
      <div className="h-px bg-neutral-300" />
      <section className="mt-4">
        <h2 className="text-sm font-semibold">Professional Summary</h2>
        <p className="text-sm whitespace-pre-wrap">{data.summary || "Impact summary."}</p>
      </section>
      <section className="mt-4">
        <h2 className="text-sm font-semibold">Experience</h2>
        <p className="text-sm whitespace-pre-wrap">{data.experience || "Roles & achievements."}</p>
      </section>
      <section className="mt-4">
        <h2 className="text-sm font-semibold">Education</h2>
        <p className="text-sm whitespace-pre-wrap">{data.education || "Education details."}</p>
      </section>
      <section className="mt-4">
        <h2 className="text-sm font-semibold">Skills</h2>
        <p className="text-sm">{data.skills || "Skills list"}</p>
      </section>
    </div>
  )
}

// Two-column ATS with clear left sidebar (still text-based, no tables/images)
function TwoColATS({ data }: { data: ResumeData }) {
  return (
    <div className="mx-auto max-w-4xl bg-white text-black p-8 leading-relaxed print:p-0">
      <header className="pb-3">
        <h1 className="text-3xl font-extrabold tracking-tight">{data.name || "Your Name"}</h1>
        <div className="text-sm text-neutral-700">{data.role || "Target Role"}</div>
      </header>
      <div className="grid grid-cols-3 gap-6">
        <aside className="col-span-1">
          <h3 className="text-sm font-semibold">Contact</h3>
          <p className="text-xs text-neutral-700 mt-1">
            {[data.contact?.email, data.contact?.phone, data.contact?.location].filter(Boolean).join("\n")}
          </p>
          {data.contact?.links?.length ? (
            <>
              <h3 className="text-sm font-semibold mt-3">Links</h3>
              <ul className="text-xs text-neutral-700 list-disc ml-4">
                {data.contact.links.map((l, i) => (
                  <li key={i}>{l.label}</li>
                ))}
              </ul>
            </>
          ) : null}

          <h3 className="text-sm font-semibold mt-4">Skills</h3>
          <p className="text-xs">{data.skills || "Skills list"}</p>
        </aside>
        <main className="col-span-2">
          <section>
            <h2 className="text-sm font-semibold uppercase tracking-wide">Summary</h2>
            <p className="text-sm whitespace-pre-wrap">{data.summary || "Summary goes here."}</p>
          </section>
          <section className="mt-4">
            <h2 className="text-sm font-semibold uppercase tracking-wide">Experience</h2>
            <p className="text-sm whitespace-pre-wrap">{data.experience || "Experience details..."}</p>
          </section>
          <section className="mt-4">
            <h2 className="text-sm font-semibold uppercase tracking-wide">Education</h2>
            <p className="text-sm whitespace-pre-wrap">{data.education || "Education..."}</p>
          </section>
        </main>
      </div>
    </div>
  )
}
