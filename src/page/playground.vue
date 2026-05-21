<template>
  <div class="playground-page">
    <div class="playground-container">
      <h1 class="page-title">在线演示</h1>
      <p class="page-subtitle">
        <!-- 交互式 Demo，展示项目中的技术能力 -->
      </p>

      <div class="demo-tabs">
        <span
          v-for="tab in tabs"
          :key="tab.key"
          class="demo-tab"
          :class="{ active: activeTab === tab.key }"
          @click="activeTab = tab.key"
        >
          <i :class="tab.icon"></i> {{ tab.label }}
        </span>
      </div>

      <div class="demo-content">
        <keep-alive>
          <component :is="activeComponent" />
        </keep-alive>
      </div>

      <div class="demo-description">
        <div v-if="activeTab === 'particles'">
          <h3>Canvas 粒子系统</h3>
          <p>基于 HTML5 Canvas 的交互式粒子动画，支持鼠标排斥/吸引交互，可调节粒子数量、速度、颜色等参数。展示了对 Canvas API、requestAnimationFrame、以及 Vue 响应式系统的综合运用。</p>
          <p class="tech-tags">
            <span>Canvas API</span><span>requestAnimationFrame</span><span>Vue 响应式</span><span>CSS 变量</span>
          </p>
        </div>
        <div v-if="activeTab === 'dragdrop'">
          <h3>看板拖拽系统</h3>
          <p>基于 HTML5 Drag & Drop API 的三栏看板，支持跨列拖拽排序。这个 Demo 直接使用了 vuedraggable 库，展示了在真实项目中使用拖拽 API 的能力，与中海油项目中的拖拽任免功能一脉相承。</p>
          <p class="tech-tags">
            <span>HTML5 Drag API</span><span>vuedraggable</span><span>Vue 组件化</span><span>响应式数据</span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ParticlePlayground from '../components/ParticlePlayground.vue'
import DragDropDemo from '../components/DragDropDemo.vue'

export default {
  name: 'playground',
  components: { ParticlePlayground, DragDropDemo },
  data() {
    return {
      activeTab: 'particles',
      tabs: [
        { key: 'particles', label: '粒子系统', icon: 'el-icon-s-marketing' },
        { key: 'dragdrop', label: '拖拽看板', icon: 'el-icon-s-operation' }
      ]
    }
  },
  computed: {
    activeComponent() {
      return this.activeTab === 'particles' ? 'ParticlePlayground' : 'DragDropDemo'
    }
  }
}
</script>

<style lang="less" scoped>
.playground-page {
  min-height: 100vh;
  background: var(--bg-page);
  padding: 40px 24px;
}

.playground-container {
  max-width: 1200px;
  margin: 0 auto;
}

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

.demo-tabs {
  display: flex;
  gap: 12px;
  margin-bottom: 28px;
}

.demo-tab {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 24px;
  border-radius: 40px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  background: var(--bg-card);
  color: var(--text-secondary);
  border: 1px solid var(--divider);
  transition: all 0.2s;

  &:hover {
    border-color: var(--text-accent);
    color: var(--text-accent);
  }
  &.active {
    background: var(--text-accent);
    color: #fff;
    border-color: var(--text-accent);
  }
}

.demo-content {
  background: var(--bg-card);
  border: var(--card-border);
  border-radius: 20px;
  padding: 24px;
  margin-bottom: 28px;
}

.demo-description {
  background: var(--bg-card);
  border: var(--card-border);
  border-radius: 16px;
  padding: 24px;

  h3 {
    font-size: 18px;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 10px;
  }

  p {
    color: var(--text-secondary);
    line-height: 1.6;
    font-size: 14px;
  }

  .tech-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 14px;

    span {
      background: var(--accent-light);
      color: var(--text-accent);
      padding: 4px 12px;
      border-radius: 40px;
      font-size: 12px;
      font-weight: 500;
    }
  }
}

@media (max-width: 768px) {
  .playground-page {
    padding: 24px 16px;
  }
  .demo-tabs {
    flex-wrap: wrap;
  }
}
</style>
