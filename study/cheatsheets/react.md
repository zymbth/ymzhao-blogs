---
description: react 速查表
head:
  - - meta
    - name: keywords
      content: react,速查表,cheatsheets
created: '2024-09-29'
---

# react 速查表

> 来源：[Cheat Sheets](https://www.epicreact.dev/react-19-cheatsheet)

<script setup>
import { inject } from 'vue'

const viewImg = inject('viewImg')

function handleViewImg() {
  viewImg('.viewer-wrap')
}
</script>
<div class="viewer-wrap">
  <img src="./assets/react-19-cheat-sheet@2x.webp" @click="handleViewImg" />
</div>
