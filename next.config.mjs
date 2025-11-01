import path from 'path';
import { fileURLToPath } from 'url';

// ✅ Simular __dirname (no existe en ESM)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      tinymce: path.resolve(__dirname, 'node_modules/tinymce'),
    };
    return config;
  },
};

export default nextConfig;
