import { useState } from "react";
import Navbar from "../components/Navbar";
import SchemeCard from "../components/SchemeCard";

export default function UploadPage() {
  const [form, setForm] = useState({
    age: "",
    income: "",
    occupation: "",
    state: "",
    gender: "",
  });
  const [schemes, setSchemes] = useState<any[]>([]);
  const [files, setFiles] = useState<FileList | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileUpload = async () => {
    if (!files || files.length === 0) {
      setError("Please select at least one document.");
      return;
    }

    setError("");
    setLoading(true);

    const formData = new FormData();
    Array.from(files).forEach((file) => {
      formData.append("documents", file);
    });

    try {
      const res = await fetch("http://localhost:5000/api/extract", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();
      console.log("Extracted fields:", result);

      if (result.age && result.income && result.occupation && result.state) {
        setForm({
          age: result.age,
          income: result.income,
          occupation: result.occupation,
          state: result.state,
          gender: result.gender || "",
        });
      } else {
        setError("Could not extract required fields from document.");
      }
    } catch (err) {
      console.error("Error extracting fields:", err);
      setError("Something went wrong while processing the document.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/schemes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const result = await res.json();
      console.log("Predicted schemes:", result);

      if (Array.isArray(result.schemes)) {
        setSchemes(result.schemes);
      } else {
        setSchemes([]);
        setError("No schemes matched your input.");
      }
    } catch (err) {
      console.error("Error fetching schemes:", err);
      setSchemes([]);
      setError("Something went wrong while fetching schemes.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-xl mx-auto p-6 bg-white shadow rounded mt-8">
        <h2 className="text-xl font-bold mb-4">Upload Your Documents</h2>

        <p className="text-gray-700 mb-2 font-semibold">Required documents:</p>
        <ul className="list-disc list-inside text-gray-600 mb-4">
          <li>Aadhaar Card (for age, gender, state)</li>
          <li>Income Certificate (for annual income)</li>
          <li>Occupation Proof (student ID, farmer certificate, etc.)</li>
          <li>Domicile Certificate (for state eligibility)</li>
          <li>Caste Certificate (optional)</li>
        </ul>

        <input
          type="file"
          multiple
          onChange={(e) => setFiles(e.target.files)}
          className="mb-4"
        />
        <button
          onClick={handleFileUpload}
          className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
        >
          📄 Extract Details
        </button>

        <form onSubmit={handleSubmit}>
          {["age", "income", "occupation", "state", "gender"].map((field) => (
            <input
              key={field}
              type="text"
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              value={(form as any)[field]}
              onChange={(e) => setForm({ ...form, [field]: e.target.value })}
              className="border border-black text-black p-2 m-2 w-full"
              required={field !== "gender"}
            />
          ))}
          <button
            type="submit"
            className="bg-red-500 text-white px-4 py-2 rounded mt-2 hover:scale-105 transition"
          >
            🔍 Find My Schemes
          </button>
        </form>

        {error && (
          <p className="text-center text-red-600 font-semibold mt-4">{error}</p>
        )}
        {loading && (
          <p className="text-center text-gray-600 mt-2">Processing...</p>
        )}
      </div>

      {schemes.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 p-4">
          {schemes.map((s: any) => (
            <SchemeCard key={s._id} {...s} />
          ))}
        </div>
      )}
    </div>
  );
}