/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['better-sqlite3'],
  devIndicators: false,
  // Allow the sandbox preview host(s) to load dev assets / call server actions.
  // The preview is served from https://{port}-{sandboxId}.e2b.app
  allowedDevOrigins: ['*.e2b.app', 'localhost:3000', '127.0.0.1:3000'],
  async redirects() {
    // Keep legacy links working after the wikiHow -> howcompass rename.
    return [
      { source: '/wikiHow', destination: '/how-to', permanent: true },
      { source: '/wikiHow/:slug', destination: '/how-to/:slug', permanent: true },
      { source: '/wikihow', destination: '/how-to', permanent: true },
      { source: '/wikihow/:slug', destination: '/how-to/:slug', permanent: true },
    ];
  },
};

export default nextConfig;
