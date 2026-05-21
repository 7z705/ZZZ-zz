<template>
  <div class="three-playground">
    <div class="playground-canvas-wrap" ref="container">
      <div class="canvas-hint" v-if="!isDragging">{{ hintText }}</div>
    </div>
    <div class="playground-controls">
      <div class="control-group">
        <label>几何体类型</label>
        <div class="geo-btns">
          <el-button
            v-for="g in geoTypes"
            :key="g.key"
            size="mini"
            :type="geoType === g.key ? 'primary' : 'default'"
            @click="switchGeo(g.key)"
          >{{ g.label }}</el-button>
        </div>
      </div>
      <div class="control-group">
        <label>旋转速度: {{ rotSpeed.toFixed(2) }}</label>
        <el-slider v-model="rotSpeed" :min="0" :max="3" :step="0.01" />
      </div>
      <div class="control-group">
        <label>环绕几何体数量: {{ orbitCount }}</label>
        <el-slider v-model="orbitCount" :min="0" :max="20" :step="1" @change="rebuildOrbits" />
      </div>
      <div class="control-group">
        <label>色相: {{ hue }}°</label>
        <el-slider v-model="hue" :min="0" :max="360" :step="5" @input="updateColors" />
      </div>
      <div class="control-btns">
        <el-button size="small" @click="wireframe = !wireframe" :type="wireframe ? 'primary' : 'default'">
          {{ wireframe ? '线框模式' : '实体模式' }}
        </el-button>
        <el-button size="small" @click="autoRotate = !autoRotate" :type="autoRotate ? 'primary' : 'default'">
          {{ autoRotate ? '自动旋转: 开' : '自动旋转: 关' }}
        </el-button>
        <el-button size="small" @click="resetView">重置视角</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import * as THREE from 'three'
import { createRenderer, handleResize, disposeScene, detectDevice, getCurrentTheme, getThemeColors } from '@/utils/threeUtils'

