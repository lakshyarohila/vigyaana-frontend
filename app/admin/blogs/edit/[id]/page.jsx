'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getRequest } from '@/lib/api';
import toast from 'react-hot-toast';
import { Edit3, Upload, FileText, Save, Loader2, ArrowLeft, Image, Eye } from 'lucide-react';

export default function EditBlogPage() {
  const { id } = useParams();
  const router = useRouter();
  const [blog, setBlog] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (id) {
      getRequest(`/blogs/${id}`)
        .then((res) => {
          setBlog(res);
          setTitle(res.title);
          setContent(res.content);
          setImagePreview(res.imageUrl);
        })
        .catch(() => toast.error('Failed to load blog'));
    }
  }, [id]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

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
        {/* Header */}
        <div className="mb-8">
          <button 
            onClick={() => router.push('/admin/blogs')}
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
            Back to Admin
          </button>

          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Edit3 size={32} style={{ color: '#1c4645' }} />
              <h1 className="text-4xl font-bold" style={{ color: '#1c4645' }}>
                Edit Blog
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
                placeholder="Enter blog title..."
                disabled={loading}
              />
            </div>

            {/* Current and New Image */}
            <div className="space-y-4">
              <label className="flex items-center gap-2 text-sm font-semibold" style={{ color: '#1c4645' }}>
                <Image size={16} />
                Featured Image
              </label>
              
              {/* Current Image Preview */}
              {imagePreview && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <Eye size={14} />
                    {image ? 'New Image Preview' : 'Current Image'}
                  </div>
                  <div className="relative overflow-hidden rounded-lg">
                    <img 
                      src={imagePreview} 
                      alt="Current blog image" 
                      className="w-full h-64 object-cover"
                    />
                    {image && (
                      <div className="absolute top-4 right-4">
                        <button
                          type="button"
                          onClick={() => {
                            setImage(null);
                            setImagePreview(blog.imageUrl);
                            document.getElementById('image-upload').value = '';
                          }}
                          className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                        >
                          ×
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Upload New Image */}
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
                    {image ? `Selected: ${image.name}` : 'Click to upload a new image (optional)'}
                  </span>
                </label>
              </div>
            </div>

            {/* Content Field */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold" style={{ color: '#1c4645' }}>
                <Edit3 size={16} />
                Blog Content
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full border-2 p-4 rounded-lg text-gray-800 placeholder-gray-400 transition-all duration-200 focus:outline-none resize-none"
                style={{ 
                  borderColor: 'rgba(28, 70, 69, 0.2)',
                  minHeight: '350px'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#1c4645';
                  e.target.style.boxShadow = '0 0 0 3px rgba(28, 70, 69, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(28, 70, 69, 0.2)';
                  e.target.style.boxShadow = 'none';
                }}
                placeholder="Edit your blog content..."
                disabled={loading}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => router.push('/admin/blogs')}
                className="flex-1 py-4 px-6 rounded-lg font-semibold border-2 transition-all duration-200 hover:bg-gray-50"
                style={{ 
                  borderColor: 'rgba(28, 70, 69, 0.2)',
                  color: '#1c4645'
                }}
                disabled={loading}
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-3 py-4 px-6 rounded-lg font-semibold text-white transition-all duration-200 hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
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
                    Updating...
                  </>
                ) : (
                  <>
                    <Save size={20} />
                    Update Blog
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}