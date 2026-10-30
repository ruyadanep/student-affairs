
import { units } from "@/lib/units";
import { supabaseServer } from "@/lib/supabase/server";
import { getHero, getNotices, getDean } from "@/lib/sanity";
import type { CSSProperties, ReactNode } from "react";

type IconName =
  | "arrow-right"
  | "arrow-up-right"
  | "bed"
  | "clipboard"
  | "users"
  | "file"
  | "wrench"
  | "bell"
  | "life-buoy"
  | "building"
  | "graduation-cap"
  | "shield-check"
  | "calendar"
  | "book-open"
  | "user"
  | "check-circle"
  | "mail"
  | "chart";

function Icon({ name }: { name: IconName }) {
  const paths: Record<IconName, ReactNode> = {
    "arrow-right": <><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></>,
    "arrow-up-right": <><path d="M7 17 17 7" /><path d="M7 7h10v10" /></>,
    bed: <><path d="M2 4v16" /><path d="M2 8h18a2 2 0 0 1 2 2v10" /><path d="M2 17h20" /><path d="M6 8v9" /><path d="M10 8v4h12" /></>,
    clipboard: <><rect x="5" y="4" width="14" height="18" rx="2" /><path d="M9 4.5h6a1.5 1.5 0 0 0-3-0 1.5 1.5 0 0 0-3 0Z" /><path d="M9 12h6M9 16h6" /></>,
    users: <><path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="10" cy="7" r="4" /><path d="M20 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></>,
    file: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" /><path d="M14 2v6h6M8 13h8M8 17h8" /></>,
    wrench: <><path d="M14.7 6.3a5 5 0 0 0-6.4 6.4L3 18l3 3 5.3-5.3a5 5 0 0 0 6.4-6.4L14 13l-3-3Z" /></>,
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" /><path d="M10 21h4" /></>,
    "life-buoy": <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="3" /><path d="m5.6 5.6 4.3 4.3m4.2 4.2 4.3 4.3m0-12.8-4.3 4.3m-4.2 4.2-4.3 4.3" /></>,
    building: <><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M9 21V9h6v12M7 7h2m6 0h2M7 12h2m6 0h2" /></>,
    "graduation-cap": <><path d="m2 10 10-5 10 5-10 5Z" /><path d="M6 12v5c4 3 8 3 12 0v-5M22 10v6" /></>,
    "shield-check": <><path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z" /><path d="m9 12 2 2 4-4" /></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18" /></>,
    "book-open": <><path d="M12 7v14" /><path d="M3 18V5a2 2 0 0 1 2-2h3a4 4 0 0 1 4 4 4 4 0 0 1 4-4h3a2 2 0 0 1 2 2v13h-5a4 4 0 0 0-4 3 4 4 0 0 0-4-3Z" /></>,
    user: <><circle cx="12" cy="8" r="4" /><path d="M5 21v-2a7 7 0 0 1 14 0v2" /></>,
    "check-circle": <><circle cx="12" cy="12" r="9" /><path d="m8 12 3 3 5-6" /></>,
    mail: <><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-10 6L2 7" /></>,
    chart: <><path d="M3 3v18h18" /><path d="m8 14 4-4 4 3 5-7" /></>,
  };

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}

const quick = [
  {
    title: "Hostel Accommodation",
    description: "Explore available student accommodation.",
    href: "/hostels",
    icon: "bed" as const,
  },
  {
    title: "Student Clearance",
    description: "Access your clearance process.",
    href: "/clearance",
    icon: "clipboard" as const,
  },
  {
    title: "Student Organisations",
    description: "Discover recognised student groups.",
    href: "/organisations",
    icon: "users" as const,
  },
  {
    title: "Official Letters",
    description: "Request and manage official letters.",
    href: "/letters",
    icon: "file" as const,
  },
  {
    title: "Report an Issue",
    description: "Submit maintenance and facility reports.",
    href: "/maintenance",
    icon: "wrench" as const,
  },
  {
    title: "Notifications",
    description: "Read important student announcements.",
    href: "/notifications",
    icon: "bell" as const,
  },
  {
    title: "Student Support",
    description: "Get assistance from Student Affairs.",
    href: "/support",
    icon: "life-buoy" as const,
  },
  {
    title: "Verify a Document",
    description: "Verify documents issued by the portal.",
    href: "/verify",
    icon: "shield-check" as const,
  },
];

