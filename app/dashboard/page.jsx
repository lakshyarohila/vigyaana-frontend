'use client';

import { useQuery } from '@tanstack/react-query';
import { fetcher } from '@/lib/queryFetch';
import useAuthStore from '@/lib/store';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/compoenets/ProtectedRoute';
import {
  BookOpen,
  Play,
  CheckCircle,
  Clock,
  TrendingUp,
} from 'lucide-react';

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

  // 🐞 Debug data structure
  console.log('Enrolled courses data:', enrollments);

  const totalCourses = enrollments.length;
  const completedCourses = enrollments.filter((e) => e.completed).length;
  const averageProgress =
    enrollments.length > 0
      ? Math.round(
          enrollments.reduce((sum, e) => sum + e.progress, 0) / enrollments.length
        )
      : 0;

  const handleCourseClick = (enrollment) => {
    const course = enrollment.course;
    const courseType = course?.type || 'RECORDED';

    if (courseType === 'LIVE') {
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
            <div className="h-8 bg-gray-200 rounded w-64 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-80 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute allowedRoles={['STUDENT']}>
      <div className="min-h-screen bg-white">
        {/* Header */}
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
          {/* Stats Cards */}
          {enrollments.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white border-2 border-[#1c4645] rounded-lg p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Courses</p>
                    <p className="text-2xl font-bold text-[#1c4645]">{totalCourses}</p>
                  </div>
                  <BookOpen className="h-8 w-8 text-[#1c4645]" />
                </div>
              </div>

              <div className="bg-white border-2 border-[#1c4645] rounded-lg p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Completed</p>
                    <p className="text-2xl font-bold text-[#1c4645]">{completedCourses}</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-[#1c4645]" />
                </div>
              </div>

              <div className="bg-white border-2 border-[#1c4645] rounded-lg p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Avg. Progress</p>
                    <p className="text-2xl font-bold text-[#1c4645]">{averageProgress}%</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-[#1c4645]" />
                </div>
              </div>
            </div>
          )}

          {/* Enrolled Courses */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-[#1c4645] mb-4 flex items-center gap-2">
              <BookOpen className="h-6 w-6" />
              My Enrolled Courses
            </h2>
          </div>

          {enrollments.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg mb-4">
                You haven't enrolled in any courses yet.
              </p>
              <button className="bg-[#1c4645] text-white px-6 py-3 rounded-lg hover:bg-[#2a5a58] transition-colors flex items-center gap-2 mx-auto">
                <BookOpen className="h-5 w-5" />
                Browse Courses
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {enrollments.map((enrollment) => {
                const { course, progress, completed } = enrollment;
                const courseType = course?.type || 'RECORDED';

                return (
                  <div
                    key={course.id}
                    onClick={() => handleCourseClick(enrollment)}
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

                      {/* Progress Bar */}
                      <div className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-gray-700 flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            Progress
                          </span>
                          <span className="text-sm font-bold text-[#1c4645]">
                            {progress}% completed
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-[#1c4645] h-2 rounded-full transition-all duration-300"
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                      </div>

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
