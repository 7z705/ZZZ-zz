<template>
  <div class="particle-playground">
    <div class="playground-canvas-wrap">
      <canvas ref="canvas"></canvas>
      <div class="canvas-hint">移动鼠标与粒子互动</div>
    </div>
    <div class="playground-controls">
      <div class="control-group">
        <label>粒子数量: {{ particleCount }}</label>
        <el-slider v-model="particleCount" :min="10" :max="300" :step="10" @input="resetParticles" />
      </div>
      <div class="control-group">
        <label>移动速度: {{ speed.toFixed(1) }}</label>
        <el-slider v-model="speed" :min="0.3" :max="5" :step="0.1" />
      </div>
      <div class="control-group">
        <label>交互半径: {{ interactRadius }}px</label>
        <el-slider v-model="interactRadius" :min="50" :max="300" :step="10" />
      </div>
      <div class="control-group">
        <label>色相: {{ hue }}</label>
        <el-slider v-model="hue" :min="0" :max="360" :step="5" />
      </div>
      <el-button size="small" @click="toggleMouseRepel" :type="mouseRepel ? 'primary' : 'default'">
        {{ mouseRepel ? '鼠标排斥模式' : '鼠标吸引模式' }}
      </el-button>
      <el-button size="small" @click="resetParticles">重置粒子</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ParticlePlayground',
  data() {
    return {
      particleCount: 120,
      speed: 1.2,
      interactRadius: 150,
      hue: 200,
      mouseRepel: true,
      mouseX: 0,
      mouseY: 0,
      particles: [],
      animationFrame: null,
      canvasWidth: 0,
      canvasHeight: 0,
      isMobile: window.innerWidth < 768
    }
  },
  mounted() {
    this.initCanvas()
    window.addEventListener('resize', this.debouncedResize)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.debouncedResize)
    const canvas = this.$refs.canvas
    if (canvas) canvas.removeEventListener('mousemove', this.onMouseMove)
    if (this.animationFrame) cancelAnimationFrame(this.animationFrame)
  },
  methods: {
    initCanvas() {
      const canvas = this.$refs.canvas
      if (!canvas) return
      const wrap = canvas.parentElement
      this.canvasWidth = wrap.clientWidth
      this.canvasHeight = 500
      canvas.width = this.canvasWidth
      canvas.height = this.canvasHeight
      this.mouseX = this.canvasWidth / 2
      this.mouseY = this.canvasHeight / 2

      canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect()
        this.mouseX = e.clientX - rect.left
        this.mouseY = e.clientY - rect.top
      })

      canvas.addEventListener('mouseleave', () => {
        this.mouseX = this.canvasWidth / 2
        this.mouseY = this.canvasHeight / 2
      })

      this.createParticles()
      this.animate()
    },

    createParticles() {
      const count = this.isMobile ? Math.min(this.particleCount, 80) : this.particleCount
      this.particles = []
      for (let i = 0; i < count; i++) {
        this.particles.push(this.createParticle())
      }
    },

    createParticle() {
      const x = Math.random() * this.canvasWidth
      const y = Math.random() * this.canvasHeight
      return {
        x, y,
        size: Math.random() * 2.5 + 1,
        speedX: (Math.random() - 0.5) * this.speed,
        speedY: (Math.random() - 0.5) * this.speed,
        color: `hsl(${this.hue + Math.random() * 60}, 70%, 65%)`,
        originalX: x,
        originalY: y
      }
    },

    resetParticles() {
      if (this.animationFrame) cancelAnimationFrame(this.animationFrame)
      this.createParticles()
      this.animate()
    },

    toggleMouseRepel() {
      this.mouseRepel = !this.mouseRepel
    },

    animate() {
      const canvas = this.$refs.canvas
      if (!canvas) return
      const ctx = canvas.getContext('2d')
      const { canvasWidth: w, canvasHeight: h } = this

      ctx.clearRect(0, 0, w, h)
      ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--bg-page').trim() || '#F5F7FA'
      ctx.fillRect(0, 0, w, h)

      // 连接线
      ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--divider').trim() || '#E2E8F0'
      ctx.lineWidth = 0.5
      for (let i = 0; i < this.particles.length; i++) {
        for (let j = i + 1; j < this.particles.length; j++) {
          const a = this.particles[i]
          const b = this.particles[j]
          const dx = a.x - b.x
          const dy = a.y - b.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 80) {
            ctx.globalAlpha = 1 - dist / 80
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.stroke()
          }
        }
      }
      ctx.globalAlpha = 1

      this.particles.forEach(p => {
        const dx = this.mouseX - p.x
        const dy = this.mouseY - p.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < this.interactRadius) {
          const angle = Math.atan2(dy, dx)
          const force = (this.interactRadius - dist) / this.interactRadius * 3
          if (this.mouseRepel) {
            p.x -= Math.cos(angle) * force
            p.y -= Math.sin(angle) * force
          } else {
            p.x += Math.cos(angle) * force
            p.y += Math.sin(angle) * force
          }
        } else {
          p.x += (p.originalX - p.x) * 0.02
          p.y += (p.originalY - p.y) * 0.02
        }

        p.speedX = (Math.random() - 0.5) * this.speed
        p.speedY = (Math.random() - 0.5) * this.speed
        p.x += p.speedX * 0.3
        p.y += p.speedY * 0.3

        p.x = Math.max(0, Math.min(w, p.x))
        p.y = Math.max(0, Math.min(h, p.y))

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `hsl(${this.hue + Math.random() * 60}, 70%, 65%)`
        ctx.fill()
      })

      this.animationFrame = requestAnimationFrame(this.animate)
    },

    debouncedResize() {
      clearTimeout(this._resizeTimer)
      this._resizeTimer = setTimeout(() => {
        if (this.animationFrame) cancelAnimationFrame(this.animationFrame)
        this.initCanvas()
      }, 200)
    },

    onMouseMove(e) { /* handled in initCanvas */ }
  }
}
</script>

<style lang="less" scoped>
.particle-playground {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.playground-canvas-wrap {
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  border: var(--card-border);
  background: var(--bg-page);

  canvas {
    display: block;
    width: 100%;
    height: 500px;
  }
}

.canvas-hint {
  position: absolute;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 13px;
  color: var(--text-secondary);
  background: var(--bg-card);
  padding: 6px 16px;
  border-radius: 40px;
  pointer-events: none;
  opacity: 0.8;
}

.playground-controls {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 16px;
  align-items: center;
}

.control-group {
  label {
    display: block;
    font-size: 13px;
    color: var(--text-secondary);
    margin-bottom: 6px;
    font-weight: 500;
  }
}

@media (max-width: 768px) {
  .playground-controls {
    grid-template-columns: 1fr;
  }
  .playground-canvas-wrap canvas {
    height: 350px;
  }
}
</style>
