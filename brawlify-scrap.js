// brawlify-scrap.js

import fs from "fs";
import path from "path";
import axios from "axios";

const outDir = path.resolve(process.cwd(), "profileicons");
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const MAX_ID = 28001000; // regola in base alle tue necessità
const MIN_ID = 28000000;
const hits = [];

async function main() {
  for (let id = MIN_ID; id <= MAX_ID; id++) {
    const url = `https://cdn.brawlify.com/profile-icons/regular/${id}.png`;
    const outPath = path.join(outDir, `${id}.png`);

    if (fs.existsSync(outPath)) {
      console.log(`⏭️  Skippato ${id}.png (già esiste)`);
      continue;
    }

    try {
      await axios.head(url);
      const { data } = await axios.get(url, { responseType: "arraybuffer" });
      fs.writeFileSync(outPath, data);
      hits.push(id);
      console.log(`✔️  Scaricato ${id}.png`);
    } catch {
      // non esiste o errore → skip
    }
  }


  // Genera assetManifest con fileName = "<id>.png"
  const manifest = hits.map(id => ({
    id,
    type: "ProfileIcon",
    collection: "profileicons",
    fileName: `${id}.png`
  }));
  fs.writeFileSync(
    path.resolve(process.cwd(), "assetManifest.generated.json"),
    JSON.stringify(manifest, null, 2),
    "utf-8"
  );
  console.log(`🎉 Manifest generato con ${hits.length} icone in assetManifest.generated.json`);
}

main().catch(console.error);
