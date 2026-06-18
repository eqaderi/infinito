/**
 * Convert a Vimeo or YouTube watch URL to its embed form.
 * Falls back to the original URL if parsing fails or the host is unknown.
 */
export function toEmbed(url: string): string {
  try {
    const u = new URL(url);
    if (u.hostname.includes("vimeo.com")) {
      const id = u.pathname.replace(/\//g, "");
      return `https://player.vimeo.com/video/${id}?autoplay=1`;
    }
    if (
      u.hostname.includes("youtube.com") ||
      u.hostname.includes("youtu.be")
    ) {
      const id = u.hostname.includes("youtu.be")
        ? u.pathname.slice(1)
        : (u.searchParams.get("v") ?? "");
      return `https://www.youtube.com/embed/${id}?autoplay=1`;
    }
  } catch (_) {}
  return url;
}
