import { range } from 'lodash'
import { getDataForDay } from './utils'

const data = await getDataForDay(8)

const examineForest = () => {
  let forest = data.split('\n').map(r =>
    r.split('').map(x => {
      return { hight: Number(x), visable: null, score: null }
    })
  )

  range(0, 4).forEach(i => {
    forest = checkSide(forest)
    forest = rotateForest(forest)
  })

  return forest
}

const checkSide = forest => {
  return forest.map(row => {
    return row.map((tree, index, array) => {
      const beforeTrees = array.slice(0, index)
      checkVisability(tree, beforeTrees, index)
      calculateScore(tree, beforeTrees, index)
      return tree
    })
  })
}

const checkVisability = (tree, beforeTrees, index) => {
  if (!tree.visable) {
    const isVisable = beforeTrees.every(
      beforeTree => beforeTree.hight < tree.hight
    )

    if (index === 0) {
      tree.visable = true
    } else if (isVisable) {
      tree.visable = true
    } else {
      tree.visable = false
    }
  }
}

const calculateScore = (tree, trees, index) => {
  const blockingTree = trees.reverse().findIndex(t => t.hight >= tree.hight)

  let score
  if (index === 0) {
    score = 0
  } else if (blockingTree === -1) {
    score = trees.length
  } else {
    score = blockingTree + 1
  }

  if (tree.score === null) {
    tree.score = score
  } else {
    tree.score *= score
  }
}

const rotateForest = forest => {
  return forest[0].map((val, index) => {
    return forest.map(row => row[index]).reverse()
  })
}

const calcVisableTrees = forest => {
  return forest.reduce((sum, row) => {
    return (sum += row.reduce((rsum, tree) => {
      return tree.visable ? rsum + 1 : rsum
    }, 0))
  }, 0)
}

const findHighestScenicScore = forest =>
  Math.max(...forest.map(row => row.map(tree => tree.score)).flat())

const forest = examineForest()
console.log('Answer part 1: ', calcVisableTrees(forest))
console.log('Answer part 2: ', findHighestScenicScore(forest))
