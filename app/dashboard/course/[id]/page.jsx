"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getRequest } from "@/lib/api";
import ProtectedRoute from "@/compoenets/ProtectedRoute";
import toast from "react-hot-toast";
import ReactPlayer from "react-player";

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
      <div className="w-full h-[calc(100vh-4rem)] grid grid-cols-1 md:grid-cols-4">
        {/* 📚 Left Sidebar */}
        <div className="col-span-1 bg-gray-700 overflow-y-auto p-4 border-r">
          <h2 className="text-lg font-bold mb-4">Course Sections</h2>
          <ul className="space-y-2">
            {sections.map((sec, i) => (
              <li
                key={sec.id}
                onClick={() => setActiveIndex(i)}
                className={`cursor-pointer p-2 rounded ${
                  i === activeIndex
                    ? "bg-blue-600 text-white"
                    : "hover:bg-gray-200"
                }`}
              >
                {i + 1}. {sec.title}
              </li>
            ))}
          </ul>
        </div>

        {/* 🎥 Main Video Area */}
        <div className="col-span-3 flex flex-col p-4 space-y-4">
          {currentSection ? (
            <>
              <div className="w-full aspect-video bg-black rounded overflow-hidden">
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
              <h1 className="text-2xl font-bold">{currentSection.title}</h1>
              <p className="text-sm text-gray-500">
                Progress: {Math.round(progress)}%
              </p>
            </>
          ) : (
            <p>Loading video...</p>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
