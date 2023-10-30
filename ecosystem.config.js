module.exports = {
  apps: [{
    name: "directus",
    exec_mode: "cluster",
    script: "npx",
    args: "directus start",
    autorestart: false,
    watch: false,
    max_memory_restart: "2G"
  }],

  deploy: {
    production: {
      user: 'SSH_USERNAME',
      host: 'SSH_HOSTMACHINE',
      ref: 'origin/master',
      repo: 'GIT_REPOSITORY',
      path: 'DESTINATION_PATH',
      'pre-deploy-local': '',
      'post-deploy': 'npm install && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    }
  }
};
