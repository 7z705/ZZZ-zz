<template>
  <div class="drag-demo">
    <p class="demo-hint">拖拽卡片在不同列之间移动，展示 HTML5 拖拽 API 能力</p>
    <div class="kanban-board">
      <div class="kanban-column" v-for="(col, colIdx) in columns" :key="col.id">
        <div class="column-header">
          <span class="column-dot" :style="{ background: col.color }"></span>
          <span class="column-title">{{ col.title }}</span>
          <span class="column-count">{{ col.cards.length }}</span>
        </div>
        <draggable
          v-model="col.cards"
          :group="{ name: 'cards', pull: true, put: true }"
          :animation="200"
          :move="onMove"
          class="column-body"
          ghost-class="drag-ghost"
          drag-class="drag-dragging"
        >
          <div class="kanban-card" v-for="card in col.cards" :key="card.id">
            <div class="card-title">{{ card.title }}</div>
            <div class="card-body">{{ card.desc }}</div>
            <div class="card-footer">
              <span class="card-tag" :style="{ background: col.color + '22', color: col.color }">{{ card.tag }}</span>
            </div>
          </div>
        </draggable>
        <div class="column-footer">
          <el-button size="mini" icon="el-icon-plus" circle @click="addCard(colIdx)"></el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import draggable from 'vuedraggable'

export default {
  name: 'DragDropDemo',
  components: { draggable },
  data() {
    return {
      columns: [
        {
          id: 'todo',
          title: '待处理',
          color: '#409EFF',
          cards: [
            { id: 1, title: '搭建项目脚手架', desc: '初始化 Vue CLI + Element UI 项目结构', tag: '工程化' },
            { id: 2, title: '实现路由懒加载', desc: '优化首屏加载速度', tag: '性能优化' },
            { id: 3, title: '添加响应式布局', desc: '适配移动端和平板设备', tag: 'CSS' }
          ]
        },
        {
          id: 'doing',
          title: '进行中',
          color: '#E6A23C',
          cards: [
            { id: 4, title: '封装 Axios 拦截器', desc: '统一处理 token 注入和错误提示', tag: '工具' },
            { id: 5, title: '暗色模式适配', desc: 'CSS 变量 + localStorage 持久化', tag: '功能' }
          ]
        },
        {
          id: 'done',
          title: '已完成',
          color: '#67C23A',
          cards: [
            { id: 6, title: '实现博客列表页', desc: '含搜索、分页、卡片组件', tag: '组件' },
            { id: 7, title: '评论系统', desc: '集成 Giscus 评论组件', tag: '集成' }
          ]
        }
      ],
      nextId: 8
    }
  },
  methods: {
    onMove(evt) {
      return true
    },
    addCard(colIdx) {
      this.columns[colIdx].cards.push({
        id: this.nextId++,
        title: '新任务 ' + (this.nextId - 1),
        desc: '点击编辑此任务描述...',
        tag: '新任务'
      })
    }
  }
}
</script>

<style lang="less" scoped>
.drag-demo {
  .demo-hint {
    color: var(--text-secondary);
    font-size: 13px;
    margin-bottom: 20px;
    text-align: center;
  }
}

.kanban-board {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.kanban-column {
  background: var(--accent-light);
  border-radius: 14px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  min-height: 300px;
}

.column-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 14px;
  padding-bottom: 12px;
  border-bottom: 2px solid var(--divider);
}

.column-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.column-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
}

.column-count {
  margin-left: auto;
  background: var(--bg-card);
  padding: 2px 10px;
  border-radius: 40px;
  font-size: 12px;
  font-weight: 600;
  color: var(--text-secondary);
}

.column-body {
  flex: 1;
  min-height: 60px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.kanban-card {
  background: var(--bg-card);
  border: var(--card-border);
  border-radius: 10px;
  padding: 14px;
  cursor: grab;
  transition: all 0.2s;

  &:hover {
    box-shadow: var(--card-shadow);
    transform: translateY(-1px);
  }
  &:active {
    cursor: grabbing;
  }
}

.card-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 6px;
}

.card-body {
  font-size: 12px;
  color: var(--text-secondary);
  line-height: 1.5;
  margin-bottom: 10px;
}

.card-tag {
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 40px;
  font-weight: 500;
}

.column-footer {
  margin-top: 12px;
  text-align: center;
}

.drag-ghost {
  opacity: 0.4;
  background: var(--divider);
}

.drag-dragging {
  opacity: 0.9;
  box-shadow: 0 8px 24px rgba(0,0,0,0.15);
  transform: rotate(2deg);
}

@media (max-width: 768px) {
  .kanban-board {
    grid-template-columns: 1fr;
  }
}
</style>
