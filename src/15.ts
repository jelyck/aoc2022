import { range } from 'lodash'
import { getDataForDay } from './utils'

const data = await getDataForDay(15)

const task = (y: number) => {
  const positions = sensorReport(data)

  const uniquePositions = checkPositions(positions, y)

  return uniquePositions.size
}

const checkPositions = (positions, row) => {
  const unique = new Set<number>()

  const reaching = positions.filter(pos => pos.sy + pos.d >= row)

  for (const position of reaching) {
    const distanceToRow = Math.abs(position.sy - row)
    const distanceRemain = position.d - distanceToRow

    if (distanceRemain > 0) {
      range(
        position.sx - distanceRemain,
        position.sx + distanceRemain + 1
      ).forEach(x => unique.add(x))
    }
  }

  for (const pos of positions) {
    if (pos.by === row) {
      unique.delete(pos.bx)
    }

    if (pos.sy === row) {
      unique.delete(pos.sx)
    }
  }

  return unique
}

const sensorReport = (data: string) => {
  const regex = /^Sensor.*x=(-?\d+).*y=(-?\d+).*beacon.*x=(-?\d+).*y=(-?\d+)/
  return data.split('\n').map(row => {
    const [sx, sy, bx, by] = row.match(regex).slice(1).map(Number)
    const d = Math.abs(bx - sx) + Math.abs(by - sy)
    return { sx, sy, bx, by, d }
  })
}

console.log('Answer part 1:', task(2000000))
