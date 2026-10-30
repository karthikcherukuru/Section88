import type { Metadata } from "next";
import { CartContent } from "@/components/cart-content";
export const metadata: Metadata = { title: "Your shopping bag", description: "Review your local SECTION 88 demonstration bag. Checkout is not yet available." };
export default function CartPage() { return <><section className="page-heading"><p className="mono">YOUR SELECTION</p><h1>THE BAG.</h1></section><div className="cart-page"><CartContent /></div></>; }
