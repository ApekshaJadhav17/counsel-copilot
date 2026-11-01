# Counsel Copilot

Concept prototype by Apeksha Jadhav: three AI agents for an independent-lawyer community (pitched to HeyCounsel). Not affiliated with HeyCounsel. All people, firms, clients and rates are sample data.

| Tab | What it does | API route |
| --- | --- | --- |
| Client Email to Proposal | Agent calls `check_conflicts`, `get_rate_benchmarks`, `search_templates`, then drafts a fee quote, engagement letter and reply for lawyer approval | `POST /api/copilot` |
| Find the Right Lawyer | Turns a company's request into a matter brief, budget band and 3 matched members | `POST /api/scoper` |
| Start Your Own Firm Planner | Pricing, 30/60/90 plan and peer intros for a lawyer going solo | `POST /api/launch` |
| How it plugs in | Architecture diagram and build plan | none |

Every tab also has **Replay recorded run**, which needs no API key.

## Stack

- Next.js 14 (App Router) + TypeScript, no UI libraries
- Groq's OpenAI-compatible chat completions API: tool calling for the agent, JSON mode for the other two
- `lib/groq.ts` is the only file that talks to the model. To switch to Claude, replace it and keep `chatJSON` / `runAgent` signatures.
- `middleware.ts`: passcode gate. `lib/ratelimit.ts`: 20 runs per device per 10 minutes (per server instance).
- Sample data: `lib/data.ts`. Recorded runs: `lib/recorded.ts`.

## Run locally

```bash
npm install
cp .env.example .env.local   # add GROQ_API_KEY; leave DEMO_PASSCODE empty locally
npm run dev                  # http://localhost:3000
```

Free Groq key: https://console.groq.com/keys

## Deploy to Vercel

1. Create an empty GitHub repo, then from this folder:
   ```bash
   git init && git add . && git commit -m "Counsel Copilot prototype"
   git branch -M main
   git remote add origin https://github.com/<you>/counsel-copilot.git
   git push -u origin main
   ```
2. On vercel.com: **Add New → Project**, import the repo. Framework is detected as Next.js.
3. Under **Environment Variables** add:
   - `GROQ_API_KEY` = your key
   - `GROQ_MODEL` = `llama-3.3-70b-versatile` (or `openai/gpt-oss-120b`)
   - `DEMO_PASSCODE` = a passcode you will share with the founder
4. **Deploy.** Open the URL, enter the passcode.

Changing an environment variable later needs a redeploy (Deployments → … → Redeploy).

## Notes

- The site sends `noindex` so search engines skip it.
- The colors follow HeyCounsel's brand names (paper, ink, brick) as approximations in `app/globals.css`. No HeyCounsel logo is used.
- If Groq's free limit is hit, the API returns a clear message; use Replay during the demo.
