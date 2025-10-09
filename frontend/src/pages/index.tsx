import Navbar from "../components/Navbar";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="text-center py-12 px-4">
        <h1 className="text-4xl font-bold text-orange-600 mb-2">FinWise</h1>
        <p className="text-lg text-gray-700 mb-4">AI Powered Financial Scheme Advisor</p>
        <p className="text-md text-gray-600 mb-8">Discover Government Schemes You Qualify For</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-4">
          {[
            { title: "AI-Powered Matching", desc: "Advanced algorithm matches you with schemes." },
            { title: "Multilingual Support", desc: "Assistance in multiple languages." },
            { title: "Secure & Private", desc: "Your data is encrypted and safe." },
            { title: "Real-time Updates", desc: "Stay updated with latest schemes." },
          ].map((f, i) => (
            <div key={i} className="bg-white p-4 rounded shadow hover:scale-105 transition">
              <h3 className="font-semibold text-orange-500">{f.title}</h3>
              <p className="text-sm text-gray-600">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}