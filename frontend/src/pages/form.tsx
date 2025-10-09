import { useState } from "react";
import Navbar from "../components/Navbar";
import SchemeCard from "../components/SchemeCard";

export default function FormPage() {
  const [schemes, setSchemes] = useState([]);
  const [form, setForm] = useState({ age: "", income: "", occupation: "", state: "", gender: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("http://localhost:5000/api/schemes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const result = await res.json();
    setSchemes(result.schemes);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <form onSubmit={handleSubmit} className="p-6 bg-white rounded shadow max-w-xl mx-auto mt-8">
        <input type="number" placeholder="Age" value={form.age} onChange={e => setForm({ ...form, age: e.target.value })} className="border p-2 m-2 w-full" />
        <input type="number" placeholder="Annual Income (Lakhs)" value={form.income} onChange={e => setForm({ ...form, income: e.target.value })} className="border p-2 m-2 w-full" />
        <select value={form.occupation} onChange={e => setForm({ ...form, occupation: e.target.value })} className="border p-2 m-2 w-full">
          <option value="">Select Occupation</option>
          <option value="Engineer">Engineer</option>
          <option value="Farmer">Farmer</option>
          <option value="Student">Student</option>
        </select>
        <select value={form.state} onChange={e => setForm({ ...form, state: e.target.value })} className="border p-2 m-2 w-full">
          <option value="">Select State</option>
          <option value="Karnataka">Karnataka</option>
          <option value="Tamil Nadu">Tamil Nadu</option>
        </select>
        <div className="m-2">
          <label className="mr-2">Gender:</label>
          <label><input type="radio" value="Male" checked={form.gender === "Male"} onChange={e => setForm({ ...form, gender: e.target.value })} /> Male</label>
          <label className="ml-4"><input type="radio" value="Female" checked={form.gender === "Female"} onChange={e => setForm({ ...form, gender: e.target.value })} /> Female</label>
          <label className="ml-4"><input type="radio" value="Other" checked={form.gender === "Other"} onChange={e => setForm({ ...form, gender: e.target.value })} /> Other</label>
        </div>
        <button type="submit" className="bg-red-500 text-white p-2 rounded m-2">Find My Schemes</button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 p-4">
        {schemes.map((s: any) => (
          <SchemeCard key={s._id} {...s} />
        ))}
      </div>
    </div>
  );
}