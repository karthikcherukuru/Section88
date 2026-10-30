export type ImageKind = "hero-desktop" | "hero-mobile" | "product-card" | "product-gallery" | "campaign" | "lookbook-portrait" | "lookbook-landscape" | "fabric";
export type ImageSlot = {
  id: string; label: string; kind: ImageKind; src?: string; alt?: string;
  /** CSS object-position, e.g. "60% 35%". Does not change the reserved frame. */
  focalPoint?: string;
  /** Optional focal point below the homepage's 768px layout breakpoint. */
  mobileFocalPoint?: string;
  /** Original pixel dimensions and framing, independent of the reserved UI frame. */
  width?: number;
  height?: number;
  objectFit?: "contain" | "cover";
  caption?: string;
  productSlug?: string;
};
// Set false for a clean customer-facing view. This never changes frame geometry.
export const showAssetLabels = true;

export const aspectRatios: Record<ImageKind, string> = {
  "hero-desktop": "3 / 2", "hero-mobile": "4 / 5", "product-card": "4 / 5",
  "product-gallery": "4 / 5", campaign: "16 / 9", "lookbook-portrait": "3 / 4",
  "lookbook-landscape": "3 / 2", fabric: "1 / 1",
};

// Add src: "/images/filename.webp" and meaningful alt text to replace a slot.
// External sources also require a narrow remotePatterns entry in next.config.ts.
export const imageSlots = {
  // These share the original artwork, with independent responsive focal points.
  // HeroMedia renders these atmospheric layers decoratively (empty alt text).
  heroDesktop: { id: "home-hero-desktop", label: "The Invisible Individual / desktop atmosphere", kind: "hero-desktop", src: "/images/Frosted Silhouette in Minimal Light.png", focalPoint: "50% 30%" },
  heroMobile: { id: "home-hero-mobile", label: "The Invisible Individual / mobile atmosphere", kind: "hero-mobile", src: "/images/Frosted Silhouette in Minimal Light.png", focalPoint: "76% 45%" },
  // The approved secondary source is absent from this checkout. Keep the slot reserved and omit its src until that exact image is supplied.
  heroBloom: { id: "home-hero-bloom", label: "The Ghost Bloom / secondary atmosphere", kind: "hero-desktop", focalPoint: "62% 18%" },
  campaign: { id: "home-campaign", label: "Campaign / wear your own story", kind: "campaign", src: "/images/Lone Figure in Golden Concrete Light.png", alt: "A model in a black graphic T-shirt beneath monumental concrete walls and a shaft of golden light.", width: 1086, height: 1448, objectFit: "cover", focalPoint: "50% 52%", mobileFocalPoint: "50% 50%" },
  story: { id: "home-story", label: "Story / campaign portrait", kind: "lookbook-portrait", src: "/images/Moody Minimalist Streetwear Portrait.png", alt: "A model wearing a black geometric-print T-shirt and wide trousers beside a reflective glass wall in warm concrete light.", width: 1086, height: 1448, objectFit: "cover", focalPoint: "50% 50%" },
  storyProcess: { id: "story-process", label: "Story / creative process", kind: "lookbook-landscape", src: "/images/our-story/story-process.png", alt: "Hands arranging translucent architectural artwork over paper beside folded black fabric in a sunlit conceptual workspace.", width: 1536, height: 1024, objectFit: "cover", focalPoint: "50% 50%" },
  storyPortrait: { id: "story-portrait", label: "Story / portrait", kind: "lookbook-portrait", src: "/images/our-story/story-portrait.png", alt: "Anonymous model in a black T-shirt beside frosted glass, with a softly displaced silhouette in a sunlit architectural space.", width: 1086, height: 1448, objectFit: "cover", focalPoint: "50% 50%" },
  storyOrigin: { id: "story-origin", label: "STORY_ORIGIN_01", kind: "lookbook-landscape", src: "/images/our-story/story-origin.png", alt: "Anonymous figure standing before an immense doorway in a surreal ivory architectural space.", width: 1536, height: 1024, objectFit: "cover", focalPoint: "50% 50%" },
  fit: { id: "home-fit", label: "FIT_01", kind: "lookbook-portrait", src: "/images/Sunlit Brutalist Elegance.png", alt: "A model wearing a loose black T-shirt with a pale geometric print, framed by sunlit concrete arches and floating slabs.", width: 1672, height: 941, objectFit: "cover", focalPoint: "66% 50%" },
  graphic: { id: "home-graphic", label: "GRAPHIC_01", kind: "fabric", src: "/images/Origami Print on Black Cotton.png", alt: "Close-up of a pale folded-paper-style geometric print with fine lines and a lime circle on textured black fabric.", width: 1254, height: 1254, objectFit: "cover", focalPoint: "50% 50%" },
  construction: { id: "home-construction", label: "CONSTRUCTION_01", kind: "fabric", src: "/images/Moody Black T-Shirt on Stone.png", alt: "Close-up of a black T-shirt's ribbed neckline, shoulder stitching and fabric folds on a sunlit stone surface.", width: 1254, height: 1254, objectFit: "cover", focalPoint: "50% 50%" },
} satisfies Record<string, ImageSlot>;

// Stable slot IDs retain their editorial grid positions when an unfilled slot is hidden.
export const lookbookSlots: ImageSlot[] = [
  { id: "lookbook-1", label: "Lookbook / The Arrival", kind: "lookbook-landscape", caption: "The Arrival", src: "/images/lookbook/01_Establishing.png", alt: "A model in a white graphic T-shirt and black trousers stands among monumental concrete walls, with mountains and mist beyond a wide opening.", width: 1536, height: 1024, objectFit: "cover", focalPoint: "50% 50%" },
  { id: "lookbook-2", label: "Lookbook / The Individual", kind: "lookbook-portrait", caption: "The Individual", src: "/images/lookbook/02_The_Individual.png", alt: "A model in a white graphic T-shirt and wide black trousers beside frosted glass, with a shadowy silhouette beyond it and sunlit concrete architecture.", width: 1086, height: 1448, objectFit: "cover", focalPoint: "50% 50%" },
  { id: "lookbook-3", label: "Lookbook / The Reflection", kind: "lookbook-portrait", caption: "The Reflection", src: "/images/lookbook/03_The_Reflection.png", alt: "A model in a white moon-and-rock graphic T-shirt stands alongside a softened reflection in a tall frosted-glass panel.", width: 1086, height: 1448, objectFit: "cover", focalPoint: "50% 50%" },
  { id: "lookbook-4", label: "Lookbook / The Impossible Space", kind: "lookbook-landscape", caption: "The Impossible Space", src: "/images/lookbook/04_Impossible_Space.png", alt: "Two models in white and black graphic T-shirts among suspended concrete platforms and stairs, with misty mountains framed by a huge circular opening.", width: 1536, height: 1024, objectFit: "cover", focalPoint: "50% 50%" },
  // Optional sixth photograph: keep unpopulated until approved; omitted from the public gallery.
  { id: "lookbook-5", label: "Lookbook / frame 05", kind: "lookbook-portrait" },
  { id: "lookbook-6", label: "Lookbook / The Closing Frame", kind: "lookbook-portrait", caption: "The Closing Frame", src: "/images/lookbook/05_Closing_Portrait.png", alt: "A model in a black moon-and-rock graphic T-shirt and wide trousers beside frosted glass, framed by warm concrete and a misty mountain view.", width: 1086, height: 1448, objectFit: "cover", focalPoint: "50% 50%" },
];
