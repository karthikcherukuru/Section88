"use client";
import { useEffect, useRef, type ReactNode } from "react";
export function Reveal({ children, className = "", distance = 18 }: { children: ReactNode; className?: string; distance?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = ref.current;
    if (!element || !window.IntersectionObserver || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        element.animate([{ opacity: 0, transform: `translateY(${distance}px)` }, { opacity: 1, transform: "translateY(0)" }], { duration: 480, easing: "cubic-bezier(0.22, 1, 0.36, 1)" });
        observer.disconnect();
      }
    }, { threshold: 0.1 });
    observer.observe(element);
    return () => observer.disconnect();
  }, [distance]);
  return <div ref={ref} className={className}>{children}</div>;
}
