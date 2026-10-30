
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Student Resources | PLASU Student Affairs",
  description:
    "Student guidelines, university information, accommodation guidance and support resources for Plateau State University, Bokkos.",
};

const resourceGroups = [
  {
    title: "Student Guidelines and Information",
    description:
      "Essential information about student responsibilities, university life and academic activities.",
    items: [
      {
        title: "Student Handbook",
        description:
          "General information about university life, student expectations and important procedures.",
        status: "Guidelines available",
        href: "/resources/handbook",
      },
      {
        title: "Student Code of Conduct",
        description:
          "Rules, responsibilities and expected standards of student conduct.",
        status: "Read guidelines",
        href: "/resources/code-of-conduct",
      },
      {
        title: "Academic Calendar",
        description:
          "Important academic dates, registration periods and examination schedules.",
        status: "View calendar",
        href: "/resources/academic-calendar",
      },
      {
        title: "Student Orientation and Registration",
        description:
          "Guidance for new students on admission, registration and orientation.",
        status: "View guidelines",
        href: "/resources/orientation-guidelines",
      },
      {
        title: "Student Leadership, Clubs and Associations",
        description:
          "Guidance on student leadership, recognised clubs and associations.",
        status: "View guidelines",
        href: "/resources/student-organisations",
      },
      {
        title: "University Website",
        description:
          "Visit the official Plateau State University website.",
        status: "Visit website",
        href: "https://plasu.edu.ng/",
      },
    ],
  },
  {
    title: "Accommodation, Safety and Welfare",
    description:
      "Information to help students access accommodation and maintain a safe and healthy campus experience.",
    items: [
      {
        title: "Hostel Accommodation",
        description:
          "Access the Student Affairs Portal's hostel accommodation service.",
        status: "Open service",
        href: "/hostels",
      },
      {
        title: "Hostel Application and Accommodation Guidelines",
        description:
          "Guidance on hostel applications, room allocation and student residence.",
        status: "View guidelines",
        href: "/resources/hostel-application-guidelines",
      },
      {
        title: "Hostel Rules and Regulations",
        description:
          "Guidelines for students living in University accommodation.",
        status: "Read regulations",
        href: "/resources/hostel-regulations",
      },
      {
        title: "Student Health and Wellness Guidelines",
        description:
          "Guidance on medical services, personal hygiene, mental health and student wellbeing.",
        status: "View guidelines",
        href: "/resources/health-wellness-guidelines",
      },
      {
        title: "Student Welfare and Support Guidelines",
        description:
          "Counselling, complaints, accessibility and student assistance.",
        status: "View guidelines",
        href: "/resources/welfare-guidelines",
      },
      {
        title: "Student Safety and Security Guidelines",
        description:
          "Campus safety, security awareness and emergency response guidance.",
        status: "View guidelines",
        href: "/resources/safety-guidelines",
      },
    ],
  },
  {
    title: "Academic, Financial and Career Development",
    description:
      "Guidance on industrial training, financial assistance, student clearance and graduation.",
    items: [
      {
        title: "Student Clearance Guidelines",
        description:
          "Understand the student clearance process and requirements.",
        status: "View guidelines",
        href: "/resources/clearance-guidelines",
      },
      {
        title: "Scholarship and Financial Assistance",
        description:
          "Guidance on scholarships, bursaries and student financial support.",
        status: "View guidelines",
        href: "/resources/scholarship-guidelines",
      },
      {
        title: "Student Financial Obligations and Payment Guidelines",
        description:
          "Guidance on University fees, approved payments, receipts and financial assistance.",
        status: "View guidelines",
        href: "/resources/financial-guidelines",
      },
      {
        title: "SIWES and Industrial Training Guidelines",
        description:
          "Guidance on industrial attachment, workplace conduct, logbooks and assessment.",
        status: "View guidelines",
        href: "/resources/siwes-guidelines",
      },
      {
        title: "NYSC Mobilisation and Graduation Guidelines",
        description:
          "Guidance for final-year students on clearance, NYSC mobilisation and graduation.",
        status: "View guidelines",
        href: "/resources/nysc-guidelines",
      },
    ],
  },
  {
    title: "Forms, Digital Services and Support",
    description:
      "Access online services, submit requests and find assistance when you need it.",
    items: [
      {
        title: "Letters and Attestations",
        description:
          "Request official student letters and attestations.",
        status: "Open service",
        href: "/letters",
      },
      {
        title: "Student IT and Digital Services Guidelines",
        description:
          "Guidance on student portals, online registration and digital account security.",
        status: "View guidelines",
        href: "/resources/digital-services-guidelines",
      },
      {
        title: "Student Complaints and Feedback",
        description:
          "Guidance on reporting concerns and seeking assistance.",
        status: "View guidelines",
        href: "/resources/complaints-guidelines",
      },
      {
        title: "Student Support",
        description:
          "Access welfare and student support services.",
        status: "Open service",
        href: "/support",
      },
      {
        title: "Frequently Asked Questions",
        description:
          "Find answers to common questions about Student Affairs.",
        status: "View FAQs",
        href: "/faq",
      },
    ],
  },
];

export default function ResourcesPage() {
  const totalResources = resourceGroups.reduce(
    (total, group) => total + group.items.length,
    0
  );

  return (
    <main className="resources-page">
      <section className="resources-hero">
        <div className="wrap">
          <span className="resources-eyebrow">
            PLATEAU STATE UNIVERSITY, BOKKOS
          </span>

          <h1>Student Resources</h1>

          <p>
            Find important information, university guidelines and
            useful links to help you navigate your university experience.
          </p>

          <div className="resources-hero-meta">
            <span>{totalResources} Student Resources</span>
            <span>{resourceGroups.length} Resource Categories</span>
          </div>
        </div>
      </section>

      <div className="wrap resources-content">
        <div className="resources-intro">
          <span className="resources-label">RESOURCE CENTRE</span>

          <h2>Information and services in one place</h2>

          <p>
            The Division of Student Affairs provides access to useful
            information and services that support students throughout
            their time at Plateau State University.
          </p>
        </div>

        <div className="resources-groups">
          {resourceGroups.map((group, index) => (
            <section className="resources-group" key={group.title}>
              <div className="resources-group-heading">
                <span>
                  {String(index + 1).padStart(2, "0")}
                </span>

                <div>
                  <h2>{group.title}</h2>
                  <p>{group.description}</p>
                </div>
              </div>

              <div className="resources-grid">
                {group.items.map((item) => (
                  <article
                    className="resource-card"
                    key={item.href}
                  >
                    <div className="resource-card-icon">
                      <span aria-hidden="true">▤</span>
                    </div>

                    <h3>{item.title}</h3>

                    <p>{item.description}</p>

                    <a
                      href={item.href}
                      className="resource-card-link"
                      target={
                        item.href.startsWith("http")
                          ? "_blank"
                          : undefined
                      }
                      rel={
                        item.href.startsWith("http")
                          ? "noopener noreferrer"
                          : undefined
                      }
                    >
                      {item.status}
                      <span aria-hidden="true">→</span>
                    </a>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>

        <section className="resources-help">
          <div>
            <span>NEED ASSISTANCE?</span>

            <h2>Can't find what you are looking for?</h2>

            <p>
              Contact the Division of Student Affairs for guidance
              and assistance.
            </p>
          </div>

          <a
            href="/contact"
            className="resources-help-button"
          >
            Contact Student Affairs →
          </a>
        </section>
      </div>
    </main>
  );
}
