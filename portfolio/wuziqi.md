---
description: 五子棋
head:
  - - meta
    - name: keywords
      content: 五子棋
created: '2024-12-26'
---

# 五子棋

## demo

<ClientOnly>
  <FullScreen>
    <DemoIframe title="五子棋" src="https://play.vuejs.org/#eNrNV91u2zYUfhVO3RB5sRw7TTDATbJ1azF02NaiK7CLKFhpiZLpSpRAUrbTIC+wXewt9gK7WB+ofY99JCVZsZWg7YZhMGyJhx/P+c4PD+kr72FZjpYV86beiYokLzVRTFflWSh4XhZSkysiWUKuSSKLnOwBuheKUESFUJrEVFNyagD++cUASwTXjyDz8d5gyoxeMlmjJphIKhFpXgiiJU/TjD2zAH9ArkJBavhoSbOKYdHN4ekpmZAvySGZkkkoro2RVtucitgp82WxehKvhyQqMjxrxTwhvuHrdJ07zMW5w1wMQE9XEgqJ9aoftUWoURvNWfTqZy78QW2L1Gy+pTl7ujTOOenGBriT7QD0e7TR4XQjPS94zopK+xCdnjUWacak9l86ZeTTqy7Ra7Li4pOXNYtulsBkSI7HO7Y3GKd/ExPE4KGU9HJkCsK/IhkTqZ4jIcfkejDKaen/YljdgUl4lvnjwY7NTRj7MjZSRc5cqJ8XK0TaBRNB3CRCSyrUDxRxXXdWDt5nqZ19xGlaCJqZRG5h6mFCM4VxD3FoNoVXc8+YRvlVQiNcYyNICkl8I+VG8gCPEwL4yIUG4/39tnjcxolYlpltU6zO+UWdOUPUirETuglul5rFsLq/3wztEkcEa453/EIBEAafthQ0tOtKtT87Iejs5E3cqZQ1G+eGZArKzq0HfUEAvjcILXbhsAuHRSxa+KIDd55+AmvnC7ubzbM17DafEWE9pE4Rhrf4CGxvkjcF4uweHJB3v//59s2vJDgj7/764+2b33b8PHJ+To77kozsdkiaJa7lGJ+bBoZ37uZXc56hkJ30DJCO+6aYykrNd5vc/n7TwILAdOnW407lN9W7Ux8WeMOfSe2PeX6IP7zjz+So61ANMTH6jxwyeTPZcnkzGdzN28QWqIkynkHw7yXuI/zE2/8jcXVT+Kd5+1h/dlrQyYG7teC+goFmObqiZhgRchLzJeHxaeiVVLAs9KwU8gZFlgHig3ljcFj7O8DRZ0+7Fl9rijKqFMCm/wYrScvQI19FGY9eQXj75QOo1oxZurmVwA6wHTM9hrB62oyvyCyj0atpfTCgmx8OTSI064gmiJN3dnIARRv6ndHJwc0Y1VM3xBgqfZmZ13s2dC63QWCsfM/ElNwfl+sH9rZWKG664xSZwWq+ZFYcc2VOpylJJY+txLwEjY0AIahyocyqklHtT46HZEml35oYDLAK6XX2p9MZQwjrMwr1qpnQU7K3t8WBzhQUa8dBFyXiQrPIv6mZHJBDo90UeQItd0JWPDb3lj7M52hiZJ9MyrWDzhlP57fo28bOkMdU4pyNA57TFAnMuGBUBqmkMYdzvi4ILodzjbJMZ9QfD+1ndDQwSobuwC2pBNRqHfYpmBVaF/l7atjmpfhr0Nry4+bQLnkdcBGz9ZQEE5eyUIzaLVLfHZtqSDLmymZRKc2TS9RBncoIv0zaOZrxVASo6hz10ZE38e3hUGepZybnIqhnx62g0WQkIGzpOqbNzBfjz7qKm+GskDGTgQlxBXLHtTiqpCrkFIXIW7aVAlCxjEVQJwpharKxNbL72FnsRBybwmi5N2HmUxtcB2pO42IFtvgclWtyiO9WRru6bUO4VXeSJB+uGD3WtgNv6GmFlCU8HS1UIfCf0dpBqyryEgeCfFqajahCb9ocB6FHs6xYfWdlppUPG7nt9j3yhVobWeg9wyWMySULvXZOU5ky7aYf//QjW+O9ncyLuMqAvmPyObMNAhwd7GvEBrQ7OMv2if3ny0X6Qj1eo0BV41R7Fll86OHf8Dd3uL6he39kLzwI5rV3/TcM6Ago" />
  </FullScreen>
