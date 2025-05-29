'use client';

import { useState } from 'react';
import { Upload, Video, FileText, ArrowLeft, Plus } from 'lucide-react';

// Mock ProtectedRoute component for demonstration
const ProtectedRoute = ({ children, allowedRoles }) => {
  return <div>{children}</div>;
};

export default function AddSectionPage() {
  const [title, setTitle] = useState('');
  const [video, setVideo] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('title', title);
    data.append('courseId', 'demo-course-id');
    data.append('video', video);

    try {
      // Simulated API call
      console.log('Uploading section:', { title, video: video?.name });
      alert('Section added successfully!');
      // router.push('/instructor');
    } catch (err) {
      alert('Failed to upload section');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0].type.startsWith('video/')) {
      setVideo(files[0]);
    }
  };

  return (
    <ProtectedRoute allowedRoles={['INSTRUCTOR']}>
      <div className="min-h-screen bg-white">
        {/* Header */}
        <div className="border-b border-gray-100 bg-white">
          <div className="max-w-4xl mx-auto px-6 py-4">
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors">
                <ArrowLeft size={20} />
                <span>Back to Course</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-2xl mx-auto px-6 py-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-gray-50 to-white px-8 py-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#1c4645' }}>
                  <Plus className="text-white" size={24} />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Add New Section</h1>
                  <p className="text-gray-600 mt-1">Upload video content and add section details</p>
                </div>
              </div>
            </div>

            {/* Form Section */}
            <div className="p-8">
              <div className="space-y-6">
                {/* Title Input */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <FileText size={16} />
                    Section Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter section title..."
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-opacity-20 focus:border-transparent outline-none transition-all duration-200 text-gray-900 placeholder-gray-500"
                    style={{ focusRingColor: '#1c4645' }}
                  />
                </div>

                {/* Video Upload */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <Video size={16} />
                    Video File
                  </label>
                  
                  <div
                    className={`relative border-2 border-dashed rounded-lg p-8 transition-all duration-200 ${
                      isDragOver
                        ? 'border-green-400 bg-green-50'
                        : video
                        ? 'border-green-300 bg-green-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <input
                      type="file"
                      accept="video/*"
                      onChange={(e) => setVideo(e.target.files[0])}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    
                    <div className="text-center">
                      {video ? (
                        <div className="space-y-2">
                          <div className="w-16 h-16 mx-auto rounded-lg flex items-center justify-center bg-green-100">
                            <Video className="text-green-600" size={32} />
                          </div>
                          <p className="text-sm font-medium text-green-700">{video.name}</p>
                          <p className="text-xs text-green-600">
                            {(video.size / (1024 * 1024)).toFixed(1)} MB
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div className="w-16 h-16 mx-auto rounded-lg flex items-center justify-center bg-gray-100">
                            <Upload className="text-gray-400" size={32} />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-700">
                              Drop your video here, or click to browse
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              Supports MP4, MOV, AVI and other video formats
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <button
                    onClick={handleSubmit}
                    className="w-full text-white py-3 px-6 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                    style={{ 
                      backgroundColor: '#1c4645',
                      ':hover': { backgroundColor: '#0f2928' }
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#0f2928'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#1c4645'}
                  >
                    <Upload size={20} />
                    Upload Section
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Help Text */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-100">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Tips for uploading:</h3>
            <ul className="space-y-1 text-xs text-gray-600">
              <li>• Keep video files under 500MB for faster uploads</li>
              <li>• Use descriptive titles to help students navigate</li>
              <li>• Ensure good audio quality for better learning experience</li>
            </ul>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}