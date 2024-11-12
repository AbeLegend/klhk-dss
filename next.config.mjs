/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
  async rewrites() {
    return [
      {
        source: "/klhk-geoportal/:path*",
        destination: "https://geoportal.menlhk.go.id/:path*",
      },
      {
        source: "/klhk-nfms/:path*",
        destination: "https://nfms.menlhk.go.id:8443/:path*",
      },
      {
        source: "/klhk-sigap/:path*",
        destination: "https://sigap.menlhk.go.id/:path*",
      },
    ];
  },
};

export default nextConfig;
