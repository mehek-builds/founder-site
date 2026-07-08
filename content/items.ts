export type Pillar = "ventures" | "inventions" | "leadership" | "content";

export interface Item {
  slug: string;
  title: string;
  pillar: Pillar;
  oneLiner: string;
  description: string;
  date: string; // YYYY-MM-DD, the day the square sits on
  end?: string;
  weight: 1 | 2 | 3 | 4;
  metrics?: { label: string; value: string }[];
  tech?: string[];
  links?: { label: string; url: string }[];
  image?: string;
}

export interface PillarDef {
  key: Pillar;
  repoName: string;
  description: string;
  language: { label: string; color: string };
  headlineMetric: string;
}

export const PILLARS: PillarDef[] = [
  {
    key: "ventures",
    repoName: "ventures",
    description: "Companies and client work with real money at stake.",
    language: { label: "Revenue", color: "#f1e05a" },
    headlineMetric: "5 live",
  },
  {
    key: "inventions",
    repoName: "inventions",
    description: "Products and tools shipped, roughly one a week.",
    language: { label: "TypeScript", color: "#3178c6" },
    headlineMetric: "11 shipped",
  },
  {
    key: "leadership",
    repoName: "leadership",
    description: "People, budgets, and programs led at USC.",
    language: { label: "People", color: "#e34c26" },
    headlineMetric: "120 students led",
  },
  {
    key: "content",
    repoName: "content",
    description: "Building in public as @mehek.builds.",
    language: { label: "Storytelling", color: "#da5b9f" },
    headlineMetric: "posting weekly",
  },
];

