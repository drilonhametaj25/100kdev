"use client";

interface TikTokEmbedProps {
  embedHtml: string | null;
  tiktokUrl: string;
}

export function TikTokEmbed({ embedHtml, tiktokUrl }: TikTokEmbedProps) {
  if (embedHtml) {
    return (
      <div
        className="flex justify-center"
        dangerouslySetInnerHTML={{ __html: embedHtml }}
      />
    );
  }

  // Fallback to link
  return (
    <a
      href={tiktokUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-center gap-2 p-6 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors"
    >
      <span className="text-3xl">📱</span>
      <span className="font-mono text-white">Watch on TikTok</span>
      <svg className="w-4 h-4 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
      </svg>
    </a>
  );
}
