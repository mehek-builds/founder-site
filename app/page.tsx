import { readFileSync } from "node:fs";
import { join } from "node:path";
import Header from "@/components/Header";
import Tabs from "@/components/Tabs";
import Sidebar from "@/components/Sidebar";
import Octicon from "@/components/Octicon";
import { ITEMS, PILLARS } from "@/content/items";

const MN = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

interface ActivityDay {
  date: string;
  count: number;
}

function readActivity(): Map<string, number> {
  try {
    const raw = readFileSync(join(process.cwd(), "content", "activity.json"), "utf8");
    const parsed = JSON.parse(raw) as { days: ActivityDay[] };
    return new Map(parsed.days.map((d) => [d.date, d.count]));
  } catch {
    return new Map();
  }
}

function iso(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
}

// Deterministic per-day hash (stable across builds; no Math.random).
function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

// Map a real activity count to a base green shade, spread across 1-4 using the
// day hash so equal counts don't all render the same. Real work only: a day
// with zero logged activity stays empty (weight 0).
function baseShade(count: number, key: string): number {
  if (count <= 0) return 0;
  const j = hash(key);
  if (count === 1) return 1 + (j % 2); // 1-2
  if (count === 2) return 2 + (j % 2); // 2-3
  return 3 + (j % 2); // 3-4
}

