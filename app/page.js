'use client';

import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { fetcher } from '@/lib/queryFetch';
import CourseCard from '@/compoenets/CourseCard';
import Link from 'next/link';
import useAuthStore from '@/lib/store';
import {
  BookOpen,
  Users,
  Trophy,
  ArrowRight,
  Star,
  Globe,
  Zap,
  Award,
  CheckCircle,
} from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.2 },
  }),
};

export default function HomePage() {
  const { user } = useAuthStore();

  const {
    data: courses = [],
    isLoading: isCoursesLoading,
  } = useQuery({ queryKey: ['/courses'], queryFn: fetcher });

  const {
    data: enrolled = [],
  } = useQuery({
    queryKey: ['/enrollments/my'],
    queryFn: fetcher,
    enabled: !!user && user.role === 'STUDENT',
  });

  const enrolledCourseIds = enrolled?.map((e) => e.course.id) || [];

  return (
    <div className="min-h-screen">
      {/* ✅ Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#1c4645] via-[#2a5a58] to-[#1c4645] text-white">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-20 sm:py-24 lg:py-32">
          <div className="text-center">
            <motion.div
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 2.6, repeat: Infinity, repeatType: 'loop', ease: 'easeInOut' }}
              style={{ display: 'inline-block' }}
              className="flex justify-center mb-6"
            >
              <div className="p-4 bg-[#e17100] rounded-full">
                <BookOpen className="h-12 w-14 text-white" />
              </div>
            </motion.div>
            <motion.h1
              className="text-4xl md:text-6xl font-bold mb-6 leading-tight"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
            >
              Learn Anything. <br />
              <span className="text-[#e17100]">Anytime. Anywhere.</span>
            </motion.h1>
            <motion.p
              className="text-xl md:text-2xl max-w-3xl mx-auto mb-8 text-gray-200 leading-relaxed"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={1}
            >
              Explore high-quality courses by expert instructors. Join Vigyaana and start growing your skills today.
            </motion.p>
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={2}
            >
              <Link href="/register" className="flex items-center space-x-2 bg-[#e17100] hover:bg-[#c5610a] text-white font-bold px-8 py-4 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                <span>Get Started</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link href="#courses" className="flex items-center space-x-2 border-2 border-white hover:bg-white hover:text-[#1c4645] text-white font-semibold px-8 py-4 rounded-full transition-all duration-300">
                <BookOpen className="h-5 w-5" />
                <span>Browse Courses</span>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ✅ Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1c4645] mb-4">Why Choose Vigyana?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We provide everything you need to accelerate your learning journey
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[Zap, Award, Globe].map((Icon, index) => (
              <motion.div
                key={index}
                className="text-center p-8 rounded-xl hover:shadow-lg transition-shadow duration-300"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={index}
              >
                <div className="flex justify-center mb-6">
                  <div className="p-4 bg-[#e17100] text-white rounded-full">
                    <Icon className="h-12 w-12" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-[#1c4645] mb-4">
                  {['Learn at Your Pace', 'Expert Instructors', 'Global Community'][index]}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {
                    [
                      'Self-paced learning with lifetime access to all course materials',
                      'Learn from industry professionals with years of real-world experience',
                      'Join thousands of learners from around the world on your journey',
                    ][index]
                  }
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ✅ Featured Courses */}
      <section id="courses" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1c4645] mb-4">Featured Courses</h2>
            <p className="text-xl text-gray-600">Discover our most popular and highly-rated courses</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {isCoursesLoading ? (
              <div className="col-span-full text-center py-12">
                <p className="text-xl text-gray-500">Loading courses...</p>
              </div>
            ) : courses.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-xl text-gray-500">No courses available at the moment</p>
              </div>
            ) : (
              courses.map((course, i) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                >
                  <CourseCard course={course} isEnrolled={enrolledCourseIds.includes(course.id)} />
                </motion.div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* ✅ Stats Section */}
      <section className="py-20 bg-[#1c4645] text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            {[Users, BookOpen, Trophy, Star].map((Icon, i) => (
              <motion.div
                key={i}
                className="p-6"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.2 }}
                viewport={{ once: true }}
              >
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-[#e17100] rounded-full">
                    <Icon className="h-8 w-8" />
                  </div>
                </div>
                <div className="text-3xl font-bold mb-2">
                  {['10,000+', '500+', '50+', '4.9/5'][i]}
                </div>
                <div className="text-gray-300">
                  {['Active Students', 'Courses', 'Expert Instructors', 'Average Rating'][i]}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ✅ Final CTA */}
      <section className="py-20 bg-gradient-to-r from-[#1c4645] to-[#2a5a58] text-white">
        <motion.div
          className="max-w-4xl mx-auto text-center px-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
        >
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-[#e17100] rounded-full">
              <CheckCircle className="h-12 w-12 text-white" />
            </div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to start learning?
          </h2>
          <p className="text-xl mb-8 text-gray-200">
            Join thousands of learners across the globe and transform your career today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register" className="flex items-center justify-center space-x-2 bg-[#e17100] hover:bg-[#c5610a] text-white px-8 py-4 rounded-full font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
              <span>Sign Up Free</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link href="/courses" className="flex items-center justify-center space-x-2 border-2 border-white hover:bg-white hover:text-[#1c4645] text-white px-8 py-4 rounded-full font-semibold transition-all duration-300">
              <BookOpen className="h-5 w-5" />
              <span>Browse Courses</span>
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
