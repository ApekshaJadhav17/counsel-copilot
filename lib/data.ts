// All people, firms, clients, rates and templates here are SAMPLE data invented for the demo.
// Only the figures in PUBLIC_PULSE come from HeyCounsel's public Pulse report (Summer 2026).

export type Member = {
  id: string; name: string; firm: string; areas: string[]; bars: string[];
  years: number; background: string; engagements: string[]; rate: number;
};

export const DIRECTORY: Member[] = [
  { id: "m01", name: "Dana Okafor", firm: "Okafor Counsel PLLC", areas: ["Commercial contracts", "Health privacy (HIPAA)"], bars: ["NY", "NJ"], years: 14, background: "Former in-house counsel at a health-tech company", engagements: ["Fractional GC", "Subscription"], rate: 425 },
  { id: "m02", name: "Elena Vargas", firm: "Vargas Employment Law", areas: ["Employment", "Multi-state hiring", "Handbooks"], bars: ["CA", "NY", "TX"], years: 12, background: "Former employment associate at a large firm", engagements: ["Project", "Hourly"], rate: 450 },
  { id: "m03", name: "Marcus Lee", firm: "Lee Privacy Counsel", areas: ["Data privacy", "GDPR and DPAs", "CCPA"], bars: ["NY", "DC"], years: 11, background: "Former privacy counsel at a public SaaS company; CIPP/E", engagements: ["Flat fee", "Subscription"], rate: 500 },
  { id: "m04", name: "Priya Raman", firm: "Raman Tech Law", areas: ["Tech transactions", "SaaS agreements", "Licensing"], bars: ["CA"], years: 16, background: "Former GC at a Series D software company", engagements: ["Subscription", "Fractional GC"], rate: 475 },
  { id: "m05", name: "Tom Becker", firm: "Becker Deal Counsel", areas: ["M&A", "Small business sales"], bars: ["IL", "WI"], years: 20, background: "Former M&A partner", engagements: ["Hourly", "Project"], rate: 550 },
  { id: "m06", name: "Aisha Grant", firm: "Grant Venture Law", areas: ["Corporate and venture", "Formation", "SAFEs and Series A"], bars: ["TX", "CA"], years: 9, background: "Former venture associate", engagements: ["Flat fee"], rate: 395 },
  { id: "m07", name: "Jonah Feld", firm: "Feld Disputes", areas: ["Commercial litigation", "Demand letters"], bars: ["NY"], years: 18, background: "Former litigation counsel", engagements: ["Hourly", "Contingency"], rate: 600 },
  { id: "m08", name: "Sofia Marino", firm: "Marino IP", areas: ["Trademarks", "Open-source compliance"], bars: ["MA", "NY"], years: 10, background: "Former IP associate", engagements: ["Flat fee"], rate: 375 },
  { id: "m09", name: "Walter Osei", firm: "Osei Benefits Law", areas: ["ERISA", "Employee benefits"], bars: ["IL", "NY"], years: 22, background: "Former benefits partner", engagements: ["Hourly"], rate: 525 },
  { id: "m10", name: "Lena Hoffmann", firm: "Hoffmann Cross-Border", areas: ["EU data protection", "Cross-border commercial"], bars: ["NY", "Germany"], years: 13, background: "Admitted in Germany and New York", engagements: ["Flat fee", "Hourly"], rate: 450 },
  { id: "m11", name: "Ryan Ortiz", firm: "Ortiz Regulatory", areas: ["Fintech regulation", "Payments compliance"], bars: ["NY", "CA"], years: 15, background: "Former regulatory counsel at a payments company", engagements: ["Subscription"], rate: 500 },
  { id: "m12", name: "Grace Kim", firm: "Kim Startup Counsel", areas: ["Fractional GC", "General corporate", "Contracts", "Employment basics"], bars: ["TX", "CO"], years: 12, background: "Former GC at two venture-backed startups", engagements: ["Fractional GC", "Subscription"], rate: 400 },
];

export const DANA_CLIENTS = [
  { name: "Brightline Diagnostics", relation: "current client", matter: "Fractional GC", since: "2025-03" },
  { name: "Harbor Point Health System", relation: "former client", matter: "Employment policy review", closed: "2023-11" },
  { name: "Mosaic Care Partners", relation: "current client", matter: "Vendor contract subscription", since: "2026-01" },
  { name: "Tidewater Labs", relation: "former client", matter: "SaaS MSA negotiation", closed: "2025-06" },
];

export const BENCHMARKS: Record<string, unknown> = {
  "commercial contracts|NY": { hourly: { p25: 375, median: 450, p75: 575 }, subscription_monthly: { median: 3800, typical_scope: "10 to 15 hours or 8 to 12 contract reviews" }, flat_fees: { "MSA review and negotiation": "2,500 to 4,000", "BAA review": "750 to 1,500" }, n: 41 },
  "tech transactions|CA": { hourly: { p25: 395, median: 475, p75: 600 }, subscription_monthly: { median: 3200, typical_scope: "6 to 10 contract reviews plus Slack access" }, flat_fees: { "SaaS terms package": "3,000 to 5,000", "Customer contract review": "750 to 1,500", "Privacy policy and DPA": "2,000 to 3,500" }, n: 37 },
  "employment|CA": { hourly: { p25: 400, median: 475, p75: 575 }, flat_fees: { "Multi-state hiring compliance": "4,000 to 8,000" }, n: 22 },
  "data privacy|NY": { hourly: { p25: 425, median: 500, p75: 625 }, flat_fees: { "DPA review": "1,500 to 3,000" }, n: 19 },
};

export const TEMPLATES = [
  { id: "T-112", name: "Fractional GC subscription engagement letter (NY)", contributor: "R. Juliani", uses: 84 },
  { id: "T-087", name: "Flat-fee contract review engagement letter", contributor: "C. Bansal", uses: 131 },
  { id: "T-203", name: "Business associate agreement review checklist (HIPAA)", contributor: "D. Castellan", uses: 46 },
  { id: "T-061", name: "Hybrid flat fee + subscription engagement letter", contributor: "A. Young", uses: 59 },
  { id: "T-150", name: "Startup SaaS terms package scope letter (CA)", contributor: "V. Wong", uses: 72 },
];

export const PUBLIC_PULSE =
  "Public HeyCounsel Pulse (Summer 2026): 62% of member revenue comes from referrals; 71% of members use flat fees, 36% subscriptions, 81% hourly; time split is 53% client work, 18% business development, 15% admin.";

export const DEFAULT_EMAIL = `From: Maya Chen, COO, Lumen Health
Subject: Need help with Harbor Point contract

Hi Dana, Priya from your HeyCounsel network suggested you. We're a 22-person seed-stage health-tech company in Brooklyn. Harbor Point Health System sent us a 40-page master services agreement plus a business associate agreement, and they want it signed by the 20th.

After that we expect about 8 to 10 customer and vendor contracts a month and no in-house lawyer. Could you take on the Harbor Point deal and then ongoing support? What would that cost?

Thanks, Maya`;

export const DEFAULT_SCOPER =
  "We're a 40-person Series B SaaS company in Austin. We're hiring in California and New York next quarter, and our first EU customer just sent a data processing agreement we don't understand. Our last lawyer left. Need someone fast, budget is tight.";

export const DEFAULT_LAUNCH = {
  background: "7th-year tech transactions associate at an AmLaw 50 firm",
  bar: "California",
  practice: "SaaS and commercial contracts, privacy",
  clients: "Seed to Series B startups",
  goal: "$300,000",
};
