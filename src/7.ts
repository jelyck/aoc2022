import { getDataForDay } from './utils'

const data = await getDataForDay(7)

// const data = `$ cd /
// $ ls
// dir a
// 14848514 b.txt
// 8504156 c.dat
// dir d
// $ cd a
// $ ls
// dir e
// 29116 f
// 2557 g
// 62596 h.lst
// $ cd e
// $ ls
// 584 i
// $ cd ..
// $ cd ..
// $ cd d
// $ ls
// 4060174 j
// 8033020 d.log
// 5626152 d.ext
// 7214296 k`

const createFlatTree = () => {
  let currentDir = []

  return data.split('\n').reduce((tree, line, index, array) => {
    if (line.startsWith('$ cd')) {
      const dir = line.split(' ')[2]
      if (dir === '..') {
        currentDir.pop()
      } else {
        currentDir.push(dir)

        // Parse LS output for current dir
        const currentPath = currentDir.join('/')
        const outputStart =
          array.slice(index).findIndex(x => x.startsWith('$ ls')) + index + 1
        let outputEnd = array
          .slice(outputStart)
          .findIndex(x => x.startsWith('$'))
        outputEnd = outputEnd === -1 ? array.length : outputStart + outputEnd
        const filesInPath = array.slice(outputStart, outputEnd).map(file => {
          if (file.startsWith('dir')) {
            return currentPath + file.replace('dir ', '/')
          }
          return file
        })

        return Object.assign(tree, {
          [currentPath]: filesInPath
        })
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
