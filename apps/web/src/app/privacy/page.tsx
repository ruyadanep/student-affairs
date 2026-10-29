import { office } from "@/lib/site";
export const metadata = { title: "Privacy notice" };
export default function Privacy() {
  return (<main style={{ maxWidth: "46rem" }}><h1>Privacy notice</h1>
    <p>This notice explains how the Division of Student Affairs at Plateau State University, Bokkos, handles your personal information on this website, in line with the Nigeria Data Protection Act 2023.</p>
    <h2>What we collect</h2>
    <ul style={{ paddingLeft: "1.1rem" }}>
      <li>Details from the University's student records: name, matric number, faculty, department, level, gender, and email.</li>
      <li>What you submit: hostel applications and payment references, clearance progress, letter requests, organisation registrations, maintenance reports, messages to the office, and notices sent to you.</li>
    </ul>
    <h2>Why we use it</h2>
    <p>We use your information only to provide Student Affairs services, such as allocating rooms, clearing you for graduation, issuing letters, and contacting you about your requests.</p>
    <h2>Who can see it</h2>
    <p>Access is limited by role. Staff see only what they need to handle a request, such as hostel officers for accommodation or unit officers for clearance. Sensitive records are restricted further, and staff actions on important decisions are logged. Payments are made on the main University website, and this site never collects your card or bank details.</p>
    <h2>Documents and verification</h2>
    <p>When someone checks a letter or certificate with its QR code, they see only your name, the type of document, the date it was issued, and whether it is valid.</p>
    <h2>How long we keep it</h2>
    <p>We keep records for as long as they are needed for the purposes above and as the University's records policy requires.</p>
    <h2>Your rights</h2>
    <p>You can ask to see the information we hold about you, ask us to correct it, or object to how it is used. You can also complain to the Nigeria Data Protection Commission.</p>
    <h2>Contact</h2>
    <p>{office.dpoEmail ? <>Email the Data Protection Officer at <a href={`mailto:${office.dpoEmail}`}>{office.dpoEmail}</a>, or </> : null}<a href="/contact">send a message to the Student Affairs office</a>.</p></main>);
}
