// import * as PIXI from 'pixi.js'
import * as PIXI from 'pixi.js-legacy'
import '@pixi/graphics-extras'
import 'gsap'
import { maskParams } from './animationType'
import { random } from './random'
import { getRandom } from './color'
import GM1PNG from '../assets/images/GM02.png'
import anime from 'animejs/lib/anime.es.js'
// 多边形
export const Rectangle = (app: PIXI.Application) => {
  // 图形
  let pane: PIXI.Graphics = new PIXI.Graphics()
  // 精灵组
  let container: PIXI.Container = new PIXI.Container()

  container.zIndex = 2
  pane.beginFill(0, 0)
  pane.drawRect(0, 0, window.innerWidth, window.innerHeight)
  // 旋转角度
  let rotation = random(0, 6.28)
  // 圆弧角度
  let startAngle = random(0, Math.PI)
  // 半径
  let radNums = Math.sqrt(Math.pow(window.innerHeight, 2) + Math.pow(window.innerWidth, 2))
  let radius = random(radNums / 20, radNums / 12)

  // 遮罩层
  let mask: PIXI.Graphics = new PIXI.Graphics()
  pane.mask = mask

  // 遮罩层方向
  let direction = random(0, 1) > 0.5 ? true : false
  // 缩放
  let myObject = {
    scale: random(50, 200)
  }
  // 几边形
  let num = Math.floor(random(3, 10))
  // 线宽
  let lineWidth = random(4, 10)
  // 颜色
  let color = getRandom()
  let X = random(radius, window.innerWidth - radius)
  let Y = random(radius, window.innerHeight - radius)
  mask.position.x = X
  mask.position.y = Y
  // 多边形路径
  let points = generatePolygonPoints(radius, num, X, Y)
  // 绘制
  // 多边形
  let polygon: PIXI.Graphics = new PIXI.Graphics()
  let pol = new PIXI.Graphics()
  polygon.lineStyle(lineWidth, color)
  polygon.drawPolygon(points)
  polygon.closePath()

  // 坐标
  polygon.position.x = X
  polygon.position.y = Y
  pol.position.x = X
  pol.position.y = Y

  let sprite: PIXI.Sprite = PIXI.Sprite.from(GM1PNG)
  sprite.anchor.set(0.5, 0.5)
  sprite.position.x = X
  sprite.position.y = Y
  // 变形
  polygon.pivot.x = X
  polygon.pivot.y = Y
  pol.pivot.x = X
  pol.pivot.y = Y
  // 遮罩层
  pol.lineStyle(lineWidth, color)
  pol.beginFill(color)
  pol.drawPolygon(points)
  pol.closePath()
  setTimeout(() => {
    pol.mask = sprite
  }, 10)
  // 旋转
  polygon.rotation = rotation
  pol.rotation = rotation

  let TimelineAnime = new TimelineMax()
  // 遮罩层半径
  let maskParams: maskParams = {
    _radius: radius * 1.2,
    startAngle: startAngle,
    endAngle: startAngle
  }

  // 更新
  container.addChild(pane)
  pane.addChild(pol)
  pane.addChild(sprite)
  pane.addChild(polygon)
  pane.addChild(mask)
  app.stage.addChild(container)
  // 旋转动画
  TimelineAnime.add(
    TweenMax.to(maskParams, 0.8, {
      endAngle: startAngle + (direction ? -2 : 2) * Math.PI,
      onUpdate: upDateMask,
      onUpdateParams: [mask, direction]
    })
  ).add(
    TweenMax.to(maskParams, 0.8, {
      startAngle: startAngle + (direction ? -2 : 2) * Math.PI,
      onUpdate: upDateMask,
      onUpdateParams: [mask, direction],
      onComplete: function () {
        container.removeChild(mask)
        container.removeChild(sprite)
        container.removeChild(polygon)
        container.removeChild(pane)
        app.stage.removeChild(container)
      }
    })
  )
  // 缩放动画
  anime({
    targets: myObject,
    scale: random(75, 200),
    duration: 800
  })
  // 更新/重绘
  function upDateMask(mask: PIXI.Graphics, direction: boolean) {
    mask.scale.set(myObject.scale / 100, myObject.scale / 100)
    pol.scale.set(myObject.scale / 100, myObject.scale / 100)
    polygon.scale.set(myObject.scale / 100, myObject.scale / 100)
    sprite.scale.set(myObject.scale / 250, myObject.scale / 250)
    mask.clear()
    mask.beginFill(0x00ffff)
    mask.moveTo(0, 0)
    mask.arc(0, 0, maskParams._radius, maskParams.startAngle, maskParams.endAngle, direction)
  }
}

