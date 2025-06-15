/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ["localhost:3000", "*.vercel.app", "vigyaana-server.onrender.com"],
    },
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin-allow-popups", // Allows popups while maintaining security
          },
          {
            key: "Cross-Origin-Embedder-Policy",
            value: "require-corp", // Enables safer cross-origin resource embedding
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin", // More privacy-conscious referrer policy
          },
          {
            key: "Content-Security-Policy",
            value: "default-src 'self'; script-src 'self' 'unsafe-inline';", // Adds basic security
          },
          {
            key: "X-Frame-Options",
            value: "DENY", // Prevents clickjacking attacks
          },
        ],
      },
    ];
  },
};

export default nextConfig;