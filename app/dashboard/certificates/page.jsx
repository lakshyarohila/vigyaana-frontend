'use client';

import { useEffect, useState } from 'react';
import { getRequest } from '@/lib/api';
import ProtectedRoute from '@/compoenets/ProtectedRoute';

export default function CertificatePage() {
  const [certs, setCerts] = useState([]);

  useEffect(() => {
    getRequest('/certificates')
      .then(setCerts)
      .catch(() => console.log('No certificates yet'));
  }, []);

  return (
    <ProtectedRoute allowedRoles={['STUDENT']}>
      <div>
        <h1 className="text-2xl font-bold mb-4">My Certificates</h1>
        {certs.length === 0 ? (
          <p>You haven’t completed any course yet.</p>
        ) : (
          <ul className="list-disc pl-4">
            {certs.map((c) => (
              <li key={c.id}>
                {c.course.title} — <span className="text-sm text-gray-500">Issued: {new Date(c.issuedAt).toLocaleDateString()}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </ProtectedRoute>
  );
}
