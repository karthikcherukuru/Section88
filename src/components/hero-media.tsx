import Image, { getImageProps } from "next/image";
import type { CSSProperties } from "react";
import { imageSlots, type ImageSlot } from "@/config/images";

// A picture fallback avoids downloading the secondary artwork on mobile.
const transparentPixel = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

export function HeroMedia() {
  const desktop: ImageSlot = imageSlots.heroDesktop;
  const mobile: ImageSlot = imageSlots.heroMobile;
  const bloom: ImageSlot = imageSlots.heroBloom;
  if (!desktop.src) return null;

  const { props: mobileProps } = getImageProps({
    src: mobile.src ?? desktop.src, alt: "", width: 1536, height: 1024,
    // Cover fills a portrait area with landscape artwork; account for the crop.
    sizes: "(max-width: 430px) 828px, 1080px",
  });
  const bloomProps = bloom.src ? getImageProps({
    src: bloom.src, alt: "", width: 1536, height: 1024,
    sizes: "(max-width: 1023px) 70vw, 55vw",
  }).props : null;

  return <div className="hero-atmosphere" aria-hidden="true" style={{
    "--hero-focal-desktop": desktop.focalPoint ?? "50% 30%",
    "--hero-focal-mobile": mobile.focalPoint ?? "76% 45%",
    "--hero-bloom-focal": bloom.focalPoint ?? "62% 18%",
  } as CSSProperties}>
    <picture className="hero-image-layer hero-image-layer-primary">
      <source media="(max-width: 767px)" srcSet={mobileProps.srcSet} sizes={mobileProps.sizes} />
      <Image src={desktop.src} alt="" fill sizes="(max-width: 1023px) 120vw, 100vw" loading="eager" fetchPriority="high" className="photograph" />
    </picture>
    {bloomProps && <picture className="hero-image-layer hero-image-layer-bloom">
      <source media="(min-width: 768px)" srcSet={bloomProps.srcSet} sizes={bloomProps.sizes} />
      <Image src={transparentPixel} alt="" fill sizes={bloomProps.sizes} className="photograph" />
    </picture>}
    <div className="hero-atmosphere-wash" />
  </div>;
}
