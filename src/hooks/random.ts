// 随机数
export const random = (min: number, max: number): number => {
  return Math.random() * (max - min) + min
}
