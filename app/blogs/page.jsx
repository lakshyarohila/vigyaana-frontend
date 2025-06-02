'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Newspaper, User, Calendar, ArrowRight, FileText } from 'lucide-react';
import { getRequest } from '@/lib/api'; // make sure base URL is configured

export default function BlogsPage() {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    getRequest('/blogs')
      .then(setBlogs)
      .catch(() => console.error('Failed to load blogs'));
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-4 py-12 space-y-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Newspaper size={32} style={{ color: '#1c4645' }} />
            <h1 className="text-4xl font-bold" style={{ color: '#1c4645' }}>
              Vigyana Blogs
            </h1>
          </div>
          <div className="w-24 h-1 mx-auto" style={{ backgroundColor: '#1c4645' }}></div>
        </div>

        {blogs.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: '#1c4645', opacity: 0.1 }}>
              <FileText size={28} style={{ color: '#1c4645' }} />
            </div>
            <p className="text-gray-500 text-lg">No blog posts found.</p>
          </div>
        )}

        <div className="grid gap-8">
          {blogs.map(blog => (
            <article 
              key={blog.id} 
              className="bg-white border-2 border-gray-100 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:border-opacity-20 group"
              style={{ 
                borderColor: 'rgba(28, 70, 69, 0.1)',
                boxShadow: '0 4px 6px -1px rgba(28, 70, 69, 0.05), 0 2px 4px -1px rgba(28, 70, 69, 0.03)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(28, 70, 69, 0.2)';
                e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(28, 70, 69, 0.1), 0 10px 10px -5px rgba(28, 70, 69, 0.04)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(28, 70, 69, 0.1)';
                e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(28, 70, 69, 0.05), 0 2px 4px -1px rgba(28, 70, 69, 0.03)';
              }}
            >
              <div className="relative overflow-hidden rounded-lg mb-6">
                <img 
                  src={blog.imageUrl} 
                  className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105" 
                  alt={blog.title}
                />
                <div 
                  className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                ></div>
              </div>
              
              <div className="space-y-4">
                <h2 className="text-2xl font-bold leading-tight group-hover:text-opacity-80 transition-colors" style={{ color: '#1c4645' }}>
                  {blog.title}
                </h2>
                
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <User size={16} style={{ color: '#1c4645' }} />
                    <span>By {blog.author?.name || 'Admin'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={16} style={{ color: '#1c4645' }} />
                    <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                
                <Link 
                  href={`/blogs/${blog.id}`} 
                  className="inline-flex items-center gap-2 font-medium transition-all duration-200 group/link"
                  style={{ color: '#1c4645' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#2d6a68';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#1c4645';
                  }}
                >
                  Read More
                  <ArrowRight size={16} className="transition-transform group-hover/link:translate-x-1" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}