import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['10.60.190.146', 'localhost'],
  images: {
    domains: ['res.cloudinary.com', 'placehold.co'],
  },
};

export default nextConfig;