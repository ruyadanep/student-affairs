
import { getDean } from "@/lib/sanity";
import { units } from "@/lib/units";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Student Affairs | Plateau State University",
  description:
    "Learn about the Division of Student Affairs at Plateau State University, Bokkos, its responsibilities, services, units and commitment to student welfare.",
};

const services = [
  {
    number: "01",
    title: "Accommodation",
    description:
      "Hostel allocation, room changes, accommodation guidance and maintenance support.",
    icon: "🏠",
    href: "/hostels",
  },
  {
    number: "02",
    title: "Student Clearance",
    description:
      "Coordinated student clearance and guidance through the relevant university units.",
    icon: "📋",
    href: "/clearance",
  },
  {
    number: "03",
    title: "Student Organisations",
    description:
      "Support for the registration, coordination and activities of recognised student clubs and societies.",
    icon: "👥",
    href: "/organisations",
  },
  {
    number: "04",
    title: "Letters and Requests",
    description:
      "Processing and guidance for official student letters, attestations and related requests.",
    icon: "📄",
    href: "/letters",
  },
  {
    number: "05",
    title: "Welfare and Support",
    description:
      "Student welfare assistance, counselling referrals and support services.",
    icon: "🤝",
    href: "/support",
  },
  {
    number: "06",
    title: "Student Affairs Units",
    description:
      "Access information about the units responsible for delivering student affairs services.",
    icon: "🏛️",
    href: "/units",
  },
];

export default async function About() {
  const dean = await getDean();
  const unitItems = Array.isArray(units) ? units : [];

  return (
    <main className="about-page">
      {/* Page introduction */}
      <section className="about-hero">
        <div className="about-container">
          <div className="about-hero-content">
            <span className="about-eyebrow">
              PLATEAU STATE UNIVERSITY, BOKKOS
            </span>

            <h1>About the Division of Student Affairs</h1>

            <p>
              Supporting student welfare, personal development and a
              rewarding university experience beyond the classroom.
            </p>

            <div className="about-hero-actions">
              <a href="/team" className="about-primary-button">
                Meet Our Team <span aria-hidden="true">→</span>
              </a>

              <a href="/units" className="about-secondary-button">
                Explore Our Units
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="about-intro about-container">
        <div className="about-intro-label">
          <span>WHO WE ARE</span>
          <div />
        </div>

        <div className="about-intro-content">
          <h2>
            Creating an environment where every student can thrive.
          </h2>

          <p>
            The Division of Student Affairs at Plateau State University,
            Bokkos, plays an important role in supporting students
            throughout their university journey.
          </p>

          <p>
            Beyond academic activities, we coordinate services and
            initiatives that contribute to students&apos; welfare,
            accommodation, personal development, social engagement and
            general wellbeing.
          </p>

          <p>
            We work with relevant university departments, units and
            stakeholders to promote a safe, supportive and inclusive
            campus environment.
          </p>
        </div>
      </section>

      {/* Mission and vision */}
      <section className="about-purpose">
        <div className="about-container about-purpose-grid">
          <article className="about-purpose-card">
            <span className="about-purpose-icon">◎</span>
            <span className="about-card-label">OUR MISSION</span>
            <h2>Supporting the whole student</h2>
            <p>
              To provide responsive student-centred services that promote
              welfare, responsible conduct, personal development and a
              positive university experience.
            </p>
          </article>

          <article className="about-purpose-card about-purpose-highlight">
            <span className="about-purpose-icon">✦</span>
            <span className="about-card-label">OUR VISION</span>
            <h2>A thriving student community</h2>
            <p>
              To foster a supportive university community where students
              are empowered to grow, participate meaningfully and achieve
              their full potential.
            </p>
          </article>
        </div>
      </section>

      {/* Responsibilities */}
      <section className="about-services about-container">
        <div className="about-section-heading">
          <div>
            <span className="about-eyebrow">WHAT WE DO</span>
            <h2>Our Services and Responsibilities</h2>
            <p>
              We coordinate essential services that support students
              during their time at Plateau State University.
            </p>
          </div>
        </div>

        <div className="about-services-grid">
          {services.map((service) => (
            <a
              href={service.href}
              className="about-service-card"
              key={service.number}
            >
              <div className="about-service-top">
                <span className="about-service-icon">{service.icon}</span>
                <span className="about-service-number">
                  {service.number}
                </span>
              </div>

              <h3>{service.title}</h3>
              <p>{service.description}</p>

              <span className="about-service-link">
                Explore service <span aria-hidden="true">→</span>
              </span>
            </a>
          ))}
        </div>
      </section>

      {/* Units */}
      <section className="about-units">
        <div className="about-container">
          <div className="about-section-heading">
            <div>
              <span className="about-eyebrow">HOW WE WORK</span>
              <h2>Our Units</h2>
              <p>
                Our units work together to deliver the services and
                support students need.
              </p>
            </div>

            <a href="/units" className="about-view-all">
              View all units →
            </a>
          </div>

          <div className="about-units-grid">
            {unitItems.map((unit) => (
              <a
                href={`/units/${unit.slug}`}
                className="about-unit-card"
                key={unit.slug}
              >
                <span className="about-unit-icon">▦</span>
                <h3>{unit.name}</h3>
                <p>{unit.summary}</p>
                <span className="about-unit-link">Learn more →</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Dean's message */}
      {dean && (
        <section className="about-dean-section">
          <div className="about-container about-dean-grid">
            <div className="about-dean-photo-wrap">
              {dean.photoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={dean.photoUrl}
                  alt={dean.name || "Dean of Student Affairs"}
                  className="about-dean-photo"
                />
              ) : (
                <div className="about-dean-placeholder">
                  PLASU
                </div>
              )}
            </div>

            <div className="about-dean-content">
              <span className="about-eyebrow">A MESSAGE FROM OUR LEADER</span>
              <h2>Leadership with a commitment to student welfare.</h2>

              <div className="about-dean-name">
                {dean.name}
              </div>

              <span className="about-dean-title">{dean.title}</span>

              {dean.message && (
                <p className="about-dean-message">
                  {dean.message}
                </p>
              )}

              <a href="/about/dean" className="about-dean-button">
                Read the Dean&apos;s Message →
              </a>
            </div>
          </div>
        </section>
      )}

      {/* Closing CTA */}
      <section className="about-contact">
        <div className="about-container about-contact-inner">
          <div>
            <span>WE ARE HERE TO HELP</span>
            <h2>Your university experience matters to us.</h2>
            <p>
              Need assistance or have a question? Connect with the
              Division of Student Affairs.
            </p>
          </div>

          <a href="/support" className="about-contact-button">
            Contact Student Affairs →
          </a>
        </div>
      </section>
    </main>
  );
}
