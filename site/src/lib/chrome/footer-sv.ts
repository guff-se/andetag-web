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
        { label: "Biljetter", href: "/sv/stockholm/biljetter/" },
        { label: "Säsongskort", href: "/sv/stockholm/sasongskort/" },
        { label: "Presentkort", href: "/sv/stockholm/presentkort/" },
        { label: "Öppettider", href: "/sv/stockholm/oppettider/" },
        { label: "Hitta hit", href: "/sv/stockholm/hitta-hit/" },
        { label: "Tillgänglighet", href: "/sv/stockholm/tillganglighet/" },
        { label: "FAQ", href: "/sv/stockholm/fragor-svar/" },
      ],
    },
    {
      title: "Upplevelsen",
      links: [
        { label: "Hur är ANDETAG?", href: "/sv/stockholm/vilken-typ-av-upplevelse/" },
        { label: "Dejt", href: "/sv/stockholm/dejt/" },
        { label: "NPF-besökare", href: "/sv/stockholm/npf-stockholm/" },
        { label: "Art Yoga", href: "/sv/stockholm/art-yoga/" },
        { label: "Musiken", href: "/sv/stockholm/musik/" },
        { label: "Besökaromdömen", href: "/sv/stockholm/besokaromdomen/" },
      ],
    },
  ];

  const groupedSections: FooterGroupedSection[] = [
    {
      title: "Grupper & företag",
      links: [
        { label: "Gruppbokningar / privata evenemang", href: "/sv/stockholm/gruppbokning/" },
        { label: "Företagsevent", href: "/sv/stockholm/foretagsevent/" },
      ],
    },
    {
      title: "Om",
      links: [
        { label: "Om Andetag", href: "/sv/stockholm/om-andetag/" },
        { label: "Textilen", href: "/sv/stockholm/optisk-fibertextil/" },
        { label: "Om konstnärerna", href: "/sv/stockholm/om-konstnarerna-malin-gustaf-tadaa/" },
      ],
    },
  ];

  const seoLinks: FooterLink[] = [
    { label: "Aktivitet", href: "/sv/stockholm/aktivitet-inomhus-stockholm/" },
    { label: "Museum", href: "/sv/stockholm/museum-stockholm/" },
    { label: "Att göra", href: "/sv/stockholm/att-gora-stockholm/" },
    { label: "Utställning", href: "/sv/stockholm/utstallning-stockholm/" },
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
    privacyLink: { label: "Integritetspolicy", href: "/sv/stockholm/privacy/" },
    consentPreferencesLabel: "Cookieinställningar",
    socialLinks,
  };
}