const services = [
  {
    label: "ACCOMMODATION",
    title: "Hostel Management",
    description: "View available hostels, explore bed spaces and access accommodation services through the Student Affairs Portal.",
    href: "/hostels",
    icon: "bed" as const,
  },
  {
    label: "STUDENT SERVICES",
    title: "Student Clearance",
    description: "Follow your clearance process and access the information required to complete student administrative procedures.",
    href: "/clearance",
    icon: "clipboard" as const,
  },
  {
    label: "CAMPUS COMMUNITY",
    title: "Student Organisations",
    description: "Explore recognised student organisations, associations and groups within Plateau State University.",
    href: "/organisations",
    icon: "users" as const,
  },
  {
    label: "DOCUMENT SERVICES",
    title: "Letters and Requests",
    description: "Submit requests for official student letters and keep track of your administrative requests.",
    href: "/letters",
    icon: "file" as const,
  },
  {
    label: "CAMPUS FACILITIES",
    title: "Maintenance Requests",
    description: "Report hostel, facility and campus maintenance issues to the appropriate university unit.",
    href: "/maintenance",
    icon: "wrench" as const,
  },
  {
    label: "INFORMATION",
    title: "Notices and Notifications",
    description: "Stay informed about Student Affairs announcements, important dates and university updates.",
    href: "/notifications",
    icon: "bell" as const,
  },
  {
    label: "STUDENT WELFARE",
    title: "Student Support",
    description: "Find assistance and guidance on student welfare matters and other Student Affairs services.",
    href: "/support",
    icon: "life-buoy" as const,
  },
  {
    label: "UNIVERSITY DIRECTORY",
    title: "Student Affairs Units",
    description: "Find the offices and units responsible for student services and administrative support.",
    href: "/units",
    icon: "building" as const,
  },
  {
    label: "DOCUMENT AUTHENTICATION",
    title: "Document Verification",
    description: "Use the portal to verify official documents issued through supported university services.",
    href: "/verify",
    icon: "shield-check" as const,
  },
];


const upcomingEvents = [
  {
    category: "STUDENT ORIENTATION",
    title: "New Student Orientation",
    description:
      "Information about orientation programmes and activities for newly admitted students.",
    date: "DATE TO BE ANNOUNCED",
    icon: "graduation-cap" as const,
  },
  {
    category: "STUDENT WELFARE",
    title: "Student Welfare Programme",
    description:
      "Updates on student welfare initiatives, engagement programmes and support activities.",
    date: "DATE TO BE ANNOUNCED",
    icon: "users" as const,
  },
  {
    category: "IMPORTANT DEADLINES",
    title: "Student Affairs Deadlines",
    description:
      "Watch this space for confirmed application deadlines and important student service dates.",
    date: "CHECK FOR UPDATES",
    icon: "calendar" as const,
  },
];


async function getStatistics() {
  try {
    const supabase = await supabaseServer();

    const [hostels, bedSpaces, organisations] = await Promise.all([
      supabase.from("hostels").select("*", { count: "exact", head: true }),
      supabase.from("bed_spaces").select("*", { count: "exact", head: true }),
      supabase.from("organisations").select("*", { count: "exact", head: true }),
    ]);

    return {
      hostels: hostels.count ?? 0,
      bedSpaces: bedSpaces.count ?? 0,
      organisations: organisations.count ?? 0,
    };
  } catch (error) {
    console.error("Unable to load homepage statistics:", error);

    return {
      hostels: 0,
      bedSpaces: 0,
      organisations: 0,
    };
  }
}

