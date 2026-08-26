"use client";

import Link from "next/link";
import { CAPACITY_AREAS, type TrackId } from "@/lib/types";
import { findCapacityStep, tracks } from "@/data/playbook";
import { useChecks } from "@/lib/storage";
import TopNavLinks from "./TopNavLinks";
import Breadcrumb from "./Breadcrumb";

const PHASE_TRACKS: TrackId[] = ["etablera", "driva", "skala"];
const MAX_RATING = 4;

function average(values: number[]): number | null {
  if (values.length === 0) return null;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

export default function CapacityDashboard() {
  const etableraChecks = useChecks("etablera");
  const drivaChecks = useChecks("driva");
  const skalaChecks = useChecks("skala");
  const checksByTrack: Record<TrackId, ReturnType<typeof useChecks>["checks"]> = {
    etablera: etableraChecks.checks,
    driva: drivaChecks.checks,
    skala: skalaChecks.checks,
  };

  const scores = CAPACITY_AREAS.map((area) => {
    const perTrack = PHASE_TRACKS.map((trackId) => {
      const step = findCapacityStep(trackId, area.id);
      if (!step || !step.measurementAreas) {
        return { trackId, value: null as number | null };
      }
      const totalPoints = step.measurementAreas.reduce(
        (sum, a) => sum + a.points.length,
        0
      );
      const stepChecks = checksByTrack[trackId][step.id] ?? {};
      const rated = Array.from({ length: totalPoints }, (_, i) => stepChecks[i]).filter(
        (v): v is number => !!v
      );
      return { trackId, value: average(rated) };
    });
    return { area, perTrack };
  });

  return (
    <div className="min-h-screen bg-page">
      <header className="border-b border-line">
        <div className="max-w-4xl mx-auto px-6 py-5 flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2">
            <span className="inline-block h-3 w-3 rounded-[3px] bg-brand" aria-hidden />
            <span className="text-[17px] font-semibold text-brand">
              Testbäddsguiden
            </span>
          </Link>
          <div className="flex items-center gap-6">
            <TopNavLinks />
            <nav className="flex items-center gap-4 text-sm text-muted">
              {PHASE_TRACKS.map((trackId) => (
                <Link
                  key={trackId}
                  href={`/guide/${trackId}`}
                  className="hover:text-ink transition-colors"
                >
                  {tracks[trackId].meta.shortName}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 pt-4 pb-24 md:pb-12 flex flex-col gap-10">
        <Breadcrumb items={[{ label: "Start", href: "/" }, { label: "Kapacitetsöversikt" }]} />
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-medium text-ink">Kapacitetsöversikt</h1>
          <p className="text-sm text-muted leading-relaxed max-w-xl">
            Samma fyra förmågeområden bedöms i alla tre faser. Här ser ni hur
            era självskattningar (1–4) för respektive område utvecklas från
            att etablera, till att driva, till att skala testbädden.
          </p>
        </div>

        <div className="flex items-center gap-5 text-xs text-muted">
          {PHASE_TRACKS.map((trackId) => (
            <span key={trackId} className="inline-flex items-center gap-1.5">
              <span
                className="inline-block h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: tracks[trackId].meta.color }}
                aria-hidden
              />
              {tracks[trackId].meta.name}
            </span>
          ))}
        </div>

        <div className="flex flex-col gap-8 bg-card border border-line rounded-md px-6 py-6">
          {scores.map(({ area, perTrack }) => (
            <div key={area.id} className="flex flex-col gap-3">
              <p className="text-sm font-medium text-ink">{area.name}</p>
              <div className="flex flex-col gap-2">
                {perTrack.map(({ trackId, value }) => {
                  const meta = tracks[trackId].meta;
                  const pct = value ? (value / MAX_RATING) * 100 : 0;
                  return (
                    <div key={trackId} className="flex items-center gap-3">
                      <span className="text-xs text-muted w-16 shrink-0">
                        {meta.shortName}
                      </span>
                      <div className="relative flex-1 h-4">
                        <div
                          className="absolute inset-y-0 left-0 right-0 flex"
                          aria-hidden
                        >
                          {[1, 2, 3, 4].map((tick) => (
                            <div
                              key={tick}
                              className="flex-1 border-r border-black/[0.06] last:border-r-0"
                            />
                          ))}
                        </div>
                        {value !== null && (
                          <div
                            className="absolute inset-y-0 left-0 rounded-r-[4px] transition-all duration-500"
                            style={{
                              width: `${pct}%`,
                              backgroundColor: meta.color,
                            }}
                          />
                        )}
                      </div>
                      <span className="text-xs text-ink w-24 shrink-0 tabular-nums">
                        {value !== null ? `${value.toFixed(1)} / 4` : "Ej bedömt"}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          <h2 className="text-sm font-medium text-ink">Som tabell</h2>
          <div className="overflow-x-auto border border-line rounded-md">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-line bg-black/[0.02]">
                  <th className="text-left font-medium text-ink px-4 py-2.5">
                    Kapacitetsområde
                  </th>
                  {PHASE_TRACKS.map((trackId) => (
                    <th
                      key={trackId}
                      className="text-left font-medium text-ink px-4 py-2.5"
                    >
                      {tracks[trackId].meta.shortName}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {scores.map(({ area, perTrack }) => (
                  <tr key={area.id} className="border-b border-line last:border-b-0">
                    <td className="px-4 py-2.5 text-ink">{area.name}</td>
                    {perTrack.map(({ trackId, value }) => (
                      <td key={trackId} className="px-4 py-2.5 text-ink tabular-nums">
                        {value !== null ? value.toFixed(1) : "–"}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="text-xs text-muted bg-card border border-line rounded-md px-5 py-4">
          Betygen kommer från mätpunkterna i respektive spårs steg för
          infrastruktur, arbetssätt/metoder, population/data och
          förvaltning/samverkan. Bedöm mätpunkterna i ett steg för att de ska
          synas här.
        </div>
      </main>
    </div>
  );
}
