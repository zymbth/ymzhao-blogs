<script setup>
defineProps({
  height: { type: [String, Number], default: 500 },
  src: { type: String, required: true },
  title: { type: String, default: 'Demo via ifame' }
})
</script>

<template>
  <iframe :height style="width: 100%;" scrolling="no" title :src frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
    See the demo <a :href="src">{{ title }}</a> by <a href="https://ymzhao.work">ymzhao</a>.
  </iframe>
</template>
