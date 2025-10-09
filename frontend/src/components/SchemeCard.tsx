type Props = {
  name: string;
  benefits?: string;
  documents?: string[];
  apply_link?: string;
};

export default function SchemeCard({ name, benefits, documents, apply_link }: Props) {
  return (
    <div className="border rounded p-4 m-2 shadow bg-white hover:shadow-lg transition">
      <h2 className="font-bold text-lg text-orange-600">{name}</h2>
      <p className="text-gray-700">{benefits}</p>
      {documents && (
        <p className="text-sm text-gray-500 mt-2">
          <strong>Documents:</strong> {documents.join(", ")}
        </p>
      )}
      {apply_link && (
        <a
          href={apply_link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 underline mt-2 inline-block"
        >
          Apply
        </a>
      )}
    </div>
  );
}