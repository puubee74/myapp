// src/lib/slug.ts
export const slugify = (s: string) => {
  const base = s
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
  return base || `p-${Date.now()}`;
};
