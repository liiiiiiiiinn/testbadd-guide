export const FEATURES = {
  // false = metodstödets kort på startsidan och kopplingskortet på
  // resultatsidan är dolda. Menyn (Metodstöd) visas alltid — det är
  // bara dessa två extra genvägar som styrs av flaggan.
  showGuideEntrypoints: false,

  // 'playbook' = statisk läsvy utan interaktivitet
  // 'interactive' = nuvarande ifyllnadsbara guide
  guideMode: "playbook" as "playbook" | "interactive",
};
