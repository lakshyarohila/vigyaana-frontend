"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getRequest } from "@/lib/api";
import ProtectedRoute from "@/compoenets/ProtectedRoute";
import toast from "react-hot-toast";
import ReactPlayer from "react-player";
import { BookOpen, Play, BarChart3, CheckCircle } from "lucide-react";

export default function CourseWatchPage() {
  const { id: courseId } = useParams();
  const [sections, setSections] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    getRequest(`/enrollments/sections/${courseId}`)
      .then((res) => {
        setSections(res.sections);
      })
      .catch(() => toast.error("Failed to load sections"));
  }, [courseId]);

  const handleVideoEnd = async () => {
    const newProgress = Math.min(
      100,
      ((activeIndex + 1) / sections.length) * 100
    );
    try {
      await fetch(
        `http://localhost:5000/api/enrollments/progress/${courseId}`,
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

  return (
    <ProtectedRoute allowedRoles={["STUDENT"]}>
      <div className="w-full h-[calc(100vh-4rem)] grid grid-cols-1 md:grid-cols-4 bg-white">
        {/* Left Sidebar */}
        <div className="col-span-1 overflow-y-auto p-6 border-r border-gray-200" style={{ backgroundColor: '#1c4645' }}>
          <div className="flex items-center gap-3 mb-6">
            <BookOpen className="text-white" size={24} />
            <h2 className="text-lg font-bold text-white">Course Sections</h2>
          </div>
          
          <div className="mb-4 p-3 bg-white bg-opacity-10 rounded-lg">
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

          <ul className="space-y-2">
            {sections.map((sec, i) => (
              <li
                key={sec.id}
                onClick={() => setActiveIndex(i)}
                className={`cursor-pointer p-3 rounded-lg transition-all duration-200 flex items-start gap-3 ${
                  i === activeIndex
                    ? "bg-white text-gray-900 shadow-md"
                    : "text-white hover:bg-white hover:bg-opacity-10 hover:text-white"
                }`}
              >
                <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold mt-0.5 ${
                  i === activeIndex 
                    ? "bg-gray-900 text-white" 
                    : i < activeIndex 
                      ? "bg-green-500 text-white" 
                      : "bg-white bg-opacity-20 text-white"
                }`}>
                  {i < activeIndex ? <CheckCircle size={14} /> : i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium leading-tight ${
                    i === activeIndex ? "text-gray-900" : "text-white"
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

        {/* Main Video Area */}
        <div className="col-span-3 flex flex-col p-6 space-y-6 bg-white">
          {currentSection ? (
            <>
              <div className="w-full aspect-video bg-black rounded-xl overflow-hidden shadow-lg">
                <ReactPlayer
                  url={currentSection.videoUrl}
                  width="100%"
                  height="100%"
                  controls
                  config={{
                    file: {
                      attributes: {
                        controlsList: "nodownload",
                      },
                    },
                  }}
                  onEnded={handleVideoEnd}
                />
              </div>
              
              <div className="space-y-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{currentSection.title}</h1>
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
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-700 leading-relaxed">{currentSection.description}</p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderColor: '#1c4645' }}></div>
                <p className="text-gray-600">Loading video...</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}