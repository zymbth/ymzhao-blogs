---
description: 基于vue实现的贪吃蛇小游戏
head:
  - - meta
    - name: keywords
      content: 贪吃蛇
created: '2025-10-21'
---

# 贪吃蛇

## demo

<ClientOnly>
  <FullScreen>
    <DemoIframe title="贪吃蛇" src="https://play.vuejs.org/#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" />
  </FullScreen>
</ClientOnly>

## 实现

规则：

1. 地图大小24*24
2. 初始蛇长度为3，位置随机；随机在空余位置生成一个食物
3. 蛇定时步进一次，自动向“前”移动；可以上下左右操作蛇的移动方向，无法向“后”移动
4. 吃掉食物后蛇长度加1，随机生成一个新食物，若没有空余位置则完成游戏
5. 蛇头碰到地图边缘或身体时游戏结束

用一个24*24的二维数组(matrix)表示地图，每个元素代表地图中的一个位置，值为0表示空位，1表示蛇，2表示食物。

用一个列表(snake)表示蛇的当前位置，蛇头在最后。

```js
function step(direction) {
  if (direction === adverseDirection(prevArrow.value)) direction = prevArrow.value
  else prevArrow.value = direction
  const moveStep = {
    ArrowRight: [0, 1],
    ArrowLeft: [0, -1],
    ArrowUp: [-1, 0],
    ArrowDown: [1, 0],
  }[direction]
  const head = snake.value[snake.value.length - 1]
  const newHead = [head[0] + moveStep[0], head[1] + moveStep[1]]
  if(newHead[0] < 0 || newHead[0] >= GRID_SIZE || newHead[1] < 0 || newHead[1] >= GRID_SIZE || matrix.value[newHead[0]][newHead[1]] === 1) {
    alert('Game Over!')
    return
  }
  const eated = matrix.value[newHead[0]][newHead[1]] === 2
  matrix.value[newHead[0]][newHead[1]] = 1
  snake.value.push(newHead)
  if(GRID_SIZE * GRID_SIZE === snake.value.length) {
    alert('You Win!')
    return
  }
  // 进食则生成新食物，否则尾巴前进一格
  if(eated) {
    try {
      const [rowIdx, colIdx] = generateFood()
      matrix.value[rowIdx][colIdx] = 2
    } catch (error) {
      alert('Game Error: ' + (error.message || 'Unknown Error'))
      return
    }
  } else {
    const tail = snake.value.shift()
    matrix.value[tail[0]][tail[1]] = 0
  }
}
// 生成食物，排除snake占据的位置，随机从其余位置选择一个
function generateFood() {
  const emptyCount = GRID_SIZE * GRID_SIZE - snake.value.length;
  if(emptyCount <= 0) throw new Error('Process Error!')
  let randomNum = Math.floor(Math.random() * emptyCount) + 1
  for(let rowIdx = 0; rowIdx < matrix.value.length; rowIdx++) {
    for(let colIdx = 0; colIdx < matrix.value[rowIdx].length; colIdx++) {
      const col = matrix.value[rowIdx][colIdx]
      if(col > 0) continue
      if(--randomNum === 0) return [rowIdx, colIdx]
    }
  }
}
function adverseDirection(direction) {
  return {
    ArrowRight: 'ArrowLeft',
    ArrowLeft: 'ArrowRight',
    ArrowUp: 'ArrowDown',
    ArrowDown: 'ArrowUp',
  }[direction]
}
```

## 源码

