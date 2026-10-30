
const assistanceTypes = [
  {
    title: "Scholarship Opportunities",
    description:
      "Information about scholarships offered by government agencies, organisations, foundations and other recognised sponsors.",
  },
  {
    title: "Bursary Support",
    description:
      "Financial support opportunities that may be available to eligible students through approved bursary programmes.",
  },
  {
    title: "Government Education Support",
    description:
      "Students may enquire about applicable federal, state and other recognised education support initiatives.",
  },
  {
    title: "External Sponsorship",
    description:
      "Opportunities provided by companies, charitable organisations, professional bodies and private sponsors.",
  },
];

const applicationSteps = [
  {
    number: "01",
    title: "Identify an Opportunity",
    description:
      "Find a scholarship or financial assistance programme and carefully review its eligibility requirements.",
  },
  {
    number: "02",
    title: "Check Eligibility",
    description:
      "Confirm the academic, financial, residency or other conditions applicable to the opportunity.",
  },
  {
    number: "03",
    title: "Prepare Your Documents",
    description:
      "Gather the documents requested by the scholarship provider, such as academic records and proof of student status.",
  },
  {
    number: "04",
    title: "Submit Your Application",
    description:
      "Apply through the official application channel and ensure all required information is accurate.",
  },
  {
    number: "05",
    title: "Monitor Your Application",
    description:
      "Keep your application reference and monitor official communication for updates or requests for additional information.",
  },
  {
    number: "06",
    title: "Follow Official Instructions",
    description:
      "If selected, follow the sponsor's instructions for verification, acceptance and disbursement.",
  },
];

export default function ScholarshipGuidelinesPage() {
  return (
    <main className="scholarship-page">
      <section className="scholarship-hero">
        <div className="scholarship-container">
          <span className="scholarship-eyebrow">STUDENT RESOURCES</span>
          <h1>Scholarship and Financial Assistance</h1>
          <p>
            Explore guidance on scholarships, bursaries and other financial
            assistance opportunities that may support your educational journey
            at Plateau State University.
          </p>

          <div className="scholarship-actions">
            <a href="/support">Student Support</a>
            <a href="/resources" className="scholarship-outline">
              All Student Resources
            </a>
          </div>
        </div>
      </section>

      <section className="scholarship-content">
        <div className="scholarship-container">
          <div className="scholarship-intro">
            <span>SUPPORTING STUDENT SUCCESS</span>
            <h2>Accessing financial assistance</h2>
            <p>
              Financial assistance can help students manage educational
              expenses and continue their studies. Students are encouraged to
              remain informed about legitimate opportunities and apply through
              recognised channels.
            </p>
          </div>

          <div className="scholarship-notice">
            <div className="scholarship-notice-icon">!</div>
            <div>
              <h3>Important notice</h3>
              <p>
                This page provides general information, not confirmation that
                a particular scholarship or bursary is currently available.
                Eligibility, application periods, selection criteria and
                disbursement arrangements are determined by the relevant
                scholarship provider and University authorities.
              </p>
              <a
                href="https://plasu.edu.ng/"
                target="_blank"
                rel="noreferrer"
              >
                Check official University announcements →
              </a>
            </div>
          </div>

          <div className="scholarship-heading">
            <span>TYPES OF ASSISTANCE</span>
            <h2>Opportunities students may explore</h2>
          </div>

          <div className="scholarship-grid">
            {assistanceTypes.map((item) => (
              <article className="scholarship-card" key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>

          <div className="scholarship-heading scholarship-process-heading">
            <span>APPLICATION PROCESS</span>
            <h2>How to prepare your application</h2>
            <p>
              Follow these general steps when applying for a scholarship or
              other financial assistance programme.
            </p>
          </div>

          <div className="scholarship-steps">
            {applicationSteps.map((step) => (
              <article className="scholarship-step" key={step.number}>
                <div className="scholarship-step-number">{step.number}</div>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </div>
              </article>
            ))}
          </div>

          <div className="scholarship-documents">
            <h2>Documents you may need</h2>
            <p>
              Requirements vary by programme. Depending on the opportunity,
              applicants may be asked to provide:
            </p>
            <ul>
              <li>Evidence of admission or current student status.</li>
              <li>Student identification or registration details.</li>
              <li>Academic transcripts or examination results.</li>
              <li>Evidence of eligibility specified by the sponsor.</li>
              <li>Identification documents where officially required.</li>
              <li>Any additional documents requested by the provider.</li>
            </ul>
          </div>

          <div className="scholarship-warning">
            <h2>Protect yourself from scholarship scams</h2>
            <p>
              Be cautious of individuals or websites demanding unofficial
              payments in exchange for scholarship selection. Verify
              opportunities directly with the recognised sponsor or
              appropriate University office. Never share your passwords,
              banking PINs or account security codes.
            </p>
          </div>

          <div className="scholarship-support">
            <h2>Need further information?</h2>
            <p>
              Students should contact the appropriate University office for
              guidance on recognised scholarship announcements and available
              student assistance channels.
            </p>
            <div className="scholarship-actions">
              <a href="/contact">Contact the University</a>
              <a href="/support" className="scholarship-support-outline">
                Student Support
              </a>
            </div>
          </div>

          <div className="scholarship-back">
            <a href="/resources">← Back to Student Resources</a>
          </div>
        </div>
      </section>
    </main>
  );
}
