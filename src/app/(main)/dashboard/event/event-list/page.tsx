import { TableEventList } from "./_components/event-table";


export default function Page() {
    return (
        <div className="flex flex-col gap-4 md:gap-6">
            <TableEventList />
        </div>
    );
}
