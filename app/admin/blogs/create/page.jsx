'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { PenTool, Upload, FileText, Send, Loader2, ArrowLeft, Image } from 'lucide-react';

export default function CreateBlogPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const router = useRouter();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim() || !image) {
      return toast.error('Please fill in all fields');
    }

    setLoading(true);

    const formData = new FormData();
    formData.append('title', title.trim());
    formData.append('content', content.trim());
    formData.append('image', image);

    try {
      const res = await fetch('https://vigyaana-server.onrender.com/api/blogs', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to create blog');

      toast.success('✅ Blog published');
      router.push('/blogs');
    } catch (err) {
      toast.error(err.message);
      console.error('Blog create error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto py-12 px-4">
        {/* Header */}
        <div className="mb-8">
          <button 
            onClick={() => router.push('/blogs')}
            className="inline-flex items-center gap-2 mb-6 text-sm font-medium transition-all duration-200 hover:gap-3"
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

          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <PenTool size={32} style={{ color: '#1c4645' }} />
              <h1 className="text-4xl font-bold" style={{ color: '#1c4645' }}>
                Write a New Blog
              </h1>
            </div>
            <div className="w-24 h-1 mx-auto" style={{ backgroundColor: '#1c4645' }}></div>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-lg border-2 p-8" style={{ borderColor: 'rgba(28, 70, 69, 0.1)' }}>
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Title Field */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold" style={{ color: '#1c4645' }}>
                <FileText size={16} />
                Blog Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border-2 p-4 rounded-lg text-gray-800 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:ring-2"
                style={{ 
                  borderColor: 'rgba(28, 70, 69, 0.2)',
                  focusRingColor: 'rgba(28, 70, 69, 0.3)'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#1c4645';
                  e.target.style.boxShadow = '0 0 0 3px rgba(28, 70, 69, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(28, 70, 69, 0.2)';
                  e.target.style.boxShadow = 'none';
                }}
                placeholder="Enter an engaging blog title..."
                disabled={loading}
              />
            </div>

            {/* Image Upload Field */}
            <div className="space-y-4">
              <label className="flex items-center gap-2 text-sm font-semibold" style={{ color: '#1c4645' }}>
                <Image size={16} />
                Featured Image
              </label>
              
              <div className="space-y-4">
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    disabled={loading}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="flex items-center justify-center gap-3 w-full p-6 border-2 border-dashed rounded-lg cursor-pointer transition-all duration-200 hover:bg-gray-50"
                    style={{ borderColor: 'rgba(28, 70, 69, 0.3)' }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#1c4645';
                      e.currentTarget.style.backgroundColor = 'rgba(28, 70, 69, 0.02)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(28, 70, 69, 0.3)';
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <Upload size={24} style={{ color: '#1c4645' }} />
                    <span className="text-gray-600">
                      {image ? image.name : 'Click to upload an image or drag and drop'}
                    </span>
                  </label>
                </div>

                {/* Image Preview */}
                {imagePreview && (
                  <div className="relative overflow-hidden rounded-lg">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="w-full h-64 object-cover"
                    />
                    <div className="absolute top-4 right-4">
                      <button
                        type="button"
                        onClick={() => {
                          setImage(null);
                          setImagePreview(null);
                          document.getElementById('image-upload').value = '';
                        }}
                        className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Content Field */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold" style={{ color: '#1c4645' }}>
                <PenTool size={16} />
                Blog Content
              </label>
              <textarea 
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full border-2 p-4 rounded-lg text-gray-800 placeholder-gray-400 transition-all duration-200 focus:outline-none resize-none"
                style={{ 
                  borderColor: 'rgba(28, 70, 69, 0.2)',
                  minHeight: '300px'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#1c4645';
                  e.target.style.boxShadow = '0 0 0 3px rgba(28, 70, 69, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(28, 70, 69, 0.2)';
                  e.target.style.boxShadow = 'none';
                }}
                placeholder="Share your thoughts, insights, and stories..."
                disabled={loading}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 py-4 px-6 rounded-lg font-semibold text-white transition-all duration-200 hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ 
                backgroundColor: loading ? '#9ca3af' : '#1c4645'
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.backgroundColor = '#2d6a68';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.currentTarget.style.backgroundColor = '#1c4645';
                  e.currentTarget.style.transform = 'translateY(0)';
                }
              }}
            >
              {loading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Publishing...
                </>
              ) : (
                <>
                  <Send size={20} />
                  Publish Blog
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}