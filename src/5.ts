import { getDataForDay } from './utils'
import { range } from 'lodash'

const data = await getDataForDay(5)

const reArrangeStacks = crateMover => {
  const { stacks, instructions } = createStacksAndInstructions(data)

  instructions.forEach(instruction => {
    crateMover(stacks, instruction)
  })

  return stacks.reduce((sum, stack) => sum + stack[stack.length - 1], '')
}

// [N]     [C]                 [Q]
// [W]     [J] [L]             [J] [V]
// [F]     [N] [D]     [L]     [S] [W]
// [R] [S] [F] [G]     [R]     [V] [Z]
// [Z] [G] [Q] [C]     [W] [C] [F] [G]
// [S] [Q] [V] [P] [S] [F] [D] [R] [S]
// [M] [P] [R] [Z] [P] [D] [N] [N] [M]
// [D] [W] [W] [F] [T] [H] [Z] [W] [R]
//  1   2   3   4   5   6   7   8   9

// move 1 from 3 to 9
// move 3 from 5 to 3
// move 4 from 2 to 5

const createStacksAndInstructions = data => {
  const rawStacksAndInstructions = data.split('\n\n')

  const stackData = rawStacksAndInstructions[0]
    .split('\n')
    .map(x => x.match(/.{1,4}/g).map(x => x.replace(/\W/g, '')))

  const stacks = stackData
    .map((v, i) => stackData.map(row => row[i]).reverse())
    .map(stack => stack.filter(nonEmpty => nonEmpty))
    .map(stack => stack.splice(1))

  const instructions = rawStacksAndInstructions[1]
    .split('\n')
    .map(row => row.match(/\d+/g).map(x => Number(x)))

  return { stacks, instructions }
}

const crateMover9000 = (stacks, instruction) => {
  const numOfCrates = instruction[0]
  const fromIndex = instruction[1] - 1
  const toIndex = instruction[2] - 1

  range(numOfCrates).forEach(i => {
    stacks[toIndex].push(stacks[fromIndex].pop())
  })
}

const crateMover9001 = (stacks, instruction) => {
  const numOfCrates = instruction[0]
  const fromIndex = instruction[1] - 1
  const toIndex = instruction[2] - 1

  stacks[toIndex].push(...stacks[fromIndex].splice(-numOfCrates))
}

console.log('Answer part 1: ', reArrangeStacks(crateMover9000))
console.log('Answer part 2: ', reArrangeStacks(crateMover9001))
