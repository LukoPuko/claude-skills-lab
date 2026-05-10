# ~/skills.lab

A community-maintained directory of [Claude Code](https://github.com/anthropics/claude-code) skills.

200+ curated skills across 15 categories with copy-paste install commands. Single static page — no build, no framework, no analytics.

## Live site

→ [Open the directory](https://lukopuko.github.io/claude-skills-lab/)

## What's a skill?

A skill is a small bundle of knowledge that makes Claude dramatically better at a specific task — Word document editing, React performance review, Stripe integration, security audits. Skills auto-load when relevant and stay out of the way otherwise.

## Use it

1. Browse [the directory](https://lukopuko.github.io/claude-skills-lab/), pick what you need
2. Copy the install command from any card
3. Paste in your terminal
4. Restart Claude Code

For installing many at once, the **Essential / Power / Mega** tabs each give you a one-paste bundle. The "Or just paste a prompt" section lets Claude install everything for you.

## Run locally

This is a single static HTML file. Any web server works:

```bash
git clone https://github.com/LukoPuko/claude-skills-lab.git
cd claude-skills-lab
python3 -m http.server 8000
# open http://localhost:8000
```

## Contribute

See [CONTRIBUTING.md](CONTRIBUTING.md). Two paths:

- **Open an issue** with the [add-skill form](../../issues/new?template=add-skill.yml) — ~30 seconds, no code
- **Send a PR** adding to the `SKILLS` array in `index.html` — ~3 minutes

## License

MIT — see [LICENSE](LICENSE).

The skills themselves belong to their respective authors and are listed under their own licenses. This repository contains only metadata, install commands, and the directory site.

## Credits

Sources curated from:

- [anthropics/skills](https://github.com/anthropics/skills) — official Anthropic skills
- [skills.sh](https://skills.sh) — community marketplace
- [obra/superpowers](https://github.com/obra/superpowers) — agentic workflow framework
- [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills) — Vercel's React/Next.js skills
- [travisvn/awesome-claude-skills](https://github.com/travisvn/awesome-claude-skills) — awesome list

Plus 80+ individual community authors. See in-card attribution for each skill.
