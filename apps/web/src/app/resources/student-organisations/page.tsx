
const organisationTypes = [
  {
    title: "Student Union Government (SUG)",
    description:
      "The recognised student representative structure through which students participate in student affairs and communicate collective concerns.",
  },
  {
    title: "Faculty and Departmental Associations",
    description:
      "Academic-based associations that encourage student participation, professional development and collaboration within faculties and departments.",
  },
  {
    title: "Religious and Fellowship Groups",
    description:
      "Recognised religious and fellowship groups that promote spiritual development, mutual support and responsible community participation.",
  },
  {
    title: "Professional and Academic Societies",
    description:
      "Student groups that encourage professional networking, academic interest, research, innovation and career development.",
  },
  {
    title: "Social and Cultural Clubs",
    description:
      "Clubs that provide opportunities for creativity, cultural expression, recreation and positive social interaction.",
  },
  {
    title: "Sports and Recreational Groups",
    description:
      "Student groups that promote physical fitness, teamwork, sporting activities and healthy competition.",
  },
];

const leadershipResponsibilities = [
  "Represent members fairly and communicate their concerns responsibly.",
  "Promote unity, respect, inclusion and peaceful participation.",
  "Maintain transparency and accountability in organisational activities.",
  "Observe applicable University rules and approved procedures.",
  "Protect the property and reputation of the University.",
  "Avoid discrimination, intimidation, harassment and misuse of authority.",
];

const registrationSteps = [
  {
    number: "01",
    title: "Identify the Organisation",
    description:
      "Determine the purpose, objectives and proposed membership of the student organisation.",
  },
  {
    number: "02",
    title: "Consult the Appropriate Office",
    description:
      "Seek guidance from the relevant University office on recognition and registration requirements.",
  },
  {
    number: "03",
    title: "Prepare Required Information",
    description:
      "Provide the constitution, proposed leadership structure, membership details and other documents where required.",
  },
  {
    number: "04",
    title: "Submit for Consideration",
    description:
      "Submit the application through the official University channel and follow the instructions provided.",
  },
  {
    number: "05",
    title: "Obtain Official Approval",
    description:
      "Do not represent an organisation as officially recognised until the required approval has been granted.",
  },
  {
    number: "06",
    title: "Maintain Compliance",
    description:
      "Keep organisational records and follow University requirements for meetings, events, elections and activities.",
  },
];

export default function StudentOrganisationsPage() {
  return (
    <main className="organisations-page">
      <section className="organisations-hero">
        <div className="organisations-container">
          <span className="organisations-eyebrow">STUDENT RESOURCES</span>
          <h1>Student Leadership, Clubs and Associations</h1>
          <p>
            Discover guidance on student representation, leadership,
            recognised associations and extracurricular participation at
            Plateau State University.
          </p>

          <div className="organisations-actions">
            <a href="/support">Student Support</a>
            <a href="/resources" className="organisations-outline">
              All Student Resources
            </a>
          </div>
        </div>
      </section>

      <section className="organisations-content">
        <div className="organisations-container">
          <div className="organisations-intro">
            <span>STUDENT PARTICIPATION</span>
            <h2>Building an active student community</h2>
            <p>
              Student organisations provide opportunities for leadership,
              collaboration, personal development and participation in
              University life. Students are encouraged to take part in
              recognised activities while maintaining their academic
              responsibilities.
            </p>
          </div>

          <div className="organisations-notice">
            <div className="organisations-notice-icon">!</div>
            <div>
              <h3>Recognition and approval</h3>
              <p>
                This page provides general guidance and is not a substitute
                for official University regulations. The recognition,
                registration, election, funding and operation of student
                organisations are subject to applicable University policies
                and approval procedures.
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

          <div className="organisations-heading">
            <span>STUDENT ORGANISATIONS</span>
            <h2>Types of student groups</h2>
            <p>
              Student participation may take different forms, depending on
              the University's approved arrangements.
            </p>
          </div>

          <div className="organisations-grid">
            {organisationTypes.map((item) => (
              <article className="organisations-card" key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>

          <div className="organisations-heading organisations-process-heading">
            <span>REGISTRATION AND RECOGNITION</span>
            <h2>Establishing a student organisation</h2>
            <p>
              Students interested in establishing a new club or association
              should first obtain guidance from the appropriate University
              authority.
            </p>
          </div>

          <div className="organisations-steps">
            {registrationSteps.map((step) => (
              <article className="organisations-step" key={step.number}>
                <div className="organisations-step-number">
                  {step.number}
                </div>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </div>
              </article>
            ))}
          </div>

          <div className="organisations-leadership">
            <h2>Responsibilities of student leaders</h2>
            <p>
              Student leaders are expected to demonstrate integrity,
              responsibility and respect for the rights of others.
            </p>

            <ul>
              {leadershipResponsibilities.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="organisations-events">
            <h2>Meetings, events and activities</h2>
            <p>
              Organisations should consult the appropriate University office
              and obtain any required approval before organising meetings,
              public events, campaigns, fundraising activities or other
              programmes on campus.
            </p>
            <p>
              Activities should be conducted peacefully, safely and without
              disrupting lectures, examinations or other official University
              activities.
            </p>
          </div>

          <div className="organisations-support">
            <h2>Get involved responsibly</h2>
            <p>
              Take advantage of opportunities to contribute to campus life,
              develop leadership skills and build positive relationships with
              fellow students.
            </p>
            <div className="organisations-actions">
              <a href="/contact">Contact the University</a>
              <a href="/resources/code-of-conduct" className="organisations-support-outline">
                Student Code of Conduct
              </a>
            </div>
          </div>

          <div className="organisations-back">
            <a href="/resources">← Back to Student Resources</a>
          </div>
        </div>
      </section>
    </main>
  );
}
