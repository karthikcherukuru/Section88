"use client";
import { useRef, useState } from "react";
import { ArrowLeft, ArrowRight, ZoomIn } from "lucide-react";
import type { ImageSlot } from "@/config/images";
import { galleryIndex } from "@/lib/media";
import { ImagePlaceholder } from "./image-placeholder";
import { Dialog } from "./dialog";

export function ProductGallery({ media, name, number }: { media: ImageSlot[]; name: string; number: string }) {
  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState(false);
  const touch = useRef({ x: 0, y: 0 });
  const index = galleryIndex(active, media.length);
  const slot = media[index];
  const navigate = (direction: number) => setActive((current) => galleryIndex(current + direction, media.length));
  const controls = media.length > 1 ? <div className="gallery-controls">
    <button className="icon-button" aria-label="Previous image" onClick={() => navigate(-1)}><ArrowLeft size={18} /></button>
    <span className="mono" aria-live="polite">{String(index + 1).padStart(2, "0")} / {String(media.length).padStart(2, "0")}</span>
    <button className="icon-button" aria-label="Next image" onClick={() => navigate(1)}><ArrowRight size={18} /></button>
  </div> : <p className="gallery-single mono">{slot ? "01 / 01" : "Photography pending"}</p>;
  return <div className="product-gallery">
    <div className="gallery-main" onTouchStart={(event) => { touch.current = { x: event.touches[0].clientX, y: event.touches[0].clientY }; }} onTouchEnd={(event) => {
      const end = event.changedTouches[0];
      const x = end.clientX - touch.current.x;
      if (media.length > 1 && Math.abs(x) > 50 && Math.abs(end.clientY - touch.current.y) < 70) navigate(x < 0 ? 1 : -1);
    }}>
      {slot ? <button className="gallery-zoom-button" onClick={() => setZoom(true)} aria-label={`Zoom ${slot.label}`}>
        <ImagePlaceholder slot={slot} kind="product-gallery" index={number} priority={index === 0} sizes="(max-width: 767px) calc(100vw - 32px), (max-width: 1147px) calc(60vw - 48px), 640px" />
        <span className="zoom-icon"><ZoomIn size={20} /></span>
      </button> : <ImagePlaceholder slot={{ id: `product-${number}-pending`, label: "Product photography pending", kind: "product-gallery" }} />}
      {controls}
    </div>
    {media.length > 1 && <div className="gallery-thumbnails" role="group" aria-label="Product images">{media.map((image, i) => <button key={image.id} aria-label={`Show ${image.label}`} aria-pressed={index === i} onClick={() => setActive(i)}>
      <ImagePlaceholder slot={image} kind="product-card" sizes="(max-width: 767px) 64px, (max-width: 1147px) 12vw, 140px" />
      <span>{image.label.split(" / ").at(-1)}</span>
    </button>)}</div>}
    <Dialog open={zoom && Boolean(slot)} onClose={() => setZoom(false)} title={`${name} / image ${index + 1}`} className="zoom-dialog">
      {slot && <div className="zoom-content"><ImagePlaceholder slot={slot} index={number} sizes="(max-width: 767px) 90vw, 600px" />{media.length > 1 && <div className="gallery-controls"><button className="button" onClick={() => navigate(-1)}><ArrowLeft size={17} />Previous</button><button className="button" onClick={() => navigate(1)}>Next<ArrowRight size={17} /></button></div>}</div>}
    </Dialog>
  </div>;
}

