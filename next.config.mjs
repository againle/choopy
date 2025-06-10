/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: '/MyPage',
  distDir: 'out',
  trailingSlash: true,
};

export default nextConfig;
