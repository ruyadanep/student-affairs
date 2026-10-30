
import { createClient } from "@sanity/client";

// Public content comes from Sanity.
// If Sanity is not configured, helpers return fallback values.
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;

const client = projectId
  ? createClient({
      projectId,
      dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
      apiVersion: "2024-01-01",
      useCdn: true,
    })
  : null;

async function q<T>(
  query: string,
  params: Record<string, unknown>,
  fallback: T
): Promise<T> {
  if (!client) return fallback;

  try {
    return await client.fetch<T>(query, params, {
      next: { revalidate: 60 },
    } as any);
  } catch (error) {
    console.error("Sanity fetch error:", error);
    return fallback;
  }
}

// -----------------------------------------
// HOMEPAGE HERO SLIDES
// -----------------------------------------

export const getHeroSlides = () =>
  q<any[]>(
    `*[_type == "heroSlide" && published == true]
      | order(order asc) {
        _id,
        title,
        headline,
        subheadline,
        "imageUrl": image.asset->url,
        imageAlt,
        ctaLabel,
        ctaUrl,
        order
      }`,
    {},
    []
  );

// Compatibility helper for existing components
// that still expect one hero slide.
export const getHero = async () => {
  const slides = await getHeroSlides();
  return slides.length > 0 ? slides[0] : null;
};

// -----------------------------------------
// NOTICES AND NEWS
// -----------------------------------------

export const getNotices = (limit = 20) =>
  q<any[]>(
    `*[_type == "notice" && published == true]
      | order(date desc)[0...$limit] {
        _id,
        title,
        "slug": slug.current,
        date,
        summary,
        "imageUrl": image.asset->url
      }`,
    { limit },
    []
  );

export const getNotice = (slug: string) =>
  q<any | null>(
    `*[_type == "notice" && slug.current == $slug && published == true][0] {
      title,
      date,
      summary,
      body
    }`,
    { slug },
    null
  );

// -----------------------------------------
// DEAN'S PROFILE
// -----------------------------------------

export const getDean = () =>
  q<any | null>(
    `*[_type == "deanProfile"][0] {
      name,
      title,
      message,
      "photoUrl": photo.asset->url
    }`,
    {},
    null
  );

// -----------------------------------------
// UPCOMING EVENTS
// -----------------------------------------

export async function getEvents(limit = 6) {
  return q<any[]>(
    `*[_type == "event" && date >= now()]
      | order(date asc)[0...$limit] {
        _id,
        title,
        "slug": slug.current,
        date,
        endDate,
        category,
        description,
        "imageUrl": image.asset->url,
        location,
        featured
      }`,
    { limit },
    []
  );
}
