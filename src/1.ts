import { getDataForDay } from './utils'

const data = await getDataForDay(1)

const sumOfFattestElves = (numOfElves: number) => {
  return data
    .split('\n\n')
    .map(elf => elf.split('\n').reduce((sum, food) => sum + Number(food), 0))
    .sort((a, b) => b - a)
    .slice(0, numOfElves)
    .reduce((sum, elfCals) => sum + elfCals, 0)
}

console.log('Fattest elf: ', sumOfFattestElves(1))
console.log('Three fattest elves: ', sumOfFattestElves(3))
