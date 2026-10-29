export const photoUrl = (path?: string | null, updated?: string | null) =>
  path ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/staff-photos/${path}${updated ? `?v=${new Date(updated).getTime()}` : ""}` : null;
