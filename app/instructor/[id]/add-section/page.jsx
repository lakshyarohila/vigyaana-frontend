'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useMutation } from '@tanstack/react-query';
import ProtectedRoute from '@/compoenets/ProtectedRoute';
import { Upload, Video, FileText, CalendarClock } from 'lucide-react';

export default function AddSectionPage({ params }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const courseId = params?.id || searchParams.get('id');

  const [course, setCourse] = useState(null);
  const [title, setTitle] = useState('');
  const [video, setVideo] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [scheduledAt, setScheduledAt] = useState('');

  // 🧠 Fetch course details
  useEffect(() => {
    if (!courseId) return;

    const fetchCourse = async () => {
      try {
        const res = await fetch(`https://vigyaana-server.onrender.com/api/courses/${courseId}`, {
          credentials: 'include',
        });
        if (!res.ok) throw new Error('Failed to load');
        const data = await res.json();
        setCourse(data);
      } catch (err) {
        toast.error('Failed to load course');
      }
    };

    fetchCourse();
  }, [courseId]);

  const uploadRecordedMutation = useMutation({
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

      if (!res.ok) throw new Error('Failed to upload section');
      return res.json();
    },
    onSuccess: () => {
      toast.success('Section uploaded');
      router.push('/instructor');
    },
    onError: (err) => toast.error(err.message || 'Upload failed'),
  });

  const createLiveSessionMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch('https://vigyaana-server.onrender.com/api/livesessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ courseId, topic: title, scheduledAt }),
      });

      if (!res.ok) throw new Error('Failed to create live session');
      return res.json();
    },
    onSuccess: () => {
      toast.success('Live session scheduled');
      router.push('/instructor');
    },
    onError: (err) => toast.error(err.message || 'Live session failed'),
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
    if (!course) return;

    if (course.type === 'RECORDED') {
      if (!title || !video) return toast.error('Please provide both title and video');
      uploadRecordedMutation.mutate();
    } else if (course.type === 'LIVE') {
      if (!title || !scheduledAt) return toast.error('Please provide topic and schedule');
      createLiveSessionMutation.mutate();
    }
  };

  if (!courseId) return <p className="text-center text-red-500">Invalid course ID</p>;
  if (!course) return null;

  return (
    <ProtectedRoute allowedRoles={['INSTRUCTOR']}>
      <div className="min-h-screen bg-gradient-to-br from-white to-gray-50 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#1c4645] rounded-full mb-4">
              {course.type === 'LIVE' ? (
                <CalendarClock className="w-8 h-8 text-white" />
              ) : (
                <Video className="w-8 h-8 text-white" />
              )}
            </div>
            <h1 className="text-3xl font-bold text-[#1c4645] mb-2">
              {course.type === 'LIVE' ? 'Add Live Session' : 'Add New Section'}
            </h1>
            <p className="text-gray-600">
              {course.type === 'LIVE'
                ? 'Schedule a live session for this course'
                : 'Upload a new video section to your course'}
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="px-8 py-6 bg-[#1c4645]">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <FileText className="w-5 h-5" />
                {course.type === 'LIVE' ? 'Live Session Details' : 'Section Details'}
              </h2>
            </div>

            <div className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-[#1c4645]">
                  {course.type === 'LIVE' ? 'Session Topic' : 'Section Title'}
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 text-black rounded-md"
                  placeholder={
                    course.type === 'LIVE' ? 'Enter live session topic' : 'Enter video title'
                  }
                />
              </div>

              {course.type === 'LIVE' ? (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-[#1c4645]">
                    Schedule Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    value={scheduledAt}
                    onChange={(e) => setScheduledAt(e.target.value)}
                    className="w-full px-4 py-3 border-2 text-black border-gray-300 rounded-md"
                  />
                </div>
              ) : (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-[#1c4645]">Upload Video</label>
                  <div
                    className={`relative border-2 border-dashed p-8 rounded-lg transition ${
                      isDragOver
                        ? 'border-[#1c4645] bg-[#1c4645]/10'
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
                        <>
                          <p className="text-[#1c4645] font-medium mb-1">{video.name}</p>
                          <p className="text-sm text-gray-500">
                            {(video.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="text-[#1c4645] font-medium mb-1">
                            Drop your video here or click to browse
                          </p>
                          <p className="text-sm text-gray-500">MP4, MOV, AVI supported</p>
                        </>
                      )}
                      <input
                        type="file"
                        accept="video/*"
                        onChange={(e) => setVideo(e.target.files[0])}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => router.push('/instructor')}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={
                    uploadRecordedMutation.isLoading || createLiveSessionMutation.isLoading
                  }
                  className="px-8 py-3 bg-[#1c4645] text-white rounded-lg hover:bg-[#2a5a58]"
                >
                  {uploadRecordedMutation.isLoading || createLiveSessionMutation.isLoading
                    ? 'Processing...'
                    : course.type === 'LIVE'
                    ? 'Schedule Session'
                    : 'Upload Section'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
