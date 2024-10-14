<script setup>
import { inject } from 'vue'
import { jumpToHash } from '../utils/doc-page'

defineProps({ headers: Array, root: Boolean })

function onClick({ target: el }) {
  setTimeout(jumpToHash, 0, el.href?.split('#')[1])
}

const activeHeader = inject('activeHeader')
function isActive(link, title) {
  if (!activeHeader.value) return false
  const { link: activeLink, title: activeTitle } = activeHeader.value
  return activeLink === link && activeTitle === title
}
</script>

<template>
  <ul class="VPDocOutlineItem" :class="root ? 'root' : 'nested'">
    <li v-for="{ children, link, title } in headers">
      <a
        :class="['outline-link', { active: isActive(link, title) }]"
        :href="link"
        @click="onClick"
        :title
        >{{ title }}</a
      >
      <template v-if="children?.length">
        <OutlineItem :headers="children" />
      </template>
    </li>
  </ul>
</template>

<style scoped>
.root {
  position: relative;
  z-index: 1;
}

.nested {
  padding-right: 16px;
  padding-left: 16px;
}

.outline-link {
  display: block;
  line-height: 32px;
  font-size: 14px;
  font-weight: 400;
  color: var(--vp-c-text-2);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: color 0.5s;
}

.outline-link:hover,
.outline-link.active {
  color: var(--tg-txt-color);
  transition: color 0.25s;
}

.outline-link.nested {
  padding-left: 13px;
}
</style>
