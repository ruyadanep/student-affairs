
import Link from "next/link";

const sections = [
  {
    number: "01",
    title: "Hostel Accommodation Eligibility",
    description:
      "Students seeking University accommodation should confirm their eligibility and comply with the accommodation requirements announced by the University.",
    points: [
      "Confirm that you meet the applicable accommodation requirements.",
      "Check the availability of hostel spaces.",
      "Read the current accommodation announcement.",
      "Provide accurate student information.",
    ],
  },
  {
    number: "02",
    title: "Hostel Application Process",
    description:
      "Students should follow the approved application process whenever hostel accommodation is made available.",
    points: [
      "Access the official accommodation application channel.",
      "Provide your correct matriculation and personal details.",
      "Select available accommodation options where applicable.",
      "Submit your application within the announced period.",
      "Keep your application confirmation for reference.",
    ],
  },
  {
    number: "03",
    title: "Accommodation Allocation",
    description:
      "Hostel allocation is subject to available spaces and the University's approved allocation procedures.",
    points: [
      "Monitor official allocation announcements.",
      "Confirm your allocation through the approved channel.",
      "Do not assume that submitting an application guarantees a room.",
      "Do not occupy a room without official authorisation.",
      "Report allocation discrepancies to the responsible office.",
    ],
  },
  {
    number: "04",
    title: "Payment and Documentation",
    description:
      "Students should follow official instructions concerning accommodation fees and documentation.",
    points: [
      "Confirm the approved accommodation charges.",
      "Use only authorised University payment channels.",
      "Keep payment receipts and transaction references.",
      "Complete any required documentation.",
      "Avoid payments to unauthorised individuals.",
    ],
  },
  {
    number: "05",
    title: "Moving into the Hostel",
    description:
      "Students should follow the instructions provided by the responsible accommodation office when taking possession of an allocated room.",
    points: [
      "Confirm your room and bed-space allocation.",
      "Complete the required check-in process.",
      "Inspect the room and report existing damage.",
      "Observe hostel entry and residence procedures.",
      "Keep your room and personal belongings secure.",
    ],
  },
  {
    number: "06",
    title: "Hostel Rules and Responsibilities",
    description:
      "Every resident is responsible for maintaining a safe, clean and respectful living environment.",
    points: [
      "Maintain cleanliness and personal hygiene.",
      "Respect roommates and other residents.",
      "Observe hostel quiet hours and security procedures.",
      "Protect University property and shared facilities.",
      "Comply with visitor and accommodation regulations.",
    ],
  },
  {
    number: "07",
    title: "Maintenance and Reporting Problems",
    description:
      "Accommodation-related problems should be reported promptly through the approved University maintenance or hostel management channel.",
    points: [
      "Report leaking pipes, faulty electrical fittings and damaged furniture.",
      "Identify your hostel, block and room when reporting a problem.",
      "Describe the problem clearly.",
      "Avoid carrying out unauthorised repairs.",
      "Report urgent safety hazards immediately.",
    ],
  },
  {
    number: "08",
    title: "Vacating and End-of-Session Procedures",
    description:
      "Students should follow official instructions when leaving University accommodation or completing their residence period.",
    points: [
      "Observe the announced vacation or checkout period.",
      "Remove personal belongings.",
      "Return keys or access items where required.",
      "Leave the room clean and in good condition.",
      "Complete any required hostel checkout procedures.",
    ],
  },
];

export default function HostelApplicationGuidelinesPage() {
  return (
    <main className="hostel-application-page">
      <section className="hostel-application-hero">
        <div className="hostel-application-container">
          <div className="hostel-application-breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <Link href="/resources">Resources</Link>
            <span>/</span>
            <span>Hostel Accommodation</span>
          </div>

          <span className="hostel-application-label">
            STUDENT ACCOMMODATION INFORMATION
          </span>

          <h1>Hostel Application and Accommodation Guidelines</h1>

          <p>
            Information to help students understand hostel applications,
            accommodation allocation, residence responsibilities and
            maintenance reporting.
          </p>

          <div className="hostel-application-actions">
            <a href="#guidelines" className="hostel-application-primary">
              Explore Guidelines
            </a>
            <Link href="/hostels" className="hostel-application-secondary">
              Hostel Services
            </Link>
          </div>
        </div>
      </section>

      <section className="hostel-application-content" id="guidelines">
        <div className="hostel-application-container">
          <div className="hostel-application-intro">
            <div>
              <span className="hostel-application-eyebrow">
                LIVING ON CAMPUS
              </span>
              <h2>A Better and Safer Hostel Experience</h2>
            </div>
            <p>
              University accommodation provides students with an opportunity
              to live within the campus community. All residents are expected
              to follow approved accommodation procedures and contribute to
              a safe, peaceful and hygienic environment.
            </p>
          </div>

          <div className="hostel-application-notice">
            <strong>Important Notice:</strong> Hostel availability, eligibility,
            application periods, accommodation charges and allocation
            procedures are determined by the University. This page provides
            general guidance and does not constitute an offer of accommodation.
            Always follow current official announcements.
          </div>

          <div className="hostel-application-grid">
            {sections.map((section) => (
              <article
                className="hostel-application-card"
                key={section.number}
              >
                <span className="hostel-application-number">
                  {section.number}
                </span>
                <h3>{section.title}</h3>
                <p>{section.description}</p>
                <ul>
                  {section.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>

          <div className="hostel-application-checklist">
            <span className="hostel-application-eyebrow">
              BEFORE MOVING INTO THE HOSTEL
            </span>
            <h2>Student Accommodation Checklist</h2>
            <div className="hostel-application-checks">
              <div>✓ Confirm accommodation eligibility.</div>
              <div>✓ Submit your application through the approved channel.</div>
              <div>✓ Confirm your room allocation.</div>
              <div>✓ Complete approved payment requirements.</div>
              <div>✓ Follow the official check-in procedure.</div>
              <div>✓ Read the hostel rules and regulations.</div>
            </div>
          </div>

          <div className="hostel-application-warning">
            <h3>Keep Your Accommodation Secure</h3>
            <p>
              Do not pay unofficial agents or individuals who promise hostel
              allocation. Do not occupy an unallocated room or transfer your
              bed space without the University's approval. Report suspected
              accommodation fraud or security concerns through the appropriate
              University channels.
            </p>
          </div>

          <div className="hostel-application-related">
            <h2>Related Student Resources</h2>
            <div className="hostel-application-links">
              <Link href="/resources/hostel-regulations">
                Hostel Rules and Regulations <span>→</span>
              </Link>
              <Link href="/resources/safety-guidelines">
                Student Safety and Security <span>→</span>
              </Link>
              <Link href="/resources/clearance-guidelines">
                Student Clearance Guidelines <span>→</span>
              </Link>
              <Link href="/maintenance">
                Maintenance Services <span>→</span>
              </Link>
              <Link href="/support">
                Student Support Services <span>→</span>
              </Link>
              <Link href="/resources">
                All Student Resources <span>→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
