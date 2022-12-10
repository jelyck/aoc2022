import { range } from 'lodash'

export async function getDataForDay (day: number) {
  const response = await fetch(
    `https://adventofcode.com/2022/day/${day}/input`,
    {
      headers: {
        Cookie: process.env.aocsession
      }
    }
  )

  if (response.status !== 200) {
    throw new Error(await response.text())
  }

  return (await response.text()).trim()
}

export const day9 = {
  plotHistory: history => {
    const x = 20
    const y = 20

    history.forEach(rope => {
      let grid = range(0, x).map(v => range(0, y).map(v => '.'))
      rope.forEach((knot, index) => {
        grid[rope[index].x][rope[index].y] = index
      })
      grid = grid[0].map((val, index) =>
        grid.map(row => row[row.length - 1 - index])
      )
      console.log(grid.map(x => x.join('')).join('\n') + '\n')
    })
  }
}
