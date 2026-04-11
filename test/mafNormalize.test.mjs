import assert from 'node:assert/strict'
import test from 'node:test'
import {
  mafNormalizeMetricScore,
  mafMetricRagFromRaw,
} from '../src/pure/mafNormalize.js'

test('higher_is_better: raw at zero maps to 0 score and red RAG', () => {
  var o = mafNormalizeMetricScore(0, 60, 80, 100, true)
  assert.equal(o.score, 0)
  assert.equal(o.rag, 'red')
})

test('higher_is_better: raw at red threshold is top of worst band', () => {
  var o = mafNormalizeMetricScore(60, 60, 80, 100, true)
  assert.equal(o.score, 33)
  assert.equal(o.rag, 'red')
})

test('higher_is_better: mid amber band', () => {
  var o = mafNormalizeMetricScore(70, 60, 80, 100, true)
  assert.equal(o.score, 50)
  assert.equal(o.rag, 'amber')
})

test('higher_is_better: at amber threshold is green RAG and 66 score', () => {
  var o = mafNormalizeMetricScore(80, 60, 80, 100, true)
  assert.equal(o.score, 66)
  assert.equal(o.rag, 'green')
})

test('higher_is_better: between amber and target', () => {
  var o = mafNormalizeMetricScore(90, 60, 80, 100, true)
  assert.equal(o.score, 83)
  assert.equal(o.rag, 'green')
})

test('higher_is_better: at or above target is 100', () => {
  assert.equal(mafNormalizeMetricScore(100, 60, 80, 100, true).score, 100)
  assert.equal(mafNormalizeMetricScore(120, 60, 80, 100, true).score, 100)
})

test('lower_is_better: at or below target is 100 and green', () => {
  var o = mafNormalizeMetricScore(1, 8, 4, 2, false)
  assert.equal(o.score, 100)
  assert.equal(o.rag, 'green')
})

test('lower_is_better: between target and amber (score mid-band, RAG green when raw <= amber)', () => {
  var o = mafNormalizeMetricScore(3, 8, 4, 2, false)
  assert.equal(o.score, 83)
  assert.equal(o.rag, 'green')
})

test('lower_is_better: strictly between amber and red thresholds (amber RAG)', () => {
  var o = mafNormalizeMetricScore(5, 8, 4, 2, false)
  assert.equal(o.rag, 'amber')
})

test('lower_is_better: between amber and red (score band)', () => {
  var o = mafNormalizeMetricScore(6, 8, 4, 2, false)
  assert.equal(o.score, 50)
  assert.equal(o.rag, 'amber')
})

test('lower_is_better: at red threshold', () => {
  var o = mafNormalizeMetricScore(8, 8, 4, 2, false)
  assert.equal(o.score, 33)
  assert.equal(o.rag, 'red')
})

test('lower_is_better: beyond red deepens penalty', () => {
  var o = mafNormalizeMetricScore(16, 8, 4, 2, false)
  assert.equal(o.score, 16.5)
  assert.equal(o.rag, 'red')
})

test('metric RAG: higher_is_better boundary at amber', () => {
  assert.equal(mafMetricRagFromRaw(79, 60, 80, true), 'amber')
  assert.equal(mafMetricRagFromRaw(80, 60, 80, true), 'green')
})
