
import Link from "next/link";
import { getDean } from "@/lib/sanity";
import { units } from "@/lib/units";
import type { Metadata } from "next";
import AboutSectionNav from "@/components/AboutSectionNav";

export const metadata: Metadata = {
  title: "About Student Affairs | Plateau State University",
  description:
    "Discover the history, mandate, leadership, organisational structure, units, policies and student support services of the Division of Student Affairs, Plateau State University, Bokkos.",
};

const services = [
  {
    number: "01",
    title: "Accommodation",
    description:
      "Guidance on student accommodation, hostel allocation, room changes and maintenance support.",
    icon: "⌂",
    href: "/hostels",
  },
  {
    number: "02",
    title: "Student Clearance",
    description:
      "Guidance and coordination to help students navigate relevant University clearance processes.",
    icon: "✓",
    href: "/clearance",
  },
  {
    number: "03",
    title: "Student Organisations",
    description:
      "Support for recognised student associations, clubs, societies and meaningful campus participation.",
    icon: "♧",
    href: "/organisations",
  },
  {
    number: "04",
    title: "Letters and Requests",
    description:
      "Information and assistance relating to official student letters, attestations and requests.",
    icon: "▤",
    href: "/letters",
  },
  {
    number: "05",
    title: "Welfare and Support",
    description:
      "Student welfare information, support services and referrals to appropriate University offices.",
    icon: "♡",
    href: "/support",
  },
  {
    number: "06",
    title: "Student Affairs Units",
    description:
      "Explore the units responsible for supporting the delivery of Student Affairs services.",
    icon: "▦",
    href: "/units",
  },
];

const values = [
  {
    number: "01",
    title: "Student-centred service",
    description:
      "We place students' welfare, development and university experience at the heart of our work.",
  },
  {
    number: "02",
    title: "Integrity and accountability",
    description:
      "We encourage honesty, transparency, responsible conduct and accountability in service delivery.",
  },
  {
    number: "03",
    title: "Respect and inclusiveness",
    description:
      "We promote dignity, fairness, mutual respect and an inclusive University community.",
  },
  {
    number: "04",
    title: "Collaboration",
    description:
      "We work with relevant University units and stakeholders to support students effectively.",
  },
  {
    number: "05",
    title: "Excellence",
    description:
      "We pursue quality, professionalism and continuous improvement in our services.",
  },
  {
    number: "06",
    title: "Personal development",
    description:
      "We recognise the importance of learning, leadership, participation and growth beyond the classroom.",
  },
];

const responsibilities = [
  {
    number: "01",
    title: "Student welfare and wellbeing",
    description:
      "Promoting student welfare and helping students access appropriate support and University services.",
    icon: "♡",
  },
  {
    number: "02",
    title: "Accommodation administration",
    description:
      "Coordinating student accommodation matters, hostel-related enquiries and relevant administrative processes.",
    icon: "⌂",
  },
  {
    number: "03",
    title: "Student conduct and discipline",
    description:
      "Supporting responsible behaviour, awareness of University regulations and appropriate student conduct processes.",
    icon: "⚖",
  },
  {
    number: "04",
    title: "Student leadership and organisations",
    description:
      "Supporting recognised student associations, leadership development and organised student participation.",
    icon: "♧",
  },
  {
    number: "05",
    title: "Orientation and integration",
    description:
      "Helping students understand University life, available services, responsibilities and opportunities.",
    icon: "✦",
  },
  {
    number: "06",
    title: "Student engagement",
    description:
      "Encouraging constructive participation in campus programmes, extracurricular activities and community development.",
    icon: "◎",
  },
  {
    number: "07",
    title: "Complaints and enquiries",
    description:
      "Providing appropriate channels for student enquiries, concerns, guidance and referrals.",
    icon: "▤",
  },
  {
    number: "08",
    title: "Institutional collaboration",
    description:
      "Working with relevant University departments and stakeholders on matters affecting student experience.",
    icon: "◇",
  },
];

