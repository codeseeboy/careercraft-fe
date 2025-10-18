'use client';

// Define types for our skill assessment system
export interface Course {
  id: string;
  title: string;
  skills: string[];
  completed: boolean;
  level: 'beginner' | 'intermediate' | 'advanced';
}

export interface AssessmentQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  userAnswer?: string;
}

export interface Assessment {
  courseId: string;
  questions: AssessmentQuestion[];
  completed: boolean;
  score?: number;
  passed: boolean;
  timestamp?: number;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  earnedAt: number;
  courseId: string;
}

export interface UserProgress {
  courses: Course[];
  assessments: Assessment[];
  badges: Badge[];
}

export interface AssessmentResult {
  passed: boolean;
  score: number;
  badge?: Badge;
}

// Function to create typed API responses
interface ApiResponse<T> {
  assessment: T[];
}

/**
 * Retrieves user progress from local storage
 */
const getUserProgress = (): UserProgress => {
  if (typeof window !== 'undefined') {
    const storedProgress = localStorage.getItem('userProgress');
    if (storedProgress) {
      return JSON.parse(storedProgress);
    }
  }
  
  return {
    courses: [],
    assessments: [],
    badges: []
  };
};

/**
 * Saves user progress to local storage
 */
const saveUserProgress = (progress: UserProgress): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('userProgress', JSON.stringify(progress));
  }
};

/**
 * Retrieves completed courses
 */
export const getCompletedCourses = (): Course[] => {
  const userProgress = getUserProgress();
  return userProgress.courses.filter(course => course.completed);
};

/**
 * Creates an assessment for a specific course
 */
