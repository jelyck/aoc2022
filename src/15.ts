import { range } from 'lodash'
import { getDataForDay } from './utils'

type SensorReport = {
  sx: number
  sy: number
  bx: number
  by: number
  d: number
}

type Position = {
  x: number
  y: number
}

type SearchInterval = { min: number; max: number }

const task = (positions: SensorReport[], y: number) => {
  const uniquePositions = checkPositions(positions, y)

  return uniquePositions.size
}

const task2 = (positions: SensorReport[], search: SearchInterval) => {
  const emptyPos = searchAdjencyForEmpty(positions, search)

  return calcTuningFrequency(emptyPos)
}

const searchAdjencyForEmpty = (
  positions: SensorReport[],
  search: SearchInterval
): Position => {
  for (const position of positions) {
    // Create lists of all ys scanned by sensor
    // Include one extra to check beneath/above
    const ys = range(
      position.sy - position.d - 1,
      position.sy + position.d + 1 + 1
    ).filter(y => y >= search.min && y <= search.max)

    for (const y of ys) {
      // Calc remaining x depending on y
      const distanceToRow = Math.abs(position.sy - y)
      const distanceRemain = position.d - distanceToRow

      // Can be one y outside
      if (distanceRemain >= -1) {
        // Increase with one to check outside left/right
        // Will also check the outside beneath and above
        const lPos = { x: position.sx - distanceRemain - 1, y }
        const rPos = { x: position.sx + distanceRemain + 1, y }

        // Only check squares within interval
        if (lPos.x >= search.min && rPos.x <= search.max) {
          if (!isSquareCoveredBySensor(positions, lPos)) return lPos
          if (!isSquareCoveredBySensor(positions, rPos)) return rPos
        }
      }
    }
  }
}

const isSquareCoveredBySensor = (
  positions: SensorReport[],
  square: Position
): boolean => {
  for (const pos of positions) {
    const distance = calcManhattanDistance(
      { x: pos.sx, y: pos.sy },
      { x: square.x, y: square.y }
    )
    if (distance <= pos.d) return true
  }
  return false
}

const calcTuningFrequency = (pos: Position): number => {
  return pos.x * 4000000 + pos.y
}

const checkPositions = (positions: SensorReport[], y: number): Set<number> => {
  // Set to store positions for row
  const unique = new Set<number>()

  for (const position of positions) {
    // Due to manhattan, every step in y will decrease x
    const distanceToRow = Math.abs(position.sy - y)
    const distanceRemain = position.d - distanceToRow

    // Only rows that reach are relevant.
    if (distanceRemain >= 0) {
      range(
        position.sx - distanceRemain,
        position.sx + distanceRemain + 1
      ).forEach(x => unique.add(x))
    }
  }

  // Range above can include both sensors and
  // beacons. Delete beacon if already exists.
  // Beacons can't be where there is a sensor.
  for (const pos of positions) {
    if (pos.by === y) unique.delete(pos.bx)
  }

  return unique
}

const sensorReport = (data: string): SensorReport[] => {
  const regex = /^Sensor.*x=(-?\d+).*y=(-?\d+).*beacon.*x=(-?\d+).*y=(-?\d+)/
  return data.split('\n').map(row => {
    const [sx, sy, bx, by] = row.match(regex).slice(1).map(Number)
    const d = calcManhattanDistance({ x: sx, y: sy }, { x: bx, y: by })
    return { sx, sy, bx, by, d }
  })
}

const calcManhattanDistance = (from: Position, to: Position): number => {
  return Math.abs(to.x - from.x) + Math.abs(to.y - from.y)
}

const data = await getDataForDay(15)
const positions = sensorReport(data)

const rowNum: number = 2000000
const search: SearchInterval = { min: 0, max: 4000000 }

console.log('Answer part 1:', task(positions, rowNum))
console.log('Answer part 2:', task2(positions, search))
