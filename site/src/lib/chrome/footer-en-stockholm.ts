type FooterLink = {
  label: string;
  href: string;
};

type FooterSection = {
  title: string;
  links: FooterLink[];
};

type FooterGroupedSection = {
  title: string;
  links: FooterLink[];
};

type FooterSocialLink = {
  label: string;
  href: string;
  icon: "instagram" | "facebook" | "pinterest" | "spotify";
};

/**
 * English Stockholm footer: same shape as `footer-sv.ts`.
 * - Column 2 “The Experience” includes NPF (peer of `NPF-besökare`).
 * - Bottom SEO row: Activity, Museum, Things to do, Exhibition (peers of Aktivitet, Museum, Att göra, Utställning).
 */
export function getEnglishStockholmFooterModel() {
  const sections: FooterSection[] = [
    {
      title: "Visit ANDETAG",
      links: [
        { label: "Tickets", href: "/en/stockholm/tickets/" },
        { label: "Season pass", href: "/en/stockholm/season-pass/" },
        { label: "Gift cards", href: "/en/stockholm/giftcard/" },
        { label: "Opening hours", href: "/en/stockholm/opening-hours/" },
        { label: "How to find us", href: "/en/stockholm/how-to-find-us/" },
        { label: "Accessibility", href: "/en/stockholm/accessibility/" },
        { label: "FAQ", href: "/en/stockholm/faq/" },
      ],
    },
    {
      title: "The Experience",
      links: [
        { label: "What is ANDETAG?", href: "/en/stockholm/what-kind-of-experience/" },
        { label: "Romantic date", href: "/en/stockholm/date/" },
        { label: "NPF visitors", href: "/en/stockholm/neurodivergent-art/" },
        { label: "Art Yoga", href: "/en/stockholm/art-yoga/" },
        { label: "The Music", href: "/en/stockholm/music/" },
        { label: "Visitor reviews", href: "/en/stockholm/visitor-reviews/" },
      ],
    },
  ];

  const groupedSections: FooterGroupedSection[] = [
    {
      title: "Groups & business",
      links: [
        { label: "Group bookings / private events", href: "/en/stockholm/group-bookings/" },
        { label: "Corporate events", href: "/en/stockholm/corporate-events/" },
      ],
    },
    {
      title: "About",
      links: [
        { label: "About ANDETAG", href: "/en/stockholm/about-andetag/" },
        { label: "Artworks", href: "/en/stockholm/artworks/" },
        { label: "The Textile", href: "/en/stockholm/optical-fibre-textile/" },
        { label: "About the Artists", href: "/en/stockholm/about-the-artists-malin-gustaf-tadaa/" },
      ],
    },
  ];

  const seoLinks: FooterLink[] = [
    { label: "Activity", href: "/en/stockholm/indoor-activity-stockholm/" },
    { label: "Museum", href: "/en/stockholm/museum-stockholm/" },
    { label: "Things to do", href: "/en/stockholm/things-to-do-stockholm/" },
    { label: "Event", href: "/en/stockholm/event-stockholm/" },
    { label: "Exhibition", href: "/en/stockholm/exhibition-stockholm/" },
    { label: "Meditation", href: "/en/stockholm/meditation-stockholm/" },
  ];

  const socialLinks: FooterSocialLink[] = [
    { label: "Instagram", href: "https://www.instagram.com/andetag.museum", icon: "instagram" },
    { label: "Facebook", href: "https://www.facebook.com/andetag.museum", icon: "facebook" },
    { label: "Pinterest", href: "https://pinterest.com/malintadaa", icon: "pinterest" },
    { label: "Spotify", href: "/spotify/", icon: "spotify" },
  ];

  return {
    sections,
    groupedSections,
    seoLinks,
    copyright: "© 2026 Tadaa Art AB",
    privacyLink: { label: "Privacy policy", href: "/en/stockholm/privacy/" },
    consentPreferencesLabel: "Consent Preferences",
    socialLinks,
  };
}
