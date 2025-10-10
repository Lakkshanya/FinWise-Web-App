import { useState } from "react";
import { useRouter } from "next/router";
import SchemeCard from "../components/SchemeCard";

export default function UploadPage() {
  const router = useRouter();

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
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-900 relative overflow-hidden">
      {/* Soft glowing background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-gradient-to-r from-orange-600 to-amber-500 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-amber-400 to-orange-700 rounded-full blur-[120px] animate-bounce"></div>
        <div className="absolute top-1/2 left-1/2 w-[28rem] h-[28rem] bg-gradient-to-r from-orange-800 to-amber-900 rounded-full blur-[120px] animate-pulse delay-1000"></div>
      </div>

      {/* Navbar */}
      <div className="relative z-10">
        <div className="w-full bg-gradient-to-r from-orange-700 to-amber-600 px-4 py-3 flex items-center justify-between sticky top-0 z-20 shadow-lg shadow-orange-900/30">
          <div className="text-white font-bold text-3xl tracking-tight">FinWise</div>
          <div className="flex items-center gap-4">
            <button
              className="px-6 py-2.5 bg-white text-orange-700 font-semibold rounded-xl shadow-md hover:bg-orange-50 hover:scale-105 transition-all duration-300 border-2 border-orange-300 hover:border-orange-500"
              onClick={() => router.push("/voice")}
            >
              Speak Your Query
            </button>
            <button
              className="px-6 py-2.5 bg-white text-orange-700 font-semibold rounded-xl shadow-md hover:bg-orange-50 hover:scale-105 transition-all duration-300 border-2 border-orange-300 hover:border-orange-500"
              onClick={() => router.push("/upload")}
            >
              Upload Documents
            </button>
            <button
              className="px-6 py-2.5 bg-white text-orange-700 font-semibold rounded-xl shadow-md hover:bg-orange-50 hover:scale-105 transition-all duration-300 border-2 border-orange-300 hover:border-orange-500"
              onClick={() => router.push("/form")}
            >
              Proceed to Form
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 max-w-4xl mx-auto p-6 mt-10">
          <div className="bg-zinc-900/60 backdrop-blur-md border border-amber-500/20 rounded-2xl p-8 shadow-2xl shadow-orange-900/20">
            {/* Heading */}
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-amber-300 bg-clip-text text-transparent mb-4 drop-shadow-lg">
                Upload Your Documents
              </h2>
              <p className="text-gray-300 text-lg font-light">
                Extract your details automatically from documents
              </p>
            </div>

            {/* Document Instructions */}
            <div className="mb-8 p-6 bg-black/40 rounded-xl border border-amber-500/20">
              <p className="text-gray-300 mb-4 font-semibold text-lg flex items-center gap-2">
                📋 Required documents:
              </p>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-gray-400">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  Aadhaar Card (for age, gender, state)
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  Income Certificate
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  Occupation Proof
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  Domicile Certificate
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  Caste Certificate (optional)
                </li>
              </ul>
            </div>

            {/* File Upload */}
            <div className="mb-8 p-6 bg-black/40 rounded-xl border border-amber-500/20">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex-1">
                  <input
                    type="file"
                    multiple
                    onChange={(e) => setFiles(e.target.files)}
                    className="w-full text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-500 file:text-white hover:file:bg-orange-600"
                  />
                </div>
                <button
                  onClick={handleFileUpload}
                  disabled={loading}
                  className="px-8 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold rounded-xl shadow-lg hover:scale-105 transition-all duration-300 border-2 border-orange-400/50 hover:border-orange-300 flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Processing...
                    </>
                  ) : (
                    <>📄 Extract Details</>
                  )}
                </button>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {["age", "income", "occupation", "state", "gender"].map((field) => (
                  <div key={field}>
                    <input
                      type="text"
                      placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                      value={(form as any)[field]}
                      onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                      className="w-full bg-black/40 border-2 border-amber-500/30 text-white p-4 rounded-xl focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 transition-all duration-300 placeholder-gray-400 backdrop-blur-sm"
                      required={field !== "gender"}
                    />
                  </div>
                ))}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold rounded-xl shadow-lg hover:scale-105 transition-all duration-300 border-2 border-red-400/50 hover:border-red-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Finding Your Schemes...
                  </>
                ) : (
                  "Find My Schemes"
                )}
              </button>
            </form>

            {/* Error */}
            {error && (
              <div className="mt-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl">
                <p className="text-center text-red-300 font-semibold">{error}</p>
              </div>
            )}
          </div>

          {/* Schemes */}
          {schemes.length > 0 && (
            <div className="mt-12">
              <h3 className="text-3xl font-bold text-center bg-gradient-to-r from-orange-400 to-amber-300 bg-clip-text text-transparent mb-8">
                Recommended Schemes For You
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {schemes.map((s: any) => (
                  <SchemeCard key={s._id} {...s} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
