
import { getHero, getNotices } from "@/lib/sanity";
import { units } from "@/lib/units";
import { supabaseServer } from "@/lib/supabase/server";

type IconName =
  | "bed"
  | "clipboard"
  | "users"
  | "file"
  | "wrench"
  | "bell"
  | "life"
  | "scan"
  | "arrow";

function Icon({ name }: { name: IconName }) {
  const paths: Record<IconName, React.ReactNode> = {
    bed: <><path d="M3 18v-7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v7" /><path d="M3 14h18M5 9V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v3" /><path d="M3 18v2M21 18v2" /></>,
    clipboard: <><rect x="5" y="4" width="14" height="17" rx="2" /><path d="M9 4.5V3h6v1.5M9 11h6M9 15h6" /></>,
    users: <><path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="10" cy="7" r="4" /><path d="M20 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></>,
    file: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6M8 13h8M8 17h8" /></>,
    wrench: <><path d="M14.7 6.3a5 5 0 0 0-6.4 6.4L3 18l3 3 5.3-5.3a5 5 0 0 0 6.4-6.4L14 12l-3-3z" /></>,
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" /></>,
    life: <><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="4" /><path d="m4.93 4.93 4.24 4.24m5.66 5.66 4.24 4.24m0-14.14-4.24 4.24m-5.66 5.66-4.24 4.24" /></>,
    scan: <><path d="M4 8V5a1 1 0 0 1 1-1h3M16 4h3a1 1 0 0 1 1 1v3M20 16v3a1 1 0 0 1-1 1h-3M8 20H5a1 1 0 0 1-1-1v-3M4 12h16" /></>,
    arrow: <><path d="M5 12h14M12 5l7 7-7 7" /></>,
  };

  return (
    <svg
      viewBox="0 0 24 24"
      width="25"
      height="25"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}

const services: {
  title: string;
  description: string;
  href: string;
  icon: IconName;
  label: string;
}[] = [
  {
    title: "Hostel accommodation",
    description: "Apply for accommodation, check payment status and view your allocation.",
    href: "/hostels",
    icon: "bed",
    label: "Accommodation",
  },
  {
    title: "Student clearance",
    description: "Track the units responsible for your clearance and monitor progress.",
    href: "/clearance",
    icon: "clipboard",
    label: "Student records",
  },
  {
    title: "Student organisations",
    description: "Discover student clubs and societies or register an organisation.",
    href: "/organisations",
    icon: "users",
    label: "Campus community",
  },
  {
    title: "Letters and attestations",
    description: "Request official letters and verify documents using their QR codes.",
    href: "/letters",
    icon: "file",
    label: "Official documents",
  },
  {
    title: "Hostel maintenance",
    description: "Report accommodation faults and follow the progress of repairs.",
    href: "/maintenance",
    icon: "wrench",
    label: "Hostel support",
  },
  {
    title: "Notifications",
    description: "Stay informed about notices for your hall, level and faculty.",
    href: "/notifications",
    icon: "bell",
    label: "Stay informed",
  },
];

const quick: {
  title: string;
  description: string;
  href: string;
  icon: IconName;
}[] = [
  { title: "Apply for a hostel", description: "Accommodation applications", href: "/hostels", icon: "bed" },
  { title: "Start clearance", description: "Track your clearance", href: "/clearance", icon: "clipboard" },
  { title: "Request a letter", description: "Official student documents", href: "/letters", icon: "file" },
  { title: "Report a fault", description: "Hostel maintenance", href: "/maintenance", icon: "wrench" },
  { title: "Get support", description: "Counselling and welfare", href: "/support", icon: "life" },
  { title: "Verify a document", description: "Check document authenticity", href: "/verify", icon: "scan" },
];

async function counts() {
  try {
    const db = await supabaseServer();

    const count = async (table: string) => {
      const { count, error } = await db
        .from(table)
        .select("*", { count: "exact", head: true });

      return error ? 0 : count ?? 0;
    };

    const [hostels, beds, orgs] = await Promise.all([
      count("hostels"),
      count("bed_spaces"),
      count("organisations"),
    ]);

    return { hostels, beds, orgs };
  } catch {
    return { hostels: 0, beds: 0, orgs: 0 };
  }
}

export default async function Home() {
  const [hero, news, totals] = await Promise.all([
    getHero(),
    getNotices(3),
    counts(),
  ]);

  const stats: [string, string][] = [
    [String(units.length), "Student Affairs units"],
    ...(totals.hostels
      ? [[String(totals.hostels), "Hostels"] as [string, string]]
      : []),
    ...(totals.beds
      ? [[String(totals.beds), "Bed spaces"] as [string, string]]
      : []),
    ...(totals.orgs
      ? [[String(totals.orgs), "Student organisations"] as [string, string]]
      : []),
  ];

  const heroStyle = hero?.imageUrl
    ? {
        backgroundImage: `linear-gradient(90deg, rgba(4, 43, 25, .94) 0%, rgba(4, 43, 25, .78) 55%, rgba(4, 43, 25, .45) 100%), url("${hero.imageUrl}")`,
      }
    : {};

  return (
    <div className="homepage">
      {/* HERO */}
      <section className="home-hero" style={heroStyle}>
        <div className="home-hero-overlay" />
        <div className="home-container home-hero-content">
          <span className="home-eyebrow">
            <span className="home-eyebrow-dot" />
            PLATEAU STATE UNIVERSITY · BOKKOS
          </span>

          <h1>
            {hero?.headline ?? "Your campus life, in one place."}
          </h1>

          <p className="home-hero-description">
            {hero?.subheadline ??
              "Access essential student services, manage your campus experience and stay connected with Student Affairs."}
          </p>

          <div className="home-hero-actions">
            <a className="home-btn-primary" href={hero?.ctaUrl ?? "/hostels"}>
              {hero?.ctaLabel ?? "Explore student services"}
              <Icon name="arrow" />
            </a>

            <a className="home-btn-outline" href="/units">
              Discover our units
            </a>
          </div>

          <div className="home-hero-note">
            <span>✓</span> One portal for your university experience
          </div>
        </div>
      </section>

      {/* QUICK ACCESS */}
      <section className="home-quick-section" aria-label="Quick access">
        <div className="home-container">
          <div className="home-quick-heading">
            <div>
              <span className="home-section-kicker">GET THINGS DONE</span>
              <h2>Quick access</h2>
            </div>
            <p>Your most-used services, just one click away.</p>
          </div>

          <div className="home-quick-grid">
            {quick.map((item) => (
              <a className="home-quick-card" href={item.href} key={item.href}>
                <span className="home-icon-box">
                  <Icon name={item.icon} />
                </span>
                <span className="home-quick-text">
                  <strong>{item.title}</strong>
                  <small>{item.description}</small>
                </span>
                <span className="home-quick-arrow">
                  <Icon name="arrow" />
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* STATISTICS */}
      {stats.length >= 3 && (
        <section className="home-stats" aria-label="Student Affairs at a glance">
          <div className="home-container home-stats-grid">
            {stats.map(([value, label]) => (
              <div className="home-stat" key={label}>
                <strong>{value}</strong>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      <main className="home-main home-container" id="services">
        {/* SERVICES */}
        <section className="home-section">
          <div className="home-section-heading">
            <div>
              <span className="home-section-kicker">HERE FOR YOU</span>
              <h2>Student Affairs services</h2>
              <p>Everything you need to make your university experience easier.</p>
            </div>
            <a className="home-text-link" href="/services">
              Explore services <Icon name="arrow" />
            </a>
          </div>

          <div className="home-services-grid">
            {services.map((service) => (
              <a className="home-service-card" href={service.href} key={service.href}>
                <div className="home-service-top">
                  <span className="home-icon-box">
                    <Icon name={service.icon} />
                  </span>
                  <span className="home-service-arrow">
                    <Icon name="arrow" />
                  </span>
                </div>
                <span className="home-service-label">{service.label}</span>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
              </a>
            ))}
          </div>
        </section>

        {/* UNITS */}
        <section className="home-section">
          <div className="home-section-heading">
            <div>
              <span className="home-section-kicker">OUR ADMINISTRATION</span>
              <h2>Meet our units</h2>
              <p>Dedicated teams working to support students across the university.</p>
            </div>
            <a className="home-text-link" href="/units">
              All units <Icon name="arrow" />
            </a>
          </div>

          <div className="home-units-grid">
            {units.map((unit, index) => (
              <a
                className="home-unit-card"
                href={`/units/${unit.slug}`}
                key={unit.slug}
              >
                <span className="home-unit-number">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3>{unit.name}</h3>
                  <p>{unit.summary}</p>
                </div>
                <span className="home-unit-arrow">
                  <Icon name="arrow" />
                </span>
              </a>
            ))}
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="home-how-section">
          <div className="home-section-heading">
            <div>
              <span className="home-section-kicker">SIMPLE AND CONVENIENT</span>
              <h2>How it works</h2>
              <p>Getting started with Student Affairs is simple.</p>
            </div>
          </div>

          <div className="home-steps-grid">
            <article className="home-step">
              <span className="home-step-number">01</span>
              <h3>Create your account</h3>
              <p>
                Register with your matriculation number and email. You only
                need to do this once.
              </p>
            </article>

            <article className="home-step">
              <span className="home-step-number">02</span>
              <h3>Access student services</h3>
              <p>
                Apply for accommodation, start clearance, request letters
                and access other services.
              </p>
            </article>

            <article className="home-step">
              <span className="home-step-number">03</span>
              <h3>Track your progress</h3>
              <p>
                Follow your requests, monitor their status and receive
                important university notices.
              </p>
            </article>
          </div>
        </section>

        {/* LATEST NEWS */}
        {!!news.length && (
          <section className="home-section">
            <div className="home-section-heading">
              <div>
                <span className="home-section-kicker">STAY INFORMED</span>
                <h2>Latest announcements</h2>
                <p>News and important updates from Student Affairs.</p>
              </div>
              <a className="home-text-link" href="/news">
                All announcements <Icon name="arrow" />
              </a>
            </div>

            <div className="home-news-grid">
              {news.map((item: any) => (
                <article className="home-news-card" key={item.slug}>
                  <div className="home-news-date">
                    {item.date && !Number.isNaN(new Date(item.date).getTime())
                      ? new Date(item.date).toLocaleDateString("en-NG", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })
                      : "Student Affairs update"}
                  </div>
                  <h3>
                    <a href={`/news/${item.slug}`}>{item.title}</a>
                  </h3>
                  {item.summary && <p>{item.summary}</p>}
                  <a className="home-news-link" href={`/news/${item.slug}`}>
                    Read announcement <Icon name="arrow" />
                  </a>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* SUPPORT CTA */}
        <section className="home-support">
          <div className="home-support-icon">
            <Icon name="life" />
          </div>
          <div className="home-support-content">
            <span className="home-section-kicker">WE ARE HERE TO HELP</span>
            <h2>Need assistance?</h2>
            <p>
              Have a question or need help with a student service? Our team
              is ready to assist you.
            </p>
          </div>
          <div className="home-support-actions">
            <a className="home-btn-primary" href="/contact">
              Contact Student Affairs <Icon name="arrow" />
            </a>
            <a className="home-support-secondary" href="/faq">
              Browse frequently asked questions
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}
