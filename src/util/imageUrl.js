export function getImageUrl(path) {
  if (!path || /^https?:\/\//i.test(path)) return path || "";

  const baseUrl = window.g?.VITE_API_IMG_URL || import.meta.env.VITE_API_IMG_URL || "";
  return `${baseUrl.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
}
