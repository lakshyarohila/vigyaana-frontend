'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';
import ProtectedRoute from '@/compoenets/ProtectedRoute';
import { Upload, Video, ArrowLeft, Plus, BookOpen } from 'lucide-react';

export default function AddSectionPage() {
  const { id: courseId } = useParams();
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [video, setVideo] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);
    
    const data = new FormData();
    data.append('title', title);
    data.append('courseId', courseId);
    data.append('video', video);

    try {
      await fetch('https://vigyaana-server.onrender.com/api/sections', {
        method: 'POST',
        credentials: 'include',
        body: data,
      });
      toast.success('Section added');
      router.push('/instructor');
    } catch (err) {
      toast.error('Failed to upload section');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setVideo(file);
  };

  return (
    <ProtectedRoute allowedRoles={['INSTRUCTOR']}>
      <div className="min-h-screen bg-gray-50">
        {/* Header Bar */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <button 
              onClick={() => router.push('/instructor')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft size={20} />
              <span className="font-medium">Back to Dashboard</span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-2xl mx-auto px-4 py-8">
          {/* Page Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{ backgroundColor: '#1c4546' }}>
              <BookOpen size={32} color="white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Add New Section</h1>
            <p className="text-gray-600">Upload a video section to enhance your course</p>
          </div>

          {/* Form Container */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            {/* Form Header */}
            <div className="px-8 py-6 border-b border-gray-200" style={{ backgroundColor: '#1c4546' }}>
              <div className="flex items-center gap-3">
                <Plus size={24} color="white" />
                <h2 className="text-xl font-semibold text-white">Section Details</h2>
              </div>
            </div>

            {/* Form Body */}
            <div className="px-8 py-8">
              <div className="space-y-6" onSubmit={handleSubmit}>
                {/* Title Input */}
                <div>
                  <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-3">
                    Section Title *
                  </label>
                  <input
                    id="title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter a descriptive title for your section..."
                    required
                    className="w-full px-4 py-3 text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 focus:border-transparent transition-all"
                    style={{ '--tw-ring-color': '#1c4546' }}
                  />
                </div>

                {/* Video Upload */}
                <div>
                  <label htmlFor="video" className="block text-sm font-semibold text-gray-700 mb-3">
                    Video File *
                  </label>
                  <div className="relative">
                    <input
                      id="video"
                      type="file"
                      accept="video/*"
                      onChange={handleFileChange}
                      required
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
                      video ? 'border-green-400 bg-green-50' : 'border-gray-300 hover:border-gray-400'
                    }`}>
                      <div className="flex flex-col items-center gap-4">
                        <div className={`p-4 rounded-full ${
                          video ? 'bg-green-100' : 'bg-gray-100'
                        }`}>
                          {video ? (
                            <Video size={32} color="#10b981" />
                          ) : (
                            <Upload size={32} color="#6b7280" />
                          )}
                        </div>
                        {video ? (
                          <div className="text-center">
                            <p className="font-semibold text-green-700">{video.name}</p>
                            <p className="text-sm text-green-600 mt-1">
                              {(video.size / (1024 * 1024)).toFixed(2)} MB • Ready to upload
                            </p>
                          </div>
                        ) : (
                          <div className="text-center">
                            <p className="font-semibold text-gray-700 mb-1">
                              Drop your video here or click to browse
                            </p>
                            <p className="text-sm text-gray-500">
                              Supports MP4, MOV, AVI • Maximum 500MB
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Upload Button */}
                <div className="pt-4">
                  <button
                    onClick={handleSubmit}
                    disabled={isUploading || !title || !video}
                    className="w-full flex items-center justify-center gap-3 px-6 py-4 text-white font-semibold rounded-lg transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
                    style={{ backgroundColor: '#1c4546' }}
                  >
                    {isUploading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                        <span>Uploading Section...</span>
                      </>
                    ) : (
                      <>
                        <Upload size={20} />
                        <span>Upload Section</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Help Section */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <Video size={24} className="text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-blue-900 mb-2">Upload Guidelines</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Choose a clear, descriptive title that explains the section content</li>
                  <li>• Ensure video quality is good and audio is clear</li>
                  <li>• Keep file size under 500MB for optimal upload performance</li>
                  <li>• Supported formats: MP4 (recommended), MOV, AVI</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}