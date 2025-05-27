'use client';

import { useEffect, useState } from 'react';
import { getRequest } from '@/lib/api';
import toast from 'react-hot-toast';
import ProtectedRoute from '@/compoenets/ProtectedRoute';

export default function AdminPage() {
  const [courses, setCourses] = useState([]);

  const fetchCourses = () => {
  getRequest('/admin/courses')
      .then(setCourses)
      .catch(() => toast.error('Failed to load courses'));
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await fetch(`http://localhost:5000/api/courses/${id}/status`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });
      toast.success('Course status updated');
      fetchCourses();
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

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
    <ProtectedRoute allowedRoles={['ADMIN']}>
      <div>
        <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>

        {courses.length === 0 ? (
          <p>No courses found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {courses.map((course) => (
              <div key={course.id} className="border p-4 rounded shadow">
                <img src={course.thumbnailUrl} className="h-32 w-full object-cover rounded" />
                <h2 className="font-bold mt-2">{course.title}</h2>
                <p className="text-sm text-gray-600">By: {course.createdBy?.name}</p>
                <p>Status: <b>{course.status}</b></p>
                <div className="flex gap-2 mt-2">
                  {course.status === 'DRAFT' && (
                    <button
                      onClick={() => handleStatusChange(course.id, 'PUBLISHED')}
                      className="bg-green-600 text-white px-3 py-1 rounded"
                    >
                      Approve
                    </button>
                  )}
                  {course.status === 'PUBLISHED' && (
                    <button
                      onClick={() => handleStatusChange(course.id, 'DRAFT')}
                      className="bg-yellow-500 text-white px-3 py-1 rounded"
                    >
                      Unpublish
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(course.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
