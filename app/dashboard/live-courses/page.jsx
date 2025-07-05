'use client';

import { useQuery } from '@tanstack/react-query';
import { fetcher } from '@/lib/queryFetch';
import useAuthStore from '@/lib/store';
import ProtectedRoute from '@/compoenets/ProtectedRoute';
import Link from 'next/link';
import {
  Video,
  CheckCircle,
  ExternalLink,
} from 'lucide-react';

export default function LiveCoursesPage() {
  const { user } = useAuthStore();

  const {
    data: courses = [],
    isLoading,
  } = useQuery({
    queryKey: ['/enrollments/my'],
    queryFn: fetcher,
    enabled: !!user,
  });

  const liveCourses = courses.filter(({ course }) => course.type === 'LIVE');

  if (isLoading) {
    return (
      <ProtectedRoute allowedRoles={['STUDENT']}>
        <div className="min-h-screen bg-white p-6">
          <div className="max-w-7xl mx-auto animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2].map((i) => (
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
        <div className="bg-gradient-to-r from-green-700 to-green-800 text-white py-8 px-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Video className="h-8 w-8" />
              My Live Courses
            </h1>
            <p className="text-green-100">Access your enrolled live classes and groups</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto p-6">
          {liveCourses.length === 0 ? (
            <div className="text-center py-12">
              <Video className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg mb-4">
                You haven't enrolled in any live courses yet.
              </p>
              <Link
                href="/courses"
                className="bg-green-700 text-white px-6 py-3 rounded-lg hover:bg-green-800 transition-colors inline-flex items-center gap-2 font-medium"
              >
                <Video className="h-5 w-5" />
                Browse Live Courses
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {liveCourses.map(({ course }) => (
                <div
                  key={course.id}
                  className="bg-white border-2 border-gray-100 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
                >
                  <div className="relative">
                    <img
                      src={course.thumbnailUrl}
                      alt={course.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-3 right-3 bg-green-600 text-white p-2 rounded-full">
                      <CheckCircle className="h-5 w-5" />
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold text-green-700 mb-3">
                      {course.title}
                    </h3>

                    <p className="text-gray-700 mb-4">
                      Access your WhatsApp group for live updates and classes.
                    </p>

                    <a
                      href={course.whatsappGroupLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-800 transition-colors flex items-center justify-center gap-2 w-full font-medium"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Join WhatsApp Group
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
