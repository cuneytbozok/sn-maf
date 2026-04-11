# ServiceNow SDK — official API docs for agents

**Human docs site:** [servicenow.github.io/sdk](https://servicenow.github.io/sdk/)  
ServiceNow publishes **machine-readable** API text meant for AI agents (see *AI Agent Configuration* on that site).

## Endpoints (use these, not scraped HTML)

| Resource | URL | When to use |
|----------|-----|-------------|
| Version index (JSON) | [versions.json](https://servicenow.github.io/sdk/versions.json) | **Always first** when you need docs: pick the entry whose `version` matches the project's `@servicenow/sdk` (semver closest match). |
| Full API for agents | Each version's `llmsFull` from `versions.json` | **Default for codegen**: full signatures, properties, reduces API hallucinations. |
| Condensed index | Each version's `llms` from `versions.json` | Tight context: table of contents–style; use when `llmsFull` is too large. |
| Latest shortcuts (may not match old SDK) | [llms.txt](https://servicenow.github.io/sdk/llms.txt) / [llms-full.txt](https://servicenow.github.io/sdk/llms-full.txt) | Quick fetch only if project uses **Latest** SDK; otherwise prefer **version-matched** URLs from `versions.json`. |

## Required workflow (version-accurate)

1. Read the project's `package.json` and find `"@servicenow/sdk": "x.y.z"`.
2. `WebFetch` [https://servicenow.github.io/sdk/versions.json](https://servicenow.github.io/sdk/versions.json).
3. Select the `versions[]` entry whose `version` matches (or is closest semver to) the installed package.
4. Use that entry's **`llmsFull`** URL as the primary Fluent API reference for this task; use **`llms`** if you only need a short index.
5. If the user upgraded/downgraded the SDK, repeat steps 1–4 — do not reuse a cached major version blindly.

## Relationship to Context7 MCP

- **Context7** is ideal for *discovering* library surface area and quick snippets when the ServiceNow SDK is indexed.
- **Official `llmsFull` for the installed version** is the **authority** for exact parameter names, required fields, and types. If Context7 and `llmsFull` disagree, trust **`llmsFull`** (and [sdk-examples](https://github.com/ServiceNow/sdk-examples) for runnable shape).
- Prefer **one** deep source per task: either fetch **version-matched `llmsFull`** or query Context7—not both unless verifying a discrepancy.

## Relationship to this skill pack

- **`SKILL.md`** — workflows, CLI, and **Key rules** (inbound email, ChoiceColumn, etc.).
- **`sdk-api-docs-agents.md` (this file)** — how to load **typed** API reference from ServiceNow.
- **`sdk-examples-repo.md`** — runnable samples.
- Order of truth for **API shape**: installed SDK **`llmsFull`** → **sdk-examples** → **Key rules** in SKILL → informal pattern docs.
