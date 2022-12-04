import { getDataForDay } from './utils'
import { range } from 'lodash'

const data = await getDataForDay(4)

const duplicatedSections = (overLap) => {
  return data.split('\n').reduce((sum, pair) => {
    const area = pair.split(',').map(x => x.split('-').map(x => Number(x)))

    const area1 = range(area[0][0], area[0][1] + 1)
    const area2 = range(area[1][0], area[1][1] + 1)

    return overLap(area1, area2) ? sum + 1 : sum
  }, 0)
}

const fullOverLap = (area1: number[], area2: number[]) => {
  return (
    area1.every(val => area2.includes(val)) ||
    area2.every(val => area1.includes(val))
  )
}

const someOverLap = (area1: number[], area2: number[]) => {
  return (
    area1.some(val => area2.includes(val)) ||
    area2.some(val => area1.includes(val))
  )
}

console.log('Answer part 1: ', duplicatedSections(fullOverLap))
console.log('Answer part 2: ', duplicatedSections(someOverLap))
