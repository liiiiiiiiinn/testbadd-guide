# Koppling mellan appen och samordnarens Excelfil

Det här dokumentet beskriver radformatet och poängreglerna, så att appen
(`/lib/exportRow.ts`, `/lib/scoring.ts`, `/data/exportMap.ts`) och
samordnarens Excelfil kan hållas i takt om endera ändras.

## Excel-raden

Knappen "Kopiera som Excel-rad" på `/assess/result` bygger en enda,
tabbseparerad rad med **exakt 33 fält**, i denna ordning:

| # | Fält | Exempel |
|---|------|---------|
| 1 | Testbädd | `Testbädd Mobilitet` |
| 2 | Funktion | `Chef` |
| 3 | Datum (yyyy-mm-dd) | `2026-11-16` |
| 4 | Frågeversion | `2026-11-v1` |
| 5–11 | INF1–INF7 (Infrastruktur) | |
| 12–18 | MET1–MET7 (Metoder) | |
| 19–25 | MAN1–MAN7 (Människor och data) | |
| 26–32 | FOR1–FOR7 (Förvaltning) | |
| 33 | Kommentarer | `[INF3] text \| [MET1] text` |

Frågekoderna (INF1…FOR7) mappas mot de befintliga frågorna i
`data/assessment.ts`, i visningsordning — se `data/exportMap.ts`. Appens
egna fråge-ID:n i lagringen (`r1`, `y6` osv.) ändras aldrig; exportkoden
är bara en namngivning utåt.

**Cellvärden:**
- Skalfrågor (1–4): siffran som text, t.ex. `3`.
- Övriga frågor: exakt `Ja`, `Delvis`, `Nej`, `Vet ej` eller `Ej relevant`.
- En skalfråga där användaren valt "Vet ej" eller "Ej relevant" istället
  för ett skalvärde exporteras som den texten, inte som siffra.
- Obesvarat = tom cell (tabben finns ändå kvar, så kolumnerna hamnar rätt).
- Tabbar och radbrytningar i fritext (kommentarer) ersätts med mellanslag,
  så att de aldrig kan förskjuta kolumnerna.

## Poängregler

Samma regler används överallt i appen (resultatsida, spindeldiagram,
sammanfattning, export) via `/lib/scoring.ts` — enda källan för
poängsättning:

- Ja = 3 poäng
- Delvis = 2 poäng
- Nej = 0 poäng
- Vet ej = 0 poäng, **räknas med i nämnaren** (det är en kunskapslucka,
  inte en utesluten fråga)
- Ej relevant = **utesluts helt** (räknas varken i täljare eller nämnare)
- Obesvarad = utesluts helt
- Skalvärde 1/2/3/4 → 0/1/2/3 poäng

**Områdespoäng (%)** = (summa poäng) ÷ (3 × antal medräknade frågor) × 100.
Om samtliga frågor i ett område är uteslutna visas "–", inte 0 %.

**Totalpoäng** = samma beräkning över samtliga 28 frågor i alla fyra
områden.

**Mognadsnivå:**

| Intervall | Nivå |
|-----------|------|
| 0–20 % | Initialt |
| 21–40 % | Etablerat |
| 41–60 % | Definierat |
| 61–80 % | Hanterat |
| 81–100 % | Optimerande |

## Om frågebatteriet ändras

Höj `SITE.questionnaireVersion` i `/config/site.ts` (t.ex. till
`"2027-01-v2"`) så att samordnaren kan skilja mätningar från olika
versioner åt i Excelfilen. Om frågornas *antal eller ordning* inom ett
område ändras måste samordnarens Excelmall uppdateras i samma veva,
eftersom INF1…FOR7 bygger på positionen i `data/assessment.ts`.
