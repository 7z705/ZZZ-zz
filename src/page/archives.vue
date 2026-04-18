<template>
  <el-row class="container" :gutter="20">
    <el-col :span="18">
      <el-card class="article-card">
        <div class="archives-title">博客文章</div>
        <div class="archives-subtitle">当前共 {{ filteredBlogs.length }} 篇文章</div>
        <div class="search-bar">
          <el-input
            v-model="searchKeyword"
            placeholder="搜索文章标题或摘要"
            clearable>
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>
        </div>
        <div v-if="pagedBlogs.length">
          <blogSummary
            v-for="blog in pagedBlogs"
            :key="blog.id"
            :blogInfo="blog"
            shadow="never"
            class="blog-item" />
        </div>
        <el-empty v-else description="无匹配文章，试试换个关键词吧"></el-empty>
        <div class="pagination-wrap" v-if="filteredBlogs.length">
          <el-pagination
            background
            layout="prev, pager, next"
            :current-page="currentPage"
            :page-size="pageSize"
            :total="filteredBlogs.length"
            @current-change="handleCurrentChange">
          </el-pagination>
        </div>
      </el-card>
    </el-col>
    <el-col :span="6">
      <generInfo/>
    </el-col>
  </el-row>
</template>

<script>
import generInfo from '../components/generInfo.vue'
import blogSummary from '../components/blogSummary.vue'

export default {
  name: 'archives',
  components: { generInfo, blogSummary },
  data() {
    return {
      searchKeyword: '',
      currentPage: 1,
      pageSize: 4,
      blogList: [
        { id: 'article-1', title: 'JS 的一些常用底层原理', description: '从原型链、作用域链、闭包、this 绑定到事件循环...', createTime: '2026-02-22 17:13:30', views: 128, articleUrl: '/articles/js-core-principles.html' },
        { id: 'article-2', title: 'Windows/Mac 下配置 Node.js 开发环境的完整指南', description: '从安装 Node.js、配置 npm 镜像...', createTime: '2026-03-07 15:17:11', views: 96, articleUrl: '/articles/node-env-setup.html' },
        { id: 'article-3', title: '常见 Git 命令及使用指南', description: '整理日常开发中最常用的 Git 命令...', createTime: '2026-03-12 20:09:34', views: 84, articleUrl: '/articles/git-command-guide.html' },
        { id: 'article-4', title: 'JavaScript 常用工具函数库（防抖、深拷贝、日期格式化）', description: '用纯 JavaScript 手写常见工具函数...', createTime: '2026-03-26 09:20:07', views: 73, articleUrl: '/articles/js-utils-library.html' },
        { id: 'article-5', title: '8 个让写代码效率翻倍的 VS Code 插件', description: '推荐我在前端开发中高频使用的 VS Code 插件...', createTime: '2026-04-06 12:03:15', views: 66, articleUrl: '/articles/vscode-plugins.html' },
        { id: 'article-6', title: 'HTML5 语义化与 SEO 最佳实践', description: '深入理解 HTML5 语义化标签，提升网页可访问性和搜索引擎排名。', createTime: '2026-04-10 10:00:00', views: 45, articleUrl: '/articles/html5-semantic.html' },
        { id: 'article-7', title: 'CSS Grid 布局完全指南', description: '从零掌握 CSS Grid 布局，轻松实现复杂响应式页面。', createTime: '2026-04-11 11:00:00', views: 52, articleUrl: '/articles/css-grid-guide.html' },
        { id: 'article-8', title: 'Vue 3 Composition API 实战与响应式原理', description: '详解 Vue 3 Composition API 用法及响应式系统原理，提升组件复用性。', createTime: '2026-04-12 09:30:00', views: 78, articleUrl: '/articles/vue3-composition-api.html' },
        { id: 'article-9', title: 'uni-app 跨端开发最佳实践', description: '从项目搭建到发布，掌握 uni-app 开发 Pad、H5、小程序的全流程技巧。', createTime: '2026-04-13 14:20:00', views: 63, articleUrl: '/articles/uni-app-best-practice.html' },
        { id: 'article-10', title: 'Webpack 5 性能优化：代码分割与懒加载', description: '深入 Webpack 5 配置，实现高效代码分割、懒加载及构建速度优化。', createTime: '2026-04-14 16:45:00', views: 71, articleUrl: '/articles/webpack-optimization.html' }
      ],
    }
  },
  computed: {
    filteredBlogs() {
      const keyword = this.searchKeyword.trim().toLowerCase()
      if (!keyword) return this.blogList
      return this.blogList.filter(blog => 
        (blog.title || '').toLowerCase().includes(keyword) || 
        (blog.description || '').toLowerCase().includes(keyword)
      )
    },
    pagedBlogs() {
      const start = (this.currentPage - 1) * this.pageSize
      return this.filteredBlogs.slice(start, start + this.pageSize)
    }
  },
  watch: {
    searchKeyword() {
      this.currentPage = 1
    },
    '$route.query.keyword': {
      handler(newKeyword) {
        if (newKeyword) {
          this.searchKeyword = newKeyword
        }
      },
      immediate: true
    }
  },
  created() {
    const keyword = this.$route.query.keyword
    if (keyword) {
      this.searchKeyword = keyword
    }
  },
  methods: {
    handleCurrentChange(page) {
      this.currentPage = page
    }
  }
}
</script>

