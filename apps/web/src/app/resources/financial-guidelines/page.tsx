
import Link from "next/link";

const sections = [
  {
    number: "01",
    title: "Understanding University Fees",
    description:
      "Students should familiarise themselves with the approved fees and financial obligations applicable to their programme and level of study.",
    points: [
      "Check the current approved fee schedule.",
      "Confirm the charges applicable to your programme and student category.",
      "Read official announcements concerning changes to fees.",
      "Seek clarification from the appropriate University office when necessary.",
    ],
  },
  {
    number: "02",
    title: "Accessing Payment Instructions",
    description:
      "Always obtain payment instructions through official University channels before making any transaction.",
    points: [
      "Use the University's approved payment platform or designated channel.",
      "Confirm the payment description and amount.",
      "Check the applicable payment deadline.",
      "Do not rely on unofficial messages or payment instructions.",
    ],
  },
  {
    number: "03",
    title: "Making Approved Payments",
    description:
      "Students should ensure that all University payments are made through authorised channels.",
    points: [
      "Follow the official payment process.",
      "Enter the correct student identification details.",
      "Confirm the transaction information before payment.",
      "Do not transfer money into personal bank accounts.",
      "Avoid making duplicate payments without first checking transaction status.",
    ],
  },
  {
    number: "04",
    title: "Payment Confirmation and Receipts",
    description:
      "Payment evidence should be retained for future verification and administrative purposes.",
    points: [
      "Save or download your payment receipt.",
      "Keep transaction references and bank confirmation details.",
      "Verify that successful payments are reflected on the appropriate platform.",
      "Report payments that are not properly reflected.",
    ],
  },
  {
    number: "05",
    title: "Failed, Pending or Duplicate Transactions",
    description:
      "Payment problems should be reported through the appropriate official channels for investigation.",
    points: [
      "Check your bank or payment provider's transaction status.",
      "Keep the transaction reference and date.",
      "Provide evidence when reporting a payment problem.",
      "Do not repeatedly pay without confirming the earlier transaction.",
      "Follow the University's approved resolution procedure.",
    ],
  },
  {
    number: "06",
    title: "Scholarships and Financial Assistance",
    description:
      "Students may explore approved scholarship, bursary and financial assistance opportunities when available.",
    points: [
      "Monitor official University and government announcements.",
      "Read eligibility and application requirements carefully.",
      "Submit accurate information and supporting documents.",
      "Observe application deadlines.",
      "Verify external scholarship opportunities before sharing personal information.",
    ],
  },
  {
    number: "07",
    title: "Outstanding Financial Obligations",
    description:
      "Students should monitor their financial records and resolve outstanding obligations through approved University procedures.",
    points: [
      "Check your payment history and outstanding balances.",
      "Keep evidence of payments already made.",
      "Report incorrect charges or payment records.",
      "Seek clarification before making disputed payments.",
      "Follow official instructions concerning financial clearance.",
    ],
  },
  {
    number: "08",
    title: "Avoiding Financial Scams",
    description:
      "Students should remain alert to fraudulent payment requests and individuals claiming to offer unofficial financial assistance.",
    points: [
      "Never pay individuals who promise admission, results or clearance.",
      "Do not disclose banking PINs, passwords or verification codes.",
      "Verify payment instructions before transferring funds.",
      "Be cautious of scholarship offers requiring suspicious upfront payments.",
      "Report suspected fraud through appropriate University channels.",
    ],
  },
];

export default function FinancialGuidelinesPage() {
  return (
    <main className="financial-guide-page">
      <section className="financial-guide-hero">
        <div className="financial-guide-container">
          <div className="financial-guide-breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <Link href="/resources">Resources</Link>
            <span>/</span>
            <span>Fees and Payments</span>
          </div>

          <span className="financial-guide-label">
            STUDENT FINANCIAL INFORMATION
          </span>

          <h1>Student Financial Obligations, Fees and Payment Guidelines</h1>

          <p>
            Important information on University fees, approved payment
            procedures, payment verification, receipts, financial assistance
            and protection against payment fraud.
          </p>

          <div className="financial-guide-actions">
            <a href="#guidelines" className="financial-guide-primary">
              Explore Guidelines
            </a>
            <Link
              href="/resources/scholarship-guidelines"
              className="financial-guide-secondary"
            >
              Scholarships and Assistance
            </Link>
          </div>
        </div>
      </section>

      <section className="financial-guide-content" id="guidelines">
        <div className="financial-guide-container">
          <div className="financial-guide-intro">
            <div>
              <span className="financial-guide-eyebrow">
                RESPONSIBLE STUDENT FINANCIAL MANAGEMENT
              </span>
              <h2>Understand Your Financial Responsibilities</h2>
            </div>
            <p>
              Proper financial management helps students meet their
              University obligations and maintain accurate payment records.
              Always rely on approved fee schedules and official payment
              instructions.
            </p>
          </div>

          <div className="financial-guide-notice">
            <strong>Important Notice:</strong> This page provides general
            guidance only. Actual fees, payment deadlines, approved payment
            channels, refund procedures and financial clearance requirements
            are determined by the University and may change. Confirm current
            information through official University announcements and
            authorised offices.
          </div>

          <div className="financial-guide-grid">
            {sections.map((section) => (
              <article
                className="financial-guide-card"
                key={section.number}
              >
                <span className="financial-guide-number">
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

          <div className="financial-guide-checklist">
            <span className="financial-guide-eyebrow">
              BEFORE MAKING A PAYMENT
            </span>
            <h2>Student Payment Checklist</h2>
            <div className="financial-guide-checks">
              <div>✓ Confirm the approved amount.</div>
              <div>✓ Use an authorised payment channel.</div>
              <div>✓ Verify your student details.</div>
              <div>✓ Check the transaction before submitting.</div>
              <div>✓ Save your payment receipt.</div>
              <div>✓ Confirm successful payment on the relevant platform.</div>
            </div>
          </div>

          <div className="financial-guide-warning">
            <h3>Protect Your Money and Personal Information</h3>
            <p>
              Plateau State University students should be cautious of
              unofficial payment requests. Do not send money to personal
              accounts or disclose your banking credentials to anyone
              claiming to represent the University. Verify all financial
              instructions through authorised University channels.
            </p>
          </div>

          <div className="financial-guide-related">
            <h2>Related Student Resources</h2>
            <div className="financial-guide-links">
              <Link href="/resources/scholarship-guidelines">
                Scholarships and Financial Assistance <span>→</span>
              </Link>
              <Link href="/resources/digital-services-guidelines">
                IT and Digital Services <span>→</span>
              </Link>
              <Link href="/resources/clearance-guidelines">
                Student Clearance Guidelines <span>→</span>
              </Link>
              <Link href="/resources/orientation-guidelines">
                Orientation and Registration <span>→</span>
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
