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

export function EditableCreativeModernTemplate({
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
        className={`${className} ${isDesignMode ? "cursor-move hover:outline hover:outline-2 hover:outline-purple-300" : ""} ${
          isSelected ? "outline outline-2 outline-purple-500 bg-purple-50/20" : ""
        }`}
        style={style}
        onClick={(e) => handleElementClick(id, e)}
        data-element-id={id}
      >
        {children}
        {isDesignMode && isSelected && (
          <div className="absolute top-0 right-0 flex gap-1 bg-purple-500 text-white text-xs p-1 rounded-bl z-50">
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
    <div className="w-[210mm] h-[297mm] mx-auto bg-white shadow-lg print:shadow-none print:w-full print:h-full relative overflow-hidden">
      <div className="flex h-full">
        {/* Left Sidebar */}
        <ElementWrapper
          id="left-sidebar"
          className="w-1/3 bg-gradient-to-b from-purple-800 to-purple-600 text-white p-6 relative"
        >
          {/* Profile */}
          <ElementWrapper id="profile-section" className="text-center mb-8 relative">
            <ElementWrapper
              id="profile-avatar"
              className="w-32 h-32 mx-auto mb-4 rounded-full bg-white/20 flex items-center justify-center relative"
            >
              <div className="w-28 h-28 rounded-full bg-white/30 flex items-center justify-center text-4xl font-light">
                {data.personalInfo.fullName?.charAt(0) || "A"}
              </div>
            </ElementWrapper>
            <ElementWrapper id="profile-name" className="text-2xl font-bold mb-1 relative">
              {data.personalInfo.fullName || "Your Name"}
            </ElementWrapper>
            <ElementWrapper id="profile-title" className="text-lg opacity-90 relative">
              {data.personalInfo.jobTitle || "Your Title"}
            </ElementWrapper>
          </ElementWrapper>

          {/* Contact */}
          <ElementWrapper id="contact-section" className="mb-8 relative">
            <ElementWrapper
              id="contact-title"
              className="text-lg font-semibold mb-4 border-b border-white/30 pb-2 relative"
            >
              Contact
            </ElementWrapper>
            <div className="space-y-3 text-sm">
              {data.personalInfo.email && (
                <ElementWrapper id="contact-email" className="flex items-center gap-2 relative">
                  <span>📧</span>
                  <span className="break-all">{data.personalInfo.email}</span>
                </ElementWrapper>
              )}
              {data.personalInfo.phone && (
                <ElementWrapper id="contact-phone" className="flex items-center gap-2 relative">
                  <span>📞</span>
                  <span>{data.personalInfo.phone}</span>
                </ElementWrapper>
              )}
              {data.personalInfo.location && (
                <ElementWrapper id="contact-location" className="flex items-center gap-2 relative">
                  <span>📍</span>
                  <span>{data.personalInfo.location}</span>
                </ElementWrapper>
              )}
              {data.personalInfo.linkedin && (
                <ElementWrapper id="contact-linkedin" className="flex items-center gap-2 relative">
                  <span>💼</span>
                  <span className="break-all text-xs">{data.personalInfo.linkedin}</span>
                </ElementWrapper>
              )}
            </div>
          </ElementWrapper>

          {/* Skills */}
          {data.skills.length > 0 && (
            <ElementWrapper id="sidebar-skills-section" className="mb-8 relative">
              <ElementWrapper
                id="sidebar-skills-title"
                className="text-lg font-semibold mb-4 border-b border-white/30 pb-2 relative"
              >
                Skills
              </ElementWrapper>
              <div className="space-y-4">
                {data.skills.map((skillGroup, index) => (
                  <ElementWrapper key={skillGroup.id} id={`sidebar-skills-group-${index}`} className="relative">
                    <ElementWrapper
                      id={`sidebar-skills-category-${index}`}
                      className="font-medium mb-2 text-sm opacity-90 relative"
                    >
                      {skillGroup.category}
                    </ElementWrapper>
                    <div className="space-y-1">
                      {skillGroup.items.map((skill, skillIndex) => (
                        <ElementWrapper
                          key={skillIndex}
                          id={`sidebar-skill-${index}-${skillIndex}`}
                          className="bg-white/20 rounded px-2 py-1 text-xs relative"
                        >
                          {skill}
                        </ElementWrapper>
                      ))}
                    </div>
                  </ElementWrapper>
                ))}
              </div>
            </ElementWrapper>
          )}

          {/* Education */}
          {data.education.length > 0 && (
            <ElementWrapper id="sidebar-education-section" className="relative">
              <ElementWrapper
                id="sidebar-education-title"
                className="text-lg font-semibold mb-4 border-b border-white/30 pb-2 relative"
              >
                Education
              </ElementWrapper>
              <div className="space-y-4">
                {data.education.map((edu, index) => (
                  <ElementWrapper key={edu.id} id={`sidebar-education-item-${index}`} className="text-sm relative">
                    <ElementWrapper id={`sidebar-education-degree-${index}`} className="font-medium relative">
                      {edu.degree}
                    </ElementWrapper>
                    <ElementWrapper id={`sidebar-education-field-${index}`} className="opacity-90 relative">
                      {edu.field}
                    </ElementWrapper>
                    <ElementWrapper
                      id={`sidebar-education-institution-${index}`}
                      className="opacity-75 text-xs relative"
                    >
                      {edu.institution}
                    </ElementWrapper>
                    <ElementWrapper id={`sidebar-education-dates-${index}`} className="opacity-75 text-xs relative">
                      {edu.startDate} - {edu.endDate}
                    </ElementWrapper>
                  </ElementWrapper>
                ))}
              </div>
            </ElementWrapper>
          )}
        </ElementWrapper>

        {/* Main Content */}
        <ElementWrapper id="main-content" className="flex-1 p-8 relative">
          {/* Summary */}
          {data.summary && (
            <ElementWrapper id="main-summary-section" className="mb-8 relative">
              <ElementWrapper
                id="main-summary-title"
                className="text-2xl font-bold text-purple-800 mb-4 border-b-2 border-purple-200 pb-2 relative"
              >
                About Me
              </ElementWrapper>
              <ElementWrapper id="main-summary-content" className="text-gray-700 leading-relaxed relative">
                <div dangerouslySetInnerHTML={{ __html: data.summary }} />
              </ElementWrapper>
            </ElementWrapper>
          )}

          {/* Experience */}
          {data.experience.length > 0 && (
            <ElementWrapper id="main-experience-section" className="mb-8 relative">
              <ElementWrapper
                id="main-experience-title"
                className="text-2xl font-bold text-purple-800 mb-6 border-b-2 border-purple-200 pb-2 relative"
              >
                Experience
              </ElementWrapper>
              <div className="space-y-6">
                {data.experience.map((exp, index) => (
                  <ElementWrapper key={exp.id} id={`main-experience-item-${index}`} className="relative pl-6">
                    <div className="absolute left-0 top-2 w-3 h-3 bg-purple-600 rounded-full"></div>
                    {index < data.experience.length - 1 && (
                      <div className="absolute left-1.5 top-5 w-0.5 h-full bg-purple-200"></div>
                    )}

                    <ElementWrapper
                      id={`main-experience-card-${index}`}
                      className="bg-purple-50 rounded-lg p-4 relative"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <ElementWrapper
                            id={`main-experience-position-${index}`}
                            className="text-lg font-semibold text-gray-900 relative"
                          >
                            {exp.position}
                          </ElementWrapper>
                          <ElementWrapper
                            id={`main-experience-company-${index}`}
                            className="text-purple-600 font-medium relative"
                          >
                            {exp.company}
                          </ElementWrapper>
                        </div>
                        <ElementWrapper
                          id={`main-experience-dates-${index}`}
                          className="text-sm text-gray-600 bg-white px-3 py-1 rounded-full relative"
                        >
                          {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                        </ElementWrapper>
                      </div>

                      <ElementWrapper
                        id={`main-experience-description-${index}`}
                        className="text-gray-700 leading-relaxed prose prose-sm max-w-none relative"
                      >
                        <div dangerouslySetInnerHTML={{ __html: exp.description }} />
                      </ElementWrapper>
                    </ElementWrapper>
                  </ElementWrapper>
                ))}
              </div>
            </ElementWrapper>
          )}

          {/* Projects */}
          {data.projects.length > 0 && (
            <ElementWrapper id="main-projects-section" className="relative">
              <ElementWrapper
                id="main-projects-title"
                className="text-2xl font-bold text-purple-800 mb-4 border-b-2 border-purple-200 pb-2 relative"
              >
                Featured Projects
              </ElementWrapper>
              <div className="grid grid-cols-1 gap-4">
                {data.projects.map((project, index) => (
                  <ElementWrapper
                    key={project.id}
                    id={`main-project-item-${index}`}
                    className="border border-purple-200 rounded-lg p-4 bg-purple-50/50 relative"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <ElementWrapper
                        id={`main-project-name-${index}`}
                        className="font-semibold text-gray-900 relative"
                      >
                        {project.name}
                      </ElementWrapper>
                      {project.link && (
                        <ElementWrapper id={`main-project-link-${index}`} className="relative">
                          <a
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-purple-600 text-sm"
                          >
                            View →
                          </a>
                        </ElementWrapper>
                      )}
                    </div>
                    <ElementWrapper
                      id={`main-project-technologies-${index}`}
                      className="flex flex-wrap gap-2 mb-2 relative"
                    >
                      {project.technologies.map((tech, techIndex) => (
                        <ElementWrapper
                          key={techIndex}
                          id={`main-project-tech-${index}-${techIndex}`}
                          className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs relative"
                        >
                          {tech}
                        </ElementWrapper>
                      ))}
                    </ElementWrapper>
                    <ElementWrapper
                      id={`main-project-description-${index}`}
                      className="text-gray-700 text-sm leading-relaxed relative"
                    >
                      {project.description}
                    </ElementWrapper>
                  </ElementWrapper>
                ))}
              </div>
            </ElementWrapper>
          )}
        </ElementWrapper>
      </div>
    </div>
  )
}
