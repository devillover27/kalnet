export function cn(...inputs: (string | undefined | null | false)[]) {
  return inputs.filter(Boolean).join(" ");
}

export function getMediaUrl(url: string | undefined | null) {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  
  // Assuming VITE_API_BASE_URL is something like http://localhost:5000/api
  // and we want to remove the /api to serve static files from root or backend root.
  const baseUrl = import.meta.env.VITE_API_BASE_URL || "/api";
  const rootUrl = baseUrl.replace(/\/api$/, "");
  
  return `${rootUrl}${url.startsWith("/") ? "" : "/"}${url}`;
}
