import { describe, expect, it } from 'bun:test'
import { comparePair } from '../src/13'

describe('Compare packages', () => {
  it('Compare [1,1,3,1,1] vs [1,1,5,1,1]', () => {
    expect(comparePair([1, 1, 3, 1, 1], [1, 1, 5, 1, 1])).toBe(true)
  })

  it('Compare [[1],[2,3,4]] vs [[1],4]', () => {
    expect(comparePair([[1], [2, 3, 4]], [[1], 4])).toBe(true)
  })

  it('Compare [9] vs [[8,7,6]]', () => {
    expect(comparePair([9], [[8, 7, 6]])).toBe(false)
  })

  it('Compare [[4,4],4,4] vs [[4,4],4,4,4]', () => {
    expect(comparePair([[4, 4], 4, 4], [[4, 4], 4, 4, 4])).toBe(true)
  })

  it('Compare [7,7,7,7] vs [7,7,7]', () => {
    expect(comparePair([7, 7, 7, 7], [7, 7, 7])).toBe(false)
  })

  it('Compare [] vs [3]', () => {
    expect(comparePair([], [3])).toBe(true)
  })

  it('Compare [[[]]] vs [[]]', () => {
    expect(comparePair([[[]]], [[]])).toBe(false)
  })

  it('Compare [1,[2,[3,[4,[5,6,7]]]],8,9] vs [1,[2,[3,[4,[5,6,0]]]],8,9]', () => {
    expect(
      comparePair(
        [1, [2, [3, [4, [5, 6, 7]]]], 8, 9],
        [1, [2, [3, [4, [5, 6, 0]]]], 8, 9]
      )
    ).toBe(false)
  })

  it('Compare [1] vs [[],6,3,6,9]', () => {
    expect(comparePair([1], [[], 6, 3, 6, 9])).toBe(false)
  })
})
