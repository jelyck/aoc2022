import { trim } from 'lodash'
import { getDataForDay } from './utils'

// const data = await getDataForDay(11)

const data = `Monkey 0:
Starting items: 79, 98
Operation: new = old * 19
Test: divisible by 23
  If true: throw to monkey 2
  If false: throw to monkey 3

Monkey 1:
Starting items: 54, 65, 75, 74
Operation: new = old + 6
Test: divisible by 19
  If true: throw to monkey 2
  If false: throw to monkey 0

Monkey 2:
Starting items: 79, 60, 97
Operation: new = old * old
Test: divisible by 13
  If true: throw to monkey 1
  If false: throw to monkey 3

Monkey 3:
Starting items: 74
Operation: new = old + 3
Test: divisible by 17
  If true: throw to monkey 0
  If false: throw to monkey 1`

const solveTasks = () => {
  const monkeys = parseMonkeys(data)

  // Do stuff

  return monkeys
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
      test: Number(group[3].trim()),
      action: {
        true: Number(group[4].trim()),
        false: Number(group[5].trim())
      }
    }

    return MonkeyFactory.createMonkey(items, operation, test)
  })
}

interface Monkey {
  id: number
  items: number[]
  operation: Operation
  test: Test
}

type Operation = {
  left: number | string
  right: number | string
  operator: string
}

type Test = {
  test: number
  action: {
    true: number
    false: number
  }
}

class Monkey {
  constructor (id, items, operation, test) {
    this.id = id
    this.items = items
    this.operation = operation
    this.test = test
  }

  // Do stuff
}

// Seems a bit useless...
abstract class MonkeyFactory {
  static monkeyCounter: number = 0
  static maxMonkeys: number = 8

  static createMonkey (
    items: number[],
    operation: Operation,
    test: Test
  ): Monkey {
    if (this.monkeyCounter >= this.maxMonkeys)
      throw new Error(`Maximum of ${this.maxMonkeys} monkeys already exists.`)
    const monkey = new Monkey(this.monkeyCounter, items, operation, test)
    this.monkeyCounter++
    return monkey
  }
}

console.log(solveTasks())
