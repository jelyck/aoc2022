export async function getDataForDay (day: number) {
  const response = await fetch(
    `https://adventofcode.com/2022/day/${day}/input`,
    {
      headers: {
        Cookie: process.env.aocsession
      }
    }
  )

  if (response.status !== 200) {
    throw new Error(await response.text())
  }

  return await response.text()
}
