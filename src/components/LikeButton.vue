<template>
  <div class="like-button" :class="{ liked: isLiked }" @click="toggleLike">
    <i :class="isLiked ? 'el-icon-star-on' : 'el-icon-star-off'"></i>
    <span class="like-count">{{ displayCount }}</span>
  </div>
</template>

<script>
const LIKES_KEY = 'blog_likes'

function getLikes() {
  try {
    const raw = localStorage.getItem(LIKES_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch { return {} }
}

export default {
  name: 'LikeButton',
  props: {
    articleId: { type: String, required: true }
  },
  data() {
    return {
      isLiked: false,
      count: 0
    }
  },
  computed: {
    displayCount() {
      return this.count > 0 ? this.count : ''
    }
  },
  mounted() {
    const likes = getLikes()
    const entry = likes[this.articleId]
    if (entry) {
      this.count = entry.count || 0
      this.isLiked = entry.liked || false
    }
  },
  methods: {
    toggleLike() {
      const likes = getLikes()
      const entry = likes[this.articleId] || { count: 0, liked: false }

      if (entry.liked) {
        entry.count = Math.max(0, entry.count - 1)
        entry.liked = false
      } else {
        entry.count = (entry.count || 0) + 1
        entry.liked = true
      }

      likes[this.articleId] = entry
      try {
        localStorage.setItem(LIKES_KEY, JSON.stringify(likes))
      } catch { /* ignore */ }

      this.count = entry.count
      this.isLiked = entry.liked
    }
  }
}
</script>

<style lang="less" scoped>
.like-button {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 40px;
  background: var(--bg-card);
  border: 1px solid var(--divider);
  cursor: pointer;
  user-select: none;
  transition: all 0.25s cubic-bezier(0.2, 0.9, 0.4, 1.1);

  i {
    font-size: 18px;
    color: var(--text-secondary);
    transition: all 0.25s;
  }

  .like-count {
    font-size: 13px;
    font-weight: 600;
    color: var(--text-secondary);
  }

  &:hover {
    border-color: #F56C6C;
    i { color: #F56C6C; }
  }

  &:active {
    transform: scale(0.92);
  }

  &.liked {
    background: rgba(245, 108, 108, 0.08);
    border-color: #F56C6C;
    i {
      color: #F56C6C;
      animation: likePop 0.35s cubic-bezier(0.2, 0.9, 0.4, 1.1);
    }
    .like-count { color: #F56C6C; }
  }
}

@keyframes likePop {
  0% { transform: scale(1); }
  40% { transform: scale(1.4); }
  100% { transform: scale(1); }
}
</style>
