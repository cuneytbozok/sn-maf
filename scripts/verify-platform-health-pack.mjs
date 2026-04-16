#!/usr/bin/env node
/**
 * Platform Health pack (PRD §6.1 + §9.4 manual MVP): one category weight 1.0;
 * ten sub-category weights sum to 1.0; 64 active metrics; per-sub-category
 * weight_in_category sums to 1.0.
 *
 * Sub-categories 1-9 are the PRD §6.1 platform-signal groups. Sub-category
 * 10 (governance_manual) hosts the manual discovery metrics added in PRD §9.4
 * (MVP manual collector). Weight for governance_manual (0.05) is taken from
 * Security hygiene (now 0.15) so category totals remain 1.0.
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const SEED = path.join(__dirname, '../src/fluent/data/platform-health-pack-seed.now.ts')

const SUB_IDS = [
  'maf_plathealth_sub_performance',
  'maf_plathealth_sub_data_volume',
  'maf_plathealth_sub_scheduled_jobs',
  'maf_plathealth_sub_business_rules',
  'maf_plathealth_sub_update_sets',
  'maf_plathealth_sub_footprint',
  'maf_plathealth_sub_email_integration',
  'maf_plathealth_sub_security',
  'maf_plathealth_sub_logging_errors',
  'maf_plathealth_sub_governance_manual',
]

function extractRecordBlocksForTable(source, tableLiteral) {
  const blocks = []
  let from = 0
  while (true) {
    const tIdx = source.indexOf(`table: '${tableLiteral}'`, from)
    if (tIdx === -1) break
    const recStart = source.lastIndexOf('Record({', tIdx)
    const nextRec = source.indexOf('\nRecord({', tIdx)
    const end = nextRec === -1 ? source.length : nextRec
    blocks.push(source.slice(recStart, end))
    from = tIdx + 1
  }
  return blocks
}

function main() {
  const source = fs.readFileSync(SEED, 'utf8')
  const eps = 1e-6

  const catBlocks = extractRecordBlocksForTable(source, 'x_maf_core_category')
  if (catBlocks.length !== 1) {
    console.error(`verify-platform-health-pack: expected 1 category, found ${catBlocks.length}`)
    process.exit(1)
  }
  const cw = catBlocks[0].match(/^\s*weight:\s*([\d.]+)\s*,?$/m)
  if (!cw || Math.abs(parseFloat(cw[1], 10) - 1) >= eps) {
    console.error('verify-platform-health-pack: platform_health category weight must be 1.0')
    process.exit(1)
  }

  const subBlocks = extractRecordBlocksForTable(source, 'x_maf_core_sub_category')
  if (subBlocks.length !== 10) {
    console.error(`verify-platform-health-pack: expected 10 sub-categories, found ${subBlocks.length}`)
    process.exit(1)
  }
  let subSum = 0
  for (const id of SUB_IDS) {
    const block = subBlocks.find((b) => b.includes(`'${id}'`))
    if (!block) {
      console.error(`verify-platform-health-pack: missing sub-category ${id}`)
      process.exit(1)
    }
    const w = block.match(/weight_in_category:\s*([\d.]+)/)
    if (!w) {
      console.error(`verify-platform-health-pack: missing weight_in_category on ${id}`)
      process.exit(1)
    }
    subSum += parseFloat(w[1], 10)
  }
  if (Math.abs(subSum - 1) >= eps) {
    console.error(`verify-platform-health-pack: sub-category weights must sum to 1.0, got ${subSum}`)
    process.exit(1)
  }

  const metricBlocks = extractRecordBlocksForTable(source, 'x_maf_core_metric_definition')
  let active = 0
  const perSub = Object.fromEntries(SUB_IDS.map((k) => [k, 0]))
  for (const block of metricBlocks) {
    if (/active:\s*false/.test(block)) continue
    active++
    const m = block.match(/sub_category:\s*Now\.ref\(\s*'x_maf_core_sub_category'\s*,\s*'([^']+)'\s*\)/)
    if (!m) {
      console.error('verify-platform-health-pack: metric missing sub_category ref')
      process.exit(1)
    }
    const subId = m[1]
    if (!(subId in perSub)) {
      console.error(`verify-platform-health-pack: unknown sub_category ${subId}`)
      process.exit(1)
    }
    const w = block.match(/weight_in_category:\s*([\d.]+)/)
    if (!w) {
      console.error('verify-platform-health-pack: metric missing weight_in_category')
      process.exit(1)
    }
    perSub[subId] += parseFloat(w[1], 10)
  }

  if (active !== 64) {
    console.error(`verify-platform-health-pack: expected 64 active metrics (61 platform signals + 3 manual MVP), found ${active}`)
    process.exit(1)
  }

  for (const id of SUB_IDS) {
    if (Math.abs(perSub[id] - 1) >= eps) {
      console.error(
        `verify-platform-health-pack: metrics in ${id} must sum weight_in_category to 1.0, got ${perSub[id]}`,
      )
      process.exit(1)
    }
  }

  console.log('verify-platform-health-pack: OK (10 sub-categories, 64 active metrics, weights balanced)')
}

main()
