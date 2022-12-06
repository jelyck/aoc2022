import { getDataForDay } from './utils'

const data = await getDataForDay(6)

const findMarker = (markerSize: number) => {
  for (let i = markerSize; i < data.length; i++) {
    const subsig = new Set(data.substring(i - markerSize, i))

    if (subsig.size === markerSize) return i
  }
}

console.log('Answer part 1: ', findMarker(4))
console.log('Answer part 2: ', findMarker(14))
