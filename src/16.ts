import { getDataForDay } from './utils'

const openingAlone = () => {
  const valves = createValves(data)
  const paths = getShortestPaths(valves)

  const released = findPressure(valves, paths, 30)

  return released[0][1]
}

const openingWithCuteElephant = () => {
  const valves = createValves(data)
  const paths = getShortestPaths(valves)

  const released = findPressure(valves, paths, 26)

  let maxReleased = 0
  for (let i = 1; i < released.length; i++) {
    for (let j = 0; j < i; j++) {
      const openedByMe = released[i][0]
      const openedByCuteElepanth = released[j][0]

      const releasedByMe = released[i][1]
      const releasedByCuteElepanth = released[j][1]

      const totalReleased = releasedByMe + releasedByCuteElepanth

      // Sorted descending. If less than max
      // already then we won't find more.
      if (totalReleased < maxReleased) break

      // Can't open the same valves, so continue.
      if (openedByMe & openedByCuteElepanth) continue

      // If not the same valve and more released update max.
      if (totalReleased > maxReleased) maxReleased = totalReleased
    }
  }

  return maxReleased
}

const findPressure = (valves, paths, totalTime) => {
  const pressure = []
  const unvisited = []

  unvisited.push([0, 'AA', totalTime, 0])

  while (unvisited.length > 0) {
    const [opened, valve, timeRemain, released] = unvisited.shift()

    Object.keys(paths[valve]).forEach(key => {
      // Bitwise check to make sure we don't visit
      // and open the same valve twice in each path.
      if (opened & valves[key].id) return

      // Calculate what time will be after moving the
      // shortest path to next valve and opening it.
      const moveTime = paths[valve][valves[key].from]
      const nextTime = timeRemain - moveTime - 1

      // Calculate new total amount of pressure released.
      const nowReleased = released + nextTime * valves[key].rate

      // Add binary id to keep track of which
      // valves that have been open in each path.
      const nowOpened = opened + valves[key].id

      // Push next valve and calcs to queue.
      const nextValve = valves[key].from
      if (nextTime > 0) {
        unvisited.push([nowOpened, nextValve, nextTime, nowReleased])
      }

      // Save valves opened and total pressure
      // released for the different paths
      pressure.push([nowOpened, released])
    })
  }

  return pressure.sort((a, b) => b[1] - a[1])
}

const getShortestPaths = valves => {
  const getShortestPath = (valves, start) => {
    const visited = {}
    const unvisited = []

    unvisited.push([valves[start], 0])

    while (unvisited.length > 0) {
      const [next, steps] = unvisited.shift()

      // Check if already visited and update steps if
      // not or if path is shorter than previous.
      if (next.from in visited) {
        if (steps >= visited[next.from]) {
          continue
        }
      }
      visited[next.from] = steps

      // Push new valves and new steps.
      Object.keys(next.to).forEach(key =>
        unvisited.push([valves[key], next.to[key] + steps])
      )
    }

    delete visited[start]
    return visited
  }

  // Create map of shortest paths to all openable
  // connecting valves from each valve.
  return Object.keys(valves).reduce((paths, key) => {
    paths[key] = getShortestPath(valves, key)
    return paths
  }, {})
}

const createValves = (data: string) => {
  const mapTo = (valve, start, path = {}, steps = 1) => {
    Object.keys(valve.to).forEach(key => {
      if (key !== start) {
        if (key in path) {
          path[key] = Math.min(path[key], steps)
        } else if (input[key].rate > 0) {
          path[key] = steps
        } else {
          path[key] = steps
          const next = input[key]
          mapTo(next, start, path, steps + 1)
        }
      }
    })
    return path
  }

  const cleanUpTo = valve => {
    Object.keys(valve.to).forEach(v => {
      if (valves[v].rate === 0) {
        delete valve.to[v]
      }
    })
    return valve.to
  }

  const addBinaryIds = valves => {
    let id = 1
    Object.keys(valves).forEach(key => {
      if (valves[key].rate > 0) {
        valves[key].id = id
        id *= 2
      }
    })
  }

  const regex = /Valve\s(\w+).*rate=(\d+).*valves?\s(.*)/gm
  const matches = data.matchAll(regex)

  const input = {}
  for (const match of matches) {
    const [from, rate, to] = match.slice(1)
    input[from] = {
      from,
      to: to.split(', ').reduce((to, t) => {
        return { ...to, [t]: null }
      }, {}),
      rate: +rate
    }
  }

  const valves = Object.keys(input).reduce((valves, key) => {
    valves[key] = {
      from: key,
      to: mapTo(input[key], key),
      rate: input[key].rate
    }
    return valves
  }, {})

  Object.keys(valves).forEach(key => {
    valves[key].to = cleanUpTo(valves[key])
  })

  addBinaryIds(valves)

  return valves
}

const data = await getDataForDay(16)

console.log('Answer part 1:', openingAlone())
console.log('Answer part 2:', openingWithCuteElephant())

// Based on solution created by yongjun21
// https://github.com/yongjun21
