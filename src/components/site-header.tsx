"use client";
import { useEffect, useSyncExternalStore } from "react";
import Link from "next/link";
import { ArrowUpRight, Menu, Search, ShoppingBag, X } from "lucide-react";
import { useCart } from "@/stores/cart";
import { useUi } from "@/stores/ui";
import { Dialog } from "./dialog";
import { CartContent } from "./cart-content";
import { SearchPanel } from "./search-panel";
import { NavLink } from "./nav-link";

function subscribeAnnouncement(callback: () => void) { window.addEventListener("section88-announcement", callback); return () => window.removeEventListener("section88-announcement", callback); }
let announcementDismissed = false;
function getDismissed() { try { return announcementDismissed || sessionStorage.getItem("section88-announcement") === "dismissed"; } catch { return announcementDismissed; } }
export function SiteHeader() {
  const dismissed = useSyncExternalStore(subscribeAnnouncement, getDismissed, () => false);
  const overlay = useUi((state) => state.overlay);
  const setOverlay = useUi((state) => state.setOverlay);
  const lines = useCart((state) => state.lines);
  const hydrated = useCart((state) => state.hydrated);
  const count = hydrated ? lines.reduce((total, line) => total + line.quantity, 0) : 0;
  useEffect(() => {
    const storageError = () => useCart.getState().setStorageWarning("Browser storage is unavailable. Your bag will only last for this visit.");
    window.addEventListener("section88-storage-error", storageError);
    void Promise.resolve(useCart.persist.rehydrate()).catch(() => storageError()).finally(() => useCart.getState().setHydrated());
    const synchronize = (event: StorageEvent) => { if (event.key === "section88-demo-bag") void useCart.persist.rehydrate(); };
    window.addEventListener("storage", synchronize);
    return () => { window.removeEventListener("section88-storage-error", storageError); window.removeEventListener("storage", synchronize); };
  }, []);
  const close = () => setOverlay(null);
  return <>
    {!dismissed && <div className="announcement"><span className="mono">SECTION 88 / PRELAUNCH PREVIEW</span><span className="announcement-note mono">SAMPLE COLLECTION / NO ORDERS ACCEPTED</span><button className="announcement-close" aria-label="Dismiss announcement" onClick={() => { announcementDismissed = true; try { sessionStorage.setItem("section88-announcement", "dismissed"); } catch { /* Keep dismissal in memory when session storage is unavailable. */ } window.dispatchEvent(new Event("section88-announcement")); }}><X size={14} /></button></div>}
    <header className="site-header"><div className="header-left"><button className="menu-trigger" aria-label="Open menu" aria-haspopup="dialog" onClick={() => setOverlay("menu")}><Menu size={21} /><span className="desktop-nav">Menu</span></button></div>
      <Link className="wordmark" href="/" aria-label="SECTION 88 homepage">SECTION<span>88</span></Link>
      <div className="header-right"><button className="icon-button" aria-label="Open search" aria-haspopup="dialog" onClick={() => setOverlay("search")}><Search size={20} /></button><button className="icon-button bag-button" aria-label={`Open bag, ${count} items`} aria-haspopup="dialog" onClick={() => setOverlay("cart")}><ShoppingBag size={20} /><span className="bag-count">{count}</span></button></div>
    </header>
    <Dialog open={overlay === "menu"} onClose={close} title="Explore SECTION 88" side="left"><nav aria-label="Main navigation" className="drawer-nav">{[["/shop", "Shop all"], ["/lookbook", "Lookbook"], ["/our-story", "Our story"], ["/size-guide", "Size guide"], ["/faq", "Help"], ["/contact", "Contact"]].map(([href, title], index) => <NavLink key={href} href={href} onClick={close}><span className="mono">0{index + 1}</span>{title}<ArrowUpRight size={24} /></NavLink>)}</nav><p className="drawer-manifesto">CONTROLLED<br />REBELLION.</p><p className="mono muted">SECTION 88 / Collection 001</p></Dialog>
    <Dialog open={overlay === "search"} onClose={close} title="Search" side="right">{overlay === "search" && <SearchPanel onNavigate={close} />}</Dialog>
    <Dialog open={overlay === "cart"} onClose={close} title={`Your bag (${count})`} side="right"><CartContent drawer onNavigate={close} /></Dialog>
  </>;
}
