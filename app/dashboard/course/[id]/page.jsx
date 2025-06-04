"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getRequest } from "@/lib/api";
import ProtectedRoute from "@/compoenets/ProtectedRoute";
import toast from "react-hot-toast";
import { MediaPlayer, MediaProvider } from '@vidstack/react';
import { defaultLayoutIcons, DefaultVideoLayout } from '@vidstack/react/player/layouts/default';
import '@vidstack/react/player/styles/default/theme.css';
import '@vidstack/react/player/styles/default/layouts/video.css';
import { BookOpen, Play, BarChart3, CheckCircle } from "lucide-react";

export default function CourseWatchPage() {
  const { id: courseId } = useParams();
  const [sections, setSections] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getRequest(`/enrollments/sections/${courseId}`)
      .then((res) => {
        setSections(res.sections);
        setLoading(false);
      })
      .catch(() => {
        toast.error("Failed to load sections");
        setLoading(false);
      });
  }, [courseId]);

  const handleVideoEnd = async () => {
    if (sections.length === 0) return;
    
    const newProgress = Math.min(
      100,
      ((activeIndex + 1) / sections.length) * 100
    );
    
    try {
      await fetch(
        `https://vigyaana-server.onrender.com/api/enrollments/progress/${courseId}`,
        {
          method: "PATCH",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ progress: newProgress }),
        }
      );
      toast.success(`Progress updated to ${Math.round(newProgress)}%`);
      setProgress(newProgress);
    } catch (err) {
      toast.error("Failed to update progress");
    }
  };

  const currentSection = sections[activeIndex];

  if (loading) {
    return (
      <ProtectedRoute allowedRoles={["STUDENT"]}>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderColor: '#1c4645' }}></div>
            <p className="text-gray-600">Loading course...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute allowedRoles={["STUDENT"]}>
      <div className="min-h-screen bg-gray-50">
        <div className="flex flex-col lg:flex-row min-h-screen">
          {/* Left Sidebar */}
          <div className="w-full lg:w-80 xl:w-96 bg-white shadow-lg border-r border-gray-200 lg:min-h-screen">
            <div className="sticky top-0 bg-white z-10 border-b border-gray-200">
              <div className="p-6" style={{ backgroundColor: '#1c4645' }}>
                <div className="flex items-center gap-3 mb-4">
                  <BookOpen className="text-white" size={24} />
                  <h2 className="text-lg font-bold text-white">Course Sections</h2>
                </div>
                
                <div className="p-3 bg-white bg-opacity-10 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <BarChart3 className="text-white" size={16} />
                    <span className="text-white text-sm font-medium">Progress</span>
                  </div>
                  <div className="w-full bg-white bg-opacity-20 rounded-full h-2">
                    <div 
                      className="bg-white h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <p className="text-white text-xs mt-1">{Math.round(progress)}% Complete</p>
                </div>
              </div>
            </div>

            <div className="p-4 max-h-[calc(100vh-200px)] lg:max-h-[calc(100vh-250px)] overflow-y-auto">
              <ul className="space-y-2">
                {sections.map((sec, i) => (
                  <li
                    key={sec.id}
                    onClick={() => setActiveIndex(i)}
                    className={`cursor-pointer p-3 rounded-lg transition-all duration-200 flex items-start gap-3 ${
                      i === activeIndex
                        ? "bg-gray-100 border-2 border-gray-300 shadow-sm"
                        : "hover:bg-gray-50 border border-transparent"
                    }`}
                  >
                    <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold mt-0.5 ${
                      i === activeIndex 
                        ? "bg-gray-900 text-white" 
                        : i < activeIndex 
                          ? "bg-green-500 text-white" 
                          : "bg-gray-200 text-gray-600"
                    }`}>
                      {i < activeIndex ? <CheckCircle size={14} /> : i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium leading-tight ${
                        i === activeIndex ? "text-gray-900" : "text-gray-700"
                      }`}>
                        {sec.title}
                      </p>
                    </div>
                    {i === activeIndex && (
                      <Play size={16} className="flex-shrink-0 text-gray-600" />
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Main Video Area */}
          <div className="flex-1 p-6 bg-white min-h-screen">
            {currentSection ? (
              <div className="max-w-5xl mx-auto space-y-6">
                {/* Video Player */}
                <div className="w-full aspect-video bg-black rounded-xl overflow-hidden shadow-lg">
                  <MediaPlayer
                    src={currentSection.videoUrl}
                    viewType="video"
                    streamType="on-demand"
                    logLevel="warn"
                    crossOrigin
                    playsInline
                    onEnd={handleVideoEnd}
                    className="w-full h-full"
                  >
                    <MediaProvider />
                    <DefaultVideoLayout
                      thumbnails={currentSection.thumbnail || undefined}
                      icons={defaultLayoutIcons}
                    />
                  </MediaPlayer>
                </div>
                
                {/* Video Info */}
                <div className="space-y-4">
                  <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                      {currentSection.title}
                    </h1>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Play size={16} />
                        Lesson {activeIndex + 1} of {sections.length}
                      </span>
                      <span className="flex items-center gap-1">
                        <BarChart3 size={16} />
                        {Math.round(progress)}% Complete
                      </span>
                    </div>
                  </div>
                  
                  {currentSection.description && (
                    <div className="p-4 bg-gray-50 rounded-lg border">
                      <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                      <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                        {currentSection.description}
                      </p>
                    </div>
                  )}

                  {/* Navigation */}
                  <div className="flex justify-between items-center pt-4">
                    <button
                      onClick={() => setActiveIndex(Math.max(0, activeIndex - 1))}
                      disabled={activeIndex === 0}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors"
                    >
                      Previous
                    </button>
                    <span className="text-sm text-gray-500">
                      {activeIndex + 1} / {sections.length}
                    </span>
                    <button
                      onClick={() => setActiveIndex(Math.min(sections.length - 1, activeIndex + 1))}
                      disabled={activeIndex === sections.length - 1}
                      className="px-4 py-2 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
                      style={{ backgroundColor: '#1c4645' }}
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <p className="text-gray-600">No sections available</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}