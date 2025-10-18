"use client"

import { getCurrentUserId } from "./auth"

export type RoadmapCourse = {
  id: string
  title: string
  description: string
  duration: string
  videoUrl: string // YouTube video ID
  completed: boolean
  notes?: string
  // New optional lessons support for playlist-like content:
  lessons?: {
    id: string
    title: string
    videoId: string
    durationMinutes?: number
    completed: boolean
    notes?: string
  }[]
}

export type LearningRoadmap = {
  id: string
  jobId: string
  jobTitle: string
  company: string
  createdAt: string
  totalDays: number
  skills: string[]
  courses: RoadmapCourse[]
  progress: number // 0-100
  certificateIssued: boolean
}

export type TrendingCourse = {
  id: string
  title: string
  description: string
  instructor: string
  duration: string
  thumbnail: string
  skills: string[]
  videoCount: number
  level: "Beginner" | "Intermediate" | "Advanced"
  category: string
}

// New course structure for enrolled courses (Udemy-like)
export type Lesson = {
  id: string
  title: string
  videoId: string
  durationMinutes?: number
  completed: boolean
  notes?: string
  thumbnail?: string
  channelTitle?: string
  viewCount?: number
  lastPosition?: number // Store the last playback position
  description?: string // Optional description of the lesson
}

export type Module = {
  id: string
  title: string
  description?: string
  lessons: Lesson[]
  completedAt?: string // When the module was completed
  isRequired?: boolean // If this module is required for completion
}

export type UserCourse = {
  id: string
  source: "trending" | "roadmap" | "custom"
  title: string
  subtitle?: string
  description: string
  thumbnail?: string
  level?: "Beginner" | "Intermediate" | "Advanced"
  category?: string
  skills: string[]
  estimatedHours: number
  modules: Module[]
  createdAt: string
  status: "enrolled" | "in-progress" | "completed"
  progress: number // 0-100
  certificateIssued: boolean
}

// Badges / achievements
export type Badge = {
  id: string
  type: "course-completion"
  title: string
  issuedAt: string
  courseId: string
}

function key(k: string) {
  const uid = getCurrentUserId()
  return `ccai:${uid || "anon"}:${k}`
}

// Existing Roadmaps storage
export function saveRoadmap(roadmap: LearningRoadmap) {
  const current = loadAllRoadmaps()
  const exists = current.find((r) => r.id === roadmap.id)
  const next = exists ? current.map((r) => (r.id === roadmap.id ? roadmap : r)) : [roadmap, ...current]
  localStorage.setItem(key("roadmaps"), JSON.stringify(next))
}

export function loadAllRoadmaps(): LearningRoadmap[] {
  try {
    const s = localStorage.getItem(key("roadmaps"))
    return s ? JSON.parse(s) : []
  } catch {
    return []
  }
}

export function loadRoadmapById(id: string): LearningRoadmap | null {
  const all = loadAllRoadmaps()
  return all.find((r) => r.id === id) || null
}

export function updateCourseProgress(roadmapId: string, courseId: string, completed: boolean, notes?: string) {
  const roadmap = loadRoadmapById(roadmapId)
  if (!roadmap) return

  roadmap.courses = roadmap.courses.map((c) => (c.id === courseId ? { ...c, completed, notes: notes || c.notes } : c))

  const completedCount = roadmap.courses.filter((c) => c.completed).length
  roadmap.progress = Math.round((completedCount / roadmap.courses.length) * 100)

  if (roadmap.progress === 100 && !roadmap.certificateIssued) {
    roadmap.certificateIssued = true
  }

  saveRoadmap(roadmap)
}

export function deleteRoadmap(id: string) {
  const current = loadAllRoadmaps()
  const next = current.filter((r) => r.id !== id)
  localStorage.setItem(key("roadmaps"), JSON.stringify(next))
}

