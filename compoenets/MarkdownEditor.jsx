"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import "easymde/dist/easymde.min.css";

// Dynamically import SimpleMDE to disable SSR (prevent "document is not defined" error)
const SimpleMDE = dynamic(() => import("react-simplemde-editor"), { ssr: false });

export default function MarkdownEditor({ value, onChange }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <p>Loading editor...</p>;

  return (
    <SimpleMDE
      value={value}
      onChange={onChange}
      options={{
        spellChecker: false,
        placeholder: "Write your blog here...",
        status: false,
      }}
    />
  );
}