const engagementAreas = [
  {
    number: "01",
    title: "Student Union Government",
    description:
      "Student representation, leadership, participation and constructive engagement with University management.",
    icon: "♧",
    href: "/organisations",
  },
  {
    number: "02",
    title: "Clubs and Societies",
    description:
      "Opportunities for students to participate in recognised clubs, societies and interest-based activities.",
    icon: "◎",
    href: "/organisations",
  },
  {
    number: "03",
    title: "Orientation Programmes",
    description:
      "Activities that help new students understand University life, responsibilities and available support.",
    icon: "✦",
    href: "/events",
  },
  {
    number: "04",
    title: "Leadership Development",
    description:
      "Encouraging responsibility, teamwork, communication and leadership among students.",
    icon: "◇",
    href: "/organisations",
  },
  {
    number: "05",
    title: "Campus Activities",
    description:
      "Promoting meaningful participation in student programmes, social activities and University events.",
    icon: "▦",
    href: "/events",
  },
  {
    number: "06",
    title: "Community Engagement",
    description:
      "Encouraging responsible citizenship, volunteerism and positive contributions to society.",
    icon: "♡",
    href: "/events",
  },
];

const policyAreas = [
  {
    number: "01",
    title: "Student Handbook",
    description:
      "Guidance on University life, student responsibilities, procedures and relevant institutional information.",
  },
  {
    number: "02",
    title: "Student Code of Conduct",
    description:
      "Information concerning acceptable conduct, responsibilities and standards expected of students.",
  },
  {
    number: "03",
    title: "Accommodation Guidelines",
    description:
      "Guidance relating to hostel administration, accommodation arrangements and student responsibilities.",
  },
  {
    number: "04",
    title: "Student Organisations Guidelines",
    description:
      "Information on recognised associations, student organisations and their activities.",
  },
  {
    number: "05",
    title: "Disciplinary Regulations",
    description:
      "Information about applicable University rules, disciplinary procedures and student responsibilities.",
  },
  {
    number: "06",
    title: "Other University Policies",
    description:
      "Relevant institutional guidelines and regulations affecting student welfare and campus life.",
  },
];

