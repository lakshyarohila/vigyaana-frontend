'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { User, Calendar, ArrowLeft, Loader2 } from 'lucide-react';
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

  if (!blog) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center" style={{ backgroundColor: '#1c4645', opacity: 0.1 }}>
            <Loader2 size={28} style={{ color: '#1c4645' }} className="animate-spin" />
          </div>
          <p className="text-lg text-gray-600">Loading blog...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto py-12 px-4">
        {/* Back Navigation */}
        <button 
          onClick={() => window.history.back()}
          className="inline-flex items-center gap-2 mb-8 text-sm font-medium transition-all duration-200 hover:gap-3"
          style={{ color: '#1c4645' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#2d6a68';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = '#1c4645';
          }}
        >
          <ArrowLeft size={16} />
          Back to Blogs
        </button>

        <article className="space-y-8">
          {/* Hero Image */}
          <div className="relative overflow-hidden rounded-2xl shadow-lg">
            <img 
              src={blog.imageUrl} 
              className="w-full h-96 object-cover" 
              alt={blog.title}
            />
            <div 
              className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"
            ></div>
          </div>

          {/* Article Header */}
          <header className="space-y-6">
            <h1 className="text-5xl font-bold leading-tight" style={{ color: '#1c4645' }}>
              {blog.title}
            </h1>
            
            {/* Meta Information */}
            <div className="flex items-center gap-6 pb-6 border-b-2" style={{ borderColor: 'rgba(28, 70, 69, 0.1)' }}>
              <div className="flex items-center gap-2 text-gray-600">
                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#1c4645', opacity: 0.1 }}>
                  <User size={16} style={{ color: '#1c4645' }} />
                </div>
                <span className="font-medium">By {blog.author?.name || 'Admin'}</span>
              </div>
              
              <div className="flex items-center gap-2 text-gray-600">
                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#1c4645', opacity: 0.1 }}>
                  <Calendar size={16} style={{ color: '#1c4645' }} />
                </div>
                <span>{new Date(blog.createdAt).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</span>
              </div>
            </div>
          </header>

          {/* Article Content */}
          <div className="prose prose-lg max-w-none">
            <div 
              className="text-lg text-gray-800 whitespace-pre-line leading-relaxed"
              style={{ 
                lineHeight: '1.8',
                fontSize: '1.125rem'
              }}
            >
              {blog.content}
            </div>
          </div>

          {/* Article Footer */}
          <footer className="pt-8 mt-12 border-t-2" style={{ borderColor: 'rgba(28, 70, 69, 0.1)' }}>
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Published on {new Date(blog.createdAt).toLocaleDateString('en-US', { 
                  weekday: 'long',
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
              
              <button 
                onClick={() => window.history.back()}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:shadow-md"
                style={{ 
                  backgroundColor: '#1c4645',
                  color: 'white'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#2d6a68';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#1c4645';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <ArrowLeft size={16} />
                Back to All Blogs
              </button>
            </div>
          </footer>
        </article>
      </div>
    </div>
  );
}