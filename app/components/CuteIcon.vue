<script lang="ts" setup>
defineOptions({
  inheritAttrs: false,
})

const iconMap: Record<string, string> = {
  home: 'streamline-emojis:house-with-garden',
  homeActive: 'streamline-emojis:house-with-garden',
  calendar: 'streamline-emojis:calendar',
  calendarActive: 'streamline-emojis:calendar',
  explore: 'streamline-emojis:magnifying-glass-tilted-left',
  exploreActive: 'streamline-emojis:star-struck-1',
  qq: 'streamline-emojis:thought-balloon',
  qqActive: 'streamline-emojis:smiling-face-with-heart-eyes',
  back: 'streamline-emojis:backhand-index-pointing-left-1',
  up: 'streamline-emojis:backhand-index-pointing-up-1',
  prev: 'streamline-emojis:backhand-index-pointing-left-1',
  next: 'streamline-emojis:backhand-index-pointing-right-1',
  close: 'streamline-emojis:cross-mark',
  search: 'streamline-emojis:magnifying-glass-tilted-left',
  empty: 'streamline-emojis:open-book',
  location: 'streamline-emojis:compass',
  reply: 'streamline-emojis:e-mail-1',
  article: 'streamline-emojis:green-book',
  profile: 'streamline-emojis:rabbit-face',
  play: 'streamline-emojis:videocassette',
  moon: 'streamline-emojis:first-quarter-moon-face',
  login: 'skill-icons:github-dark',
  logout: 'streamline-emojis:waving-hand-1',
}

const { name } = defineProps<{
  name: string
}>()

const attrs = useAttrs()

const iconName = computed(() => {
  return iconMap[name] ?? name
})
</script>

<template>
  <span class="cute-icon" v-bind="attrs" aria-hidden="true">
    <Icon :name="iconName" class="cute-icon__glyph" />
  </span>
</template>

<style scoped>
.cute-icon {
  --cute-icon-bg: linear-gradient(145deg, #fff8fb 0%, #ffd9e6 100%);
  --cute-icon-shadow: rgba(255, 137, 176, 0.24);

  display: inline-flex;
  width: 1.45em;
  height: 1.45em;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 255, 255, 0.72);
  border-radius: 999px;
  background: var(--cute-icon-bg);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.86),
    0 0.16em 0.45em var(--cute-icon-shadow);
  line-height: 1;
  vertical-align: -0.18em;
  transition:
    transform 0.18s ease,
    box-shadow 0.18s ease;
}

.cute-icon:hover {
  transform: translateY(-1px) scale(1.04);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.9),
    0 0.2em 0.55em var(--cute-icon-shadow);
}

.cute-icon__glyph {
  width: 0.92em;
  height: 0.92em;
}

:global(.dark) .cute-icon {
  --cute-icon-bg: linear-gradient(145deg, #fff1f7 0%, #ffc8dd 100%);
  --cute-icon-shadow: rgba(255, 148, 188, 0.18);
}
</style>