// Real trending courses with actual YouTube videos and thumbnails
export function getTrendingCourses(): TrendingCourse[] {
  return [
    {
      id: "tc-1",
      title: "React - The Complete Guide",
      description:
        "Master React with hooks, routing, Next.js, and advanced state management. Includes real-world projects.",
      instructor: "Academind by Maximilian Schwarzmüller",
      duration: "49 hours",
      thumbnail: "https://i.ytimg.com/vi/Dorf8i6lCuk/mqdefault.jpg",
      skills: ["React", "Redux", "Next.js", "Hooks", "JavaScript"],
      videoCount: 12,
      level: "Intermediate",
      category: "Frontend",
    },
    {
      id: "tc-2",
      title: "Python for Data Science",
      description:
        "Learn Python, NumPy, Pandas, Matplotlib, Scikit-Learn, and TensorFlow for data analysis and ML.",
      instructor: "freeCodeCamp.org",
      duration: "12 hours",
      thumbnail: "https://i.ytimg.com/vi/LHBE6Q9XlzI/mqdefault.jpg",
      skills: ["Python", "Pandas", "NumPy", "Machine Learning", "TensorFlow"],
      videoCount: 9,
      level: "Intermediate",
      category: "Data Science",
    },
    {
      id: "tc-3",
      title: "AWS Certified Solutions Architect",
      description:
        "Prepare for the AWS Solutions Architect Associate exam. Learn cloud computing, EC2, S3, RDS, and more.",
      instructor: "freeCodeCamp.org",
      duration: "13 hours",
      thumbnail: "https://i.ytimg.com/vi/Ia-UEYYR44s/mqdefault.jpg",
      skills: ["AWS", "Cloud Computing", "EC2", "S3", "Lambda"],
      videoCount: 8,
      level: "Intermediate",
      category: "Cloud Computing",
    },
    {
      id: "tc-4",
      title: "The Complete JavaScript Course",
      description: "From fundamentals to advanced concepts. Modern JavaScript, ES6+, OOP, async programming, and more.",
      instructor: "freeCodeCamp.org",
      duration: "7 hours",
      thumbnail: "https://i.ytimg.com/vi/PkZNo7MFNFg/mqdefault.jpg",
      skills: ["JavaScript", "ES6", "Async/Await", "OOP", "DOM"],
      videoCount: 9,
      level: "Beginner",
      category: "Programming",
    },
    {
      id: "tc-5",
      title: "Docker and Kubernetes Tutorial",
      description:
        "Build, test, and deploy containerized applications. Master Docker, Kubernetes, CI/CD, and microservices.",
      instructor: "TechWorld with Nana",
      duration: "3 hours",
      thumbnail: "https://i.ytimg.com/vi/bhBSlnQcq2k/mqdefault.jpg",
      skills: ["Docker", "Kubernetes", "CI/CD", "Microservices", "DevOps"],
      videoCount: 12,
      level: "Advanced",
      category: "DevOps",
    },
    {
      id: "tc-6",
      title: "UI/UX Design Masterclass",
      description:
        "Learn user interface and user experience design. Figma, wireframing, prototyping, and design systems.",
      instructor: "DesignCourse",
      duration: "6 hours",
      thumbnail: "https://i.ytimg.com/vi/c9Wg6Cb_YlU/mqdefault.jpg",
      skills: ["Figma", "UI Design", "UX Design", "Prototyping", "Design Systems"],
      videoCount: 10,
      level: "Beginner",
      category: "Design",
    },
  ]
}

export function getPopularPaths() {
  return [
    {
      id: "path-1",
      title: "Frontend Developer",
      description: "Master HTML, CSS, JavaScript, and React to build modern web applications",
      icon: "💻",
      duration: "3-6 months",
      skills: ["HTML", "CSS", "JavaScript", "React", "TypeScript"],
    },
    {
      id: "path-2",
      title: "Backend Developer",
      description: "Learn Node.js, databases, APIs, and server-side programming",
      icon: "⚙️",
      duration: "4-7 months",
      skills: ["Node.js", "Express", "MongoDB", "PostgreSQL", "APIs"],
    },
    {
      id: "path-3",
      title: "Data Scientist",
      description: "Master Python, statistics, machine learning, and data visualization",
      icon: "📊",
      duration: "6-12 months",
      skills: ["Python", "Pandas", "Machine Learning", "Statistics", "SQL"],
    },
    {
      id: "path-4",
      title: "DevOps Engineer",
      description: "Learn CI/CD, Docker, Kubernetes, and cloud infrastructure",
      icon: "🚀",
      duration: "5-9 months",
      skills: ["Docker", "Kubernetes", "AWS", "CI/CD", "Linux"],
    },
  ]
}