```vue
<script setup type="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

const GRID_SIZE = 12
const STEP_INTERVAL = 800
const visible = ref(false)

onMounted(() => {
  visible.value = true
  document.addEventListener('keyup', recodeDirectives)
})
onBeforeUnmount(() => {
  document.removeEventListener('keyup', recodeDirectives)
})

const directions = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight']
const status = ref('init')
const matrix = ref(Array.from({ length: GRID_SIZE }).map(() => Array.from({ length: GRID_SIZE }).fill(0)))
const snake = ref([]) // 蛇头在最后

/**
 * 自动步进
 * @param e 
 */
let stepInterval
const prevArrow = ref()
const currArrows = ref([])
function recodeDirectives({ code }) {
  if(status.value !== 'playing') return
  // 忽略非方向按键事件
  if (!directions.includes(code)) return
  currArrows.value.push(code)
  if(currArrows.value.length > 2) currArrows.value.shift()
}
function startInterval() {
  if(stepInterval) return
  stepInterval = setInterval(() => {
    if(status.value !== 'playing') {
      clearInterval(stepInterval)
      stepInterval = null
      return
    }
    step(currArrows.value.shift() || prevArrow.value)
  }, STEP_INTERVAL)
}
function stopInterval() {
  if(!stepInterval) return
  clearInterval(stepInterval)
  stepInterval = null
}

function initSnake(d) {
  if(!d) d = directions[Math.floor(Math.random() * directions.length)]
  prevArrow.value = d
  currArrows.value = [d]
  const midIdx = Math.floor(GRID_SIZE / 2 - 1)
  let list = [] // 蛇头在最后
  switch (d) {
    case 'ArrowDown':
      list = [[midIdx - 1, midIdx], [midIdx, midIdx]]
      break
    case 'ArrowUp':
      list = [[midIdx + 1, midIdx], [midIdx, midIdx]]
      break
    case 'ArrowRight':
      list = [[midIdx, midIdx - 1], [midIdx, midIdx]]
      break
    case 'ArrowLeft':
      list = [[midIdx, midIdx + 1], [midIdx, midIdx]]
      break
    default: throw new Error('Invalid direction')
  }
  snake.value = []
  list.forEach(([x, y]) => {
    matrix.value[x][y] = 1
    snake.value.push([x, y])
  })
}

function init() {
  if(!['init', 'gameover', 'win'].includes(status.value)) return
  try {
    matrix.value = Array.from({ length: GRID_SIZE }).map(() => Array.from({ length: GRID_SIZE }).fill(0))
    initSnake()
    // 初始食物位置
    const [rowIdx, colIdx] = generateFood()
    matrix.value[rowIdx][colIdx] = 2
    status.value = 'init'
    start()
  } catch (error) {
    console.error(error)
  }
}
function start() {
  if(!['init', 'paused'].includes(status.value)) return
  status.value = 'playing'
  document.addEventListener('keyup', recodeDirectives)
  // 恢复自动步进
  startInterval()
}
function pause() {
  if(status.value !== 'playing') return
  status.value = 'paused'
  document.removeEventListener('keyup', recodeDirectives)
  // 停止自动步进
  stopInterval()
}
function stop(s) {
  if(!['paused', 'playing'].includes(status.value) || !['gameover', 'win'].includes(s)) return
  status.value = s
  document.removeEventListener('keyup', recodeDirectives)
}
function step(direction) {
  if(status.value !== 'playing') return
  if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(direction)) return
  if (direction === adverseDirection(prevArrow.value)) direction = prevArrow.value
  else prevArrow.value = direction
  const moveStep = {
    ArrowRight: [0, 1],
    ArrowLeft: [0, -1],
    ArrowUp: [-1, 0],
    ArrowDown: [1, 0],
  }[direction]
  const head = snake.value[snake.value.length - 1]
  const newHead = [head[0] + moveStep[0], head[1] + moveStep[1]]
  if(newHead[0] < 0 || newHead[0] >= GRID_SIZE || newHead[1] < 0 || newHead[1] >= GRID_SIZE || matrix.value[newHead[0]][newHead[1]] === 1) {
    stop('gameover')
    alert('Game Over!')
    return
  }
  const eated = matrix.value[newHead[0]][newHead[1]] === 2
  matrix.value[newHead[0]][newHead[1]] = 1
  snake.value.push(newHead)
  if(GRID_SIZE * GRID_SIZE === snake.value.length) {
    stop('win')
    alert('You Win!')
    return
  }
  // 进食则生成新食物，否则尾巴前进一格
  if(eated) {
    try {
      const [rowIdx, colIdx] = generateFood()
      matrix.value[rowIdx][colIdx] = 2
    } catch (error) {
      stop('gameover')
      alert('Game Error: ' + (error.message || 'Unknown Error'))
      return
    }
  } else {
    const tail = snake.value.shift()
    matrix.value[tail[0]][tail[1]] = 0
  }
}
// 生成食物，排除snake占据的位置，随机从其余位置选择一个
function generateFood() {
  const emptyCount = GRID_SIZE * GRID_SIZE - snake.value.length;
  if(emptyCount <= 0) throw new Error('Process Error!')
  let randomNum = Math.floor(Math.random() * emptyCount) + 1
  for(let rowIdx = 0; rowIdx < matrix.value.length; rowIdx++) {
    for(let colIdx = 0; colIdx < matrix.value[rowIdx].length; colIdx++) {
      const col = matrix.value[rowIdx][colIdx]
      if(col > 0) continue
      if(--randomNum === 0) return [rowIdx, colIdx]
    }
  }
}
function adverseDirection(direction) {
  return {
    ArrowRight: 'ArrowLeft',
    ArrowLeft: 'ArrowRight',
    ArrowUp: 'ArrowDown',
    ArrowDown: 'ArrowUp',
  }[direction]
}
</script>

<template>
  <div class="container">
    <div v-show="visible" class="panel-wrap">
      <div id="panel" :class="[status]">
        <div v-if="['init', 'paused', 'gameover', 'win'].includes(status)" class="overlay">
          <button v-if="status === 'init'" @click="init">开始</button>
          <button v-if="status === 'paused'" @click="start">继续</button>
          <button v-if="status === 'gameover'" @click="init">重新开始</button>
          <button v-if="status === 'win'" @click="init">重新开始</button>
        </div>
        <template v-for="(row, rowIdx) in matrix">
          <div v-for="(cell, colIdx) in row" :key="colIdx" class="cell-wrap">
            <div
              v-if="cell"
              class="cell"
              :class="{
                body: cell === 1,
                head: cell === 1 && snake[snake.length - 1][0] === rowIdx && snake[snake.length - 1][1] === colIdx,
                food: cell === 2
              }"
            />
          </div>
        </template>
      </div>
    </div>
    <div class="menu">
      <!-- <div>currArrows: {{ currArrows }}</div> -->
      <button v-if="status === 'playing'" @click="pause">暂停</button>
      <button v-if="['paused', 'playing'].includes(status)" @click="stop('gameover')">结束</button>
    </div>
  </div>
</template>

<style>
html,body {
  margin: 0;
}
.container {
  height: 100vh;
  height: 100dvh;
  padding: 1rem;
  background: #fff;
  box-sizing: border-box;
}
.panel-wrap {
  display: flex;
  justify-content: center;
  align-items: center;
}
#panel {
  --cellLen: clamp(10px, calc(min(90vw, 80vh) / 24), 36px);
  position: relative;
  display: grid;
  grid-template-columns: repeat(v-bind(GRID_SIZE), var(--cellLen));
  border: 1px solid rgba(0,0,0,0.4);
}
.overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0,0,0,0.3);
  z-index: 10;
}
.cell-wrap {
  display: flex;
  justify-content: center;
  align-items: center;
  height: var(--cellLen);
  width: var(--cellLen);
  min-width: 0;
  min-height: 0;
  z-index: 2;
}
.cell {
  height: 70%;
  width: 70%;
  cursor: pointer;
  user-select: none;
}
.cell.body, .cell.head {
  background-color: #1e1e1e;
  box-shadow: 0 0 2px 1px rgba(0,0,0,0.4);
}
.cell.head {
  height: 90%;
  width: 90%;
  border-radius: 2px;
}
.cell.food {
  background-color: #0ff;
  box-shadow: 0 0 2px 1px rgba(0,255,255,0.4);
}
.menu {
  text-align: center;
  margin-top: 1rem;
}
</style>
```
