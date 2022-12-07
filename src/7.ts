import { getDataForDay } from './utils'

const data = await getDataForDay(7)

const createFlatTree = () => {
  let currentDir = []
  const currentPath = () => currentDir.join('/')

  return data.split('\n').reduce((tree, line) => {
    if (line.startsWith('$ cd')) {
      const dir = line.split(' ')[2]
      if (dir === '..') {
        currentDir.pop()
      } else {
        currentDir.push(dir)
        tree[currentPath()] = []
      }
    } else if (!line.startsWith('$')) {
      if (line.startsWith('dir')) {
        tree[currentPath()].push(currentPath() + line.replace('dir ', '/'))
      } else {
        tree[currentPath()].push(line)
      }
    }
    return tree
  }, {})
}

const calcFileSize = (fileTree, dir) => {
  const files = fileTree[dir]
  return files.reduce((sum, file) => {
    if (file.startsWith('/')) {
      sum += calcFileSize(fileTree, file)
    } else {
      sum += Number(file.split(' ')[0])
    }
    return sum
  }, 0)
}

const calcTotSizeAtMost100000 = fileTree => {
  return Object.keys(fileTree)
    .map(dir => calcFileSize(fileTree, dir))
    .filter(size => size < 100000)
    .reduce((sum, size) => sum + size)
}

const calcSmallestDirToDeleteSize = fileTree => {
  const totalSpace = 70000000
  const upgradeSpace = 30000000
  const usedSpace = calcFileSize(fileTree, '/')
  const spaceToClean = Math.abs(totalSpace - upgradeSpace - usedSpace)

  return Object.keys(fileTree)
    .map(dir => calcFileSize(fileTree, dir))
    .filter(size => size >= spaceToClean)
    .reduce((min, size) => Math.min(size, min))
}

console.log('Answer part 1: ', calcTotSizeAtMost100000(createFlatTree()))
console.log('Answer part 2: ', calcSmallestDirToDeleteSize(createFlatTree()))
