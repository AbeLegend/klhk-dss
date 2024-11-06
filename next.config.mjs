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
        source: "/klhk-dss/:path*",
        destination: "https://geoportal.menlhk.go.id/:path*",
      },
      {
        source: "/klhk-dss/:path*",
        destination: "https://nfms.menlhk.go.id:8443/:path*",
      },
    ];
  },
};

export default nextConfig;
