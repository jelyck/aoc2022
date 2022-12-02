import { getDataForDay } from './utils'

const data = await getDataForDay(2)

const task = pointsMap => {
  return data.split('\n').reduce((sum, row) => {
    const game = row.split(' ')
    const elf = game[0]
    const me = game[1]
    sum += pointsMap[me].handPoint
    sum += pointsMap[me].gamePoints[elf]
    return sum
  }, 0)
}

const task2 = handsMap => {
  return data.split('\n').reduce((sum, row) => {
    const game = row.split(' ')
    const elf = game[0]
    const outcome = game[1]
    sum += handsMap[outcome].gamePoints
    sum += handsMap[handsMap[outcome].forcedHands[elf]].handPoints
    return sum
  }, 0)
}

// Stone: A, X
// Paper: B, Y
// Scissor: C, Z

const pointsMap = {
  X: {
    handPoint: 1,
    gamePoints: {
      A: 3,
      B: 0,
      C: 6
    }
  },
  Y: {
    handPoint: 2,
    gamePoints: {
      A: 6,
      B: 3,
      C: 0
    }
  },
  Z: {
    handPoint: 3,
    gamePoints: {
      A: 0,
      B: 6,
      C: 3
    }
  }
}

const pointsMap2 = {
  X: {
    handPoints: 1,
    gamePoints: 0,
    forcedHands: {
      A: 'Z',
      B: 'X',
      C: 'Y'
    }
  },
  Y: {
    handPoints: 2,
    gamePoints: 3,
    forcedHands: {
      A: 'X',
      B: 'Y',
      C: 'Z'
    }
  },
  Z: {
    handPoints: 3,
    gamePoints: 6,
    forcedHands: {
      A: 'Y',
      B: 'Z',
      C: 'X'
    }
  }
}

console.log('Answer part 1: ', task(pointsMap))
console.log('Answer part 2: ', task2(pointsMap2))
