<template>
  <div class="tag-cloud-wrap" ref="wrap">
    <canvas ref="canvas"></canvas>
  </div>
</template>

<script>
function getTheme() {
  const attr = document.documentElement.getAttribute('data-theme')
  return attr === 'dark' ? 'dark' : 'light'
}

export default {
  name: 'TagCloud',
  props: {
    tags: { type: Array, default: () => [] }
  },
  data() {
    return {
      particles: [],
      mouse: { x: -9999, y: -9999 },
      animId: null,
      w: 0,
      h: 0,
      ro: null,
      theme: 'light'
    }
  },
  mounted() {
    this.theme = getTheme()
    this.init()
    this._onThemeChange = () => { this.theme = getTheme() }
    if (this.$root && this.$root.$on) {
      this.$root.$on('theme-changed', this._onThemeChange)
    }
  },
  beforeDestroy() {
    cancelAnimationFrame(this.animId)
    if (this.ro) this.ro.disconnect()
    window.removeEventListener('mousemove', this._onMouse)
    if (this.$root && this.$root.$off && this._onThemeChange) {
      this.$root.$off('theme-changed', this._onThemeChange)
    }
  },
  methods: {
    colors() {
      return this.theme === 'dark'
        ? { fill: 'rgba(30,41,59,0.92)', stroke: 'rgba(100,116,139,0.5)', text: '#e2e8f0', glow: 'rgba(100,116,139,0.15)' }
        : { fill: 'rgba(255,255,255,0.94)', stroke: 'rgba(0,0,0,0.12)', text: '#1e293b', glow: 'rgba(0,0,0,0.06)' }
    },
    init() {
      const canvas = this.$refs.canvas
      const wrap = this.$refs.wrap
      this.ctx = canvas.getContext('2d')

      const resize = () => {
        this.w = wrap.clientWidth
        this.h = wrap.clientHeight
        canvas.width = this.w * (window.devicePixelRatio || 1)
        canvas.height = this.h * (window.devicePixelRatio || 1)
        canvas.style.width = this.w + 'px'
        canvas.style.height = this.h + 'px'
        this.ctx.setTransform(1, 0, 0, 1, 0, 0)
        this.ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1)
        this.layoutParticles()
      }

      this.ro = new ResizeObserver(resize)
      this.ro.observe(wrap)
      resize()

      this._onMouse = (e) => {
        const rect = wrap.getBoundingClientRect()
        this.mouse.x = e.clientX - rect.left
        this.mouse.y = e.clientY - rect.top
      }
      window.addEventListener('mousemove', this._onMouse)

      canvas.addEventListener('click', (e) => {
        const rect = wrap.getBoundingClientRect()
        const mx = e.clientX - rect.left
        const my = e.clientY - rect.top
        for (const p of this.particles) {
          const dx = mx - p.x
          const dy = my - p.y
          if (Math.sqrt(dx * dx + dy * dy) < p.r) {
            this.$emit('tag-click', p.label)
            break
          }
        }
      })

      this.animate()
    },

    layoutParticles() {
      this.particles = this.tags.map(tag => ({
        label: tag,
        x: Math.random() * this.w,
        y: Math.random() * this.h,
        homeX: 0,
        homeY: 0,
        r: 38 + Math.random() * 10,
        vx: 0,
        vy: 0,
        phase: Math.random() * Math.PI * 2
      }))
      this.distribute()
    },

    distribute() {
      const cols = Math.max(2, Math.ceil(Math.sqrt(this.particles.length * (this.w / Math.max(this.h, 1)))))
      const rows = Math.ceil(this.particles.length / cols)
      const cellW = this.w / (cols + 1)
      const cellH = Math.min(110, this.h / (rows + 1))
      const startX = (this.w - cols * cellW) / 2 + cellW / 2
      const startY = (this.h - rows * cellH) / 2 + cellH / 2

      this.particles.forEach((p, i) => {
        const col = i % cols
        const row = Math.floor(i / cols)
        p.homeX = startX + col * cellW + (Math.random() - 0.5) * 30
        p.homeY = startY + row * cellH + (Math.random() - 0.5) * 20
      })
    },

    animate() {
      const ctx = this.ctx
      const { w, h, mouse, particles } = this
      const c = this.colors()

      ctx.clearRect(0, 0, w, h)

      const t = performance.now() * 0.001

      for (const p of particles) {
        const dx = mouse.x - p.x
        const dy = mouse.y - p.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        const magnetRange = 160
        let fx = 0
        let fy = 0

        if (dist < magnetRange && dist > 1) {
          const strength = (1 - dist / magnetRange) * 4
          fx = (dx / dist) * strength
          fy = (dy / dist) * strength
        }

        const sx = p.homeX - p.x
        const sy = p.homeY - p.y
        fx += sx * 0.03
        fy += sy * 0.03

        fx += Math.sin(t * 1.3 + p.phase) * 0.15
        fy += Math.cos(t * 1.7 + p.phase) * 0.15

        p.vx = (p.vx + fx) * 0.9
        p.vy = (p.vy + fy) * 0.9
        p.x += p.vx
        p.y += p.vy

        p.x = Math.max(p.r, Math.min(w - p.r, p.x))
        p.y = Math.max(p.r, Math.min(h - p.r, p.y))

        const hoverDist = Math.sqrt((mouse.x - p.x) ** 2 + (mouse.y - p.y) ** 2)
        const hovered = hoverDist < p.r + 20
        const scale = hovered ? 1.12 : 1
        const r = p.r * scale

        // glow
        const glow = ctx.createRadialGradient(p.x, p.y, r * 0.6, p.x, p.y, r * 1.6)
        glow.addColorStop(0, c.glow)
        glow.addColorStop(1, 'transparent')
        ctx.fillStyle = glow
        ctx.beginPath()
        ctx.arc(p.x, p.y, r * 1.6, 0, Math.PI * 2)
        ctx.fill()

        // body
        ctx.fillStyle = c.fill
        ctx.beginPath()
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2)
        ctx.fill()
        ctx.strokeStyle = c.stroke
        ctx.lineWidth = 1.5
        ctx.stroke()

        // text
        ctx.fillStyle = c.text
        ctx.font = `600 ${hovered ? 14 : 13}px "PingFang SC", "Microsoft YaHei", sans-serif`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(p.label, p.x, p.y)
      }

      this.animId = requestAnimationFrame(this.animate)
    }
  }
}
</script>

<style lang="less" scoped>
.tag-cloud-wrap {
  position: relative;
  width: 100%;
  height: 300px;
  canvas {
    display: block;
    cursor: pointer;
  }
}

@media (max-width: 768px) {
  .tag-cloud-wrap {
    height: 260px;
  }
}
</style>
