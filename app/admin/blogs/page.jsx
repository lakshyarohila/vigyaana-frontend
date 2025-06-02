'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getRequest } from '@/lib/api';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { 
  Settings, 
  Edit3, 
  Trash2, 
  Plus, 
  Calendar, 
  User, 
  FileText,
  AlertTriangle,
  Eye
} from 'lucide-react';

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState([]);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
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
    try {
      const res = await fetch(`https://vigyaana-server.onrender.com/api/blogs/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      toast.success('Blog deleted successfully');
      fetchBlogs();
      setDeleteConfirm(null);
    } catch (err) {
      toast.error(err.message || 'Failed to delete');
    }
  };

  const DeleteConfirmModal = ({ blog, onConfirm, onCancel }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
        <div className="text-center space-y-6">
          <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center">
            <AlertTriangle size={32} className="text-red-600" />
          </div>
          
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Blog Post</h3>
            <p className="text-gray-600">
              Are you sure you want to delete "<span className="font-semibold">{blog.title}</span>"? 
              This action cannot be undone.
            </p>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 py-3 px-4 border-2 border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => onConfirm(blog.id)}
              className="flex-1 py-3 px-4 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto py-12 px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Settings size={32} style={{ color: '#1c4645' }} />
                <h1 className="text-4xl font-bold" style={{ color: '#1c4645' }}>
                  Manage Blogs
                </h1>
              </div>
              <div className="w-24 h-1" style={{ backgroundColor: '#1c4645' }}></div>
            </div>
            
            <Link
              href="/admin/blogs/create"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-white transition-all duration-200 hover:shadow-lg"
              style={{ backgroundColor: '#1c4645' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#2d6a68';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#1c4645';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <Plus size={20} />
              New Blog
            </Link>
          </div>
        </div>

        {/* Stats Card */}
        <div className="bg-white rounded-2xl border-2 p-6 mb-8" style={{ borderColor: 'rgba(28, 70, 69, 0.1)' }}>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#1c4645', opacity: 0.1 }}>
              <FileText size={24} style={{ color: '#1c4645' }} />
            </div>
            <div>
              <h3 className="text-2xl font-bold" style={{ color: '#1c4645' }}>
                {blogs.length}
              </h3>
              <p className="text-gray-600">Total Blog Posts</p>
            </div>
          </div>
        </div>

        {/* Blog List */}
        {blogs.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center" style={{ backgroundColor: '#1c4645', opacity: 0.1 }}>
              <FileText size={32} style={{ color: '#1c4645' }} />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No blogs yet</h3>
            <p className="text-gray-600 mb-6">Get started by creating your first blog post.</p>
            <Link
              href="/admin/blogs/create"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-white transition-all duration-200"
              style={{ backgroundColor: '#1c4645' }}
            >
              <Plus size={20} />
              Create First Blog
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {blogs.map((blog) => (
              <article
                key={blog.id}
                className="bg-white border-2 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 group"
                style={{ 
                  borderColor: 'rgba(28, 70, 69, 0.1)',
                  boxShadow: '0 4px 6px -1px rgba(28, 70, 69, 0.05)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(28, 70, 69, 0.2)';
                  e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(28, 70, 69, 0.1), 0 10px 10px -5px rgba(28, 70, 69, 0.04)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(28, 70, 69, 0.1)';
                  e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(28, 70, 69, 0.05)';
                }}
              >
                <div className="flex gap-6">
                  {/* Blog Image */}
                  <div className="flex-shrink-0">
                    <img
                      src={blog.imageUrl}
                      alt={blog.title}
                      className="w-32 h-24 object-cover rounded-lg"
                    />
                  </div>

                  {/* Blog Content */}
                  <div className="flex-1 space-y-3">
                    <h2 className="text-xl font-bold text-gray-900 group-hover:text-opacity-80 transition-colors">
                      {blog.title}
                    </h2>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <User size={14} style={{ color: '#1c4645' }} />
                        <span>By {blog.author?.name || 'Admin'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar size={14} style={{ color: '#1c4645' }} />
                        <span>{new Date(blog.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3 pt-2">
                      <Link
                        href={`/blogs/${blog.id}`}
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 border-2"
                        style={{ 
                          borderColor: 'rgba(28, 70, 69, 0.2)',
                          color: '#1c4645'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'rgba(28, 70, 69, 0.05)';
                          e.currentTarget.style.borderColor = '#1c4645';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.borderColor = 'rgba(28, 70, 69, 0.2)';
                        }}
                      >
                        <Eye size={16} />
                        View
                      </Link>

                      <Link
                        href={`/admin/blogs/edit/${blog.id}`}
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-lg transition-all duration-200 hover:shadow-md"
                        style={{ backgroundColor: '#1c4645' }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#2d6a68';
                          e.currentTarget.style.transform = 'translateY(-1px)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '#1c4645';
                          e.currentTarget.style.transform = 'translateY(0)';
                        }}
                      >
                        <Edit3 size={16} />
                        Edit
                      </Link>

                      <button
                        onClick={() => setDeleteConfirm(blog)}
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-all duration-200 hover:shadow-md"
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-1px)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                        }}
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <DeleteConfirmModal
          blog={deleteConfirm}
          onConfirm={handleDelete}
          onCancel={() => setDeleteConfirm(null)}
        />
      )}
    </div>
  );
}