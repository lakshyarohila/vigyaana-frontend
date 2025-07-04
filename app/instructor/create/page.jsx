'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const ProtectedRoute = ({ children, allowedRoles }) => {
  return <div>{children}</div>;
};

const toast = {
  success: (message) => console.log('Success:', message),
  error: (message) => console.log('Error:', message),
};

export default function CreateCoursePage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    thumbnail: null,
    type: 'RECORDED', // ✅ default value
    whatsappGroupLink: '', // ✅ new field
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setForm((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append('title', form.title);
    data.append('description', form.description);
    data.append('price', form.price);
    data.append('thumbnail', form.thumbnail);
    data.append('type', form.type);
    if (form.type === 'LIVE' && form.whatsappGroupLink) {
      data.append('whatsappGroupLink', form.whatsappGroupLink);
    }

    try {
      const response = await fetch('https://vigyaana-server.onrender.com/api/courses', {
        method: 'POST',
        credentials: 'include',
        body: data,
      });

      if (response.ok) {
        const resData = await response.json();
        toast.success('Course created');

        // ✅ Redirect based on type
        const newCourseId = resData.course?.id || resData.id;
        if (form.type === 'LIVE') {
          router.push(`/instructor/live-course/${newCourseId}`);
        } else {
          router.push(`/instructor/${newCourseId}/add-section`);
        }
      } else {
        throw new Error('Failed to create course');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to create course');
    }
  };

  return (
    <ProtectedRoute allowedRoles={['INSTRUCTOR']}>
      <div className="min-h-screen bg-white">
        <div className="max-w-xl mx-auto pt-10 px-4">
          <div className="bg-white border-2 border-gray-100 rounded-lg shadow-lg p-8">
            <h1 className="text-3xl font-bold mb-6 text-center text-[#1c4645]">
              Create New Course
            </h1>

            <div className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium mb-2 text-[#1c4645]">
                  Course Title
                </label>
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 text-black rounded-md focus:outline-none focus:ring-2"
                  placeholder="Enter course title"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium mb-2 text-[#1c4645]">
                  Description
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  className="w-full px-4 py-3 text-black border-2 rounded-md focus:outline-none focus:ring-2 h-32 resize-none"
                  placeholder="Describe your course"
                  required
                />
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-medium mb-2 text-[#1c4645]">
                  Price ($)
                </label>
                <input
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.price}
                  onChange={handleChange}
                  className="w-full px-4 py-3 text-black border-2 rounded-md focus:outline-none focus:ring-2"
                  placeholder="0.00"
                  required
                />
              </div>

              {/* Course Type */}
              <div>
                <label className="block text-sm font-medium mb-2 text-[#1c4645]">
                  Course Type
                </label>
                <select
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                  className="w-full px-4 py-3 text-black border-2 rounded-md focus:outline-none focus:ring-2"
                  required
                >
                  <option value="RECORDED">Recorded</option>
                  <option value="LIVE">Live</option>
                </select>
              </div>

              {/* WhatsApp Group Link for LIVE */}
              {form.type === 'LIVE' && (
                <div>
                  <label className="block text-sm font-medium mb-2 text-[#1c4645]">
                    WhatsApp Group Link
                  </label>
                  <input
                    name="whatsappGroupLink"
                    type="url"
                    value={form.whatsappGroupLink}
                    onChange={handleChange}
                    className="w-full px-4 py-3 text-black border-2 rounded-md focus:outline-none focus:ring-2"
                    placeholder="https://chat.whatsapp.com/..."
                    required
                  />
                </div>
              )}

              {/* Thumbnail */}
              <div>
                <label className="block text-sm font-medium mb-2 text-[#1c4645]">
                  Course Thumbnail
                </label>
                <input
                  name="thumbnail"
                  type="file"
                  accept="image/*"
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 text-black rounded-md focus:outline-none focus:ring-2 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:cursor-pointer"
                  required
                />
              </div>

              <button
                type="submit"
                onClick={handleSubmit}
                className="w-full bg-[#1c4645] text-white px-6 py-3 rounded-md font-medium hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2"
              >
                Create Course
              </button>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
