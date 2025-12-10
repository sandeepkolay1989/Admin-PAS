import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Force tracing to this project root to avoid Next.js picking a parent folder
  // when multiple lockfiles exist (e.g., sibling projects in D:\Admin).
  outputFileTracingRoot: path.join(__dirname),
};

export default nextConfig;
