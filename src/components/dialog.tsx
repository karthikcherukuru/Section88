"use client";
import { useEffect, useId, useRef, type ReactNode } from "react";
import { X } from "lucide-react";

export function Dialog({ open, onClose, title, children, side = "center", className = "" }: {
  open: boolean; onClose: () => void; title: string; children: ReactNode;
  side?: "left" | "right" | "bottom" | "center"; className?: string;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);
  const previousOverflow = useRef("");
  const id = useId();
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    let timer: ReturnType<typeof setTimeout> | undefined;
    if (open) {
      if (!dialog.open) {
        previousFocus.current = document.activeElement as HTMLElement;
        previousOverflow.current = document.body.style.overflow;
        dialog.showModal();
        document.body.style.overflow = "hidden";
      }
      dialog.dataset.state = "open";
    } else if (dialog.open) {
      dialog.dataset.state = "closed";
      timer = setTimeout(() => {
        dialog.close();
        document.body.style.overflow = previousOverflow.current;
        previousFocus.current?.focus({ preventScroll: true });
      }, window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 320);
    }
    return () => clearTimeout(timer);
  }, [open]);
  useEffect(() => {
    const dialog = ref.current;
    return () => {
      if (dialog?.open) {
        dialog.close();
        document.body.style.overflow = previousOverflow.current;
        previousFocus.current?.focus({ preventScroll: true });
      }
    };
  }, []);
  return <dialog ref={ref} className={`dialog dialog-${side} ${className}`} aria-labelledby={id}
    onKeyDown={(event) => {
      if (event.key !== "Tab") return;
      const controls = Array.from(event.currentTarget.querySelectorAll<HTMLElement>('a[href], button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])')).filter((element) => element.getClientRects().length > 0 && !element.closest("[inert]"));
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (!first) { event.preventDefault(); return; }
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }}
    onCancel={(event) => { event.preventDefault(); onClose(); }}
    onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <div className="dialog-panel">
      <div className="dialog-heading"><h2 id={id}>{title}</h2><button className="icon-button" onClick={onClose} aria-label={`Close ${title}`}><X size={22} /></button></div>
      <div className="dialog-body">{children}</div>
    </div>
  </dialog>;
}
