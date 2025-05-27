'use client';

import { useEffect, useState } from 'react';
import { getRequest } from '@/lib/api';
import useAuthStore from '@/lib/store';
import Link from 'next/link';
import ProtectedRoute from '@/compoenets/ProtectedRoute';

export default function DashboardPage() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    getRequest('/enrollments/my')
      .then(setCourses)
      .catch(() => console.log('Failed to fetch enrolled courses'));
  }, []);

  return (
    <ProtectedRoute allowedRoles={['STUDENT']}>
      <div>
        <h1 className="text-2xl font-bold mb-4">My Enrolled Courses</h1>

        {courses.length === 0 ? (
          <p>You haven't enrolled in any courses yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {courses.map(({ course, progress, completed }) => (
              <div key={course.id} className="border p-4 rounded shadow">
                <img src={course.thumbnailUrl} className="w-full h-40 object-cover rounded" />
                <h2 className="text-xl font-bold mt-2">{course.title}</h2>
                <p className="text-sm text-gray-600 mt-1">{progress}% completed</p>
                <Link href={`/dashboard/course/${course.id}`} className="text-blue-600 mt-2 block">Continue</Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
