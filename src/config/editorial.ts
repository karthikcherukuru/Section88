// Provisional editorial direction. Replace these fields with approved brand content.
export const featuredProductIds = ["sample-01", "sample-02", "sample-03", "sample-04"];
export const editorial = {
  hero: { introduction: "An independent expression of everyday uniform." },
  campaign: "A space for the collection beyond the product frame. Campaign photography and styling notes will live here.",
  story: {
    introduction: "SECTION 88 begins with the relationship between a graphic, a silhouette, and the person wearing it.",
    origin: "The people, references, and meaning behind SECTION 88. Our full introduction is being written.",
    process: "From the first graphic study to the final fit. Process notes and approved garment details will be shared here.",
    philosophy: "A focused first collection. Different forms, held together by a shared visual point of view.",
  },
  substance: [
    { title: "The fit.", copy: "Oversized, boxy, regular. Explore the sample silhouettes. Verified measurements are coming next.", slot: "fit", href: "/size-guide", link: "Explore the fit guide" },
    { title: "The graphic.", copy: "A closer look at the artwork. Design stories will be added with the approved collection.", slot: "graphic", href: "/lookbook", link: "View the visual archive" },
    { title: "The detail.", copy: "Room for the things you feel. Fabric, finish, and construction details are awaiting approval.", slot: "construction", href: "/shop", link: "Explore the pieces" },
  ],
} as const;

