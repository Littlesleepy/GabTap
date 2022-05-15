// import * as PIXI from 'pixi.js'
import * as PIXI from 'pixi.js-legacy'
import '@pixi/graphics-extras'
import 'gsap'
import { maskParams } from './animationType'
import { random } from './random'
import { getRandom } from './color'
import { easingPlus } from './easing'
import GM1PNG from '../assets/images/GM02.png'
import Feathers from '../assets/images/feather3.png'
import anime from 'animejs/lib/anime.es.js'
import { nextTick } from 'vue'
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
  let lineWidth = random(4, 10) * radVNums()
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
  // sprite.scale.set(radVNums())
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
    mask.scale.set(myObject.scale / 100)
    pol.scale.set(myObject.scale / 100)
    polygon.scale.set(myObject.scale / 100)
    sprite.scale.set((myObject.scale / 250) * radVNums())
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
  const tsr = Math.sqrt(Math.pow(window.innerHeight, 2) + Math.pow(window.innerWidth, 2)) / 10.5

  // 宽度
  let triangleNum = random(tsr, tsr * 2)
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

// 圆环
export const Rcircle = (app: PIXI.Application) => {
  const containers: PIXI.Container = new PIXI.Container()
  const Color = getRandom()
  const ran = random(1, 2)
  const tsr = Math.sqrt(Math.pow(window.innerHeight, 2) + Math.pow(window.innerWidth, 2)) / 94
  const tr = Math.sqrt(Math.pow(window.innerHeight, 2) + Math.pow(window.innerWidth, 2)) / 3.5

  const SR = tsr * ran * 0.6
  const R = tr * ran * 0.6
  const rectAndHole = new PIXI.Graphics()
  rectAndHole.beginFill(Color)
  rectAndHole.drawRect(0, 0, R, R)
  rectAndHole.beginHole()
  const nums = Math.trunc(R / SR) / 4
  const Arr: any[] = [[]]
  let AR = {
    ...Arr
  }
  // 镂空
  function Rstars() {
    for (let i = 1; i <= nums; i++) {
      Arr[i] = []
      for (let j = 0; j < nums; j++) {
        const sp = random(3.8, 4)
        const r = random(0, 360)
        const ISR = random(SR / 3, SR)
        const ILSR = ISR / 2
        const Bpoints = setStars(ISR, ILSR, SR * sp * j, SR * 4 * i, r)
        rectAndHole.drawPolygon(Bpoints)
        Arr[i][j] = { sp, r, ISR }
      }
    }
  }
  function Rcircle() {
    for (let i = 1; i <= nums; i++) {
      Arr[i] = []
      for (let j = 0; j < nums; j++) {
        const sp = random(3.8, 4)
        const ISR = random(SR / 2, SR)
        rectAndHole.drawCircle(SR * sp * j, SR * 4 * i, ISR)
        Arr[i][j] = { ISR, sp }
      }
      AR[i] = { ...Arr[i] }
    }
    // 性能炸弹
    // for (let i = 1; i <= nums; i++) {
    //   for (let j = 0; j < nums; j++) {
    //     anime({
    //       targets: AR[i][j],
    //       keyframes: [{ ISR: 0 , duration: 0},{ ISR: Arr[i][j].ISR }, { ISR: Arr[i][j].ISR }],
    //       duration: 1600,
    //       easing: easingPlus()
    //     })
    //   }
    // }
  }

  const lineNums = Math.trunc(R / SR / 3)
  const NR = Math.trunc(random(0, lineNums))
  function Rline() {
    for (let i = 0; i <= lineNums; i++) {
      rectAndHole.drawRect(0, SR * 3 * i, R, SR)
      Arr[i] = R
      AR[i] = Arr[i]
      if (i !== NR) {
        anime({
          targets: AR,
          keyframes: [{ [i]: R / 2 }, { [i]: 0 }],
          duration: 1600,
          easing: easingPlus()
        })
      }
    }
  }
  const funs = Math.trunc(random(1, 4))
  switch (funs) {
    case 1:
      Rcircle()
      break
    case 2:
      Rstars()
      break
    case 3:
      Rline()
      break
  }
  rectAndHole.endHole()
  rectAndHole.endFill()
  // 遮罩
  let circle = new PIXI.Graphics()
  circle.lineStyle((R / 4) * random(0.65, 0.85), 0xff3300, 1)
  circle.beginFill(0x9966ff, 0)
  circle.drawCircle(0, 0, (R / 2 - R / 8) * 0.8)
  circle.endFill()
  circle.x = R / 2
  circle.y = R / 2
  rectAndHole.mask = circle
  rectAndHole.addChild(circle)
  rectAndHole.pivot.set(R / 2, R / 2)
  rectAndHole.rotation = 0
  containers.addChild(rectAndHole)
  containers.x = window.innerWidth
  containers.y = window.innerHeight
  app.stage.addChild(containers)
  anime({
    targets: containers,
    alpha: 0,
    duration: 0
  })

  nextTick(() => {
    // 动画
    anime({
      targets: containers,
      keyframes: [
        { x: window.innerWidth / 2, y: window.innerHeight / 2, alpha: 1, rotation: 0.785 },
        { x: 0, y: 0, alpha: 0, rotation: 1.57 }
      ],
      duration: 1600,
      easing: 'easeInOutQuad',
      update: function () {
        rectAndHole.scale.set(rectAndHole.alpha / 2 + 1)
        if (funs == 1) return
        rectAndHole.clear()
        rectAndHole.removeChild()
        rectAndHole.beginFill(Color)
        rectAndHole.drawRect(0, 0, R, R)
        rectAndHole.beginHole()
        switch (funs) {
          case 1:
            // 性能炸弹
            // for (let i = 1; i <= nums; i++) {
            //   for (let j = 0; j < nums; j++) {
            //     const ISR = Arr[i][j].ISR
            //     const ILSR = ISR / 2
            //     rectAndHole.drawCircle(SR * Arr[i][j].sp * j, SR * 4 * i, AR[i][j].ISR)
            //   }
            // }
            break
          case 2:
            for (let i = 1; i <= nums; i++) {
              for (let j = 0; j < nums; j++) {
                const ISR = Arr[i][j].ISR
                const ILSR = ISR / 2
                const Bpoints = setStars(
                  ISR,
                  ILSR,
                  SR * Arr[i][j].sp * j,
                  SR * 4 * i,
                  Arr[i][j].r++
                )
                rectAndHole.drawPolygon(Bpoints)
              }
            }
            break
          case 3:
            for (let i = 0; i <= Math.trunc(R / SR / 3); i++) {
              rectAndHole.drawRect(0, SR * 3 * i, AR[i], SR)
            }
            break
        }
        rectAndHole.endHole()
        rectAndHole.endFill()
      },
      complete: function () {
        circle.clear()
        circle.removeChild()
        rectAndHole.removeChild(circle)
        containers.removeAllListeners()
        app.stage.removeChild(containers)
      }
    })
  })
}