function formatDate(value?: string) {
  if (!value) return "UNIVERSITY UPDATE";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "UNIVERSITY UPDATE";

  return new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export default async function Home() {
  const [hero, news, totals, dean] = await Promise.all([
    getHero(),
    getNotices(3),
    getStatistics(),
    getDean(),
  ]);

  const heroHeadline =
    hero?.headline || "Supporting Every Student, Every Step of the Way";

  const heroDescription =
    hero?.subheadline ||
    "Welcome to the Plateau State University Student Affairs Portal. Access student services, accommodation, clearance, welfare support and important university information in one place.";

  const heroStyle: CSSProperties = hero?.imageUrl
    ? {
        backgroundImage: `linear-gradient(90deg, rgba(4,43,25,.94) 0%, rgba(4,43,25,.78) 55%, rgba(4,43,25,.52) 100%), url("${hero.imageUrl}")`,
        backgroundPosition: "center",
        backgroundSize: "cover",
      }
    : {};

  const unitItems = Array.isArray(units) ? units : [];

  return (
    <div className="homepage">

      {/* 1. HERO */}
      <section className="home-hero" style={heroStyle}>
        <div className="home-hero-overlay" />
        <div className="home-container">
          <div className="home-hero-content">
            <div className="home-eyebrow">
              <span className="home-eyebrow-dot" />
              PLATEAU STATE UNIVERSITY
            </div>

            <h1>{heroHeadline}</h1>
            <p className="home-hero-description">{heroDescription}</p>

            <div className="home-hero-actions">
              <a
                href={hero?.ctaUrl || "/dashboard"}
                className="home-btn-primary"
              >
                {hero?.ctaLabel || "Access Student Portal"}
                <Icon name="arrow-right" />
              </a>

              <a href="/support" className="home-btn-outline">
                Student Support
                <Icon name="arrow-up-right" />
              </a>
            </div>

            <div className="home-hero-note">
              <span><Icon name="check-circle" /></span>
              Your university services, accessible in one place.
            </div>
          </div>
        </div>
      </section>

      {/* 2. STATISTICS */}
      <section className="home-stats">
        <div className="home-container">
          <div className="home-stats-grid">
            <div className="home-stat">
              <strong>{totals.hostels.toLocaleString("en-NG")}</strong>
              <span>Hostels Listed</span>
            </div>

            <div className="home-stat">
              <strong>{totals.bedSpaces.toLocaleString("en-NG")}</strong>
              <span>Accommodation Spaces</span>
            </div>

            <div className="home-stat">
              <strong>{totals.organisations.toLocaleString("en-NG")}</strong>
              <span>Student Organisations</span>
            </div>

            <div className="home-stat">
              <strong>24/7</strong>
              <span>Online Portal Access</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. DEAN'S MESSAGE */}
      {dean && (
        <section className="home-about-section">
          <div className="home-container">
            <div className="home-about-grid">

              <div className="home-about-image">
                {dean.photoUrl ? (
                  <img
                    src={dean.photoUrl}
                    alt={dean.name || "Dean"}
                    className="home-about-photo"
                  />
                ) : (
                  <div className="home-about-photo-placeholder">
                    <span>PLASU</span>
                  </div>
                )}
              </div>

              <div className="home-about-content">
                <span className="home-about-eyebrow">
                  A MESSAGE FROM THE DEAN
                </span>

                <h2>Dean’s Message</h2>
                <h3>{dean.name}</h3>

                <p className="home-about-title">
                  {dean.title}
                </p>

                <div className="home-about-divider" />

                <div className="home-about-message">
                  {dean.message}
                </div>

                <a href="/about/dean" className="home-about-link">
                  Read the Dean’s Full Message →
                </a>
              </div>

            </div>
          </div>
        </section>
      )}

      {/* 4. QUICK ACCESS */}
      <section className="home-quick-section">
        <div className="home-container">
          <div className="home-quick-heading">
            <div>
              <span className="home-section-kicker">GET STARTED</span>
              <h2>Quick Access</h2>
            </div>

            <p>
              Find the student services and resources you need without delay.
            </p>
          </div>

          <div className="home-quick-grid">
            {quick.map((item) => (
              <a href={item.href} className="home-quick-card" key={item.title}>
                <span className="home-icon-box">
                  <Icon name={item.icon} />
                </span>

                <span className="home-quick-text">
                  <strong>{item.title}</strong>
                  <small>{item.description}</small>
                </span>

                <span className="home-quick-arrow">
                  <Icon name="arrow-right" />
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* 5. MAIN HOMEPAGE CONTENT */}
      <main className="home-main">
        <div className="home-container">

          {/* STUDENT AFFAIRS SERVICES */}
          <section className="home-section">
            <div className="home-section-heading">
              <div>
                <span className="home-section-kicker">WHAT WE OFFER</span>
                <h2>Student Affairs Services</h2>
                <p>
                  Access essential services and support provided through the
                  Student Affairs Division.
                </p>
              </div>

              <a href="/units" className="home-text-link">
                Explore all units <Icon name="arrow-right" />
              </a>
            </div>

            <div className="home-services-grid">
              {services.map((service) => (
                <a
                  href={service.href}
                  className="home-service-card"
                  key={service.title}
                >
                  <div className="home-service-top">
                    <span className="home-icon-box">
                      <Icon name={service.icon} />
                    </span>

                    <span className="home-service-arrow">
                      <Icon name="arrow-up-right" />
                    </span>
                  </div>

                  <span className="home-service-label">{service.label}</span>
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                </a>
              ))}
            </div>
          </section>

          {/* 6. STUDENT AFFAIRS UNITS */}
          <section className="home-section">
            <div className="home-section-heading">
              <div>
                <span className="home-section-kicker">OUR STRUCTURE</span>
                <h2>Student Affairs Units</h2>
                <p>
                  Connect with the units responsible for student welfare,
                  administration and campus services.
                </p>
              </div>

              <a href="/units" className="home-text-link">
                View all units <Icon name="arrow-right" />
              </a>
            </div>

            <div className="home-units-grid">
              {unitItems.length > 0 ? (
                unitItems.slice(0, 6).map((unit: any, index: number) => {
                  const name =
                    typeof unit === "string"
                      ? unit
                      : unit.name || unit.title || unit.label || "Student Affairs Unit";

                  const description =
                    typeof unit === "object"
                      ? unit.description || unit.summary ||
                        "Student Affairs administrative and support services."
                      : "Student Affairs administrative and support services.";

                  const href =
                    typeof unit === "object"
                      ? unit.href || unit.url ||
                        (unit.slug ? `/units/${unit.slug}` : "/units")
                      : "/units";

                  return (
                    <a
                      href={href}
                      className="home-unit-card"
                      key={unit.id || unit.slug || name}
                    >
                      <span className="home-unit-number">
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      <span>
                        <h3>{name}</h3>
                        <p>{description}</p>
                      </span>

                      <span className="home-unit-arrow">
                        <Icon name="arrow-right" />
                      </span>
                    </a>
                  );
                })
              ) : (
                <a href="/units" className="home-unit-card">
                  <span className="home-unit-number">01</span>
                  <span>
                    <h3>Student Affairs Directory</h3>
                    <p>
                      View the university's Student Affairs units and their
                      services.
                    </p>
                  </span>
                  <span className="home-unit-arrow">
                    <Icon name="arrow-right" />
                  </span>
                </a>
              )}
            </div>
          </section>

          {/* 7. HOW TO USE THE PORTAL */}
<section className="home-how-section">
  <div className="home-container">
    <div className="home-section-heading">
      <div>
        <span className="home-section-kicker">
          SIMPLE AND CONVENIENT
        </span>
        <h2>How to Use the Portal</h2>
        <p>
          Follow these simple steps to access Student Affairs
          services and manage your requests.
        </p>
      </div>
    </div>

    <div className="home-steps-grid">

      <div className="home-step">
        <span className="home-step-number">01</span>
        <div className="home-step-icon">
          <Icon name="user" />
        </div>
        <h3>Access the Portal</h3>
        <p>
          Visit the PLASU Student Affairs Portal using your
          computer, tablet or mobile device.
        </p>
      </div>

      <div className="home-step">
        <span className="home-step-number">02</span>
        <div className="home-step-icon">
          <Icon name="shield-check" />
        </div>
        <h3>Sign In or Register</h3>
        <p>
          Create an account if you are new, or sign in to
          access your personal student dashboard.
        </p>
      </div>

      <div className="home-step">
        <span className="home-step-number">03</span>
        <div className="home-step-icon">
          <Icon name="clipboard" />
        </div>
        <h3>Select a Service</h3>
        <p>
          Choose the service you need, provide the required
          information and submit your request.
        </p>
      </div>

      <div className="home-step">
        <span className="home-step-number">04</span>
        <div className="home-step-icon">
          <Icon name="check-circle" />
        </div>
        <h3>Track Your Request</h3>
        <p>
          Visit your dashboard to follow the progress of
          your requests and check for updates.
        </p>
      </div>

    </div>

    <div className="home-how-footer">
      <p>Need assistance using the portal?</p>
      <a href="/support" className="home-text-link">
        Contact Student Support <Icon name="arrow-right" />
      </a>
    </div>
  </div>
</section>

{/* 8. UPCOMING EVENTS AND IMPORTANT DATES */}
<section className="home-events-section">
  <div className="home-container">

    <div className="home-section-heading">
      <div>
        <span className="home-section-kicker">
          MARK YOUR CALENDAR
        </span>
        <h2>Upcoming Events and Important Dates</h2>
        <p>
          Stay informed about upcoming student activities,
          university programmes and important deadlines.
        </p>
      </div>

      <a href="/news" className="home-text-link">
        View announcements <Icon name="arrow-right" />
      </a>
    </div>

    <div className="home-events-grid">
      {upcomingEvents.map((event, index) => (
        <article
          className="home-event-card"
          key={event.title}
        >
          <div className="home-event-top">
            <span className="home-event-icon">
              <Icon name={event.icon} />
            </span>

            <span className="home-event-number">
              0{index + 1}
            </span>
          </div>

          <span className="home-event-category">
            {event.category}
          </span>

          <h3>{event.title}</h3>

          <p>{event.description}</p>

          <div className="home-event-date">
            <Icon name="calendar" />
            <span>{event.date}</span>
          </div>

          <a href="/news" className="home-event-link">
            Check announcements <Icon name="arrow-right" />
          </a>
        </article>
      ))}
    </div>

    <div className="home-events-note">
      <span className="home-events-note-icon">
        <Icon name="bell" />
      </span>
      <p>
        Important dates and event schedules will be updated
        as official information becomes available.
      </p>
    </div>

  </div>
</section>

          {/* 8. LATEST NEWS */}
          <section className="home-section">
            <div className="home-section-heading">
              <div>
                <span className="home-section-kicker">STAY INFORMED</span>
                <h2>Latest News and Announcements</h2>
                <p>
                  Keep up with important notices, updates and activities from
                  Student Affairs.
                </p>
              </div>

              <a href="/news" className="home-text-link">
                View all news <Icon name="arrow-right" />
              </a>
            </div>

            <div className="home-news-grid">
              {news && news.length > 0 ? (
                news.slice(0, 3).map((item: any, index: number) => (
                  <article
                    className="home-news-card"
                    key={item.slug || item.title || index}
                  >
                    <a
                      href={item.slug ? `/news/${item.slug}` : "/news"}
                      className="home-news-image-link"
                      aria-label={`Read ${item.title}`}
                    >
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.title || "Student Affairs announcement"}
                          className="home-news-image"
                        />
                      ) : (
                        <div className="home-news-image-placeholder">
                          <Icon name="building" />
                          <span>PLASU Student Affairs</span>
                        </div>
                      )}
                    </a>

                    <div className="home-news-content">
                      <span className="home-news-date">
                        {formatDate(item.date)}
                      </span>

                      <h3>
                        <a href={item.slug ? `/news/${item.slug}` : "/news"}>
                          {item.title}
                        </a>
                      </h3>

                      <p>
                        {item.summary ||
                          "Read the latest update from the Student Affairs Division."}
                      </p>

                      <a
                        href={item.slug ? `/news/${item.slug}` : "/news"}
                        className="home-news-link"
                      >
                        Read announcement <Icon name="arrow-right" />
                      </a>
                    </div>
                  </article>
                ))
              ) : (
                <article className="home-news-card">
                  <div className="home-news-image-link">
                    <div className="home-news-image-placeholder">
                      <Icon name="bell" />
                      <span>University Announcements</span>
                    </div>
                  </div>

                  <div className="home-news-content">
                    <span className="home-news-date">STAY INFORMED</span>
                    <h3>Student Affairs Updates</h3>
                    <p>
                      Important notices and announcements will appear here
                      when they are published.
                    </p>
                    <a href="/news" className="home-news-link">
                      Visit news and announcements <Icon name="arrow-right" />
                    </a>
                  </div>
                </article>
              )}
            </div>
          </section>

          {/* 9. SUPPORT CTA */}
          <section className="home-support">
            <div className="home-support-icon">
              <Icon name="life-buoy" />
            </div>

            <div className="home-support-content">
              <span className="home-section-kicker">WE ARE HERE TO HELP</span>
              <h2>Need Assistance?</h2>
              <p>
                Have a question or need help with a Student Affairs service?
                Contact the support team for assistance.
              </p>
            </div>

            <div className="home-support-actions">
              <a href="/support" className="home-btn-primary">
                Get Student Support <Icon name="arrow-right" />
              </a>

              <a href="/contact" className="home-support-secondary">
                Contact the University
              </a>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}
