import { office } from "@/lib/site";
import Form from "./Form";
export const metadata = { title: "Contact" };
export default function Contact() {
  return (<main><h1>Contact Student Affairs</h1>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(18rem,1fr))", gap: "2rem" }}>
      <div><Form /></div>
      <div className="card" style={{ alignSelf: "start" }}><h2 style={{ marginTop: 0 }}>Office</h2>
        <p>{office.address}</p>{office.email && <p>Email: <a href={`mailto:${office.email}`}>{office.email}</a></p>}{office.phone && <p>Phone: {office.phone}</p>}{office.hours && <p>Hours: {office.hours}</p>}</div></div></main>);
}
