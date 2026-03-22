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

export function getSwedishFooterModel() {
  const sections: FooterSection[] = [
    {
      title: "Besök ANDETAG",
      links: [
        { label: "Biljetter", href: "/stockholm/biljetter/" },
        { label: "Säsongskort", href: "/stockholm/sasongskort/" },
        { label: "Presentkort", href: "/stockholm/presentkort/" },
        { label: "Öppettider", href: "/stockholm/oppettider/" },
        { label: "Hitta hit", href: "/stockholm/hitta-hit/" },
        { label: "Tillgänglighet", href: "/stockholm/tillganglighet/" },
        { label: "FAQ", href: "/stockholm/fragor-svar/" },
      ],
    },
    {
      title: "Upplevelsen",
      links: [
        { label: "Hur är ANDETAG?", href: "/stockholm/vilken-typ-av-upplevelse/" },
        { label: "Dejt", href: "/stockholm/dejt/" },
        { label: "NPF-besökare", href: "/stockholm/npf-stockholm/" },
        { label: "Art Yoga", href: "/stockholm/art-yoga/" },
        { label: "Musiken", href: "/musik/" },
        { label: "Besökaromdömen", href: "/stockholm/besokaromdomen/" },
      ],
    },
  ];

  const groupedSections: FooterGroupedSection[] = [
    {
      title: "Grupper & företag",
      links: [
        { label: "Gruppbokningar / privata evenemang", href: "/stockholm/gruppbokning/" },
        { label: "Företagsevent", href: "/stockholm/foretagsevent/" },
      ],
    },
    {
      title: "Om",
      links: [
        { label: "Om Andetag", href: "/om-andetag/" },
        { label: "Textilen", href: "/optisk-fibertextil/" },
        { label: "Om konstnärerna", href: "/om-konstnarerna-malin-gustaf-tadaa/" },
      ],
    },
  ];

  const seoLinks: FooterLink[] = [
    { label: "Aktivitet", href: "/stockholm/aktivitet-inomhus-stockholm/" },
    { label: "Museum", href: "/stockholm/museum-stockholm/" },
    { label: "Att göra", href: "/stockholm/att-gora-stockholm/" },
    { label: "Utställing", href: "/stockholm/utstallning-stockholm/" },
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
    privacyLink: { label: "Integritetspolicy", href: "/privacy/" },
    socialLinks,
  };
}