export const Rfeather = (app: PIXI.Application) => {
  let seed = Math.floor(Math.random() * 3) + 13
  let nums = seed
  let width = window.innerWidth * 1.5 * radVNums()
  let height = 50 * radVNums()
  for (let i = 0; i < nums; i++) {
    let n = random(6, nums)
    const shape = new PIXI.Graphics()
    shape.beginFill(getRandom(), 0)
    shape.drawRect(-width / 2, -2 * height + height * 2 * n, 50, height)
    shape.x = window.innerWidth
    shape.y = window.innerHeight * 0.6
    const feather = PIXI.Sprite.from(Feathers)
    feather.x = -width / 2
    feather.y = -2 * height + height * 2 * n
    feather.scale.set(0.5 * radVNums())
    shape.addChild(feather)
    app.stage.addChild(shape)

    anime({
      targets: shape,
      width: 0,
      height: 0,
      rotation: (Math.random() - 0.5) * 2 * Math.PI,
      duration: 0,
      easing: 'easeInOutQuad',
      delay: random(20, 60) * i,
      complete: function () {
        anime({
          targets: shape,
          width: feather.width,
          height: feather.height,
          rotation: (Math.random() - 0.5) * 2 * Math.PI,
          duration: 1000,
          easing: 'easeInOutQuad'
        })
        anime({
          targets: shape,
          alpha: 0,
          easing: 'easeInOutQuad',
          delay: random(10, 30) * i + 300,
          complete: function () {
            feather.removeChild()
            shape.clear()
            app.stage.removeChild(shape)
          }
        })
      }
    })
  }
}
// 贝塞尔五角星放大
let Rrotate = 0
export const RsStars = (app: PIXI.Application) => {
  const Color = getRandom()
  const myArr: Array<PIXI.Graphics> = []
  const containers: PIXI.Container = new PIXI.Container()
  function riStars(R: number, num: number, alpha?: number) {
    const Bpoints = generatePolygonPoints(R, 5, 0, 0)
    const LitBpoints = generatePolygonPoints(R * num, 5, 0, 0)
    const bezier = new PIXI.Graphics()
    bezier.beginFill(Color, 1)
    bezier.lineStyle(0, Color, 1)
    bezier.moveTo(Bpoints[0].x, Bpoints[0].y)
    // 绘制
    bezierStars(bezier, Bpoints, LitBpoints)
    bezier.endFill()
    if (alpha) {
      bezier.alpha = alpha
    }
    containers.addChild(bezier)
    myArr.push(bezier)
  }
  riStars(360 * radVNums(), 0.6)
  riStars(400 * radVNums(), 0.95)
  riStars(360 * 1.175 * radVNums(), 0.6, 0.2)
  riStars(400 * 1.175 * radVNums(), 0.95, 0.2)
  app.stage.addChild(containers)
  containers.position.x = window.innerWidth / 2
  containers.position.y = window.innerHeight / 2
  containers.scale.set(0)
  containers.rotation = Rrotate
  Rrotate += 0.1
  anime({
    targets: containers.scale,
    x: 5,
    y: 5,
    duration: 800,
    easing: 'easeInQuart',
    complete: () => {
      myArr[0].removeChild()
      myArr[1].removeChild()
      containers.removeAllListeners()
      app.stage.removeChild(containers)
    }
  })
}
// 光环
export const Rhalo = (app: PIXI.Application) => {
  // 是否加入星星特效
  const stars = random(0, 100) < 3.14 ? true : false
  const container: PIXI.Container = new PIXI.Container()
  const Color = getRandom()
  let direction = random(0, 1) > 0.5 ? true : false
  let R = random(200, 350) * radVNums()
  container.x = window.innerWidth / 2
  container.y = window.innerHeight / 2
  const circle = new PIXI.Graphics()
  circle.lineStyle(R / 5, 0xf9f287, 1)
  circle.beginFill(0x000000, 0)
  circle.drawCircle(0, 0, R)
  circle.endFill()
  container.addChild(circle)
  const Dcircle = new PIXI.Graphics()
  Dcircle.lineStyle(R / 5, Color, 1)
  Dcircle.beginFill(0x000000, 0)
  Dcircle.drawCircle(0, 0, R)
  Dcircle.endFill()
  container.addChild(Dcircle)
  // 遮罩层
  let mask: PIXI.Graphics = new PIXI.Graphics()

  container.addChild(mask)
  app.stage.addChild(container)
  container.scale.set(0)
  container.rotation = random(0, Math.PI)
  Dcircle.mask = mask
  let startAngle = Math.PI
  let maskParams: maskParams = {
    _radius: R * 1.2,
    startAngle: startAngle,
    endAngle: startAngle
  }

  const bezierContainers: PIXI.Container = new PIXI.Container()
  container.addChild(bezierContainers)
  anime({
    targets: container.scale,
    keyframes: [
      { x: 1, y: 1, duration: 1600 },
      { x: 0, y: getBoolean() ? 1 : 0, duration: 400, easing: 'easeInOutQuad' }
    ],
    complete: () => {
      Dcircle.clear()
      circle.clear()
      mask.clear()
      // bezier.clear()
      container.removeAllListeners()
      bezierContainers.removeAllListeners()
    }
  })

  anime({
    targets: maskParams,
    endAngle: startAngle + (direction ? 2 : -2) * Math.PI,
    duration: 1600,
    easing: 'easeInOutQuad',
    update: () => {
      bezierContainers.rotation = maskParams.endAngle
      mask.clear()
      mask.beginFill(0xffffff)
      mask.moveTo(0, 0)
      mask.arc(0, 0, maskParams._radius, maskParams.startAngle, maskParams.endAngle, direction)
      if ((direction ? maskParams.endAngle < 9 : maskParams.endAngle > -2.7) && stars) {
        const Bpoints = generatePolygonPoints(R * 0.6, 5, 0, 0)
        const bezier = new PIXI.Graphics()
        bezier.beginFill(Color, 1)
        bezier.lineStyle(0, Color, 1)
        bezier.moveTo(Bpoints[0].x, Bpoints[0].y)
        bezier.scale.set(0.1)
        bezierStars(bezier, Bpoints)
        bezier.endFill()
        bezierContainers.addChild(bezier)
        bezierContainers.pivot.x = -R
        bezier.rotation = random(0, Math.PI * 2)
        anime({
          targets: bezier,
          x: random(-R / 3, R / 3),
          y: direction ? -R / 2 : R / 2,
          alpha: 0,
          duration: 300,
          easing: 'easeInOutQuad',
          complete: () => {
            bezier.clear()
            bezier.removeChild()
          }
        })
      }
    }
  })
}

