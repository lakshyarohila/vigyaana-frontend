'use client';

import { useEffect, useState } from 'react';
import { getRequest } from '@/lib/api';
import CourseCard from '@/compoenets/CourseCard';
import Link from 'next/link';
import useAuthStore from '@/lib/store';

export default function HomePage() {
  const [courses, setCourses] = useState([]);
  const [enrolledCourseIds, setEnrolledCourseIds] = useState([]);
  const { user } = useAuthStore();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const courseList = await getRequest('/courses');
        setCourses(courseList);

        // 🔐 If student, also fetch enrollments
        if (user?.role === 'STUDENT') {
          const enrolled = await getRequest('/enrollments/my');
          const ids = enrolled.map((e) => e.course.id);
          setEnrolledCourseIds(ids);
        }
      } catch (err) {
        console.error('Failed to load courses', err);
      }
    };

    fetchCourses();
  }, [user]);

  return (
    <div className="space-y-16">
      {/* ✅ Hero Section */}
      <section className="text-center py-20 bg-gradient-to-br from-blue-600 to-indigo-800 text-white">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Learn Anything. Anytime. Anywhere.</h1>
        <p className="text-lg max-w-xl mx-auto">
          Explore high-quality courses by expert instructors. Join Vigyana and start growing your skills today.
        </p>
        <div className="mt-6">
          <Link href="/register" className="bg-white text-blue-700 font-bold px-6 py-2 rounded hover:bg-blue-100">
            Get Started
          </Link>
        </div>
      </section>

      {/* ✅ Featured Courses */}
      <section className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold mb-6 text-center">Featured Courses</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {courses.length === 0 && <p>No courses available</p>}
          {courses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              isEnrolled={enrolledCourseIds.includes(course.id)}
            />
          ))}
        </div>
      </section>

      {/* ✅ Testimonials */}
      <section className="bg-gray-100 py-16">
        <div className="max-w-5xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold mb-8">What Our Students Say</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                name: 'Aarav M.',
                quote: 'Vigyana helped me learn full-stack development at my own pace!',
              },
              {
                name: 'Priya S.',
                quote: 'Super clean interface, top-quality instructors. Love it!',
              },
              {
                name: 'Rohan K.',
                quote: 'I got my first job after completing 2 courses on Vigyana.',
              },
            ].map((t) => (
              <div key={t.name} className="bg-white p-6 rounded shadow">
                <p className="italic text-gray-700 mb-2">"{t.quote}"</p>
                <p className="font-bold text-blue-700">{t.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ✅ Final CTA */}
      <section className="text-center py-16 bg-indigo-800 text-white">
        <h2 className="text-3xl font-bold mb-4">Ready to start learning?</h2>
        <p className="mb-6">Join thousands of learners across the globe.</p>
        <Link href="/register" className="bg-white text-indigo-700 px-6 py-2 rounded font-semibold">
          Sign Up Free
        </Link>
      </section>
    </div>
  );
}
