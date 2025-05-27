import Link from 'next/link';

export default function CourseCard({ course, isEnrolled }) {
  return (
    <div className="border p-4 rounded shadow relative">
      <img src={course.thumbnailUrl} alt={course.title} className="w-full h-48 object-cover rounded" />
      <h2 className="text-xl font-bold mt-2">{course.title}</h2>
      <p className="text-gray-600">{course.description.slice(0, 100)}...</p>
      <p className="mt-1 text-sm">By: {course.createdBy?.name}</p>
      <p className="text-green-600 font-semibold mt-1">₹{course.price}</p>

      {isEnrolled ? (
        <Link href={`/dashboard/course/${course.id}`} className="block mt-3 text-white bg-green-600 px-3 py-1 rounded text-center">
          Go to Course
        </Link>
      ) : (
        <Link href={`/courses/${course.id}`} className="block mt-3 text-white bg-blue-600 px-3 py-1 rounded text-center">
          View Details
        </Link>
      )}

      {isEnrolled && (
        <span className="absolute top-2 right-2 bg-green-500 text-white px-2 py-0.5 text-xs rounded">
          Enrolled
        </span>
      )}
    </div>
  );
}
