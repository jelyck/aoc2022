import { range } from 'lodash'
import { getDataForDay } from './utils'

const data = await getDataForDay(11)

const calcMonkeyBussiness = rounds => {
  let monkeys: MonkeyWorld.Monkey[]
  if (rounds > 20) {
    monkeys = createCrazyMonkeys()
  } else {
    monkeys = createNormalMonkeys()
  }

  range(0, rounds).forEach(() => {
    monkeys.forEach(monkey => {
      const numItems = monkey.items.length
      for (let i = 0; i < numItems; i++) {
        const { item, throwTo } = monkey.inspectItem()
        monkeys[throwTo].catchItem(item)
      }
    })
  })

  monkeys.sort((a, b) => b.inspections - a.inspections)
  return monkeys[0].inspections * monkeys[1].inspections
}

const createCrazyMonkeys = () => {
  const monkeyData = parseMonkeyData(data)

  // https://en.wikipedia.org/wiki/Least_common_multiple
  // https://stackoverflow.com/a/49722579
  const gcdf = (a, b) => (a ? gcdf(b % a, a) : b)
  const lcmf = (a, b) => (a * b) / gcdf(a, b)
  const lcm = monkeyData.map(x => x.test.divide).reduce(lcmf)

  return monkeyData.map(x =>
    MonkeyWorld.MonkeyFactory.create(x.items, x.operation, x.test, lcm)
  )
}

const createNormalMonkeys = () => {
  return parseMonkeyData(data).map(x =>
    MonkeyWorld.MonkeyFactory.create(x.items, x.operation, x.test)
  )
}

const parseMonkeyData = data => {
  return data.split('\n\n').map((monkey: string) => {
    const regex = /items:\s+(.*)\n.*:.*=(.*)\n.*\s+(\d+)\n.*\s+(\d+)\n.*\s+(\d+)/m
    const group = monkey.match(regex)

    const items = group[1]
      .trim()
      .split(',')
      .map(v => Number(v.trim()))

    const [left, operator, right] = group[2].trim().split(' ')
    const operation = {
      left,
      right,
      operator
    }

    const test = {
      divide: Number(group[3].trim()),
      action: {
        true: Number(group[4].trim()),
        false: Number(group[5].trim())
      }
    }

    return { items, operation, test }
  })
}

namespace MonkeyWorld {
  export interface Monkey {
    id: number
    items: number[]
    inspections: number
    operation: Operation
    test: Test
    lcm?: number

    inspectItem(): Throw
    increaseWorry(item: number): number
    reduceWorry(item: number): number
    throwItem(item: number): Throw
    catchItem(item: number): void
  }

  export type Operation = {
    left: number | string
    right: number | string
    operator: string
  }

  export type Test = {
    divide: number
    action: {
      true: number
      false: number
    }
  }

  export type Throw = {
    item: number
    throwTo: number
  }

  export abstract class Monkey implements Monkey {
    protected constructor (
      id: number,
      items: number[],
      operation: Operation,
      test: Test
    ) {
      this.id = id
      this.items = items
      this.inspections = 0
      this.operation = operation
      this.test = test
    }

    inspectItem (): Throw {
      this.inspections++
      let item = this.items.shift()
      item = this.increaseWorry(item)
      item = this.reduceWorry(item)
      return this.throwItem(item)
    }

    increaseWorry (item: number): number {
      const left =
        this.operation.left === 'old' ? item : Number(this.operation.left)
      const right =
        this.operation.right === 'old' ? item : Number(this.operation.right)

      if (this.operation.operator === '+') {
        item = left + right
      } else if (this.operation.operator === '*') {
        item = left * right
      } else throw new Error('Unkown operator.')

      return item
    }

    throwItem (item: number): Throw {
      if (item % this.test.divide === 0) {
        return { item, throwTo: this.test.action.true }
      } else {
        return { item, throwTo: this.test.action.false }
      }
    }

    catchItem (item: number): void {
      this.items.push(item)
    }
  }

  class NormalMonkey extends Monkey implements Monkey {
    constructor (
      id: number,
      items: number[],
      operation: Operation,
      test: Test
    ) {
      super(id, items, operation, test)
    }

    reduceWorry (item: number): number {
      return Math.floor(item / 3)
    }
  }

  class CrazyMonkey extends Monkey implements Monkey {
    lcm: number

    constructor (
      id: number,
      items: number[],
      operation: Operation,
      test: Test,
      lcm: number
    ) {
      super(id, items, operation, test)
      this.lcm = lcm
    }

    reduceWorry (item: number): number {
      return item > this.lcm ? item % this.lcm : item
    }
  }

  export abstract class MonkeyFactory {
    static numMonkeys = 0
    static maxMonkeys = 16

    static create (
      items: number[],
      operation: Operation,
      test: Test,
      lcm?: number
    ): Monkey {
      if (this.numMonkeys >= this.maxMonkeys)
        throw new Error(`Maximum of ${this.maxMonkeys} monkeys already exists.`)

      let monkey: Monkey
      if (lcm) {
        monkey = new CrazyMonkey(this.numMonkeys, items, operation, test, lcm)
      } else {
        monkey = new NormalMonkey(this.numMonkeys, items, operation, test)
      }

      this.numMonkeys++
      return monkey
    }
  }
}

console.log('Answer part 1: ', calcMonkeyBussiness(20))
console.log('Answer part 2: ', calcMonkeyBussiness(10000))
