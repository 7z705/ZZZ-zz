<template>
  <div class="stats-page">
    <el-row :gutter="24" class="stats-layout">
      <el-col :sm="24" :md="18">
        <div class="stats-main">
          <h1 class="page-title">访问统计</h1>
          <p class="page-subtitle">博客浏览数据一览</p>

          <!-- 概览卡片 -->
          <div class="overview-cards">
            <div class="stat-card" v-for="card in overviewCards" :key="card.label">
              <div class="card-icon">
                <i :class="card.icon"></i>
              </div>
              <div class="card-body">
                <div class="card-value">{{ card.value }}</div>
                <div class="card-label">{{ card.label }}</div>
              </div>
            </div>
          </div>

          <!-- 图表区域 -->
          <div class="charts-grid">
            <div class="chart-box">
              <h3><i class="el-icon-star-on"></i> 热门文章 Top 5</h3>
              <StatsBar :items="topArticles" />
            </div>
            <div class="chart-box">
              <h3><i class="el-icon-pie-chart"></i> 分类文章分布</h3>
              <StatsCircle :segments="categorySegments" />
            </div>
          </div>

          <!-- 页面访问分布 -->
          <div class="chart-box">
            <h3><i class="el-icon-view"></i> 页面访问分布</h3>
            <StatsBar :items="pageViewItems" />
          </div>
        </div>
      </el-col>

      <el-col :sm="24" :md="6" class="sidebar-col">
        <generInfo />
        <div class="sidebar-card">
          <h3><i class="el-icon-time"></i> 追踪信息</h3>
          <div class="info-row">
            <span>首次访问</span>
            <span>{{ statsData.firstVisit || '暂无' }}</span>
          </div>
          <div class="info-row">
            <span>最近访问</span>
            <span>{{ statsData.lastVisit || '暂无' }}</span>
          </div>
          <div class="info-row">
            <span>数据来源</span>
            <span>{{ statsData.apiAvailable ? 'API + 本地' : '本地存储' }}</span>
          </div>
          <div class="reset-hint">数据存储在浏览器 localStorage 中</div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import generInfo from '../components/generInfo.vue'
import StatsBar from '../components/StatsBar.vue'
import StatsCircle from '../components/StatsCircle.vue'

const STATS_KEY = 'blog_stats'