/**
 * User Courses storage
 */
function loadUserCourses(): UserCourse[] {
  try {
    const s = localStorage.getItem(key("userCourses"))
    let courses = s ? JSON.parse(s) : [];
    
    // If no courses exist, create a sample course with real videos
    if (courses.length === 0) {
      courses = [createSampleCourse()];
      saveUserCourses(courses);
    }
    
    return courses;
  } catch {
    // Return sample course if localStorage fails
    const sampleCourse = createSampleCourse();
    saveUserCourses([sampleCourse]);
    return [sampleCourse];
  }
}

// Create a sample course with real YouTube videos organized in modules
function createSampleCourse(): UserCourse {
  return {
    id: "sample-js-course",
    source: "trending",
    title: "JavaScript Essentials",
    subtitle: "Programming • Beginner",
    description: "Learn JavaScript from scratch with this comprehensive course featuring real videos",
    thumbnail: "https://i.ytimg.com/vi/PkZNo7MFNFg/mqdefault.jpg",
    level: "Beginner",
    category: "Programming",
    skills: ["JavaScript", "ES6", "Web Development", "DOM"],
    estimatedHours: 10,
    createdAt: new Date().toISOString(),
    status: "enrolled",
    progress: 0,
    certificateIssued: false,
    modules: [
      {
        id: "mod-1",
        title: "JavaScript Fundamentals",
        description: "Learn the basics of JavaScript programming",
        isRequired: true,
        lessons: [
          {
            id: "lsn-1-1",
            title: "JavaScript Tutorial for Beginners: Learn JavaScript in 1 Hour",
            videoId: "W6NZfCO5SIk",
            thumbnail: "https://i.ytimg.com/vi/W6NZfCO5SIk/mqdefault.jpg",
            channelTitle: "Programming with Mosh",
            durationMinutes: 48,
            completed: false,
            description: "JavaScript tutorial for beginners: Learn JavaScript programming basics in one hour"
          },
          {
            id: "lsn-1-2",
            title: "JavaScript ES6 Arrow Functions Tutorial",
            videoId: "h33Srr5J9nY",
            thumbnail: "https://i.ytimg.com/vi/h33Srr5J9nY/mqdefault.jpg",
            channelTitle: "Web Dev Simplified",
            durationMinutes: 11,
            completed: false,
            description: "Learn how to use ES6 arrow functions in JavaScript"
          }
        ]
      },
      {
        id: "mod-2",
        title: "DOM Manipulation",
        description: "Learn how to interact with the HTML Document Object Model",
        lessons: [
          {
            id: "lsn-2-1",
            title: "JavaScript DOM Manipulation – Full Course for Beginners",
            videoId: "5fb2aPlgoys",
            thumbnail: "https://i.ytimg.com/vi/5fb2aPlgoys/mqdefault.jpg",
            channelTitle: "freeCodeCamp.org",
            durationMinutes: 45,
            completed: false,
            description: "Learn how to manipulate the DOM with JavaScript"
          },
          {
            id: "lsn-2-2",
            title: "JavaScript Event Listeners",
            videoId: "XF1_MlZ5l6M",
            thumbnail: "https://i.ytimg.com/vi/XF1_MlZ5l6M/mqdefault.jpg",
            channelTitle: "Web Dev Simplified",
            durationMinutes: 12,
            completed: false,
            description: "Learn all about JavaScript event listeners and how to use them"
          }
        ]
      },
      {
        id: "mod-3",
        title: "Asynchronous JavaScript",
        description: "Learn promises, async/await, and handling asynchronous operations",
        lessons: [
          {
            id: "lsn-3-1",
            title: "JavaScript Promises In 10 Minutes",
            videoId: "DHvZLI7Db8E",
            thumbnail: "https://i.ytimg.com/vi/DHvZLI7Db8E/mqdefault.jpg", 
            channelTitle: "Web Dev Simplified",
            durationMinutes: 10,
            completed: false,
            description: "Learn JavaScript Promises in just 10 minutes"
          },
          {
            id: "lsn-3-2",
            title: "Async Await JavaScript Tutorial – How to Wait for Functions in JS",
            videoId: "V_Kr9OSfDeU",
            thumbnail: "https://i.ytimg.com/vi/V_Kr9OSfDeU/mqdefault.jpg",
            channelTitle: "freeCodeCamp.org",
            durationMinutes: 24,
            completed: false,
            description: "Learn how to use async/await in JavaScript to write better asynchronous code"
          }
        ]
      }
    ]
  };
}