export const anm = (app: PIXI.Application) => {
  let anmx = window.innerWidth
  let anmf = true
  let text = anmf ? '一' : '几'
  const time = random(200, 400)
  const color = getRandom()
  const Size = 100 * radVNums()
  const richTextY = random(100, window.innerHeight)
  const style = new PIXI.TextStyle({
    fontFamily: 'Arial',
    fontSize: Size,
    // fontStyle: 'italic',
    fontWeight: 'bold',
    fill: [color], // gradient
    stroke: '#4a1850',
    strokeThickness: 0,
    dropShadow: false,
    dropShadowColor: '#000000',
    dropShadowBlur: 5,
    dropShadowAngle: Math.PI / 6,
    dropShadowDistance: 6,
    wordWrap: true,
    wordWrapWidth: 440,
    lineJoin: 'round'
  })

  const richText = new PIXI.Text(text, style)
  richText.x = anmx
  richText.y = anmf ? 230 : 200

  app.stage.addChild(richText)
  ;(function reSet() {
    richText.x = anmx
    richText.y = richTextY - (anmf ? Size : Size * 1.3)
    richText.text = anmf ? '一' : '几'

    anmx -= Size * radVNums()
    if (anmx > -Size) {
      setTimeout(() => {
        anmf = !anmf
        reSet()
      }, time)
    } else {
      app.stage.removeChild(richText)
    }
  })()
}

