import * as THREE from 'three'

/**
 * 创建 WebGLRenderer
 */
export function createRenderer(container, alpha = true) {
  const renderer = new THREE.WebGLRenderer({ alpha, antialias: true })
  renderer.setSize(container.clientWidth, container.clientHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.domElement.style.position = 'absolute'
  renderer.domElement.style.top = '0'
  renderer.domElement.style.left = '0'
  renderer.domElement.style.pointerEvents = 'none'
  container.appendChild(renderer.domElement)
  return renderer
}

/**
 * 窗口大小变化时更新 renderer 和 camera
 */
export function handleResize(renderer, camera, container) {
  const w = container.clientWidth
  const h = container.clientHeight
  if (!renderer._lastResizeW || renderer._lastResizeW !== w || renderer._lastResizeH !== h) {
    renderer._lastResizeW = w
    renderer._lastResizeH = h
    renderer.setSize(w, h)
    if (camera.isPerspectiveCamera) {
      camera.aspect = w / Math.max(h, 1)
      camera.updateProjectionMatrix()
    }
  }
}

/**
 * 递归清理 Three.js 资源
 */
export function disposeScene(scene) {
  scene.traverse((obj) => {
    if (obj.geometry) obj.geometry.dispose()
    if (obj.material) {
      if (Array.isArray(obj.material)) {
        obj.material.forEach(m => disposeMaterial(m))
      } else {
        disposeMaterial(obj.material)
      }
    }
  })
  while (scene.children.length) {
    scene.remove(scene.children[0])
  }
}

function disposeMaterial(material) {
  Object.keys(material).forEach(key => {
    const val = material[key]
    if (val && val.isTexture) {
      val.dispose()
    }
  })
  material.dispose()
}

/**
 * 设备性能检测
 * @returns {'low'|'mid'|'high'}
 */
export function detectDevice() {
  const w = window.innerWidth
  const dpr = window.devicePixelRatio || 1
  if (w < 768 || dpr < 1.5) return 'low'
  if (w > 1440 && dpr >= 2) return 'high'
  return 'mid'
}

/**
 * 获取当前主题模式
 */
export function getCurrentTheme() {
  const attr = document.documentElement.getAttribute('data-theme')
  return attr === 'dark' ? 'dark' : 'light'
}

/**
 * 创建主题感知的颜色
 */
export function getThemeColors(theme) {
  return theme === 'dark'
    ? { primary: 0xa5f3fc, secondary: 0x6366f1, accent: 0x8b5cf6, bg: 0x0a0e17 }
    : { primary: 0x1e293b, secondary: 0x3b82f6, accent: 0x6366f1, bg: 0xf5f7fa }
}
