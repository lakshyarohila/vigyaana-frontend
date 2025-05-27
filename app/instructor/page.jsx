'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import ProtectedRoute from '@/compoenets/ProtectedRoute';

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
      await fetch('http://localhost:5000/api/courses', {
        method: 'POST',
        credentials: 'include',
        body: data,
      });
      toast.success('Course created');
     router.push(`/instructor/${newCourse.id}/add-section`)
    } catch (err) {
      toast.error('Failed to create course');
    }
  };

  return (
    <ProtectedRoute allowedRoles={['INSTRUCTOR']}>
      <div className="max-w-xl mx-auto mt-10">
        <h1 className="text-2xl font-bold mb-4">Create New Course</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="title" className="input" placeholder="Title" onChange={handleChange} required />
          <textarea name="description" className="input" placeholder="Description" onChange={handleChange} required />
          <input name="price" type="number" className="input" placeholder="Price" onChange={handleChange} required />
          <input name="thumbnail" type="file" accept="image/*" className="input" onChange={handleChange} required />
          <button className="bg-green-600 text-white px-4 py-2 rounded">Create Course</button>
        </form>
      </div>
    </ProtectedRoute>
  );
}
