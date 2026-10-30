"use client";
import { useState } from "react";
import { sizes, type Fit } from "@/data/products";
import { measurements } from "@/config/measurements";
export function SizeChart({ initialFit = "Oversized" }: { initialFit?: Fit }) {
  const [fit, setFit] = useState<Fit>(initialFit);
  return <div className="size-chart">
    <p className="demo-note">Measurements are being confirmed. Do not choose a size using this placeholder chart.</p>
    <div className="fit-tabs" role="group" aria-label="Measurement fit">{(Object.keys(measurements) as Fit[]).map((item) => <button key={item} aria-pressed={fit === item} onClick={() => setFit(item)}>{item}</button>)}</div>
    <div className="table-scroll" tabIndex={0} role="region" aria-label="Garment measurement table"><table><caption>{fit} / garment measurements in centimetres / pending fit approval</caption><thead><tr><th scope="col">Size</th><th scope="col">Chest width</th><th scope="col">Body length</th><th scope="col">Sleeve</th></tr></thead><tbody>{sizes.map((size) => <tr key={size}><th scope="row">{size}</th><td>{measurements[fit][size]?.chest ?? "Pending"}</td><td>{measurements[fit][size]?.length ?? "Pending"}</td><td>{measurements[fit][size]?.sleeve ?? "Pending"}</td></tr>)}</tbody></table></div>
    <div className="measure-notes"><h3>Measured flat. In centimetres.</h3><p>Chest: underarm to underarm. Length: shoulder to hem. Sleeve: shoulder seam to sleeve opening. Fit-specific values will be published with the approved garments.</p></div>
  </div>;
}

