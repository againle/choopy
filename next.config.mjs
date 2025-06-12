/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  basePath: '/choopy',
  distDir: 'out',
  trailingSlash: true,
};

export default nextConfig;
