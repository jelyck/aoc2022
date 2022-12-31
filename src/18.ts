import { getDataForDay } from './utils'

const task = (data: string) => {
  const cubes = createCubes(data)
  return openCubeSides(cubes)
}

const task2 = (data: string) => {
  const cubes = createCubes(data)
  return openExteriorCubeSides(cubes)
}

/**
 * Create a set of cubes
 * for the droplet.
 * @param data
 * @returns cubes
 */
const createCubes = (data: string) => {
  const cubes = new Set<string>()
  data.split('\n').forEach((x: string) => cubes.add(x))
  return cubes
}

/**
 * Find all adjacent cubes.
 * @param cube
 * @returns adjacent cubes
 */
const adjacent = (cube: string): string[] => {
  const [x, y, z] = cube.split(',').map(Number)

  const cubes = []
  cubes.push([x - 1, y, z].toString())
  cubes.push([x + 1, y, z].toString())
  cubes.push([x, y - 1, z].toString())
  cubes.push([x, y + 1, z].toString())
  cubes.push([x, y, z + 1].toString())
  cubes.push([x, y, z - 1].toString())

  return cubes
}

/**
 * Calculate all open cube sides
 * for the cubes in the droplet.
 * @param cubes
 * @returns sum
 */
const openCubeSides = (cubes: Set<string>): number => {
  return Array.from(cubes).reduce((total, cube) => {
    return (total += adjacent(cube).reduce((open, adj) => {
      return (open -= cubes.has(adj) ? 1 : 0)
    }, 6))
  }, 0)
}

/**
 * Calc min and max of the droplet.
 * @param cubes
 * @returns min, max
 */
const calcMinMax = (cubes: Set<string>) => {
  let min = Infinity
  let max = -Infinity

  for (const cube of cubes) {
    let [x, y, z] = cube.split(',').map(Number)
    min = Math.min(min, x, y, z)
    max = Math.max(max, x, y, z)
  }

  return { min, max }
}

/**
 * Check if the cube is outside
 * of the min and max values.
 * @param cube
 * @param min
 * @param max
 * @returns true or false
 */
const outside = (cube: string, min: number, max: number) => {
  return cube.split(',').some((coord: any) => {
    if (Number(coord) < min - 1) return true
    if (Number(coord) > max + 1) return true
    return false
  })
}

/**
 * Search for and calculate the sum of
 * all exterior surface cube sides.
 * @param cubes
 * @returns sum
 */
const openExteriorCubeSides = (cubes: Set<string>) => {
  const { min, max } = calcMinMax(cubes)

  let visited = new Set()

  let surfaceArea = 0

  // Start outside of droplet. If we make
  // sure to never enter droplet cubes then
  // we won't reach any air pockets.
  let queue = [[min, min, min].join(',')]

  while (queue.length > 0) {
    const cube = queue.shift()

    // Continue if already visited.
    if (visited.has(cube)) continue

    // Make sure we dont enter droplet.
    if (cubes.has(cube)) continue

    // Make sure we don't go outside max/min
    if (outside(cube, min, max)) continue

    // Check all adjecent cubes.
    adjacent(cube).forEach(adj => {
      // If adj in droplet, we
      // found an open surface.
      if (cubes.has(adj)) {
        surfaceArea++
      }
      // Push to queue
      queue.push(adj)
    })

    visited.add(cube)
  }

  return surfaceArea
}

const data = await getDataForDay(18)

console.log('Answer part 1: ', task(data))
console.log('Answer part 2: ', task2(data))
