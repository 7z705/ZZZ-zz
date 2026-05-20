<template>
  <div class="stats-circle">
    <div class="circle-ring" :style="{ background: conicGradient }">
      <div class="circle-center">
        <span class="circle-total">{{ total }}</span>
        <span class="circle-unit">篇</span>
      </div>
    </div>
    <div class="circle-legend">
      <div class="legend-item" v-for="(seg, idx) in segments" :key="idx">
        <span class="legend-dot" :style="{ background: colors[idx % colors.length] }"></span>
        <span class="legend-label">{{ seg.label }}</span>
        <span class="legend-value">{{ seg.value }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StatsCircle',
  props: {
    segments: { type: Array, required: true }
  },
  data() {
    return {
      colors: ['#42B883', '#2196F3', '#E44D26', '#F7DF1E', '#FF9800', '#9C27B0', '#00BCD4']
    }
  },
  computed: {
    total() {
      return this.segments.reduce((sum, s) => sum + s.value, 0)
    },
    conicGradient() {
      if (!this.total) return 'conic-gradient(#ddd 0deg 360deg)'
      let current = 0
      const slices = this.segments.map((seg, i) => {
        const pct = seg.value / this.total
        const start = (current * 360)
        current += pct
        const end = (current * 360)
        const color = this.colors[i % this.colors.length]
        return `${color} ${start}deg ${end}deg`
      })
      return `conic-gradient(${slices.join(', ')})`
    }
  }
}
</script>

<style lang="less" scoped>
.stats-circle {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.circle-ring {
  width: 180px;
  height: 180px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    width: 120px;
    height: 120px;
    border-radius: 50%;
    background: var(--bg-card);
  }
}

.circle-center {
  position: relative;
  z-index: 1;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.circle-total {
  font-size: 32px;
  font-weight: 800;
  color: var(--text-primary);
  line-height: 1;
}

.circle-unit {
  font-size: 12px;
  color: var(--text-secondary);
}

.circle-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: var(--text-secondary);
}

.legend-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}

.legend-value {
  font-weight: 600;
  color: var(--text-primary);
}
</style>
