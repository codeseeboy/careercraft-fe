"use client"

import type { ResumeData } from "../resume-editor"

export function CreativeModernTemplate({ data }: { data: ResumeData }) {
  return (
    <div className="w-[210mm] h-[297mm] mx-auto bg-white shadow-lg print:shadow-none print:w-full print:h-full relative overflow-hidden">
      <div className="flex h-full">
        {/* Left Sidebar */}
        <div className="w-1/3 bg-gradient-to-b from-purple-800 to-purple-600 text-white p-6">
          {/* Profile */}
          <div className="text-center mb-8">
            <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-white/20 flex items-center justify-center">
              <div className="w-28 h-28 rounded-full bg-white/30 flex items-center justify-center text-4xl font-light">
                {data.personalInfo.fullName?.charAt(0) || "A"}
              </div>
            </div>
            <h1 className="text-2xl font-bold mb-1">{data.personalInfo.fullName || "Your Name"}</h1>
            <h2 className="text-lg opacity-90">{data.personalInfo.jobTitle || "Your Title"}</h2>
          </div>

          {/* Contact */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4 border-b border-white/30 pb-2">Contact</h3>
            <div className="space-y-3 text-sm">
              {data.personalInfo.email && (
                <div className="flex items-center gap-2">
                  <span>📧</span>
                  <span className="break-all">{data.personalInfo.email}</span>
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
              {data.personalInfo.linkedin && (
                <div className="flex items-center gap-2">
                  <span>💼</span>
                  <span className="break-all text-xs">{data.personalInfo.linkedin}</span>
                </div>
              )}
            </div>
          </div>

          {/* Skills */}
          {data.skills.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4 border-b border-white/30 pb-2">Skills</h3>
              <div className="space-y-4">
                {data.skills.map((skillGroup) => (
                  <div key={skillGroup.id}>
                    <h4 className="font-medium mb-2 text-sm opacity-90">{skillGroup.category}</h4>
                    <div className="space-y-1">
                      {skillGroup.items.map((skill, index) => (
                        <div key={index} className="bg-white/20 rounded px-2 py-1 text-xs">
                          {skill}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {data.education.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4 border-b border-white/30 pb-2">Education</h3>
              <div className="space-y-4">
                {data.education.map((edu) => (
                  <div key={edu.id} className="text-sm">
                    <h4 className="font-medium">{edu.degree}</h4>
                    <p className="opacity-90">{edu.field}</p>
                    <p className="opacity-75 text-xs">{edu.institution}</p>
                    <p className="opacity-75 text-xs">
                      {edu.startDate} - {edu.endDate}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {/* Summary */}
          {data.summary && (
            <section className="mb-8">
              <h3 className="text-2xl font-bold text-purple-800 mb-4 border-b-2 border-purple-200 pb-2">About Me</h3>
              <div className="text-gray-700 leading-relaxed">
                <div dangerouslySetInnerHTML={{ __html: data.summary }} />
              </div>
            </section>
          )}

          {/* Experience */}
          {data.experience.length > 0 && (
            <section className="mb-8">
              <h3 className="text-2xl font-bold text-purple-800 mb-6 border-b-2 border-purple-200 pb-2">Experience</h3>
              <div className="space-y-6">
                {data.experience.map((exp, index) => (
                  <div key={exp.id} className="relative pl-6">
                    <div className="absolute left-0 top-2 w-3 h-3 bg-purple-600 rounded-full"></div>
                    {index < data.experience.length - 1 && (
                      <div className="absolute left-1.5 top-5 w-0.5 h-full bg-purple-200"></div>
                    )}

                    <div className="bg-purple-50 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900">{exp.position}</h4>
                          <p className="text-purple-600 font-medium">{exp.company}</p>
                        </div>
                        <div className="text-sm text-gray-600 bg-white px-3 py-1 rounded-full">
                          {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                        </div>
                      </div>

                      <div className="text-gray-700 leading-relaxed prose prose-sm max-w-none">
                        <div dangerouslySetInnerHTML={{ __html: exp.description }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Projects */}
          {data.projects.length > 0 && (
            <section>
              <h3 className="text-2xl font-bold text-purple-800 mb-4 border-b-2 border-purple-200 pb-2">
                Featured Projects
              </h3>
              <div className="grid grid-cols-1 gap-4">
                {data.projects.map((project) => (
                  <div key={project.id} className="border border-purple-200 rounded-lg p-4 bg-purple-50/50">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-gray-900">{project.name}</h4>
                      {project.link && (
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-purple-600 text-sm"
                        >
                          View →
                        </a>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {project.technologies.map((tech, index) => (
                        <span key={index} className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs">
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
      </div>
    </div>
  )
}
