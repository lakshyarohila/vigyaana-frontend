'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getRequest } from '@/lib/api';
import ProtectedRoute from '@/compoenets/ProtectedRoute';
import { BookOpen, Link as LinkIcon } from 'lucide-react';

export default function LiveCoursePage() {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const courses = await getRequest('/courses/mine');
        const found = courses.find(c => c.id === courseId);
        setCourse(found);
      } catch (err) {
        console.error('Failed to load course:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [courseId]);

  if (loading) {
    return (
      <ProtectedRoute allowedRoles={['INSTRUCTOR']}>
        <div className="min-h-screen bg-white flex items-center justify-center">
          <BookOpen className="h-8 w-8 text-gray-500 animate-spin" />
          <p className="ml-2 text-gray-500">Loading course...</p>
        </div>
      </ProtectedRoute>
    );
  }

  if (!course) {
    return (
      <ProtectedRoute allowedRoles={['INSTRUCTOR']}>
        <div className="min-h-screen bg-white flex items-center justify-center">
          <p className="text-gray-500">Course not found.</p>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute allowedRoles={['INSTRUCTOR']}>
      <div className="min-h-screen bg-white">
        <div className="max-w-3xl mx-auto py-10 px-4">
          <h1 className="text-3xl font-bold mb-6 text-[#1c4645] flex items-center gap-3">
            <BookOpen className="h-8 w-8" />
            Live Course Details
          </h1>

          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 space-y-4">
            <h2 className="text-2xl font-semibold text-[#1c4645]">{course.title}</h2>
            <p className="text-gray-700">{course.description}</p>

            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-800 mb-2">WhatsApp Group Link</h3>
              {course.whatsappGroupLink ? (
                <a
                  href={course.whatsappGroupLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-green-600 font-medium hover:underline"
                >
                  <LinkIcon className="h-4 w-4" />
                  {course.whatsappGroupLink}
                </a>
              ) : (
                <p className="text-gray-500">No WhatsApp group link added for this course.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
