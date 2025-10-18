"use client"

import type { ResumeData } from "../resume-editor"

export function MinimalATSTemplate({ data }: { data: ResumeData }) {
  return (
    <div className="w-[210mm] h-[297mm] mx-auto bg-white shadow-lg print:shadow-none print:w-full print:h-full p-12 relative overflow-hidden">
      {/* Header */}
      <header className="border-b-2 border-gray-900 pb-6 mb-8">
        <h1 className="text-5xl font-bold text-gray-900 mb-2 tracking-tight">
          {data.personalInfo.fullName || "Your Full Name"}
        </h1>
        <h2 className="text-xl text-gray-700 mb-4">{data.personalInfo.jobTitle || "Professional Title"}</h2>

        <div className="flex flex-wrap gap-6 text-sm text-gray-600">
          {data.personalInfo.email && (
            <div className="flex items-center gap-2">
              <span>Email:</span>
              <span className="font-medium">{data.personalInfo.email}</span>
            </div>
          )}
          {data.personalInfo.phone && (
            <div className="flex items-center gap-2">
              <span>Phone:</span>
              <span className="font-medium">{data.personalInfo.phone}</span>
            </div>
          )}
          {data.personalInfo.location && (
            <div className="flex items-center gap-2">
              <span>Location:</span>
              <span className="font-medium">{data.personalInfo.location}</span>
            </div>
          )}
        </div>

        {(data.personalInfo.linkedin || data.personalInfo.github || data.personalInfo.website) && (
          <div className="flex flex-wrap gap-6 text-sm text-gray-600 mt-2">
            {data.personalInfo.linkedin && (
              <div className="flex items-center gap-2">
                <span>LinkedIn:</span>
                <span className="font-medium">{data.personalInfo.linkedin}</span>
              </div>
            )}
            {data.personalInfo.github && (
              <div className="flex items-center gap-2">
                <span>GitHub:</span>
                <span className="font-medium">{data.personalInfo.github}</span>
              </div>
            )}
            {data.personalInfo.website && (
              <div className="flex items-center gap-2">
                <span>Website:</span>
                <span className="font-medium">{data.personalInfo.website}</span>
              </div>
            )}
          </div>
        )}
      </header>

      {/* Summary */}
      {data.summary && (
        <section className="mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-wide">Professional Summary</h3>
          <div className="text-gray-700 leading-relaxed text-justify">
            <div dangerouslySetInnerHTML={{ __html: data.summary }} />
          </div>
        </section>
      )}

      {/* Experience */}
      {data.experience.length > 0 && (
        <section className="mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6 uppercase tracking-wide">Professional Experience</h3>
          <div className="space-y-6">
            {data.experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline mb-2">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">{exp.position}</h4>
                    <p className="text-lg text-gray-700">{exp.company}</p>
                  </div>
                  <div className="text-sm text-gray-600 text-right">
                    <p>
                      {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                    </p>
                  </div>
                </div>

                <div className="text-gray-700 leading-relaxed ml-0 prose prose-sm max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: exp.description }} />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education & Skills Grid */}
      <div className="grid grid-cols-2 gap-8 mb-8">
        {/* Education */}
        {data.education.length > 0 && (
          <section>
            <h3 className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-wide">Education</h3>
            <div className="space-y-4">
              {data.education.map((edu) => (
                <div key={edu.id}>
                  <h4 className="font-semibold text-gray-900">
                    {edu.degree} in {edu.field}
                  </h4>
                  <p className="text-gray-700">{edu.institution}</p>
                  <p className="text-sm text-gray-600">
                    {edu.startDate} - {edu.endDate}
                  </p>
                  {edu.gpa && <p className="text-sm text-gray-600">GPA: {edu.gpa}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills */}
        {data.skills.length > 0 && (
          <section>
            <h3 className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-wide">Skills</h3>
            <div className="space-y-3">
              {data.skills.map((skillGroup) => (
                <div key={skillGroup.id}>
                  <h4 className="font-semibold text-gray-900 mb-1">{skillGroup.category}:</h4>
                  <p className="text-gray-700 text-sm">{skillGroup.items.join(" • ")}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Projects */}
      {data.projects.length > 0 && (
        <section>
          <h3 className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-wide">Key Projects</h3>
          <div className="space-y-4">
            {data.projects.map((project) => (
              <div key={project.id}>
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-semibold text-gray-900">{project.name}</h4>
                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 text-sm underline"
                    >
                      View Project
                    </a>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-1">
                  <strong>Technologies:</strong> {project.technologies.join(", ")}
                </p>
                <p className="text-gray-700 text-sm leading-relaxed">{project.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
