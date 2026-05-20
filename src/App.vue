<template>
  <div id="app" :class="themeClass">
    <router-view />
    <AIChat />
    <theme-toggle />
  </div>
</template>

<script>
import ThemeToggle from './components/ThemeToggle.vue'
import AIChat from '@/components/AIChat.vue'

export default {
  name: 'App',
  components: { ThemeToggle, AIChat },
  data() {
    return {
      theme: 'light'
    }
  },
  computed: {
    themeClass() {
      return `theme-${this.theme}`
    }
  },
  mounted() {
    const saved = localStorage.getItem('app-theme')
    if (saved === 'light' || saved === 'dark') {
      this.theme = saved
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      this.theme = prefersDark ? 'dark' : 'light'
    }
    document.documentElement.setAttribute('data-theme', this.theme)
    this.trackPageView()
  },
  methods: {
    setTheme(theme) {
      this.theme = theme
      localStorage.setItem('app-theme', theme)
      document.documentElement.setAttribute('data-theme', theme)
    },
    trackPageView() {
      try {
        const key = 'blog_stats'
        const raw = localStorage.getItem(key)
        let stats = raw ? JSON.parse(raw) : { totalVisits: 0, pageViews: {}, articleViews: {}, firstVisit: '', lastVisit: '' }
        const now = new Date().toISOString().slice(0, 10)
        if (!stats.firstVisit) stats.firstVisit = now
        stats.lastVisit = now
        stats.totalVisits = (stats.totalVisits || 0) + 1
        const path = this.$route.path || '/home'
        stats.pageViews = stats.pageViews || {}
        stats.pageViews[path] = (stats.pageViews[path] || 0) + 1
        localStorage.setItem(key, JSON.stringify(stats))
      } catch { /* quota exceeded, ignore */ }
    }
  },
  watch: {
    '$route.path'() {
      this.trackPageView()
    }
  }
}
</script>

<style lang="less">
/* 日间模式（黑白简约） */
:root {
  --bg-page: #F5F7FA;
  --bg-card: #FFFFFF;
  --card-border: 1px solid #E2E8F0;
  --card-shadow: 0 8px 20px rgba(0, 0, 0, 0.04);
  --text-primary: #1E293B;
  --text-secondary: #475569;
  --text-accent: #0F172A;
  --accent-light: #F1F5F9;
  --divider: #E2E8F0;
  --btn-bg: #1E293B;
  --btn-hover: #334155;
  --flip-front-bg: #FFFFFF;
  --flip-back-bg: #F8FAFC;
}

/* 夜间模式（深色科技感） */
[data-theme="dark"] {
  --bg-page: #0A0E17;
  --bg-card: #131A2C;
  --card-border: 1px solid #2D3748;
  --card-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
  --text-primary: #E2E8F0;
  --text-secondary: #94A3B8;
  --text-accent: #A5F3FC;
  --accent-light: #1E293B;
  --divider: #2D3748;
  --btn-bg: #A5F3FC;
  --btn-hover: #67E8F9;
  --flip-front-bg: #131A2C;
  --flip-back-bg: #0F172A;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  background: var(--bg-page);
  font-family: 'Inter', 'Segoe UI', 'PingFang SC', system-ui, sans-serif;
  color: var(--text-primary);
  transition: background 0.3s, color 0.2s;
}

#app {
  min-height: 100vh;
}

/* Element UI 覆盖 */
.el-card {
  background: var(--bg-card) !important;
  border: var(--card-border) !important;
  border-radius: 24px !important;
  box-shadow: var(--card-shadow) !important;
}

.el-input__inner {
  background: var(--bg-card) !important;
  border-color: var(--divider) !important;
  color: var(--text-primary) !important;
}

.el-button--primary {
  background: var(--btn-bg);
  border-color: var(--btn-bg);
  &:hover {
    background: var(--btn-hover);
  }
}

::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  background: var(--divider);
}
::-webkit-scrollbar-thumb {
  background: var(--text-secondary);
  border-radius: 10px;
}
</style>