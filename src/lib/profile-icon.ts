import { Filesystem, Directory } from "@capacitor/filesystem";

export async function getProfileIconSrc(iconId: number, fallbackUrl?: string): Promise<string> {
  const isMobile = typeof (window as any).Capacitor !== "undefined";

  if (isMobile) {
    try {
      const { uri } = await Filesystem.getUri({
        directory: Directory.Data,
        path: `${iconId}.png`,
      });
      return uri;
    } catch {
      console.warn(`Icona ${iconId} non trovata localmente. Uso fallback.`);
    }
  }

  return fallbackUrl ?? `https://cdn.brawlify.com/profile-icons/regular/${iconId}.png`;
}
