//   随机颜色
const colors: number[] = [
  0x0eaa97, 0x88cccc, 0x109fb1, 0xffffff, 0x008899, 0xfc3e77, 0x594f57, 0x8ad9ec, 0xd49e9e,
  0xec5685, 0xcceeee, 0x444444, 0xf5d4c8, 0x000000
]
export const getRandom=(): number => {
  return colors[Math.round(Math.random() * colors.length - 1)]
}