// Canonical numbers per the spec ledger (2026-07-08): Spark SC = $14K,
// VCA = 120 students. Client entries stay publish-safe: no deal terms.
export const ITEMS: Item[] = [
  {
    slug: "usc-aim-product-lead",
    title: "USC AIM product lead",
    pillar: "leadership",
    oneLiner: "Led a 4-person team through 6 design sprints.",
    description:
      "Product lead for the Einstein Bros. mobile ordering redesign inside USC's Association of Innovative Marketing: 35 user interviews, 350 surveys, and a checkout A/B test that lifted completion 9.6%.",
    date: "2024-08-26",
    end: "2024-12-15",
    weight: 2,
    metrics: [
      { label: "Team", value: "4 people" },
      { label: "Completion lift", value: "+9.6%" },
    ],
  },
  {
    slug: "vca-president",
    title: "Venture Capital Academy, president",
    pillar: "leadership",
    oneLiner: "USC's first student VC program: 120 students.",
    description:
      "Launched and led USC's first student venture capital program: 120 students through an 8-week sourcing and diligence curriculum, with Bay Area firm visits to Lightspeed, NEA, and Altos Ventures.",
    date: "2025-01-15",
    end: "2025-12-15",
    weight: 4,
    metrics: [
      { label: "Students", value: "120" },
      { label: "Curriculum", value: "8 weeks" },
      { label: "Mentors + VCs", value: "25+" },
    ],
  },
  {
    slug: "sofi-pm",
    title: "SoFi, product intern",
    pillar: "leadership",
    oneLiner: "Onboarding funnel analysis across 80K monthly signups.",
    description:
      "Operator role: analyzed the onboarding funnel for 80K monthly signups, identified the verification step as a 40% drop-off, and shipped research that contributed to a 15% retention improvement.",
    date: "2025-02-10",
    end: "2025-05-15",
    weight: 2,
    metrics: [{ label: "Retention", value: "+15%" }],
  },
  {
    slug: "traeco",
    title: "Traeco",
    pillar: "ventures",
    oneLiner: "First startup, wound down. The lessons fund everything since.",
    description:
      "AI cost visibility for engineering teams. Ran the full founder loop: user research, positioning, product. Wound down deliberately; the research corpus and instincts carry into every venture after it.",
    date: "2025-03-03",
    weight: 2,
  },
  {
    slug: "spark-sc-vp",
    title: "Spark SC, VP finance and sponsorships",
    pillar: "leadership",
    oneLiner: "$14K in sponsorships, $27K budget across 12 events.",
    description:
      "VP of finance for USC's entrepreneurship nonprofit: secured $14K across 7 sponsors, managed a $27K budget across 12 events, and improved sponsor renewal from 40% to 71% year over year.",
    date: "2025-05-20",
    weight: 3,
    metrics: [
      { label: "Sponsorships", value: "$14K" },
      { label: "Budget", value: "$27K" },
      { label: "Renewal", value: "40% → 71%" },
    ],
  },
  {
    slug: "cinematica-pm",
    title: "Cinematica Labs, program manager",
    pillar: "leadership",
    oneLiner: "24 mentor-founder pods; missed check-ins cut 18% to 7%.",
    description:
      "Ran mentor-founder matching across 24 pods, built an early-warning system that flagged 12 of 14 at-risk pairings, and drove a 14-point NPS increase over the summer.",
    date: "2025-06-10",
    end: "2025-08-15",
    weight: 3,
    metrics: [
      { label: "Pods", value: "24" },
      { label: "Missed check-ins", value: "18% → 7%" },
    ],
  },
  {
    slug: "tonee",
    title: "Tonee",
    pillar: "ventures",
    oneLiner: "AI texting tone detector. 100+ users in 8 weeks.",
    description:
      "Founded and shipped an AI tone detector for texting: model fine-tuning through iOS deployment, a Core ML migration that cut latency from 2.3s to 0.1s, and 8,300+ annotations from 47 user interviews.",
    date: "2025-09-15",
    weight: 3,
    metrics: [
      { label: "Users", value: "100+" },
      { label: "Latency", value: "2.3s → 0.1s" },
      { label: "Accuracy", value: "78% → 89%" },
    ],
    tech: ["Swift", "Core ML", "Python"],
  },
  {
    slug: "fitness-tracker",
    title: "Fitness tracker",
    pillar: "inventions",
    oneLiner: "HealthKit + GPT-4o food scans.",
    description:
      "Full health app: real HealthKit integration, GPT-4o + USDA food scanning, FastAPI backend with an Expo client.",
    date: "2025-12-05",
    weight: 2,
    tech: ["FastAPI", "Expo", "HealthKit"],
    links: [{ label: "Repo", url: "https://github.com/mehek-builds/fitness-tracker" }],
  },
  {
    slug: "hivemind",
    title: "HiveMind",
    pillar: "inventions",
    oneLiner: "Optimize it all.",
    description: "Optimization tooling in Python; one of the pinned public repos.",
    date: "2026-02-14",
    weight: 2,
    tech: ["Python"],
    links: [{ label: "Repo", url: "https://github.com/mehek-builds/HiveMind" }],
  },
  {
    slug: "buildsmart",
    title: "BuildSmart agency",
    pillar: "ventures",
    oneLiner: "AI agency with live clients and a cold-outreach engine.",
    description:
      "Founded an AI agency (cash track): live client engagements, a verified-contact outreach pipeline with deliverability engineering, and a daily automation that advances 10 net-new companies to send-ready.",
    date: "2026-05-12",
    weight: 4,
    links: [{ label: "Site", url: "https://buildsmartagency.com" }],
  },
  {
    slug: "creator-corpus",
    title: "Creator research corpus",
    pillar: "content",
    oneLiner: "20+ creator teardowns feeding the growth playbook to 1M.",
    description:
      "Deep teardowns of 20+ creators with platform roadmaps, benchmarks, and a gap analysis to 1M followers; the strategy layer under @mehek.builds.",
    date: "2026-05-25",
    weight: 2,
  },
  {
    slug: "graphify",
    title: "graphify",
    pillar: "inventions",
    oneLiner: "Any input becomes a knowledge graph.",
    description:
      "Code, docs, papers, or images in; clustered knowledge-graph communities out, with HTML output and an audit report. Used across the vault and codebases.",
    date: "2026-06-08",
    weight: 3,
    tech: ["Python"],
  },
  {
    slug: "g42-agent",
    title: "G42 AI agent",
    pillar: "inventions",
    oneLiner: "Three portal applications submitted ahead of deadline.",
    description:
      "Built and submitted an AI agent across three G42 portal applications with a live evaluation URL kept up through review week.",
    date: "2026-06-11",
    weight: 2,
  },
  {
    slug: "dubai-internship-tracker",
    title: "Dubai internship tracker",
    pillar: "inventions",
    oneLiner: "61 verified roles, self-updating daily.",
    description:
      "Live tracker of 61 verified Dubai roles with pay estimates, priority buckets, and a weekday agent that re-verifies on employer ATS pages and redeploys itself.",
    date: "2026-06-12",
    weight: 2,
    links: [{ label: "Live", url: "https://dubai-internship-tracker.vercel.app" }],
  },
  {
    slug: "build-in-public",
    title: "Build-in-public engine",
    pillar: "content",
    oneLiner: "@mehek.builds: one product a week, documented.",
    description:
      "The audience engine: build-in-public content targeting US startup and AI-builder audiences, with a timed posting system and weekly shoot batches.",
    date: "2026-06-16",
    weight: 3,
    links: [{ label: "X", url: "https://x.com/MehekBuilds" }],
  },
  {
    slug: "icra-validator",
    title: "ICRA rationale validator",
    pillar: "ventures",
    oneLiner: "9 real rating docs validated, 0 false positives.",
    description:
      "Validation web app for a credit rating agency: upload a rationale PDF, extract claims, run deterministic checks, highlight discrepancies with one-click fixes and an audit trail.",
    date: "2026-06-18",
    weight: 3,
    metrics: [
      { label: "Docs validated", value: "9" },
      { label: "False positives", value: "0" },
    ],
    links: [{ label: "Live", url: "https://icra-validator.vercel.app" }],
  },
  {
    slug: "letterstory",
    title: "LetterStory engagement",
    pillar: "ventures",
    oneLiner: "Paid trial: 651 leads sourced, outreach console shipped.",
    description:
      "Paid engagement for a NYC dev-tools startup: sourced and quality-gated 651 Series A-C leads, built the verification pipeline, and shipped a branded outreach console for review and bulk send.",
    date: "2026-06-20",
    weight: 3,
    metrics: [
      { label: "Leads sourced", value: "651" },
      { label: "Blog-gate pass", value: "370" },
    ],
  },
  {
    slug: "upwork-sniper",
    title: "Upwork Sniper",
    pillar: "inventions",
    oneLiner: "Scrapes 20 searches every 2h, scores jobs, drafts proposals.",
    description:
      "A dashboard that scrapes 20 search terms every two hours, scores jobs against a playbook, drafts proposals with Claude, and fills application forms with Playwright.",
    date: "2026-06-25",
    weight: 3,
    links: [{ label: "Live", url: "https://upwork-sniper.vercel.app" }],
  },
  {
    slug: "pead-system",
    title: "PEAD trading system",
    pillar: "ventures",
    oneLiner: "Event-driven quant system with an operator dashboard.",
    description:
      "A post-earnings-announcement-drift trading system: research, signals, and an 8-view operator dashboard with live updates. Systems engineering applied to markets.",
    date: "2026-06-29",
    weight: 3,
    links: [{ label: "Dashboard", url: "https://pead-dashboard.vercel.app" }],
  },
  {
    slug: "goal-journal",
    title: "Goal Journal",
    pillar: "inventions",
    oneLiner: "Bullet-journal habit tracker, 12 roadmap goals as colors.",
    description:
      "A bullet-journal-style habit tracker mapping 12 long-horizon goals to daily check-offs, with a spreadsheet Grid view.",
    date: "2026-07-01",
    weight: 2,
    links: [{ label: "Live", url: "https://goal-bujo.vercel.app" }],
  },
  {
    slug: "kodecrafts",
    title: "KodeCrafts engagement",
    pillar: "ventures",
    oneLiner: "Upwork qualification + application system for an agency client.",
    description:
      "Client engagement: designed a qualification and application system for a dev agency's Upwork pipeline, reusing the Upwork Sniper architecture with a 3-hour scan cadence.",
    date: "2026-07-02",
    weight: 2,
  },
  {
    slug: "rolequick",
    title: "RoleQuick / Volley",
    pillar: "ventures",
    oneLiner: "Chrome extension + dashboard: autofill, resume gen, store-listed.",
    description:
      "Job application copilot: a Chrome Web Store extension that answers every application question, generates tailored resumes, plus a full product dashboard and cinematic marketing site.",
    date: "2026-07-04",
    weight: 4,
    metrics: [{ label: "Distribution", value: "Chrome Web Store" }],
    links: [{ label: "Site", url: "https://role-quick-website.vercel.app" }],
  },
];
