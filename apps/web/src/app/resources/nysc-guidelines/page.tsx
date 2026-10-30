
import Link from "next/link";

const sections = [
  {
    number: "01",
    title: "Understanding NYSC Mobilisation",
    description:
      "NYSC mobilisation is the process through which eligible graduates are processed for participation in the National Youth Service Corps programme.",
    points: [
      "Confirm that your programme and qualification meet NYSC requirements.",
      "Ensure your academic records are correctly maintained.",
      "Follow official mobilisation announcements from the University.",
      "Consult the University's designated NYSC office for clarification.",
    ],
  },
  {
    number: "02",
    title: "Student Records and Personal Information",
    description:
      "Accurate student records are important for successful mobilisation and verification.",
    points: [
      "Check that your full name is correctly recorded.",
      "Verify your date of birth and other personal details.",
      "Confirm your matriculation number and programme details.",
      "Report discrepancies through the appropriate University office.",
    ],
  },
  {
    number: "03",
    title: "Final-Year Clearance",
    description:
      "Students should complete the applicable University clearance requirements before graduation and mobilisation processing.",
    points: [
      "Complete the required departmental clearance.",
      "Resolve outstanding academic and administrative matters.",
      "Obtain clearance from relevant University units.",
      "Keep copies of clearance confirmations and supporting documents.",
    ],
  },
  {
    number: "04",
    title: "Required Documentation",
    description:
      "Prepare the documents that may be required during University verification and NYSC registration.",
    points: [
      "Valid identification documents.",
      "Academic records and approved graduation information.",
      "Relevant student registration details.",
      "Other documents requested by the University or NYSC.",
    ],
  },
  {
    number: "05",
    title: "NYSC Online Registration",
    description:
      "Eligible graduates are expected to complete registration through the official NYSC platform when mobilisation registration opens.",
    points: [
      "Use the official NYSC website.",
      "Read the current registration instructions carefully.",
      "Enter accurate personal and academic information.",
      "Upload documents in the required format where applicable.",
      "Keep your registration details and confirmation information secure.",
    ],
  },
  {
    number: "06",
    title: "Verification and Mobilisation Lists",
    description:
      "Graduates should monitor official University and NYSC announcements concerning verification and mobilisation.",
    points: [
      "Check official mobilisation announcements.",
      "Verify your details when relevant lists are published.",
      "Report missing or incorrect information promptly.",
      "Follow instructions for corrections and additional verification.",
    ],
  },
  {
    number: "07",
    title: "Graduation and Academic Documentation",
    description:
      "Students should follow the University's approved procedures for graduation, academic documentation and collection of relevant certificates.",
    points: [
      "Confirm that all graduation requirements have been satisfied.",
      "Follow official instructions concerning graduation ceremonies.",
      "Check the procedure for academic transcripts and certificates.",
      "Keep relevant receipts and official documentation.",
    ],
  },
  {
    number: "08",
    title: "After Mobilisation",
    description:
      "Once mobilisation is completed, graduates should follow the official NYSC instructions for deployment and service.",
    points: [
      "Check your call-up information through official channels.",
      "Read the instructions provided by NYSC.",
      "Prepare the required documents for orientation camp.",
      "Observe NYSC rules and regulations throughout the service year.",
    ],
  },
];

export default function NyscGuidelinesPage() {
  return (
    <main className="nysc-guide-page">
      <section className="nysc-guide-hero">
        <div className="nysc-guide-container">
          <div className="nysc-guide-breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <Link href="/resources">Resources</Link>
            <span>/</span>
            <span>NYSC and Graduation</span>
          </div>

          <span className="nysc-guide-label">
            FINAL-YEAR STUDENT INFORMATION
          </span>

          <h1>NYSC Mobilisation and Graduation Guidelines</h1>

          <p>
            Important guidance for final-year students and graduates on
            University clearance, NYSC mobilisation, documentation and
            graduation procedures.
          </p>

          <div className="nysc-guide-actions">
            <a href="#guidelines" className="nysc-guide-primary">
              Explore Guidelines
            </a>
            <a
              href="https://www.nysc.gov.ng/"
              target="_blank"
              rel="noopener noreferrer"
              className="nysc-guide-secondary"
            >
              Official NYSC Website ↗
            </a>
          </div>
        </div>
      </section>

      <section className="nysc-guide-content" id="guidelines">
        <div className="nysc-guide-container">
          <div className="nysc-guide-intro">
            <div>
              <span className="nysc-guide-eyebrow">
                PREPARING FOR LIFE AFTER UNIVERSITY
              </span>
              <h2>From Final Year to National Service</h2>
            </div>
            <p>
              The transition from University to national service requires
              proper preparation. Students should maintain accurate records,
              complete applicable clearance requirements and follow official
              mobilisation instructions.
            </p>
          </div>

          <div className="nysc-guide-notice">
            <strong>Important:</strong> NYSC mobilisation eligibility,
            registration requirements, approved procedures and deadlines are
            determined by NYSC and the relevant University authorities.
            Always confirm current requirements through official channels.
          </div>

          <div className="nysc-guide-grid">
            {sections.map((section) => (
              <article className="nysc-guide-card" key={section.number}>
                <span className="nysc-guide-number">{section.number}</span>
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

          <div className="nysc-guide-checklist">
            <span className="nysc-guide-eyebrow">YOUR PREPARATION CHECKLIST</span>
            <h2>Before NYSC Mobilisation</h2>
            <div className="nysc-guide-checks">
              <div>✓ Confirm your academic records.</div>
              <div>✓ Check your personal information.</div>
              <div>✓ Complete applicable University clearance.</div>
              <div>✓ Prepare relevant documents.</div>
              <div>✓ Monitor official mobilisation announcements.</div>
              <div>✓ Follow the current NYSC registration instructions.</div>
            </div>
          </div>

          <div className="nysc-guide-warning">
            <h3>Protect Yourself Against Fraud</h3>
            <p>
              Be cautious of individuals claiming they can guarantee NYSC
              mobilisation, deployment, posting or correction of records in
              exchange for unofficial payments. Use official University and
              NYSC channels, and never share your passwords or verification
              codes.
            </p>
          </div>

          <div className="nysc-guide-related">
            <h2>Related Resources</h2>
            <div className="nysc-guide-links">
              <Link href="/resources/clearance-guidelines">
                Student Clearance Guidelines <span>→</span>
              </Link>
              <Link href="/resources/orientation-guidelines">
                Orientation and Registration <span>→</span>
              </Link>
              <Link href="/resources/academic-calendar">
                Academic Calendar <span>→</span>
              </Link>
              <Link href="/resources/digital-services-guidelines">
                IT and Digital Services <span>→</span>
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
