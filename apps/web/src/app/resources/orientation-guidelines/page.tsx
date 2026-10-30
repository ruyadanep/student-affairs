
const orientationSteps = [
  {
    number: "01",
    title: "Admission and Acceptance",
    description:
      "Confirm your admission status and follow the University's official instructions for accepting your admission.",
  },
  {
    number: "02",
    title: "Document Verification",
    description:
      "Prepare your admission documents, academic credentials and other required records for verification.",
  },
  {
    number: "03",
    title: "Payment of Approved Fees",
    description:
      "Consult official University payment instructions and complete applicable payments through authorised channels.",
  },
  {
    number: "04",
    title: "Student Registration",
    description:
      "Complete the registration process and provide accurate personal and academic information.",
  },
  {
    number: "05",
    title: "Course Registration",
    description:
      "Consult your department or faculty for guidance on the courses applicable to your programme and level.",
  },
  {
    number: "06",
    title: "Orientation Programme",
    description:
      "Participate in the official orientation programme to understand University procedures, services and student responsibilities.",
  },
  {
    number: "07",
    title: "Student Identification",
    description:
      "Follow the University's instructions for obtaining your student identification card and accessing relevant student services.",
  },
  {
    number: "08",
    title: "Commencement of Academic Activities",
    description:
      "Attend lectures, meet your academic advisers and keep track of departmental announcements and academic schedules.",
  },
];

export default function OrientationGuidelinesPage() {
  return (
    <main className="orientation-page">
      <section className="orientation-hero">
        <div className="orientation-container">
          <span className="orientation-eyebrow">STUDENT RESOURCES</span>
          <h1>Student Orientation and Registration Guidelines</h1>
          <p>
            Welcome to Plateau State University. Find guidance on preparing
            for university life, completing registration and getting started
            with your academic journey.
          </p>

          <div className="orientation-actions">
            <a href="/resources/academic-calendar">Academic Calendar</a>
            <a href="/resources" className="orientation-outline">
              All Student Resources
            </a>
          </div>
        </div>
      </section>

      <section className="orientation-content">
        <div className="orientation-container">
          <div className="orientation-intro">
            <span>WELCOME TO PLASU</span>
            <h2>Getting started as a student</h2>
            <p>
              Beginning university life involves several important activities.
              New and returning students should follow official University
              instructions, observe registration deadlines and consult their
              faculties or departments whenever clarification is needed.
            </p>
          </div>

          <div className="orientation-notice">
            <span className="orientation-notice-icon">!</span>
            <div>
              <h3>Important registration notice</h3>
              <p>
                The steps on this page provide general guidance. Specific
                requirements, payment procedures, deadlines, documents and
                orientation arrangements must be confirmed through official
                University announcements and the relevant offices.
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

          <div className="orientation-heading">
            <span>YOUR REGISTRATION JOURNEY</span>
            <h2>Important steps to follow</h2>
            <p>
              Use these general steps as a guide while completing the
              University's approved registration process.
            </p>
          </div>

          <div className="orientation-steps">
            {orientationSteps.map((step) => (
              <article className="orientation-step" key={step.number}>
                <div className="orientation-step-number">{step.number}</div>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </div>
              </article>
            ))}
          </div>

          <div className="orientation-checklist">
            <h2>Before you begin</h2>
            <p>
              Make sure you have reviewed the relevant instructions and
              prepared the information required for your registration.
            </p>

            <ul>
              <li>Confirm your admission or student status.</li>
              <li>Check official registration announcements and deadlines.</li>
              <li>Prepare the documents requested by the University.</li>
              <li>Use only authorised University payment channels.</li>
              <li>Keep copies of relevant receipts and registration records.</li>
              <li>Contact your faculty or department when you need assistance.</li>
            </ul>
          </div>

          <div className="orientation-support">
            <h2>Need assistance?</h2>
            <p>
              For questions about admission, registration or student services,
              consult the appropriate University office or use the portal's
              support channels.
            </p>
            <div className="orientation-actions">
              <a href="/contact">Contact the University</a>
              <a href="/support" className="orientation-support-outline">
                Student Support
              </a>
            </div>
          </div>

          <div className="orientation-back">
            <a href="/resources">← Back to Student Resources</a>
          </div>
        </div>
      </section>
    </main>
  );
}
