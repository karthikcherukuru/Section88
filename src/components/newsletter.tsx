"use client";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, LoaderCircle } from "lucide-react";
export function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "error" | "loading" | "success">("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  return <section className="newsletter" aria-labelledby="newsletter-title"><div><h2 id="newsletter-title">STAY IN<br />THE SECTION.</h2></div><div><p>Future drops, new ideas, and what’s next for SECTION 88.</p><p className="small muted">Preview the signup experience. This demo does not save your email or subscribe you.</p><form noValidate onSubmit={(event) => { event.preventDefault(); if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) { setStatus("error"); return; } setStatus("loading"); if (timer.current) clearTimeout(timer.current); timer.current = setTimeout(() => setStatus("success"), 650); }}>
    <label htmlFor="newsletter-email">Email address</label><div className="newsletter-field"><input id="newsletter-email" type="email" name="email" autoComplete="email" placeholder="Your email address" value={email} aria-invalid={status === "error"} aria-describedby="newsletter-message" onChange={(event) => { setEmail(event.target.value); setStatus("idle"); }} disabled={status === "loading"} required /><button type="submit" aria-label="Preview newsletter signup" disabled={status === "loading"}>{status === "loading" ? <LoaderCircle className="spinner" size={19} /> : <><span>Try demo</span><ArrowUpRight size={20} /></>}</button></div>
    <p id="newsletter-message" role={status === "error" ? "alert" : "status"} className="small">{status === "error" ? "Enter a valid email address to preview signup." : status === "success" ? "Demo complete. Your email was not saved and you have not been subscribed." : status === "loading" ? "Previewing signup…" : "No data is sent. Email integration is pending."}</p>
  </form></div></section>;
}
