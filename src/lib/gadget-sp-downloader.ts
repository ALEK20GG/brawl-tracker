import { Filesystem, Directory } from '@capacitor/filesystem';

/**
 * Salva un asset (gadget/starpower) in base64 su filesystem mobile
 */
export async function saveAssetMobile(
  assetType: "gadget" | "starpower",
  assetName: string,
  base64: string
): Promise<void> {
  const filePath = `${assetType}/${assetName}.png`;

  await Filesystem.writeFile({
    path: filePath,
    data: base64, // ora è chiaramente string
    directory: Directory.Data,
    recursive: true,
  });

}

/**
 * Legge un asset salvato (ritorna base64)
 */
export async function getAssetBase64Mobile(
  assetType: "gadget" | "starpower",
  assetName: string
): Promise<string | undefined> {
  const filePath = `${assetType}/${assetName}.png`;

  try {
    const result = await Filesystem.readFile({
      path: filePath,
      directory: Directory.Data,
    });
    return result.data as string; // <--- cast sicuro a string
  } catch {
    return undefined;
  }
}

/**
 * Scarica e salva tutti gli assets (gadget/starpower) di un brawler
 */
export async function updateBrawlerAssetsMobile(
  assetName: string, assetType: "gadget" | "starpower"
): Promise<boolean> {
  const url = `https://brawlace.com/assets/images/brawlstars/
              ${assetType}s/
              ${assetName.toLowerCase()
                         .replace("\. \g", "-")
                         .replace("\ \g", "-")
                         .replace("\.\g", "-")
                         .replace("\'\g", "")
                         .replace("\!\g", "")
                         .replace("\%\g", "")}.png`;
  try {
    const response = await fetch(url);
    const blob = await response.blob();

    // converti Blob in Base64
    const base64 = await blobToBase64(blob);

    await saveAssetMobile(assetType, assetName, base64);
    return true;
  } catch (err) {
    console.error("Errore updateBrawlerAssetsMobile:", err);
    return false;
  }
}

/**
 * Helper per convertire Blob -> Base64
 */
function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (!reader.result) return reject("Blob conversion failed");
      resolve(reader.result as string); // TypeScript sa che è string
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

