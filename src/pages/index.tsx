import { useState } from "react";
import UserForm from "../components/UserForm";
import SchemeCard from "../components/SchemeCard";

export default function Home() {
    const [schemes, setSchemes] = useState([]);

    const handleSubmit = async (data: any) => {
        const res = await fetch("http://localhost:5000/api/schemes", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });
        const result = await res.json();
        setSchemes(result.schemes);
    }

    return (
        <div className="min-h-screen bg-gray-100 p-4">
            <h1 className="text-2xl font-bold mb-4">Government Schemes Finder</h1>
            <UserForm onSubmit={handleSubmit}/>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {schemes.map((s: any) => (
                    <SchemeCard key={s._id} {...s} />
                ))}
            </div>
        </div>
    )
}
