#!/usr/bin/env node
/**
 * PRD — ITSM pack: category `weight` on x_maf_core_category sums to 1.0;
 * sub-category `weight_in_category` within each category sums to 1.0;
 * active metric `weight_in_category` (logical: weight within sub-category) sums to 1.0 per sub-category.
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const SEED = path.join(__dirname, '../src/fluent/data/itsm-pack-seed.now.ts')

/** ITSM pack — expected rows in `itsm-pack-seed.now.ts` (active scoring vs retired). */
const EXPECTED_ACTIVE_METRICS = 87
const EXPECTED_INACTIVE_METRICS = 2

const CATEGORY_SEED_IDS = [
  'maf_seed_cat_data_quality',
  'maf_seed_cat_operational',
  'maf_seed_cat_process_adherence',
  'maf_seed_cat_platform_hygiene',
  'maf_seed_cat_automation_reuse',
]

const SUB_CATEGORY_SEED_IDS = [
  'maf_seed_sub_itsm_data_quality_fields',
  'maf_seed_sub_itsm_ops_time_resolution',
  'maf_seed_sub_itsm_ops_backlog_volume',
  'maf_seed_sub_itsm_process_governance',
  'maf_seed_sub_itsm_ph_catalog_taxonomy',
  'maf_seed_sub_itsm_ph_ux_variables',
  'maf_seed_sub_itsm_ph_custom_code',
  'maf_seed_sub_itsm_ph_notifications_sla',
  'maf_seed_sub_itsm_automation_reuse',
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

function extractMetricBlocks(source) {
  return extractRecordBlocksForTable(source, 'x_maf_core_metric_definition')
}

function sumCategoryRollupWeights(source) {
  const blocks = extractRecordBlocksForTable(source, 'x_maf_core_category')
  let sum = 0
  for (const id of CATEGORY_SEED_IDS) {
    const block = blocks.find((b) => b.includes(`'${id}'`))
    if (!block) {
      console.error(`verify-metric-weights: missing x_maf_core_category Record for ${id}`)
      process.exit(1)
    }
    const w = block.match(/^\s*weight:\s*([\d.]+)\s*,?$/m)
    if (!w) {
      console.error(`verify-metric-weights: missing weight in category block ${id}`)
      process.exit(1)
    }
    sum += parseFloat(w[1], 10)
  }
  if (blocks.length !== CATEGORY_SEED_IDS.length) {
    console.error(
      `verify-metric-weights: expected ${CATEGORY_SEED_IDS.length} category Records, found ${blocks.length}`,
    )
    process.exit(1)
  }
  return sum
}

/** Parent category seed id from sub-category Record block. */
function subCategoryParentKey(block) {
  if (block.includes('maf_seed_cat_data_quality')) return 'data_quality'
  if (block.includes('maf_seed_cat_operational')) return 'operational'
  if (block.includes('maf_seed_cat_process_adherence')) return 'process_adherence'
  if (block.includes('maf_seed_cat_platform_hygiene')) return 'platform_hygiene'
  if (block.includes('maf_seed_cat_automation_reuse')) return 'automation_reuse'
  return null
}

function verifySubCategoryWeights(source) {
  const blocks = extractRecordBlocksForTable(source, 'x_maf_core_sub_category')
  if (blocks.length !== SUB_CATEGORY_SEED_IDS.length) {
    console.error(
      `verify-metric-weights: expected ${SUB_CATEGORY_SEED_IDS.length} sub-category Records, found ${blocks.length}`,
    )
    process.exit(1)
  }
  const perCat = {
    data_quality: 0,
    operational: 0,
    process_adherence: 0,
    platform_hygiene: 0,
    automation_reuse: 0,
  }
  for (const id of SUB_CATEGORY_SEED_IDS) {
    const block = blocks.find((b) => b.includes(`'${id}'`))
    if (!block) {
      console.error(`verify-metric-weights: missing x_maf_core_sub_category Record for ${id}`)
      process.exit(1)
    }
    const parent = subCategoryParentKey(block)
    if (!parent) {
      console.error(`verify-metric-weights: could not resolve parent category for ${id}`)
      process.exit(1)
    }
    const w = block.match(/weight_in_category:\s*([\d.]+)/)
    if (!w) {
      console.error(`verify-metric-weights: missing weight_in_category on sub-category ${id}`)
      process.exit(1)
    }
    perCat[parent] += parseFloat(w[1], 10)
  }
  return perCat
}

function metricSubCategoryRef(block) {
  const m = block.match(/sub_category:\s*Now\.ref\(\s*'x_maf_core_sub_category'\s*,\s*'([^']+)'\s*\)/)
  return m ? m[1] : null
}

function categoryKey(block) {
  if (block.includes('maf_seed_cat_data_quality')) return 'data_quality'
  if (block.includes('maf_seed_cat_operational')) return 'operational'
  if (block.includes('maf_seed_cat_process_adherence')) return 'process_adherence'
  if (block.includes('maf_seed_cat_platform_hygiene')) return 'platform_hygiene'
  if (block.includes('maf_seed_cat_automation_reuse')) return 'automation_reuse'
  return null
}

function main() {
  const source = fs.readFileSync(SEED, 'utf8')
  const subCatSums = verifySubCategoryWeights(source)

  const metricBlocks = extractMetricBlocks(source)
  const sums = {
    data_quality: 0,
    operational: 0,
    process_adherence: 0,
    platform_hygiene: 0,
    automation_reuse: 0,
  }
  let active = 0
  let inactive = 0

  for (const block of metricBlocks) {
    const subId = metricSubCategoryRef(block)
    if (!subId) {
      console.error('verify-metric-weights: metric block missing sub_category ref')
      process.exit(1)
    }
    const cat = categoryKey(block)
    if (!cat) {
      console.error('verify-metric-weights: could not resolve category for a metric block')
      process.exit(1)
    }
    const isInactive = /active:\s*false/.test(block)
    if (isInactive) inactive++
    else active++

    const w = block.match(/weight_in_category:\s*([\d.]+)/)
    if (!w) {
      console.error('verify-metric-weights: missing weight_in_category in metric block')
      process.exit(1)
    }
    const weight = parseFloat(w[1], 10)
    if (!isInactive) sums[cat] += weight
  }

  const eps = 1e-6
  const rollupSum = sumCategoryRollupWeights(source)

  console.log('Sub-category weights within each category (should be 1.0):')
  for (const k of Object.keys(subCatSums)) {
    console.log(`  ${k}: ${subCatSums[k].toFixed(6)}`)
  }
  console.log('Active metric weight sums per top-level category (PRD migration — unchanged totals, should be 1.0):')
  for (const k of Object.keys(sums)) {
    console.log(`  ${k}: ${sums[k].toFixed(6)}`)
  }
  console.log(`  Active / inactive metrics:     ${active} / ${inactive}`)
  console.log(`  Category rollup weights (pack): ${rollupSum.toFixed(6)}`)

  if (active !== EXPECTED_ACTIVE_METRICS || inactive !== EXPECTED_INACTIVE_METRICS) {
    console.error(
      `verify-metric-weights: expected ${EXPECTED_ACTIVE_METRICS} active + ${EXPECTED_INACTIVE_METRICS} inactive metric definitions, got ${active} + ${inactive}`,
    )
    process.exit(1)
  }

  if (Math.abs(rollupSum - 1) >= eps) {
    console.error('verify-metric-weights: category rollup weights must sum to 1.0')
    process.exit(1)
  }

  for (const k of Object.keys(subCatSums)) {
    if (Math.abs(subCatSums[k] - 1) >= eps) {
      console.error(`verify-metric-weights: sub-category weights in ${k} must sum to 1.0`)
      process.exit(1)
    }
  }

  const ok =
    Math.abs(sums.data_quality - 1) < eps &&
    Math.abs(sums.operational - 1) < eps &&
    Math.abs(sums.process_adherence - 1) < eps &&
    Math.abs(sums.platform_hygiene - 1) < eps &&
    Math.abs(sums.automation_reuse - 1) < eps

  if (!ok) {
    console.error(
      'verify-metric-weights: per-category active weight_in_category (within sub-category rollup) must each sum to 1.0',
    )
    process.exit(1)
  }

  console.log('verify-metric-weights: OK')
}

main()
