import { useState } from "react";
import Navbar from "../components/Navbar";
import SchemeCard from "../components/SchemeCard";

export default function VoiceForm() {
  const [form, setForm] = useState({
    age: "",
    income: "",
    occupation: "",
    state: "",
    gender: "",
  });
  const [schemes, setSchemes] = useState<any[]>([]);
  const [rawInput, setRawInput] = useState("");
  const [error, setError] = useState("");

  const handleVoiceInput = () => {
    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.lang = "en-IN";
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript.toLowerCase();
      setRawInput(transcript);

      const ageMatch = transcript.match(/(?:i am|my age is)?\s*(\d{2})\s*(?:years|year)?/);
      const incomeMatch = transcript.match(/income\s*(is)?\s*(\d+)(?:\s*lakhs)?/);
      const occupationMatch = transcript.match(/(?:work as|i am a|occupation is)\s*(\w+)/);
      const stateMatch = transcript.match(
        /(andhra pradesh|arunachal pradesh|assam|bihar|chhattisgarh|goa|gujarat|haryana|himachal pradesh|jharkhand|karnataka|kerala|madhya pradesh|maharashtra|manipur|meghalaya|mizoram|nagaland|odisha|punjab|rajasthan|sikkim|tamil nadu|telangana|tripura|uttar pradesh|uttarakhand|west bengal|delhi|jammu and kashmir|ladakh|puducherry)/i
      );
      const genderMatch = transcript.match(/(?:i am|gender is)?\s*(male|female|other)/);

      setForm({
        age: ageMatch?.[1] || "",
        income: incomeMatch?.[2] ? String(Number(incomeMatch[2]) * 100000) : "",
        occupation: occupationMatch?.[1] || "",
        state: stateMatch?.[1] || "",
        gender: genderMatch?.[1] || "",
      });
    };
    recognition.start();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

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
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-xl mx-auto p-6 bg-white shadow rounded mt-8">
        <h2 className="text-xl font-bold mb-4">Speak to Fill Your Details</h2>
        <button
          onClick={handleVoiceInput}
          className="bg-red-500 text-white px-4 py-2 rounded mb-4"
        >
          🎤 Click to Enable Voice Input
        </button>
        <p className="text-sm text-gray-600 mb-4">
          Try saying: "I am 25 years old, my income is 4 lakhs, I work as a student in Tamil Nadu, I am female"
        </p>
        <textarea
          value={rawInput}
          onChange={(e) => setRawInput(e.target.value)}
          className="w-full border border-black text-black p-2 rounded mb-4"
          rows={3}
        />

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
            className="bg-blue-500 text-white px-4 py-2 rounded mt-2 hover:scale-105 transition"
          >
            Find My Schemes
          </button>
        </form>

        {error && (
          <p className="text-center text-red-600 font-semibold mt-4">{error}</p>
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