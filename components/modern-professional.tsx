"use client"

import type { ResumeData } from "../resume-editor"

export function ModernProfessionalTemplate({ data }: { data: ResumeData }) {
  return (
    <div className="w-full h-full bg-white p-8 text-black leading-relaxed">
      {/* Header Section */}
      <header className="border-b-2 border-blue-600 pb-4 mb-6">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">{data.personalInfo.fullName || "Your Full Name"}</h1>
        <h2 className="text-xl text-blue-600 mb-4">{data.personalInfo.jobTitle || "Professional Title"}</h2>

        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
          {data.personalInfo.email && (
            <div className="flex items-center gap-2">
              <span>📧</span>
              <span>{data.personalInfo.email}</span>
            </div>
          )}
          {data.personalInfo.phone && (
            <div className="flex items-center gap-2">
              <span>📞</span>
              <span>{data.personalInfo.phone}</span>
            </div>
          )}
          {data.personalInfo.location && (
            <div className="flex items-center gap-2">
              <span>📍</span>
              <span>{data.personalInfo.location}</span>
            </div>
          )}
        </div>

        {(data.personalInfo.linkedin || data.personalInfo.github || data.personalInfo.website) && (
          <div className="flex flex-wrap gap-4 text-sm text-gray-600 mt-2">
            {data.personalInfo.linkedin && (
              <div className="flex items-center gap-2">
                <span>💼</span>
                <span>{data.personalInfo.linkedin}</span>
              </div>
            )}
            {data.personalInfo.github && (
              <div className="flex items-center gap-2">
                <span>🔗</span>
                <span>{data.personalInfo.github}</span>
              </div>
            )}
            {data.personalInfo.website && (
              <div className="flex items-center gap-2">
                <span>🌐</span>
                <span>{data.personalInfo.website}</span>
              </div>
            )}
          </div>
        )}
      </header>

      {/* Summary */}
      {data.summary && (
        <section className="mb-6">
          <h3 className="text-xl font-bold text-blue-600 mb-3 border-b border-blue-200 pb-1">Professional Summary</h3>
          <div className="text-gray-700 leading-relaxed">
            <div dangerouslySetInnerHTML={{ __html: data.summary }} />
          </div>
        </section>
      )}

      {/* Experience */}
      {data.experience.length > 0 && (
        <section className="mb-6">
          <h3 className="text-xl font-bold text-blue-600 mb-4 border-b border-blue-200 pb-1">
            Professional Experience
          </h3>
          <div className="space-y-4">
            {data.experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">{exp.position}</h4>
                    <p className="text-blue-600 font-medium">{exp.company}</p>
                  </div>
                  <p className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded">
                    {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                  </p>
                </div>
                <div className="text-gray-700 leading-relaxed prose prose-sm max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: exp.description }} />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="grid grid-cols-2 gap-6">
        {/* Education */}
        {data.education.length > 0 && (
          <section className="mb-6">
            <h3 className="text-xl font-bold text-blue-600 mb-3 border-b border-blue-200 pb-1">Education</h3>
            <div className="space-y-3">
              {data.education.map((edu) => (
                <div key={edu.id}>
                  <h4 className="font-semibold text-gray-900">
                    {edu.degree} in {edu.field}
                  </h4>
                  <p className="text-blue-600">{edu.institution}</p>
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
          <section className="mb-6">
            <h3 className="text-xl font-bold text-blue-600 mb-3 border-b border-blue-200 pb-1">
              Skills & Technologies
            </h3>
            <div className="space-y-3">
              {data.skills.map((skillGroup) => (
                <div key={skillGroup.id}>
                  <h4 className="font-semibold text-gray-900 mb-1">{skillGroup.category}</h4>
                  <div className="flex flex-wrap gap-2">
                    {skillGroup.items.map((skill, index) => (
                      <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Projects */}
      {data.projects.length > 0 && (
        <section className="mb-6">
          <h3 className="text-xl font-bold text-blue-600 mb-3 border-b border-blue-200 pb-1">Key Projects</h3>
          <div className="space-y-4">
            {data.projects.map((project) => (
              <div key={project.id}>
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-gray-900">{project.name}</h4>
                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 text-sm hover:underline"
                    >
                      View Project →
                    </a>
                  )}
                </div>
                <div className="flex flex-wrap gap-2 mb-2">
                  {project.technologies.map((tech, index) => (
                    <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                      {tech}
                    </span>
                  ))}
                </div>
                <p className="text-gray-700 text-sm leading-relaxed">{project.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
