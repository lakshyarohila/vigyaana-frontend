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
  Video,
  MessageSquare,
  Trash2,
  Send
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

    // Check if user is enrolled
    if (user?.role === 'STUDENT') {
      getRequest(`/enrollments/check/${id}`)
        .then((res) => setIsEnrolled(res.enrolled))
        .catch(() => {});
    }

    // Load reviews
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
    
    if (!user) {
      toast.error('Please login to add a review');
      return;
    }

    if (!newReview.comment.trim()) {
      toast.error('Please write a review comment');
      return;
    }

    try {
      setSubmittingReview(true);
      await postRequest('/reviews', {
        courseId: id,
        rating: newReview.rating,
        comment: newReview.comment.trim()
      });
      
      toast.success('Review added successfully!');
      setNewReview({ rating: 5, comment: '' });
      loadReviews(); // Reload reviews
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
      loadReviews(); // Reload reviews
    } catch (error) {
      toast.error(error.message || 'Failed to delete review');
    }
  };

  const renderStars = (rating, size = 16, interactive = false, onRatingChange = null) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={size}
            className={`${
              star <= rating 
                ? 'text-yellow-400 fill-yellow-400' 
                : 'text-gray-300'
            } ${interactive ? 'cursor-pointer hover:text-yellow-400' : ''}`}
            onClick={() => interactive && onRatingChange && onRatingChange(star)}
          />
        ))}
      </div>
    );
  };

  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (total / reviews.length).toFixed(1);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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
                {reviews.length > 0 && (
                  <div className="flex items-center gap-2">
                    {renderStars(Math.round(calculateAverageRating()))}
                    <span className="text-gray-700">
                      {calculateAverageRating()} ({reviews.length} review{reviews.length !== 1 ? 's' : ''})
                    </span>
                  </div>
                )}
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

            {/* Reviews Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <MessageSquare className="text-gray-700" size={24} />
                Student Reviews
              </h2>

              {/* Review Summary */}
              {reviews.length > 0 && (
                <div className="mb-8 p-6 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="text-4xl font-bold text-gray-900">{calculateAverageRating()}</div>
                    <div>
                      {renderStars(Math.round(calculateAverageRating()), 20)}
                      <p className="text-gray-600 mt-1">
                        Based on {reviews.length} review{reviews.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Add Review Form */}
              {user && isEnrolled && (
                <form onSubmit={handleSubmitReview} className="mb-8 p-6 bg-gray-50 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Your Review</h3>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rating
                    </label>
                    {renderStars(
                      newReview.rating, 
                      24, 
                      true, 
                      (rating) => setNewReview({...newReview, rating})
                    )}
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Review
                    </label>
                    <textarea
                      value={newReview.comment}
                      onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                      placeholder="Share your experience with this course..."
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      rows={4}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="flex items-center gap-2 px-6 py-3 text-white rounded-lg font-semibold transition-all duration-200 hover:shadow-md disabled:opacity-50"
                    style={{ backgroundColor: '#1c4645' }}
                  >
                    <Send size={16} />
                    {submittingReview ? 'Submitting...' : 'Submit Review'}
                  </button>
                </form>
              )}

              {/* Reviews List */}
              <div className="space-y-6">
                {reviewsLoading ? (
                  <div className="text-center py-8">
                    <div className="text-gray-500">Loading reviews...</div>
                  </div>
                ) : reviews.length === 0 ? (
                  <div className="text-center py-8">
                    <MessageSquare className="mx-auto text-gray-400 mb-4" size={48} />
                    <p className="text-gray-500">No reviews yet. Be the first to review this course!</p>
                  </div>
                ) : (
                  reviews.map((review) => (
                    <div key={review.id} className="border-b border-gray-100 pb-6 last:border-b-0">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#1c4645' }}>
                            <User className="text-white" size={20} />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{review.user?.name || 'Anonymous'}</p>
                            <div className="flex items-center gap-2">
                              {renderStars(review.rating)}
                              <span className="text-sm text-gray-500">
                                {formatDate(review.createdAt)}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        {user && (user.id === review.userId || user.role === 'ADMIN') && (
                          <button
                            onClick={() => handleDeleteReview(review.id)}
                            className="text-red-500 hover:text-red-700 transition-colors"
                            title="Delete review"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                      
                      <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                    </div>
                  ))
                )}
              </div>
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