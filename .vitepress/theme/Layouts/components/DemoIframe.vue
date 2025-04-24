<script setup>
/**
 * iframe
 *
 * @example
 * <ClientOnly>
 *   <FullScreen>
 *     <DemoIframe title="Demo Title" src="https://play.vuejs.org/" />
 *   </FullScreen>
 * </ClientOnly>
 */

defineProps({
  height: { type: [String, Number], default: 500 },
  src: { type: String, required: true },
  title: { type: String, default: 'Demo via ifame' }
})
</script>

<template>
  <iframe :height style="width: 100%;" scrolling="no" :title :src frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
    Failed to load this demo({{ src }}).
  </iframe>
</template>
