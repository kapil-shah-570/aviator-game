const { spawn } = require('child_process');

const isProductionLike =
  process.env.NODE_ENV === 'production' ||
  process.env.RENDER === 'true' ||
  Boolean(process.env.RENDER_SERVICE_ID);

const run = (command, args, options = {}) => {
  const child = spawn(command, args, {
    stdio: 'inherit',
    shell: true,
    ...options,
  });

  child.on('exit', (code) => {
    process.exit(code ?? 0);
  });
};

if (isProductionLike) {
  run('npm', ['run', 'start', '--prefix', 'backend']);
} else {
  const child = spawn(
    'npm',
    ['run', 'dev', '--prefix', 'backend'],
    { stdio: 'inherit', shell: true }
  );

  const frontend = spawn(
    'npm',
    ['run', 'dev', '--prefix', 'frontend'],
    { stdio: 'inherit', shell: true }
  );

  const shutdown = () => {
    child.kill('SIGTERM');
    frontend.kill('SIGTERM');
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}
