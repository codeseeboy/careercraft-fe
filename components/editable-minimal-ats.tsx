"use client"

import type React from "react"

import type { ResumeData } from "../resume-editor"

interface EditableTemplateProps {
  data: ResumeData
  isDesignMode: boolean
  onElementSelect?: (elementId: string) => void
  selectedElement?: string | null
  onElementUpdate?: (elementId: string, updates: any) => void
  onElementDelete?: (elementId: string) => void
}

export function EditableMinimalATSTemplate({
  data,
  isDesignMode,
  onElementSelect,
  selectedElement,
  onElementUpdate,
  onElementDelete,
}: EditableTemplateProps) {
  const handleElementClick = (elementId: string, e: React.MouseEvent) => {
    if (isDesignMode) {
      e.stopPropagation()
      onElementSelect?.(elementId)
    }
  }

  const ElementWrapper = ({
    id,
    children,
    className = "",
    style = {},
  }: {
    id: string
    children: React.ReactNode
    className?: string
    style?: React.CSSProperties
  }) => {
    const isSelected = selectedElement === id

    return (
      <div
        className={`${className} ${isDesignMode ? "cursor-move hover:outline hover:outline-2 hover:outline-gray-400" : ""} ${
          isSelected ? "outline outline-2 outline-gray-600 bg-gray-50/50" : ""
        }`}
        style={style}
        onClick={(e) => handleElementClick(id, e)}
        data-element-id={id}
      >
        {children}
        {isDesignMode && isSelected && (
          <div className="absolute top-0 right-0 flex gap-1 bg-gray-600 text-white text-xs p-1 rounded-bl z-50">
            <button
              onClick={(e) => {
                e.stopPropagation()
                onElementDelete?.(id)
              }}
              className="hover:bg-red-500 px-1 rounded"
            >
              ×
            </button>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="w-[210mm] h-[297mm] mx-auto bg-white shadow-lg print:shadow-none print:w-full print:h-full p-12 relative overflow-hidden">
      {/* Header */}
      <ElementWrapper id="ats-header-section" className="border-b-2 border-gray-900 pb-6 mb-8 relative">
        <ElementWrapper id="ats-full-name" className="text-5xl font-bold text-gray-900 mb-2 tracking-tight relative">
          {data.personalInfo.fullName || "Your Full Name"}
        </ElementWrapper>
        <ElementWrapper id="ats-job-title" className="text-xl text-gray-700 mb-4 relative">
          {data.personalInfo.jobTitle || "Professional Title"}
        </ElementWrapper>

        <ElementWrapper id="ats-contact-primary" className="flex flex-wrap gap-6 text-sm text-gray-600 relative">
          {data.personalInfo.email && (
            <ElementWrapper id="ats-email" className="flex items-center gap-2 relative">
              <span>Email:</span>
              <span className="font-medium">{data.personalInfo.email}</span>
            </ElementWrapper>
          )}
          {data.personalInfo.phone && (
            <ElementWrapper id="ats-phone" className="flex items-center gap-2 relative">
              <span>Phone:</span>
              <span className="font-medium">{data.personalInfo.phone}</span>
            </ElementWrapper>
          )}
          {data.personalInfo.location && (
            <ElementWrapper id="ats-location" className="flex items-center gap-2 relative">
              <span>Location:</span>
              <span className="font-medium">{data.personalInfo.location}</span>
            </ElementWrapper>
          )}
        </ElementWrapper>

        {(data.personalInfo.linkedin || data.personalInfo.github || data.personalInfo.website) && (
          <ElementWrapper
            id="ats-contact-secondary"
            className="flex flex-wrap gap-6 text-sm text-gray-600 mt-2 relative"
          >
            {data.personalInfo.linkedin && (
              <ElementWrapper id="ats-linkedin" className="flex items-center gap-2 relative">
                <span>LinkedIn:</span>
                <span className="font-medium">{data.personalInfo.linkedin}</span>
              </ElementWrapper>
            )}
            {data.personalInfo.github && (
              <ElementWrapper id="ats-github" className="flex items-center gap-2 relative">
                <span>GitHub:</span>
                <span className="font-medium">{data.personalInfo.github}</span>
              </ElementWrapper>
            )}
            {data.personalInfo.website && (
              <ElementWrapper id="ats-website" className="flex items-center gap-2 relative">
                <span>Website:</span>
                <span className="font-medium">{data.personalInfo.website}</span>
              </ElementWrapper>
            )}
          </ElementWrapper>
        )}
      </ElementWrapper>

      {/* Summary */}
      {data.summary && (
        <ElementWrapper id="ats-summary-section" className="mb-8 relative">
          <ElementWrapper
            id="ats-summary-title"
            className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-wide relative"
          >
            Professional Summary
          </ElementWrapper>
          <ElementWrapper id="ats-summary-content" className="text-gray-700 leading-relaxed text-justify relative">
            <div dangerouslySetInnerHTML={{ __html: data.summary }} />
          </ElementWrapper>
        </ElementWrapper>
      )}

      {/* Experience */}
      {data.experience.length > 0 && (
        <ElementWrapper id="ats-experience-section" className="mb-8 relative">
          <ElementWrapper
            id="ats-experience-title"
            className="text-xl font-bold text-gray-900 mb-6 uppercase tracking-wide relative"
          >
            Professional Experience
          </ElementWrapper>
          <div className="space-y-6">
            {data.experience.map((exp, index) => (
              <ElementWrapper key={exp.id} id={`ats-experience-item-${index}`} className="relative">
                <div className="flex justify-between items-baseline mb-2">
                  <div>
                    <ElementWrapper
                      id={`ats-experience-position-${index}`}
                      className="text-lg font-semibold text-gray-900 relative"
                    >
                      {exp.position}
                    </ElementWrapper>
                    <ElementWrapper id={`ats-experience-company-${index}`} className="text-lg text-gray-700 relative">
                      {exp.company}
                    </ElementWrapper>
                  </div>
                  <ElementWrapper
                    id={`ats-experience-dates-${index}`}
                    className="text-sm text-gray-600 text-right relative"
                  >
                    <p>
                      {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                    </p>
                  </ElementWrapper>
                </div>

                <ElementWrapper
                  id={`ats-experience-description-${index}`}
                  className="text-gray-700 leading-relaxed ml-0 prose prose-sm max-w-none relative"
                >
                  <div dangerouslySetInnerHTML={{ __html: exp.description }} />
                </ElementWrapper>
              </ElementWrapper>
            ))}
          </div>
        </ElementWrapper>
      )}

      {/* Education & Skills Grid */}
      <div className="grid grid-cols-2 gap-8 mb-8">
        {/* Education */}
        {data.education.length > 0 && (
          <ElementWrapper id="ats-education-section" className="relative">
            <ElementWrapper
              id="ats-education-title"
              className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-wide relative"
            >
              Education
            </ElementWrapper>
            <div className="space-y-4">
              {data.education.map((edu, index) => (
                <ElementWrapper key={edu.id} id={`ats-education-item-${index}`} className="relative">
                  <ElementWrapper id={`ats-education-degree-${index}`} className="font-semibold text-gray-900 relative">
                    {edu.degree} in {edu.field}
                  </ElementWrapper>
                  <ElementWrapper id={`ats-education-institution-${index}`} className="text-gray-700 relative">
                    {edu.institution}
                  </ElementWrapper>
                  <ElementWrapper id={`ats-education-dates-${index}`} className="text-sm text-gray-600 relative">
                    {edu.startDate} - {edu.endDate}
                  </ElementWrapper>
                  {edu.gpa && (
                    <ElementWrapper id={`ats-education-gpa-${index}`} className="text-sm text-gray-600 relative">
                      GPA: {edu.gpa}
                    </ElementWrapper>
                  )}
                </ElementWrapper>
              ))}
            </div>
          </ElementWrapper>
        )}

        {/* Skills */}
        {data.skills.length > 0 && (
          <ElementWrapper id="ats-skills-section" className="relative">
            <ElementWrapper
              id="ats-skills-title"
              className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-wide relative"
            >
              Skills
            </ElementWrapper>
            <div className="space-y-3">
              {data.skills.map((skillGroup, index) => (
                <ElementWrapper key={skillGroup.id} id={`ats-skills-group-${index}`} className="relative">
                  <ElementWrapper
                    id={`ats-skills-category-${index}`}
                    className="font-semibold text-gray-900 mb-1 relative"
                  >
                    {skillGroup.category}:
                  </ElementWrapper>
                  <ElementWrapper id={`ats-skills-items-${index}`} className="text-gray-700 text-sm relative">
                    {skillGroup.items.join(" • ")}
                  </ElementWrapper>
                </ElementWrapper>
              ))}
            </div>
          </ElementWrapper>
        )}
      </div>

      {/* Projects */}
      {data.projects.length > 0 && (
        <ElementWrapper id="ats-projects-section" className="relative">
          <ElementWrapper
            id="ats-projects-title"
            className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-wide relative"
          >
            Key Projects
          </ElementWrapper>
          <div className="space-y-4">
            {data.projects.map((project, index) => (
              <ElementWrapper key={project.id} id={`ats-project-item-${index}`} className="relative">
                <div className="flex justify-between items-start mb-1">
                  <ElementWrapper id={`ats-project-name-${index}`} className="font-semibold text-gray-900 relative">
                    {project.name}
                  </ElementWrapper>
                  {project.link && (
                    <ElementWrapper id={`ats-project-link-${index}`} className="relative">
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 text-sm underline"
                      >
                        View Project
                      </a>
                    </ElementWrapper>
                  )}
                </div>
                <ElementWrapper
                  id={`ats-project-technologies-${index}`}
                  className="text-sm text-gray-600 mb-1 relative"
                >
                  <strong>Technologies:</strong> {project.technologies.join(", ")}
                </ElementWrapper>
                <ElementWrapper
                  id={`ats-project-description-${index}`}
                  className="text-gray-700 text-sm leading-relaxed relative"
                >
                  {project.description}
                </ElementWrapper>
              </ElementWrapper>
            ))}
          </div>
        </ElementWrapper>
      )}
    </div>
  )
}
