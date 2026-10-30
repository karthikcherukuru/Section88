import type { ImageSlot } from "./images.ts";

type ProductMediaAsset = Pick<ImageSlot, "src" | "alt" | "focalPoint" | "width" | "height" | "objectFit">;

/** Inspected local originals, ordered front / back / on-body / detail.
 * Charcoal Tee is Signal Study: the three named Signal Study views share its
 * distressed rings and lime signal line. No Paper photographs were supplied.
 * See PRODUCT_IMAGE_INTEGRATION_REPORT.md and product-image-artifacts/inventory.json.
 */
const sets = [
  {
    number: "01", name: "Signal Study", folder: "Charcoal Tee",
    files: ["Floating Charcoal Tee in Minimalist Studio.png", "section88_signal_study_back.png", "section88_signal_study_on_body.png", "section88_signal_study_fabric_detail.png"],
    artwork: "distressed concentric rings crossed by a lime line",
    back: "distressed semicircular rings and vertical lime lines",
    detail: "distressed ring print and diagonal lime line on charcoal fabric",
  },
  {
    number: "02", name: "Off Register", folder: "Off Register",
    files: ["Suspended Washed Black Graphic T-Shirt.png", "SECTION88_Off_Register_Back.png", "SECTION88_Off_Register_On_Body.png", "SECTION88_Off_Register_Fabric_Detail.png"],
    artwork: "offset monochrome collage panels and lime registration lines",
    back: "overlapping monochrome collage panels and lime registration lines",
    detail: "weathered monochrome print and lime registration lines on black fabric",
  },
  {
    number: "03", name: "Open Channel", folder: "Open Channel", compact: true,
    files: ["Floating Portal Graphic T-Shirt.png", "ChatGPT Image Oct 30, 2026, 04_37_47 PM-1.png", "ChatGPT Image Oct 30, 2026, 04_37_51 PM-2.png", "ChatGPT Image Oct 30, 2026, 04_37_54 PM-3.png"],
    artwork: "nested concrete portals and a small lime sphere",
    back: "receding concrete doorway artwork",
    detail: "concrete portal print, lime sphere and visible black fabric texture",
  },
  {
    number: "04", name: "After Hours", folder: "After Hours",
    files: ["Moonlit Brutalist Cityscape T-Shirt.png", "SECTION88_After_Hours_Back.png", "SECTION88_After_Hours_On_Body.png", "SECTION88_After_Hours_Fabric_Detail.png"],
    artwork: "a moonlit concrete cityscape and illuminated doorway",
    back: "a large moon above a concrete cityscape",
    detail: "moonlit cityscape print and illuminated doorway on folded black fabric",
  },
  {
    number: "05", name: "Common Ground", folder: "Common Ground", compact: true,
    files: ["Suspended Staircase Daisy Tee.png", "ChatGPT Image Oct 30, 2026, 05_06_08 PM-1.png", "ChatGPT Image Oct 30, 2026, 05_06_11 PM-2.png", "ChatGPT Image Oct 30, 2026, 05_06_13 PM-3.png"],
    artwork: "a white daisy above a floating staircase and exposed roots",
    back: "branching roots and a suspended staircase",
    detail: "white daisy, stone steps and root artwork on textured black fabric",
  },
  {
    number: "06", name: "Side Effect", folder: "Side Effect",
    files: ["Floating Black Tee with Glitch Sculpture Print.png", "SECTION88_Side_Effect_Back.png", "SECTION88_Side_Effect_On_Body.png", "SECTION88_Side_Effect_Fabric_Detail.png"],
    artwork: "a fragmented classical bust and lime outline",
    back: "a fragmented classical bust with vertical glitch marks",
    detail: "distressed classical bust print and lime contour on black fabric",
  },
  {
    number: "07", name: "Static Motion", folder: "Static Motion", compact: true,
    files: ["Suspended Marble Orbit T-Shirt.png", "ChatGPT Image Oct 30, 2026, 05_44_54 PM-1.png", "ChatGPT Image Oct 30, 2026, 05_44_56 PM-2.png", "ChatGPT Image Oct 30, 2026, 05_44_58 PM-3.png"],
    artwork: "a marble sphere suspended in a rectangular frame with orbit lines",
    back: "three marble spheres linked by orbit lines",
    detail: "marble sphere, rectangular frame and fine orbit lines printed on black fabric",
  },
  {
    number: "08", name: "New Frequency", folder: "New Frequency",
    files: ["Daisy Wave Black T-Shirt.png", "SECTION88_New_Frequency_Back.png", "SECTION88_New_Frequency_On_Body.png", "SECTION88_New_Frequency_Fabric_Detail.png"],
    artwork: "a white daisy merging into fine waveform lines",
    back: "a central daisy surrounded by circular signal lines",
    detail: "fine circular waveform print and daisy petals on folded black fabric",
  },
  {
    number: "09", name: "Outside the Frame", folder: "Outside the Frame",
    files: ["Surreal Concrete Horizon Graphic Tee.png", "SECTION88_Outside_The_Frame_Back.png", "SECTION88_Outside_The_Frame_On_Body.png", "SECTION88_Outside_The_Frame_Fabric_Detail.png"],
    artwork: "a lone figure within a fractured concrete frame",
    back: "a fractured concrete frame around a distant figure",
    detail: "cracked concrete frame print, a small figure and lime accents on black fabric",
  },
  {
    number: "10", name: "Unwritten", folder: "Unwritten",
    files: ["Floating Black Tee with Folded Paper Graphic.png", "SECTION88_Unwritten_Back.png", "SECTION88_Unwritten_On_Body.png", "SECTION88_Unwritten_Fabric_Detail.png"],
    artwork: "an angular folded-paper graphic and small lime ring",
    back: "a fine rectangular outline and folded-paper graphic",
    detail: "folded-paper print, fine intersecting lines and a lime ring on black fabric",
  },
];

export const productMediaAssets: Record<string, ProductMediaAsset> = Object.fromEntries(
  sets.flatMap((set) => set.files.map((file, view) => {
    const [width, height] = view === 0 || set.compact
      ? view === 3 ? [1254, 1254] : [1122, 1402]
      : view === 3 ? [1600, 1600] : [1600, 2000];
    const scene = [
      `front view of the suspended charcoal-black T-shirt with ${set.artwork}`,
      `back view of the suspended charcoal-black T-shirt with ${set.back}`,
      `model wearing the charcoal-black T-shirt with ${set.artwork} and loose black trousers`,
      `close-up of ${set.detail}`,
    ][view];
    return [`sample-${set.number}-ink-${view}`, {
      src: `/images/${encodeURIComponent(set.folder)}/${encodeURIComponent(file)}`, alt: `${set.name} in Ink — ${scene}`,
      width, height, objectFit: "contain", focalPoint: "50% 50%",
    } satisfies ProductMediaAsset];
  })),
);