<style lang="less" scoped>
.container { margin-top: 20px; }

/* 标题文字黑白 */
.archives-title {
  font-weight: 700;
  font-size: 30px;
  color: #000000 !important;
}
.archives-subtitle {
  margin-top: 8px;
  font-size: 14px;
  color: #666666 !important;
}

/* 搜索框样式 - 黑白 + 图标下移 */
.search-bar {
  margin: 22px 0 26px;
}
.search-bar /deep/ .el-input__inner {
  border-radius: 48px;
  background: #ffffff !important;
  border: 1px solid #cccccc !important;
  height: 48px;
  color: #000000 !important;
  &:focus {
    border-color: #000000 !important;
    box-shadow: none !important;
  }
}
/* 搜索图标下移 */
.search-bar /deep/ .el-input__prefix {
  top: 55% !important;
  transform: translateY(-50%);
}
.search-bar /deep/ .el-input__prefix .el-input__icon {
  color: #666666 !important;
}

/* 博客文章列表项分割线改为灰色 */
.blog-item {
  margin-bottom: 24px;
  padding-bottom: 24px;
  border-bottom: 1px solid #eeeeee !important;
  &:last-child { border: none !important; }
}

/* 分页器 - 黑白风格 */
.pagination-wrap {
  display: flex;
  justify-content: center;
  margin-top: 28px;
}
.pagination-wrap /deep/ .el-pager li,
.pagination-wrap /deep/ .btn-prev,
.pagination-wrap /deep/ .btn-next {
  background: transparent !important;
  border: none !important;
  border-radius: 48px;
  margin: 0 4px;
  font-weight: 500;
  color: #000000 !important;
  &:hover {
    background: #f0f0f0 !important;
    color: #000000 !important;
  }
  &.active {
    background: #000000 !important;
    color: #ffffff !important;
    box-shadow: none !important;
  }
}
/* 禁用状态箭头 */
.pagination-wrap /deep/ .btn-prev.disabled,
.pagination-wrap /deep/ .btn-next.disabled {
  color: #cccccc !important;
  cursor: not-allowed;
  &:hover {
    background: transparent !important;
  }
}

/* 暗色模式适配 */
[data-theme="dark"] .archives-title {
  color: #ffffff !important;
}
[data-theme="dark"] .archives-subtitle {
  color: #aaaaaa !important;
}
[data-theme="dark"] .search-bar /deep/ .el-input__inner {
  background: #2a2a2a !important;
  border-color: #555555 !important;
  color: #ffffff !important;
  &:focus {
    border-color: #ffffff !important;
  }
}
[data-theme="dark"] .search-bar /deep/ .el-input__prefix .el-input__icon {
  color: #aaaaaa !important;
}
[data-theme="dark"] .blog-item {
  border-bottom-color: #333333 !important;
}
[data-theme="dark"] .pagination-wrap /deep/ .el-pager li,
[data-theme="dark"] .pagination-wrap /deep/ .btn-prev,
[data-theme="dark"] .pagination-wrap /deep/ .btn-next {
  color: #ffffff !important;
  &:hover {
    background: #3a3a3a !important;
  }
  &.active {
    background: #ffffff !important;
    color: #000000 !important;
  }
}
[data-theme="dark"] .pagination-wrap /deep/ .btn-prev.disabled,
[data-theme="dark"] .pagination-wrap /deep/ .btn-next.disabled {
  color: #666666 !important;
}
</style>