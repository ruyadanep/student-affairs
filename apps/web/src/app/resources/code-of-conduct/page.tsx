
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Student Code of Conduct",
  description:
    "Guidance on responsible conduct and behaviour for students of Plateau State University, Bokkos.",
};

const conductRules = [
  {
    number: "01",
    title: "Respect and Good Behaviour",
    description:
      "Students should treat lecturers, staff, fellow students, visitors and members of the University community with dignity and respect.",
    points: [
      "Avoid harassment, bullying, intimidation and discrimination.",
      "Respect the rights, privacy and property of others.",
      "Promote peaceful coexistence within the University.",
    ],
  },
  {
    number: "02",
    title: "Academic Integrity",
    description:
      "Students are expected to demonstrate honesty and integrity in all academic activities.",
    points: [
      "Avoid examination malpractice and plagiarism.",
      "Do not falsify academic records or University documents.",
      "Observe examination and assessment regulations.",
    ],
  },
  {
    number: "03",
    title: "Protection of University Property",
    description:
      "University buildings, equipment, facilities and other resources should be used responsibly.",
    points: [
      "Avoid vandalism and deliberate damage to property.",
      "Use classrooms, laboratories and other facilities appropriately.",
      "Report damage, safety concerns and faults through the proper channels.",
    ],
  },
  {
    number: "04",
    title: "Peaceful Campus Environment",
    description:
      "Students should contribute to a safe, orderly and peaceful learning environment.",
    points: [
      "Avoid violence, threats and unlawful gatherings.",
      "Follow approved procedures for events and student activities.",
      "Cooperate with authorised University safety instructions.",
    ],
  },
  {
    number: "05",
    title: "Hostel and Accommodation Conduct",
    description:
      "Students living in University accommodation should respect hostel rules and the welfare of other residents.",
    points: [
      "Observe approved hostel regulations.",
      "Keep rooms and shared facilities clean.",
      "Respect roommates and other residents.",
      "Do not occupy rooms without proper allocation.",
    ],
  },
  {
    number: "06",
    title: "Responsible Use of Digital Services",
    description:
      "Students should use University digital platforms and online services responsibly.",
    points: [
      "Keep account passwords and login details secure.",
      "Do not impersonate another student or staff member.",
      "Do not attempt unauthorised access to University systems.",
      "Avoid sharing false or harmful information.",
    ],
  },
];

export default function CodeOfConductPage() {
  return (
    <main className="conduct-page">
      <section className="conduct-hero">
        <div className="wrap">
          <span>PLATEAU STATE UNIVERSITY, BOKKOS</span>
          <h1>Student Code of Conduct</h1>
          <p>
            Promoting integrity, responsibility, mutual respect and a
            peaceful university environment.
          </p>
          <a href="/resources">← Back to Student Resources</a>
        </div>
      </section>

      <div className="wrap conduct-content">
        <div className="conduct-notice">
          <strong>Important policy notice</strong>
          <p>
            This page provides general guidance and is not a substitute
            for the officially approved rules, statutes, regulations or
            disciplinary procedures of Plateau State University. Official
            University documents take precedence.
          </p>
        </div>

        <section className="conduct-intro">
          <span>OUR EXPECTATIONS</span>
          <h2>Building a responsible university community</h2>
          <p>
            Every student has a role in maintaining an environment that
            supports learning, personal development, safety and peaceful
            coexistence. Students are expected to act responsibly on
            campus and whenever representing the University.
          </p>
        </section>

        <div className="conduct-grid">
          {conductRules.map((rule) => (
            <article className="conduct-card" key={rule.number}>
              <span className="conduct-number">{rule.number}</span>
              <h2>{rule.title}</h2>
              <p>{rule.description}</p>
              <ul>
                {rule.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <section className="conduct-report">
          <div>
            <span>STUDENT SUPPORT</span>
            <h2>Need to report a concern?</h2>
            <p>
              Students who need assistance or wish to raise a concern
              should contact the appropriate University office through
              established channels.
            </p>
          </div>
          <a href="/contact">Contact Student Affairs →</a>
        </section>

        <div className="conduct-footer-links">
          <a href="/resources/handbook">Student Handbook</a>
          <a href="/resources">All Student Resources</a>
          <a href="/faq">Frequently Asked Questions</a>
        </div>
      </div>
    </main>
  );
}
