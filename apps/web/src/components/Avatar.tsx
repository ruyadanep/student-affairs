export default function Avatar({ name, url, size = 120 }: { name: string; url?: string | null; size?: number }) {
  const initials = name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase();
  const box = { width: size, height: size, borderRadius: "50%", flex: "none" } as const;
  // eslint-disable-next-line @next/next/no-img-element
  if (url) return <img src={url} alt={name} width={size} height={size} loading="lazy" style={{ ...box, objectFit: "cover", border: "3px solid var(--line)" }} />;
  return <div aria-hidden style={{ ...box, background: "var(--brand)", color: "#fff", display: "grid", placeItems: "center", fontWeight: 700, fontSize: size / 3 }}>{initials}</div>;
}
