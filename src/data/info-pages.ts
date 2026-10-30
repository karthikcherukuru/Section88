export type InfoSection = { title: string; paragraphs: string[] };
export const infoPages: Record<string, { title: string; headline: string; intro: string; sections: InfoSection[] }> = {
  faq: {
    title: "Frequently asked questions", headline: "GOOD TO KNOW.", intro: "A few answers about the preview and what comes next.",
    sections: [
      { title: "Can I place an order?", paragraphs: ["This is a frontend preview. You can explore the sample collection and use a local demonstration bag. Checkout, payments and orders are unavailable."] },
      { title: "Are these the final products?", paragraphs: ["No. The ten catalogue entries use sample names, prices, fits, sizes and colors to test the shopping experience. Final merchandise information will replace these fixtures."] },
      { title: "How do I find my size?", paragraphs: ["The size-guide structure is available, but garment measurements are pending. Fit-specific charts will be published after the garments are approved."] },
      { title: "Where do you ship?", paragraphs: ["Shipping regions, rates and dispatch estimates have not been finalized. No delivery promises are made in this preview."] },
      { title: "What is the returns policy?", paragraphs: ["Return eligibility, windows and procedures will be published before real orders open. The current shipping and returns page is a content placeholder."] },
      { title: "Is my bag saved?", paragraphs: ["The demonstration bag is saved in this browser’s local storage when available. It is not linked to an account or shared across devices. Clearing browser data removes it."] },
      { title: "Does the newsletter subscribe me?", paragraphs: ["No. The signup form demonstrates validation, loading and confirmation states. It does not send or save your email address."] },
    ],
  },
  contact: {
    title: "Contact", headline: "LET’S TALK.", intro: "There will be a direct line to SECTION 88 here.",
    sections: [
      { title: "Contact details", paragraphs: ["Official contact details have not been supplied. A verified email address and any confirmed business details will appear here before launch."] },
      { title: "Message form", paragraphs: ["The form below previews a future contact flow. It cannot send a message. No personal information is transmitted or stored."] },
    ],
  },
  "shipping-returns": {
    title: "Shipping & returns", headline: "THE DETAILS.", intro: "Shipping and returns information will be confirmed before real orders open.",
    sections: [
      { title: "Shipping", paragraphs: ["Serviceable regions, shipping charges, estimated dispatch and delivery times, tracking and delayed-delivery support are pending merchant approval."] },
      { title: "Returns & exchanges", paragraphs: ["Eligibility, time limits, item condition, exclusions and the request process have not been finalized. No return or exchange promise is made by this placeholder."] },
      { title: "Refunds", paragraphs: ["Refund methods, timing and deductions, if any, will be documented alongside the real payment and order service."] },
    ],
  },
  privacy: {
    title: "Privacy", headline: "YOUR PRIVACY.", intro: "Policy placeholder. A reviewed privacy policy is required before launch.",
    sections: [
      { title: "What this preview does", paragraphs: ["The sample bag uses browser local storage. Announcement dismissal uses session storage. Newsletter and contact demonstration forms do not send their contents to an application backend."] },
      { title: "Before launch", paragraphs: ["The final notice must describe the actual business, hosting and service providers, information collected, purposes, legal requirements, retention, user rights and contact methods. This placeholder is not the final privacy policy."] },
      { title: "Browser data", paragraphs: ["You can remove the local demonstration bag and session preferences by clearing this site’s data in your browser. Infrastructure providers may process request data separately; final disclosures must reflect the deployed configuration."] },
    ],
  },
  terms: {
    title: "Terms", headline: "THE FINE PRINT.", intro: "Terms placeholder. Reviewed terms are required before real sales begin.",
    sections: [
      { title: "Preview status", paragraphs: ["This frontend is a demonstration. Sample products, prices and availability do not constitute a confirmed offer for sale. It does not accept payment or create orders."] },
      { title: "Before real orders", paragraphs: ["Merchant-approved terms must identify the business and address product information, pricing, taxes, payment, order acceptance, shipping, cancellations, returns and the applicable legal framework."] },
      { title: "Content approval", paragraphs: ["Product artwork, photography, brand copy, policies and contact details must be approved and licensed as needed before public launch."] },
    ],
  },
};