// 箭头
let RearrowNum = random(1, 3)
let ThisRearrowNum = 0
export const Rearrow = (app: PIXI.Application) => {
  ThisRearrowNum++
  let Rcontainer: PIXI.Container = new PIXI.Container()
  let containers: PIXI.Container = new PIXI.Container()
  let MaskColor = 0xffffff
  let Color = getRandom()
  if (Color == 0) Color = 0x444444

  // 宽度
  let triangleNum = random(200, 400)
  // 长度随机
  let tHNum = random(0.9, 4)
  // 宽度的一半
  let littriangleNum = triangleNum / 2
  let triangleNumMax = triangleNum * tHNum + littriangleNum

  // 遮罩层和底层大小一样
  function setRectangle(color: number): PIXI.Graphics {
    let graphics = new PIXI.Graphics()
    graphics.beginFill(color, color ? 1 : 0)
    graphics.drawRect(0, 0, triangleNum, triangleNumMax)
    graphics.pivot.set(littriangleNum, triangleNumMax / 2)
    graphics.endFill()
    return graphics
  }
  // 遮罩层
  let arrow = setRectangle(0x000000)

  Rcontainer.addChild(arrow)
  // // 三角形
  let triangle = new PIXI.Graphics()
  triangle.beginFill(MaskColor)
  triangle.drawPolygon([0, 0, triangleNum, 0, littriangleNum, littriangleNum])
  triangle.endFill()
  triangle.y = triangleNum * tHNum
  arrow.addChild(triangle)
  // // 矩形
  let rectangle = new PIXI.Graphics()
  rectangle.beginFill(MaskColor)
  rectangle.drawRect(0, 0, littriangleNum, triangleNum * tHNum)
  rectangle.endFill()
  rectangle.x = triangleNum / 4
  arrow.addChild(rectangle)

  // 被遮罩的图形 底图
  let panel = setRectangle(Color)
  panel.mask = arrow
  Rcontainer.addChild(panel)

  // 给底图添加图形 反向遮罩/纯白
  // 圆点 五角星
  // let containerCircle = new PIXI.Container()
  // 图形数组
  const circles: PIXI.Graphics[] = []
  function setcircles() {
    // 绘制圆点或者星星
    const draw = random(0, 1) > 0.5 ? 'circle' : 'stars'
    // 计算绘制图形行列
    let spacing = Math.sqrt(Math.pow(triangleNumMax / 20, 2) * 2)
    let nums = Math.ceil((triangleNumMax * (1 + tHNum)) / (spacing * 5))
    // 循环绘制
    for (let i = 0; i < nums; i++) {
      // 行
      let containerCircle = new PIXI.Container()
      containerCircle.y = spacing * random(4, 4.8) * i - spacing * 3
      for (let j = 0; j <= 6; j++) {
        // 列
        // 半径
        let radius = random(10, spacing * 0.75)
        let circle = new PIXI.Graphics()
        circle.beginFill(0xffffff, 1)
        switch (draw) {
          case 'circle':
            circle.drawCircle(0, 0, radius)
            break
          case 'stars':
            const Bpoints = setStars(radius, radius / 2)
            circle.drawPolygon(Bpoints)
            break
        }
        circle.endFill()
        circle.x = spacing * 2.5 * j
        containerCircle.addChild(circle)
        circles.push(circle)
      }
      containerCircle.rotation = 0.785
      containerCircle.pivot.set(containerCircle.width / 2, containerCircle.height / 2)
      containerCircle.x = triangleNum / 2 + i * random(0, 20)
      panel.addChild(containerCircle)
    }
  }
  // 线条
  function lines() {
    let spacing = Math.sqrt(Math.pow(triangleNumMax / 20, 2) * 2)
    let nums = Math.ceil((triangleNumMax * (1 + tHNum)) / (spacing * 3)) + 2
    for (let i = 1; i <= nums; i++) {
      let line = new PIXI.Graphics()
      line.lineStyle(spacing / 4 + random(0, 5), 0xffffff, 1)
      line.pivot.set((triangleNumMax * (1 + tHNum)) / 2, spacing / 2)
      line.moveTo(0, 0)
      line.lineTo(triangleNumMax * (1 + tHNum), 0)
      line.x = (triangleNumMax * (1 + tHNum)) / 5
      line.y = spacing * 3 * i - spacing * 3 * 2
      line.rotation = 0.785
      panel.addChild(line)
      circles.push(line)
    }
  }
  switch (Math.trunc(random(1, 5))) {
    case 1:
      setcircles()
      break
    case 2:
      lines()
      break
    case 3:
      setcircles()
      break
  }

  Rcontainer.x = -triangleNumMax
  Rcontainer.y = random(0, window.innerHeight)
  Rcontainer.rotation = -1.57
  containers.addChild(Rcontainer)
  containers.x = window.innerWidth / 2
  containers.y = window.innerHeight / 2
  containers.pivot.set(window.innerWidth / 2, window.innerHeight / 2)
  containers.rotation = 1.57 * Math.trunc(random(1, 5))
  app.stage.addChild(containers)
  // 动画
  anime({
    targets: Rcontainer,
    x: window.innerWidth + triangleNumMax,
    duration: random(2000, 3000),
    easing: 'easeOutSine',
    complete: function () {
      containers.removeAllListeners()
      Rcontainer.removeAllListeners()
      arrow.removeAllListeners()
      arrow.clear()
      panel.removeAllListeners()
      panel.clear()
      // containerCircle.removeAllListeners()
      circles.forEach((circle) => {
        circle.clear()
        circle.removeChild()
        circles.pop()
      })
      app.stage.removeChild(containers)
    }
  })

  if (ThisRearrowNum < RearrowNum) {
    setTimeout(() => {
      Rearrow(app)
    }, 69)
  } else {
    ThisRearrowNum = 0
    RearrowNum = random(1, 3)
  }
}

