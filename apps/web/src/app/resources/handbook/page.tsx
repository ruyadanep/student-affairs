
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Student Handbook",
  description:
    "Student information, guidance and responsibilities at Plateau State University, Bokkos.",
};

const sections = [
  {
    number: "01",
    title: "Admission and Registration",
    text: "Students are expected to complete their admission and registration processes within the periods announced by the University. Keep your admission documents, registration details and student identification information safe.",
    points: [
      "Complete all required registration procedures.",
      "Provide accurate personal and academic information.",
      "Keep evidence of registration and payments.",
      "Observe deadlines published by the University.",
    ],
  },
  {
    number: "02",
    title: "Student Conduct and Responsibilities",
    text: "Every student is expected to conduct themselves responsibly, respect members of the University community and comply with approved University rules and regulations.",
    points: [
      "Respect lecturers, staff, fellow students and visitors.",
      "Protect University property and facilities.",
      "Avoid violence, harassment, bullying and intimidation.",
      "Observe applicable University rules and disciplinary procedures.",
    ],
  },
  {
    number: "03",
    title: "Accommodation and Hostel Life",
    text: "Students using University accommodation are expected to comply with hostel allocation procedures and applicable accommodation regulations.",
    points: [
      "Use only accommodation officially allocated to you.",
      "Maintain cleanliness and order in hostel facilities.",
      "Respect roommates and other residents.",
      "Report maintenance problems through the appropriate channel.",
    ],
  },
  {
    number: "04",
    title: "Welfare and Student Support",
    text: "The Division of Student Affairs provides a point of contact for student welfare matters and support services.",
    points: [
      "Seek assistance when facing welfare-related difficulties.",
      "Use the appropriate channels to report complaints.",
      "Treat confidential support processes responsibly.",
      "Respect the rights and wellbeing of other students.",
    ],
  },
  {
    number: "05",
    title: "Student Organisations and Activities",
    text: "Students are encouraged to participate in recognised associations, clubs, societies, sports and other approved campus activities.",
    points: [
      "Follow registration procedures for student organisations.",
      "Ensure activities receive required University approval.",
      "Promote peaceful and inclusive participation.",
      "Comply with applicable rules for events and gatherings.",
    ],
  },
  {
    number: "06",
    title: "Clearance and Graduation",
    text: "Students should follow the University's clearance procedures when required, ensuring that all relevant units have completed their verification.",
    points: [
      "Check clearance requirements and instructions.",
      "Submit requested documents promptly.",
      "Resolve outstanding obligations with the relevant units.",
      "Keep records of clearance confirmations.",
    ],
  },
];

export default function HandbookPage() {
  return (
    <main className="handbook-page">
      <section className="handbook-hero">
        <div className="wrap">
          <span className="handbook-eyebrow">
            PLATEAU STATE UNIVERSITY, BOKKOS
          </span>
          <h1>Student Handbook</h1>
          <p>
            A guide to student life, responsibilities, support services
            and important information for members of the University community.
          </p>
          <a href="/resources" className="handbook-back">
            ← Back to Student Resources
          </a>
        </div>
      </section>

      <div className="wrap handbook-content">
        <section className="handbook-notice">
          <strong>Important notice</strong>
          <p>
            This page provides general student guidance. It is not a
            replacement for the officially approved Student Handbook,
            University statutes, regulations or directives. Official
            University documents and current management decisions take
            precedence.
          </p>
        </section>

        <section className="handbook-intro">
          <span>WELCOME TO PLASU</span>
          <h2>Information for your university journey</h2>
          <p>
            The Division of Student Affairs supports students beyond the
            classroom by providing guidance on accommodation, welfare,
            student organisations, campus activities and other student
            services.
          </p>
        </section>

        <div className="handbook-layout">
          <aside className="handbook-toc">
            <h2>Contents</h2>
            <a href="#registration">Admission and Registration</a>
            <a href="#conduct">Student Conduct</a>
            <a href="#accommodation">Accommodation</a>
            <a href="#welfare">Welfare and Support</a>
            <a href="#organisations">Student Organisations</a>
            <a href="#clearance">Clearance and Graduation</a>
            <a href="#help">Getting Assistance</a>
          </aside>

          <div className="handbook-sections">
            {sections.map((section, index) => (
              <section
                className="handbook-section"
                id={
                  [
                    "registration",
                    "conduct",
                    "accommodation",
                    "welfare",
                    "organisations",
                    "clearance",
                  ][index]
                }
                key={section.number}
              >
                <span className="handbook-number">{section.number}</span>
                <h2>{section.title}</h2>
                <p>{section.text}</p>
                <ul>
                  {section.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </div>

        <section className="handbook-help" id="help">
          <div>
            <span>STUDENT SUPPORT</span>
            <h2>Need help or clarification?</h2>
            <p>
              Contact the Division of Student Affairs or access the
              relevant student service through the portal.
            </p>
          </div>
          <div className="handbook-actions">
            <a href="/contact">Contact Student Affairs</a>
            <a href="/support">Student Support Services</a>
          </div>
        </section>
      </div>
    </main>
  );
}
