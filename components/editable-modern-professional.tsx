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

export function EditableModernProfessionalTemplate({
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
        className={`${className} ${isDesignMode ? "cursor-move hover:outline hover:outline-2 hover:outline-blue-300" : ""} ${
          isSelected ? "outline outline-2 outline-blue-500 bg-blue-50/20" : ""
        }`}
        style={style}
        onClick={(e) => handleElementClick(id, e)}
        data-element-id={id}
      >
        {children}
        {isDesignMode && isSelected && (
          <div className="absolute top-0 right-0 flex gap-1 bg-blue-500 text-white text-xs p-1 rounded-bl">
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
    <div className="w-full h-full bg-white p-8 text-black leading-relaxed relative">
      {/* Header Section */}
      <ElementWrapper id="header-section" className="border-b-2 border-blue-600 pb-4 mb-6 relative">
        <ElementWrapper id="full-name" className="text-4xl font-bold text-gray-900 mb-2 relative">
          {data.personalInfo.fullName || "Your Full Name"}
        </ElementWrapper>

        <ElementWrapper id="job-title" className="text-xl text-blue-600 mb-4 relative">
          {data.personalInfo.jobTitle || "Professional Title"}
        </ElementWrapper>

        <ElementWrapper id="contact-info" className="flex flex-wrap gap-4 text-sm text-gray-600 relative">
          {data.personalInfo.email && (
            <ElementWrapper id="email-contact" className="flex items-center gap-2 relative">
              <span>📧</span>
              <span>{data.personalInfo.email}</span>
            </ElementWrapper>
          )}
          {data.personalInfo.phone && (
            <ElementWrapper id="phone-contact" className="flex items-center gap-2 relative">
              <span>📞</span>
              <span>{data.personalInfo.phone}</span>
            </ElementWrapper>
          )}
          {data.personalInfo.location && (
            <ElementWrapper id="location-contact" className="flex items-center gap-2 relative">
              <span>📍</span>
              <span>{data.personalInfo.location}</span>
            </ElementWrapper>
          )}
        </ElementWrapper>

        {(data.personalInfo.linkedin || data.personalInfo.github || data.personalInfo.website) && (
          <ElementWrapper id="social-links" className="flex flex-wrap gap-4 text-sm text-gray-600 mt-2 relative">
            {data.personalInfo.linkedin && (
              <ElementWrapper id="linkedin-link" className="flex items-center gap-2 relative">
                <span>💼</span>
                <span>{data.personalInfo.linkedin}</span>
              </ElementWrapper>
            )}
            {data.personalInfo.github && (
              <ElementWrapper id="github-link" className="flex items-center gap-2 relative">
                <span>🔗</span>
                <span>{data.personalInfo.github}</span>
              </ElementWrapper>
            )}
            {data.personalInfo.website && (
              <ElementWrapper id="website-link" className="flex items-center gap-2 relative">
                <span>🌐</span>
                <span>{data.personalInfo.website}</span>
              </ElementWrapper>
            )}
          </ElementWrapper>
        )}
      </ElementWrapper>

      {/* Summary Section */}
      {data.summary && (
        <ElementWrapper id="summary-section" className="mb-6 relative">
          <ElementWrapper
            id="summary-title"
            className="text-xl font-bold text-blue-600 mb-3 border-b border-blue-200 pb-1 relative"
          >
            Professional Summary
          </ElementWrapper>
          <ElementWrapper id="summary-content" className="text-gray-700 leading-relaxed relative">
            <div dangerouslySetInnerHTML={{ __html: data.summary }} />
          </ElementWrapper>
        </ElementWrapper>
      )}

      {/* Experience Section */}
      {data.experience.length > 0 && (
        <ElementWrapper id="experience-section" className="mb-6 relative">
          <ElementWrapper
            id="experience-title"
            className="text-xl font-bold text-blue-600 mb-4 border-b border-blue-200 pb-1 relative"
          >
            Professional Experience
          </ElementWrapper>
          <div className="space-y-4">
            {data.experience.map((exp, index) => (
              <ElementWrapper key={exp.id} id={`experience-item-${index}`} className="relative">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <ElementWrapper
                      id={`experience-position-${index}`}
                      className="text-lg font-semibold text-gray-900 relative"
                    >
                      {exp.position}
                    </ElementWrapper>
                    <ElementWrapper id={`experience-company-${index}`} className="text-blue-600 font-medium relative">
                      {exp.company}
                    </ElementWrapper>
                  </div>
                  <ElementWrapper
                    id={`experience-dates-${index}`}
                    className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded relative"
                  >
                    {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                  </ElementWrapper>
                </div>
                <ElementWrapper
                  id={`experience-description-${index}`}
                  className="text-gray-700 leading-relaxed prose prose-sm max-w-none relative"
                >
                  <div dangerouslySetInnerHTML={{ __html: exp.description }} />
                </ElementWrapper>
              </ElementWrapper>
            ))}
          </div>
        </ElementWrapper>
      )}

      <div className="grid grid-cols-2 gap-6">
        {/* Education Section */}
        {data.education.length > 0 && (
          <ElementWrapper id="education-section" className="mb-6 relative">
            <ElementWrapper
              id="education-title"
              className="text-xl font-bold text-blue-600 mb-3 border-b border-blue-200 pb-1 relative"
            >
              Education
            </ElementWrapper>
            <div className="space-y-3">
              {data.education.map((edu, index) => (
                <ElementWrapper key={edu.id} id={`education-item-${index}`} className="relative">
                  <ElementWrapper id={`education-degree-${index}`} className="font-semibold text-gray-900 relative">
                    {edu.degree} in {edu.field}
                  </ElementWrapper>
                  <ElementWrapper id={`education-institution-${index}`} className="text-blue-600 relative">
                    {edu.institution}
                  </ElementWrapper>
                  <ElementWrapper id={`education-dates-${index}`} className="text-sm text-gray-600 relative">
                    {edu.startDate} - {edu.endDate}
                  </ElementWrapper>
                  {edu.gpa && (
                    <ElementWrapper id={`education-gpa-${index}`} className="text-sm text-gray-600 relative">
                      GPA: {edu.gpa}
                    </ElementWrapper>
                  )}
                </ElementWrapper>
              ))}
            </div>
          </ElementWrapper>
        )}

        {/* Skills Section */}
        {data.skills.length > 0 && (
          <ElementWrapper id="skills-section" className="mb-6 relative">
            <ElementWrapper
              id="skills-title"
              className="text-xl font-bold text-blue-600 mb-3 border-b border-blue-200 pb-1 relative"
            >
              Skills & Technologies
            </ElementWrapper>
            <div className="space-y-3">
              {data.skills.map((skillGroup, index) => (
                <ElementWrapper key={skillGroup.id} id={`skills-group-${index}`} className="relative">
                  <ElementWrapper id={`skills-category-${index}`} className="font-semibold text-gray-900 mb-1 relative">
                    {skillGroup.category}
                  </ElementWrapper>
                  <ElementWrapper id={`skills-items-${index}`} className="flex flex-wrap gap-2 relative">
                    {skillGroup.items.map((skill, skillIndex) => (
                      <ElementWrapper
                        key={skillIndex}
                        id={`skill-${index}-${skillIndex}`}
                        className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm relative"
                      >
                        {skill}
                      </ElementWrapper>
                    ))}
                  </ElementWrapper>
                </ElementWrapper>
              ))}
            </div>
          </ElementWrapper>
        )}
      </div>

      {/* Projects Section */}
      {data.projects.length > 0 && (
        <ElementWrapper id="projects-section" className="mb-6 relative">
          <ElementWrapper
            id="projects-title"
            className="text-xl font-bold text-blue-600 mb-3 border-b border-blue-200 pb-1 relative"
          >
            Key Projects
          </ElementWrapper>
          <div className="space-y-4">
            {data.projects.map((project, index) => (
              <ElementWrapper key={project.id} id={`project-item-${index}`} className="relative">
                <div className="flex justify-between items-start mb-2">
                  <ElementWrapper id={`project-name-${index}`} className="font-semibold text-gray-900 relative">
                    {project.name}
                  </ElementWrapper>
                  {project.link && (
                    <ElementWrapper id={`project-link-${index}`} className="relative">
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 text-sm hover:underline"
                      >
                        View Project →
                      </a>
                    </ElementWrapper>
                  )}
                </div>
                <ElementWrapper id={`project-technologies-${index}`} className="flex flex-wrap gap-2 mb-2 relative">
                  {project.technologies.map((tech, techIndex) => (
                    <ElementWrapper
                      key={techIndex}
                      id={`project-tech-${index}-${techIndex}`}
                      className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs relative"
                    >
                      {tech}
                    </ElementWrapper>
                  ))}
                </ElementWrapper>
                <ElementWrapper
                  id={`project-description-${index}`}
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
