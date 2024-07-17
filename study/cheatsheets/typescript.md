---
description: typescript 速查表
head:
  - - meta
    - name: keywords
      content: typescript,速查表,cheatsheets
---

# typescript 速查表

> 来源：[Cheat Sheets](https://www.typescriptlang.org/cheatsheets/)

<script setup>
import { getCurrentInstance } from 'vue'

const viewImg = getCurrentInstance().appContext.config.globalProperties.$viewImg

function handleViewImg(index) {
  viewImg('.cheatsheets-wrap', { navbar: true, initialViewIndex: index })
}
</script>
<style>
  .cheatsheets-wrap img {
    cursor: zoom-in;
  }
</style>

<div class="cheatsheets-wrap">
  <h3>Control Flow Analysis</h3>
  <img
    src="./assets/TypeScript%20Control%20Flow%20Analysis-8a549253ad8470850b77c4c5c351d457.png"
    @click="handleViewImg(0)"
  />
  <h3>Interfaces</h3>
  <img
    src="./assets/TypeScript%20Interfaces-34f1ad12132fb463bd1dfe5b85c5b2e6.png"
    @click="handleViewImg(1)"
  />
  <h3>Types</h3>
  <img
    src="./assets/TypeScript%20Types-ae199d69aeecf7d4a2704a528d0fd3f9.png"
    @click="handleViewImg(2)"
  />
  <h3>Classes</h3>
  <img
    src="./assets/TypeScript%20Classes-83cc6f8e42ba2002d5e2c04221fa78f9.png"
    @click="handleViewImg(3)"
  />
</div>
