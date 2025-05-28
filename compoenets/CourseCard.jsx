import Link from 'next/link';

export default function CourseCard({ course, isEnrolled }) {
  return (
    <div className="border border-gray-200 p-6 rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300 relative bg-white">
      <img src={course.thumbnailUrl} alt={course.title} className="w-full h-48 object-cover rounded-lg" />
      <h2 className="text-xl font-bold mt-4 text-[#1c4645]">{course.title}</h2>
      <p className="text-gray-600 mt-2">{course.description.slice(0, 100)}...</p>
      <p className="mt-2 text-sm text-gray-700">By: {course.createdBy?.name}</p>
      <p className="text-[#e17100] font-bold mt-2 text-lg">₹{course.price}</p>

      {isEnrolled ? (
        <Link href={`/dashboard/course/${course.id}`} className="block mt-4 text-white bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg text-center font-medium transition-colors duration-200">
          Go to Course
        </Link>
      ) : (
        <Link href={`/courses/${course.id}`} className="block mt-4 text-white bg-[#1c4645] hover:bg-[#2a5a58] px-4 py-2 rounded-lg text-center font-medium transition-colors duration-200">
          View Details
        </Link>
      )}

      {isEnrolled && (
        <span className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 text-xs rounded-full font-medium">
          Enrolled
        </span>
      )}
    </div>
  );
}