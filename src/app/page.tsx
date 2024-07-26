'use client'

import { useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [url, setUrl] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!url && !file) return;
    setIsLoading(true);
    setMessage(null);

    const formData = new FormData();
    if (url) formData.append('url', url);
    if (file) formData.append('file', file);

    try {
      const response = await fetch('/api/analyze-cv', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        router.push(`/result?data=${encodeURIComponent(JSON.stringify(result))}`);
      } else {
        const errorData = await response.json();
        setMessage(`Error: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('An error occurred while analyzing the CV.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    } else {
      setFile(null);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">CV Analyzer</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="url" className="block mb-2">Enter CV URL (PDF/DOCX/DOC):</label>
          <input
            id="url"
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com/resume.pdf"
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="file" className="block mb-2">Or upload a CV file:</label>
          <input
            id="file"
            type="file"
            onChange={handleFileChange}
            accept=".pdf,.docx,.doc"
            className="w-full p-2 border rounded"
          />
        </div>
        {message && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{message}</span>
          </div>
        )}
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
          disabled={isLoading || (!url && !file)}
        >
          {isLoading ? 'Analyzing...' : 'Analyze CV'}
        </button>
      </form>
      {isLoading && (
        <div className="mt-4">
          <p className="text-gray-700">Please wait, your CV is being analyzed...</p>
        </div>
      )}
    </div>
  );
}
