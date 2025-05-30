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
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-6 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-teal-900 mb-2">Admin Panel</h1>
            <div className="w-20 h-1 bg-teal-700 rounded"></div>
          </div>

          {courses.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 bg-teal-50 rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-teal-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <p className="text-xl text-teal-800 font-medium">No courses found</p>
              <p className="text-teal-600 mt-2">Courses will appear here once they are created</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
              {courses.map((course) => (
                <div key={course.id} className="bg-white border-2 border-teal-100 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                  <div className="relative">
                    <img 
                      src={course.thumbnailUrl} 
                      className="h-48 w-full object-cover"
                      alt={course.title}
                    />
                    <div className="absolute top-4 right-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        course.status === 'PUBLISHED' 
                          ? 'bg-teal-700 text-white' 
                          : 'bg-white text-teal-800 border-2 border-teal-700'
                      }`}>
                        {course.status}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h2 className="text-xl font-bold text-teal-900 mb-3 line-clamp-2 min-h-[3.5rem]">
                      {course.title}
                    </h2>
                    
                    <div className="flex items-center mb-4">
                      <div className="w-8 h-8 bg-teal-700 rounded-full flex items-center justify-center mr-3">
                        <span className="text-white text-sm font-semibold">
                          {course.createdBy?.name?.charAt(0) || 'U'}
                        </span>
                      </div>
                      <p className="text-teal-700 font-medium">
                        {course.createdBy?.name || 'Unknown Author'}
                      </p>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 pt-4 border-t border-teal-100">
                      {course.status === 'DRAFT' && (
                        <button
                          onClick={() => handleStatusChange(course.id, 'PUBLISHED')}
                          className="flex-1 bg-teal-700 hover:bg-teal-800 text-white px-4 py-2 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center gap-2"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Approve
                        </button>
                      )}
                      
                      {course.status === 'PUBLISHED' && (
                        <button
                          onClick={() => handleStatusChange(course.id, 'DRAFT')}
                          className="flex-1 bg-white hover:bg-teal-50 text-teal-700 px-4 py-2 rounded-lg font-semibold border-2 border-teal-700 transition-colors duration-200 flex items-center justify-center gap-2"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Unpublish
                        </button>
                      )}
                      
                      <button
                        onClick={() => handleDelete(course.id)}
                        className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg font-semibold border-2 border-red-200 hover:border-red-300 transition-colors duration-200 flex items-center justify-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete
                      </button>
                    </div>
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