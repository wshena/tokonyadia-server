// next.config.js
module.exports = {
  async rewrites() {
    return [
      {
        source: '/store/:path*',
        destination: '/api/server.js',
      },
    ]
  },
};
