module.exports = {
  apps: [
    {
      name: 'personweb-server',
      script: './server/index.cjs',
      cwd: '/root/website/personweb',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 3001
      },
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s',
      restart_delay: 3000,
      log_file: './logs/server.log',
      out_file: './logs/server-out.log',
      error_file: './logs/server-error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      merge_logs: true,
      log_rotate_interval: '1d',
      watch: false,
      ignore_watch: ['node_modules', 'logs', '.git', 'dist'],
      max_memory_restart: '512M',
      kill_timeout: 5000
    }
  ]
};
