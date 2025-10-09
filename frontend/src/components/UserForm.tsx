import { useState } from "react";

type Props = {
  onSubmit: (data: any) => void;
};

export default function UserForm({ onSubmit }: Props) {
  const [age, setAge] = useState("");
  const [income, setIncome] = useState("");
  const [occupation, setOccupation] = useState("");
  const [state, setState] = useState("");
  const [gender, setGender] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      age: Number(age),
      income: Number(income),
      occupation,
      state,
      gender,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-white rounded shadow max-w-xl mx-auto mt-8">
      <input
        type="number"
        placeholder="Age"
        value={age}
        onChange={(e) => setAge(e.target.value)}
        className="border p-2 m-2 w-full"
        min={18}
        max={100}
        required
      />
      <input
        type="number"
        placeholder="Annual Income (Lakhs)"
        value={income}
        onChange={(e) => setIncome(e.target.value)}
        className="border p-2 m-2 w-full"
        required
      />
      <select
        value={occupation}
        onChange={(e) => setOccupation(e.target.value)}
        className="border p-2 m-2 w-full"
        required
      >
        <option value="">Select Occupation</option>
        <option value="Engineer">Engineer</option>
        <option value="Farmer">Farmer</option>
        <option value="Student">Student</option>
        <option value="Self-Employed">Self-Employed</option>
        <option value="Unemployed">Unemployed</option>
      </select>
      <select
        value={state}
        onChange={(e) => setState(e.target.value)}
        className="border p-2 m-2 w-full"
        required
      >
        <option value="">Select State</option>
        <option value="Karnataka">Karnataka</option>
        <option value="Tamil Nadu">Tamil Nadu</option>
        <option value="Maharashtra">Maharashtra</option>
        <option value="Kerala">Kerala</option>
        <option value="Delhi">Delhi</option>
        {/* Add more states as needed */}
      </select>
      <div className="m-2">
        <label className="mr-2">Gender:</label>
        <label>
          <input
            type="radio"
            value="Male"
            checked={gender === "Male"}
            onChange={(e) => setGender(e.target.value)}
          />{" "}
          Male
        </label>
        <label className="ml-4">
          <input
            type="radio"
            value="Female"
            checked={gender === "Female"}
            onChange={(e) => setGender(e.target.value)}
          />{" "}
          Female
        </label>
        <label className="ml-4">
          <input
            type="radio"
            value="Other"
            checked={gender === "Other"}
            onChange={(e) => setGender(e.target.value)}
          />{" "}
          Other
        </label>
      </div>
      <button type="submit" className="bg-red-500 text-white p-2 rounded m-2">
        Find My Schemes
      </button>
    </form>
  );
}