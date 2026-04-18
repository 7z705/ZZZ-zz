<template>
  <div class="flip-card" @mouseenter="flip(true)" @mouseleave="flip(false)">
    <div class="flip-card-inner" :class="{ flipped: isFlipped }">
      <div class="flip-front">
        <slot name="front"></slot>
      </div>
      <div class="flip-back">
        <slot name="back"></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FlipCard',
  data() {
    return {
      isFlipped: false
    }
  },
  methods: {
    flip(enter) {
      this.isFlipped = enter
    }
  }
}
</script>

<style lang="less" scoped>
.flip-card {
  background-color: transparent;
  width: 100%;
  perspective: 1500px;
  cursor: pointer;
}
.flip-card-inner {
  position: relative;
  width: 100%;
  transition: transform 0.5s cubic-bezier(0.23, 1, 0.32, 1);
  transform-style: preserve-3d;
  border-radius: 24px;
}
.flip-card-inner.flipped {
  transform: rotateY(180deg);
}
.flip-front, .flip-back {
  position: relative;
  width: 100%;
  backface-visibility: hidden;
  border-radius: 24px;
  padding: 20px;
  background: var(--flip-front-bg);
  border: var(--card-border);
  box-shadow: var(--card-shadow);
  box-sizing: border-box;
}
.flip-back {
  position: absolute;
  top: 0;
  left: 0;
  transform: rotateY(180deg);
  background: var(--flip-back-bg);
  height: 100%;
}
/* 确保高度由内容撑开，不使用 overflow */
.flip-front, .flip-back {
  overflow: visible;
}
</style>