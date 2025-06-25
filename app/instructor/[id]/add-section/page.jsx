'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';
import ProtectedRoute from '@/compoenets/ProtectedRoute';

export default function AddSectionPage() {
  const { id: courseId } = useParams();
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [video, setVideo] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('title', title);
    data.append('courseId', courseId);
    data.append('video', video);

    try {
      await fetch('https://vigyaana-server.onrender.com/api/sections', {
        method: 'POST',
        credentials: 'include',
        body: data,
      });
      toast.success('Section added');
      router.push('/instructor');
    } catch (err) {
      toast.error('Failed to upload section');
    }
  };

  return (
    <ProtectedRoute allowedRoles={['INSTRUCTOR']}>
      <div className="max-w-xl mx-auto mt-10">
        <h1 className="text-xl font-bold mb-4">Add Section</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Section Title" required />
          <input type="file" accept="video/*" className="input" onChange={(e) => setVideo(e.target.files[0])} required />
          <button className="bg-blue-600 text-white px-4 py-2 rounded">Upload</button>
        </form>
      </div>
    </ProtectedRoute>
  );
}
