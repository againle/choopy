/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: '/choopy',
  distDir: 'out',
  trailingSlash: true,
};

export default nextConfig;
