#!/usr/bin/env node
/**
 * CMDB/CSDM pack: one pack; seven categories with weight sum 1.0; seven sub-categories (weight_in_category 1 each);
 * 23 active metrics; per-sub-category metric weight_in_category sums to 1.0.
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const SEED = path.join(__dirname, '../src/fluent/data/cmdb-csdm-pack-seed.now.ts')

const CAT_IDS = [
  'maf_cmdb_cat_ci_completeness',
  'maf_cmdb_cat_csdm_alignment',
  'maf_cmdb_cat_cmdb_data_quality',
  'maf_cmdb_cat_cmdb_relationships',
  'maf_cmdb_cat_discovery_ingestion',
  'maf_cmdb_cat_cmdb_health_dash',
  'maf_cmdb_cat_svc_governance',
]

const SUB_IDS = [
  'maf_cmdb_sub_ci_completeness',
  'maf_cmdb_sub_csdm_alignment',
  'maf_cmdb_sub_cmdb_data_quality',
  'maf_cmdb_sub_cmdb_relationships',
  'maf_cmdb_sub_discovery_ingestion',
  'maf_cmdb_sub_cmdb_health_dash',
  'maf_cmdb_sub_svc_governance',
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

  const packBlocks = extractRecordBlocksForTable(source, 'x_maf_core_pack')
  if (packBlocks.length !== 1) {
    console.error(`verify-cmdb-csdm-pack: expected 1 pack, found ${packBlocks.length}`)
    process.exit(1)
  }

  const catBlocks = extractRecordBlocksForTable(source, 'x_maf_core_category')
  if (catBlocks.length !== 7) {
    console.error(`verify-cmdb-csdm-pack: expected 7 categories, found ${catBlocks.length}`)
    process.exit(1)
  }
  let catSum = 0
  for (const id of CAT_IDS) {
    const block = catBlocks.find((b) => b.includes(`'${id}'`))
    if (!block) {
      console.error(`verify-cmdb-csdm-pack: missing category ${id}`)
      process.exit(1)
    }
    const w = block.match(/^\s*weight:\s*([\d.]+)\s*,?$/m)
    if (!w) {
      console.error(`verify-cmdb-csdm-pack: missing weight on ${id}`)
      process.exit(1)
    }
    catSum += parseFloat(w[1], 10)
  }
  if (Math.abs(catSum - 1) >= eps) {
    console.error(`verify-cmdb-csdm-pack: category weights must sum to 1.0, got ${catSum}`)
    process.exit(1)
  }

  const subBlocks = extractRecordBlocksForTable(source, 'x_maf_core_sub_category')
  if (subBlocks.length !== 7) {
    console.error(`verify-cmdb-csdm-pack: expected 7 sub-categories, found ${subBlocks.length}`)
    process.exit(1)
  }
  for (const id of SUB_IDS) {
    const block = subBlocks.find((b) => b.includes(`'${id}'`))
    if (!block) {
      console.error(`verify-cmdb-csdm-pack: missing sub-category ${id}`)
      process.exit(1)
    }
    const w = block.match(/weight_in_category:\s*([\d.]+)/)
    if (!w || Math.abs(parseFloat(w[1], 10) - 1) >= eps) {
      console.error(`verify-cmdb-csdm-pack: sub-category ${id} must have weight_in_category 1.0`)
      process.exit(1)
    }
  }

  const metricBlocks = extractRecordBlocksForTable(source, 'x_maf_core_metric_definition')
  let active = 0
  const perSub = Object.fromEntries(SUB_IDS.map((k) => [k, 0]))
  for (const block of metricBlocks) {
    if (/active:\s*false/.test(block)) continue
    active++
    const m = block.match(/sub_category:\s*Now\.ref\(\s*'x_maf_core_sub_category'\s*,\s*'([^']+)'\s*\)/)
    if (!m) {
      console.error('verify-cmdb-csdm-pack: metric missing sub_category ref')
      process.exit(1)
    }
    const subId = m[1]
    if (!(subId in perSub)) {
      console.error(`verify-cmdb-csdm-pack: unknown sub_category ${subId}`)
      process.exit(1)
    }
    const w = block.match(/weight_in_category:\s*([\d.]+)/)
    if (!w) {
      console.error('verify-cmdb-csdm-pack: metric missing weight_in_category')
      process.exit(1)
    }
    perSub[subId] += parseFloat(w[1], 10)
  }

  if (active !== 23) {
    console.error(`verify-cmdb-csdm-pack: expected 23 active metrics, found ${active}`)
    process.exit(1)
  }

  for (const id of SUB_IDS) {
    if (Math.abs(perSub[id] - 1) >= eps) {
      console.error(
        `verify-cmdb-csdm-pack: metrics in ${id} must sum weight_in_category to 1.0, got ${perSub[id]}`,
      )
      process.exit(1)
    }
  }

  console.log('verify-cmdb-csdm-pack: OK (7 categories, 7 sub-categories, 23 metrics)')
}

main()
