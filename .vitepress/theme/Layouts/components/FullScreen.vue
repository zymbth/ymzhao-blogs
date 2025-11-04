<script setup>
import { ref } from 'vue'

const props = defineProps({
  target: { type: String, default: 'body' },
  alwaysShowIcon: { type: Boolean, default: false },
  color: { type: String },
})

const disabled = ref(true)
const iconColor = ref(props.color || 'var(--tg-txt-color)')

const iconVisi = ref(false)
function triggerFSVisi(show) {
  iconVisi.value = props.alwaysShowIcon || show
}
</script>

<template>
  <Teleport :to="target" :disabled>
    <div
      class="full-screen"
      :class="{ fullscreened: !disabled }"
      @mouseenter="triggerFSVisi(true)"
      @mouseleave="triggerFSVisi(false)"
    >
      <span
        v-show="iconVisi && disabled"
        class="icon-link i-mdi:fullscreen absolute right-1 top-1 z-1 h-30px w-30px"
        @click="disabled = false"
      />
      <span
        v-show="iconVisi && !disabled"
        class="icon-link i-mdi:fullscreen-exit absolute right-1 top-1 z-1 h-30px w-30px"
        @click="disabled = true"
      />
      <slot />
    </div>
  </Teleport>
</template>

<style lang="scss" scoped>
.full-screen {
  position: relative;
  &.fullscreened {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: clamp(500px, 80vw, 1200px);
    margin: auto;
    background-color: var(--tg-bg-color);
    background-image: var(--main-bg-image);
    background-size: 7px 7px;
    -ms-overflow-style: none;
    scrollbar-width: none;
    overflow: auto;
    z-index: 2000;
  }
}
.icon-link {
  color: v-bind(iconColor);
  animation: shining-out 0.3s ease-in-out 1;
  transition: display 0.3s ease-in-out;
  transition-behavior: allow-discrete;
}

@keyframes shining-out {
  0% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}
</style>
