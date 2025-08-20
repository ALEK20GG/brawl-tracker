// generate-manifest.js
import fs from 'fs';
import path from 'path';

const BS_DIR    = path.join(process.cwd(), 'bs-fankit-rehosted');
const OUT_FILE  = path.join(process.cwd(), 'static', 'assetManifest.json'); 
// └── per SvelteKit metti qui; se usi Vite sostituisci 'static' con 'public'

const ROOT_DIRS = [
  path.join(BS_DIR, 'game-assets'),
  path.join(BS_DIR, 'logo'),
  path.join(BS_DIR, 'audio'),
];

function walk(dir) {
  return fs.existsSync(dir)
    ? fs.readdirSync(dir, { withFileTypes: true }).flatMap(d => {
        const full = path.join(dir, d.name);
        return d.isDirectory() ? walk(full) : [full];
      })
    : [];
}

const manifest = [];

for (const root of ROOT_DIRS) {
  const relRoot = path.relative(BS_DIR, root).replace(/\\/g, '/');  
  walk(root).forEach(fullPath => {
    const fileName = path.basename(fullPath);
    const relPath  = path.relative(BS_DIR, fullPath).replace(/\\/g, '/');
    const [type]   = fileName.split('_');
    const idMatch  = fileName.match(/^(\d+)(?=\.|\_)/);
    const id       = idMatch ? +idMatch[1] : null;

    manifest.push({ id, type, path: relPath, fileName });
  });
}

// Assicurati che la cartella static/ esista
const outDir = path.dirname(OUT_FILE);
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

fs.writeFileSync(OUT_FILE, JSON.stringify(manifest, null, 2), 'utf8');
console.log(`✓ Manifest generato con ${manifest.length} voci in ${OUT_FILE}`);
