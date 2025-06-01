'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getRequest } from '@/lib/api';

export default function BlogViewPage() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    getRequest(`/blogs/${id}`).then(setBlog).catch(() => {});
  }, [id]);

  if (!blog) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-4xl font-bold mb-2">{blog.title}</h1>
      <p className="text-sm text-gray-500 mb-4">By {blog.author.name} • {new Date(blog.createdAt).toLocaleDateString()}</p>
      <img src={blog.imageUrl} className="w-full h-64 object-cover rounded mb-6" />
      <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: blog.content }} />
    </div>
  );
}
