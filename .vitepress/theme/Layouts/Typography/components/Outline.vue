<script setup>
import { ref, shallowRef, onMounted, onUnmounted, inject, provide, watch, computed } from 'vue'
import { onContentUpdated, useData } from 'vitepress'
import {
  getHeaders,
  resolveTitle,
} from 'vitepress/dist/client/theme-default/composables/outline.js'
import OutlineItem from './OutlineItem.vue'
import { throttleAndDebounce } from 'vitepress/dist/client/theme-default/support/utils.js'

const props = defineProps({ visible: Boolean })
const emit = defineEmits(['update:visible'])
const visi = computed({
  get: () => props.visible,
  set: val => emit('update:visible', val),
})

const { frontmatter, theme } = useData()

const headers = shallowRef([])
const headerList = ref([])
const isLarge = inject('isLarge')

let mainEl,
  currScrollTop = 0
const showBackTop = ref(false)
const contentElOffsetTop = ref(0)

onMounted(() => {
  mainEl = document.querySelector('.main')
  mainEl.addEventListener('scroll', onScroll)
  watch(
    isLarge,
    () => {
      contentElOffsetTop.value = document.querySelector('.ct-wrap')?.offsetTop
    },
    { immediate: true }
  )
})

onUnmounted(() => {
  mainEl.removeEventListener('scroll', onScroll)
})

onContentUpdated(() => {
  headers.value = getHeaders(frontmatter.value.outline ?? theme.value.outline)
  visi.value = headers.value.length > 1
  headerList.value = getHeaderList(headers.value)
  refreshSectionPosi()
  setTimeout(refreshSectionPosi, 1500)
})

function getHeaderList(list) {
  const res = []
  if (!Array.isArray(list)) return res
  for (const header of list) {
    const { link, title } = header
    res.push({ link, title })
    const subRes = getHeaderList(header.children)
    if (subRes && subRes.length > 0) res.push(...subRes)
  }
  return res
}

provide(
  'activeHeader',
  computed(() => headerList.value.find(s => s.active))
)

const refreshSectionPosi = () => {
  headerList.value.forEach(s => {
    s.top = document.querySelector(s.link)?.offsetTop
  })
}

const onScroll = throttleAndDebounce(() => {
  let idx = -1
  currScrollTop = mainEl.scrollTop
  if (showBackTop.value !== currScrollTop > 500) showBackTop.value = !showBackTop.value
  for (let len = headerList.value.length, i = len - 1; i >= 0; i--) {
    if (currScrollTop - contentElOffsetTop.value >= headerList.value[i].top - 1) {
      idx = i
      break
    } else continue
  }
  const oldIdx = headerList.value.findIndex(s => s.active)
  if (idx !== oldIdx) {
    // console.log('idx: ', idx)
    if (oldIdx > -1) headerList.value[oldIdx].active = false
    if (idx > -1) headerList.value[idx].active = true
  }
}, 200)
</script>
<template>
  <nav class="VPDocAsideOutline" :class="{ 'has-outline': headers.length > 0 }">
    <div class="content">
      <div class="outline-title" id="doc-outline-aria-label">
        {{ resolveTitle(theme) }}
      </div>
      <OutlineItem :headers :root="true" />
    </div>
    <Teleport to="body">
      <span
        v-show="showBackTop"
        @click="mainEl.scrollTo({ top: 0, behavior: 'smooth' })"
        class="i-mdi:arrow-top-bold-circle-outline w-30px h-30px icon-link fixed bottom-10px right-10px z-1"></span>
    </Teleport>
  </nav>
</template>
<style scoped>
.VPDocAsideOutline {
  display: none;
}

.VPDocAsideOutline.has-outline {
  display: block;
}

.content {
  position: relative;
  border-left: 1px solid var(--vp-c-divider);
  padding-left: 8px;
  font-size: 13px;
  font-weight: 500;
}

.outline-marker {
  position: absolute;
  top: 32px;
  left: -1px;
  z-index: 0;
  opacity: 0;
  width: 2px;
  border-radius: 2px;
  height: 18px;
  background-color: var(--vp-c-brand-1);
  transition: top 0.25s cubic-bezier(0, 1, 0.5, 1), background-color 0.5s, opacity 0.25s;
}

.outline-title {
  line-height: 32px;
  font-size: 14px;
  font-weight: 600;
}
</style>
