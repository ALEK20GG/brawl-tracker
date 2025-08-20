// utils/device.ts
export function getDeviceInfo() {
const ua = navigator.userAgent;

if (/android/i.test(ua)) return "Android";
if (/iPad|iPhone|iPod/.test(ua)) return "iOS";
if (/Win/.test(ua)) return "Windows";
if (/Mac/.test(ua)) return "macOS";
if (/Linux/.test(ua)) return "Linux";

return "Unknown";
}