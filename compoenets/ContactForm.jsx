"use client";

import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill in all fields!");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post("/api/submit", formData);

      if (response.status === 200) {
        toast.success("We Received Your Form 🫡", {
          style: {
            border: "2px solid #1c4645",
            padding: "18px",
            color: "#ffffff",
            background: "#1c4645",
            borderRadius: "12px",
            boxShadow: "0 6px 20px rgba(28, 70, 69, 0.6)",
            fontWeight: "600",
            fontFamily: "system-ui, sans-serif",
            letterSpacing: "0.5px",
          },
          iconTheme: {
            primary: "#ffffff",
            secondary: "#1c4645",
          },
          duration: 5000,
          position: "top-center",
          icon: "🏆",
          className: "premium-toast",
        });

        setFormData({ name: "", email: "", message: "" }); // Reset form
      } else {
        toast.error(response.data?.error || "Error sending message. Try again later.");
      }
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      toast.error(error.response?.data?.error || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-6 space-y-4 border rounded-lg bg-white text-[#1c4645] border-[#1c4645]">
      <h2 className="text-2xl font-bold mb-4">Contact Us</h2>

      <input
        type="text"
        name="name"
        placeholder="Your Name"
        value={formData.name}
        onChange={handleChange}
        required
        className="w-full p-2 border rounded border-[#1c4645] text-[#1c4645] bg-white"
      />

      <input
        type="email"
        name="email"
        placeholder="Your Email"
        value={formData.email}
        onChange={handleChange}
        required
        className="w-full p-2 border rounded border-[#1c4645] text-[#1c4645] bg-white"
      />

      <textarea
        name="message"
        placeholder="Your Message"
        value={formData.message}
        onChange={handleChange}
        required
        className="w-full p-2 border rounded border-[#1c4645] text-[#1c4645] bg-white"
      />

      <button
        type="submit"
        disabled={isLoading}
        className={`px-4 py-2 text-white rounded ${isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-[#1c4645] hover:bg-[#133634]"}`}
      >
        {isLoading ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
};

export default ContactForm;