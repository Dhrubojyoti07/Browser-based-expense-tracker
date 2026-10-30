import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('Building Expense Tracker...');

const isAtRoot = fs.existsSync(path.resolve('frontend'));
const frontendDir = isAtRoot ? path.resolve('frontend') : process.cwd();

console.log(`Building in: ${frontendDir}`);

// Install frontend dependencies
execSync('npm install', { cwd: frontendDir, stdio: 'inherit' });

// Run vite build
execSync('npm run build', { cwd: frontendDir, stdio: 'inherit' });

// Ensure dist is available at both frontend/dist and root dist
const builtDist = path.join(frontendDir, 'dist');
const rootDist = path.resolve('dist');
const frontendDist = path.resolve('frontend', 'dist');

if (fs.existsSync(builtDist)) {
  if (builtDist !== rootDist) {
    fs.cpSync(builtDist, rootDist, { recursive: true, force: true });
  }
  if (builtDist !== frontendDist && isAtRoot) {
    fs.cpSync(builtDist, frontendDist, { recursive: true, force: true });
  }
}

console.log('Build successfully completed!');
