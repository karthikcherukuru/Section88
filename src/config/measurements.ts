import type { Fit, Size } from "@/data/products";
type Measurement = { chest: number | null; length: number | null; sleeve: number | null };
export type FitMeasurements = Partial<Record<Size, Measurement>>;
// Only populate with verified garment measurements in centimetres.
export const measurements: Record<Fit, FitMeasurements> = { Oversized: {}, Boxy: {}, Regular: {} };

