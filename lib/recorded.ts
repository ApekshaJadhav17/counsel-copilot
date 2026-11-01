// Recorded runs used by the "Replay recorded run" buttons. Written in advance; no model call.
import { BENCHMARKS, TEMPLATES } from "./data";
import type { CopilotOut, LaunchOut, ScoperOut, TraceStep } from "./types";

export const REC_COPILOT: { trace: TraceStep[]; out: CopilotOut } = {
  trace: [
    { tool: "check_conflicts", args: { names: ["Lumen Health", "Harbor Point Health System", "Maya Chen"] }, result: { matches: [{ name: "Harbor Point Health System", relation: "former client", matter: "Employment policy review", closed: "2023-11" }] } },
    { tool: "get_rate_benchmarks", args: { practice_area: "commercial contracts", state: "NY" }, result: BENCHMARKS["commercial contracts|NY"] },
    { tool: "search_templates", args: { query: "hybrid flat fee subscription engagement letter healthcare" }, result: [TEMPLATES[3], TEMPLATES[0], TEMPLATES[2]] },
  ],
  out: {
    conflict: { status: "caution", detail: "Harbor Point Health System, the counterparty on the MSA, is a former client (employment policy review, closed Nov 2023). Under ABA Model Rule 1.9 the new matter does not look substantially related, but confirm that, check what confidential information you hold, and consider disclosing the prior work to Lumen before engaging." },
    fee: { model: "Flat fee, then monthly subscription", headline: "$3,000 flat + $3,500/month", detail: "$3,000 flat for the Harbor Point MSA and BAA (sample NY band: $2,500 to $4,000 for an MSA, $750 to $1,500 for a BAA). Then $3,500/month for up to 10 contract reviews, just under the sample NY subscription median of $3,800 to suit a seed-stage budget." },
    template: { id: "T-061", name: "Hybrid flat fee + subscription engagement letter", why: "Matches the two-phase structure; T-203 added as the BAA review checklist." },
    letter: "Dear Ms. Chen,\n\nThank you for asking Okafor Counsel PLLC to represent Lumen Health, Inc. This letter sets out the terms of our engagement.\n\n1. Scope. Phase 1: review and negotiation of the Master Services Agreement and Business Associate Agreement proposed by Harbor Point Health System. Phase 2: ongoing review of customer and vendor contracts, up to 10 agreements per month.\n\n2. Fees. Phase 1 is a flat fee of $3,000, due on signing. Phase 2 is $3,500 per month, billed in advance, beginning when Phase 1 closes. Work beyond 10 agreements in a month is billed at $425 per hour with your prior approval.\n\n3. Prior representation. I previously represented Harbor Point Health System on an unrelated employment policy matter that closed in November 2023. I do not believe it limits my ability to represent Lumen, and I will not use any confidential information from that matter.\n\n4. Termination. Either party may end Phase 2 on 30 days' written notice.\n\nPlease sign below if these terms work for you.\n\nSincerely,\nDana Okafor",
    email: "Hi Maya,\n\nThanks for reaching out, and thanks to Priya for the intro. I can take on the Harbor Point MSA and BAA and then support your contracts after that.\n\nShort version: $3,000 flat for Harbor Point, then $3,500 a month for up to 10 contracts. The engagement letter is attached. One thing to flag: I did unrelated work for Harbor Point in 2023, which the letter explains.\n\nIf you can sign by Thursday, I'll have first comments on the MSA back to you by Monday, well ahead of the 20th.\n\nBest,\nDana",
  },
};

export const REC_SCOPER: ScoperOut = {
  summary: "Series B SaaS company (40 people, Austin) needs two things fast: multi-state hiring compliance for new California and New York employees, and review of an EU customer's data processing agreement. With no lawyer in place, it would also benefit from ongoing fractional GC support.",
  practice_areas: ["Employment", "Data privacy (GDPR)", "General corporate"],
  jurisdictions: ["California", "New York", "Texas", "EU (GDPR)"],
  urgency: "high",
  engagement_type: "Two flat-fee projects now, fractional GC after",
  scope_items: ["Review and negotiate the EU customer DPA, including transfer mechanism (SCCs)", "CA and NY offer letters, wage and hour rules, required notices and payroll registration", "Handbook addenda for CA and NY", "Optional: fractional GC for ongoing contracts and questions"],
  budget: [{ item: "DPA review", range: "$1,500 to $3,000 flat" }, { item: "CA + NY hiring compliance", range: "$4,000 to $8,000 flat" }, { item: "Fractional GC (optional)", range: "$3,000 to $6,000 per month" }],
  questions: ["Is the DPA on the customer's paper, and does it already include Standard Contractual Clauses?", "How many hires per state, and are any contractors rather than employees?", "When does the EU customer want to sign?"],
  matches: [
    { id: "m02", fit: 93, reason: "Admitted in CA and NY and focuses on multi-state hiring; handles exactly the employment half of the request." },
    { id: "m03", fit: 90, reason: "Privacy specialist with GDPR and DPA flat-fee work; CIPP/E. Covers the EU customer agreement." },
    { id: "m12", fit: 82, reason: "Texas-admitted fractional GC for startups; natural ongoing counsel once the two urgent projects close." },
  ],
  team_up: "Elena Vargas (employment) and Marcus Lee (EU DPA) run the two urgent projects in parallel; Grace Kim joins as fractional GC afterward.",
};

export const REC_LAUNCH: LaunchOut = {
  positioning: "Fractional tech-transactions counsel for seed to Series B SaaS companies: Big Law contract quality, startup-speed turnaround, privacy-fluent.",
  pricing: {
    hourly: { amount: "$450/hour", note: "Near the sample CA tech-transactions median ($475). Keep it mainly as the overage rate." },
    flat: [{ item: "SaaS terms package (MSA, order form, DPA)", price: "$4,000" }, { item: "Customer contract review", price: "$1,000" }, { item: "Privacy policy and DPA", price: "$2,500" }],
    subscription: { price: "$3,000/month", includes: "Up to 8 contract reviews, Slack access, 2-business-day turnaround" },
  },
  math: "6 subscription clients x $3,000 x 12 = $216,000, plus about $84,000 of flat-fee projects (roughly 2 a month) = $300,000.",
  plan: [
    { window: "Days 1 to 30", tasks: ["Form the PC, buy malpractice insurance and open a trust account before taking any work", "Run a conflicts check on former firm clients you plan to approach (Rule 1.9)", "Publish the three flat-fee packages and the subscription on a one-page site", "Tell 30 former colleagues and in-house contacts you are open for work"] },
    { window: "Days 31 to 60", tasks: ["Land the first 2 subscription clients from warm intros", "Turn your firm's precedents into your own clean templates", "Join two referral partnerships with complementary members", "Post one practical SaaS contracting note a week on LinkedIn"] },
    { window: "Days 61 to 90", tasks: ["Reach 4 subscription clients and 2 flat-fee projects a month", "Add a contract-review AI workflow to keep turnaround at 2 days", "Review margins against peer benchmarks and adjust the subscription cap", "Apply to the HeyCounsel community for referrals and overflow work"] },
  ],
  peers: [
    { id: "m04", why: "Same lane and further along: a source of overflow work and pricing advice." },
    { id: "m03", why: "Privacy specialist: refer GDPR-heavy DPAs out, get SaaS contract work back." },
    { id: "m06", why: "Venture lawyer whose formation and SAFE clients need commercial contracts next." },
  ],
  watchouts: ["Do not start work before insurance and engagement letters are in place.", "Former firm clients may raise conflicts; check before you pitch them.", "Refer employment and fundraising questions out rather than stretching your scope."],
};
