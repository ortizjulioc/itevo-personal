module.exports = {
    apps: [{
        name: 'itevo-nya',
        script: 'npm',
        args: ["start"],
        autorestart: true,
        env: {
            NODE_ENV: 'production',
            PORT: 1442,
            PM2_SERVE_PATH: './build',
            PM2_SERVE_PORT: 1442,
            PM2_SERVE_SPA: 'true',
            PM2_SERVE_HOMEPAGE: '/index.html'
        }
    }]
}
