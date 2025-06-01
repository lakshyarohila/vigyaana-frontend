"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import ClientEditor from "@/compoenets/ClientEditor";

export default function CreateBlogPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !content || !image) {
      return toast.error("Please fill all fields");
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("image", image);

    try {
      await fetch("https://vigyaana-server.onrender.com/api/blogs", {
        method: "POST",
        credentials: "include", // ✅ Required to send auth cookies
        body: formData,
      });

      toast.success("Blog created!");
      router.push("/blogs");
    } catch (err) {
      toast.error("Failed to publish blog");
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">📝 Create Blog</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <input
          type="text"
          placeholder="Blog Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded"
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          className="w-full"
        />

        <ClientEditor value={content} onChange={setContent} />

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Publish Blog
        </button>
      </form>
    </div>
  );
}
