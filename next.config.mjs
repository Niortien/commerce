/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  compress: true,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  experimental: {
    // Les barrels HeroUI / Tabler sont énormes : on n'embarque que les composants utilisés.
    optimizePackageImports: ["@heroui/react", "@tabler/icons-react", "date-fns", "recharts", "framer-motion"],
  },
  async redirects() {
    return [{ source: "/presentation", destination: "/", permanent: true }];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
        ],
      },
      {
        // Cache statique Next.js (_next/static) — 1 an
        source: "/_next/static/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },
};

export default nextConfig;
