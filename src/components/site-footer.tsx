import Link from "next/link";
import { NavLink } from "./nav-link";
const groups = [
  { title: "Explore", links: [["Shop all", "/shop"], ["Lookbook", "/lookbook"], ["Our story", "/our-story"]] },
  { title: "Support", links: [["Size guide", "/size-guide"], ["FAQs", "/faq"], ["Shipping & returns", "/shipping-returns"], ["Contact", "/contact"]] },
  { title: "The fine print", links: [["Privacy", "/privacy"], ["Terms", "/terms"], ["Shopping bag", "/cart"]] },
];
export function SiteFooter() {
  return <footer className="site-footer"><div className="footer-columns"><div className="footer-intro"><Link className="footer-logo" href="/">SECTION 88<span className="footer-logo-dot" /></Link><p>Controlled rebellion.<br />An independent point of view.</p><span className="mono muted">PRELAUNCH / SAMPLE COLLECTION</span></div>{groups.map((group) => <nav key={group.title} aria-label={group.title}><h2 className="mono">{group.title}</h2>{group.links.map(([title, href]) => <NavLink key={href} href={href}>{title}</NavLink>)}</nav>)}</div><div className="footer-bottom"><span>© {new Date().getFullYear()} SECTION 88</span><span>Sample catalogue / checkout unavailable</span><span>INR ₹ / INDIA</span></div><div className="footer-wordmark" aria-hidden="true">SECTION 88</div></footer>;
}
