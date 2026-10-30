"use client";
import Link from "next/link";
export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) { return <section className="not-found"><p className="mono">SECTION 88 / SOMETHING INTERRUPTED THE VIEW</p><h1>LET’S TRY THAT AGAIN.</h1><p>This page couldn’t load. Your local bag stays in this browser.</p><button className="button ink" onClick={reset}>Try again</button><Link className="text-link" href="/shop">Back to the collection</Link></section>; }
