import { getDataForDay } from './utils'

type Rock = {
  index: number
  form: string[][]
}

type Jet = {
  index: number
  direction: string
}

const task = (maxRocks: number) => {
  RockFactory.reset()

  const chamber = new Chamber(data, maxRocks)

  chamber.dropRocks()

  return chamber.hight
}

/**
 * Chamber that handles
 * the simulation.
 */
class Chamber {
  maxDrops: number
  trackCycle: {}
  jet: Generator<Jet>
  drops: number
  hight: number
  area: string[][]

  constructor (data: string, maxDrops: number) {
    this.area = [new Array(7).fill('-')]
    this.jet = this.jetGen(data)
    this.trackCycle = {}
    this.maxDrops = maxDrops
    this.drops = 0
    this.hight = 0
  }

  private *jetGen (data: string): Generator<Jet> {
    const jets = data.split('')

    let i = 0
    while (true) {
      yield { index: i, direction: jets[i] }
      i = (i + 1) % jets.length
    }
  }

  /**
   * Find the highest rock at rest
   * and save the hight.
   */
  setHight () {
    let newHight: number
    for (let i = this.area.length - 1; i >= 0; i--) {
      if (this.area[i].includes('#')) {
        newHight = i
        break
      } else if (this.area[i].includes('-')) {
        newHight = i
        break
      }
    }

    // If final hight is calculated, then
    // make sure the normal drop loop don't
    // reset the calculated hight.
    if (newHight > this.hight) {
      this.hight = newHight
    }
  }

  /**
   * Resize area with three empty rows
   * above highest rock at rest.
   */
  resize () {
    const diff = 3 + (this.hight + 1) - this.area.length
    if (diff > 0) {
      for (let i = 0; i < diff; i++) {
        this.area.push(new Array(7).fill('.'))
      }
    } else if (diff < 0) {
      this.area.splice(diff)
    }
  }

  /**
   * Insert rock rows above at top of chamber.
   * Will be three above due to the resize.
   * @param rock
   */
  insert (rock: Rock) {
    let rockRow: string[]
    const r = rock.form.slice()
    while ((rockRow = r.pop())) {
      this.area.push([...rockRow])
    }
  }

  /**
   * Blow rock to the left if possible
   * @param rockRows
   */
  moveLeft (rockRows: string[][]) {
    const canLeft = (rockRows: string[][]) =>
      rockRows.every(r => {
        const first = r.indexOf('@')
        if (first - 1 >= 0 && r[first - 1] !== '#') {
          return true
        }
        return false
      })

    if (canLeft(rockRows)) {
      for (let i = 0; i < rockRows.length; i++) {
        for (let j = 0; j < rockRows[0].length; j++) {
          if (rockRows[i][j] === '@') {
            rockRows[i][j - 1] = '@'
            rockRows[i][j] = '.'
          }
        }
      }
    }
  }

  /**
   * Blow rock to the right if possible
   * @param rockRows
   */
  moveRight (rockRows: string[][]) {
    const canRight = (rockRows: string[][]) =>
      rockRows.every(r => {
        const last = r.lastIndexOf('@')
        if (last + 1 <= r.length - 1 && r[last + 1] !== '#') {
          return true
        }
        return false
      })

    if (canRight(rockRows)) {
      for (let i = 0; i < rockRows.length; i++) {
        for (let j = rockRows[0].length - 1; j >= 0; j--) {
          if (rockRows[i][j] === '@') {
            rockRows[i][j + 1] = '@'
            rockRows[i][j] = '.'
          }
        }
      }
    }
  }

  /**
   * Move rock down one step if possible.
   * If not possible rock is put to rest.
   * @param rockRows
   * @param rockMin
   * @returns true if rock was moved, else false.
   */
  moveDown (rockRows, rockMin) {
    const canDown = (rockRows, rockMin) => {
      for (let i = rockMin; i < rockMin + rockRows.length; i++) {
        for (let j = 0; j < this.area[i].length; j++) {
          if (this.area[i][j] === '@') {
            if (this.area[i - 1][j] === '#') return false
            if (this.area[i - 1][j] === '-') return false
          }
        }
      }
      return true
    }

    if (canDown(rockRows, rockMin)) {
      for (let i = rockMin; i < this.area.length; i++) {
        for (let j = 0; j < this.area[i].length; j++) {
          if (this.area[i][j] === '@') {
            this.area[i - 1][j] = '@'
            this.area[i][j] = '.'
          }
        }
      }
      return true
    } else {
      for (let i = rockMin; i < this.area.length; i++) {
        for (let j = 0; j < this.area[i].length; j++) {
          if (this.area[i][j] === '@') {
            this.area[i][j] = '#'
          }
        }
      }
      return false
    }
  }

