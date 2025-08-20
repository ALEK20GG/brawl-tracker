export async function getIconBase64Tauri(fullPath: string): Promise<string | null> {
  if (typeof window === 'undefined' || !(window as any).__TAURI_IPC__) return null;
  try {
    const fs = await import('@tauri-apps/api/fs');
    const { readBinaryFile } = fs;
    const bytes: Uint8Array = await readBinaryFile(fullPath as any);
    const binary = Array.from(bytes).map(b => String.fromCharCode(b)).join('');
    return `data:image/png;base64,${btoa(binary)}`;
  } catch (e) {
    console.error("Errore lettura file Tauri:", e);
    return null;
  }
}
