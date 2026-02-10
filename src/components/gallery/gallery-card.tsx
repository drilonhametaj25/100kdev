"use client";

import { formatPrice } from "@/lib/utils/format";
import { getPriceColor } from "@/lib/counter/calculator";
import { useLanguage } from "@/hooks/use-language";

interface GalleryCardProps {
  index: number;
  title: string;
  description: string | null;
  pricePaid: number;
  projectUrl: string | null;
}

export function GalleryCard({ index, title, description, pricePaid, projectUrl }: GalleryCardProps) {
  const { t } = useLanguage();
  const colorConfig = getPriceColor(pricePaid);

  const content = (
    <div className="flex items-start gap-4 p-4 border border-white/10 rounded-lg hover:border-white/20 hover:bg-white/5 transition-all group">
      {/* Index number */}
      <span className="text-2xl font-mono font-bold text-white/20 group-hover:text-white/30 transition-colors">
        #{String(index).padStart(2, "0")}
      </span>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h3 className="font-mono font-bold text-white truncate">{title}</h3>
        {description && (
          <p className="text-sm text-white/50 mt-1 line-clamp-2">{description}</p>
        )}
      </div>

      {/* Price */}
      <div className="text-right">
        <span
          className="font-mono font-bold text-lg"
          style={{ color: colorConfig.hex }}
        >
          {formatPrice(pricePaid)}
        </span>
        <p className="text-xs text-white/30">{t.paidAt}</p>
      </div>
    </div>
  );

  if (projectUrl) {
    return (
      <a href={projectUrl} target="_blank" rel="noopener noreferrer">
        {content}
      </a>
    );
  }

  return content;
}