export default {
  name: 'ThreePlayground',
  data() {
    return {
      renderer: null,
      scene: null,
      camera: null,
      animationId: null,
      isRunning: false,
      geoType: 'torusKnot',
      rotSpeed: 0.5,
      orbitCount: 8,
      hue: 200,
      wireframe: false,
      autoRotate: true,
      isDragging: false,
      mainMesh: null,
      orbitMeshes: [],
      deviceLevel: 'mid',
      // mouse drag state
      dragPrev: { x: 0, y: 0 },
      spherical: { theta: 0, phi: Math.PI / 3, radius: 8 }
    }
  },
  computed: {
    hintText() {
      return this.deviceLevel === 'low' ? '滑动手指旋转视角' : '拖拽鼠标旋转视角'
    },
    geoTypes() {
      return [
        { key: 'torusKnot', label: '环面结' },
        { key: 'icosahedron', label: '二十面体' },
        { key: 'cube', label: '立方体' },
        { key: 'torus', label: '环面' }
      ]
    }
  },
  mounted() {
    this.deviceLevel = detectDevice()
    this.initScene()
    this.animate()
  },
  beforeDestroy() {
    this.stop()
  },
  methods: {
    initScene() {
      const container = this.$refs.container
      this.renderer = createRenderer(container, false)
      this.renderer.domElement.style.pointerEvents = 'auto'
      this.renderer.setClearColor(this.getBgColor())

      this.scene = new THREE.Scene()
      this.camera = new THREE.PerspectiveCamera(50, container.clientWidth / 500, 0.1, 50)
      this.updateCameraPosition()

      // lighting
      const ambient = new THREE.AmbientLight(0xffffff, 0.6)
      this.scene.add(ambient)
      const dir = new THREE.DirectionalLight(0xffffff, 0.8)
      dir.position.set(5, 5, 5)
      this.scene.add(dir)
      const dir2 = new THREE.DirectionalLight(0x8888ff, 0.4)
      dir2.position.set(-3, -1, -3)
      this.scene.add(dir2)

      this.createMainGeo()
      this.rebuildOrbits()
      this.bindEvents()
    },

    getBgColor() {
      const style = getComputedStyle(document.documentElement)
      const bg = style.getPropertyValue('--bg-page').trim()
      return bg ? new THREE.Color(this.cssColorToHex(bg)) : new THREE.Color(0xf5f7fa)
    },

    cssColorToHex(css) {
      if (css.startsWith('#')) return parseInt(css.slice(1), 16)
      return 0xf5f7fa
    },

    createMainGeo() {
      if (this.mainMesh) {
        this.scene.remove(this.mainMesh)
        disposeScene(this.mainMesh)
      }
      const geo = this.getGeometry()
      const mat = new THREE.MeshPhongMaterial({
        color: new THREE.Color(`hsl(${this.hue}, 70%, 55%)`),
        specular: 0x222222,
        shininess: 60,
        wireframe: this.wireframe,
        flatShading: true
      })
      this.mainMesh = new THREE.Mesh(geo, mat)
      this.scene.add(this.mainMesh)
    },

    getGeometry() {
      const map = {
        torusKnot: () => new THREE.TorusKnotGeometry(1.2, 0.35, 100, 16),
        icosahedron: () => new THREE.IcosahedronGeometry(1.5, 1),
        cube: () => new THREE.BoxGeometry(2, 2, 2, 2, 2, 2),
        torus: () => new THREE.TorusGeometry(1.3, 0.4, 16, 40)
      }
      return (map[this.geoType] || map.torusKnot)()
    },

    switchGeo(key) {
      this.geoType = key
      this.createMainGeo()
    },

    rebuildOrbits() {
      this.orbitMeshes.forEach(m => {
        this.scene.remove(m)
        disposeScene(m)
      })
      this.orbitMeshes = []
      for (let i = 0; i < this.orbitCount; i++) {
        const geo = new THREE.SphereGeometry(0.12, 8, 8)
        const mat = new THREE.MeshPhongMaterial({
          color: new THREE.Color(`hsl(${(this.hue + i * 30) % 360}, 70%, 60%)`),
          specular: 0x111111,
          shininess: 30,
          wireframe: this.wireframe
        })
        const mesh = new THREE.Mesh(geo, mat)
        mesh.userData = {
          radius: 2.5 + Math.random() * 1.5,
          speed: 0.3 + Math.random() * 0.7,
          offset: Math.random() * Math.PI * 2,
          tilt: (Math.random() - 0.5) * Math.PI * 0.6,
          yOffset: (Math.random() - 0.5) * 1.5
        }
        this.scene.add(mesh)
        this.orbitMeshes.push(mesh)
      }
    },

    updateColors() {
      if (this.mainMesh) {
        this.mainMesh.material.color.set(`hsl(${this.hue}, 70%, 55%)`)
      }
      this.orbitMeshes.forEach((m, i) => {
        m.material.color.set(`hsl(${(this.hue + i * 30) % 360}, 70%, 60%)`)
      })
    },

    updateCameraPosition() {
      const s = this.spherical
      this.camera.position.set(
        s.radius * Math.sin(s.phi) * Math.sin(s.theta),
        s.radius * Math.cos(s.phi),
        s.radius * Math.sin(s.phi) * Math.cos(s.theta)
      )
      this.camera.lookAt(0, 0, 0)
    },

    bindEvents() {
      const canvas = this.renderer.domElement

      canvas.addEventListener('pointerdown', (e) => {
        this.isDragging = true
        this.dragPrev = { x: e.clientX, y: e.clientY }
      })

      window.addEventListener('pointermove', (e) => {
        if (!this.isDragging) return
        const dx = e.clientX - this.dragPrev.x
        const dy = e.clientY - this.dragPrev.y
        this.spherical.theta -= dx * 0.008
        this.spherical.phi -= dy * 0.008
        this.spherical.phi = Math.max(0.2, Math.min(Math.PI - 0.2, this.spherical.phi))
        this.updateCameraPosition()
        this.dragPrev = { x: e.clientX, y: e.clientY }
      })

      window.addEventListener('pointerup', () => {
        this.isDragging = false
      })

      const container = this.$refs.container
      this._resizeObserver = new ResizeObserver(() => {
        handleResize(this.renderer, this.camera, container)
      })
      this._resizeObserver.observe(container)
    },

    resetView() {
      this.spherical = { theta: 0, phi: Math.PI / 3, radius: 8 }
      this.updateCameraPosition()
    },

    animate() {
      this.isRunning = true
      const loop = () => {
        if (!this.isRunning) return
        this.animationId = requestAnimationFrame(loop)

        const t = performance.now() * 0.001

        if (this.autoRotate && this.mainMesh) {
          this.mainMesh.rotation.y += this.rotSpeed * 0.008
          this.mainMesh.rotation.x += this.rotSpeed * 0.003
        }

        this.orbitMeshes.forEach(m => {
          const d = m.userData
          const angle = t * d.speed + d.offset
          m.position.x = Math.cos(angle) * d.radius
          m.position.z = Math.sin(angle) * d.radius
          m.position.y = Math.sin(t * 0.5 + d.offset) * d.yOffset
        })

        this.renderer.render(this.scene, this.camera)
      }
      loop()
    },

    stop() {
      this.isRunning = false
      if (this.animationId) cancelAnimationFrame(this.animationId)
      if (this._resizeObserver) this._resizeObserver.disconnect()
      if (this.scene) disposeScene(this.scene)
      if (this.renderer) {
        this.renderer.dispose()
        if (this.renderer.domElement.parentNode) {
          this.renderer.domElement.parentNode.removeChild(this.renderer.domElement)
        }
      }
    }
  },
  watch: {
    wireframe() {
      if (this.mainMesh) {
        this.mainMesh.material.wireframe = this.wireframe
      }
      this.orbitMeshes.forEach(m => {
        m.material.wireframe = this.wireframe
      })
    }
  }
}
</script>

<style lang="less" scoped>
.three-playground {
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
  height: 500px;
  cursor: grab;
  &:active {
    cursor: grabbing;
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
  z-index: 1;
}

.playground-controls {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 16px;
  align-items: start;
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

.geo-btns {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.control-btns {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}

@media (max-width: 768px) {
  .playground-controls {
    grid-template-columns: 1fr;
  }
  .playground-canvas-wrap {
    height: 380px;
  }
}
</style>
