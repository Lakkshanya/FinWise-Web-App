type Props = {
  name: string;
  benefits?: string;
  documents?: string[];
  apply_link?: string;
};

export default function SchemeCard({ name, benefits, documents, apply_link }: Props) {
  const speakScheme = () => {
    if ('speechSynthesis' in window) {
      const speech = new SpeechSynthesisUtterance();
      speech.text = `${name}. ${benefits || ''}. Documents required: ${documents ? documents.join(', ') : 'none'}`;
      const userLanguage = localStorage.getItem('preferredLanguage') || 'en-US';
      speech.lang = userLanguage;
      speech.volume = 1;
      speech.rate = 1;
      speech.pitch = 1;
      window.speechSynthesis.speak(speech);
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  return (
    <div className="border rounded-lg p-4 shadow bg-neutral-50 hover:shadow-lg transition w-full max-w-sm">
      <div className="flex justify-between items-start">
        <h2 className="font-bold text-lg text-orange-600">{name}</h2>
        <div className="flex space-x-2">
          <button
            onClick={speakScheme}
            className="text-blue-500 hover:text-blue-700 text-sm p-1"
            title="Read scheme details"
          >
            🔊
          </button>
          <button
            onClick={stopSpeaking}
            className="text-red-500 hover:text-red-700 text-sm p-1"
            title="Stop reading"
          >
            ⏹️
          </button>
        </div>
      </div>
      <p className="text-gray-700 mt-2">{benefits}</p>
      {documents && (
        <p className="text-sm text-gray-500 mt-2">
          <strong>Documents:</strong> {documents.join(', ')}
        </p>
      )}
      {apply_link && (
        <a
          href={apply_link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 underline mt-2 inline-block"
        >
          Apply
        </a>
      )}
    </div>
  );
}