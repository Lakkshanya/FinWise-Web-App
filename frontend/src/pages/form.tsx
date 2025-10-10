import { useState } from "react";
import { useRouter } from "next/router";
import SchemeCard from "../components/SchemeCard";

export default function FormPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    age: "",
    income: "",
    occupation: "",
    state: "",
    gender: "",
  });

  const [schemes, setSchemes] = useState<any[]>([]);
  const [error, setError] = useState("");

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
    <div
      className="min-h-screen relative overflow-hidden 
                 bg-gradient-to-b from-gray-950 via-black to-gray-900" // 🌌 deep gradient black
    >
      {/* Soft animated lights */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-gradient-to-r from-orange-600 to-amber-400 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-amber-500 to-red-600 rounded-full blur-[130px] animate-bounce"></div>
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
        <div className="relative z-10 max-w-4xl mx-auto p-6 mt-8">
          {/* Form Container with glassy transparent look */}
          <div
            className="bg-zinc-900/60 backdrop-blur-md border border-amber-500/20 
                       rounded-2xl p-8 shadow-2xl shadow-black/40"
          >
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-amber-300 bg-clip-text text-transparent mb-4 drop-shadow-lg">
                Fill Your Details
              </h2>
              <p className="text-gray-300 text-lg font-light">Find personalized schemes instantly</p>
            </div>

            {/* Form Section */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input
                  type="number"
                  placeholder="Age"
                  value={form.age}
                  onChange={(e) => setForm({ ...form, age: e.target.value })}
                  className="w-full bg-black/40 border border-amber-500/30 text-white p-4 rounded-xl focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 transition-all duration-300 placeholder-gray-400"
                  min={18}
                  max={100}
                  required
                />
                <input
                  type="number"
                  placeholder="Annual Income"
                  value={form.income}
                  onChange={(e) => setForm({ ...form, income: e.target.value })}
                  className="w-full bg-black/40 border border-amber-500/30 text-white p-4 rounded-xl focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 transition-all duration-300 placeholder-gray-400"
                  required
                />

                {/* Occupation dropdown */}
                <select
                  value={form.occupation}
                  onChange={(e) => setForm({ ...form, occupation: e.target.value })}
                  className="w-full bg-black/40 border border-amber-500/30 text-white p-4 rounded-xl focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 transition-all duration-300"
                  required
                >
                  <option value="">Select Occupation</option>
                  <option value="Engineer">Engineer</option>
                  <option value="Farmer">Farmer</option>
                  <option value="Student">Student</option>
                  <option value="Self-Employed">Self-Employed</option>
                  <option value="Unemployed">Unemployed</option>
                  <option value="Teacher">Teacher</option>
                  <option value="Doctor">Doctor</option>
                  <option value="Nurse">Nurse</option>
                  <option value="Artisan">Artisan</option>
                  <option value="Shopkeeper">Shopkeeper</option>
                  <option value="Government Employee">Government Employee</option>
                  <option value="Private Employee">Private Employee</option>
                  <option value="Retired">Retired</option>
                  <option value="Housewife">Housewife</option>
                  <option value="Youth">Youth</option>
                  <option value="MSME Owner">MSME Owner</option>
                  <option value="Laborer">Laborer</option>
                  <option value="Disabled">Disabled</option>
                </select>

                {/* State dropdown */}
                <select
                  value={form.state}
                  onChange={(e) => setForm({ ...form, state: e.target.value })}
                  className="w-full bg-black/40 border border-amber-500/30 text-white p-4 rounded-xl focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 transition-all duration-300"
                  required
                >
                 <option value="">Select State / UT</option>
                  <option value="Andhra Pradesh">Andhra Pradesh</option>
                  <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                  <option value="Assam">Assam</option>
                  <option value="Bihar">Bihar</option>
                  <option value="Chhattisgarh">Chhattisgarh</option>
                  <option value="Goa">Goa</option>
                  <option value="Gujarat">Gujarat</option>
                  <option value="Haryana">Haryana</option>
                  <option value="Himachal Pradesh">Himachal Pradesh</option>
                  <option value="Jharkhand">Jharkhand</option>
                  <option value="Karnataka">Karnataka</option>
                  <option value="Kerala">Kerala</option>
                  <option value="Madhya Pradesh">Madhya Pradesh</option>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Manipur">Manipur</option>
                  <option value="Meghalaya">Meghalaya</option>
                  <option value="Mizoram">Mizoram</option>
                  <option value="Nagaland">Nagaland</option>
                  <option value="Odisha">Odisha</option>
                  <option value="Punjab">Punjab</option>
                  <option value="Rajasthan">Rajasthan</option>
                  <option value="Sikkim">Sikkim</option>
                  <option value="Tamil Nadu">Tamil Nadu</option>
                  <option value="Telangana">Telangana</option>
                  <option value="Tripura">Tripura</option>
                  <option value="Uttar Pradesh">Uttar Pradesh</option>
                  <option value="Uttarakhand">Uttarakhand</option>
                  <option value="West Bengal">West Bengal</option>
                  <option value="Andaman and Nicobar Islands">Andaman and Nicobar Islands</option>
                  <option value="Chandigarh">Chandigarh</option>
                  <option value="Dadra and Nagar Haveli and Daman & Diu">Dadra and Nagar Haveli and Daman & Diu</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Jammu & Kashmir">Jammu & Kashmir</option>
                  <option value="Ladakh">Ladakh</option>
                  <option value="Lakshadweep">Lakshadweep</option>
                  <option value="Puducherry">Puducherry</option>

                </select>
              </div>

              {/* Gender Buttons */}
              <div className="flex justify-center gap-4 mt-4">
                {["Male", "Female", "Other"].map((genderOption) => (
                  <button
                    key={genderOption}
                    type="button"
                    onClick={() => setForm({ ...form, gender: genderOption })}
                    className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 border-2 border-orange-400/50 hover:border-orange-300 shadow-md 
                      ${
                        form.gender === genderOption
                          ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg"
                          : "bg-black/40 text-orange-400 hover:bg-orange-600 hover:text-white"
                      }`}
                  >
                    {genderOption}
                  </button>
                ))}
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold rounded-xl shadow-lg hover:scale-105 transition-all duration-300 border-2 border-red-400/50 hover:border-red-300 mt-6"
              >
                Find My Schemes
              </button>
            </form>

            {error && (
              <div className="mt-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl">
                <p className="text-center text-red-300 font-semibold">{error}</p>
              </div>
            )}
          </div>

          {/* Scheme Results */}
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
