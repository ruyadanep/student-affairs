
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Student Clearance Guidelines",
  description:
    "Guidance on student clearance procedures at Plateau State University, Bokkos.",
};

const stages = [
  {
    number: "01",
    title: "Access the Clearance Portal",
    description:
      "Sign in to the Student Affairs Portal using your registered student account and open the clearance service.",
  },
  {
    number: "02",
    title: "Review Clearance Requirements",
    description:
      "Check the instructions and requirements displayed for your clearance category or academic status.",
  },
  {
    number: "03",
    title: "Submit Required Information",
    description:
      "Provide the requested information and upload supporting documents where the portal requires them.",
  },
  {
    number: "04",
    title: "Unit Verification",
    description:
      "The relevant University units review the submitted information and record their clearance decisions.",
  },
  {
    number: "05",
    title: "Monitor Your Progress",
    description:
      "Return to the portal to check the status of each clearance stage and respond to outstanding requests.",
  },
  {
    number: "06",
    title: "Confirm Completion",
    description:
      "Check that all required units have completed their verification and follow any final instructions issued by the University.",
  },
];

const tips = [
  "Use your correct student account when accessing the portal.",
  "Provide accurate information and valid supporting documents.",
  "Check your clearance status regularly.",
  "Respond promptly when a unit requests additional information.",
  "Keep copies of relevant submission and payment records.",
  "Contact the appropriate office if a clearance stage remains unresolved.",
];

export default function ClearanceGuidelinesPage() {
  return (
    <main className="clearance-guide-page">
      <section className="clearance-guide-hero">
        <div className="wrap">
          <span>PLATEAU STATE UNIVERSITY, BOKKOS</span>
          <h1>Student Clearance Guidelines</h1>
          <p>
            Understand the clearance process, follow the required steps
            and monitor your progress through the Student Affairs Portal.
          </p>
          <a href="/resources">← Back to Student Resources</a>
        </div>
      </section>

      <div className="wrap clearance-guide-content">
        <section className="clearance-guide-notice">
          <strong>Important information</strong>
          <p>
            These are general instructions to help students navigate
            the portal. Specific clearance requirements, responsible
            units and deadlines are determined by the University and
            may differ according to the student's circumstances.
          </p>
        </section>

        <section className="clearance-guide-intro">
          <span>YOUR CLEARANCE JOURNEY</span>
          <h2>How the clearance process works</h2>
          <p>
            Student clearance involves the verification of relevant
            student records and obligations by designated University
            units. The portal helps students follow the process and
            identify outstanding clearance stages.
          </p>
          <a href="/clearance" className="clearance-guide-button">
            Access Clearance Portal →
          </a>
        </section>

        <section className="clearance-guide-stages">
          <h2>Clearance process</h2>
          <div className="clearance-stage-list">
            {stages.map((stage) => (
              <article className="clearance-stage" key={stage.number}>
                <div className="clearance-stage-number">
                  {stage.number}
                </div>
                <div>
                  <h3>{stage.title}</h3>
                  <p>{stage.description}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="clearance-guide-tips">
          <span>BEFORE YOU BEGIN</span>
          <h2>Helpful tips for students</h2>
          <ul>
            {tips.map((tip) => (
              <li key={tip}>{tip}</li>
            ))}
          </ul>
        </section>

        <section className="clearance-guide-help">
          <div>
            <span>NEED ASSISTANCE?</span>
            <h2>Having difficulty with clearance?</h2>
            <p>
              Contact Student Affairs or the relevant clearance unit
              for assistance with unresolved requirements.
            </p>
          </div>
          <div className="clearance-guide-actions">
            <a href="/clearance">Open Clearance Portal</a>
            <a href="/contact">Contact Student Affairs</a>
          </div>
        </section>

        <div className="clearance-guide-links">
          <a href="/resources/handbook">Student Handbook</a>
          <a href="/resources/code-of-conduct">Code of Conduct</a>
          <a href="/resources">All Resources</a>
        </div>
      </div>
    </main>
  );
}
