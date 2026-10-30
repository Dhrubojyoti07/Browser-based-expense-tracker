import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('--- Expense Tracker Universal Build Runner ---');
console.log('Current working directory:', process.cwd());
console.log('Script directory:', __dirname);

// Locate frontend directory
let frontendDir = null;
const candidatePaths = [
  path.resolve(process.cwd(), 'frontend'),
  path.resolve(__dirname, 'frontend'),
  path.resolve(__dirname, '..', 'frontend'),
  path.resolve(process.cwd()),
];

for (const candidate of candidatePaths) {
  if (fs.existsSync(candidate) && fs.existsSync(path.join(candidate, 'package.json'))) {
    try {
      const pkg = JSON.parse(fs.readFileSync(path.join(candidate, 'package.json'), 'utf8'));
      if (pkg.dependencies?.react || pkg.devDependencies?.vite) {
        frontendDir = candidate;
        break;
      }
    } catch {
      // ignore
    }
  }
}

if (!frontendDir) {
  console.error('Could not locate frontend directory. Searched:', candidatePaths);
  process.exit(1);
}

console.log(`Found frontend directory at: ${frontendDir}`);

// Install frontend dependencies
console.log('Installing frontend dependencies...');
execSync('npm install', { cwd: frontendDir, stdio: 'inherit' });

// Build frontend
console.log('Running frontend production build...');
execSync('npm run build', { cwd: frontendDir, stdio: 'inherit' });

// Locate the built dist folder
const builtDist = path.join(frontendDir, 'dist');
if (!fs.existsSync(builtDist)) {
  console.error(`Build output not found at ${builtDist}`);
  process.exit(1);
}

// Copy dist to all possible target locations
const targetDistLocations = [
  { dir: path.resolve(process.cwd(), 'dist'), appRel: '../src/app.js' },
  { dir: path.resolve(__dirname, 'dist'), appRel: '../src/app.js' },
  { dir: path.resolve(frontendDir, 'dist'), appRel: '../../backend/src/app.js' },
  { dir: path.resolve(__dirname, '..', 'dist'), appRel: '../backend/src/app.js' },
];

for (const target of targetDistLocations) {
  try {
    if (builtDist !== target.dir) {
      fs.cpSync(builtDist, target.dir, { recursive: true, force: true });
      console.log(`Copied build output to: ${target.dir}`);
    }

    const serverEntryCode = `import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import app from '${target.appRel}';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(__dirname));

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(__dirname, 'index.html'));
});

export default app;
`;

    fs.writeFileSync(path.join(target.dir, 'index.js'), serverEntryCode, 'utf8');
    fs.writeFileSync(path.join(target.dir, 'app.js'), serverEntryCode, 'utf8');
    fs.writeFileSync(path.join(target.dir, 'server.js'), serverEntryCode, 'utf8');
  } catch (err) {
    // ignore
  }
}

console.log('Universal build completed successfully with server entrypoints!');