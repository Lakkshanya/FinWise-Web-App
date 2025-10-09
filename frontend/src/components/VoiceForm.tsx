import { useState } from "react";

export default function VoiceForm() {
  const [input, setInput] = useState("");

  const handleVoiceInput = () => {
    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.lang = "en-IN";
    recognition.onresult = (event: any) => {
      setInput(event.results[0][0].transcript);
    };
    recognition.start();
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow rounded mt-8">
      <h2 className="text-xl font-bold mb-4">Speak to Fill Your Details</h2>
      <button
        onClick={handleVoiceInput}
        className="bg-red-500 text-white px-4 py-2 rounded mb-4"
      >
        🎤 Click to Enable Voice Input
      </button>
      <p className="text-sm text-gray-600 mb-4">
        Try saying: "I am 25 years old, my income is 4 lakhs, I work as an engineer in Karnataka"
      </p>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="w-full border p-2 rounded"
        rows={4}
      />
      <button className="bg-blue-500 text-white px-4 py-2 rounded mt-4">
        Find My Schemes
      </button>
    </div>
  );
}