# ServiceNow official SDK examples repository

**Repository:** [github.com/ServiceNow/sdk-examples](https://github.com/ServiceNow/sdk-examples)

This is the **official** sample collection for the ServiceNow SDK and Fluent. Use it whenever you need **working, buildable** Fluent patterns—especially when `now-sdk build` fails or syntax is unclear. Treat these samples as more authoritative than informal snippets from blog posts or older docs.

## Why use it

- Each sample is a **small standalone project** you can open, build (`pnpm run build` in that sample), and compare to your code.
- **Raw files** on `main` can be fetched for side-by-side syntax checks (same URLs as in `SKILL.md` → "When Build Fails").
- The repo README lists every sample with a short description.

## Prerequisites (from upstream README)

- **Node.js** v20+
- **pnpm** v9+

Clone and optional install:

```bash
git clone https://github.com/ServiceNow/sdk-examples
cd sdk-examples
pnpm install   # installs all sample workspaces (optional)
```

Open a single sample in the editor, e.g. `flow-sample` or `table-sample`, and run `pnpm run build` from that directory if its README says so.

## Sample index (official names → typical use)

| Sample folder | What to copy/learn |
|---------------|-------------------|
| [hello-world-sample](https://github.com/ServiceNow/sdk-examples/tree/main/hello-world-sample) | Minimal app skeleton |
| [table-sample](https://github.com/ServiceNow/sdk-examples/tree/main/table-sample) | Tables: simple, custom columns, extends |
| [flow-sample](https://github.com/ServiceNow/sdk-examples/tree/main/flow-sample) | Flow triggers (record, inbound email, catalog, SLA, KM, remote table, subflow) |
| [businessrule-sample](https://github.com/ServiceNow/sdk-examples/tree/main/businessrule-sample) | Business rules |
| [acl-sample](https://github.com/ServiceNow/sdk-examples/tree/main/acl-sample) | ACLs |
| [record-sample](https://github.com/ServiceNow/sdk-examples/tree/main/record-sample) | Static `Record` seed data |
| [restapi-sample](https://github.com/ServiceNow/sdk-examples/tree/main/restapi-sample) | Scripted REST API |
| [script-include-sample](https://github.com/ServiceNow/sdk-examples/tree/main/script-include-sample) | Script includes |
| [scriptaction-sample](https://github.com/ServiceNow/sdk-examples/tree/main/scriptaction-sample) | Script actions |
| [clientscript-sample](https://github.com/ServiceNow/sdk-examples/tree/main/clientscript-sample) | Client scripts |
| [dependencies-sample](https://github.com/ServiceNow/sdk-examples/tree/main/dependencies-sample) | Table dependencies / `now-sdk dependencies` |
| [applicationmenu-sample](https://github.com/ServiceNow/sdk-examples/tree/main/applicationmenu-sample) | Application menu |
| [list-sample](https://github.com/ServiceNow/sdk-examples/tree/main/list-sample) | List layout |
| [uipage-sample](https://github.com/ServiceNow/sdk-examples/tree/main/uipage-sample) | UI Page |
| [uiaction-sample](https://github.com/ServiceNow/sdk-examples/tree/main/uiaction-sample) | UI Action |
| [service-catalog-sample](https://github.com/ServiceNow/sdk-examples/tree/main/service-catalog-sample) | Service catalog |
| [service-portal-sample](https://github.com/ServiceNow/sdk-examples/tree/main/service-portal-sample) | Service Portal |
| [react-ui-page-ts-sample](https://github.com/ServiceNow/sdk-examples/tree/main/react-ui-page-ts-sample) | React + TS UI page |
| [vue-ui-page-sample](https://github.com/ServiceNow/sdk-examples/tree/main/vue-ui-page-sample) | Vue UI page |
| [svelte-ui-page-sample](https://github.com/ServiceNow/sdk-examples/tree/main/svelte-ui-page-sample) | Svelte UI page |
| [solidjs-ui-page-sample](https://github.com/ServiceNow/sdk-examples/tree/main/solidjs-ui-page-sample) | SolidJS UI page |
| [sys_module-sample](https://github.com/ServiceNow/sdk-examples/tree/main/sys_module-sample) | Cross-scope module calls |
| [test-atf-sample](https://github.com/ServiceNow/sdk-examples/tree/main/test-atf-sample) | ATF tests |

For the **exact** Fluent filenames already wired in the main skill (inbound email, subflow, table variants, BR, ACL), see the "Official SDK Example Files" table in `SKILL.md`—those rows use **raw.githubusercontent.com** URLs for quick fetch.

## How the agent should use this repo

1. **Prefer a matching official sample** over inventing API shape from memory.
2. **Debugging:** open the same sample folder locally (if cloned) or **fetch the raw `.now.ts`** from `main` and diff line-by-line against the user's file.
3. **New feature:** name the sample row from the table above, then explore `src/fluent/` under that folder in the GitHub UI or clone.
4. **Version drift:** examples track the SDK on `main`; if the user's `@servicenow/sdk` version is older, small API differences are possible—compare their `package.json` to the sample's.

## Relationship to this skill pack

- `fluent-patterns.md` / `flow-advanced.md` = consolidated reference notes (may lag or differ in style).
- `SKILL.md` **Key rules** = guardrails for common mistakes (ChoiceColumn shape, inbound email pills, etc.).
- **sdk-examples** = runnable **source of truth** for syntax; use when Key rules and patterns disagree until reconciled.
