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

const GRID_SIZE = 24
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
