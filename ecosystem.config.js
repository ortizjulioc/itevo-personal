module.exports = {
  apps: [{
    name: 'software-itevo-app',
    script: 'npm',
    args: ["start"],
    autorestart: true,
    env: {
      NODE_ENV: 'production',
      PM2_SERVE_PATH: './build',
      PM2_SERVE_PORT: 3000,
      PM2_SERVE_SPA: 'true',
      PM2_SERVE_HOMEPAGE: '/index.html'
    }
  }]
}