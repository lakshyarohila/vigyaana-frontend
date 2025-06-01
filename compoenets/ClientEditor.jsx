'use client';

import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';
import { useEffect, useState } from 'react';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

export default function ClientEditor({ value, onChange }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <p>Loading editor...</p>;

  return (
    <ReactQuill
      theme="snow"
      value={value}
      onChange={onChange}
      style={{ minHeight: '200px' }}
    />
  );
}
