'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  User, 
  IndianRupee, 
  BookOpen, 
  ShoppingCart,
  CheckCircle,
  ArrowLeft,
  Award,
  Video,
  MessageSquare,
  Trash2,
  Send,
  Star
} from 'lucide-react';
import { getRequest, postRequest, deleteRequest } from '@/lib/api';
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
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    getRequest('/courses')
      .then((courses) => {
        const found = courses.find((c) => c.id === id);
        setCourse(found);
        setLoading(false);
      })
      .catch(() => toast.error('Failed to load course'));

    if (user?.role === 'STUDENT') {
      getRequest(`/enrollments/check/${id}`)
        .then((res) => setIsEnrolled(res.enrolled))
        .catch(() => {});
    }

    loadReviews();
  }, [id]);

  const loadReviews = async () => {
    try {
      setReviewsLoading(true);
      const reviewsData = await getRequest(`/reviews/${id}`);
      setReviews(reviewsData);
    } catch (error) {
      console.error('Failed to load reviews:', error);
    } finally {
      setReviewsLoading(false);
    }
  };

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

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (!user) return toast.error('Please login to add a review');
    if (!newReview.comment.trim()) return toast.error('Please write a review comment');

    try {
      setSubmittingReview(true);
      await postRequest('/reviews', {
        courseId: id,
        rating: newReview.rating,
        comment: newReview.comment.trim()
      });
      toast.success('Review added successfully!');
      setNewReview({ rating: 5, comment: '' });
      loadReviews();
    } catch (error) {
      toast.error(error.message || 'Failed to add review');
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!confirm('Are you sure you want to delete this review?')) return;
    try {
      await deleteRequest(`/reviews/${reviewId}`);
      toast.success('Review deleted successfully');
      loadReviews();
    } catch (error) {
      toast.error(error.message || 'Failed to delete review');
    }
  };

  const renderStars = (rating, size = 16) => (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={size}
          className={`${star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
        />
      ))}
    </div>
  );

  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;
    const total = reviews.reduce((sum, r) => sum + r.rating, 0);
    return (total / reviews.length).toFixed(1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-600">Loading course details...</p>
      </div>
    );
  }

  if (!course) return null;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-6 py-8 grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="relative rounded-2xl overflow-hidden shadow-lg">
            <img src={course.thumbnailUrl} alt={course.title} className="w-full h-80 object-cover" />
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
            <p className="text-gray-700 leading-relaxed text-lg">{course.description}</p>
          </div>

          {/* Reviews */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <MessageSquare className="text-gray-700" size={24} />
              Student Reviews
            </h2>

            {reviews.map((review) => (
              <div key={review.id} className="border-b border-gray-100 pb-6 mb-6">
                <div className="flex items-center gap-3 mb-2">
                  <User size={20} className="text-gray-500" />
                  <p className="font-semibold">{review.user?.name || 'Anonymous'}</p>
                  {renderStars(review.rating)}
                </div>
                <p>{review.comment}</p>
                {user && (user.id === review.userId || user.role === 'ADMIN') && (
                  <button onClick={() => handleDeleteReview(review.id)} className="text-red-500 mt-2">Delete</button>
                )}
              </div>
            ))}

            {user && isEnrolled && (
              <form onSubmit={handleSubmitReview}>
                <textarea
                  value={newReview.comment}
                  onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                  placeholder="Write your review"
                  className="w-full p-3 border rounded mb-3"
                  required
                />
                <button
                  type="submit"
                  disabled={submittingReview}
                  className="bg-[#1c4645] text-white px-4 py-2 rounded"
                >
                  {submittingReview ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-4">
              <IndianRupee size={32} className="text-gray-700" />
              <span className="text-4xl font-bold">{course.price}</span>
            </div>

            {user?.role === 'STUDENT' && (
              isEnrolled ? (
                <>
                  <Link
                    href={`/dashboard/course/${course.id}`}
                    className="block w-full text-center bg-[#1c4645] text-white py-3 rounded mb-3"
                  >
                    Go to Course
                  </Link>

                  {course.type === 'LIVE' && course.whatsappGroupLink && (
                    <a
                      href={course.whatsappGroupLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full text-center bg-green-600 text-white py-3 rounded"
                    >
                      Join WhatsApp Group
                    </a>
                  )}
                </>
              ) : (
                <button
                  onClick={handleEnroll}
                  className="w-full bg-[#1c4645] text-white py-3 rounded"
                >
                  Enroll Now
                </button>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
