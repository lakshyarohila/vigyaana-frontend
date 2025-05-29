'use client';

import { useEffect, useState } from 'react';
import { getRequest, postRequest } from '@/lib/api';
import toast from 'react-hot-toast';
import ProtectedRoute from '@/compoenets/ProtectedRoute';
import Link from 'next/link';
import { BookOpen, Plus, Settings, Trash2, Eye, Users, BarChart3, CheckCircle, Clock, AlertCircle } from 'lucide-react';

export default function InstructorDashboard() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCourses = () => {
    setLoading(true);
    getRequest('/courses/mine')
      .then((data) => {
        setCourses(data);
        setLoading(false);
      })
      .catch(() => {
        toast.error('Failed to load courses');
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this course? This action cannot be undone.')) return;
    try {
      await fetch(`http://localhost:5000/api/courses/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      toast.success('Course deleted successfully');
      fetchCourses();
    } catch (err) {
      toast.error('Failed to delete course');
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'published':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'draft':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'pending':
        return <AlertCircle className="h-4 w-4 text-orange-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'published':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'draft':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'pending':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  if (loading) {
    return (
      <ProtectedRoute allowedRoles={['INSTRUCTOR']}>
        <div className="min-h-screen bg-white p-6">
          <div className="max-w-7xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-64 mb-8"></div>
              <div className="h-12 bg-gray-200 rounded w-40 mb-6"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="h-80 bg-gray-200 rounded-lg"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute allowedRoles={['INSTRUCTOR']}>
      <div className="min-h-screen bg-white">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#1c4645] to-[#2a5a58] text-white py-8 px-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
              <BookOpen className="h-8 w-8" />
              Instructor Dashboard
            </h1>
            <p className="text-blue-100">Manage and create your courses</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto p-6">
          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white border-2 border-[#1c4645] rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Courses</p>
                  <p className="text-2xl font-bold text-[#1c4645]">{courses.length}</p>
                </div>
                <BookOpen className="h-8 w-8 text-[#1c4645]" />
              </div>
            </div>

            <div className="bg-white border-2 border-[#1c4645] rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Published</p>
                  <p className="text-2xl font-bold text-[#1c4645]">
                    {courses.filter(c => c.status?.toLowerCase() === 'published').length}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-[#1c4645]" />
              </div>
            </div>

            <div className="bg-white border-2 border-[#1c4645] rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Draft</p>
                  <p className="text-2xl font-bold text-[#1c4645]">
                    {courses.filter(c => c.status?.toLowerCase() === 'draft').length}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-[#1c4645]" />
              </div>
            </div>

            <div className="bg-white border-2 border-[#1c4645] rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Students</p>
                  <p className="text-2xl font-bold text-[#1c4645]">
                    {courses.reduce((sum, course) => sum + (course.enrolledCount || 0), 0)}
                  </p>
                </div>
                <Users className="h-8 w-8 text-[#1c4645]" />
              </div>
            </div>
          </div>

          {/* Action Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h2 className="text-2xl font-bold text-[#1c4645] flex items-center gap-2">
              <BookOpen className="h-6 w-6" />
              My Courses
            </h2>
            <Link 
              href="/instructor/create" 
              className="bg-[#1c4645] text-white px-6 py-3 rounded-lg hover:bg-[#2a5a58] transition-colors flex items-center gap-2 font-medium shadow-sm"
            >
              <Plus className="h-5 w-5" />
              Create New Course
            </Link>
          </div>

          {/* Courses Grid */}
          {courses.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg mb-4">You haven't created any courses yet.</p>
              <Link 
                href="/instructor/create"
                className="bg-[#1c4645] text-white px-6 py-3 rounded-lg hover:bg-[#2a5a58] transition-colors inline-flex items-center gap-2"
              >
                <Plus className="h-5 w-5" />
                Create Your First Course
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <div key={course.id} className="bg-white border-2 border-gray-100 rounded-lg shadow-sm hover:shadow-md hover:border-[#1c4645] transition-all duration-200 overflow-hidden">
                  <div className="relative">
                    <img 
                      src={course.thumbnailUrl} 
                      alt={course.title}
                      className="w-full h-48 object-cover" 
                    />
                    <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(course.status)} flex items-center gap-1`}>
                      {getStatusIcon(course.status)}
                      {course.status || 'Draft'}
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-[#1c4645] mb-3 line-clamp-2">{course.title}</h3>
                    
                    {/* Course Stats */}
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{course.enrolledCount || 0} students</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <BarChart3 className="h-4 w-4" />
                        <span>{course.sectionsCount || 0} sections</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-2">
                      <Link 
                        href={`/instructor/${course.id}/add-section`} 
                        className="w-full bg-[#1c4645] text-white px-4 py-2 rounded-lg hover:bg-[#2a5a58] transition-colors flex items-center justify-center gap-2 font-medium"
                      >
                        <Plus className="h-4 w-4" />
                        Add Section
                      </Link>
                      
                      <div className="flex gap-2">
                        <button className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 text-sm">
                          <Eye className="h-4 w-4" />
                          Preview
                        </button>
                        
                        <button className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 text-sm">
                          <Settings className="h-4 w-4" />
                          Edit
                        </button>
                        
                        <button
                          onClick={() => handleDelete(course.id)}
                          className="bg-red-50 text-red-600 px-3 py-2 rounded-lg hover:bg-red-100 transition-colors flex items-center justify-center gap-1 text-sm border border-red-200"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
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