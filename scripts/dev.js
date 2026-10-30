import { spawn } from 'child_process';
import path from 'path';

console.log('🚀 Starting AimPro Server and Client concurrently...\n');

const isWindows = process.platform === 'win32';
const npmCmd = isWindows ? 'npm.cmd' : 'npm';

// Spawn Server
const server = spawn(npmCmd, ['run', 'dev'], {
  cwd: path.resolve('server'),
  stdio: 'inherit',
  shell: true
});

// Spawn Client
const client = spawn(npmCmd, ['run', 'dev'], {
  cwd: path.resolve('client'),
  stdio: 'inherit',
  shell: true
});

process.on('SIGINT', () => {
  server.kill();
  client.kill();
  process.exit();
});
