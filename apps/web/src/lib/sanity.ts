import { createClient } from "@sanity/client";
// Public content comes from Sanity. If Sanity isn't configured yet, every helper returns an empty result and the site still works.
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const client = projectId ? createClient({ projectId, dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production", apiVersion: "2024-01-01", useCdn: true }) : null;
async function q<T>(query: string, params: Record<string, unknown>, fallback: T): Promise<T> {
  if (!client) return fallback;
  try { return await client.fetch<T>(query, params, { next: { revalidate: 60 } } as any); } catch { return fallback; }
}
export const getNotices = (limit = 20) =>
  q<any[]>(
    `*[_type=="notice" && published==true] | order(date desc)[0...$limit]{
      title,
      "slug": slug.current,
      date,
      summary,
      "imageUrl": image.asset->url
    }`,
    { limit },
    []
  );
export const getNotice = (slug: string) => q<any | null>(`*[_type=="notice" && slug.current==$slug && published==true][0]{title,date,summary,body}`, { slug }, null);
export const getHero = () => q<any | null>(`*[_type=="heroSlide" && published==true] | order(order asc)[0]{headline,subheadline,ctaLabel,ctaUrl,"imageUrl":image.asset->url}`, {}, null);
export const getDean = () => q<any | null>(`*[_type=="deanProfile"][0]{name,title,message,"photoUrl":photo.asset->url}`, {}, null);
