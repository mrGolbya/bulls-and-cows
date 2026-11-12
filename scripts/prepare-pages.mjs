import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const projectRoot = fileURLToPath(new URL('../', import.meta.url));
const outputDirectory = join(projectRoot, 'dist');
const indexPath = join(projectRoot, 'index.html');
const stylesheetPath = join(projectRoot, 'src', 'styles.css');
const deploymentIndexPath = join(outputDirectory, 'index.html');

const index = await readFile(indexPath, 'utf8');
const deploymentIndex = index
  .replace('./src/styles.css', './styles.css')
  .replace('./dist/main.js', './main.js');

if (deploymentIndex === index) {
  throw new Error('Could not prepare deployment asset paths in index.html.');
}

await mkdir(outputDirectory, { recursive: true });
await Promise.all([
  writeFile(deploymentIndexPath, deploymentIndex),
  copyFile(stylesheetPath, join(outputDirectory, 'styles.css')),
]);
