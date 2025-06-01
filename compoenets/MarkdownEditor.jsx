'use client';

import { useEffect, useState } from 'react';
import SimpleMDE from 'react-simplemde-editor';
import 'easymde/dist/easymde.min.css';

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
