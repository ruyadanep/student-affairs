const faqs: [string, string][] = [
  ["How do I create an account?", "Go to Create your account and enter your matric number, the email address you want to use, and a password. Your matric number must be on the University's student list. If it isn't found, contact the Student Affairs office."],
  ["How do I pay for a hostel?", "Hostel payments are made on the main University website (plasu.edu.ng), not on this site. After paying, open Hostels here, choose your hostels, and enter the reference from your payment receipt. The hostel office confirms the payment before allocation."],
  ["Why was I placed on a waiting list or in my second choice?", "Rooms are allocated by the hostel office after your payment is confirmed. A hostel must match your gender and have a free bed. If your first choice is full, your second choice is tried. If neither has space, you are placed on the waiting list and notified when that changes."],
  ["How does clearance work?", "Start clearance on the Clearance page. Each unit approves you in order. If a unit returns your clearance, you will see the reason, which you need to resolve with that unit. When every unit has approved, you can download your clearance certificate."],
  ["How do I request a letter?", "Open Letters, choose the type, and say what it is for. The Dean's office reviews the request. When it is approved you can download a PDF with a QR code."],
  ["How can someone check that my letter or certificate is real?", "They scan the QR code on the document, or enter its reference code on the Verify a document page. The page confirms who it was issued to and when, and whether it is still valid."],
  ["How do I register a club or society?", "Open Student organisations, choose Register a new organisation, and fill in the form. The Student Affairs office reviews it and you will be notified of the decision."],
  ["How do I report a fault in my hostel room?", "Open Maintenance and describe the problem. Your hostel and room are added automatically if you have been allocated one. You can follow progress and message the hostel office on the same page."],
  ["Who can see my information?", "Only the staff who need it for your request, and only for that purpose. Read the Privacy notice for details."],
];
export const metadata = { title: "Frequently asked questions" };
export default function Faq() {
  return (<main style={{ maxWidth: "46rem" }}><h1>Frequently asked questions</h1>
    {faqs.map(([q, a]) => (<details key={q}><summary>{q}</summary><p style={{ margin: ".6rem 0 0" }}>{a}</p></details>))}
    <p style={{ marginTop: "1.5rem" }}>Still stuck? <a href="/contact">Contact the office</a>.</p></main>);
}
