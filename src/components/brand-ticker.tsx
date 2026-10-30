"use client";
import { useState } from "react";
import { Asterisk, Pause, Play } from "lucide-react";
export function BrandTicker() {
  const [paused, setPaused] = useState(false);
  return <div className="ticker" aria-label="SECTION 88 / Expression is the uniform / Drop 001"><div className="ticker-track" style={{ animationPlayState: paused ? "paused" : "running" }} aria-hidden="true">{Array.from({ length: 4 }, (_, index) => <span key={index}>SECTION 88 <Asterisk size={16} /> EXPRESSION IS THE UNIFORM <Asterisk size={16} /> DROP 001 <Asterisk size={16} /></span>)}</div><button className="icon-button ticker-control" aria-label={paused ? "Play brand ticker" : "Pause brand ticker"} onClick={() => setPaused(!paused)}>{paused ? <Play size={15} /> : <Pause size={15} />}</button></div>;
}
