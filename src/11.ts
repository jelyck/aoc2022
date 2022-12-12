import { range } from 'lodash'
import { getDataForDay } from './utils'

const data = await getDataForDay(11)

// const data = `Monkey 0:
// Starting items: 79, 98
// Operation: new = old * 19
// Test: divisible by 23
//   If true: throw to monkey 2
//   If false: throw to monkey 3

// Monkey 1:
// Starting items: 54, 65, 75, 74
// Operation: new = old + 6
// Test: divisible by 19
//   If true: throw to monkey 2
//   If false: throw to monkey 0

// Monkey 2:
// Starting items: 79, 60, 97
// Operation: new = old * old
// Test: divisible by 13
//   If true: throw to monkey 1
//   If false: throw to monkey 3

// Monkey 3:
// Starting items: 74
// Operation: new = old + 3
// Test: divisible by 17
//   If true: throw to monkey 0
//   If false: throw to monkey 1`

const solveTasks = () => {
  const monkeys = parseMonkeys(data)

  range(0, 20).forEach(round => {
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

const parseMonkeys = (data: string): Monkey[] => {
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

    return MonkeyFactory.create(items, operation, test)
  })
}

interface Monkey {
  id: number
  items: number[]
  inspections: number
  operation: Operation
  test: Test
}

type Operation = {
  left: number | string
  right: number | string
  operator: string
}

type Test = {
  divide: number
  action: {
    true: number
    false: number
  }
}

class Monkey {
  constructor (id, items, operation, test) {
    this.id = id
    this.items = items
    this.inspections = 0
    this.operation = operation
    this.test = test
  }

  inspectItem () {
    this.inspections++
    const item = this.items.shift()
    console.log(`Monkey ${this.id} inspects item with worry level ${item}`)
    const inspectedItem = this.updateWorry(item)
    // console.log(inspectedItem)
    return this.throwItem(inspectedItem)
  }

  updateWorry (item): number {
    const left =
      this.operation.left === 'old' ? item : Number(this.operation.left)
    const right =
      this.operation.right === 'old' ? item : Number(this.operation.right)
    const operator = this.operation.operator

    if (operator === '+') {
      item = left + right
      console.log(`  Worry level increases by ${right} to ${item}.`)
    } else if (operator === '*') {
      item = left * right
      console.log(`  Worry level is multiplied by ${right} to ${item}.`)
    } else throw new Error('Unkown operator.')

    item = Math.floor(item / 3)
    console.log(`  Monkey gets bored. Worry level is divided by 3 to ${item}.`)
    return item
  }

  throwItem (item: number): { item: number; throwTo: number } {
    let throwTo: number
    if (item % this.test.divide === 0) {
      throwTo = this.test.action.true
      console.log(`  Current worry level is divisible by ${this.test.divide}.`)
    } else {
      throwTo = this.test.action.false
      console.log(
        `  Current worry level is not divisible by ${this.test.divide}.`
      )
    }
    console.log(
      `  Item with worry level ${item} is thrown to monkey ${throwTo}.`
    )
    return { item, throwTo }
  }

  catchItem (item) {
    this.items.push(item)
  }
}

// Seems a bit useless...
abstract class MonkeyFactory {
  static monkeyCounter: number = 0
  static maxMonkeys: number = 8

  static create (items: number[], operation: Operation, test: Test): Monkey {
    if (this.monkeyCounter >= this.maxMonkeys)
      throw new Error(`Maximum of ${this.maxMonkeys} monkeys already exists.`)
    const monkey = new Monkey(this.monkeyCounter, items, operation, test)
    this.monkeyCounter++
    return monkey
  }
}

console.log(solveTasks())
