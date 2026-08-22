/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  reactCompiler: true,
  basePath: process.env.NODE_ENV === 'production' ? '/determinist' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/determinist' : '',
};

export default nextConfig;
