/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
      domains: ['shop.juventa.ua', 'utfs.io', 'uploadthing.com'], // Add the external hostname here
    },
};

export default nextConfig;
