
const academicActivities = [
  {
    number: "01",
    title: "Course Registration",
    description:
      "Students should complete their course registration within the period announced by the University.",
  },
  {
    number: "02",
    title: "Commencement of Lectures",
    description:
      "Lectures and other academic activities begin according to the approved semester schedule.",
  },
  {
    number: "03",
    title: "Course Adjustment",
    description:
      "Where permitted, students should make necessary course registration corrections within the official adjustment period.",
  },
  {
    number: "04",
    title: "Continuous Assessment",
    description:
      "Students should participate in tests, assignments, practicals and other continuous assessment activities.",
  },
  {
    number: "05",
    title: "Semester Examinations",
    description:
      "End-of-semester examinations take place according to the timetable released by the University.",
  },
  {
    number: "06",
    title: "Semester Break and Resumption",
    description:
      "Students should observe the approved semester break and return on the announced resumption date.",
  },
];

export default function AcademicCalendarPage() {
  return (
    <main className="academic-calendar-page">
      <section className="academic-calendar-hero">
        <div className="academic-calendar-container">
          <span className="academic-calendar-eyebrow">
            STUDENT RESOURCES
          </span>

          <h1>Academic Calendar</h1>

          <p>
            Stay informed about important academic activities, registration
            periods, lectures, examinations and semester schedules at Plateau
            State University.
          </p>

          <div className="academic-calendar-actions">
            <a href="https://plasu.edu.ng/" target="_blank" rel="noreferrer">
              Visit University Website
            </a>
            <a href="/resources" className="academic-calendar-secondary">
              Explore Resources
            </a>
          </div>
        </div>
      </section>

      <section className="academic-calendar-content">
        <div className="academic-calendar-container">
          <div className="academic-calendar-intro">
            <span>IMPORTANT INFORMATION</span>
            <h2>Plan your academic activities</h2>
            <p>
              The University academic calendar provides the official schedule
              for academic activities throughout the session. Students are
              encouraged to check official University announcements regularly
              for approved dates and any changes.
            </p>
          </div>

          <div className="academic-calendar-notice">
            <div className="academic-calendar-notice-icon">!</div>
            <div>
              <h3>Official calendar and dates</h3>
              <p>
                The approved academic calendar and confirmed dates will be
                published here when made available by the University. The
                activities below are general academic milestones, not confirmed
                dates for a particular session.
              </p>
              <a href="https://plasu.edu.ng/" target="_blank" rel="noreferrer">
                Check official University announcements →
              </a>
            </div>
          </div>

          <div className="academic-calendar-section-heading">
            <span>ACADEMIC ACTIVITIES</span>
            <h2>Key activities in an academic session</h2>
          </div>

          <div className="academic-calendar-grid">
            {academicActivities.map((activity) => (
              <article className="academic-calendar-card" key={activity.number}>
                <span className="academic-calendar-number">
                  {activity.number}
                </span>
                <h3>{activity.title}</h3>
                <p>{activity.description}</p>
              </article>
            ))}
          </div>

          <div className="academic-calendar-reminder">
            <h2>Stay up to date</h2>
            <p>
              Students should regularly check official University communication
              channels, departmental notices and announcements for changes to
              academic schedules.
            </p>
            <a href="https://plasu.edu.ng/" target="_blank" rel="noreferrer">
              Visit PLASU Website →
            </a>
          </div>

          <div className="academic-calendar-back">
            <a href="/resources">← Back to Student Resources</a>
          </div>
        </div>
      </section>
    </main>
  );
}
