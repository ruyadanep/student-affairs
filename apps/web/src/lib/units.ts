// The six units of the Student Affairs directorate. This is the single list the site uses.
// The short descriptions are plain summaries of what each unit's name implies. Ask the Dean's office to confirm or reword them.
export type Unit = { slug: string; name: string; summary: string; services: string[]; link?: [string, string] };

export const units: Unit[] = [
  { slug: "accommodation", name: "Accommodation Unit", summary: "Looks after student hostels: allocation, check-in and check-out, room changes and maintenance.",
    services: ["Hostel applications and allocation", "Room changes", "Hostel maintenance"], link: ["Apply for a hostel", "/hostels"] },
  { slug: "guidance-and-counselling", name: "Guidance and Counselling Unit", summary: "Supports student wellbeing through counselling, guidance and welfare support.",
    services: ["Counselling requests", "Welfare and hardship support", "Special-needs and accessibility support"], link: ["Ask for support", "/support"] },
  { slug: "identity-card", name: "Identity Card Unit", summary: "Handles student identity cards.",
    services: ["Student ID card issue and replacement"] },
  { slug: "nysc", name: "NYSC Unit", summary: "Supports graduating students with National Youth Service Corps matters.",
    services: ["NYSC guidance for final-year students"] },
  { slug: "record", name: "Record Unit", summary: "Keeps student records for the directorate.",
    services: ["Student records"], link: ["Request a letter", "/letters"] },
  { slug: "sports", name: "Sports Unit", summary: "Organises sports and recreation for students.",
    services: ["Sports and recreation", "Teams and competitions"] },
];

/** Clearance order: the order the units clear a student. Matches migration 0021. */
export const clearanceOrder = ["Accommodation Unit", "Identity Card Unit", "Sports Unit", "Guidance and Counselling Unit", "NYSC Unit", "Record Unit"];

export const unitByName = (name: string | null | undefined) => units.find((u) => u.name.toLowerCase() === (name ?? "").trim().toLowerCase());
