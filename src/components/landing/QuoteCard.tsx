import Image from "next/image";
import { Star } from "lucide-react";
import { Card } from "@/components/landing/Card";

export function QuoteCard({
  quote,
  detail,
  meta,
}: {
  quote: string;
  detail: string;
  meta?: string;
}) {
  return (
    <Card className="relative overflow-hidden space-y-3 px-10">
      <Image
        src="/fern-left-dark.png"
        alt=""
        width={64}
        height={160}
        className="pointer-events-none absolute left-0 top-1/2 h-20 w-auto -translate-y-1/2 opacity-80"
        aria-hidden
      />
      <Image
        src="/fern-right-dark.png"
        alt=""
        width={64}
        height={160}
        className="pointer-events-none absolute right-0 top-1/2 h-20 w-auto -translate-y-1/2 opacity-80"
        aria-hidden
      />
      <div className="relative z-10 flex items-center gap-1 text-teal-700">
        {Array.from({ length: 5 }).map((_, index) => (
          <Star key={index} className="h-4 w-4 fill-teal-600 stroke-teal-600" />
        ))}
      </div>
      {meta ? (
        <div className="relative z-10 text-xs font-semibold text-teal-700">{meta}</div>
      ) : null}
      <div className="relative z-10 text-base font-semibold">{quote}</div>
      <div className="relative z-10 text-sm text-gray-700">{detail}</div>
    </Card>
  );
}
