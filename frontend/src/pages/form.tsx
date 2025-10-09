import { useState } from "react";
import Navbar from "../components/Navbar";
import SchemeCard from "../components/SchemeCard";

export default function FormPage() {
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
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <form
        onSubmit={handleSubmit}
        className="p-6 bg-white rounded shadow max-w-xl mx-auto mt-8"
      >
        <input
          type="number"
          placeholder="Age"
          value={form.age}
          onChange={(e) => setForm({ ...form, age: e.target.value })}
          className="border border-black text-black p-2 m-2 w-full"
          min={18}
          max={100}
          required
        />
        <input
          type="number"
          placeholder="Annual Income (Lakhs)"
          value={form.income}
          onChange={(e) => setForm({ ...form, income: e.target.value })}
          className="border border-black text-black p-2 m-2 w-full"
          required
        />
        <select
          value={form.occupation}
          onChange={(e) => setForm({ ...form, occupation: e.target.value })}
          className="border border-black text-black p-2 m-2 w-full"
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
        <select
          value={form.state}
          onChange={(e) => setForm({ ...form, state: e.target.value })}
          className="border border-black text-black p-2 m-2 w-full"
          required
        >
          <option value="">Select State</option>
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
          <option value="Delhi">Delhi</option>
          <option value="Jammu and Kashmir">Jammu and Kashmir</option>
          <option value="Ladakh">Ladakh</option>
          <option value="Puducherry">Puducherry</option>
          <option value="Chandigarh">Chandigarh</option>
          <option value="Dadra and Nagar Haveli and Daman and Diu">Dadra and Nagar Haveli and Daman and Diu</option>
          <option value="Lakshadweep">Lakshadweep</option>
          <option value="Andaman and Nicobar Islands">Andaman and Nicobar Islands</option>
          {/* Add more states as needed */}
        </select>
        <div className="m-2 text-black">
          <label className="mr-2">Gender:</label>
          <label>
            <input
              type="radio"
              value="Male"
              checked={form.gender === "Male"}
              onChange={(e) => setForm({ ...form, gender: e.target.value })}
            />{" "}
            Male
          </label>
          <label className="ml-4">
            <input
              type="radio"
              value="Female"
              checked={form.gender === "Female"}
              onChange={(e) => setForm({ ...form, gender: e.target.value })}
            />{" "}
            Female
          </label>
          <label className="ml-4">
            <input
              type="radio"
              value="Other"
              checked={form.gender === "Other"}
              onChange={(e) => setForm({ ...form, gender: e.target.value })}
            />{" "}
            Other
          </label>
        </div>
        <button
          type="submit"
          className="bg-red-500 text-white p-2 rounded m-2 hover:scale-105 transition"
        >
          Find My Schemes
        </button>
      </form>

      {error && (
        <p className="text-center text-red-600 font-semibold mt-4">{error}</p>
      )}

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