function saveUserCourses(courses: UserCourse[]) {
  localStorage.setItem(key("userCourses"), JSON.stringify(courses))
}

export function getUserCourses(): UserCourse[] {
  return loadUserCourses()
}

export function getUserCourseById(id: string): UserCourse | null {
  return loadUserCourses().find((c) => c.id === id) || null
}

function computeCourseProgress(course: UserCourse) {
  const allLessons = course.modules.flatMap((m) => m.lessons)
  const done = allLessons.filter((l) => l.completed).length
  const total = Math.max(allLessons.length, 1)
  course.progress = Math.round((done / total) * 100)
  course.status = course.progress === 100 ? "completed" : done > 0 ? "in-progress" : "enrolled"
  if (course.progress === 100 && !course.certificateIssued) {
    course.certificateIssued = true
    addBadge({
      id: `badge-${course.id}`,
      type: "course-completion",
      title: `Completed: ${course.title}`,
      issuedAt: new Date().toISOString(),
      courseId: course.id,
    })
  }
}

export function updateLessonCompletion(courseId: string, moduleId: string, lessonId: string, completed: boolean) {
  const courses = loadUserCourses()
  const idx = courses.findIndex((c) => c.id === courseId)
  if (idx === -1) return
  const course = courses[idx]
  const mod = course.modules.find((m) => m.id === moduleId)
  if (!mod) return
  const lesson = mod.lessons.find((l) => l.id === lessonId)
  if (!lesson) return
  lesson.completed = completed
  computeCourseProgress(course)
  saveUserCourses(courses)
}

export function updateLessonNotes(courseId: string, moduleId: string, lessonId: string, notes: string) {
  const courses = loadUserCourses()
  const idx = courses.findIndex((c) => c.id === courseId)
  if (idx === -1) return
  const course = courses[idx]
  const mod = course.modules.find((m) => m.id === moduleId)
  if (!mod) return
  const lesson = mod.lessons.find((l) => l.id === lessonId)
  if (!lesson) return
  lesson.notes = notes
  saveUserCourses(courses)
}

export function markCourseCompleted(courseId: string) {
  const courses = loadUserCourses()
  const idx = courses.findIndex((c) => c.id === courseId)
  if (idx === -1) return
  courses[idx].progress = 100
  courses[idx].status = "completed"
  courses[idx].certificateIssued = true
  addBadge({
    id: `badge-${courseId}`,
    type: "course-completion",
    title: `Completed: ${courses[idx].title}`,
    issuedAt: new Date().toISOString(),
    courseId: courseId,
  })
  saveUserCourses(courses)
}

