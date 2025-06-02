'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getRequest } from '@/lib/api'; // make sure base URL is configured

export default function BlogsPage() {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    getRequest('/blogs')
      .then(setBlogs)
      .catch(() => console.error('Failed to load blogs'));
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 space-y-8">
      <h1 className="text-3xl font-bold text-center">📰 Vigyana Blogs</h1>

      {blogs.length === 0 && <p className="text-center text-gray-600">No blog posts found.</p>}

      {blogs.map(blog => (
        <div key={blog.id} className="border rounded p-4 shadow hover:shadow-md transition">
          <img src={blog.imageUrl} className="w-full h-64 object-cover rounded mb-4" />
          <h2 className="text-2xl font-semibold mb-1">{blog.title}</h2>
          <p className="text-sm text-gray-500 mb-2">
            By {blog.author?.name || 'Admin'} • {new Date(blog.createdAt).toLocaleDateString()}
          </p>
          <Link href={`/blogs/${blog.id}`} className="text-blue-600 hover:underline">
            Read More →
          </Link>
        </div>
      ))}
    </div>
  );
}
