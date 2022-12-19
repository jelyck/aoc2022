import { getDataForDay } from './utils'

const restingGrains = (cave: string[][]): number => {
  const x = cave[0].indexOf('x')

  let resting = 0

  try {
    while (true) {
      sand(cave, x)
      resting++
    }
  } catch (e) {
    plotCave(cave)
    console.log(e.message)
  }

  return resting
}

const sand = (cave: string[][], x: number, trace = true): void => {
  for (let i = 1; i < cave.length; i++) {
    if (trace) cave[i][x] = '~'

    if (i + 1 === cave.length) {
      throw new Error('Falling towards an endless void :(\n')
    }

    if (cave[i + 1][x] === '#' || cave[i + 1][x] === 'o') {
      const l = cave[i + 1][x - 1]
      const r = cave[i + 1][x + 1]

      if (l === '.' || l === '~') {
        x = x - 1
      } else if (r === '.' || r === '~') {
        x = x + 1
      } else {
        cave[i][x] = 'o'
        break
      }
    }
  }
}

const restingGrainsWithFloor = (cave: string[][], plot = false): number => {
  const x = cave[0].indexOf('x')

  cave[0][x] = 'o'
  let resting = 1

  for (let i = 1; i < cave.length; i++) {
    for (let j = 0; j < cave[i].length; j++) {
      if (
        cave[i - 1][j + 1] === 'o' ||
        cave[i - 1][j - 1] === 'o' ||
        cave[i - 1][j] === 'o'
      ) {
        if (cave[i][j] !== '#') {
          cave[i][j] = 'o'
          resting++
        }
      }
    }
  }

  if (plot) plotCave(cave)

  return resting
}

const createCave = (data: string): string[][] => {
  const input = data.split('\n').map(row => row.split(' -> '))

  let ymax = 0
  for (const row of input) {
    for (const col of row) {
      const y = col.split(',').map(Number)[1]
      if (y > ymax) ymax = y
    }
  }

  const cave = []
  for (let i = 0; i <= ymax; i++) {
    cave.push(Array(1000).fill('.'))
  }

  for (let i = 0; i < input.length; i++) {
    for (let j = 0; j < input[i].length - 1; j++) {
      let [x1, y1] = input[i][j + 1].split(',').map(Number)
      let [x2, y2] = input[i][j].split(',').map(Number)

      if (y1 === y2 && x1 > x2) cave[y1].fill('#', x2, x1 + 1)
      if (y1 === y2 && x1 < x2) cave[y1].fill('#', x1, x2 + 1)
      if (x1 === x2 && y1 > y2) for (let i = y2; i < y1; i++) cave[i][x1] = '#'
      if (x1 === x2 && y1 < y2) for (let i = y1; i < y2; i++) cave[i][x1] = '#'
    }
  }

  cave[0][500] = 'x'
  return cave
}

const createCaveWithFloor = (data: string): string[][] => {
  const cave = createCave(data)

  cave.push(Array(cave[0].length).fill('.'))
  cave.push(Array(cave[0].length).fill('#'))

  return cave
}

const plotCave = (cave: string[][]): void => {
  let xmin = 500
  let xmax = 500

  for (let i = 0; i < cave.length - 1; i++) {
    const min = Math.min(cave[i].indexOf('o'), cave[i].indexOf('#'))
    const max = Math.max(cave[i].lastIndexOf('o'), cave[i].lastIndexOf('#'))
    xmin = min < xmin && min > 0 ? min : xmin
    xmax = max > xmax && max < 1000 ? max : xmax
  }

  for (let i = 0; i < cave.length; i++) {
    console.log(cave[i].slice(xmin - 5, xmax + 5).join(''))
  }
}

const data = await getDataForDay(14)
console.log('Answer part 1:', restingGrains(createCave(data)))
console.log('Answer part 2:', restingGrainsWithFloor(createCaveWithFloor(data)))
