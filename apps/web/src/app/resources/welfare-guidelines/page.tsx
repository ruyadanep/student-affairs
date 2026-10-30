
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Student Welfare and Support",
  description:
    "Student welfare, counselling, complaints and support guidance at Plateau State University, Bokkos.",
};

const supportServices = [
  {
    number: "01",
    title: "Counselling and Guidance",
    description:
      "Students who need personal guidance, emotional support or help navigating university life can seek assistance through the available counselling services.",
    points: [
      "Seek guidance when experiencing personal or academic difficulties.",
      "Request counselling through the appropriate university channel.",
      "Treat counselling appointments and processes respectfully.",
    ],
  },
  {
    number: "02",
    title: "Student Complaints and Feedback",
    description:
      "Students can raise concerns about their university experience through appropriate reporting and complaint channels.",
    points: [
      "Provide accurate information when submitting a complaint.",
      "Identify the relevant office or service involved.",
      "Keep any reference number or acknowledgement received.",
      "Follow up through the appropriate official channel.",
    ],
  },
  {
    number: "03",
    title: "Accessibility and Inclusion",
    description:
      "Students who require assistance accessing university facilities or services should contact the appropriate university office.",
    points: [
      "Communicate accessibility needs through the available channels.",
      "Request assistance where barriers affect participation.",
      "Respect the privacy and dignity of other members of the community.",
    ],
  },
  {
    number: "04",
    title: "Financial and Welfare Assistance",
    description:
      "Students facing financial or welfare-related challenges may seek information about available assistance and relevant university procedures.",
    points: [
      "Contact the appropriate office for current assistance information.",
      "Provide supporting information when formally requested.",
      "Observe announced application requirements and deadlines.",
    ],
  },
  {
    number: "05",
    title: "Accommodation and Personal Welfare",
    description:
      "Students experiencing accommodation or other welfare difficulties can contact the relevant university service for guidance.",
    points: [
      "Report hostel maintenance problems promptly.",
      "Raise accommodation concerns through appropriate channels.",
      "Seek assistance where living conditions affect wellbeing.",
    ],
  },
  {
    number: "06",
    title: "Student Safety and Emergency Concerns",
    description:
      "Students should promptly report urgent safety concerns to the appropriate University authorities or emergency services.",
    points: [
      "Do not ignore threats to personal safety.",
      "Report serious incidents through established channels.",
      "Follow instructions from authorised emergency personnel.",
    ],
  },
];

export default function WelfareGuidelinesPage() {
  return (
    <main className="welfare-guide-page">
      <section className="welfare-guide-hero">
        <div className="wrap">
          <span>PLATEAU STATE UNIVERSITY, BOKKOS</span>
          <h1>Student Welfare and Support</h1>
          <p>
            Your wellbeing matters. Find guidance on counselling,
            complaints, accessibility, welfare assistance and student support.
          </p>
          <a href="/resources">← Back to Student Resources</a>
        </div>
      </section>

      <div className="wrap welfare-guide-content">
        <section className="welfare-guide-notice">
          <strong>Important information</strong>
          <p>
            This page provides general guidance about student support.
            Specific assistance, eligibility, confidentiality arrangements
            and procedures are determined by the responsible University
            offices and applicable policies.
          </p>
        </section>

        <section className="welfare-guide-intro">
          <span>STUDENT WELLBEING</span>
          <h2>Support throughout your university journey</h2>
          <p>
            The Division of Student Affairs provides a point of contact
            for student welfare matters and helps students identify
            appropriate services and channels for assistance.
            Students are encouraged to seek help early when challenges arise.
          </p>
        </section>

        <div className="welfare-guide-grid">
          {supportServices.map((service) => (
            <article className="welfare-guide-card" key={service.number}>
              <span>{service.number}</span>
              <h2>{service.title}</h2>
              <p>{service.description}</p>
              <ul>
                {service.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <section className="welfare-guide-contact">
          <div>
            <span>WE ARE HERE TO HELP</span>
            <h2>Do you need student support?</h2>
            <p>
              Contact the Division of Student Affairs or access the
              available support services through the portal.
            </p>
          </div>

          <div className="welfare-guide-actions">
            <a href="/support">Access Student Support</a>
            <a href="/contact">Contact Student Affairs</a>
          </div>
        </section>

        <div className="welfare-guide-links">
          <a href="/resources/handbook">Student Handbook</a>
          <a href="/resources/code-of-conduct">Code of Conduct</a>
          <a href="/resources">All Student Resources</a>
        </div>
      </div>
    </main>
  );
}
