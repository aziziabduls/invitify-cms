import packageJson from "../../package.json";

const currentYear = new Date().getFullYear();

export const APP_CONFIG = {
  name: "Invitify Studio Admin",
  version: packageJson.version,
  copyright: `© ${currentYear}, Invitify Studio Admin.`,
  meta: {
    // Event as a service (Event organizer, planner and wedding invitation)
    title: "Invitify Studio Admin - Event as a service (Event organizer, planner and wedding invitation)",
    description:
      "Invitify Studio Admin is a dashboard for Event as a service (Event organizer, planner and wedding invitation)",
  },
  apiUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000",
};
