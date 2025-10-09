export default function Navbar() {
  return (
    <nav className="flex justify-between items-center p-4 bg-orange-500 text-white shadow-md">
      <div className="text-xl font-bold">FinWise</div>
      <div className="space-x-4">
        <a href="/voice" className="hover:underline">Speak Your Query</a>
        <a href="/upload" className="hover:underline">Upload Documents</a>
        <a href="/form" className="hover:underline">Proceed to Form</a>
      </div>
    </nav>
  );
}