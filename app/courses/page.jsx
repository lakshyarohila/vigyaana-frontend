'use client';

import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { fetcher } from '@/lib/queryFetch';
import CourseCard from '@/components/CourseCard';
import useAuthStore from '@/lib/store';
import {
  BookOpen,
  Search,
  Filter,
  Grid,
  List,
  Loader2,
  GraduationCap,
} from 'lucide-react';
import { useState } from 'react';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1 },
  }),
};

export default function CoursesPage() {
  const { user } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  const {
    data: courses = [],
    isLoading: isCoursesLoading,
    error: coursesError,
  } = useQuery({ 
    queryKey: ['/courses'], 
    queryFn: fetcher,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const {
    data: enrolled = [],
  } = useQuery({
    queryKey: ['/enrollments/my'],
    queryFn: fetcher,
    enabled: !!user && user.role === 'STUDENT',
  });

  const enrolledCourseIds = enrolled?.map((e) => e.course.id) || [];

  // Filter courses based on search term
  const filteredCourses = courses.filter(course =>
    course.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <section className="bg-gradient-to-br from-[#1c4645] via-[#2a5a58] to-[#1c4645] text-white">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="flex justify-center mb-6"
            >
              <div className="p-4 bg-white/10 backdrop-blur-sm rounded-full">
                <GraduationCap className="h-12 w-12 text-white" />
              </div>
            </motion.div>
            
            <motion.h1
              className="text-4xl md:text-5xl font-bold mb-4"
              initial="hidden"
              animate="visible"
              variants={fadeUp}
            >
              All Courses
            </motion.h1>
            
            <motion.p
              className="text-xl text-gray-200 max-w-2xl mx-auto mb-8"
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={1}
            >
              Discover our complete collection of courses and start your learning journey today
            </motion.p>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1c4645] focus:border-transparent"
              />
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-[#1c4645] text-white'
                    : 'text-gray-600 hover:text-[#1c4645]'
                }`}
              >
                <Grid className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'list'
                    ? 'bg-[#1c4645] text-white'
                    : 'text-gray-600 hover:text-[#1c4645]'
                }`}
              >
                <List className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 text-gray-600">
            {searchTerm && (
              <p>
                {filteredCourses.length} course{filteredCourses.length !== 1 ? 's' : ''} found
                {searchTerm && <span> for "{searchTerm}"</span>}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Courses Grid/List Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          {isCoursesLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="h-12 w-12 text-[#1c4645] animate-spin mb-4" />
              <p className="text-xl text-gray-600">Loading courses...</p>
            </div>
          ) : coursesError ? (
            <div className="text-center py-20">
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg max-w-md mx-auto">
                <p className="text-red-700">Error loading courses. Please try again later.</p>
              </div>
            </div>
          ) : filteredCourses.length === 0 ? (
            <div className="text-center py-20">
              <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-gray-700 mb-2">
                {searchTerm ? 'No courses found' : 'No courses available'}
              </h3>
              <p className="text-gray-500">
                {searchTerm 
                  ? 'Try adjusting your search terms or browse all courses.' 
                  : 'Check back later for new courses.'}
              </p>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="mt-4 px-6 py-2 bg-[#1c4645] text-white rounded-lg hover:bg-[#2a5a58] transition-colors"
                >
                  Clear Search
                </button>
              )}
            </div>
          ) : (
            <div className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                : 'grid-cols-1'
            }`}>
              {filteredCourses.map((course, index) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={viewMode === 'list' ? 'max-w-4xl mx-auto' : ''}
                >
                  <CourseCard 
                    course={course} 
                    isEnrolled={enrolledCourseIds.includes(course.id)}
                    viewMode={viewMode}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Bottom CTA Section */}
      {!isCoursesLoading && filteredCourses.length > 0 && (
        <section className="bg-[#1c4645] text-white py-16">
          <div className="max-w-4xl mx-auto text-center px-4">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Start Learning?
              </h2>
              <p className="text-xl text-gray-200 mb-8">
                Join thousands of students already learning with our expert instructors.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {!user && (
                  <a
                    href="/register"
                    className="inline-flex items-center justify-center px-8 py-4 bg-white text-[#1c4645] font-semibold rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <GraduationCap className="h-5 w-5 mr-2" />
                    Sign Up Free
                  </a>
                )}
                <a
                  href="#top"
                  className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-[#1c4645] transition-colors"
                >
                  Back to Top
                </a>
              </div>
            </motion.div>
          </div>
        </section>
      )}
    </div>
  );
}