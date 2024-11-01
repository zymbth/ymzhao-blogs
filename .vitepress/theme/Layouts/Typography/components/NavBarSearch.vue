<script setup>
import VPNavBarSearch from 'vitepress/dist/client/theme-default/components/VPNavBarSearch.vue'
</script>

<template>
  <VPNavBarSearch title="搜索文档(Ctrl+K)" />
</template>

<style lang="scss">
.VPNavBarSearch {
  display: inline-block;
  padding: 0px;
  vertical-align: middle;
  .DocSearch-Button {
    padding: 0;
    height: auto;
    visibility: hidden;
  }
  .DocSearch-Button-Placeholder,
  .DocSearch-Button-Keys {
    display: none !important;
  }
  .DocSearch-Search-Icon {
    margin: 0;
    visibility: visible;
  }
}
</style>
