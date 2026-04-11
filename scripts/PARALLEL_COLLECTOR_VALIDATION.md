# Parallel MTTR / reopen validation (dev instance)

PRD §6 and §4.2–4.3 require comparing **legacy** collectors (`ITSMMTTRCollector`, `ITSMReopenRateCollector`) against **migrated** collectors (`MAFDurationCollector`, `MAFWindowedRatioCollector`) on the **same data** before promoting the ITSM pack v2 seed to production.

## Preconditions

- `x_maf_core` scope with `MAFDurationCollector`, `MAFWindowedRatioCollector`, and `MAFCollectorTestFixtures` installed (same build as this repo).
- Background Script runs in the **scoped application** context (or use `gs.getSession().setScopedAppId(...)` if your tooling requires it).

## 1. Canonical `script_params` JSON

Use `MAFCollectorTestFixtures` so the migration strings stay aligned with the seed:

```javascript
var fx = new MAFCollectorTestFixtures()
gs.info('MTTR params: ' + fx.getMttrMigrationParamsJson())
gs.info('Reopen params: ' + fx.getReopenMigrationParamsJson())
```

These must match `SCRIPT_PARAMS_MTTR_HOURS_30D` and `SCRIPT_PARAMS_REOPEN_30D` in `src/fluent/data/itsm-pack-seed.now.ts`.

## 2. MTTR — compare old vs new (±0.01 hours)

1. Instantiate **legacy**: `new ITSMMTTRCollector(metricDefGR, runGR)` with a metric definition GR whose `script_params` is `{"window_days":30}` (legacy shape) and `script_include` set to `ITSMMTTRCollector`, **or** build a minimal `GlideRecord('x_maf_core_metric_definition')` in memory with those fields set.
2. Call `collect()` and record `value`.
3. Point the same (or cloned) metric GR at `MAFDurationCollector` and set `script_params` to `fx.getMttrMigrationParamsJson()`.
4. Call `collect()` again; assert `Math.abs(newValue - oldValue) <= 0.01`.

If you only need a smoke check without wiring full metric GRs, run `fx.runSyntheticSanityChecks()` first, then perform the two collector comparison above on real incident data.

## 3. Reopen rate — compare old vs new

Same pattern: `ITSMReopenRateCollector` with `{"window_days":30}` vs `MAFWindowedRatioCollector` with `fx.getReopenMigrationParamsJson()`. Numeric results should match within floating-point tolerance (same formula: numerator/denominator × 100).

## 4. Evidence to capture

- Screenshot or log lines showing both values and the delta.
- Note the instance name, date, and build / update set that deployed the new collectors.

Execution on a live ServiceNow instance is **not** part of CI in this repository; perform these steps on your **dev / test** instance after deploy.
