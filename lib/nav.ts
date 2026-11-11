export interface NavItem {
  href: string;
  label: string;
  match: (pathname: string) => boolean;
}

/**
 * De tre huvudmenyalternativen — exakt samma överallt i appen
 * (desktop-toppmeny och mobil bottennavigering), så att menyn
 * aldrig skiljer sig åt beroende på vilken sida man är på. Metodstöd
 * ligger alltid kvar i menyn — det är bara innehållet bakom länken
 * (playbook vs. interaktiv) som styrs av FEATURES.guideMode.
 */
export const NAV_ITEMS: NavItem[] = [
  {
    href: "/assess",
    label: "Bedöm förmåga",
    match: (p) => p.startsWith("/assess") && !p.startsWith("/assess/result"),
  },
  {
    href: "/guide/etablera",
    label: "Metodstöd",
    match: (p) => p.startsWith("/guide") || p.startsWith("/export"),
  },
  {
    href: "/assess/result",
    label: "Resultat",
    match: (p) => p.startsWith("/assess/result"),
  },
];
