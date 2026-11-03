# 🛰️ GitHub Scout

Personalized, daily GitHub discovery → Gemini analysis → Discord embeds. Tracks already-sent projects in `data/history.json` to reduce repeats.

## Features

- Searches newly-created GitHub repositories from the past 21 days in **AI Agents / Skills / MCP**, **AI games / creative coding**, **distributed systems / infrastructure**, **developer tools**.
- Deduplicates candidates and ranks with interest weights, star momentum, recency, and AI judgments.
- Reads selected README excerpts (untrusted data), scores and summarizes candidates in Chinese, adds realistic fork/build ideas.
- Sends up to five rich embeds to Discord, with a deterministic fallback if the AI API fails.
- Commits successful delivery history so repeated runs do not keep repeating the same repos.
- Runs daily at **9:15 AM America/New_York** (DST-aware) or manually with `workflow_dispatch`.

## 1. Create Discord webhook

In a Discord server channel where you have Manage Webhooks permission: **Edit Channel → Integrations → Webhooks → New Webhook → Copy Webhook URL**. Keep the complete URL private. Normal text channels work best. It should look like `https://discord.com/api/webhooks/.../...`.

## 2. Create a Gemini API key

At https://aistudio.google.com/api-keys create a Gemini API key. Free-tier access and rate limits depend on project eligibility and selected model. If necessary, change `GEMINI_MODEL` (repository variable) to a model available to your project.

## 3. Publish to GitHub

1. Unzip and `cd github-scout`.
2. Create a **private or public** empty repository named `github-scout` on GitHub. A private repo hides configuration/history but does not eliminate API costs or grant secret protection to someone with admin access.
3. Run (replace URL with your own):

```bash
git init
git add .
git commit -m "Initialize GitHub Scout"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/github-scout.git
git push -u origin main
```

4. In GitHub **Settings → Secrets and variables → Actions → Secrets**, add:
   - `DISCORD_WEBHOOK_URL`: complete Discord webhook URL
   - `GEMINI_API_KEY`: your Gemini API key
5. GitHub provides `GITHUB_TOKEN` automatically; you do **not** need a personal access token. In **Settings → Actions → General → Workflow permissions**, choose **Read and write permissions** if needed for the history commit (the workflow also declares `contents: write`).
6. In **Actions → Daily GitHub Scout → Run workflow**, run manually. Check its logs and your Discord channel.

Daily scheduled actions run only from the default branch. On forks or inactive repositories, GitHub may disable schedules; re-enable via Actions. Scheduled runs can also be delayed.

## 4. Run locally

```bash
python3 -m venv .venv
source .venv/bin/activate             # Windows PowerShell: .venv\\Scripts\\Activate.ps1
pip install -r requirements.txt
cp .env.example .env
```

Edit `.env` with your secrets and load it (shell):

```bash
set -a; source .env; set +a          # bash/zsh
python -m scout.main --test-webhook  # sends a harmless test message
python -m scout.main --dry-run       # searches + AI review, no Discord message, history unchanged
python -m scout.main --dry-run --no-ai   # tests without spending Gemini API usage
python -m scout.main                # actually sends and updates data/history.json
pytest -q
```

**Security:** never commit `.env`, webhook URLs, API keys, or GitHub credentials. A webhook URL is a secret; if it leaks, delete/rotate it in Discord. `.env.example` contains placeholders only.

## 5. Personalization

Edit `config.yaml` to change topic weights, GitHub Search queries, maximum recommendations (set `max_repos: 3` for three), recency (21 days), selection threshold, or model. Decrease `candidate_limit` to spend less on reading README snippets. Use repository **Settings → Secrets and variables → Actions → Variables** with `GEMINI_MODEL` if you want another model.

## Operational notes and limitations

- Search finds **recently created** repositories, not older repositories newly trending this week. Change query qualifiers to `pushed:` for a different signal, but that may include old projects.
- AI reviews are generated from GitHub metadata and excerpts and can be wrong. Verify repo licenses, activity and safety before executing code.
- API failure falls back to metadata descriptions; missing results may lead to fewer than three recommendations. Repos with zero matches or only previously sent repos cause no message that day.
- `data/history.json` is committed only after Discord confirms a message. A git push failure after delivery can cause duplicate recommendations next time; rerun after fixing permissions.
- Model usage may incur API charges depending on your Gemini project and tier; the free GitHub Actions allowance depends on repository/account type. See your respective billing pages.
- For high-reliability production use, pin GitHub Actions to immutable SHAs, add notifications for workflow failures and move history to durable external storage.
