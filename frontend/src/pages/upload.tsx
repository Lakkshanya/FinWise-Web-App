import { useState } from "react";
import Navbar from "../components/Navbar";

export default function UploadPage() {
  const [files, setFiles] = useState<FileList | null>(null);

  const handleUpload = () => {
    if (!files) return;
    alert("Documents uploaded successfully!");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-xl mx-auto p-6 bg-white shadow rounded mt-8">
        <h2 className="text-xl font-bold mb-4">Upload Your Documents</h2>
        <input type="file" multiple onChange={e => setFiles(e.target.files)} className="mb-4" />
        <button onClick={handleUpload} className="bg-blue-500 text-white px-4 py-2 rounded">Upload</button>
      </div>
    </div>
  );
}