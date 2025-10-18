'use client';

import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Loader2, CheckCircle, XCircle, Award } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { 
  Course, 
  Assessment,
  AssessmentResult,
  getAllCourses, 
  createCourseAssessment, 
  submitAssessment 
} from '@/lib/jobScoringService';

export function CourseAssessment({ courseId }: { courseId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [course, setCourse] = useState<Course | null>(null);
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [showBadgeAnimation, setShowBadgeAnimation] = useState(false);

  useEffect(() => {
    const loadCourse = () => {
      try {
        const allCourses = getAllCourses();
        const foundCourse = allCourses.find(c => c.id === courseId);
        
        if (!foundCourse) {
          setError('Course not found');
          setLoading(false);
          return;
        }
        
        setCourse(foundCourse);
        loadOrCreateAssessment();
      } catch (error) {
        console.error("Error loading course:", error);
        setError('Failed to load course information');
        setLoading(false);
      }
    };

    const loadOrCreateAssessment = async () => {
      try {
        setLoading(true);
        
        // Check if there's an existing incomplete assessment for this course
        const userProgress = JSON.parse(localStorage.getItem('userProgress') || '{"assessments":[]}');
        const existingAssessment = userProgress.assessments.find(
          (a: Assessment) => a.courseId === courseId && !a.completed
        );
        
        if (existingAssessment) {
          setAssessment(existingAssessment);
        } else {
          // Create a new assessment
          const newAssessment = await createCourseAssessment(courseId);
          setAssessment(newAssessment);
        }
      } catch (error) {
        const err = error as Error;
        setError(err.message || 'Failed to create assessment');
      } finally {
        setLoading(false);
      }
    };

    loadCourse();
  }, [courseId]);

  const handleAnswerChange = (questionIndex: number, answer: string) => {
    setAnswers({
      ...answers,
      [questionIndex]: answer
    });
  };

  const handleNext = () => {
    if (assessment && currentQuestion < assessment.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      
      // Check if assessment exists
      if (!assessment) {
        setError('No active assessment found');
        setSubmitting(false);
        return;
      }
      
      // Check if all questions are answered
      if (Object.keys(answers).length < assessment.questions.length) {
        alert('Please answer all questions before submitting');
        setSubmitting(false);
        return;
      }
      
      // Submit assessment
      const submissionResult = submitAssessment(courseId, answers);
      setResult(submissionResult);
      
      // Show badge animation if passed
      if (submissionResult.passed && submissionResult.badge) {
        setShowBadgeAnimation(true);
        
        // After a delay, redirect to badges page or hide animation
        setTimeout(() => {
          setShowBadgeAnimation(false);
        }, 5000);
      }
    } catch (error) {
      const err = error as Error;
      setError(err.message || 'Failed to submit assessment');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading assessment...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4 text-red-700">
        <p>Error: {error}</p>
        <Button 
          onClick={() => router.back()}
          variant="outline" 
          className="mt-4"
        >
          Go Back
        </Button>
      </div>
    );
  }

  if (result) {
    return (
      <div className="relative">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="flex items-center">
              Assessment Result
              {result.passed ? (
                <CheckCircle className="ml-2 text-green-500 h-5 w-5" />
              ) : (
                <XCircle className="ml-2 text-red-500 h-5 w-5" />
              )}
            </CardTitle>
            <CardDescription>
              {course?.title} Assessment
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b pb-2">
                <span>Score:</span>
                <span className="text-xl font-bold">{result.score}%</span>
              </div>
              <div className="flex items-center justify-between border-b pb-2">
                <span>Status:</span>
                <Badge className={result.passed ? "bg-green-500" : "bg-red-500"}>
                  {result.passed ? "Passed" : "Failed"}
                </Badge>
              </div>
              
              {result.passed && (
                <div className="bg-green-50 border border-green-200 rounded p-4">
                  <p className="text-green-700">
                    Congratulations! You&apos;ve earned a badge for completing this course.
                  </p>
                </div>
              )}
              
              {!result.passed && (
                <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
                  <p className="text-yellow-700">
                    You need a score of 70% or higher to pass. Review the course content and try again!
                  </p>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => router.back()}>
              Back to Courses
            </Button>
            {!result.passed && (
              <Button onClick={() => window.location.reload()}>
                Try Again
              </Button>
            )}
            {result.passed && (
              <Button onClick={() => router.push('/dashboard/badges')}>
                View My Badges
              </Button>
            )}
          </CardFooter>
        </Card>

        {/* Badge Animation Overlay */}
        {showBadgeAnimation && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 animate-fadein">
            <div className="text-center">
              <div className="animate-bounce-slow">
                <Award className="h-32 w-32 text-yellow-400 mx-auto" />
              </div>
              <h2 className="text-white text-2xl mt-6 font-bold">Congratulations!</h2>
              <p className="text-white text-xl mt-2">
                You&apos;ve earned the {result.badge?.title} badge!
              </p>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (!assessment || !assessment.questions || assessment.questions.length === 0) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 text-yellow-700">
        <p>No assessment questions are available for this course.</p>
        <Button 
          onClick={() => router.back()}
          variant="outline" 
          className="mt-4"
        >
          Go Back
        </Button>
      </div>
    );
  }

  const currentQuestionData = assessment.questions[currentQuestion];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{course?.title} Assessment</CardTitle>
        <CardDescription>
          Question {currentQuestion + 1} of {assessment.questions.length}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="font-medium text-lg mb-4">{currentQuestionData.question}</h3>
            <RadioGroup 
              value={answers[currentQuestion] || ''}
              onValueChange={(value) => handleAnswerChange(currentQuestion, value)}
            >
              {currentQuestionData.options.map((option: string, idx: number) => (
                <div key={idx} className="flex items-center space-x-2 border p-3 rounded-md mb-2 hover:bg-gray-50">
                  <RadioGroupItem value={option} id={`option-${idx}`} />
                  <Label className="flex-grow cursor-pointer" htmlFor={`option-${idx}`}>{option}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
        >
          Previous
        </Button>
        <div className="flex gap-2">
          {currentQuestion < assessment.questions.length - 1 ? (
            <Button onClick={handleNext} disabled={!answers[currentQuestion]}>
              Next
            </Button>
          ) : (
            <Button 
              onClick={handleSubmit} 
              disabled={submitting || !answers[currentQuestion]}
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Assessment'
              )}
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}

export default CourseAssessment;