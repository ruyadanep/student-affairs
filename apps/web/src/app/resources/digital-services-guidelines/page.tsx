
import Link from "next/link";

const sections = [
  {
    number: "01",
    title: "Accessing University Digital Platforms",
    text: "Students should access online services through official University websites and approved platforms. Always verify the website address before entering personal information or account credentials.",
    points: [
      "Use official University links when accessing student services.",
      "Avoid logging in through suspicious links received by email or messaging applications.",
      "Use a trusted device and secure internet connection whenever possible.",
    ],
  },
  {
    number: "02",
    title: "Student Accounts and Login Details",
    text: "Your student account provides access to relevant University digital services. Keep your login information private and secure.",
    points: [
      "Never share your password or one-time verification code.",
      "Use a strong password that is difficult for others to guess.",
      "Sign out after using shared or public computers.",
      "Contact the appropriate support office if you suspect unauthorised access.",
    ],
  },
  {
    number: "03",
    title: "Keeping Your Profile Updated",
    text: "Ensure that your personal and academic information is accurate on the University's approved student platforms.",
    points: [
      "Check your name and other personal details.",
      "Use an active telephone number and email address.",
      "Report incorrect information through the appropriate University channel.",
      "Do not submit false or misleading information.",
    ],
  },
  {
    number: "04",
    title: "Online Registration and Course Enrolment",
    text: "Students may be required to complete certain academic and administrative processes online.",
    points: [
      "Follow the University's approved registration instructions.",
      "Complete registration within the announced period.",
      "Review selected courses before submitting your registration.",
      "Save or print available registration confirmations.",
      "Contact the relevant academic office if you encounter registration errors.",
    ],
  },
  {
    number: "05",
    title: "Online Payments and Receipts",
    text: "Use only payment channels officially approved and announced by the University.",
    points: [
      "Confirm payment instructions before making a transaction.",
      "Check the payment description and amount carefully.",
      "Keep transaction references and receipts.",
      "Do not transfer money to personal accounts claiming to represent the University.",
      "Report unsuccessful or unrecognised transactions through official channels.",
    ],
  },
  {
    number: "06",
    title: "Email and Online Communication",
    text: "Students should communicate professionally when using University digital services.",
    points: [
      "Use the appropriate official communication channel.",
      "Provide your name, department and relevant student information when requesting assistance.",
      "Write clear and respectful messages.",
      "Do not circulate unverified information or harmful content.",
    ],
  },
  {
    number: "07",
    title: "Cybersecurity and Online Safety",
    text: "Protect yourself against phishing, fraud, identity theft and other online threats.",
    points: [
      "Do not open suspicious attachments or links.",
      "Never disclose passwords, PINs or verification codes.",
      "Be cautious of messages promising admission, results or financial benefits in exchange for payment.",
      "Keep your browser, operating system and security software updated.",
      "Report suspicious activities through an appropriate University channel.",
    ],
  },
  {
    number: "08",
    title: "Technical Support and Reporting Problems",
    text: "Students experiencing problems with University digital services should report them through the appropriate support channel.",
    points: [
      "Describe the problem clearly.",
      "Identify the platform or service affected.",
      "Include the date and approximate time the problem occurred.",
      "Provide a screenshot of the error where appropriate, ensuring sensitive information is hidden.",
      "Keep any support reference or response for follow-up.",
    ],
  },
];

export default function DigitalServicesGuidelinesPage() {
  return (
    <main className="digital-services-page">
      <section className="digital-services-hero">
        <div className="digital-services-container">
          <div className="digital-services-breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <Link href="/resources">Resources</Link>
            <span>/</span>
            <span>IT and Digital Services</span>
          </div>

          <span className="digital-services-label">
            STUDENT INFORMATION AND GUIDANCE
          </span>

          <h1>Student IT and Digital Services Guidelines</h1>

          <p>
            A guide to accessing University digital platforms, managing
            student accounts, completing online processes and staying safe
            when using digital services.
          </p>

          <div className="digital-services-hero-actions">
            <a href="#guidelines" className="digital-services-primary-btn">
              Explore Guidelines
            </a>
            <Link href="/support" className="digital-services-secondary-btn">
              Get Support
            </Link>
          </div>
        </div>
      </section>

      <section className="digital-services-content" id="guidelines">
        <div className="digital-services-container">
          <div className="digital-services-intro">
            <div>
              <span className="digital-services-eyebrow">
                DIGITAL RESPONSIBILITY
              </span>
              <h2>Using University Digital Services Responsibly</h2>
            </div>
            <p>
              Digital platforms make it easier to access academic and
              administrative services. Students are encouraged to use these
              platforms responsibly, protect their personal information and
              follow official University instructions.
            </p>
          </div>

          <div className="digital-services-grid">
            {sections.map((section) => (
              <article
                className="digital-services-card"
                key={section.number}
              >
                <span className="digital-services-number">
                  {section.number}
                </span>
                <h3>{section.title}</h3>
                <p>{section.text}</p>
                <ul>
                  {section.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>

          <div className="digital-services-warning">
            <div className="digital-services-warning-icon">!</div>
            <div>
              <h3>Important Notice</h3>
              <p>
                These guidelines provide general student information and
                should not be treated as an official University IT policy.
                Approved portal addresses, registration procedures, payment
                instructions, technical support arrangements and applicable
                digital policies are determined by Plateau State University.
                Always follow current official University announcements.
              </p>
            </div>
          </div>

          <div className="digital-services-related">
            <h2>Related Student Resources</h2>
            <div className="digital-services-links">
              <Link href="/resources/orientation-guidelines">
                Orientation and Registration Guidelines <span>→</span>
              </Link>
              <Link href="/resources/complaints-guidelines">
                Complaints and Feedback <span>→</span>
              </Link>
              <Link href="/resources/code-of-conduct">
                Student Code of Conduct <span>→</span>
              </Link>
              <Link href="/support">
                Student Support Services <span>→</span>
              </Link>
              <Link href="/contact">
                Contact Student Affairs <span>→</span>
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
