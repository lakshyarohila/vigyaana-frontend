'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  User, 
  IndianRupee, 
  BookOpen, 
  Clock, 
  Users, 
  Star, 
  Play, 
  ShoppingCart,
  CheckCircle,
  ArrowLeft,
  Award,
  Video
} from 'lucide-react';
import { getRequest, postRequest } from '@/lib/api';
import useAuthStore from '@/lib/store';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function CourseDetail() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuthStore();
  
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false);

  useEffect(() => {
    getRequest('/courses')
      .then((courses) => {
        const found = courses.find((c) => c.id === id);
        setCourse(found);
        setLoading(false);
      })
      .catch(() => toast.error('Failed to load course'));

    // Check if user is enrolled
    if (user?.role === 'STUDENT') {
      getRequest(`/enrollments/check/${id}`)
        .then((res) => setIsEnrolled(res.enrolled))
        .catch(() => {});
    }
  }, [id]);

  const handleEnroll = async () => {
    try {
      const res = await postRequest('/payment/order', { courseId: course.id });

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: res.amount,
        currency: res.currency,
        name: 'Vigyana',
        description: course.title,
        order_id: res.orderId,
        handler: async function (response) {
          await postRequest('/payment/verify', {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            courseId: course.id,
            amount: res.amount,
          });

          toast.success('Enrollment successful!');
          setIsEnrolled(true);
        },
        prefill: {
          name: user?.name,
          email: user?.email,
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: '#1c4645' }}>
            <BookOpen className="text-white animate-pulse" size={32} />
          </div>
          <p className="text-gray-600">Loading course details...</p>
        </div>
      </div>
    );
  }

  if (!course) return null;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <button className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors">
            <ArrowLeft size={20} />
            <span>Back to Courses</span>
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Course Image */}
            <div className="relative rounded-2xl overflow-hidden shadow-lg">
              <img 
                src={course.thumbnailUrl} 
                alt={course.title}
                className="w-full h-80 object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                <div className="w-20 h-20 rounded-full bg-white bg-opacity-90 flex items-center justify-center">
                  <Play className="text-gray-800 ml-1" size={32} />
                </div>
              </div>
            </div>

            {/* Course Info */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">{course.title}</h1>
              
              {/* Course Stats */}
              <div className="flex flex-wrap gap-6 mb-6 text-sm">
                <div className="flex items-center gap-2">
                  <User size={16} className="text-gray-500" />
                  <span className="text-gray-700">{course.createdBy?.name}</span>
                </div>
              </div>

              <p className="text-gray-700 leading-relaxed text-lg">{course.description}</p>
            </div>

            {/* What You'll Learn */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <Award className="text-gray-700" size={24} />
                What You'll Learn
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  'Build modern web applications with React',
                  'Master Node.js and Express.js backend development',
                  'Work with MongoDB and database design',
                  'Deploy applications to production',
                  'Implement user authentication and security',
                  'Create responsive, mobile-first designs'
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle size={16} className="text-green-600 mt-1 flex-shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Course Content */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <Video className="text-gray-700" size={24} />
                Course Content
              </h2>
              <p className="text-gray-600">Course content will be available after enrollment.</p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                {/* Price Header */}
                <div className="p-6 border-b border-gray-100" style={{ backgroundColor: '#f8fafc' }}>
                  <div className="flex items-center gap-2 mb-2">
                    <IndianRupee size={32} className="text-gray-700" />
                    <span className="text-4xl font-bold text-gray-900">{course.price}</span>
                  </div>
                  <p className="text-sm text-gray-600">One-time payment • Lifetime access</p>
                </div>

                {/* Action Button */}
                <div className="p-6">
                  {user?.role === 'STUDENT' && (
                    <>
                      {isEnrolled ? (
                        <Link
                          href={`/dashboard/course/${course.id}`}
                          className="w-full text-white py-4 px-6 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-3 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 mb-4"
                          style={{ backgroundColor: '#1c4645' }}
                        >
                          <BookOpen size={20} />
                          Go to Course
                        </Link>
                      ) : (
                        <button
                          onClick={handleEnroll}
                          className="w-full text-white py-4 px-6 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-3 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 mb-4"
                          style={{ backgroundColor: '#1c4645' }}
                          onMouseEnter={(e) => e.target.style.backgroundColor = '#0f2928'}
                          onMouseLeave={(e) => e.target.style.backgroundColor = '#1c4645'}
                        >
                          <ShoppingCart size={20} />
                          Enroll Now
                        </button>
                      )}
                    </>
                  )}

                  {/* Features List */}
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-3">
                      <CheckCircle size={16} className="text-green-600" />
                      <span className="text-gray-700">Lifetime access</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle size={16} className="text-green-600" />
                      <span className="text-gray-700">Certificate of completion</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle size={16} className="text-green-600" />
                      <span className="text-gray-700">Mobile and desktop access</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle size={16} className="text-green-600" />
                      <span className="text-gray-700">Direct instructor support</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Instructor Card */}
              <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Your Instructor</h3>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#1c4645' }}>
                    <User className="text-white" size={24} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{course.createdBy?.name}</p>
                    <p className="text-sm text-gray-600">Full-Stack Developer</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}