<script setup>
const props = defineProps({ tag: String, default: () => '' })

const tags = props.tag?.split(',').map(t => t.trim()) || []
</script>

<template>
  <div v-for="t in tags" :key="t" class="tag-wrap inline-block">
    <span>{{ t }}</span>
  </div>
</template>

<style scoped>
.tag-wrap {
  position: relative;
  font-size: 12px;
  line-height: 1.5em;
  border: 2px solid var(--tg-txt-color); /* 边框样式 */
  border-right: none;
  padding-left: 2px;
  margin-right: calc(0.7em + 4px);
  border-radius: 4px 2px 2px 4px;
  background-color: var(--tg-txt-color);
  color: var(--tg-bg-color);
  box-shadow: 0 0 2px 0 var(--tg-txt-color);
  cursor: default;
  > span {
    position: relative;
    z-index: 1;
  }
}

.tag-wrap::after {
  content: '';
  position: absolute;
  top: calc(29.3% / 2 - 0px);
  right: calc(-25% - 1px);
  height: calc(70.7% + 2px);
  aspect-ratio: 1;
  border-top: 2px solid var(--tg-txt-color);
  border-right: 2px solid var(--tg-txt-color);
  border-top-right-radius: 4px;
  transform: rotate(45deg);
  background-color: var(--tg-txt-color);
  box-shadow: 0 0 2px 0 var(--tg-txt-color);
}
</style>
