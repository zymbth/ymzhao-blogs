<script setup>
const props = defineProps({ tag: String, default: () => '' })

const tags = props.tag?.split(',').map(t => t.trim()) || []
</script>

<template>
  <div v-for="t in tags" :key="t" class="tag-wrap">
    <span>{{ t }}</span>
  </div>
</template>

<style scoped>
/* .tag-wrap {
  --arrow-len: 8px;
  display: inline-block;
  position: relative;
  font-size: 12px;
  line-height: 16px;
  height: 16px;
  padding: 0 3px;
  margin-right: 8px;
  border-radius: 4px 2px 2px 4px;
  background-color: var(--tg-txt-color);
  color: var(--tg-bg-color);
  box-shadow: 0 0 2px 0 var(--tg-txt-color);
  cursor: default;
}
.tag-wrap::after {
  content: '';
  position: absolute;
  top: 0;
  left: 100%;
  border-left: var(--arrow-len) solid var(--tg-txt-color);
  border-top: var(--arrow-len) solid transparent;
  border-bottom: var(--arrow-len) solid transparent;
} */
.tag-wrap {
  position: relative;
  display: inline-block;
  color: var(--tg-bg-color);
  font-size: 12px;
  line-height: 16px;
  padding: 0 12px 0 4px;
  margin-right: 4px;
  background-color: var(--tg-txt-color);
  border-radius: 4px 50% 50% 4px;
  clip-path: polygon(0 0, 80% 0, 105% 50%, 80% 100%, 0 100%);
  box-shadow: 0 0 2px 0 var(--tg-txt-color);
  cursor: default;
  user-select: none;
}
.tag-wrap::after {
  content: '';
  position: absolute;
  top: 50%;
  right: 4px;
  height: 4px;
  width: 4px;
  background-color: var(--tg-bg-color);
  border-radius: 50%;
  transform: translateY(-50%);
}
</style>
