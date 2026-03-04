import { Participant } from "./schema";

export const participantData: Participant[] = Array.from({ length: 150 }, (_, i) => ({
  id: `P-${1000 + i}`,
  name: `Participant ${i + 1}`,
  email: `participant${i + 1}@example.com`,
  eventName: i % 2 === 0 ? "Tech Conference 2025" : "Design Summit 2025",
  status: i % 3 === 0 ? "processing" : "paid",
}));
