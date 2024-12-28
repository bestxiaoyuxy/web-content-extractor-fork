'use client';

import { useState } from 'react';
import { ArrowRight, Copy, Check, Github } from 'lucide-react';

export default function Home() {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

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

  const handleCopy = async () => {
    if (result?.content) {
      await navigator.clipboard.writeText(result.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const apiUrl = `${process.env.NEXT_PUBLIC_VERCEL_URL || 'http://localhost:3000'}/api/extract?url=`;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* 导航栏 */}
      <nav className="border-b bg-white/50 backdrop-blur-sm fixed top-0 w-full z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">Web Content Extractor</h1>
            </div>
            <div>
              <a
                href="https://github.com/eggacheb/web-content-extractor"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-gray-700"
              >
                <Github className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>
      </nav>

      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* 介绍部分 */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              将任意网页转换为干净的文本内容
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              自动提取网页的主要内容，移除广告、导航和其他干扰元素。
              适用于AI模型输入、阅读模式等场景。
            </p>
          </div>

          {/* 输入部分 */}
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
            <div className="flex gap-4">
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="输入网页URL，例如: https://example.com"
                className="flex-1 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />
              <button
                onClick={handleExtract}
                disabled={loading || !url}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    提取内容
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

            {/* API使用说明 */}
            <div className="mt-4 text-sm text-gray-500">
              <p className="mb-2">API 使用方式:</p>
              <div className="bg-gray-50 p-3 rounded-lg flex items-center gap-2 font-mono">
                <span className="flex-1 overflow-x-auto whitespace-nowrap">
                  {apiUrl}https://example.com
                </span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(apiUrl + 'https://example.com');
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* 错误提示 */}
          {error && (
            <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-lg text-red-600">
              {error}
            </div>
          )}

          {/* 结果展示 */}
          {result && (
            <div className="bg-white rounded-lg shadow-sm border p-6 space-y-4">
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-xl font-semibold text-gray-900">{result.title}</h3>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 px-3 py-1 text-sm text-gray-500 hover:text-gray-700 border rounded-md hover:bg-gray-50"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4" />
                      已复制
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      复制内容
                    </>
                  )}
                </button>
              </div>
              {result.byline && (
                <div className="text-sm text-gray-500">{result.byline}</div>
              )}
              {result.excerpt && (
                <div className="text-gray-600 italic border-l-4 border-gray-100 pl-4">
                  {result.excerpt}
                </div>
              )}
              <div className="prose prose-gray max-w-none">
                {result.content}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
