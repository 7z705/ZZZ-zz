<template>
  <div class="stats-bar-chart">
    <div class="bar-item" v-for="item in sortedItems" :key="item.label">
      <div class="bar-label">{{ item.label }}</div>
      <div class="bar-track">
        <div
          class="bar-fill"
          :style="{ width: barWidth(item.value) + '%' }"
        >
          <span v-if="barWidth(item.value) > 25" class="bar-value-inner">{{ item.value }}</span>
        </div>
        <span v-if="barWidth(item.value) <= 25" class="bar-value-outer">{{ item.value }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StatsBar',
  props: {
    items: { type: Array, required: true },
    color: { type: String, default: 'var(--text-accent)' }
  },
  computed: {
    sortedItems() {
      return [...this.items].sort((a, b) => b.value - a.value)
    }
  },
  methods: {
    barWidth(value) {
      const max = Math.max(...this.items.map(i => i.value), 1)
      return Math.round((value / max) * 100)
    }
  }
}
</script>

<style lang="less" scoped>
.stats-bar-chart {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.bar-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.bar-label {
  width: 120px;
  flex-shrink: 0;
  font-size: 13px;
  color: var(--text-secondary);
  text-align: right;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.bar-track {
  flex: 1;
  height: 28px;
  background: var(--accent-light);
  border-radius: 14px;
  overflow: hidden;
  position: relative;
}

.bar-fill {
  height: 100%;
  background: var(--text-accent);
  border-radius: 14px;
  min-width: 4px;
  display: flex;
  align-items: center;
  transition: width 0.8s cubic-bezier(0.2, 0.9, 0.4, 1.1);
}

.bar-value-inner {
  color: #fff;
  font-size: 12px;
  font-weight: 600;
  margin-left: auto;
  padding-right: 12px;
}

.bar-value-outer {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-secondary);
  margin-left: 8px;
}

@media (max-width: 768px) {
  .bar-label {
    width: 80px;
    font-size: 12px;
  }
}
</style>
