import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { site } from "@/config/site";
import "./globals.css";

const display = Space_Grotesk({ subsets: ["latin"], variable: "--font-display", display: "swap" });
const body = Inter({ subsets: ["latin"], variable: "--font-body", display: "swap" });
export const metadata: Metadata = {
  metadataBase: site.url ? new URL(site.url) : undefined,
  title: { default: "SECTION 88 / Independent expression", template: "%s / SECTION 88" },
  description: site.description,
  robots: { index: site.isLaunched, follow: site.isLaunched },
  openGraph: { title: "SECTION 88", description: site.description, siteName: site.name, type: "website", locale: "en_IN" },
  twitter: { card: "summary", title: site.name, description: site.description },
};
export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#F3F1EA" };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className={`${display.variable} ${body.variable}`}><body><a className="skip-link" href="#main">Skip to content</a><SiteHeader /><main id="main" tabIndex={-1}>{children}</main><SiteFooter /></body></html>;
}
