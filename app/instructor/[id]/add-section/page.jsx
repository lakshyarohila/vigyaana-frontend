'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import ProtectedRoute from '@/compoenets/ProtectedRoute';
import { Upload, Video, FileText } from 'lucide-react';

export default function AddSectionPage() {
  const { id: courseId } = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [title, setTitle] = useState('');
  const [video, setVideo] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const mutation = useMutation({
    mutationFn: async () => {
      const data = new FormData();
      data.append('title', title);
      data.append('courseId', courseId);
      data.append('video', video);

      const res = await fetch('https://vigyaana-server.onrender.com/api/sections', {
        method: 'POST',
        credentials: 'include',
        body: data,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to upload section');
      }

      return res.json();
    },
    onSuccess: () => {
      toast.success('Section uploaded');
      queryClient.invalidateQueries(['sections', courseId]);
      router.push('/instructor');
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files[0] && files[0].type.startsWith('video/')) {
      setVideo(files[0]);
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

  const handleSubmit = () => {
    if (!title || !video) {
      toast.error('Both title and video are required');
      return;
    }

    mutation.mutate();
  };

  return (
    <ProtectedRoute allowedRoles={['INSTRUCTOR']}>
      <div className="min-h-screen bg-gradient-to-br from-white to-gray-50 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#1c4645] rounded-full mb-4">
              <Video className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-[#1c4645] mb-2">Add New Section</h1>
            <p className="text-gray-600">Upload a new video section to your course</p>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="px-8 py-6 bg-[#1c4645]">
              <h2 className="text-xl font-semibold text-white flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Section Details
              </h2>
            </div>

            <div className="p-8 space-y-6">
              {/* Title Input */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-[#1c4645]">Section Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter section title..."
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#1c4645] focus:outline-none transition-colors duration-200 text-gray-700 placeholder-gray-400"
                />
              </div>

              {/* Video Upload */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-[#1c4645]">Video File</label>
                <div
                  className={`relative border-2 border-dashed rounded-lg p-8 transition-all duration-200 ${
                    isDragOver
                      ? 'border-[#1c4645] bg-[#1c4645]/5'
                      : video
                      ? 'border-[#1c4645] bg-[#1c4645]/5'
                      : 'border-gray-300 hover:border-[#1c4645]'
                  }`}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                >
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-[#1c4645]/10 rounded-full mb-4">
                      <Upload className="w-6 h-6 text-[#1c4645]" />
                    </div>

                    {video ? (
                      <div>
                        <p className="text-[#1c4645] font-medium mb-1">{video.name}</p>
                        <p className="text-sm text-gray-500">
                          {(video.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-[#1c4645] font-medium mb-1">
                          Drop your video here or click to browse
                        </p>
                        <p className="text-sm text-gray-500">
                          Supports MP4, AVI, MOV and other video formats
                        </p>
                      </div>
                    )}

                    <input
                      type="file"
                      accept="video/*"
                      onChange={(e) => setVideo(e.target.files[0])}
                      required
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => router.push('/instructor')}
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={mutation.isLoading}
                  className="px-8 py-3 bg-[#1c4645] text-white rounded-lg hover:bg-[#2a5a58] transition-all duration-200 font-medium transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  {mutation.isLoading ? 'Uploading...' : 'Upload Section'}
                </button>
              </div>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="mt-8 text-center">
            <div className="inline-flex items-center space-x-2 text-sm text-gray-500">
              <div className="w-2 h-2 bg-[#1c4645] rounded-full"></div>
              <span>Step 2 of 3: Add Course Content</span>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
