/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  reactCompiler: true,
  asePath: process.env.NODE_ENV === 'production' ? '/determinist' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/determinist' : '',
};

export default nextConfig;
