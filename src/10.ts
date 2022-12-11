import { getDataForDay } from './utils'

const data = await getDataForDay(10)

const solveTasks = () => {
  const commands = data.split('\n')

  cpu.run(commands)

  console.log('Answer part 1: ', cpu.signals.sum())
  console.log('Answer part 2:\n' + cpu.crt.getImage())
}

const cpu = {
  cycle: 1,
  queue: [],
  processing: [],
  registers: {
    values: {
      X: 1
    },
    read: register => {
      return cpu.registers.values[register]
    },
    update: (register, value) => {
      cpu.registers.values[register] += value
    }
  },
  run: commands => {
    cpu.queue.push(...commands)
    while (cpu.queue.length) {
      cpu.signals.measure()
      cpu.crt.writeChar()

      if (cpu.processing.length) {
        cpu.processing.shift()()
      } else {
        cpu.startProcessing(cpu.queue.shift())
      }
      cpu.cycle++
    }
  },
  startProcessing: command => {
    const [cmd, arg] = command.split(' ')
    switch (cmd) {
      case 'noop':
        break
      case 'addx':
        cpu.processing.push(() => cpu.registers.update('X', Number(arg)))
        break
      default:
        throw new Error('Unkown command.')
    }
  },
  signals: {
    measurements: [],
    measure: () => {
      if (cpu.cycle === 20 || (cpu.cycle - 20) % 40 === 0) {
        cpu.signals.measurements.push(cpu.cycle * cpu.registers.read('X'))
      }
    },
    sum: () => {
      return cpu.signals.measurements.reduce((sum, signal) => (sum += signal))
    }
  },
  crt: {
    image: Array(6).fill(''),
    writeChar: () => {
      if (cpu.cycle <= 240) {
        const crtPos = cpu.cycle - 1
        const crtRow = Math.floor(crtPos / 40)
        if (Math.abs(cpu.registers.read('X') - (crtPos - crtRow * 40)) <= 1) {
          cpu.crt.image[crtRow] += 'X'
        } else {
          cpu.crt.image[crtRow] += '.'
        }
      }
    },
    getImage: () => {
      return cpu.crt.image.join('\n')
    }
  }
}

solveTasks()