function randId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`
}

// Resolves a list of titles into real YouTube video IDs via our enhanced server route.
async function resolveYouTubeTitles(titles: { title: string; category?: string }[], maxPerModule = 5) {
  const lessons: Lesson[] = []
  
  // Process titles in batches for better performance
  const titlesToProcess = titles.slice(0, maxPerModule);
  
  for (const t of titlesToProcess) {
    try {
      // Use our enhanced API with category support if provided
      const queryParams = new URLSearchParams({
        title: t.title,
        limit: "3" // Get multiple results per title to have options
      });
      
      if (t.category) {
        queryParams.append("category", t.category);
      }
      
      const res = await fetch(`/api/videos/search?${queryParams.toString()}`);
      const json = await res.json() as { 
        data: { 
          id: string; 
          title: string;
          thumbnail?: string;
          channelTitle?: string;
          duration?: number;
          viewCount?: number;
        }[] 
      };
      
      // Get the first result that has a valid ID
      const vid = json.data?.find(v => v.id) || json.data?.[0];
      
      if (vid?.id) {
        // Create a more complete lesson object with all available metadata
        lessons.push({
          id: randId("lsn"),
          title: vid.title || t.title,
          videoId: vid.id,
          thumbnail: vid.thumbnail || `https://i.ytimg.com/vi/${vid.id}/mqdefault.jpg`,
          channelTitle: vid.channelTitle || "YouTube Creator",
          durationMinutes: vid.duration ? Math.ceil(vid.duration / 60) : undefined,
          viewCount: vid.viewCount,
          completed: false,
          description: `Learn about ${t.title} through this educational video.`
        });
      } else {
        // Log the failure but continue
        console.warn(`Could not find a video for "${t.title}"`);
      }
    } catch (error) {
      console.error(`Error resolving YouTube title "${t.title}":`, error);
      
      // Create a fallback lesson with a search link
      lessons.push({
        id: randId("lsn"),
        title: t.title,
        videoId: "", // UI will handle this with a search link
        completed: false,
        description: `This video about ${t.title} could not be loaded. Click to search on YouTube.`
      });
    }
  }
  
  // Ensure we have at least one lesson
  if (lessons.length === 0 && titles.length > 0) {
    lessons.push({
      id: randId("lsn"),
      title: titles[0].title,
      videoId: "", // UI will handle this with a search link
      completed: false,
      description: "Video content unavailable. Try searching on YouTube."
    });
  }
  
  return lessons;
}

/**
 * Enroll a user into a course derived from a TrendingCourse.
 * We construct well-structured modules with real videos by topic area.
 */
export async function enrollFromTrending(tr: TrendingCourse): Promise<UserCourse> {
  const modules: Module[] = []

  // Module 1: Introduction & Overview
  const introLessons = await resolveYouTubeTitles(
    [
      { title: `${tr.title} introduction`, category: tr.category },
      { title: `What is ${tr.title}`, category: tr.category }
    ],
    2,
  )
  modules.push({
    id: randId("mod"),
    title: "Introduction to the Course",
    description: `Get started with ${tr.title} and understand the basics`,
    lessons: introLessons,
    isRequired: true
  })

  // Module 2: Core Fundamentals
  const coreLessons = await resolveYouTubeTitles(
    tr.skills.slice(0, 2).map((s) => ({ 
      title: `${s} tutorial`, 
      category: tr.category 
    })),
    2,
  )
  modules.push({
    id: randId("mod"),
    title: "Core Fundamentals",
    description: `Foundational concepts and skills for ${tr.title}`,
    lessons: coreLessons,
    isRequired: true
  })

  // Module 3: Advanced Concepts (if applicable)
  if (tr.level === "Intermediate" || tr.level === "Advanced") {
    const advancedLessons = await resolveYouTubeTitles(
      tr.skills.slice(0, 2).map((s) => ({ 
        title: `Advanced ${s}`, 
        category: tr.category 
      })),
      2,
    )
    modules.push({
      id: randId("mod"),
      title: "Advanced Concepts",
      description: `Take your skills to the next level with advanced ${tr.title} topics`,
      lessons: advancedLessons,
    })
  }
  
  // Module 4: Practical Applications
  const practicalLessons = await resolveYouTubeTitles(
    [
      { title: `${tr.title} project tutorial`, category: tr.category },
      { title: `${tr.title} real world example`, category: tr.category }
    ],
    2,
  )
  modules.push({
    id: randId("mod"),
    title: "Practical Applications",
    description: `Apply what you've learned with real-world examples and projects`,
    lessons: practicalLessons,
  })

  const course: UserCourse = {
    id: randId("course"),
    source: "trending",
    title: tr.title,
    subtitle: `${tr.category} • ${tr.level}`,
    description: tr.description,
    thumbnail: tr.thumbnail,
    level: tr.level,
    category: tr.category,
    skills: tr.skills,
    estimatedHours: Math.max(Math.ceil(modules.flatMap((m) => m.lessons).length * 0.5), 2), // rough estimate
    modules,
    createdAt: new Date().toISOString(),
    status: "enrolled",
    progress: 0,
    certificateIssued: false,
  }

  const courses = loadUserCourses()
  saveUserCourses([course, ...courses])
  return course
}

