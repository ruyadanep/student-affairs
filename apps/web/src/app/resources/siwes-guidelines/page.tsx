
import Link from "next/link";

const sections = [
  {
    number: "01",
    title: "Understanding SIWES and Industrial Training",
    text: "The Students Industrial Work Experience Scheme (SIWES) provides students with an opportunity to gain practical workplace experience related to their fields of study. Industrial training helps students connect classroom learning with professional practice and develop relevant workplace skills.",
    points: [
      "Understand the purpose of the industrial training required by your programme.",
      "Discuss the expected duration and training objectives with your department.",
      "Identify the skills and practical experience you are expected to gain.",
    ],
  },
  {
    number: "02",
    title: "Eligibility and Departmental Approval",
    text: "Students should confirm their eligibility and obtain the necessary guidance and approval before beginning an industrial attachment.",
    points: [
      "Confirm whether SIWES or industrial training is required for your programme.",
      "Ask your department about eligibility conditions and the approved training period.",
      "Obtain the required approval before accepting or commencing a placement.",
      "Follow current instructions issued by the department and the University's designated SIWES office.",
    ],
  },
  {
    number: "03",
    title: "Placement Search and Selection",
    text: "Students should seek suitable organisations where they can gain relevant experience and practical exposure in their area of study.",
    points: [
      "Look for organisations whose activities relate to your academic discipline.",
      "Consider the learning opportunities, supervision and work environment available.",
      "Confirm that the proposed placement meets your department's requirements.",
      "Avoid accepting placements that have not received any required departmental approval.",
    ],
  },
  {
    number: "04",
    title: "Documentation and Acceptance",
    text: "Complete the documentation required by your department, the University and the relevant SIWES authorities before starting your placement.",
    points: [
      "Obtain the appropriate introduction or placement documents where required.",
      "Keep copies of placement applications, acceptance letters and approval records.",
      "Submit completed documents through the approved departmental channels.",
      "Retain evidence of your placement details and reporting arrangements.",
    ],
  },
  {
    number: "05",
    title: "Workplace Conduct and Safety",
    text: "Students represent the University during industrial training and are expected to behave responsibly and professionally throughout the placement.",
    points: [
      "Observe the organisation's rules, working hours and professional standards.",
      "Respect supervisors, colleagues, clients and members of the public.",
      "Follow workplace health, safety and security instructions.",
      "Protect confidential information and use workplace resources responsibly.",
      "Report unsafe conditions or serious concerns to the appropriate supervisor.",
    ],
  },
  {
    number: "06",
    title: "Attendance and Logbook",
    text: "Accurate attendance records and a properly maintained logbook help demonstrate the practical experience gained during the training period.",
    points: [
      "Attend work consistently and comply with approved working arrangements.",
      "Record daily activities and practical tasks as they occur.",
      "Ensure entries are accurate, clear and relevant to your programme.",
      "Obtain supervisor comments, signatures or endorsements where required.",
      "Do not fabricate attendance records or training activities.",
    ],
  },
  {
    number: "07",
    title: "Supervision and Assessment",
    text: "Industrial training may involve supervision and assessment by departmental representatives, workplace supervisors and relevant SIWES officials.",
    points: [
      "Cooperate with authorised visits, monitoring and assessment activities.",
      "Make your logbook and other required records available when requested.",
      "Discuss challenges affecting your training with the appropriate supervisor.",
      "Follow the assessment instructions issued by your department and the University.",
    ],
  },
  {
    number: "08",
    title: "Completion and Submission",
    text: "At the end of the placement, students should complete the required reporting and assessment processes within the instructions provided by their department.",
    points: [
      "Confirm that your training period and required activities have been completed.",
      "Obtain any outstanding workplace endorsements or completion records.",
      "Prepare and submit your report, logbook and other required documents.",
      "Attend any presentation, evaluation or assessment scheduled by your department.",
      "Keep copies of submitted documents for your personal records.",
    ],
  },
];

const relatedLinks = [
  {
    title: "Orientation and Registration",
    href: "/resources/orientation-guidelines",
  },
  {
    title: "Financial Guidelines",
    href: "/resources/financial-guidelines",
  },
  {
    title: "IT and Digital Services",
    href: "/resources/digital-services-guidelines",
  },
  {
    title: "Complaints and Feedback",
    href: "/resources/complaints-guidelines",
  },
];

export default function SiwesGuidelinesPage() {
  return (
    <main className="siwes-page">
      <section className="siwes-hero">
        <div className="siwes-container">
          <div className="siwes-breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <Link href="/resources">Resources</Link>
            <span>/</span>
            <span>SIWES Guidelines</span>
          </div>

          <span className="siwes-eyebrow">
            STUDENT GUIDELINES AND INFORMATION
          </span>

          <h1>SIWES and Industrial Training Guidelines</h1>

          <p>
            A practical guide to industrial attachment, workplace experience,
            professional conduct, logbook records and assessment.
          </p>

          <div className="siwes-hero-actions">
            <a href="#guidelines" className="siwes-primary-button">
              Explore the Guidelines
              <span aria-hidden="true">→</span>
            </a>
            <Link href="/resources" className="siwes-secondary-button">
              All Student Resources
            </Link>
          </div>
        </div>
      </section>

      <section className="siwes-intro">
        <div className="siwes-container siwes-intro-grid">
          <div>
            <span className="siwes-section-label">ABOUT THIS GUIDE</span>
            <h2>Prepare for a valuable workplace experience</h2>
          </div>

          <div className="siwes-intro-copy">
            <p>
              Industrial training is an important opportunity to apply
              academic knowledge, develop professional skills and understand
              the expectations of the workplace.
            </p>
            <p>
              This guide provides general information to help students prepare
              for and complete their industrial attachment responsibly.
            </p>
          </div>
        </div>
      </section>

      <section className="siwes-content-section" id="guidelines">
        <div className="siwes-container">
          <div className="siwes-section-heading">
            <span className="siwes-section-label">STUDENT GUIDE</span>
            <h2>Industrial Training: Step by Step</h2>
            <p>
              Review these areas and follow the specific instructions issued
              for your programme.
            </p>
          </div>

          <div className="siwes-sections">
            {sections.map((section) => (
              <article className="siwes-card" key={section.number}>
                <div className="siwes-card-number">{section.number}</div>
                <div className="siwes-card-content">
                  <h3>{section.title}</h3>
                  <p>{section.text}</p>
                  <ul>
                    {section.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="siwes-notice-section">
        <div className="siwes-container">
          <div className="siwes-notice">
            <div className="siwes-notice-icon" aria-hidden="true">!</div>
            <div>
              <h2>Important: Follow approved University instructions</h2>
              <p>
                Eligibility, placement approval, training duration, forms,
                submission dates, supervision arrangements and assessment
                requirements may differ by programme and academic session.
                Students must confirm the current requirements with their
                department, the University's designated SIWES office and the
                relevant Industrial Training Fund (ITF) guidance. This page is
                general guidance and does not replace official University
                instructions.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="siwes-related-section">
        <div className="siwes-container">
          <div className="siwes-section-heading">
            <span className="siwes-section-label">MORE RESOURCES</span>
            <h2>Other useful student guides</h2>
          </div>

          <div className="siwes-related-grid">
            {relatedLinks.map((item) => (
              <Link
                href={item.href}
                className="siwes-related-link"
                key={item.href}
              >
                <span>{item.title}</span>
                <span aria-hidden="true">→</span>
              </Link>
            ))}
          </div>

          <div className="siwes-back-row">
            <Link href="/resources">← Back to all Student Resources</Link>
            <Link href="/support">Need assistance? Visit Support →</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