  /**
   * Let the rock fall until it hits bottom or another
   * rock. The rock will be moved sideways by jets and
   * after a while the pattern will become cyclic. When
   * that happens we can stop simulating and calculate
   * the total hight.
   * @param rock
   */
  fall (rock: Rock) {
    while (true) {
      const jet = this.jet.next().value

      // If we find a cycle, we stop everything
      if (this.checkCycle(rock.index, jet.index)) return

      const rockRows = this.area.filter(r => r.includes('@'))
      const rockMin = this.area.findIndex(r => r.includes('@'))

      if (jet.direction === '>') this.moveRight(rockRows)
      if (jet.direction === '<') this.moveLeft(rockRows)

      if (!this.moveDown(rockRows, rockMin)) break
    }
  }

  /**
   * By looking at the chamber plot, we see that
   * the position of the rocks at rest becomes cyclic
   * after some time. Meaning same rock is affected by
   * same sequence of jets. To find where this cyclic
   * behavior appears, we store the rock and the jet
   * with the current amount of drops and hight. If we
   * found the same rock and jet again we calculate the
   * period i.e. how many rocks that have dropped between
   * the cycle. If the current amount of drops have the
   * same period as the maximum rocks we intend to drop
   * then we can calculate what the final hight will be.
   * 
   * Solution created by https://github.com/terminalmage
   */
  checkCycle (rockIndex, jetIndex) {
    if (this.drops > 1000) {
      const key = [rockIndex, jetIndex].join('-')

      if (key in this.trackCycle) {
        const { drops, hight } = this.trackCycle[key]
        const period = this.drops - drops

        if (drops % period === this.maxDrops % period) {
          console.log(`Found cycle between drop ${drops} and ${this.drops}`)

          const cycleHight = this.hight - hight
          const dropsRemain = this.maxDrops - this.drops
          const cyclesRemain = Math.floor(dropsRemain / period) + 1

          this.hight = hight + cycleHight * cyclesRemain
          this.drops = this.maxDrops

          return true
        }
      } else {
        this.trackCycle[key] = {
          drops: this.drops,
          hight: this.hight
        }

        return false
      }
    }
  }

  /**
   * Main loop that handles all
   * the drops of stones.
   */
  dropRocks () {
    while (this.drops < this.maxDrops) {
      const rock = RockFactory.create()

      this.resize()
      this.insert(rock)
      this.fall(rock)

      this.setHight()
      this.drops++
    }
  }

  /**
   * Plots the chamber
   */
  plot () {
    this.area
      .slice()
      .reverse()
      .forEach(r => console.log(r.join('')))
    console.log()
  }
}

/**
 * Creates the different rocks
 * and handles the order.
 */
class RockFactory {
  private static rocks = []
  private static rock: Generator
  private static order = ['-', '+', 'L', 'I', 'O']

  static {
    const rocks = RockFactory.order.map(r => {
      const form = []
      switch (r) {
        case '-':
          form.push(['.', '.', '@', '@', '@', '@', '.'])
          RockFactory.rocks.push(form)
          return
        case '+':
          form.push(['.', '.', '.', '@', '.', '.', '.'])
          form.push(['.', '.', '@', '@', '@', '.', '.'])
          form.push(['.', '.', '.', '@', '.', '.', '.'])
          RockFactory.rocks.push(form)
          return
        case 'L':
          form.push(['.', '.', '.', '.', '@', '.', '.'])
          form.push(['.', '.', '.', '.', '@', '.', '.'])
          form.push(['.', '.', '@', '@', '@', '.', '.'])
          RockFactory.rocks.push(form)
          return
        case 'I':
          form.push(['.', '.', '@', '.', '.', '.', '.'])
          form.push(['.', '.', '@', '.', '.', '.', '.'])
          form.push(['.', '.', '@', '.', '.', '.', '.'])
          form.push(['.', '.', '@', '.', '.', '.', '.'])
          RockFactory.rocks.push(form)
          return
        case 'O':
          form.push(['.', '.', '@', '@', '.', '.', '.'])
          form.push(['.', '.', '@', '@', '.', '.', '.'])
          RockFactory.rocks.push(form)
          return
        default:
          throw new Error('Unkown rock')
      }
    })
    this.rock = RockFactory.rockGen()
  }

  private static *rockGen () {
    let i = 0
    while (true) {
      yield { index: i, form: RockFactory.rocks[i] }
      i = (i + 1) % RockFactory.rocks.length
    }
  }

  /**
   * Reset generator to index = 0
   */
  static reset () {
    this.rock = RockFactory.rockGen()
  }

  /**
   * Returns next rock in sequence.
   * @returns rock 
   */
  static create () {
    return RockFactory.rock.next().value
  }
}

const data = await getDataForDay(17)

console.log('Answer part 1:', task(2022))
console.log('Answer part 2:', task(1000000000000))
