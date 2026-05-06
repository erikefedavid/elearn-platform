/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow Cloudinary images
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
  // Webpack config for Mongoose compatibility
  webpack: (config) => {
    config.experiments = { ...config.experiments, topLevelAwait: true };
    return config;
  },
};

export default nextConfig;
