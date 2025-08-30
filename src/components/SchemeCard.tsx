type Props = {
    name: string;
    benefits?: string;
    documents?: string[];
    apply_link?: string;
};

export default function SchemeCard({ name, benefits, documents, apply_link }: Props) {
    return (
        <div className="border rounded p-4 m-2 shadow bg-white">
            <h2 className="font-bold text-lg">{name}</h2>
            <p>{benefits}</p>
            {documents && <p>Documents: {documents.join(", ")}</p>}
            {apply_link && <a href={apply_link} target="_blank" className="text-blue-500">Apply</a>}
        </div>
    );
}
