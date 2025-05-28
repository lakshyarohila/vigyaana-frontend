'use client';

import { useEffect, useState } from 'react';
import { getRequest, postRequest } from '@/lib/api';
import toast from 'react-hot-toast';
import ProtectedRoute from '@/compoenets/ProtectedRoute';
import Link from 'next/link';

export default function InstructorDashboard() {
  const [courses, setCourses] = useState([]);

  const fetchCourses = () => {
    getRequest('/courses/mine')
      .then(setCourses)
      .catch(() => toast.error('Failed to load courses'));
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Are you sure?')) return;
    try {
      await fetch(`http://localhost:5000/api/courses/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      toast.success('Deleted');
      fetchCourses();
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  return (
    <ProtectedRoute allowedRoles={['INSTRUCTOR']}>
      <div>
        <h1 className="text-2xl font-bold mb-4">My Courses</h1>
        <Link href="/instructor/create" className="bg-blue-600 text-white px-4 py-2 rounded mb-6 inline-block">
          + New Course
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {courses.map((course) => (
            <div key={course.id} className="border p-4 rounded shadow">
              <img src={course.thumbnailUrl} className="h-32 w-full object-cover rounded" />
              <h2 className="font-bold mt-2">{course.title}</h2>
              <p>Status: <b>{course.status}</b></p>
              <Link href={`/instructor/${course.id}/add-section`} className="text-blue-600 mt-2 block">
                + Add Section
              </Link>
              <button
                onClick={() => handleDelete(course.id)}
                className="bg-red-600 text-white px-3 py-1 rounded mt-2"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </ProtectedRoute>
  );
}
