import { range } from 'lodash'
import { getDataForDay } from './utils'

const data = await getDataForDay(9)

const task = knots => {
  let headMoves = data.split('\n')

  const rope = range(0, knots).map(() => ({ x: 0, y: 0 }))
  const history = [rope.map(knot => ({ ...knot }))]

  headMoves.forEach(move => {
    const [direction, steps] = move.split(' ')
    range(0, Number(steps)).forEach(() => {
      rope.forEach((knot, index, rope) => {
        if (index === 0) {
          if (direction === 'R') knot.x += 1
          if (direction === 'L') knot.x -= 1
          if (direction === 'U') knot.y += 1
          if (direction === 'D') knot.y -= 1
        } else {
          const distance = Math.sqrt(
            Math.pow(knot.x - rope[index - 1].x, 2) +
              Math.pow(knot.y - rope[index - 1].y, 2)
          )
          if (distance > Math.sqrt(2)) {
            if (rope[index - 1].y - knot.y > 0) knot.y += 1
            if (rope[index - 1].y - knot.y < 0) knot.y -= 1
            if (rope[index - 1].x - knot.x > 0) knot.x += 1
            if (rope[index - 1].x - knot.x < 0) knot.x -= 1
          }
        }
      })
      history.push(rope.map(knot => ({ ...knot })))
    })
  })
  return history
    .map(rope => rope[rope.length - 1])
    .filter((tail, index, tails) => {
      return index === tails.findIndex(p => p.x === tail.x && p.y === tail.y)
    }).length
}

console.log('Answer part 1: ', task(2))
console.log('Answer part 2: ', task(10))
