'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getRequest } from '@/lib/api';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState([]);
  const router = useRouter();

  const fetchBlogs = () => {
    getRequest('/blogs')
      .then(setBlogs)
      .catch(() => toast.error('Failed to fetch blogs'));
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this blog?')) return;

    try {
      const res = await fetch(`https://vigyaana-server.onrender.com/api/blogs/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      toast.success('Deleted successfully');
      fetchBlogs();
    } catch (err) {
      toast.error(err.message || 'Failed to delete');
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">📚 Manage Blogs</h1>

      {blogs.length === 0 ? (
        <p>No blogs yet</p>
      ) : (
        <div className="space-y-4">
          {blogs.map((blog) => (
            <div key={blog.id} className="border p-4 rounded shadow">
              <h2 className="text-xl font-semibold">{blog.title}</h2>
              <p className="text-sm text-gray-500">Created: {new Date(blog.createdAt).toLocaleDateString()}</p>
              <div className="flex gap-4 mt-2">
                <Link
                  href={`/admin/blogs/edit/${blog.id}`}
                  className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(blog.id)}
                  className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