// 随机生成贝塞尔五角星
export const RsDomStars = (app: PIXI.Application) => {
  for (let i = 0; i < random(6, 12); i++) {
    const Color = getRandom()
    const R = random(0.5, 1)
    const myArr: Array<PIXI.Graphics> = []
    const containers: PIXI.Container = new PIXI.Container()
    const scale = random(0.75, 2)
    const ran = random(0, 1)
    const flag = ran < 0.5 ? true : false
    function riStars(R: number, num: number) {
      const Bpoints = generatePolygonPoints(R, 5, 0, 0)
      const LitBpoints = flag ? generatePolygonPoints(R * num, 5, 0, 0) : undefined
      const bezier = new PIXI.Graphics()
      bezier.beginFill(Color, 1)
      bezier.lineStyle(0, Color, 1)
      bezier.moveTo(Bpoints[0].x, Bpoints[0].y)
      // 绘制
      bezierStars(bezier, Bpoints, LitBpoints)
      bezier.endFill()

      containers.addChild(bezier)
      myArr.push(bezier)
    }
    let SNum = flag ? 300 : 100
    riStars(SNum * 0.9 * R * radVNums(), 0.6)
    riStars(SNum * R * radVNums(), 0.95)
    app.stage.addChild(containers)
    containers.position.x = random(0, window.innerWidth)
    containers.position.y = random(0, window.innerHeight)
    containers.scale.set(0)
    containers.rotation = random(0, 6.28)
    anime({
      targets: containers.scale,
      keyframes: [
        {
          x: scale * 0.25,
          y: scale * 0.25,
          duration: 800,
          delay: 60 * i
        },
        {
          x: 0,
          y: 0,
          duration: 600,
          delay: 60 * i,
          easing: 'easeInBack'
        }
      ],
      complete: function () {
        myArr[0].removeChild()
        myArr[1].removeChild()
        containers.removeAllListeners()
        app.stage.removeChild(containers)
      }
    })
  }
}

