import { NextResponse } from 'next/server';
import { Readability } from '@mozilla/readability';
import { JSDOM } from 'jsdom';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const targetUrl = searchParams.get('url');

    if (!targetUrl) {
      return NextResponse.json(
        { error: 'URL parameter is required' },
        { status: 400 }
      );
    }

    // 使用fetch获取页面内容
    const response = await fetch(targetUrl);
    const html = await response.text();

    // 使用Readability解析内容
    const dom = new JSDOM(html);
    const reader = new Readability(dom.window.document);
    const article = reader.parse();

    if (!article) {
      return NextResponse.json(
        { error: 'Failed to extract content' },
        { status: 400 }
      );
    }

    // 清理文本内容，移除多余的换行符
    const cleanText = (text: string) => {
      return text
        .replace(/[\n\s]+/g, ' ')  // 将连续的换行和空白字符替换为单个空格
        .trim();                    // 移除首尾空白
    };

    return NextResponse.json({
      title: article.title,
      content: cleanText(article.textContent || ''),
      excerpt: article.excerpt,
      byline: article.byline,
      length: article.length,
    });
  } catch (error) {
    console.error('Error processing URL:', error);
    return NextResponse.json(
      { error: 'Failed to process URL' },
      { status: 500 }
    );
  }
} 