module.exports = {
  apps: [{
    name: 'itevo-app',
    script: 'npm',
    args: ["start"],
    autorestart: true,
    env: {
      NODE_ENV: 'production',
      PORT: 1441,
      PM2_SERVE_PATH: './build',
      PM2_SERVE_PORT: 1441,
      PM2_SERVE_SPA: 'true',
      PM2_SERVE_HOMEPAGE: '/index.html'
    }
  }]
}