// 生成贝塞尔五角星
export const bezierStars = (
  bezier: PIXI.Graphics,
  Bpoints: Array<PIXI.Point>,
  LitBpoints?: Array<PIXI.Point>
) => {
  for (let i = 0; i < 5; i++) {
    let j = i + 1
    if (j > 4) j = 0
    let as = (Bpoints[i].x + Bpoints[j].x) * 1.5
    let bs = (Bpoints[i].y + Bpoints[j].y) * 1.5
    bezier.bezierCurveTo(Bpoints[i].x, Bpoints[i].y, as, bs, Bpoints[j].x, Bpoints[j].y)
  }
  if (LitBpoints) {
    bezier.beginHole()
    for (let i = 0; i < 5; i++) {
      let j = i + 1
      if (j > 4) j = 0
      let as = (LitBpoints[i].x + LitBpoints[j].x) * 1.5
      let bs = (LitBpoints[i].y + LitBpoints[j].y) * 1.5
      bezier.bezierCurveTo(
        LitBpoints[i].x,
        LitBpoints[i].y,
        as,
        bs,
        LitBpoints[j].x,
        LitBpoints[j].y
      )
    }
    bezier.bezierCurveTo(
      LitBpoints[0].x,
      LitBpoints[0].y,
      (LitBpoints[0].x + LitBpoints[1].x) * 1.5,
      (LitBpoints[0].y + LitBpoints[1].y) * 1.5,
      LitBpoints[1].x,
      LitBpoints[1].y
    )

    bezier.endHole()
  }
}
// 生成五角星路径
export const setStars = (R: number, r: number, x: number = 0, y: number = 0, ang: number = 0) => {
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
      Bpoints.push(
        new PIXI.Point(R * cos(18 + ang + i * angle) + x, -R * sin(18 + ang + i * angle) + y)
      )
      Bpoints.push(
        new PIXI.Point(r * cos(54 + ang + i * angle) + x, -r * sin(54 + ang + i * angle) + y)
      )
    }
  }
  getStarPath(R, r)
  return Bpoints
}
const getBoolean = () => {
  return random(0, 1) < 0.5 ? true : false
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
// 视口对角线 标准为1080*1920 (1)
export function radVNums(): number {
  return Math.sqrt(Math.pow(window.innerHeight, 2) + Math.pow(window.innerWidth, 2)) / 2136
}
