'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getRequest } from '@/lib/api';
import toast from 'react-hot-toast';

export default function EditBlogPage() {
  const { id } = useParams();
  const router = useRouter();
  const [blog, setBlog] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      getRequest(`/blogs/${id}`)
        .then((res) => {
          setBlog(res);
          setTitle(res.title);
          setContent(res.content);
        })
        .catch(() => toast.error('Failed to load blog'));
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      return toast.error('All fields are required');
    }

    setLoading(true);

    const formData = new FormData();
    formData.append('title', title.trim());
    formData.append('content', content.trim());
    if (image) formData.append('image', image);

    try {
      const res = await fetch(`https://vigyaana-server.onrender.com/api/blogs/${id}`, {
        method: 'PATCH',
        credentials: 'include',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      toast.success('Blog updated');
      router.push('/admin/blogs');
    } catch (err) {
      toast.error(err.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  if (!blog) return <p className="text-center py-10">Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">✏️ Edit Blog</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border p-2 rounded"
          placeholder="Title"
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full border p-2 rounded h-64"
          placeholder="Blog content"
        />

        <button
          type="submit"
          className={`w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 ${
            loading ? 'opacity-60 cursor-not-allowed' : ''
          }`}
          disabled={loading}
        >
          {loading ? 'Updating...' : 'Update Blog'}
        </button>
      </form>
    </div>
  );
}
