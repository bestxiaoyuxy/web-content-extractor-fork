'use client';

import { useState } from 'react';

export default function Home() {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleExtract = async () => {
    try {
      setLoading(true);
      setError('');
      setResult(null);

      const response = await fetch(`/api/extract?url=${encodeURIComponent(url)}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '提取内容失败');
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">网页内容提取器</h1>
        
        <div className="mb-8">
          <div className="flex gap-4">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="输入网页URL"
              className="flex-1 p-2 border rounded"
            />
            <button
              onClick={handleExtract}
              disabled={loading || !url}
              className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
            >
              {loading ? '提取中...' : '提取内容'}
            </button>
          </div>
          
          {error && (
            <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}
        </div>

        {result && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">{result.title}</h2>
            {result.byline && (
              <div className="text-gray-600">{result.byline}</div>
            )}
            {result.excerpt && (
              <div className="text-gray-700 italic">{result.excerpt}</div>
            )}
            <div className="whitespace-pre-wrap">{result.content}</div>
          </div>
        )}
      </div>
    </main>
  );
}
