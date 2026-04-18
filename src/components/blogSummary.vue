<template>
  <el-card :shadow="shadow" class="summary-card">
    <div class="title">
      <a
        v-if="blogInfo.articleUrl"
        :href="blogInfo.articleUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="article-link">
        {{ blogInfo.title }}
      </a>
      <router-link v-else :to="`/detail/${blogInfo.id}`">{{ blogInfo.title }}</router-link>
    </div>
    <div class="subtitle">
      <div><i class="el-icon-edit-outline"></i></div>
      <div v-if="blogInfo.updateTime"><i class="el-icon-edit-outline"></i><span> 更新于 {{blogInfo.updateTime | dateFormat}}</span></div>
    </div>
    <p class="content">{{ blogInfo.description }}</p>
    <div class="btn">
      <el-button class="black-white-btn" @click="toDetail">
        {{ blogInfo.mock ? '示例文章' : '阅读原文' }}<i class="el-icon-right"></i>
      </el-button>
    </div>
  </el-card>
</template>

<script>
export default {
  props:['shadow', 'blogInfo'],
  name: 'blogSummary',
  methods: {
    toDetail() {
      if (this.blogInfo.articleUrl) {
        window.open(this.blogInfo.articleUrl, '_blank', 'noopener,noreferrer')
        return
      }
      this.$router.push(`/detail/${this.blogInfo.id}`)
    }
  },
}
</script>

<style lang='less' scoped>
/* 强制所有颜色为黑白灰，去除任何彩色 */
.summary-card {
  background: #ffffff !important;
  border: 1px solid #cccccc !important;
  margin-bottom: 20px;
  box-shadow: none !important;
}
.title {
  text-align: center;
  line-height: 2;
  a, .article-link, .router-link-active, .router-link-exact-active {
    font-size: 24px;
    font-weight: bold;
    text-decoration: none;
    color: #000000 !important;
    &:hover {
      color: #555555 !important;
    }
  }
}
.subtitle {
  text-align: center;
  font-size: 14px;
  color: #666666 !important;
  div {
    display: inline-block;
    margin-right: 15px;
    color: #666666 !important;
  }
  div:nth-child(2) {
    color: #666666 !important;
  }
  i, span {
    color: #666666 !important;
  }
}
.content {
  line-height: 1.8;
  font-size: 15px;
  color: #000000 !important;
  margin: 16px 0;
}
.btn {
  display: flex;
  justify-content: center;
}
.black-white-btn {
  font-size: 14px;
  padding: 8px 16px;
  background-color: #000000 !important;
  border-color: #000000 !important;
  color: #ffffff !important;
  &:hover,
  &:focus {
    background-color: #333333 !important;
    border-color: #333333 !important;
    color: #ffffff !important;
  }
}
/* 覆盖 Element UI 按钮默认的彩色边框和阴影 */
.black-white-btn:active,
.black-white-btn:focus-visible {
  background-color: #000000 !important;
  border-color: #000000 !important;
  outline: none !important;
}

/* 暗色模式 */
[data-theme="dark"] .summary-card {
  background: #1a1a1a !important;
  border-color: #444444 !important;
}
[data-theme="dark"] .title a,
[data-theme="dark"] .title .article-link,
[data-theme="dark"] .title .router-link-active {
  color: #ffffff !important;
  &:hover {
    color: #aaaaaa !important;
  }
}
[data-theme="dark"] .subtitle,
[data-theme="dark"] .subtitle div,
[data-theme="dark"] .subtitle div:nth-child(2),
[data-theme="dark"] .subtitle i,
[data-theme="dark"] .subtitle span {
  color: #aaaaaa !important;
}
[data-theme="dark"] .content {
  color: #ffffff !important;
}
[data-theme="dark"] .black-white-btn {
  background-color: #ffffff !important;
  border-color: #ffffff !important;
  color: #000000 !important;
  &:hover,
  &:focus {
    background-color: #cccccc !important;
    border-color: #cccccc !important;
    color: #000000 !important;
  }
}
</style>