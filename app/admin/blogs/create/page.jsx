"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function CreateBlogPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Enhanced validation
    if (!title.trim()) {
      return toast.error("Please enter a blog title");
    }
    
    if (!content.trim()) {
      return toast.error("Please enter blog content");
    }
    
    if (!image) {
      return toast.error("Please select an image");
    }

    // Check file size (max 5MB)
    if (image.size > 5 * 1024 * 1024) {
      return toast.error("Image size should be less than 5MB");
    }

    // Check file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(image.type)) {
      return toast.error("Please select a valid image file (JPEG, PNG, WebP)");
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("content", content.trim());
    formData.append("image", image);

    try {
      console.log("🚀 Creating blog with:", { title, contentLength: content.length, imageSize: image.size });
      
      const res = await fetch("https://vigyaana-server.onrender.com/api/blogs", {
        method: "POST",
        credentials: "include",
        body: formData, // Don't set Content-Type header - let browser set it with boundary
      });

      console.log("📡 Response status:", res.status);
      console.log("📡 Response headers:", Object.fromEntries(res.headers.entries()));

      if (!res.ok) {
        // Try to get error message from response
        let errorMessage = "Blog creation failed";
        
        try {
          const errorData = await res.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch {
          // If JSON parsing fails, try text
          try {
            const errorText = await res.text();
            console.error("❌ Server Error Response:", errorText);
            
            // Check if it's an HTML error page
            if (errorText.includes("<html>")) {
              errorMessage = `Server error (${res.status}). Check server logs.`;
            } else {
              errorMessage = errorText || errorMessage;
            }
          } catch {
            errorMessage = `Server error (${res.status})`;
          }
        }
        
        throw new Error(errorMessage);
      }

      const data = await res.json();
      console.log("✅ Blog created successfully:", data);

      toast.success("Blog published successfully!");
      
      // Reset form
      setTitle("");
      setContent("");
      setImage(null);
      
      // Reset file input
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = '';
      
      // Navigate to blogs page
      router.push("/blogs");
      
    } catch (err) {
      console.error("❌ Blog creation error:", err);
      toast.error(err.message || "Failed to create blog");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">📝 Create New Blog</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title Input */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Blog Title
            </label>
            <input
              id="title"
              type="text"
              placeholder="Enter your blog title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading}
            />
          </div>

          {/* Image Upload */}
          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
              Blog Image
            </label>
            <input
              id="image"
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading}
            />
            {image && (
              <div className="mt-2 text-sm text-gray-600">
                Selected: {image.name} ({(image.size / 1024 / 1024).toFixed(2)} MB)
              </div>
            )}
          </div>

          {/* Content Textarea */}
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
              Blog Content
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 h-64 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
              placeholder="Write your blog content here..."
              disabled={loading}
            />
            <div className="mt-1 text-sm text-gray-500">
              {content.length} characters
            </div>
          </div>

          {/* Submit Button */}
          <button 
            className={`w-full px-6 py-3 rounded-lg font-medium transition-colors ${
              loading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
            type="submit"
            disabled={loading}
          >
            {loading ? "Publishing..." : "Publish Blog"}
          </button>
        </form>
      </div>
    </div>
  );
}