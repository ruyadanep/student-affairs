
const safetyAreas = [
  {
    title: "Personal Safety",
    description:
      "Remain alert to your surroundings, avoid unnecessary risks and take reasonable precautions when moving around campus.",
  },
  {
    title: "Campus Security",
    description:
      "Observe University security instructions, cooperate with authorised security personnel and report suspicious activities.",
  },
  {
    title: "Hostel Safety",
    description:
      "Keep accommodation areas secure, protect personal belongings and report safety or maintenance concerns promptly.",
  },
  {
    title: "Road and Transport Safety",
    description:
      "Observe traffic rules, use designated pedestrian routes and exercise caution around vehicles and parking areas.",
  },
  {
    title: "Fire and Electrical Safety",
    description:
      "Avoid unsafe electrical connections, do not tamper with safety equipment and report fire hazards immediately.",
  },
  {
    title: "Digital Safety",
    description:
      "Protect your passwords, avoid suspicious links and safeguard personal information when using online University services.",
  },
];

const emergencySteps = [
  {
    number: "01",
    title: "Stay Calm and Assess the Situation",
    description:
      "Avoid panic. Identify the immediate danger and determine whether you need to move to a safer location.",
  },
  {
    number: "02",
    title: "Move Away from Danger",
    description:
      "Where it is safe to do so, leave the affected area and avoid actions that could expose you or others to further harm.",
  },
  {
    number: "03",
    title: "Seek Immediate Assistance",
    description:
      "Contact the appropriate University security personnel, emergency responders or relevant authorities.",
  },
  {
    number: "04",
    title: "Provide Clear Information",
    description:
      "Explain the nature of the emergency, the location and whether anyone requires urgent assistance.",
  },
  {
    number: "05",
    title: "Follow Official Instructions",
    description:
      "Cooperate with emergency responders and follow evacuation, assembly or other safety instructions.",
  },
  {
    number: "06",
    title: "Report and Document the Incident",
    description:
      "When it is safe and appropriate, report the incident through the recognised University reporting channel.",
  },
];

export default function SafetyGuidelinesPage() {
  return (
    <main className="safety-page">
      <section className="safety-hero">
        <div className="safety-container">
          <span className="safety-eyebrow">STUDENT RESOURCES</span>
          <h1>Student Safety, Security and Emergency Guidelines</h1>
          <p>
            Your safety matters. Learn practical ways to protect yourself,
            support others and respond responsibly to safety concerns and
            emergencies within the University community.
          </p>

          <div className="safety-actions">
            <a href="/contact">Contact the University</a>
            <a href="/resources" className="safety-outline">
              All Student Resources
            </a>
          </div>
        </div>
      </section>

      <section className="safety-content">
        <div className="safety-container">
          <div className="safety-intro">
            <span>A SAFE CAMPUS COMMUNITY</span>
            <h2>Safety is everyone's responsibility</h2>
            <p>
              A safe learning environment depends on awareness, cooperation
              and responsible behaviour. Students should observe University
              instructions, respect others and report hazards or incidents
              through appropriate channels.
            </p>
          </div>

          <div className="safety-notice">
            <div className="safety-notice-icon">!</div>
            <div>
              <h3>Important emergency notice</h3>
              <p>
                This page provides general safety guidance and does not
                replace official University emergency procedures. In an
                immediate emergency, contact appropriate emergency responders
                or University security personnel without delay. Do not wait
                for a response through ordinary website feedback channels.
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

          <div className="safety-heading">
            <span>EVERYDAY SAFETY</span>
            <h2>Important areas of personal safety</h2>
          </div>

          <div className="safety-grid">
            {safetyAreas.map((item) => (
              <article className="safety-card" key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>

          <div className="safety-heading safety-process-heading">
            <span>EMERGENCY RESPONSE</span>
            <h2>What to do during an emergency</h2>
            <p>
              Follow these general steps while prioritising your safety and
              the safety of people around you.
            </p>
          </div>

          <div className="safety-steps">
            {emergencySteps.map((step) => (
              <article className="safety-step" key={step.number}>
                <div className="safety-step-number">{step.number}</div>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </div>
              </article>
            ))}
          </div>

          <div className="safety-prevention">
            <h2>How to help maintain a safe campus</h2>
            <ul>
              <li>Follow University security instructions and notices.</li>
              <li>Keep your student identification information secure.</li>
              <li>Report suspicious activities and dangerous conditions.</li>
              <li>Avoid violence, threats, intimidation and unsafe conduct.</li>
              <li>Respect fire safety and evacuation instructions.</li>
              <li>Look out for fellow students without putting yourself at risk.</li>
              <li>Protect your personal information and online accounts.</li>
              <li>Use recognised channels to report security concerns.</li>
            </ul>
          </div>

          <div className="safety-reporting">
            <h2>Reporting safety and security concerns</h2>
            <p>
              Students should report security incidents, threats, hazards,
              harassment or other safety concerns to the appropriate
              University authority. Provide accurate information about the
              location, nature and circumstances of the incident.
            </p>
            <p>
              Where someone is in immediate danger, seek urgent assistance
              from appropriate emergency responders. Do not attempt to
              confront dangerous individuals yourself.
            </p>
          </div>

          <div className="safety-support">
            <h2>Help us maintain a safe University</h2>
            <p>
              Responsible reporting and cooperation help protect students,
              staff, visitors and University property.
            </p>
            <div className="safety-actions">
              <a href="/contact">Contact Us</a>
              <a
                href="/resources/complaints-guidelines"
                className="safety-support-outline"
              >
                Complaints and Reporting Guidelines
              </a>
            </div>
          </div>

          <div className="safety-back">
            <a href="/resources">← Back to Student Resources</a>
          </div>
        </div>
      </section>
    </main>
  );
}
