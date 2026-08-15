import { cpSync, existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const standalone = join(process.cwd(), '.next', 'standalone');
const staticSrc = join(process.cwd(), '.next', 'static');
const staticDest = join(standalone, '.next', 'static');
const publicSrc = join(process.cwd(), 'public');
const publicDest = join(standalone, 'public');

if (!existsSync(standalone)) {
  console.error('Standalone output not found. Enable output: "standalone" in next.config.');
  process.exit(1);
}

mkdirSync(join(standalone, '.next'), { recursive: true });
cpSync(staticSrc, staticDest, { recursive: true });
if (existsSync(publicSrc)) {
  cpSync(publicSrc, publicDest, { recursive: true });
}

console.log('Copied static assets and public/ into standalone output.');
