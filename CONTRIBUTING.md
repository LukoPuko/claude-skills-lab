# Contributing to ~/skills.lab

Thanks for adding to the directory. There are two ways to submit a skill — pick whichever fits.

## Path A · Open an issue (no setup, ~30 seconds)

[Open the "Add a skill" issue form →](../../issues/new?template=add-skill.yml)

Fill the fields. A maintainer reviews and adds it within ~24h. Use this if you don't want to clone the repo.

## Path B · Send a PR (~3 minutes)

1. Fork this repo and clone your fork locally
2. Open `index.html` and find the `const SKILLS = [` array (search for `// ════════════════ DOCUMENTS ════════════════` to land in the right block)
3. Add your skill object to the relevant category section. Schema:

   ```js
   {
     n: 'skill-name',          // required, lowercase, matches folder
     d: 'One or two sentences explaining what it does. No marketing.',
     a: 'github-username',     // required, the publisher
     c: 'frontend',            // required, one of: doc / frontend / devops / security / ai / data / mobile / design / marketing / productivity / testing / tooling / scraping / api / education
     i: 'npx skills add user/repo/skill -g -a claude-code',  // required
     g: 'https://github.com/user/repo',  // optional but strongly preferred
     o: 1,                     // optional, 1 if official Anthropic
     b: 1,                     // optional, 1 if built-in slash command
     f: 1,                     // optional, 1 if you'd put this in a 'must have' list
     s: '12K★',                // optional, stars or install count
     r: 4                      // required, your honest rating 1–5
   }
   ```

4. Open the page locally to confirm it renders (any static server works — `python3 -m http.server` from the repo root, then open `http://localhost:8000/`)
5. Open a pull request with a one-line summary

## What gets accepted

- Skills with a **public source** — GitHub repo, documented marketplace listing, or official Anthropic skill
- A **working install command** — `npx skills add ...`, a built-in `/command`, or a clear `git clone` step
- A **1–2 sentence description** that says what the skill does, not what category it's in
- An **honest rating** — self-promotion is fine; lying about quality is not

## What gets rejected

- Empty repos, dead links, vapourware
- Pure copies of existing skills with new names
- Anything where the install command doesn't actually install the skill
- Marketing decks repackaged as a "skill"

## Questions or proposals

Open a [Discussion](../../discussions) — for feature requests, missing categories, or skills you think should be deprecated.
