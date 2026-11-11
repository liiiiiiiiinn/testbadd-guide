export const FEATURES = {
  // false = metodstödet är dolt från startsida, navigation och
  // resultatsida. Sidorna nås fortfarande via direkt-URL.
  showGuideEntrypoints: false,

  // 'playbook' = statisk läsvy utan interaktivitet
  // 'interactive' = nuvarande ifyllnadsbara guide
  guideMode: "playbook" as "playbook" | "interactive",
};
