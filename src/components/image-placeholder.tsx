"use client";
import { useState, type CSSProperties } from "react";
import Image from "next/image";
import { aspectRatios, showAssetLabels, type ImageKind, type ImageSlot } from "@/config/images";

export function ImagePlaceholder({ slot, kind, className = "", priority = false, index, sizes = "(max-width: 640px) 100vw, 60vw" }: {
  slot: ImageSlot; kind?: ImageKind; className?: string; priority?: boolean; index?: string; sizes?: string;
}) {
  const [failedSource, setFailedSource] = useState<string>();
  const [loadedSource, setLoadedSource] = useState<string>();
  const ratio = aspectRatios[kind ?? slot.kind];
  const label = slot.id.toUpperCase().replaceAll("-", "_");
  return <div className={`image-frame ${className}`} style={{ aspectRatio: ratio, "--image-focal-desktop": slot.focalPoint ?? "50% 50%", "--image-focal-mobile": slot.mobileFocalPoint ?? slot.focalPoint ?? "50% 50%" } as CSSProperties}>
    {slot.src && slot.src !== failedSource ? <Image key={slot.src} src={slot.src} alt={slot.alt ?? slot.label} fill sizes={sizes} priority={priority} className="photograph" data-loaded={loadedSource === slot.src} onLoad={() => setLoadedSource(slot.src)} onError={() => setFailedSource(slot.src)} style={{ objectFit: slot.objectFit }} /> : <>
      {showAssetLabels && <span className="slot-top mono" aria-hidden="true">{label}</span>}
      <span className="slot-center">{showAssetLabels && <span>{slot.label}</span>}<span className="mono">Photography pending</span></span>
      {showAssetLabels && <span className="slot-bottom mono" aria-hidden="true">{index ? `S88 / ${index} · ` : ""}{ratio.replaceAll(" ", "")}</span>}
    </>}
  </div>;
}
