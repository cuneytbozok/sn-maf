import assert from 'node:assert/strict'
import test from 'node:test'
import {
  mafAggregateSubCategories,
  mafSubCategoryScoreFromAgg,
  mafRollSubScoresIntoCategories,
  mafCategoryScoreFromAgg,
  mafRound2,
} from '../src/pure/mafScoreRollup.js'

const G = 75
const A = 50

test('empty run: no aggregates', () => {
  const a = mafAggregateSubCategories([], {})
  assert.deepEqual(a, {})
})

test('null sub_category: metric excluded from rollup', () => {
  const defs = {
    m1: { subCategoryId: null, weight: 0.5 },
  }
  const a = mafAggregateSubCategories(
    [{ metricDefinitionId: 'm1', ragStatus: 'green', normalizedScore: 80 }],
    defs,
  )
  assert.deepEqual(a, {})
})

test('single sub-category: weighted average and RAG', () => {
  const defs = {
    a: { subCategoryId: 's1', weight: 0.5 },
    b: { subCategoryId: 's1', weight: 0.5 },
    c: { subCategoryId: 's1', weight: 0 },
  }
  const rows = [
    { metricDefinitionId: 'a', ragStatus: 'green', normalizedScore: 80 },
    { metricDefinitionId: 'b', ragStatus: 'green', normalizedScore: 60 },
    { metricDefinitionId: 'c', ragStatus: 'green', normalizedScore: 100 },
  ]
  const ag = mafAggregateSubCategories(rows, defs)
  const { score, rag } = mafSubCategoryScoreFromAgg(ag.s1, G, A)
  assert.equal(score, 70)
  assert.equal(rag, 'amber')
  assert.equal(ag.s1.total, 3)
  assert.equal(ag.s1.green, 3)
})

test('weight drift 0.97: wSum-tolerant average', () => {
  const defs = {
    a: { subCategoryId: 's1', weight: 0.5 },
    b: { subCategoryId: 's1', weight: 0.47 },
  }
  const rows = [
    { metricDefinitionId: 'a', ragStatus: 'green', normalizedScore: 100 },
    { metricDefinitionId: 'b', ragStatus: 'green', normalizedScore: 0 },
  ]
  const ag = mafAggregateSubCategories(rows, defs)
  const { score } = mafSubCategoryScoreFromAgg(ag.s1, G, A)
  assert.equal(score, mafRound2(50 / 0.97))
})

test('all metric weights zero: score 0, no NaN', () => {
  const defs = {
    a: { subCategoryId: 's1', weight: 0 },
  }
  const ag = mafAggregateSubCategories(
    [{ metricDefinitionId: 'a', ragStatus: 'green', normalizedScore: 50 }],
    defs,
  )
  const { score } = mafSubCategoryScoreFromAgg(ag.s1, G, A)
  assert.equal(score, 0)
})

test('error metrics: excluded from weighted sum, error count', () => {
  const defs = {
    a: { subCategoryId: 's1', weight: 0.5 },
    b: { subCategoryId: 's1', weight: 0.5 },
  }
  const ag = mafAggregateSubCategories(
    [
      { metricDefinitionId: 'a', ragStatus: 'error', normalizedScore: null },
      { metricDefinitionId: 'b', ragStatus: 'green', normalizedScore: 80 },
    ],
    defs,
  )
  assert.equal(ag.s1.error, 1)
  assert.equal(ag.s1.green, 1)
  const { score } = mafSubCategoryScoreFromAgg(ag.s1, G, A)
  assert.equal(score, 80)
})

test('multi sub-category → category weighted average', () => {
  const subAggs = mafAggregateSubCategories(
    [
      { metricDefinitionId: 'a', ragStatus: 'green', normalizedScore: 100 },
      { metricDefinitionId: 'b', ragStatus: 'green', normalizedScore: 0 },
    ],
    {
      a: { subCategoryId: 's1', weight: 1 },
      b: { subCategoryId: 's2', weight: 1 },
    },
  )
  const subMeta = {
    s1: { categoryId: 'c1', weightInCategory: 0.5 },
    s2: { categoryId: 'c1', weightInCategory: 0.5 },
  }
  const catAg = mafRollSubScoresIntoCategories(subMeta, subAggs, G, A)
  const { score } = mafCategoryScoreFromAgg(catAg.c1, G, A)
  assert.equal(score, 50)
})

test('threshold boundary: green at exactly greenTh', () => {
  const agg = { wSum: 1, weighted: 75, total: 1, green: 1, amber: 0, red: 0, error: 0 }
  const { rag } = mafSubCategoryScoreFromAgg(agg, 75, 50)
  assert.equal(rag, 'green')
})

