import { getDataForDay } from './utils'

const data = await getDataForDay(3)

const sumOfRucksack = () => {
  return data.split('\n').reduce((sum, items) => {
    const itemsPerCompartment = items.length / 2
    const firstCompartment = [...items.slice(0, itemsPerCompartment)]
    const secondCompartment = [...items.slice(itemsPerCompartment)]

    const item = firstCompartment.filter(item =>
      secondCompartment.includes(item)
    )

    sum += getPriorityOfItem(item[0])

    return sum
  }, 0)
}

const sumOfBadges = () => {
  return data.match(/(.+\n?){3}/g).reduce((sum, group) => {
    const elfs = group.trim().split('\n')

    const badge = [...elfs[0]]
      .filter(x => elfs[1].includes(x))
      .filter(x => elfs[2].includes(x))

    sum += getPriorityOfItem(badge[0])

    return sum
  }, 0)
}

const getPriorityOfItem = (item: string) => {
  const lcs = Array.from(Array(26)).map((e, i) => i + 97)
  const ucs = Array.from(Array(26)).map((e, i) => i + 65)
  const chars = lcs.concat(ucs).map(x => String.fromCharCode(x))
  return chars.indexOf(item) + 1
}

console.log('Answer part 1: ', sumOfRucksack())
console.log('Answer part 2: ', sumOfBadges())
