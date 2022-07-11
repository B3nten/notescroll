/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  pageExtensions: ['mdx', 'md', 'page.jsx', 'page.js', 'page.tsx', 'page.ts'],
  typescript: {
    ignoreBuildErrors: true,
  },

};

module.exports = nextConfig;
