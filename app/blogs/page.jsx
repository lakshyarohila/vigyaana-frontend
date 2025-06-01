'use client';

import { useEffect, useState } from 'react';
import { getRequest } from '@/lib/api';
import Link from 'next/link';

export default function BlogsPage() {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    getRequest('/blogs')
      .then(setBlogs)
      .catch(() => console.error('Failed to load blogs'));
  }, []);

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 space-y-8">
      <h1 className="text-3xl font-bold text-center">📰 Vigyana Blog</h1>
      {blogs.length === 0 && <p className="text-center">No blog posts yet.</p>}
      {blogs.map(blog => (
        <div key={blog.id} className="border rounded p-4 shadow hover:shadow-md transition">
          <img src={blog.imageUrl} className="w-full h-64 object-cover rounded mb-4" />
          <h2 className="text-2xl font-bold mb-2">{blog.title}</h2>
          <p className="text-sm text-gray-500 mb-2">By {blog.author.name} • {new Date(blog.createdAt).toLocaleDateString()}</p>
          <Link href={`/blogs/${blog.id}`} className="text-blue-600 hover:underline">Read More →</Link>
        </div>
      ))}
    </div>
  );
}
