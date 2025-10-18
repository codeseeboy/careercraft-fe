'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Award, ArrowLeft } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { getUserBadges, getAllCourses } from '../../../lib/jobScoringService';
import { useRouter } from 'next/navigation';

interface Course {
  id: string;
  title: string;
  skills: string[];
  completed: boolean;
  level: string;
}

interface UserBadge {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  earnedAt: number;
  courseId: string;
}

export default function BadgesPage() {
  const router = useRouter();
  const [badges, setBadges] = useState<UserBadge[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    setBadges(getUserBadges());
    setCourses(getAllCourses());
  }, []);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="container max-w-5xl py-6">
      <div className="flex items-center mb-8">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="mr-4">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">My Badges</h1>
          <p className="text-gray-500">Your achievements and recognitions</p>
        </div>
      </div>

      {badges.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <Award className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">You haven&apos;t earned any badges yet</p>
              <p className="text-sm text-gray-400 mt-2">Complete courses and pass assessments to earn badges</p>
              <Button 
                onClick={() => router.push('/dashboard/assessments')}
                variant="outline" 
                className="mt-4"
              >
                View Available Courses
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {badges.map((badge) => {
            const course = courses.find(c => c.id === badge.courseId);
            return (
              <Card key={badge.id} className="overflow-hidden">
                <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 h-2"></div>
                <CardHeader>
                  <div className="flex flex-col items-center text-center">
                    <div className="bg-yellow-50 p-6 rounded-full mb-4">
                      <Award className="h-12 w-12 text-yellow-500" />
                    </div>
                    <CardTitle>{badge.title}</CardTitle>
                    <CardDescription>Earned on {formatDate(badge.earnedAt)}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-center mb-4">{badge.description}</p>
                  <div className="flex justify-center">
                    <Badge variant="secondary">{course?.title || 'Unknown Course'}</Badge>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}