<template>
  <div ref="targetRef" class="lazy-wrapper">
    <slot v-if="inView" />
    <!-- 可选：在加载前显示骨架屏 -->
    <div v-else class="placeholder" />
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue'

const targetRef = ref()
const inView = ref(false) // 状态：是否已进入视口

/** @type {IntersectionObserver | null} */
let observer = null

onMounted(() => {
  // 创建 IntersectionObserver 实例
  observer = new IntersectionObserver(
    ([entry]) => {
      // 当元素与视口交叉时，entry.isIntersecting 将为 true
      if (entry.isIntersecting) {
        inView.value = true // 更新状态，触发组件加载
        observer?.unobserve(targetRef.value) // 停止观察
        observer?.disconnect() // 完全断开观察器
      }
    },
    {
      // rootMargin: '0px', // 可以在视口边缘扩展或收缩交叉区域
      threshold: 0.1, // 元素可见度达到10%时触发
    }
  )

  // 开始观察目标元素
  if (targetRef.value) {
    observer.observe(targetRef.value)
  }
})

// 组件卸载时，清理观察器，防止内存泄漏
onUnmounted(() => {
  if (observer) {
    observer.disconnect()
  }
})
</script>

<style scoped>
.lazy-wrapper {
  /* 可以根据需要设置样式 */
  position: relative;
}
.placeholder {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: linear-gradient(90deg, rgba(0, 0, 0, 0.04) 33%, rgba(0, 0, 0, 0.1) 50%, rgba(0, 0, 0, 0.04) 66%);
  background-color: var(--tg-bg-color);
  background-size: 300% 100%;
  animation: loading 1s infinite linear;
  border-radius: 4px;
}
.dark .placeholder {
  background-image: linear-gradient(90deg, rgba(0, 0, 0, 0.04) 33%, rgba(0, 0, 0, 0.1) 50%, rgba(0, 0, 0, 0.04) 66%);
}
@keyframes loading {
  0% {
    background-position: right;
  }
}
</style>
