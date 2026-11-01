export type TraceStep = { tool: string; args: unknown; result: unknown };

export type CopilotOut = {
  conflict: { status: string; detail: string };
  fee: { model: string; headline: string; detail: string };
  template: { id: string; name: string; why: string };
  letter: string;
  email: string;
};

export type ScoperOut = {
  summary: string;
  practice_areas: string[];
  jurisdictions: string[];
  urgency: string;
  engagement_type: string;
  scope_items: string[];
  budget: { item: string; range: string }[];
  questions: string[];
  matches: { id: string; fit: number; reason: string }[];
  team_up: string | null;
};

export type LaunchOut = {
  positioning: string;
  pricing: {
    hourly: { amount: string; note: string };
    flat: { item: string; price: string }[];
    subscription: { price: string; includes: string };
  };
  math: string;
  plan: { window: string; tasks: string[] }[];
  peers: { id: string; why: string }[];
  watchouts: string[];
};
