
const complaintSteps = [
  {
    number: "01",
    title: "Identify the Concern",
    description:
      "Clearly identify the issue you want to report, including the people, department or service involved where relevant.",
  },
  {
    number: "02",
    title: "Gather Relevant Information",
    description:
      "Prepare relevant dates, correspondence, receipts, documents or other information that may help explain your concern.",
  },
  {
    number: "03",
    title: "Contact the Appropriate Office",
    description:
      "Submit your concern to the relevant department, faculty, unit or University office responsible for the matter.",
  },
  {
    number: "04",
    title: "Provide a Clear Explanation",
    description:
      "Explain what happened, how it affected you and what resolution or assistance you are seeking.",
  },
  {
    number: "05",
    title: "Keep a Record",
    description:
      "Keep copies of your submission and any acknowledgement or response you receive.",
  },
  {
    number: "06",
    title: "Follow Up Where Necessary",
    description:
      "If the matter remains unresolved, seek guidance on the appropriate escalation channel through the relevant University authority.",
  },
];

const complaintTypes = [
  {
    title: "Academic Matters",
    description:
      "Concerns relating to lectures, course registration, assessment, examinations and academic supervision.",
  },
  {
    title: "Administrative Services",
    description:
      "Concerns about student records, registration processes, documentation and administrative services.",
  },
  {
    title: "Student Welfare",
    description:
      "Issues involving accommodation, student support, welfare services and general student wellbeing.",
  },
  {
    title: "Campus Facilities",
    description:
      "Reports concerning maintenance, sanitation, utilities and the condition of University facilities.",
  },
  {
    title: "Conduct and Safety",
    description:
      "Concerns involving misconduct, harassment, discrimination, threats or other safety-related matters.",
  },
  {
    title: "Digital and Technical Support",
    description:
      "Problems involving student portals, online services, access and other University digital platforms.",
  },
];

export default function ComplaintsGuidelinesPage() {
  return (
    <main className="complaints-page">
      <section className="complaints-hero">
        <div className="complaints-container">
          <span className="complaints-eyebrow">STUDENT RESOURCES</span>
          <h1>Student Complaints and Feedback</h1>
          <p>
            Your voice matters. Find guidance on raising concerns, submitting
            feedback and seeking appropriate assistance within Plateau State
            University.
          </p>

          <div className="complaints-actions">
            <a href="/support">Student Support</a>
            <a href="/contact" className="complaints-outline">
              Contact the University
            </a>
          </div>
        </div>
      </section>

      <section className="complaints-content">
        <div className="complaints-container">
          <div className="complaints-intro">
            <span>YOUR VOICE MATTERS</span>
            <h2>Speak up and seek resolution</h2>
            <p>
              Students are encouraged to communicate concerns respectfully
              through appropriate University channels. Constructive feedback
              helps improve the quality of academic programmes, administrative
              processes and student services.
            </p>
          </div>

          <div className="complaints-notice">
            <div className="complaints-notice-icon">!</div>
            <div>
              <h3>Important information</h3>
              <p>
                This page provides general guidance and does not establish a
                formal University grievance policy. Official reporting
                channels, timelines, investigation procedures and appeal
                arrangements are determined by the relevant University
                authorities.
              </p>
              <a
                href="https://plasu.edu.ng/"
                target="_blank"
                rel="noreferrer"
              >
                Visit the official University website →
              </a>
            </div>
          </div>

          <div className="complaints-heading">
            <span>TYPES OF CONCERNS</span>
            <h2>What can you report?</h2>
          </div>

          <div className="complaints-grid">
            {complaintTypes.map((item) => (
              <article className="complaints-card" key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>

          <div className="complaints-heading complaints-process-heading">
            <span>HOW TO SUBMIT A COMPLAINT</span>
            <h2>Recommended steps</h2>
            <p>
              The following steps can help you present your concern clearly
              and ensure it reaches the appropriate office.
            </p>
          </div>

          <div className="complaints-steps">
            {complaintSteps.map((step) => (
              <article className="complaints-step" key={step.number}>
                <div className="complaints-step-number">{step.number}</div>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </div>
              </article>
            ))}
          </div>

          <div className="complaints-advice">
            <h2>Before submitting your complaint</h2>
            <ul>
              <li>Be clear, factual and respectful in your communication.</li>
              <li>Provide accurate information about the issue.</li>
              <li>Include relevant supporting documents where appropriate.</li>
              <li>Avoid sharing confidential information publicly.</li>
              <li>Keep copies of important correspondence and responses.</li>
              <li>Use the appropriate official reporting channel.</li>
            </ul>
          </div>

          <div className="complaints-emergency">
            <h2>Urgent safety concerns</h2>
            <p>
              If you or another student faces an immediate threat, danger or
              emergency, seek assistance promptly from the appropriate
              University authorities or emergency services. Do not rely on
              routine feedback channels for urgent situations.
            </p>
          </div>

          <div className="complaints-support">
            <h2>We are here to help</h2>
            <p>
              If you are unsure which office handles your concern, start by
              contacting the University through its recognised communication
              channels.
            </p>
            <div className="complaints-actions">
              <a href="/contact">Contact Us</a>
              <a href="/welfare" className="complaints-support-outline">
                Student Welfare
              </a>
            </div>
          </div>

          <div className="complaints-back">
            <a href="/resources">← Back to Student Resources</a>
          </div>
        </div>
      </section>
    </main>
  );
}
