import axios from "axios";
import { Filesystem, Directory } from "@capacitor/filesystem";

const MIN_ID = 28000000;
const MAX_ID = 28000100;

export async function updateIconsCapacitor() {
  for (let id = MIN_ID; id <= MAX_ID; id++) {
    const filename = `${id}.png`;
    try {
      await Filesystem.stat({ path: filename, directory: Directory.Data });
      continue;
    } catch {}

    const url = `https://cdn.brawlify.com/profile-icons/regular/${id}.png`;

    try {
      const resp = await axios.get<ArrayBuffer>(url, { responseType: "arraybuffer" });
      const base64 = Buffer.from(resp.data).toString("base64");

      await Filesystem.writeFile({
        path: filename,
        data: base64,
        directory: Directory.Data,
      });

      console.log(`Scaricata icona ${filename}`);
    } catch {}
  }
}

// 🔽 Funzione per ottenere il file://uri per <img src=...>
export async function getIconUri(iconId: number): Promise<string | null> {
  try {
    const stat = await Filesystem.getUri({
      directory: Directory.Data,
      path: `${iconId}.png`,
    });
    return stat.uri;
  } catch {
    return null;
  }
}
