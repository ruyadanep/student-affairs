
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hostel Rules and Regulations",
  description:
    "Accommodation guidance and hostel responsibilities for Plateau State University students.",
};

const rules = [
  {
    number: "01",
    title: "Room Allocation and Occupancy",
    description:
      "Students should occupy only rooms officially allocated to them through the University's approved accommodation process.",
    points: [
      "Complete the official hostel application process.",
      "Use only your allocated room and bed space.",
      "Do not transfer or exchange accommodation without approval.",
      "Report unauthorised occupancy to the appropriate office.",
    ],
  },
  {
    number: "02",
    title: "Cleanliness and Hygiene",
    description:
      "Every resident shares responsibility for maintaining a clean, healthy and comfortable hostel environment.",
    points: [
      "Keep rooms and personal spaces clean.",
      "Dispose of waste in designated areas.",
      "Maintain cleanliness in bathrooms and shared facilities.",
      "Avoid activities that create health or sanitation risks.",
    ],
  },
  {
    number: "03",
    title: "Security and Safety",
    description:
      "Residents should take reasonable steps to protect themselves, other residents and University property.",
    points: [
      "Keep personal belongings secure.",
      "Report suspicious activities and security concerns.",
      "Do not interfere with safety equipment.",
      "Follow authorised emergency and safety instructions.",
    ],
  },
  {
    number: "04",
    title: "Visitors and Consideration for Others",
    description:
      "Residents should respect other occupants and comply with any approved visitor arrangements.",
    points: [
      "Observe official visitor access requirements and hours.",
      "Respect roommates and neighbouring residents.",
      "Avoid excessive noise and disruptive behaviour.",
      "Do not allow unauthorised persons to occupy rooms.",
    ],
  },
  {
    number: "05",
    title: "Maintenance and University Property",
    description:
      "Hostel facilities should be used responsibly and any faults should be reported promptly.",
    points: [
      "Report leaking pipes, electrical faults and damaged fittings.",
      "Do not deliberately damage University property.",
      "Avoid unauthorised electrical or structural alterations.",
      "Use furniture and facilities for their intended purposes.",
    ],
  },
  {
    number: "06",
    title: "Prohibited and Unsafe Activities",
    description:
      "Students must comply with applicable University regulations and relevant laws while residing in University accommodation.",
    points: [
      "Avoid violence, threats, harassment and intimidation.",
      "Do not engage in activities that endanger residents.",
      "Do not engage in unlawful activities within hostel premises.",
      "Observe all approved University accommodation regulations.",
    ],
  },
];

export default function HostelRegulationsPage() {
  return (
    <main className="hostel-rules-page">
      <section className="hostel-rules-hero">
        <div className="wrap">
          <span>PLATEAU STATE UNIVERSITY, BOKKOS</span>
          <h1>Hostel Rules and Regulations</h1>
          <p>
            Guidelines for safe, responsible and comfortable living
            within University accommodation.
          </p>
          <a href="/resources">← Back to Student Resources</a>
        </div>
      </section>

      <div className="wrap hostel-rules-content">
        <section className="hostel-rules-notice">
          <strong>Important accommodation notice</strong>
          <p>
            This page provides general accommodation guidance. It is not
            a substitute for the officially approved PLASU Hostel Rules
            and Regulations. Students must comply with current University
            directives and the rules issued by the appropriate authorities.
          </p>
        </section>

        <section className="hostel-rules-intro">
          <span>RESIDENTIAL LIFE</span>
          <h2>Living responsibly in University accommodation</h2>
          <p>
            University accommodation provides students with an
            environment for rest, personal development and academic
            engagement. Every resident has a responsibility to promote
            cleanliness, safety, mutual respect and peaceful coexistence.
          </p>
        </section>

        <div className="hostel-rules-grid">
          {rules.map((rule) => (
            <article className="hostel-rule-card" key={rule.number}>
              <span>{rule.number}</span>
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

        <section className="hostel-rules-process">
          <span>HOSTEL SERVICES</span>
          <h2>Access accommodation services</h2>
          <p>
            Use the Student Affairs Portal to access available hostel
            services and submit accommodation-related requests.
          </p>

          <div className="hostel-rules-actions">
            <a href="/hostels">Hostel Accommodation</a>
            <a href="/maintenance">Report a Maintenance Issue</a>
            <a href="/contact">Contact Student Affairs</a>
          </div>
        </section>

        <div className="hostel-rules-bottom">
          <a href="/resources/handbook">Student Handbook</a>
          <a href="/resources/code-of-conduct">Student Code of Conduct</a>
          <a href="/resources">All Student Resources</a>
        </div>
      </div>
    </main>
  );
}
