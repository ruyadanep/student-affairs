
import Link from "next/link";

const sections = [
  {
    number: "01",
    title: "Accessing Student Medical Services",
    description:
      "Students should familiarise themselves with the University's approved medical and health service arrangements.",
    points: [
      "Identify the University's designated medical facility or approved healthcare provider.",
      "Confirm the procedures for accessing medical attention.",
      "Keep relevant medical and emergency information available.",
      "Seek qualified medical advice when experiencing health concerns.",
    ],
  },
  {
    number: "02",
    title: "Personal Hygiene and Disease Prevention",
    description:
      "Good personal hygiene and healthy daily habits help protect individuals and the wider campus community.",
    points: [
      "Wash your hands regularly with soap and clean water.",
      "Maintain personal and environmental cleanliness.",
      "Use clean drinking water and practise safe food handling.",
      "Avoid sharing personal hygiene items.",
      "Seek medical advice when experiencing symptoms of illness.",
    ],
  },
  {
    number: "03",
    title: "Mental Health and Emotional Wellbeing",
    description:
      "University life can involve academic, social and personal pressures. Students are encouraged to seek appropriate support when needed.",
    points: [
      "Maintain a healthy balance between study, rest and recreation.",
      "Build positive relationships and supportive friendships.",
      "Speak with a qualified professional when experiencing emotional difficulties.",
      "Seek assistance early rather than ignoring persistent distress.",
      "Respect the privacy and wellbeing of other students.",
    ],
  },
  {
    number: "04",
    title: "Nutrition, Fitness and Healthy Living",
    description:
      "Healthy lifestyle choices contribute to students' physical wellbeing and academic participation.",
    points: [
      "Eat balanced and nutritious meals.",
      "Drink sufficient safe water.",
      "Engage in appropriate physical activity.",
      "Get adequate sleep and rest.",
      "Avoid harmful substance use and unsafe health practices.",
    ],
  },
  {
    number: "05",
    title: "Medical Emergencies",
    description:
      "Medical emergencies require prompt attention. Students should know how to seek immediate assistance.",
    points: [
      "Contact emergency responders or the designated medical service immediately.",
      "Provide the person's location and a clear description of the emergency.",
      "Do not delay seeking professional medical attention.",
      "Avoid giving medication or treatment beyond your training.",
      "Follow instructions from qualified healthcare professionals.",
    ],
  },
  {
    number: "06",
    title: "Communicable Diseases and Campus Health",
    description:
      "Students should take appropriate precautions to reduce the spread of communicable diseases.",
    points: [
      "Follow current public health guidance.",
      "Seek medical assessment when experiencing concerning symptoms.",
      "Observe recommended hygiene and infection-prevention measures.",
      "Avoid spreading unverified health information.",
      "Cooperate with authorised public health instructions.",
    ],
  },
  {
    number: "07",
    title: "Health Awareness and Preventive Care",
    description:
      "Preventive health practices help students make informed decisions about their wellbeing.",
    points: [
      "Participate in approved health awareness programmes.",
      "Seek reliable information from qualified health professionals.",
      "Follow appropriate vaccination and preventive care advice.",
      "Attend medical appointments when recommended.",
      "Avoid self-diagnosis and unsafe medication practices.",
    ],
  },
  {
    number: "08",
    title: "Accessing Health and Welfare Support",
    description:
      "Students who need help with health-related or personal welfare concerns should contact the appropriate University support office.",
    points: [
      "Contact the designated medical service for healthcare concerns.",
      "Use Student Affairs support channels for appropriate welfare guidance.",
      "Seek counselling where professional emotional support is needed.",
      "Report unsafe campus conditions through approved channels.",
      "Confirm the applicable support arrangements and procedures.",
    ],
  },
];

export default function HealthWellnessGuidelinesPage() {
  return (
    <main className="health-wellness-page">
      <section className="health-wellness-hero">
        <div className="health-wellness-container">
          <div className="health-wellness-breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <Link href="/resources">Resources</Link>
            <span>/</span>
            <span>Health and Wellness</span>
          </div>

          <span className="health-wellness-label">
            STUDENT HEALTH INFORMATION
          </span>

          <h1>Student Health, Medical Services and Wellness Guidelines</h1>

          <p>
            Guidance to help students maintain good health, access appropriate
            medical care, promote emotional wellbeing and respond responsibly
            to health emergencies.
          </p>

          <div className="health-wellness-actions">
            <a href="#guidelines" className="health-wellness-primary">
              Explore Guidelines
            </a>
            <Link href="/support" className="health-wellness-secondary">
              Student Support
            </Link>
          </div>
        </div>
      </section>

      <section className="health-wellness-content" id="guidelines">
        <div className="health-wellness-container">
          <div className="health-wellness-intro">
            <div>
              <span className="health-wellness-eyebrow">
                HEALTHY STUDENTS, STRONGER CAMPUS
              </span>
              <h2>Your Health and Wellbeing Matter</h2>
            </div>
            <p>
              Student wellbeing is an important part of a positive University
              experience. Students are encouraged to take preventive measures,
              seek qualified medical assistance and use available support
              services responsibly.
            </p>
          </div>

          <div className="health-wellness-notice">
            <strong>Important Notice:</strong> This page provides general
            health and wellness information. It is not a substitute for
            professional medical advice, diagnosis or treatment. Students
            should contact qualified healthcare professionals for individual
            medical concerns. Official University medical arrangements and
            emergency contacts should be confirmed through the University.
          </div>

          <div className="health-wellness-grid">
            {sections.map((section) => (
              <article className="health-wellness-card" key={section.number}>
                <span className="health-wellness-number">
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

          <div className="health-wellness-emergency">
            <div className="health-wellness-emergency-icon">!</div>
            <div>
              <span>URGENT HEALTH CONCERNS</span>
              <h2>Do Not Delay Emergency Medical Attention</h2>
              <p>
                If you or another person is experiencing a serious medical
                emergency, contact emergency responders or the designated
                medical service immediately. Do not wait for a response through
                routine website enquiries or feedback forms.
              </p>
            </div>
          </div>

          <div className="health-wellness-checklist">
            <span className="health-wellness-eyebrow">
              EVERYDAY WELLNESS
            </span>
            <h2>Healthy Habits for Every Student</h2>
            <div className="health-wellness-checks">
              <div>✓ Eat balanced and nutritious meals.</div>
              <div>✓ Maintain good personal hygiene.</div>
              <div>✓ Exercise and stay physically active.</div>
              <div>✓ Get enough sleep and rest.</div>
              <div>✓ Seek medical attention when necessary.</div>
              <div>✓ Take care of your emotional wellbeing.</div>
            </div>
          </div>

          <div className="health-wellness-related">
            <h2>Related Student Resources</h2>
            <div className="health-wellness-links">
              <Link href="/resources/welfare-guidelines">
                Student Welfare and Support <span>→</span>
              </Link>
              <Link href="/resources/safety-guidelines">
                Student Safety and Security <span>→</span>
              </Link>
              <Link href="/resources/complaints-guidelines">
                Complaints and Feedback <span>→</span>
              </Link>
              <Link href="/resources/hostel-regulations">
                Hostel Rules and Regulations <span>→</span>
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
