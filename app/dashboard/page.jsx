'use client';

import { useQuery } from '@tanstack/react-query';
import { fetcher } from '@/lib/queryFetch';
import useAuthStore from '@/lib/store';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/compoenets/ProtectedRoute';
import { BookOpen, Play, CheckCircle, Clock, TrendingUp } from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const router = useRouter();

  const {
    data: enrollments = [],
    isLoading,
  } = useQuery({
    queryKey: ['/enrollments/my'],
    queryFn: fetcher,
    enabled: !!user,
  });

  const totalCourses = enrollments.length;
  const completedCourses = enrollments.filter((e) => e.completed).length;
  const averageProgress =
    enrollments.length > 0
      ? Math.round(
          enrollments.reduce((sum, e) => sum + e.progress, 0) /
            enrollments.length
        )
      : 0;

  const handleCourseClick = (course) => {
    if (course.type === 'LIVE') {
      router.push(`/instructor/live-course/${course.id}`);
    } else {
      router.push(`/dashboard/course/${course.id}`);
    }
  };

  if (isLoading) {
    return (
      <ProtectedRoute allowedRoles={['STUDENT']}>
        <div className="min-h-screen bg-white p-6">
          <div className="max-w-7xl mx-auto animate-pulse">
            Loading...
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute allowedRoles={['STUDENT']}>
      <div className="min-h-screen bg-white">
        <div className="bg-gradient-to-r from-[#1c4645] to-[#2a5a58] text-white py-8 px-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
              <BookOpen className="h-8 w-8" />
              My Learning Dashboard
            </h1>
            <p className="text-blue-100">Continue your learning journey</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto p-6">
          {enrollments.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Stats cards here */}
            </div>
          )}

          <div className="mb-6">
            <h2 className="text-2xl font-bold text-[#1c4645] mb-4 flex items-center gap-2">
              <BookOpen className="h-6 w-6" />
              My Enrolled Courses
            </h2>
          </div>

          {enrollments.length === 0 ? (
            <div className="text-center py-12">No courses enrolled.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {enrollments.map((enrollment) => {
                const { course, progress, completed } = enrollment;
                const courseType = course?.type || 'RECORDED'; // default fallback

                return (
                  <div
                    key={course.id}
                    onClick={() => handleCourseClick(course)}
                    className="cursor-pointer bg-white border-2 border-gray-100 rounded-lg shadow-sm hover:shadow-md hover:border-[#1c4645] transition-all duration-200 overflow-hidden"
                  >
                    <div className="relative">
                      <img
                        src={course.thumbnailUrl}
                        alt={course.title}
                        className="w-full h-48 object-cover"
                      />
                      {completed && (
                        <div className="absolute top-3 right-3 bg-green-500 text-white p-2 rounded-full">
                          <CheckCircle className="h-5 w-5" />
                        </div>
                      )}
                      {progress > 0 && !completed && (
                        <div className="absolute top-3 right-3 bg-[#1c4645] text-white px-3 py-1 rounded-full text-sm font-medium">
                          {progress}%
                        </div>
                      )}
                    </div>

                    <div className="p-6">
                      <h3 className="text-xl font-bold text-[#1c4645] mb-3">
                        {course.title}
                      </h3>

                      <div className="bg-[#1c4645] text-white px-4 py-2 rounded-lg text-center font-medium">
                        {completed
                          ? 'Review Course'
                          : courseType === 'LIVE'
                          ? 'View Live Details'
                          : 'Continue Learning'}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
