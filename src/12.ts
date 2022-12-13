import { getDataForDay } from './utils'

type Child = { index: string; cost: number }

type Graph = {
  node: {
    children: Child[]
    hight: string
  }
}

const climbMountain = (graph, start, end) => {
  return dijkstra(graph, start, end)
}

const nextNode = (distances, visited) => {
  const unvisited = Object.keys(distances).filter(
    node => !visited.includes(node)
  )
  if (!unvisited.length) return null
  return unvisited.reduce((nextNode, node) =>
    distances[nextNode] < distances[node] ? nextNode : node
  )
}

const createTracking = (startNodes, endNode) => {
  const distances = { [endNode]: Infinity }
  const parents = { endNode: null }

  startNodes.forEach(startNode => {
    for (const child of graph[startNode].children) {
      if (!startNodes.some(node => node === child.index))
        distances[child.index] = child.cost
    }
    for (let child of graph[startNode].children) {
      if (!startNodes.some(node => node === child.index))
        parents[child.index] = startNode
    }
  })

  return { distances, parents }
}

const dijkstra = (graph: Graph, start: string, end: string) => {
  const startNodes = Object.keys(graph).filter(
    key => graph[key].hight === start
  )
  const endNode = Object.keys(graph).find(key => graph[key].hight === end)
  const { distances, parents } = createTracking(startNodes, endNode)

  let node
  const visited = []

  while ((node = nextNode(distances, visited))) {
    const distance = distances[node]
    const children = graph[node].children

    for (const child of children) {
      if (startNodes.some(node => node === child.index)) continue

      const newdistance = distance + child.cost
      if (!distances[child.index] || newdistance < distances[child.index]) {
        distances[child.index] = newdistance
        parents[child.index] = node
      }
    }

    visited.push(node)
  }

  const shortestPath = [endNode]
  let parent = parents[endNode]

  while (parent) {
    shortestPath.push(parent)
    parent = parents[parent]
  }

  const results = {
    distance: distances[endNode],
    path: shortestPath.reverse()
  }

  plotPath(graph, results.path)
  return results.distance
}

const createGraph = (data: string) => {
  const matrix: string[][] = data.split('\n').map((x: string) => [...x])

  const isReachable = (square, child) => {
    if (square === 'S') square = 'a'
    if (child === 'S') child = 'a'

    if (square === 'E') square = 'z'
    if (child === 'E') child = 'z'

    return child.charCodeAt(0) - square.charCodeAt(0) <= 1
  }

  return matrix.reduce((map, row, i) => {
    return Object.assign(map, {
      ...row.reduce((rowMap, square, j) => {
        const cost = 1
        const children = []

        if (i > 0) {
          const child = matrix[i - 1][j]
          const index = i - 1 + ':' + j
          if (isReachable(square, child)) {
            children.push({ index, cost })
          }
        }

        if (i < matrix.length - 1) {
          const child = matrix[i + 1][j]
          const index = i + 1 + ':' + j
          if (isReachable(square, child)) {
            children.push({ index, cost })
          }
        }

        if (j > 0) {
          const child = matrix[i][j - 1]
          const index = i + ':' + (j - 1)
          if (isReachable(square, child)) {
            children.push({ index, cost })
          }
        }

        if (j < matrix[i].length - 1) {
          const child = matrix[i][j + 1]
          const index = i + ':' + (j + 1)
          if (isReachable(square, child)) {
            children.push({ index, cost })
          }
        }

        const node = i + ':' + j
        return Object.assign(rowMap, {
          [node]: { hight: square, children }
        })
      }, {})
    })
  }, {})
}

const plotPath = (map, path) => {
  const plot = Object.keys(map)
    .map(square => square.split(':')[0])
    .map((_, i, a) => a.filter(r => Number(r) === i).map(() => '.'))
    .filter(x => x.length)

  path
    .map((xy, index, path) => {
      if (index === 0) return { pos: xy, char: 'S' }
      if (index === path.length - 1) return { pos: xy, char: 'E' }

      const [x, y] = xy.split(':')
      const [i, j] = path[index + 1].split(':')

      if (i > Number(x)) return { pos: xy, char: 'v' }
      if (i < Number(x)) return { pos: xy, char: '^' }
      if (j > Number(y)) return { pos: xy, char: '>' }
      if (j < Number(y)) return { pos: xy, char: '<' }
    })
    .forEach(square => {
      const [row, col] = square.pos.split(':')
      plot[row][col] = square.char
    })

  console.log(plot.map(x => x.join(' ')).join('\n') + '\n')
}

const data = await getDataForDay(12)

const graph = createGraph(data)
console.log('Answer part 1: ', climbMountain(graph, 'S', 'E'))
console.log('Answer part 2: ', climbMountain(graph, 'a', 'E'))