export default function Page() {
  const activity = readActivity();
  const itemsByDate = new Map(ITEMS.map((it) => [it.date, it]));

  const end = new Date();
  const start = new Date(end);
  start.setFullYear(end.getFullYear() - 1);
  start.setDate(start.getDate() - start.getDay());

  const weeks = 53;
  const cells: { date: string; label: string; weight: number; item?: string; pillar?: string }[] = [];
  const monthCols: { wk: number; label: string }[] = [];
  let lastMonth = -1;
  for (let wk = 0; wk < weeks; wk++) {
    const d0 = new Date(start);
    d0.setDate(d0.getDate() + wk * 7);
    if (d0.getMonth() !== lastMonth) {
      lastMonth = d0.getMonth();
      monthCols.push({ wk, label: MN[lastMonth] });
    }
  }
  let total = 0;
  for (let wk = 0; wk < weeks; wk++) {
    for (let dy = 0; dy < 7; dy++) {
      const d = new Date(start);
      d.setDate(d.getDate() + wk * 7 + dy);
      if (d > end) {
        cells.push({ date: "", label: "", weight: -1 });
        continue;
      }
      const key = iso(d);
      const label = `${MN[d.getMonth()]} ${d.getDate()}${
        d.getFullYear() !== end.getFullYear() ? `, ${d.getFullYear()}` : ""
      }`;
      const item = itemsByDate.get(key);
      if (item) {
        total++;
        cells.push({
          date: key,
          label,
          weight: Math.max(item.weight, 2),
          item: item.slug,
          pillar: item.pillar,
        });
        continue;
      }
      const count = activity.get(key) ?? 0;
      if (count > 0) total++;
      cells.push({ date: key, label, weight: baseShade(count, key) });
    }
  }

  // Anti-clump pass: no connected triple of touching cells may share a shade.
  // Cells are column-major (index = wk*7 + dy): up = index-1 (same week),
  // down = index+1, left = index-7 (same weekday, prior week), right = index+7.
  // A green cell is checked against every direction so it never completes a
  // straight run of three or an L-triple around any neighbor, INCLUDING a fixed
  // item square (which keeps its real weight, so its movable arms must yield).
  // Empty cells never move.
  const at = (i: number) => (i >= 0 && i < cells.length ? cells[i]?.weight : undefined);
  // Does putting shade w at index i complete a connected same-shade triple?
  const forms = (i: number, w: number) => {
    const dy = i % 7;
    const up = dy > 0 ? at(i - 1) : undefined;
    const up2 = dy > 1 ? at(i - 2) : undefined;
    const down = dy < 6 ? at(i + 1) : undefined;
    const down2 = dy < 5 ? at(i + 2) : undefined;
    const left = at(i - 7);
    const left2 = at(i - 14);
    const right = at(i + 7);
    const right2 = at(i + 14);
    const eq = (a: number | undefined) => a === w;
    // straight runs of three centered anywhere through this cell
    if ((eq(up) && eq(up2)) || (eq(down) && eq(down2))) return true;
    if ((eq(left) && eq(left2)) || (eq(right) && eq(right2))) return true;
    if (eq(up) && eq(down)) return true;
    if (eq(left) && eq(right)) return true;
    // L-triples: this cell plus one vertical and one horizontal neighbor
    if ((eq(up) || eq(down)) && (eq(left) || eq(right))) return true;
    return false;
  };
  // Two sweeps: the second lets a cell react to a neighbor moved in the first.
  for (let pass = 0; pass < 2; pass++) {
    for (let i = 0; i < cells.length; i++) {
      const c = cells[i];
      if (c.item || c.weight <= 0) continue;
      if (!forms(i, c.weight)) continue;
      for (const w of [c.weight + 1, c.weight - 1, c.weight + 2, c.weight - 2]) {
        if (w >= 1 && w <= 4 && !forms(i, w)) {
          c.weight = w;
          break;
        }
      }
    }
  }

  const recent = [...ITEMS].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 6);

  return (
    <>
      <Header />
      <Tabs />
      <div className="layout">
        <Sidebar />
        <main className="main">
          <section className="readme">
            <div className="path">mehek-builds / README.md</div>
            <p>
              I&apos;m a founder studying CS + Business at USC (top 1% of class,
              on a full-tuition merit scholarship). I run an AI agency, ship a
              product roughly every week, and document all of it in public.
            </p>
            <p>
              This page works like a contribution graph, because that&apos;s how
              I think about a career: green squares, every week, compounding.
              Hover a pinned card to see one thread; click a square to read the
              receipt.
            </p>
          </section>

          <div className="row-title">
            <span>Popular repositories</span>
            <span className="quiet">Customize your pins</span>
          </div>
          <div className="cards" id="pillars">
            {PILLARS.map((p) => (
              <div className="card" key={p.key} data-pillar={p.key}>
                <div className="name-row">
                  <span className="name">
                    <Octicon name="repo" size={16} />
                    {p.repoName}
                  </span>
                  <span className="visibility">Public</span>
                </div>
                <div className="desc">{p.description}</div>
                <div className="lang">
                  <span className="dot" style={{ background: p.language.color }} />
                  {p.language.label}
                  <span style={{ marginLeft: 12, display: "inline-flex", alignItems: "center", gap: 4 }}>
                    <Octicon name="star" size={14} />
                    {p.headlineMetric}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="contrib-head" id="grid">
            <h2>{total} contributions in the last year</h2>
            <div className="controls">
              <span>
                Contribution settings{" "}
                <svg viewBox="0 0 16 16" width="12" height="12" fill="currentColor" aria-hidden="true" style={{ verticalAlign: "-1px" }}>
                  <path d="m4.427 7.427 3.396 3.396a.25.25 0 0 0 .354 0l3.396-3.396A.25.25 0 0 0 11.396 7H4.604a.25.25 0 0 0-.177.427Z" />
                </svg>
              </span>
              <button className="year-btn active">2026</button>
              <button className="year-btn">2025</button>
            </div>
          </div>
          <div className="graph-box">
            <div className="graph-scroll">
              <div
                className="graph-months"
                style={{ gridTemplateColumns: `repeat(${weeks}, 13px)` }}
              >
                {monthCols.map((m, i) => {
                  const next = i + 1 < monthCols.length ? monthCols[i + 1].wk : weeks;
                  return (
                    <span key={`${m.label}-${m.wk}`} style={{ gridColumn: `${m.wk + 1} / ${next + 1}` }}>
                      {next - m.wk >= 3 ? m.label : ""}
                    </span>
                  );
                })}
              </div>
              <div className="graph-body">
                <div className="graph-days">
                  <span />
                  <span>Mon</span>
                  <span />
                  <span>Wed</span>
                  <span />
                  <span>Fri</span>
                  <span />
                </div>
                <div className="graph-grid">
                  {cells.map((c, i) =>
                    c.weight < 0 ? (
                      <div key={i} style={{ width: 10, height: 10 }} />
                    ) : (
                      <div
                        key={i}
                        className={`sq${c.item ? " item" : ""}`}
                        data-w={c.weight > 0 ? c.weight : undefined}
                        data-item={c.item}
                        data-pillar={c.pillar}
                        title={c.item ? `${c.label}: ${ITEMS.find((x) => x.slug === c.item)?.title}` : c.label}
                      />
                    )
                  )}
                </div>
              </div>
            </div>
            <div className="graph-foot">
              <span>Learn how we count contributions</span>
              <span className="legend">
                Less
                <span className="sq" />
                <span className="sq" data-w="1" />
                <span className="sq" data-w="2" />
                <span className="sq" data-w="3" />
                <span className="sq" data-w="4" />
                More
              </span>
            </div>
          </div>

          <section className="activity">
            <h2>Contribution activity</h2>
            <p className="hint" style={{ marginBottom: 8 }}>
              Latest ships. Interactive filtering lands in the next build phase.
            </p>
            {recent.map((it) => (
              <div className="entry" key={it.slug} id={it.slug}>
                <span className="sq" data-w={it.weight} />
                {it.title}
                <span style={{ color: "var(--fg-muted)" }}> · {it.oneLiner}</span>
              </div>
            ))}
          </section>
        </main>
      </div>
    </>
  );
}
