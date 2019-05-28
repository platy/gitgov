module.exports = {
  apps : [{
    name: 'GitGov',
    script: 'lib/dist/server.js',
    cwd: '/var/gitgov',
    args: '',
    instances: 1,
    autorestart: true,
    watch: true,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    }
  }],
};
