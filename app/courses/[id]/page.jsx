'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
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

    // ✅ Check if user is enrolled
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
          setIsEnrolled(true); // ✅ Update UI state
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

  if (loading || !course) return <p>Loading...</p>;

  return (
    <div className="max-w-2xl mx-auto">
      <img src={course.thumbnailUrl} className="w-full rounded h-64 object-cover mb-4" />
      <h1 className="text-3xl font-bold">{course.title}</h1>
      <p className="text-gray-700 mt-2">{course.description}</p>
      <p className="mt-2 font-semibold">Instructor: {course.createdBy?.name}</p>
      <p className="text-xl text-green-700 mt-2">₹{course.price}</p>

      {user?.role === 'STUDENT' && (
        <>
          {isEnrolled ? (
            <Link
              href={`/dashboard/course/${course.id}`}
              className="mt-4 inline-block bg-green-600 text-white px-4 py-2 rounded"
            >
              Go to Course
            </Link>
          ) : (
            <button
              onClick={handleEnroll}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
            >
              Enroll Now
            </button>
          )}
        </>
      )}
    </div>
  );
}
