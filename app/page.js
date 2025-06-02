"use client";


import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { getRequest } from "@/lib/api";
import CourseCard from "@/compoenets/CourseCard";
import Link from "next/link";
import useAuthStore from "@/lib/store";
import {
  BookOpen,
  Users,
  Trophy,
  ArrowRight,
  Star,
  Clock,
  Globe,
  Zap,
  Award,
  CheckCircle,
} from "lucide-react";

export default function HomePage() {
 

  const [courses, setCourses] = useState([]);
  const [enrolledCourseIds, setEnrolledCourseIds] = useState([]);
  const { user } = useAuthStore();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const courseList = await getRequest("/courses");
        setCourses(courseList);

        // 🔐 If student, also fetch enrollments
        if (user?.role === "STUDENT") {
          const enrolled = await getRequest("/enrollments/my");
          const ids = enrolled.map((e) => e.course.id);
          setEnrolledCourseIds(ids);
        }
      } catch (err) {
        console.error("Failed to load courses", err);
      }
    };

    fetchCourses();
  }, [user]);

  return (
    <div className="min-h-screen ">
      {/* ✅ Hero Section */}
      <section className="relative  overflow-hidden bg-gradient-to-br from-[#1c4645] via-[#2a5a58] to-[#1c4645] text-white">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-20 sm:py-24 lg:py-32">
          <div className="text-center">
            <motion.div
              animate={{ y: [0, -20, 0] }} // Moves up and down
              transition={{
                duration: 2.6,
                repeat: Infinity,
                repeatType: "loop",
                ease: "easeInOut",
              }}
              style={{ display: "inline-block" }}
              className="flex justify-center mb-6"
            >
              <div className="p-4 bg-[#e17100] rounded-full">
                <BookOpen className="h-12 w-14 text-white" />
              </div>
            </motion.div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Learn Anything. <br />
              <span className="text-[#e17100]">Anytime. Anywhere.</span>
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-8 text-gray-200 leading-relaxed">
              Explore high-quality courses by expert instructors. Join Vigyaana
              and start growing your skills today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/register"
                className="flex items-center space-x-2 bg-[#e17100] hover:bg-[#c5610a] text-white font-bold px-8 py-4 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <span>Get Started</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="#courses"
                className="flex items-center space-x-2 border-2 border-white hover:bg-white hover:text-[#1c4645] text-white font-semibold px-8 py-4 rounded-full transition-all duration-300"
              >
                <BookOpen className="h-5 w-5" />
                <span>Browse Courses</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ✅ Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1c4645] mb-4">
              Why Choose Vigyana?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We provide everything you need to accelerate your learning journey
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Zap className="h-12 w-12" />,
                title: "Learn at Your Pace",
                description:
                  "Self-paced learning with lifetime access to all course materials",
              },
              {
                icon: <Award className="h-12 w-12" />,
                title: "Expert Instructors",
                description:
                  "Learn from industry professionals with years of real-world experience",
              },
              {
                icon: <Globe className="h-12 w-12" />,
                title: "Global Community",
                description:
                  "Join thousands of learners from around the world on your journey",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="text-center p-8 rounded-xl hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex justify-center mb-6">
                  <div className="p-4 bg-[#e17100] text-white rounded-full">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-[#1c4645] mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ✅ Featured Courses */}
      <section id="courses" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1c4645] mb-4">
              Featured Courses
            </h2>
            <p className="text-xl text-gray-600">
              Discover our most popular and highly-rated courses
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.length === 0 && (
              <div className="col-span-full text-center py-12">
                <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-xl text-gray-500">
                  No courses available at the moment
                </p>
                <p className="text-gray-400">
                  Check back soon for new courses!
                </p>
              </div>
            )}
            {courses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                isEnrolled={enrolledCourseIds.includes(course.id)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ✅ Stats Section */}
      <section className="py-20 bg-[#1c4645] text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            {[
              {
                icon: <Users className="h-8 w-8" />,
                number: "10,000+",
                label: "Active Students",
              },
              {
                icon: <BookOpen className="h-8 w-8" />,
                number: "500+",
                label: "Courses",
              },
              {
                icon: <Trophy className="h-8 w-8" />,
                number: "50+",
                label: "Expert Instructors",
              },
              {
                icon: <Star className="h-8 w-8" />,
                number: "4.9/5",
                label: "Average Rating",
              },
            ].map((stat, index) => (
              <div key={index} className="p-6">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-[#e17100] rounded-full">
                    {stat.icon}
                  </div>
                </div>
                <div className="text-3xl font-bold mb-2">{stat.number}</div>
                <div className="text-gray-300">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ✅ Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1c4645] mb-4">
              What Our Students Say
            </h2>
            <p className="text-xl text-gray-600">
              Real feedback from our learning community
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                name: "Aarav M.",
                role: "Full-Stack Developer",
                quote:
                  "Vigyana helped me learn full-stack development at my own pace! The instructors are amazing and the content is top-notch.",
                rating: 5,
              },
              {
                name: "Priya S.",
                role: "UI/UX Designer",
                quote:
                  "Super clean interface, top-quality instructors. Love it! The courses are well-structured and easy to follow.",
                rating: 5,
              },
              {
                name: "Rohan K.",
                role: "Software Engineer",
                quote:
                  "I got my first job after completing 2 courses on Vigyana. The practical projects really helped me build a strong portfolio.",
                rating: 5,
              },
            ].map((testimonial, index) => (
              <div
                key={index}
                className="bg-gray-50 p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 text-[#e17100] fill-current"
                    />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed italic">
                  {testimonial.quote}
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-[#1c4645] rounded-full flex items-center justify-center text-white font-bold mr-4">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-[#1c4645]">
                      {testimonial.name}
                    </p>
                    <p className="text-gray-500 text-sm">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ✅ Final CTA */}
      <section className="py-20 bg-gradient-to-r from-[#1c4645] to-[#2a5a58] text-white">
        <div className="max-w-4xl mx-auto text-center px-4">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-[#e17100] rounded-full">
              <CheckCircle className="h-12 w-12 text-white" />
            </div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to start learning?
          </h2>
          <p className="text-xl mb-8 text-gray-200">
            Join thousands of learners across the globe and transform your
            career today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="flex items-center justify-center space-x-2 bg-[#e17100] hover:bg-[#c5610a] text-white px-8 py-4 rounded-full font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <span>Sign Up Free</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/courses"
              className="flex items-center justify-center space-x-2 border-2 border-white hover:bg-white hover:text-[#1c4645] text-white px-8 py-4 rounded-full font-semibold transition-all duration-300"
            >
              <BookOpen className="h-5 w-5" />
              <span>Browse Courses</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