/**
 * Create a course from Gemini's roadmap result for a set of skills (custom roadmap).
 * youtubeTitles is an array of { title, creator? } suggestions from backend.
 */
export async function createCourseFromRoadmap(
  skillLabel: string,
  youtubeTitles: { title: string; creator?: string }[],
  opts?: { description?: string },
) {
  // Organize content into meaningful modules with better structure
  const modules: Module[] = []
  
  // If we have enough titles, create specialized modules
  if (youtubeTitles.length >= 4) {
    // Module 1: Introduction (first 2 videos)
    const introLessons = await resolveYouTubeTitles(
      youtubeTitles.slice(0, 2).map(t => ({
        title: t.title,
        category: "education"
      })),
      2
    )
    modules.push({
      id: randId("mod"),
      title: `Introduction to ${skillLabel}`,
      description: `Get started with the fundamentals of ${skillLabel}`,
      lessons: introLessons,
      isRequired: true
    })
    
    // Module 2: Core Concepts (next 2 videos)
    const coreLessons = await resolveYouTubeTitles(
      youtubeTitles.slice(2, 4).map(t => ({
        title: t.title,
        category: "education"
      })),
      2
    )
    modules.push({
      id: randId("mod"),
      title: `Core ${skillLabel} Concepts`,
      description: `Build your knowledge with these essential ${skillLabel} topics`,
      lessons: coreLessons,
      isRequired: true
    })
    
    // Module 3: Advanced Topics (remaining videos)
    if (youtubeTitles.length > 4) {
      const advancedLessons = await resolveYouTubeTitles(
        youtubeTitles.slice(4).map(t => ({
          title: t.title,
          category: "education"
        })),
        Math.min(youtubeTitles.length - 4, 4)
      )
      modules.push({
        id: randId("mod"),
        title: `Advanced ${skillLabel} Topics`,
        description: `Deepen your expertise with advanced ${skillLabel} content`,
        lessons: advancedLessons
      })
    }
  } else {
    // Fallback if we don't have enough titles for separate modules
    const lessons = await resolveYouTubeTitles(
      youtubeTitles.map(t => ({
        title: t.title,
        category: "education"
      })),
      youtubeTitles.length
    )
    modules.push({
      id: randId("mod"),
      title: `Learn ${skillLabel}`,
      description: `A comprehensive guide to ${skillLabel}`,
      lessons,
      isRequired: true
    })
  }

  const course: UserCourse = {
    id: randId("course"),
    source: "roadmap",
    title: `Roadmap: ${skillLabel}`,
    description: opts?.description || `Personalized roadmap for ${skillLabel}`,
    thumbnail: "/learning-roadmap-thumbnail.jpg",
    skills: [skillLabel],
    estimatedHours: Math.max(Math.ceil(modules.flatMap((m) => m.lessons).length * 0.5), 2),
    modules,
    createdAt: new Date().toISOString(),
    status: "enrolled",
    progress: 0,
    certificateIssued: false,
  }

  const courses = loadUserCourses()
  saveUserCourses([course, ...courses])
  return course
}

/**
 * Achievements / badges
 */
function loadBadges(): Badge[] {
  try {
    const s = localStorage.getItem(key("badges"))
    return s ? JSON.parse(s) : []
  } catch {
    return []
  }
}
function saveBadges(badges: Badge[]) {
  localStorage.setItem(key("badges"), JSON.stringify(badges))
}
export function getBadges(): Badge[] {
  return loadBadges()
}
export function addBadge(b: Badge) {
  const all = loadBadges()
  if (!all.find((x) => x.id === b.id)) {
    saveBadges([b, ...all])
  }
}
