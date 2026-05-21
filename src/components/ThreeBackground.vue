<template>
  <div class="three-bg" ref="container"></div>
</template>

<script>
import * as THREE from 'three'
import { createRenderer, handleResize, disposeScene, detectDevice, getCurrentTheme, getThemeColors } from '@/utils/threeUtils'

export default {
  name: 'ThreeBackground',
  data() {
    return {
      renderer: null,
      scene: null,
      camera: null,
      animationId: null,
      objects: [],
      particles: null,
      mouseX: 0,
      mouseY: 0,
      targetMouseX: 0,
      targetMouseY: 0,
      theme: 'light',
      isRunning: false,
      deviceLevel: 'mid'
    }
  },
  mounted() {
    this.deviceLevel = detectDevice()
    this.theme = getCurrentTheme()
    this.initScene()
    this.animate()
    this.startVisibilityObserver()
  },
  beforeDestroy() {
    this.stop()
    window.removeEventListener('mousemove', this.onMouseMove)
  },
  methods: {
    onMouseMove(e) {
      this.targetMouseX = (e.clientX / window.innerWidth) * 2 - 1
      this.targetMouseY = -(e.clientY / window.innerHeight) * 2 + 1
    },
    initScene() {
      const container = this.$refs.container
      this.renderer = createRenderer(container, true)
      this.scene = new THREE.Scene()
      this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / Math.max(window.innerHeight, 1), 0.1, 100)
      this.camera.position.z = 30

      this.createObjects()
      this.createParticles()

      window.addEventListener('mousemove', this.onMouseMove)
      window.addEventListener('resize', this.onResize)
      this.$root.$on('theme-changed', this.onThemeChange)
    },

    createObjects() {
      const colors = getThemeColors(this.theme)
      const count = this.deviceLevel === 'low' ? 5 : (this.deviceLevel === 'mid' ? 12 : 18)
      const geos = [
        new THREE.IcosahedronGeometry(0.6, 0),
        new THREE.TorusGeometry(0.5, 0.15, 8, 12),
        new THREE.OctahedronGeometry(0.55, 0),
        new THREE.TetrahedronGeometry(0.5, 0),
        new THREE.TorusKnotGeometry(0.35, 0.1, 64, 8),
        new THREE.DodecahedronGeometry(0.5, 0)
      ]

      for (let i = 0; i < count; i++) {
        const geo = geos[i % geos.length]
        const mat = new THREE.MeshBasicMaterial({
          color: [colors.primary, colors.secondary, colors.accent][i % 3],
          wireframe: true,
          transparent: true,
          opacity: 0.12 + Math.random() * 0.1
        })
        const mesh = new THREE.Mesh(geo, mat)
        mesh.position.set(
          (Math.random() - 0.5) * 40,
          (Math.random() - 0.5) * 30,
          (Math.random() - 0.5) * 20 - 5
        )
        mesh.userData = {
          rotSpeedX: (Math.random() - 0.5) * 0.008,
          rotSpeedY: (Math.random() - 0.5) * 0.008,
          floatSpeed: 0.3 + Math.random() * 0.5,
          floatOffset: Math.random() * Math.PI * 2,
          baseY: mesh.position.y
        }
        this.scene.add(mesh)
        this.objects.push(mesh)
      }
    },

    createParticles() {
      const count = this.deviceLevel === 'low' ? 80 : (this.deviceLevel === 'mid' ? 150 : 200)
      const geo = new THREE.BufferGeometry()
      const positions = new Float32Array(count * 3)
      for (let i = 0; i < count * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 50
        positions[i + 1] = (Math.random() - 0.5) * 40
        positions[i + 2] = (Math.random() - 0.5) * 25 - 5
      }
      geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
      const mat = new THREE.PointsMaterial({
        color: this.theme === 'dark' ? 0xa5f3fc : 0x3b82f6,
        size: 0.04,
        transparent: true,
        opacity: 0.5,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      })
      this.particles = new THREE.Points(geo, mat)
      this.scene.add(this.particles)
    },

    animate() {
      this.isRunning = true
      const loop = () => {
        if (!this.isRunning) return
        this.animationId = requestAnimationFrame(loop)

        this.mouseX += (this.targetMouseX - this.mouseX) * 0.03
        this.mouseY += (this.targetMouseY - this.mouseY) * 0.03

        const t = performance.now() * 0.001
        this.objects.forEach(obj => {
          obj.rotation.x += obj.userData.rotSpeedX
          obj.rotation.y += obj.userData.rotSpeedY
          obj.position.y = obj.userData.baseY + Math.sin(t * obj.userData.floatSpeed + obj.userData.floatOffset) * 1.2
        })

        if (this.particles) {
          this.particles.rotation.y += 0.0003
          this.particles.rotation.x += 0.0001
        }

        this.camera.position.x += (this.mouseX * 2 - this.camera.position.x) * 0.02
        this.camera.position.y += (this.mouseY * 1.5 - this.camera.position.y) * 0.02
        this.camera.lookAt(0, 0, 0)

        this.renderer.render(this.scene, this.camera)
      }
      loop()
    },

    onResize() {
      handleResize(this.renderer, this.camera, this.$refs.container)
    },

    onThemeChange(theme) {
      this.theme = theme || getCurrentTheme()
      const colors = getThemeColors(this.theme)
      this.objects.forEach((obj, i) => {
        obj.material.color.setHex([colors.primary, colors.secondary, colors.accent][i % 3])
      })
      if (this.particles) {
        this.particles.material.color.setHex(this.theme === 'dark' ? 0xa5f3fc : 0x3b82f6)
      }
    },

    startVisibilityObserver() {
      let wasRunning = true
      const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          if (!this.isRunning && wasRunning) {
            this.animate()
          }
          wasRunning = true
        } else {
          wasRunning = this.isRunning
          this.isRunning = false
        }
      }, { threshold: 0 })
      observer.observe(this.$refs.container)
    },

    stop() {
      this.isRunning = false
      if (this.animationId) cancelAnimationFrame(this.animationId)
      window.removeEventListener('resize', this.onResize)
      this.$root.$off('theme-changed', this.onThemeChange)
      if (this.scene) disposeScene(this.scene)
      if (this.renderer) {
        this.renderer.dispose()
        if (this.renderer.domElement.parentNode) {
          this.renderer.domElement.parentNode.removeChild(this.renderer.domElement)
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.three-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 0;
  pointer-events: none;
  overflow: hidden;
}
</style>
