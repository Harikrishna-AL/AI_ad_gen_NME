/**  @type {import('next').NextConfig} */
const path = require("path");
if (
  process.env.LD_LIBRARY_PATH == null ||
  !process.env.LD_LIBRARY_PATH.includes(
    `${process.env.PWD}/node_modules/canvas/build/Release:`
  )
) {
  process.env.LD_LIBRARY_PATH = `${
    process.env.PWD
  }/node_modules/canvas/build/Release:${process.env.LD_LIBRARY_PATH || ""}`;
}
const nextConfig = {
  reactStrictMode: true,

  compiler: {
    styledComponents: true,
  },
  experimental: {
    serverComponentsExternalPackages: ["fabric"],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  webpack: (config) => {
    config.resolve.fallback = { fs: false };

    config.resolve.alias["styled-components"] = path.resolve(
      __dirname,
      "node_modules",
      "styled-components"
    );

    return config;
  },
};

module.exports = nextConfig;