// 生成五角星
export const setStars = (R: number, r: number) => {
  // 弧度
  const getAngle = (angle: number) => (Math.PI / 180) * angle
  const cos = (angle: number) => Math.cos(getAngle(angle))
  const sin = (angle: number) => Math.sin(getAngle(angle))
  // 路径
  const Bpoints: PIXI.Point[] = []
  function getStarPath(R: number, r: number) {
    const horn = 5
    const angle = 360 / horn
    for (let i = 0; i < horn; i++) {
      Bpoints.push(new PIXI.Point(R * cos(18 + i * angle), -R * sin(18 + i * angle)))
      Bpoints.push(new PIXI.Point(r * cos(54 + i * angle), -r * sin(54 + i * angle)))
    }
  }
  getStarPath(R, r)
  return Bpoints
}

// 生成随机多边形 3~9
export function generatePolygonPoints(
  radius: number,
  num: number,
  X: number,
  Y: number
): PIXI.Point[] {
  let deltaRad = (Math.PI * 2) / num,
    points: PIXI.Point[] = []
  for (let index = 0; index < num; index++) {
    let x = Math.sin(index * deltaRad) * radius + X,
      y = Math.cos(index * deltaRad) * radius + Y
    points.push(new PIXI.Point(x, y))
  }
  return points
}