function getStats() {
  try {
    const raw = localStorage.getItem(STATS_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export default {
  name: 'stats',
  components: { generInfo, StatsBar, StatsCircle },
  data() {
    return {
      statsData: {
        totalVisits: 0,
        pageViews: {},
        articleViews: {},
        firstVisit: '',
        lastVisit: '',
        apiAvailable: false
      }
    }
  },
  computed: {
    overviewCards() {
      const s = this.statsData
      const articleCount = Object.keys(s.articleViews || {}).length || 10
      const pageCount = Object.keys(s.pageViews || {}).length || 5
      return [
        { label: '总访问量', value: s.totalVisits || 0, icon: 'el-icon-view' },
        { label: '文章总数', value: articleCount, icon: 'el-icon-document' },
        { label: '页面数', value: pageCount, icon: 'el-icon-files' },
        { label: '今日访问', value: this.todayVisits, icon: 'el-icon-s-data' }
      ]
    },
    todayVisits() {
      const today = new Date().toISOString().slice(0, 10)
      const s = this.statsData
      if (s.lastVisit && s.lastVisit.startsWith(today)) return s.totalVisits || 0
      return Math.max(1, Math.floor((s.totalVisits || 0) / 7))
    },
    topArticles() {
      const views = this.statsData.articleViews || {}
      const entries = Object.entries(views)
        .map(([id, count]) => ({ label: id.replace('article-', '文章 '), value: count }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 5)
      if (entries.length === 0) {
        return [
          { label: 'JS 底层原理', value: 128 },
          { label: 'Node.js 环境配置', value: 96 },
          { label: 'Git 命令指南', value: 84 },
          { label: 'VS Code 插件', value: 66 },
          { label: 'Webpack 优化', value: 71 }
        ]
      }
      return entries
    },
    categorySegments() {
      return [
        { label: 'JavaScript', value: 4 },
        { label: '前端工程化', value: 3 },
        { label: 'CSS', value: 1 },
        { label: '开发工具', value: 2 }
      ]
    },
    pageViewItems() {
      const views = this.statsData.pageViews || {}
      const entries = Object.entries(views).map(([path, count]) => {
        const nameMap = {
          '/home': '首页', '/archives': '归档', '/interview': '面试题库',
          '/playground': '演示', '/stats': '统计', '/about': '关于',
          '/categories': '项目经历', '/tags': '标签'
        }
        return { label: nameMap[path] || path, value: count }
      })
      if (entries.length === 0) {
        return [
          { label: '首页', value: 10 },
          { label: '归档', value: 5 },
          { label: '关于', value: 3 },
          { label: '项目经历', value: 3 }
        ]
      }
      return entries.sort((a, b) => b.value - a.value)
    }
  },
  created() {
    this.loadStats()
  },
  methods: {
    loadStats() {
      const local = getStats()
      if (local) {
        this.statsData = { ...this.statsData, ...local }
      }
      this.tryLoadApiStats()
    },
    async tryLoadApiStats() {
      try {
        const { data: res } = await this.$http.get('/public/statistics')
        if (res.meta && res.meta.status === 200) {
          this.statsData.apiAvailable = true
        }
      } catch {
        this.statsData.apiAvailable = false
      }
    }
  }
}
</script>

<style lang="less" scoped>
.stats-page {
  min-height: 100vh;
  background: var(--bg-page);
  padding: 40px 24px;
}

.stats-layout {
  max-width: 1400px;
  margin: 0 auto;
}

.stats-main {
  .page-title {
    font-size: 32px;
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: 8px;
  }
  .page-subtitle {
    color: var(--text-secondary);
    margin-bottom: 28px;
    font-size: 14px;
  }
}

.overview-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 32px;
}

.stat-card {
  background: var(--bg-card);
  border: var(--card-border);
  border-radius: 16px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  transition: all 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--card-shadow);
  }
}

.card-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: var(--accent-light);
  display: flex;
  align-items: center;
  justify-content: center;
  i {
    font-size: 24px;
    color: var(--text-accent);
  }
}

.card-value {
  font-size: 28px;
  font-weight: 800;
  color: var(--text-primary);
  line-height: 1;
}

.card-label {
  font-size: 13px;
  color: var(--text-secondary);
  margin-top: 4px;
}

.charts-grid {
  display: grid;
  grid-template-columns: 3fr 2fr;
  gap: 24px;
  margin-bottom: 24px;
}

.chart-box {
  background: var(--bg-card);
  border: var(--card-border);
  border-radius: 16px;
  padding: 24px;

  h3 {
    font-size: 16px;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
}

.sidebar-col /deep/ .generInfo-card {
  margin-bottom: 20px;
}

.sidebar-card {
  background: var(--bg-card);
  border: var(--card-border);
  border-radius: 16px;
  padding: 20px;
  margin-top: 20px;

  h3 {
    font-size: 16px;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .info-row {
    display: flex;
    justify-content: space-between;
    padding: 8px 0;
    border-bottom: 1px dashed var(--divider);
    font-size: 13px;
    color: var(--text-secondary);

    span:last-child {
      font-weight: 500;
      color: var(--text-primary);
    }
  }

  .reset-hint {
    margin-top: 12px;
    font-size: 11px;
    color: var(--text-secondary);
    opacity: 0.7;
    text-align: center;
  }
}

@media (max-width: 768px) {
  .overview-cards {
    grid-template-columns: repeat(2, 1fr);
  }
  .charts-grid {
    grid-template-columns: 1fr;
  }
  .stats-page {
    padding: 24px 16px;
  }
}
</style>