</ClientOnly>

## 源码

```vue
<script setup>
import { ref } from 'vue'

const data = ref([])
initData()

const player = ref(1)
function trigglePlayer() {
  player.value = player.value === 1 ? 2 : 1
}

function handlePlay(rowIdx, colIdx) {
  if (data.value[rowIdx][colIdx]) return
  data.value[rowIdx][colIdx] = player.value
  if (checkWin()) {
    handleGameOver()
    return
  }
  trigglePlayer()
}

function handleGameOver() {
  setTimeout(() => {
    alert(`Player ${player.value} win!`)
    initData()
  }, 50)
}

function initData() {
  data.value = Array.from({ length: 15 }).map(_ => Array.from({ length: 15 }).fill(0))
}

function checkWin() {
  if (data.value.some(checkRow)) return true
  if (transMatrix(data.value).some(checkRow)) return true
  if (checkDiagonal()) return true
  return false
}

function checkRow(row) {
  let count = 0
  for (let i = 0; i < row.length; i++) {
    const cell = row[i]
    if (cell === player.value) {
      count++
      if (count === 5) return true
    } else {
      count = 0
    }
  }
  return false
}
function transMatrix(arr) {
  const res = []
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr[i].length; j++) {
      if (!res[j]) res[j] = []
      res[j][i] = arr[i][j]
    }
  }
  return res
}

function checkDiagonal() {
  // 右上 -> 左下
  for (let i = 4; i < 15; i++) {
    const row = []
    let rowIdx = 0, colIdx = i
    while(colIdx >= 0) {
      row.push(data.value[rowIdx++][colIdx--])
    }
    if (checkRow(row)) return true
  }
  for (let i = 1; i < 11; i++) {
    const row = []
    let rowIdx = i, colIdx = 14
    while(rowIdx < 15) {
      row.push(data.value[rowIdx++][colIdx--])
    }
    if (checkRow(row)) return true
  }
  // 左上 -> 右下
  for (let i = 10; i >= 0; i--) {
    const row = []
    let rowIdx = 0, colIdx = i
    while(colIdx < 15) {
      row.push(data.value[rowIdx++][colIdx++])
    }
    if (checkRow(row)) return true
  }
  for (let i = 1; i < 11; i++) {
    const row = []
    let rowIdx = i, colIdx = 0
    while(rowIdx < 15) {
      row.push(data.value[rowIdx++][colIdx++])
    }
    if (checkRow(row)) return true
  }
  return false
}
</script>

<template>
  <div id="panel">
    <template v-for="(row, rowIdx) in data">
      <div class="cell-wrap" @click="handlePlay(rowIdx, colIdx)" v-for="(cell, colIdx) in row">
        <div class="cell" :class="{ black: cell === 2, white: cell === 1 }"></div>
      </div>
    </template>
  </div>
</template>

<style>
#panel {
  --cellLen: 30px;
  position: relative;
  display: grid;
  grid-template-columns: repeat(15, var(--cellLen));
}
#panel::before {
  content: '';
  position: absolute;
  top: calc(var(--cellLen) / 2);
  left: calc(var(--cellLen) / 2);
  width: calc(var(--cellLen) * 14 + 1px);
  height: calc(var(--cellLen) * 14 + 1px);
  background-image: linear-gradient(to right, rgba(0,0,0,0.4) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.4) 1px, transparent 1px);
  background-size: var(--cellLen) var(--cellLen);
  z-index: -1;
}

.cell-wrap {
  display: flex;
  justify-content: center;
  align-items: center;
  height: var(--cellLen);
  width: var(--cellLen);
  min-width: 0;
  min-height: 0;
}
.cell {
  height: 70%;
  width: 70%;
  border-radius: 50%;
  cursor: pointer;
  user-select: none;
}
.cell.black {
  background-color: #1e1e1e;
  box-shadow: 0 0 4px 2px rgba(0,0,0,0.4);
}
.cell.white {
  background-color: #fff;
  box-shadow: 0 0 4px 2px rgba(0,0,0,0.4);
}
</style>
```