export default async function About() {
  const [dean] = await Promise.all([getDean()]);
  const unitItems = Array.isArray(units) ? units : [];

  return (
    <main className="about-page">

      {/* =====================================================
          01. HERO
      ====================================================== */}
      <section className="about-hero">
        <div className="about-hero-pattern" aria-hidden="true" />

        <div className="about-container about-hero-layout">
          <div className="about-hero-content">
            <div className="about-eyebrow">
              <span className="about-eyebrow-line" />
              PLATEAU STATE UNIVERSITY, BOKKOS
            </div>

            <h1>
              Beyond the classroom.
              <span>Here for every student.</span>
            </h1>

            <p>
              The Division of Student Affairs supports the welfare,
              development and overall university experience of students
              throughout their academic journey.
            </p>

            <div className="about-hero-actions">
              <Link href="/team" className="about-primary-button">
                Meet Our Team <span aria-hidden="true">→</span>
              </Link>

              <Link href="/units" className="about-secondary-button">
                Explore Our Units
              </Link>
            </div>

            <div className="about-hero-note">
              <span className="about-hero-note-icon">✦</span>
              <span>
                Supporting students. Strengthening our community.
              </span>
            </div>
          </div>

          <div className="about-hero-visual" aria-hidden="true">
            <div className="about-visual-main">
              <div className="about-visual-top">
                <span>PLASU</span>
                <span>STUDENT AFFAIRS</span>
              </div>

              <div className="about-visual-center">
                <span className="about-visual-symbol">✦</span>
                <strong>STUDENT</strong>
                <strong>EXPERIENCE</strong>
                <span className="about-visual-caption">
                  Welfare · Development · Community
                </span>
              </div>

              <div className="about-visual-bottom">
                <span>PLATEAU STATE UNIVERSITY</span>
                <span>BOKKOS, NIGERIA</span>
              </div>
            </div>

            <div className="about-visual-floating">
              <span>OUR COMMITMENT</span>
              <strong>Every student matters.</strong>
            </div>
          </div>
        </div>

        <div className="about-hero-bottom">
          <div className="about-container">
            <span>STUDENT WELFARE</span>
            <span className="about-bottom-dot" />
            <span>PERSONAL DEVELOPMENT</span>
            <span className="about-bottom-dot" />
            <span>CAMPUS COMMUNITY</span>
          </div>
        </div>
      </section>

      {/* STICKY ABOUT PAGE NAVIGATION */}
<div className="about-section-nav-placeholder">
  <AboutSectionNav />
</div>


      {/* =====================================================
          02. INTRODUCTION
      ====================================================== */}
      <section className="about-intro about-container" id="introduction">
        <div className="about-intro-side">
          <span className="about-section-index">01 / ABOUT US</span>
          <span className="about-intro-vertical">THE DIVISION</span>
        </div>

        <div className="about-intro-content">
          <span className="about-eyebrow">WHO WE ARE</span>

          <h2>
            Creating an environment where
            <span> every student can thrive.</span>
          </h2>

          <div className="about-intro-copy">
            <p>
              The Division of Student Affairs at Plateau State University,
              Bokkos, plays an important role in supporting students
              throughout their university journey.
            </p>

            <p>
              University life extends beyond lectures and examinations.
              Students also need an environment that encourages personal
              growth, responsible conduct, social engagement and wellbeing.
            </p>

            <p>
              Through its services and units, the Division works with
              relevant University departments and stakeholders to promote
              a supportive, safe and inclusive campus community.
            </p>
          </div>

          <Link href="/resources" className="about-text-link">
            Explore student information and resources <span>→</span>
          </Link>
        </div>
      </section>

      {/* =====================================================
          03. HISTORY
      ====================================================== */}
      <section className="about-history" id="history">
        <div className="about-container">
          <div className="about-section-heading">
            <div>
              <span className="about-eyebrow">OUR BACKGROUND</span>
              <h2>The History of Student Affairs</h2>
              <p>
                Understanding the Division&apos;s institutional background,
                development and contribution to student life at Plateau
                State University.
              </p>
            </div>
            <span className="about-section-index">02 / OUR HISTORY</span>
          </div>

          <div className="about-history-grid">
            <div className="about-history-symbol">
              <span>PLASU</span>
              <strong>STUDENT</strong>
              <strong>AFFAIRS</strong>
              <span>WELFARE · SERVICE · DEVELOPMENT</span>
            </div>

            <div className="about-history-content">
              <h3>A commitment to the student experience.</h3>

              <p>
                The Division of Student Affairs is an important part of
                the University&apos;s student support and administration
                framework. Its work focuses on matters that contribute
                to students&apos; welfare, personal development and
                participation in University life.
              </p>

              <p>
                Beyond academic activities, the University experience
                involves accommodation, social interaction, student
                leadership, responsible conduct and access to appropriate
                support services. These areas form an important part
                of the Division&apos;s work.
              </p>

              <p>
                The Division continues to serve as an important point
                of coordination for student-related matters in
                collaboration with relevant University authorities
                and stakeholders.
              </p>

              <div className="about-history-note">
                <span>INSTITUTIONAL HISTORY</span>
                <p>
                  Official establishment dates, historical milestones
                  and documented achievements will be published here
                  when verified by the University.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          04. MISSION AND VISION
      ====================================================== */}
      <section className="about-purpose" id="mission-vision">
        <div className="about-container">
          <div className="about-section-kicker">
            <span className="about-eyebrow">OUR PURPOSE</span>
            <span className="about-section-index">03 / OUR DIRECTION</span>
          </div>

          <div className="about-purpose-grid">
            <article className="about-purpose-card">
              <div className="about-purpose-card-top">
                <span className="about-purpose-symbol">◎</span>
                <span>01</span>
              </div>

              <span className="about-card-label">OUR MISSION</span>
              <h2>Supporting the whole student.</h2>

              <p>
                To provide responsive, student-centred services that
                promote welfare, responsible conduct, personal development
                and a positive university experience.
              </p>

              <div className="about-purpose-line" />
            </article>

            <article className="about-purpose-card about-purpose-highlight">
              <div className="about-purpose-card-top">
                <span className="about-purpose-symbol">✦</span>
                <span>02</span>
              </div>

              <span className="about-card-label">OUR VISION</span>
              <h2>A thriving student community.</h2>

              <p>
                To foster a supportive university community where students
                are empowered to grow, participate meaningfully and achieve
                their full potential.
              </p>

              <div className="about-purpose-line" />
            </article>
          </div>
        </div>
      </section>

      {/* =====================================================
          05. CORE VALUES
      ====================================================== */}
      <section className="about-values about-container" id="core-values">
        <div className="about-values-heading">
          <span className="about-eyebrow">WHAT GUIDES US</span>
          <h2>The values behind our service.</h2>
          <p>
            Our approach to student support is guided by principles that
            encourage a positive and responsible University community.
          </p>
        </div>

        <div className="about-values-grid">
          {values.map((value) => (
            <article className="about-value-card" key={value.number}>
              <span className="about-value-number">{value.number}</span>
              <h3>{value.title}</h3>
              <p>{value.description}</p>
            </article>
          ))}
        </div>
      </section>

      {/* =====================================================
          06. MANDATE AND RESPONSIBILITIES
      ====================================================== */}
      <section className="about-mandate" id="mandate">
        <div className="about-container">
          <div className="about-section-heading">
            <div>
              <span className="about-eyebrow">WHAT WE DO</span>
              <h2>Our Mandate and Responsibilities</h2>
              <p>
                The Division&apos;s work covers important aspects of student
                welfare, administration, development and campus engagement.
              </p>
            </div>

            <span className="about-section-index">04 / OUR MANDATE</span>
          </div>

          <div className="about-mandate-grid">
            {responsibilities.map((item) => (
              <article className="about-mandate-card" key={item.number}>
                <div className="about-mandate-top">
                  <span>{item.icon}</span>
                  <small>{item.number}</small>
                </div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          07. ORGANISATIONAL STRUCTURE
      ====================================================== */}
      <section className="about-structure" id="organisational-structure">
        <div className="about-container">
          <div className="about-section-heading">
            <div>
              <span className="about-eyebrow">HOW WE ARE ORGANISED</span>
              <h2>Our Organisational Structure</h2>
              <p>
                The Division operates through leadership, administrative
                coordination and specialised units working together to
                support the University&apos;s student community.
              </p>
            </div>
            <span className="about-section-index">05 / STRUCTURE</span>
          </div>

          <div className="about-structure-chart">
            <div className="about-structure-level">
              <div className="about-structure-node about-structure-top">
                <span>DIVISIONAL LEADERSHIP</span>
                <h3>Dean of Student Affairs</h3>
                <p>
                  Provides leadership, direction and coordination for
                  the Division.
                </p>
              </div>
            </div>

            <div className="about-structure-connector" />

            <div className="about-structure-level">
              <div className="about-structure-node">
                <span>ADMINISTRATIVE COORDINATION</span>
                <h3>Administrative Support</h3>
                <p>
                  Supports the coordination of departmental activities,
                  records, enquiries and administrative processes.
                </p>
              </div>
            </div>

            <div className="about-structure-connector" />

            <div className="about-structure-units">
              {unitItems.length > 0 ? (
                unitItems.map((unit) => (
                  <Link
                    href={`/units/${unit.slug}`}
                    className="about-structure-unit"
                    key={unit.slug}
                  >
                    <span>UNIT</span>
                    <h3>{unit.name}</h3>
                    <p>{unit.summary}</p>
                    <span className="about-structure-link">
                      View unit →
                    </span>
                  </Link>
                ))
              ) : (
                <div className="about-structure-node">
                  <h3>Student Affairs Units</h3>
                  <p>Unit information will be published here.</p>
                </div>
              )}
            </div>

            <p className="about-structure-note">
              This is a functional overview of the Division&apos;s service
              structure, not a verified staff hierarchy. Official
              appointments, reporting lines and individual unit heads
              should be confirmed before publication.
            </p>

            <Link href="/team" className="about-primary-button">
              View Leadership and Staff <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* =====================================================
          08. SERVICES
      ====================================================== */}
      <section className="about-services" id="services">
        <div className="about-container">
          <div className="about-section-heading">
            <div>
              <span className="about-eyebrow">HOW WE SUPPORT YOU</span>
              <h2>Our Services and Responsibilities</h2>
              <p>
                Explore some of the services and support areas coordinated
                through the Division of Student Affairs.
              </p>
            </div>

            <Link href="/resources" className="about-view-all">
              Student resources <span>→</span>
            </Link>
          </div>

          <div className="about-services-grid">
            {services.map((service) => (
              <Link
                href={service.href}
                className="about-service-card"
                key={service.number}
                aria-label={service.title}
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
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          09. SIX STUDENT AFFAIRS UNITS
      ====================================================== */}
      <section className="about-units" id="units">
        <div className="about-container">
          <div className="about-section-heading">
            <div>
              <span className="about-eyebrow">OUR STRUCTURE</span>
              <h2>Our Student Affairs Units</h2>
              <p>
                Explore the specialised units that contribute to the
                coordination and delivery of Student Affairs services.
              </p>
            </div>

            <Link href="/units" className="about-view-all">
              View all units <span>→</span>
            </Link>
          </div>

          {unitItems.length > 0 ? (
            <div className="about-units-grid">
              {unitItems.map((unit, index) => (
                <Link
                  href={`/units/${unit.slug}`}
                  className="about-unit-card"
                  key={unit.slug}
                >
                  <span className="about-unit-icon">▦</span>
                  <span className="about-unit-number">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3>{unit.name}</h3>
                  <p>{unit.summary}</p>
                  <span className="about-unit-link">
                    View unit <span aria-hidden="true">→</span>
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="about-units-empty">
              <p>
                Information about Student Affairs units will be available
                here.
              </p>
              <Link href="/units">Visit the units directory →</Link>
            </div>
          )}
        </div>
      </section>

      {/* =====================================================
          10. STUDENT LIFE AND ENGAGEMENT
      ====================================================== */}
      <section className="about-engagement" id="student-life">
        <div className="about-container">
          <div className="about-section-heading">
            <div>
              <span className="about-eyebrow">LIFE BEYOND THE CLASSROOM</span>
              <h2>Student Life and Engagement</h2>
              <p>
                University life offers opportunities to develop leadership,
                build relationships, participate in activities and
                contribute meaningfully to the campus community.
              </p>
            </div>

            <span className="about-section-index">06 / STUDENT LIFE</span>
          </div>

          <div className="about-engagement-grid">
            {engagementAreas.map((item) => (
              <article
                className="about-engagement-card"
                key={item.number}
              >
                <div className="about-engagement-top">
                  <span>{item.icon}</span>
                  <small>{item.number}</small>
                </div>

                <h3>{item.title}</h3>
                <p>{item.description}</p>

                <Link href={item.href}>
                  Explore <span>→</span>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          11. POLICIES AND REGULATIONS
      ====================================================== */}
      <section className="about-policies" id="policies">
        <div className="about-container">
          <div className="about-section-heading">
            <div>
              <span className="about-eyebrow">RULES AND GUIDANCE</span>
              <h2>Policies and Regulations</h2>
              <p>
                Students are encouraged to familiarise themselves with
                applicable University policies, regulations and guidelines.
              </p>
            </div>

            <span className="about-section-index">07 / POLICIES</span>
          </div>

          <div className="about-policies-grid">
            {policyAreas.map((policy) => (
              <article className="about-policy-card" key={policy.number}>
                <span className="about-policy-number">
                  {policy.number}
                </span>
                <div>
                  <h3>{policy.title}</h3>
                  <p>{policy.description}</p>
                </div>
                <Link href="/resources" aria-label={`Find ${policy.title} in resources`}>
                  →
                </Link>
              </article>
            ))}
          </div>

          <div className="about-policies-footer">
            <div>
              <span className="about-eyebrow">STUDENT INFORMATION CENTRE</span>
              <h3>Looking for official documents and resources?</h3>
              <p>
                Visit the Resources section for available student information,
                downloadable documents and relevant University links.
              </p>
            </div>

            <Link href="/resources" className="about-primary-button">
              Visit Resources <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* =====================================================
          12. DEAN'S MESSAGE
      ====================================================== */}
      <section className="about-dean-section" id="dean">
        <div className="about-container about-dean-grid">
          <div className="about-dean-photo-wrap">
            {dean?.photoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={dean.photoUrl}
                alt={dean.name || "Dean of Student Affairs"}
                className="about-dean-photo"
              />
            ) : (
              <div className="about-dean-placeholder">
                <span>PLASU</span>
                <small>STUDENT AFFAIRS</small>
              </div>
            )}

            <div className="about-dean-photo-caption">
              <span>LEADERSHIP</span>
              <strong>Serving the student community</strong>
            </div>
          </div>

          <div className="about-dean-content">
            <span className="about-eyebrow">A MESSAGE FROM OUR LEADER</span>

            <h2>
              Leadership with a commitment to
              <span> student welfare.</span>
            </h2>

            {dean?.name && (
              <div className="about-dean-name">{dean.name}</div>
            )}

            {dean?.title && (
              <span className="about-dean-title">{dean.title}</span>
            )}

            {dean?.message ? (
              <p className="about-dean-message">{dean.message}</p>
            ) : (
              <p className="about-dean-message">
                The Dean&apos;s welcome message will be published here.
                Please visit this page again for updates from the
                Division&apos;s leadership.
              </p>
            )}

            <Link href="/about/dean" className="about-dean-button">
              Read the Dean&apos;s Message <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* =====================================================
          13. LEADERSHIP AND TEAM
      ====================================================== */}
      <section className="about-leadership" id="leadership">
        <div className="about-container about-leadership-inner">
          <div>
            <span className="about-eyebrow">OUR PEOPLE</span>
            <h2>
              Dedicated leadership.
              <span> Committed service.</span>
            </h2>
            <p>
              The Division works through its leadership, administrative
              personnel and unit staff to coordinate services and respond
              to students&apos; needs.
            </p>
          </div>

          <div className="about-leadership-actions">
            <Link href="/team" className="about-primary-button">
              Meet Our Team <span>→</span>
            </Link>
            <Link href="/units" className="about-secondary-button">
              Explore Units
            </Link>
          </div>
        </div>
      </section>

      {/* =====================================================
          14. RESOURCES
      ====================================================== */}
      <section className="about-resources" id="resources">
        <div className="about-container about-resources-inner">
          <div>
            <span className="about-eyebrow">INFORMATION AND DOCUMENTS</span>
            <h2>Everything students need, in one place.</h2>
            <p>
              Access available University information, student guidelines,
              important documents and useful links through the Student
              Affairs Resources section.
            </p>
          </div>

          <Link href="/resources" className="about-primary-button">
            Explore Resources <span>→</span>
          </Link>
        </div>
      </section>

      {/* =====================================================
          15. CONTACT INFORMATION
      ====================================================== */}
      <section className="about-office" id="contact-information">
        <div className="about-container">
          <div className="about-section-heading">
            <div>
              <span className="about-eyebrow">GET IN TOUCH</span>
              <h2>Contact the Division</h2>
              <p>
                Students who need information, guidance or assistance
                can reach out through the Division&apos;s official
                communication channels.
              </p>
            </div>

            <span className="about-section-index">08 / CONTACT</span>
          </div>

          <div className="about-office-grid">
            <article className="about-office-card">
              <span className="about-office-icon">⌖</span>
              <span className="about-card-label">LOCATION</span>
              <h3>Division of Student Affairs</h3>
              <p>
                Plateau State University, Bokkos, Plateau State, Nigeria.
              </p>
            </article>

            <article className="about-office-card">
              <span className="about-office-icon">✉</span>
              <span className="about-card-label">ENQUIRIES</span>
              <h3>Student Support</h3>
              <p>
                Contact the Division for student-related enquiries,
                guidance and assistance.
              </p>
              <Link href="/support">Get support →</Link>
            </article>

            <article className="about-office-card">
              <span className="about-office-icon">▤</span>
              <span className="about-card-label">INFORMATION</span>
              <h3>Student Information</h3>
              <p>
                Access useful information, guidelines and University
                resources.
              </p>
              <Link href="/resources">View resources →</Link>
            </article>
          </div>

          <p className="about-office-note">
            Official telephone numbers, email address and office hours
            should be added after confirmation by the Division.
          </p>
        </div>
      </section>

      {/* =====================================================
          16. FINAL CALL TO ACTION
      ====================================================== */}
      <section className="about-contact">
        <div className="about-container about-contact-inner">
          <div className="about-contact-copy">
            <span className="about-eyebrow">WE ARE HERE TO HELP</span>
            <h2>
              Your university experience
              <span> matters to us.</span>
            </h2>
            <p>
              Have a question, need guidance or require assistance?
              Connect with the Division of Student Affairs.
            </p>
          </div>

          <div className="about-contact-actions">
            <Link href="/support" className="about-contact-button">
              Get Student Support <span>→</span>
            </Link>

            <Link href="/contact" className="about-contact-secondary">
              Contact the Division
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}
