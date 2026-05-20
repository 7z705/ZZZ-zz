<template>
  <div class="theme-toggle" @click="toggleTheme">
    <i :class="isDark ? 'el-icon-moon' : 'el-icon-sunny'"></i>
  </div>
</template>

<script>
export default {
  name: 'ThemeToggle',
  data() {
    return {
      isDark: false
    }
  },
  mounted() {
    const theme = document.documentElement.getAttribute('data-theme')
    this.isDark = theme === 'dark'
  },
  methods: {
    toggleTheme() {
      this.isDark = !this.isDark
      const newTheme = this.isDark ? 'dark' : 'light'
      document.documentElement.setAttribute('data-theme', newTheme)
      localStorage.setItem('app-theme', newTheme)
      if (this.$bus) this.$bus.$emit('theme-changed', newTheme)
    }
  }
}
</script>

<style lang="less" scoped>
.theme-toggle {
  position: fixed;
  bottom: 24px;
  right: 24px;
  width: 48px;
  height: 48px;
  border-radius: 48px;
  background: var(--bg-card);
  backdrop-filter: blur(12px);
  border: var(--card-border);
  box-shadow: var(--card-shadow);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 1000;
  font-size: 24px;
  color: var(--text-accent);
  transition: var(--transition);
  &:hover {
    transform: scale(1.05);
    background: var(--accent-light);
  }
}
</style>