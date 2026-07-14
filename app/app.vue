<script setup lang="tsx">
const isDark = useDark()

// ── 全局 Schema.org 结构化数据 ──────────────────────────
useSchemaOrg([
  defineWebSite({
    name: '张宇解的博客',
  }),
  definePerson({
    name: '张宇解',
    // TODO: 如需添加社交链接，取消注释并补充：
    // sameAs: [
    //   'https://github.com/zyhnbyyds',
    // ],
  }),
])
</script>

<template>
  <div hw-full>
    <NuxtLoadingIndicator :height="3" :color="isDark ? '#2dd4bf' : '#0d9488'" />
    <PreviewContainer :duration="400">
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </PreviewContainer>
  </div>
</template>

<style scoped></style>
