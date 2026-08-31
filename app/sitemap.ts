import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://denominator.fyi";
  return [
    { url: `${base}/`, changeFrequency: "weekly", priority: 1 },
    {
      url: `${base}/indexes/teenager-outcomes/`,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${base}/case-studies/counting-women/`,
      changeFrequency: "monthly",
      priority: 0.9,
    },
  ];
}
