import Link from 'next/link';
import { 
  CheckCircle, 
  BookOpen, 
  User, 
  IndianRupee, 
  Clock,
  Star,
  Users
} from 'lucide-react';

export default function CourseCard({ course, isEnrolled }) {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      {/* Course Image */}
      <div className="relative h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
        <img 
          src={course.thumbnailUrl || '/api/placeholder/400/240'} 
          alt={course.title}
          className="max-w-full max-h-full w-auto h-auto object-contain"
        />
        
        {/* Enrolled Status Badge */}
        {isEnrolled && (
          <div className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1 shadow-lg">
            <CheckCircle size={16} />
            Enrolled
          </div>
        )}

        {/* Course Level Badge (if available) */}
        {course.level && (
          <div className="absolute top-3 left-3 bg-[#1c4645] text-white px-3 py-1 rounded-full text-xs font-semibold">
            {course.level}
          </div>
        )}
      </div>

      {/* Course Content - ALWAYS link to detail page */}
      <Link href={`/courses/${course.id}`} className="block">
        <div className="p-6 hover:bg-gray-50 transition-colors">
          {/* Course Title */}
          <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 min-h-[3.5rem]">
            {course.title}
          </h3>
          
          {/* Course Description */}
          <p className="text-gray-600 mb-4 line-clamp-2 text-sm leading-relaxed min-h-[2.5rem]">
            {course.description}
          </p>

          {/* Course Meta Info */}
          <div className="flex items-center justify-between mb-4 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <User size={16} />
              <span className="truncate">{course.createdBy?.name || 'Instructor'}</span>
            </div>
            
            {/* Duration or Students count (if available) */}
            {course.duration && (
              <div className="flex items-center gap-1">
                <Clock size={16} />
                <span>{course.duration}</span>
              </div>
            )}
            
            {course.studentsCount && (
              <div className="flex items-center gap-1">
                <Users size={16} />
                <span>{course.studentsCount}</span>
              </div>
            )}
          </div>

          {/* Rating (if available) */}
          {course.rating && (
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={16}
                    className={`${
                      star <= Math.round(course.rating)
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">
                {course.rating} ({course.reviewsCount || 0} reviews)
              </span>
            </div>
          )}

          {/* Price and Action */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <IndianRupee size={20} className="text-gray-700" />
              <span className="text-2xl font-bold text-gray-900">
                {course.price}
              </span>
            </div>
          </div>

          {/* View Details Button */}
          <div className="mt-4">
            <div className="flex items-center justify-center w-full py-3 px-4 bg-[#1c4645] text-white rounded-lg hover:bg-[#0f2928] transition-all duration-200 font-semibold">
              <BookOpen size={18} className="mr-2" />
              <span>View Details</span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}