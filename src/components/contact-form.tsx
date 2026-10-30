"use client";
import { useState } from "react";
export function ContactForm() {
  const [notice, setNotice] = useState("");
  return <form className="contact-form" onSubmit={(event) => { event.preventDefault(); setNotice("Preview complete. Your message was not sent or saved. Contact integration is pending."); }}>
    <div><label htmlFor="contact-name">Name</label><input id="contact-name" name="name" autoComplete="name" maxLength={100} required /></div><div><label htmlFor="contact-email">Email</label><input id="contact-email" type="email" name="email" autoComplete="email" maxLength={200} required /></div><div><label htmlFor="contact-message">Message</label><textarea id="contact-message" name="message" rows={5} maxLength={2000} required /></div><p className="small muted">Demonstration only. No message will be sent or saved.</p><button className="button ink" type="submit">Preview message form</button><p role="status">{notice}</p>
  </form>;
}