/** PRD §4.6 — singleSubCategory: 1 category, 1 sub, 3 metrics; category score equals sub-category score */
test('singleSubCategory: category score equals lone sub-category score', () => {
  const defs = {
    m1: { subCategoryId: 's1', weight: 0.2 },
    m2: { subCategoryId: 's1', weight: 0.3 },
    m3: { subCategoryId: 's1', weight: 0.5 },
  }
  const rows = [
    { metricDefinitionId: 'm1', ragStatus: 'green', normalizedScore: 100 },
    { metricDefinitionId: 'm2', ragStatus: 'green', normalizedScore: 80 },
    { metricDefinitionId: 'm3', ragStatus: 'green', normalizedScore: 60 },
  ]
  const subAg = mafAggregateSubCategories(rows, defs)
  const subMeta = { s1: { categoryId: 'c1', weightInCategory: 1 } }
  const catAg = mafRollSubScoresIntoCategories(subMeta, subAg, G, A)
  const sub = mafSubCategoryScoreFromAgg(subAg.s1, G, A)
  const cat = mafCategoryScoreFromAgg(catAg.c1, G, A)
  assert.equal(sub.score, cat.score)
  assert.equal(sub.score, 74)
})

/** PRD §4.6 — multiSubCategory: 3 subs, varying counts (explicit expected category rollup) */
test('multiSubCategory: three sub-categories with unequal metric counts', () => {
  const defs = {
    a: { subCategoryId: 's1', weight: 1 },
    b: { subCategoryId: 's2', weight: 1 },
    c: { subCategoryId: 's2', weight: 1 },
    d: { subCategoryId: 's3', weight: 1 },
  }
  const rows = [
    { metricDefinitionId: 'a', ragStatus: 'green', normalizedScore: 100 },
    { metricDefinitionId: 'b', ragStatus: 'green', normalizedScore: 0 },
    { metricDefinitionId: 'c', ragStatus: 'green', normalizedScore: 100 },
    { metricDefinitionId: 'd', ragStatus: 'green', normalizedScore: 50 },
  ]
  const subAg = mafAggregateSubCategories(rows, defs)
  const subMeta = {
    s1: { categoryId: 'c1', weightInCategory: 0.25 },
    s2: { categoryId: 'c1', weightInCategory: 0.25 },
    s3: { categoryId: 'c1', weightInCategory: 0.5 },
  }
  const catAg = mafRollSubScoresIntoCategories(subMeta, subAg, G, A)
  const { score } = mafCategoryScoreFromAgg(catAg.c1, G, A)
  assert.equal(score, 62.5)
})

/** PRD §4.6 — errorMetrics: 2 errors, 3 green; errors excluded from weighted sum */
test('errorMetrics: two errors and three greens', () => {
  const defs = {
    e1: { subCategoryId: 's1', weight: 0.2 },
    e2: { subCategoryId: 's1', weight: 0.2 },
    g1: { subCategoryId: 's1', weight: 0.2 },
    g2: { subCategoryId: 's1', weight: 0.2 },
    g3: { subCategoryId: 's1', weight: 0.2 },
  }
  const ag = mafAggregateSubCategories(
    [
      { metricDefinitionId: 'e1', ragStatus: 'error', normalizedScore: null },
      { metricDefinitionId: 'e2', ragStatus: 'error', normalizedScore: null },
      { metricDefinitionId: 'g1', ragStatus: 'green', normalizedScore: 100 },
      { metricDefinitionId: 'g2', ragStatus: 'green', normalizedScore: 100 },
      { metricDefinitionId: 'g3', ragStatus: 'green', normalizedScore: 100 },
    ],
    defs,
  )
  assert.equal(ag.s1.error, 2)
  assert.equal(ag.s1.green, 3)
  assert.equal(ag.s1.total, 5)
  const { score } = mafSubCategoryScoreFromAgg(ag.s1, G, A)
  assert.equal(score, 100)
})

/** PRD §4.6 — mixedRag: counters for green / amber / red */
test('mixedRag: green amber red counters on sub-category', () => {
  const defs = {
    r1: { subCategoryId: 's1', weight: 0.25 },
    r2: { subCategoryId: 's1', weight: 0.25 },
    r3: { subCategoryId: 's1', weight: 0.25 },
    r4: { subCategoryId: 's1', weight: 0.25 },
  }
  const ag = mafAggregateSubCategories(
    [
      { metricDefinitionId: 'r1', ragStatus: 'green', normalizedScore: 100 },
      { metricDefinitionId: 'r2', ragStatus: 'amber', normalizedScore: 60 },
      { metricDefinitionId: 'r3', ragStatus: 'red', normalizedScore: 20 },
      { metricDefinitionId: 'r4', ragStatus: 'green', normalizedScore: 80 },
    ],
    defs,
  )
  assert.equal(ag.s1.green, 2)
  assert.equal(ag.s1.amber, 1)
  assert.equal(ag.s1.red, 1)
})

/** PRD §4.6 — emptyRun: no category aggregates when nothing rolls up */
test('emptyRun: no metric rows yields empty category aggregates', () => {
  const subAg = mafAggregateSubCategories([], {})
  const catAg = mafRollSubScoresIntoCategories({ s1: { categoryId: 'c1', weightInCategory: 1 } }, subAg, G, A)
  assert.deepEqual(catAg, {})
})
