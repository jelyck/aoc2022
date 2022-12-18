import { getDataForDay } from './utils'

const data = await getDataForDay(13)

const task = () => {
  return data.split('\n\n').reduce((sum, pair, index) => {
    const [left, right] = pair.split('\n').map(p => JSON.parse(p))

    if (comparePair(left, right)) sum += index + 1

    return sum
  }, 0)
}

const task2 = () => {
  const packages = data.split('\n').filter(line => line.trim() !== '')
  const dividerPackages = ['[[2]]', '[[6]]']
  packages.push(...dividerPackages)

  packages.sort((a, b) => comparePair(JSON.parse(b), JSON.parse(a)))

  return packages.reduce((sum, pack, index) => {
    if (dividerPackages.findIndex(divider => divider === pack) > -1)
      sum *= index + 1
    return sum
  }, 1)
}

const comparePair = (left: any[], right: any[]) => {
  let l, r
  while (true) {
    l = left.shift()
    r = right.shift()

    if (r === undefined && l) {
      return false
    }

    if (l === undefined && r) {
      return true
    }

    if (l === undefined && r === undefined) {
      return
    }

    if (Number.isInteger(l) && Number.isInteger(r)) {
      if (Number(l) === Number(r)) continue
      else if (Number(l) < Number(r)) return true
      else if (Number(l) > Number(r)) return false
    }

    if (Array.isArray(l) && Array.isArray(r)) {
      const ordered = comparePair(l, r)
      if (typeof ordered === 'boolean') return ordered
    }

    if (Array.isArray(l) && !Array.isArray(r)) {
      const ordered = comparePair(l, [r])
      if (typeof ordered === 'boolean') return ordered
    }

    if (!Array.isArray(l) && Array.isArray(r)) {
      const ordered = comparePair([l], r)
      if (typeof ordered === 'boolean') return ordered
    }
  }
}

console.log('Answer part 1:', task())
console.log('Answer part 2:', task2())

// For tests
export { comparePair }
