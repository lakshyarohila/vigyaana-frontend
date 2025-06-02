'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getRequest } from '@/lib/api';

export default function BlogDetailPage() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    if (id) {
      getRequest(`/blogs/${id}`)
        .then(setBlog)
        .catch(() => console.error('Failed to load blog'));
    }
  }, [id]);

  if (!blog) return <p className="text-center py-20">Loading blog...</p>;

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 space-y-6">
      <img src={blog.imageUrl} className="w-full rounded-lg object-cover max-h-96" />
      <h1 className="text-4xl font-bold">{blog.title}</h1>
      <p className="text-gray-600 text-sm">
        By {blog.author?.name || 'Admin'} • {new Date(blog.createdAt).toLocaleDateString()}
      </p>
      <div className="mt-6 text-lg text-gray-800 whitespace-pre-line leading-relaxed">
        {blog.content}
      </div>
    </div>
  );
}
