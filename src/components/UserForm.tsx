import { useState } from "react";

type Props = {
    onSubmit: (data: any) => void;
};

export default function UserForm({ onSubmit }: Props) {
    const [age, setAge] = useState("");
    const [income, setIncome] = useState("");
    const [occupation, setOccupation] = useState("");
    const [state, setState] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({ age: Number(age), income: Number(income), occupation, state });
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 bg-white rounded shadow">
            <input type="number" placeholder="Age" value={age} onChange={e => setAge(e.target.value)} className="border p-2 m-2 w-full"/>
            <input type="number" placeholder="Income" value={income} onChange={e => setIncome(e.target.value)} className="border p-2 m-2 w-full"/>
            <input type="text" placeholder="Occupation" value={occupation} onChange={e => setOccupation(e.target.value)} className="border p-2 m-2 w-full"/>
            <input type="text" placeholder="State" value={state} onChange={e => setState(e.target.value)} className="border p-2 m-2 w-full"/>
            <button type="submit" className="bg-blue-500 text-white p-2 rounded m-2">Submit</button>
        </form>
    )
}
