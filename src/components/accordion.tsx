"use client";
import { useId, useState, type ReactNode } from "react";
import { Plus } from "lucide-react";
export function Accordion({ title, children }: { title: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  return <div className={`accordion ${open ? "is-open" : ""}`}><h3><button aria-expanded={open} aria-controls={id} onClick={() => setOpen(!open)}>{title}<Plus size={19} aria-hidden="true" /></button></h3><div className="accordion-content" id={id} inert={!open}><div><div className="accordion-copy">{children}</div></div></div></div>;
}