export const createCourseAssessment = async (courseId: string): Promise<Assessment> => {
  const userProgress = getUserProgress();
  const course = userProgress.courses.find(c => c.id === courseId);
  
  if (!course) {
    throw new Error('Course not found');
  }
  
  try {
    // Create assessment using the API
    const topic = course.title + ' with focus on ' + course.skills.join(', ');
    const response = await fetch(`http://localhost:5000/api/career/create-assessment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        topic,
        level: course.level || 'intermediate',
        questionCount: 5
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create assessment');
    }
    
    const result = await response.json() as ApiResponse<AssessmentQuestion>;
    
    const assessment: Assessment = {
      courseId,
      questions: result.assessment.map(q => ({
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
      })),
      completed: false,
      passed: false
    };
    
    // Save the assessment in progress
    userProgress.assessments.push(assessment);
    saveUserProgress(userProgress);
    
    return assessment;
  } catch (error: unknown) {
    const err = error as Error;
    console.error('Error creating assessment:', err);
    throw err;
  }
};

/**
 * Submits user answers for an assessment
 */
export const submitAssessment = (courseId: string, answers: { [questionIndex: number]: string }): AssessmentResult => {
  const userProgress = getUserProgress();
  const assessmentIndex = userProgress.assessments.findIndex(a => a.courseId === courseId && !a.completed);
  
  if (assessmentIndex === -1) {
    throw new Error('Assessment not found');
  }
  
  const assessment = userProgress.assessments[assessmentIndex];
  const totalQuestions = assessment.questions.length;
  let correctAnswers = 0;
  
  // Calculate score
  assessment.questions.forEach((question, index) => {
    const userAnswer = answers[index];
    question.userAnswer = userAnswer;
    
    if (userAnswer === question.correctAnswer) {
      correctAnswers++;
    }
  });
  
  const score = Math.round((correctAnswers / totalQuestions) * 100);
  const passed = score >= 70; // 70% to pass
  
  // Update assessment
  assessment.completed = true;
  assessment.score = score;
  assessment.passed = passed;
  assessment.timestamp = Date.now();
  userProgress.assessments[assessmentIndex] = assessment;
  
  // If passed, create and award badge
  let badge: Badge | undefined;
  if (passed) {
    const course = userProgress.courses.find(c => c.id === courseId);
    if (course) {
      badge = {
        id: `badge-${courseId}-${Date.now()}`,
        title: `${course.title} Expert`,
        description: `Successfully completed assessment for ${course.title}`,
        earnedAt: Date.now(),
        courseId: courseId
      };
      
      userProgress.badges.push(badge);
    }
  }
  
  saveUserProgress(userProgress);
  
  return {
    passed,
    score,
    badge
  };
};

/**
 * Retrieves all earned badges
 */
export const getUserBadges = (): Badge[] => {
  const userProgress = getUserProgress();
  return userProgress.badges;
};

/**
 * Retrieves assessment history
 */
export interface StoredAssessment {
  courseId?: string;
  questions?: AssessmentQuestion[];
  completed: boolean;
  score: number;
  passed: boolean;
  timestamp?: number;
  // Legacy fields
  topic?: string;
  date?: string;
}

export const getAssessmentHistory = (): StoredAssessment[] => {
  const userProgress = getUserProgress();
  // Convert Assessment to StoredAssessment, ensuring score is defined
  return userProgress.assessments.filter(a => a.completed).map(a => ({
    ...a,
    score: a.score || 0 // Ensure score is not undefined
  }));
};

/**
 * Adds a new course to user progress
 */
export const addCourse = (course: Omit<Course, 'completed'>): Course => {
  const userProgress = getUserProgress();
  
  const newCourse: Course = {
    ...course,
    completed: false
  };
  
  userProgress.courses.push(newCourse);
  saveUserProgress(userProgress);
  
  return newCourse;
};

/**
 * Marks a course as completed
 */
export const markCourseCompleted = (courseId: string): Course => {
  const userProgress = getUserProgress();
  const courseIndex = userProgress.courses.findIndex(c => c.id === courseId);
  
  if (courseIndex === -1) {
    throw new Error('Course not found');
  }
  
  userProgress.courses[courseIndex].completed = true;
  saveUserProgress(userProgress);
  
  return userProgress.courses[courseIndex];
};

/**
 * Gets all courses (both completed and in-progress)
 */
export const getAllCourses = (): Course[] => {
  const userProgress = getUserProgress();
  return userProgress.courses;
};

/**
 * Initializes default courses if none exist
 */
export const initializeDefaultCourses = (): void => {
  const userProgress = getUserProgress();
  
  // Only initialize if there are no courses
  if (userProgress.courses.length === 0) {
    const defaultCourses: Course[] = [
      {
        id: 'course-1',
        title: 'JavaScript Fundamentals',
        skills: ['Variables', 'Functions', 'Objects', 'Arrays', 'DOM Manipulation'],
        completed: true,
        level: 'beginner'
      },
      {
        id: 'course-2',
        title: 'React Basics',
        skills: ['Components', 'Props', 'State', 'Hooks', 'JSX'],
        completed: true,
        level: 'intermediate'
      },
      {
        id: 'course-3',
        title: 'Data Structures',
        skills: ['Arrays', 'Linked Lists', 'Trees', 'Hash Tables', 'Algorithms'],
        completed: true,
        level: 'advanced'
      },
      {
        id: 'course-4',
        title: 'Algorithm Design',
        skills: ['Sorting', 'Searching', 'Dynamic Programming', 'Graph Algorithms'],
        completed: false,
        level: 'advanced'
      }
    ];
    
    // Add default assessments for completed courses
    const defaultAssessments: Assessment[] = [
      // Data Structures assessment
      {
        courseId: 'course-3',
        questions: [
          {
            question: 'What is the time complexity of searching an element in a Binary Search Tree in the worst case?',
            options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
            correctAnswer: 'O(n)'
          },
          {
            question: 'Which data structure uses LIFO (Last In First Out) principle?',
            options: ['Queue', 'Stack', 'Linked List', 'Tree'],
            correctAnswer: 'Stack'
          },
          {
            question: 'What is the primary advantage of a hash table?',
            options: ['O(1) search time on average', 'Memory efficiency', 'Ordered data storage', 'Simplicity of implementation'],
            correctAnswer: 'O(1) search time on average'
          },
          {
            question: 'Which of the following is NOT a linear data structure?',
            options: ['Array', 'Linked List', 'Queue', 'Tree'],
            correctAnswer: 'Tree'
          },
          {
            question: 'What is the space complexity of a recursive algorithm with maximum recursion depth n?',
            options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
            correctAnswer: 'O(n)'
          }
        ],
        completed: false,
        passed: false
      }
    ];
    
    userProgress.courses = defaultCourses;
    userProgress.assessments = defaultAssessments;
    
    // Add default badges
    const defaultBadges: Badge[] = [
      {
        id: 'badge-1',
        title: 'JavaScript Master',
        description: 'Completed the JavaScript Fundamentals course',
        earnedAt: Date.now() - 1000000,
        courseId: 'course-1'
      },
      {
        id: 'badge-2',
        title: 'React Developer',
        description: 'Completed the React Basics course',
        earnedAt: Date.now() - 500000,
        courseId: 'course-2'
      }
    ];
    
    userProgress.badges = defaultBadges;
    saveUserProgress(userProgress);
  }
};