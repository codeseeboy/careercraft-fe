"use client"

import type { ResumeData } from "./resume-builder"

interface ResumePreviewProps {
  data: ResumeData
}

export function ResumePreview({ data }: ResumePreviewProps) {
  const formatDate = (dateString: string) => {
    if (!dateString) return ""
    const date = new Date(dateString + "-01")
    return date.toLocaleDateString("en-US", { month: "short", year: "numeric" })
  }

  const formatDateRange = (startDate: string, endDate: string, current: boolean) => {
    const start = formatDate(startDate)
    const end = current ? "Present" : formatDate(endDate)
    return `${start} – ${end}`
  }

  return (
    <div
      id="resume-preview"
      className="max-w-4xl mx-auto bg-white text-black font-serif leading-relaxed"
      style={{
        fontFamily: '"Times New Roman", Times, serif',
        fontSize: "11pt",
        lineHeight: "1.15",
        color: "#000000",
        backgroundColor: "#ffffff",
      }}
    >
      {/* Header */}
      <div className="text-center border-b-2 border-black pb-3 mb-4">
        <h1 className="text-2xl font-bold mb-2" style={{ fontSize: "18pt", fontWeight: "bold", margin: "0 0 8pt 0" }}>
          {data.personalInfo.fullName || "Your Name"}
        </h1>
        <div className="text-sm" style={{ fontSize: "10pt", lineHeight: "1.2" }}>
          <div>
            {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
            {data.personalInfo.email && data.personalInfo.phone && " | "}
            {data.personalInfo.phone && <span>{data.personalInfo.phone}</span>}
          </div>
          <div>
            {data.personalInfo.location && <span>{data.personalInfo.location}</span>}
            {data.personalInfo.location &&
              (data.personalInfo.linkedin || data.personalInfo.github || data.personalInfo.website) &&
              " | "}
            {data.personalInfo.linkedin && <span>{data.personalInfo.linkedin}</span>}
            {data.personalInfo.linkedin && (data.personalInfo.github || data.personalInfo.website) && " | "}
            {data.personalInfo.github && <span>{data.personalInfo.github}</span>}
            {data.personalInfo.github && data.personalInfo.website && " | "}
            {data.personalInfo.website && <span>{data.personalInfo.website}</span>}
          </div>
        </div>
      </div>

      {/* Professional Summary */}
      {data.summary && (
        <div className="mb-4">
          <h2
            className="text-sm font-bold border-b border-black mb-2"
            style={{ fontSize: "12pt", fontWeight: "bold", borderBottom: "1px solid #000", marginBottom: "6pt" }}
          >
            PROFESSIONAL SUMMARY
          </h2>
          <p className="text-sm" style={{ fontSize: "11pt", lineHeight: "1.3", textAlign: "justify" }}>
            {data.summary}
          </p>
        </div>
      )}

      {/* Work Experience */}
      {data.experience.length > 0 && (
        <div className="mb-4">
          <h2
            className="text-sm font-bold border-b border-black mb-2"
            style={{ fontSize: "12pt", fontWeight: "bold", borderBottom: "1px solid #000", marginBottom: "6pt" }}
          >
            WORK EXPERIENCE
          </h2>
          {data.experience.map((exp) => (
            <div key={exp.id} className="mb-3">
              <div className="flex justify-between items-start mb-1">
                <div>
                  <h3 className="font-bold text-sm" style={{ fontSize: "11pt", fontWeight: "bold", margin: "0" }}>
                    {exp.position}
                  </h3>
                  <p className="text-sm" style={{ fontSize: "11pt", margin: "0", fontStyle: "italic" }}>
                    {exp.company}
                    {exp.location && `, ${exp.location}`}
                  </p>
                </div>
                <div className="text-sm text-right" style={{ fontSize: "11pt" }}>
                  {formatDateRange(exp.startDate, exp.endDate, exp.current)}
                </div>
              </div>
              {exp.description && (
                <div className="text-sm ml-0" style={{ fontSize: "11pt", lineHeight: "1.3" }}>
                  {exp.description.split("\n").map((line, index) => (
                    <div key={index} className="mb-1">
                      {line.trim()}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {data.education.length > 0 && (
        <div className="mb-4">
          <h2
            className="text-sm font-bold border-b border-black mb-2"
            style={{ fontSize: "12pt", fontWeight: "bold", borderBottom: "1px solid #000", marginBottom: "6pt" }}
          >
            EDUCATION
          </h2>
          {data.education.map((edu) => (
            <div key={edu.id} className="mb-2">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-sm" style={{ fontSize: "11pt", fontWeight: "bold", margin: "0" }}>
                    {edu.degree}
                    {edu.field && ` in ${edu.field}`}
                  </h3>
                  <p className="text-sm" style={{ fontSize: "11pt", margin: "0", fontStyle: "italic" }}>
                    {edu.institution}
                    {edu.location && `, ${edu.location}`}
                  </p>
                  {edu.gpa && (
                    <p className="text-sm" style={{ fontSize: "11pt", margin: "0" }}>
                      GPA: {edu.gpa}
                    </p>
                  )}
                </div>
                <div className="text-sm" style={{ fontSize: "11pt" }}>
                  {formatDate(edu.graduationDate)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {(data.skills.technical.length > 0 ||
        data.skills.soft.length > 0 ||
        data.skills.languages.length > 0 ||
        data.skills.certifications.length > 0) && (
        <div className="mb-4">
          <h2
            className="text-sm font-bold border-b border-black mb-2"
            style={{ fontSize: "12pt", fontWeight: "bold", borderBottom: "1px solid #000", marginBottom: "6pt" }}
          >
            SKILLS
          </h2>
          <div className="space-y-1">
            {data.skills.technical.length > 0 && (
              <div>
                <span className="font-bold text-sm" style={{ fontSize: "11pt", fontWeight: "bold" }}>
                  Technical:
                </span>
                <span className="text-sm ml-1" style={{ fontSize: "11pt" }}>
                  {data.skills.technical.join(", ")}
                </span>
              </div>
            )}
            {data.skills.soft.length > 0 && (
              <div>
                <span className="font-bold text-sm" style={{ fontSize: "11pt", fontWeight: "bold" }}>
                  Soft Skills:
                </span>
                <span className="text-sm ml-1" style={{ fontSize: "11pt" }}>
                  {data.skills.soft.join(", ")}
                </span>
              </div>
            )}
            {data.skills.languages.length > 0 && (
              <div>
                <span className="font-bold text-sm" style={{ fontSize: "11pt", fontWeight: "bold" }}>
                  Languages:
                </span>
                <span className="text-sm ml-1" style={{ fontSize: "11pt" }}>
                  {data.skills.languages.join(", ")}
                </span>
              </div>
            )}
            {data.skills.certifications.length > 0 && (
              <div>
                <span className="font-bold text-sm" style={{ fontSize: "11pt", fontWeight: "bold" }}>
                  Certifications:
                </span>
                <span className="text-sm ml-1" style={{ fontSize: "11pt" }}>
                  {data.skills.certifications.join(", ")}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Projects */}
      {data.projects.length > 0 && (
        <div className="mb-4">
          <h2
            className="text-sm font-bold border-b border-black mb-2"
            style={{ fontSize: "12pt", fontWeight: "bold", borderBottom: "1px solid #000", marginBottom: "6pt" }}
          >
            PROJECTS
          </h2>
          {data.projects.map((project) => (
            <div key={project.id} className="mb-3">
              <div className="flex justify-between items-start mb-1">
                <div>
                  <h3 className="font-bold text-sm" style={{ fontSize: "11pt", fontWeight: "bold", margin: "0" }}>
                    {project.name}
                  </h3>
                  {project.technologies.length > 0 && (
                    <p className="text-sm" style={{ fontSize: "11pt", margin: "0", fontStyle: "italic" }}>
                      Technologies: {project.technologies.join(", ")}
                    </p>
                  )}
                </div>
                <div className="text-sm" style={{ fontSize: "11pt" }}>
                  {formatDateRange(project.startDate, project.endDate, false)}
                </div>
              </div>
              {project.description && (
                <p className="text-sm" style={{ fontSize: "11pt", lineHeight: "1.3", textAlign: "justify" }}>
                  {project.description}
                </p>
              )}
              {project.url && (
                <p className="text-sm" style={{ fontSize: "11pt", margin: "2pt 0 0 0" }}>
                  URL: {project.url}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
