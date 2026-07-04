/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/shop',
        destination: '/store',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
