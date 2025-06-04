"use client";

import { useParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { getRequest } from "@/lib/api";
import ProtectedRoute from "@/compoenets/ProtectedRoute";
import toast from "react-hot-toast";
import { BookOpen, Play, BarChart3, CheckCircle, ChevronLeft, ChevronRight } from "lucide-react";

// Video.js imports
import videojs from 'video.js';
import 'video.js/dist/video-js.css';

export default function CourseWatchPage() {
  const { id: courseId } = useParams();
  const [sections, setSections] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  const videoRef = useRef(null);
  const playerRef = useRef(null);

  useEffect(() => {
    setIsLoading(true);
    getRequest(`/enrollments/sections/${courseId}`)
      .then((res) => {
        setSections(res.sections);
        setIsLoading(false);
      })
      .catch(() => {
        toast.error("Failed to load sections");
        setIsLoading(false);
      });
  }, [courseId]);

  // Initialize Video.js player
  useEffect(() => {
    if (!isLoading && sections.length > 0 && videoRef.current && !playerRef.current) {
      const videoElement = videoRef.current;
      
      playerRef.current = videojs(videoElement, {
        controls: true,
        responsive: true,
        fluid: true,
        playbackRates: [0.5, 1, 1.25, 1.5, 2],
        plugins: {
          seekButtons: {
            forward: 10,
            back: 10
          }
        }
      });

      // Handle video end
      playerRef.current.on('ended', handleVideoEnd);
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, [isLoading, sections]);

  // Update video source when active section changes
  useEffect(() => {
    if (playerRef.current && sections[activeIndex]) {
      playerRef.current.src({
        src: sections[activeIndex].videoUrl,
        type: 'video/mp4'
      });
    }
  }, [activeIndex, sections]);

  const handleVideoEnd = async () => {
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
      
      // Auto-advance to next video if available
      if (activeIndex < sections.length - 1) {
        setTimeout(() => {
          setActiveIndex(activeIndex + 1);
        }, 2000);
      }
    } catch (err) {
      toast.error("Failed to update progress");
    }
  };

  const handleSectionClick = (index) => {
    setActiveIndex(index);
    if (window.innerWidth < 768) {
      setSidebarCollapsed(true);
    }
  };

  const currentSection = sections[activeIndex];

  if (isLoading) {
    return (
      <ProtectedRoute allowedRoles={["STUDENT"]}>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderColor: '#1c4645' }}></div>
            <p className="text-gray-600">Loading course content...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute allowedRoles={["STUDENT"]}>
      <div className="min-h-screen bg-gray-50">
        <div className="flex h-screen">
          {/* Mobile Sidebar Toggle */}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className={`md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white shadow-lg border ${
              sidebarCollapsed ? 'text-gray-600' : 'text-white bg-opacity-20'
            }`}
          >
            {sidebarCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>

          {/* Left Sidebar */}
          <div className={`${
            sidebarCollapsed ? '-translate-x-full md:translate-x-0' : 'translate-x-0'
          } fixed md:relative z-40 w-80 md:w-96 h-full overflow-y-auto transition-transform duration-300 ease-in-out`}
          style={{ backgroundColor: '#1c4645' }}>
            
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <BookOpen className="text-white" size={24} />
                <h2 className="text-lg font-bold text-white">Course Sections</h2>
              </div>
              
              {/* Progress Card */}
              <div className="mb-6 p-4 bg-white bg-opacity-10 rounded-xl backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-3">
                  <BarChart3 className="text-white" size={18} />
                  <span className="text-white text-sm font-semibold">Overall Progress</span>
                </div>
                <div className="w-full bg-white bg-opacity-20 rounded-full h-3 mb-2">
                  <div 
                    className="bg-gradient-to-r from-green-400 to-blue-500 h-3 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-white text-xs">
                  <span>{Math.round(progress)}% Complete</span>
                  <span>{activeIndex + 1} of {sections.length} lessons</span>
                </div>
              </div>

              {/* Sections List */}
              <div className="space-y-2">
                {sections.map((sec, i) => (
                  <div
                    key={sec.id}
                    onClick={() => handleSectionClick(i)}
                    className={`cursor-pointer p-4 rounded-xl transition-all duration-200 flex items-start gap-3 group ${
                      i === activeIndex
                        ? "bg-white text-gray-900 shadow-lg transform scale-[1.02]"
                        : "text-white hover:bg-white hover:bg-opacity-15 hover:transform hover:scale-[1.01]"
                    }`}
                  >
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      i === activeIndex 
                        ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md" 
                        : i < activeIndex 
                          ? "bg-gradient-to-r from-green-400 to-green-600 text-white" 
                          : "bg-white bg-opacity-20 text-white group-hover:bg-opacity-30"
                    }`}>
                      {i < activeIndex ? <CheckCircle size={16} /> : i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-semibold leading-tight mb-1 ${
                        i === activeIndex ? "text-gray-900" : "text-white"
                      }`}>
                        {sec.title}
                      </p>
                      {sec.duration && (
                        <p className={`text-xs ${
                          i === activeIndex ? "text-gray-600" : "text-white text-opacity-80"
                        }`}>
                          Duration: {sec.duration}
                        </p>
                      )}
                    </div>
                    {i === activeIndex && (
                      <div className="flex-shrink-0">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className={`flex-1 flex flex-col overflow-hidden ${
            sidebarCollapsed ? '' : 'md:ml-0'
          }`}>
            
            {/* Video Container */}
            <div className="flex-1 p-4 md:p-6 bg-black">
              {currentSection ? (
                <div className="h-full flex items-center justify-center">
                  <div className="w-full max-w-6xl">
                    <div data-vjs-player className="w-full">
                      <video
                        ref={videoRef}
                        className="video-js vjs-default-skin"
                        controls
                        preload="auto"
                        data-setup="{}"
                        style={{ width: '100%', height: 'auto' }}
                      >
                        <p className="vjs-no-js">
                          To view this video please enable JavaScript, and consider upgrading to a web browser that{' '}
                          <a href="https://videojs.com/html5-video-support/" target="_blank" rel="noopener noreferrer">
                            supports HTML5 video
                          </a>.
                        </p>
                      </video>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center text-white">
                    <Play size={48} className="mx-auto mb-4 opacity-50" />
                    <p className="text-lg">Select a lesson to start watching</p>
                  </div>
                </div>
              )}
            </div>

            {/* Video Info Section */}
            {currentSection && (
              <div className="bg-white border-t border-gray-200 p-4 md:p-6">
                <div className="max-w-6xl mx-auto">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                    <div>
                      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                        {currentSection.title}
                      </h1>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
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
                    
                    {/* Navigation Buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => setActiveIndex(Math.max(0, activeIndex - 1))}
                        disabled={activeIndex === 0}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors flex items-center gap-2"
                      >
                        <ChevronLeft size={16} />
                        Previous
                      </button>
                      <button
                        onClick={() => setActiveIndex(Math.min(sections.length - 1, activeIndex + 1))}
                        disabled={activeIndex === sections.length - 1}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors flex items-center gap-2"
                      >
                        Next
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                  
                  {currentSection.description && (
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                      <h3 className="font-semibold text-gray-900 mb-2">Lesson Description</h3>
                      <p className="text-gray-700 leading-relaxed">{currentSection.description}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Overlay for Mobile */}
        {!sidebarCollapsed && (
          <div 
            className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
            onClick={() => setSidebarCollapsed(true)}
          />
        )}
      </div>
    </ProtectedRoute>
  );
}