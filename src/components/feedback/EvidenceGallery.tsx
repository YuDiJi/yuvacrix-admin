"use client";

import { ImageOff } from "lucide-react";
import { useState } from "react";
import { safeEvidenceHref } from "@/lib/feedback";

function EvidenceImage({ href, index }: { href: string; index: number }) {
  const [failed, setFailed] = useState(false);
  if (failed) return <div className="grid aspect-video min-h-36 place-items-center rounded-lg border border-line bg-surface p-4 text-center text-sm text-slate-500"><div><ImageOff className="mx-auto mb-2 size-5" aria-hidden="true" />Evidence unavailable</div></div>;
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" aria-label={`Open evidence image ${index + 1} in a new tab`} className="group block overflow-hidden rounded-lg border border-line bg-surface focus:outline-none focus:ring-2 focus:ring-brand">
      {/* eslint-disable-next-line @next/next/no-img-element -- signed evidence URLs are short-lived and should not require broad Next image remote config. */}
      <img src={href} alt={`Feedback evidence image ${index + 1}`} loading="lazy" onError={() => setFailed(true)} className="aspect-video w-full object-cover transition group-hover:scale-[1.02]" />
    </a>
  );
}

export function EvidenceGallery({ urls }: { urls: string[] }) {
  const safeUrls = urls.map(safeEvidenceHref).filter((value): value is string => Boolean(value)).slice(0, 3);
  if (!safeUrls.length) return <p className="mt-4 rounded-xl bg-surface p-4 text-sm text-slate-500">No evidence provided.</p>;
  return <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{safeUrls.map((href, index) => <EvidenceImage key={`${href}-${index}`} href={href} index={index} />)}</div>;
}
