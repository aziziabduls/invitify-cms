import { TableEventList } from "./_components/event-table";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Event List | Invitify",
    description: "View event details.",
};

export default function Page() {
    return (
        <div className="flex flex-col gap-4 md:gap-6">
            <TableEventList />
        </div>
    );
}
