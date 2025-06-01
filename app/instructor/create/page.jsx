'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const ProtectedRoute = ({ children, allowedRoles }) => {
  return <div>{children}</div>;
};

// Mock toast for demo
const toast = {
  success: (message) => console.log('Success:', message),
  error: (message) => console.log('Error:', message)
};

// Mock router for demo

export default function CreateCoursePage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    thumbnail: null,
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

    try {
      const response = await fetch('https://vigyaana-server.onrender.com/api/courses', {
        method: 'POST',
        credentials: 'include',
        body: data,
      });
      
      if (response.ok) {
        const newCourse = await response.json();
        toast.success('Course created');
        router.push(`/instructor/${newCourse.id}/add-section`);
      } else {
        throw new Error('Failed to create course');
      }
    } catch (err) {
      toast.error('Failed to create course');
    }
  };

  return (
    <ProtectedRoute allowedRoles={['INSTRUCTOR']}>
      <div className="min-h-screen bg-white">
        <div className="max-w-xl mx-auto pt-10 px-4">
          <div className="bg-white border-2 border-gray-100 rounded-lg shadow-lg p-8">
            <h1 className="text-3xl font-bold mb-6 text-center" style={{ color: '#1c4645' }}>
              Create New Course
            </h1>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#1c4645' }}>
                  Course Title
                </label>
                <input 
                  name="title" 
                  className="w-full px-4 py-3 border-2 text-black rounded-md focus:outline-none focus:ring-2 transition-colors"
                  style={{ 
                    borderColor: '#1c4645',
                    focusRingColor: '#1c4645'
                  }}
                  placeholder="Enter course title" 
                  onChange={handleChange} 
                  required 
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#1c4645' }}>
                  Description
                </label>
                <textarea 
                  name="description" 
                  className="w-full px-4 py-3 text-black border-2 rounded-md focus:outline-none focus:ring-2 transition-colors h-32 resize-none"
                  style={{ 
                    borderColor: '#1c4645',
                    focusRingColor: '#1c4645'
                  }}
                  placeholder="Describe your course" 
                  onChange={handleChange} 
                  required 
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#1c4645' }}>
                  Price ($)
                </label>
                <input 
                  name="price" 
                  type="number" 
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-3 text-black border-2 rounded-md focus:outline-none focus:ring-2 transition-colors"
                  style={{ 
                    borderColor: '#1c4645',
                    focusRingColor: '#1c4645'
                  }}
                  placeholder="0.00" 
                  onChange={handleChange} 
                  required 
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#1c4645' }}>
                  Course Thumbnail
                </label>
                <input 
                  name="thumbnail" 
                  type="file" 
                  accept="image/*" 
                  className="w-full px-4 py-3 border-2 text-black rounded-md focus:outline-none focus:ring-2 transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:cursor-pointer"
                  style={{ 
                    borderColor: '#1c4645',
                    focusRingColor: '#1c4645'
                  }}
                  onChange={handleChange} 
                  required 
                />
              </div>

              <button 
                type="button"
                onClick={handleSubmit}
                className="w-full text-white px-6 py-3 rounded-md font-medium transition-all duration-200 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2"
                style={{ 
                  backgroundColor: '#1c4645',
                  focusRingColor: '#1c4645'
                }}
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