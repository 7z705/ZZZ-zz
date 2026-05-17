<template>
  <div class="home-container">
    <div class="hero-section">
      <h1 class="hero-title">Hi, 我是 <span class="highlight">郑瞄瞄</span></h1>
      <p class="hero-sub">前端开发工程师 · 一年实习经验 · 随时到岗</p>
      <div class="hero-badge">✨ 保持好奇，持续创造</div>
    </div>

    <div class="grid-layout">
      <div class="left-area">
        <div class="card intro-card">
          <div class="card-header"><i class="el-icon-user"></i> 关于我</div>
          <div class="intro-text">目前就读于郑州轻工业大学，全日制统招本科，今年6月份毕业，有英语四级证书，一年实习经验，可随时到岗。</div>
        </div>
        <div class="card info-card">
          <div class="card-header"><i class="el-icon-document"></i> 基本信息</div>
          <div class="info-grid">
            <div class="info-item" v-for="item in basicInfo" :key="item.label">
              <div class="info-label">{{ item.label }}</div>
              <div class="info-value">{{ item.value }}</div>
            </div>
          </div>
        </div>
        <div class="card edu-card">
          <div class="card-header"><i class="el-icon-reading"></i> 教育经历</div>
          <div class="timeline">
            <div class="timeline-item">
              <div class="timeline-dot"></div>
              <div class="timeline-content">
                <div class="edu-title">郑州轻工业大学 · 网络工程专业</div>
                <div class="edu-date">2022.09 - 至今（大四）</div>
                <div class="edu-honor">🏆 荣誉：四级证书、金盾信安杯三等奖、校级奖学金、三好学生</div>
                <div class="edu-courses">📚 主修课程：Web设计技术与安全、数据库系统与安全、操作系统、计算机网络</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="right-area">
        <div class="card profile-card">
          <div class="avatar-wrap"><img src="/avatar.jpg" class="avatar" /></div>
          <div class="contact-info">
            <div class="contact-item"><i class="el-icon-phone"></i> 18737151171</div>
            <div class="contact-item"><i class="el-icon-message"></i> 2831639494@qq.com</div>
            <div class="contact-item"><i class="el-icon-location"></i> 郑州</div>
          </div>
          <div class="social-links">
            <a :href="portfolio.githubUrl" target="_blank" class="social-link">GitHub</a>
            <a :href="portfolio.resumeUrl" target="_blank" class="social-link">简历PDF</a>
          </div>
        </div>
        <div class="card keyword-card">
          <div class="card-header"><i class="el-icon-price-tag"></i> 关键词云</div>
          <div class="keyword-cloud">
            <span class="keyword" v-for="kw in personalKeywords" :key="kw">{{ kw }}</span>
          </div>
        </div>
      </div>

      <div class="bottom-area">
        <div class="card skills-card">
          <div class="card-header" @click="toggleSkills">
            <i class="el-icon-star-off"></i> 专业技能
            <i :class="skillsExpanded ? 'el-icon-arrow-up' : 'el-icon-arrow-down'" class="toggle-icon"></i>
          </div>
          <transition name="expand">
            <div class="skill-list" v-show="skillsExpanded">
              <div class="skill-item" v-for="(skill, idx) in skills" :key="idx">
                <i class="el-icon-check skill-icon"></i>
                <span class="skill-text">{{ skill }}</span>
              </div>
            </div>
          </transition>
        </div>
        <div class="card blog-card">
          <div class="card-header"><i class="el-icon-notebook-2"></i> 最新博客</div>
          <div class="blog-list">
            <blogSummary v-for="blog in blogList.slice(0, 3)" :key="blog.id" :blogInfo="blog" shadow="never" />
          </div>
        </div>
      </div>
    </div>

    <div class="card self-card full-width">
      <div class="card-header"><i class="el-icon-chat-line-square"></i> 自我评价</div>
      <div class="self-text">{{ selfEvaluation }}</div>
    </div>
  </div>
</template>

<script>
import blogSummary from '../components/blogSummary.vue'

export default {
  name: "home",
  components: { blogSummary },
  data() {
    return {
      skillsExpanded: true,
      blogQuery: { pageNum: 1, pageSize: 5, searchWords: '' },
      blogList: [],
      staticBlogList: [
        { id: 'article-1', title: 'JS 的一些常用底层原理', description: '...', createTime: '2026-02-22 17:13:30', articleUrl: '/articles/js-core-principles.html' },
        { id: 'article-2', title: 'Windows/Mac 下配置 Node.js 开发环境的完整指南', createTime: '2026-03-07 15:17:11', articleUrl: '/articles/node-env-setup.html' },
        { id: 'article-3', title: '常见 Git 命令及使用指南', createTime: '2026-03-12 20:09:34', articleUrl: '/articles/git-command-guide.html' },
        { id: 'article-4', title: 'JavaScript 常用工具函数库（防抖、深拷贝、日期格式化）', createTime: '2026-03-26 09:20:07', articleUrl: '/articles/js-utils-library.html' },
        { id: 'article-5', title: '8 个让写代码效率翻倍的 VS Code 插件', createTime: '2026-04-06 12:03:15', articleUrl: '/articles/vscode-plugins.html' },
        { id: 'article-6', title: 'HTML5 语义化与 SEO 最佳实践', description: '深入理解 HTML5 语义化标签，提升网页可访问性和搜索引擎排名。', createTime: '2026-04-10 10:00:00', views: 45, articleUrl: '/articles/html5-semantic.html' },
        { id: 'article-7', title: 'CSS Grid 布局完全指南', description: '从零掌握 CSS Grid 布局，轻松实现复杂响应式页面。', createTime: '2026-04-11 11:00:00', views: 52, articleUrl: '/articles/css-grid-guide.html' },
        { id: 'article-8', title: 'Vue 3 Composition API 实战与响应式原理', description: '详解 Vue 3 Composition API 用法及响应式系统原理，提升组件复用性。', createTime: '2026-04-12 09:30:00', views: 78, articleUrl: '/articles/vue3-composition-api.html' },
        { id: 'article-9', title: 'uni-app 跨端开发最佳实践', description: '从项目搭建到发布，掌握 uni-app 开发 Pad、H5、小程序的全流程技巧。', createTime: '2026-04-13 14:20:00', views: 63, articleUrl: '/articles/uni-app-best-practice.html' },
        { id: 'article-10', title: 'Webpack 5 性能优化：代码分割与懒加载', description: '深入 Webpack 5 配置，实现高效代码分割、懒加载及构建速度优化。', createTime: '2026-04-14 16:45:00', views: 71, articleUrl: '/articles/webpack-optimization.html' }
      ],
      basicInfo: [
        { label: '姓名', value: '郑瞄瞄' }, { label: '电话', value: '18737151171' },
        { label: '年龄', value: '22' }, { label: '性别', value: '女' },
        { label: '学历', value: '统招本科 | 全日制' }, { label: '邮箱', value: '2831639494@qq.com' },
        { label: '求职意向', value: '前端开发 | 随时到岗' }, { label: '实习经验', value: '1年' }
      ],
      skills: [
        '框架与跨端：Vue2/Vue3全家桶（响应式原理、组件通信、Composition API、Pinia）；uni-app跨端开发（条件编译、移动端适配、App原生能力集成）',
        '语言基础：JavaScript（原型链、闭包、事件循环、Promise/async-await）；TypeScript（接口定义、类型推断、泛型',
        '工程化：Webpack（代码分割/懒加载）；ESLint/Prettier代码规范；Git Flow工作流（分支管理、冲突解决、commit规范）；Vue CLI',
        '性能优化：虚拟滚动、图片懒加载、防抖节流、自适应布局（rpx/vw/vh',
        '复杂交互：HTML5拖拽API、树形表格、动态表单联动、文件预览（PDF/Office）、鼠标交互动效',
        'AI驱动开发：熟练使用GitHub Copilot、Cursor、Codex辅助代码生成与调试；结合ChatGPT/DeepSeek进行技术方案调研、问题排查与代码优化；具备AI辅助项目架构设计与开发全流程实践经验',
        '协作与工具：Axios封装（拦截器、Token注入）；Vercel部署；Less预处理器'
      ],
      personalKeywords: ['前端工程师', '一年实习经验', '企业级项目', 'Pad端开发', '后台管理系统', '流程管理系统', '跨端应用', '可视化图表'],
      selfEvaluation: '技术扎实、自学半年成功入行前端开发、具有实战项目开发经验\n学习能力强，喜欢学习新事物，团队荣誉感强，有明确的职业规划\n对工作充满热情，善于与团队沟通，吃苦耐劳，工作积极主动，适应能力强',
      portfolio: {
        githubUrl: 'https://github.com/7z705',
        resumeUrl: '/resume.pdf'
      }
    }
  },
  created() {
    this.getAllBlogs()
  },
  methods: {
    async getAllBlogs() {
      this.blogList = this.staticBlogList
    },
    handleSearch(searchInfo) {
      this.blogQuery.searchWords = searchInfo
      this.getAllBlogs()
    },
    toggleSkills() {
      this.skillsExpanded = !this.skillsExpanded
    }
  },
  mounted() {
    this.$bus.$on('search', this.handleSearch)
  },
  beforeDestroy() {
    this.$bus.$off('search')
  }
}
</script>

<style lang="less" scoped>
.home-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 24px 60px;
}

.hero-section {
  text-align: center;
  margin-bottom: 40px;  // 原48px，减小
  .hero-title {
    font-size: 44px;    // 原48px，稍小
    font-weight: 700;
    margin-bottom: 8px;
    color: var(--text-primary);
    .highlight {
      background: linear-gradient(135deg, var(--text-accent), #7E57FF);
      background-clip: text;
      -webkit-background-clip: text;
      color: transparent;
    }
  }
  .hero-sub {
    font-size: 18px;
    color: var(--text-secondary);
    margin-bottom: 12px;
  }
  .hero-badge {
    display: inline-block;
    padding: 4px 16px;
    background: var(--accent-light);
    border-radius: 60px;
    font-size: 13px;
    color: var(--text-accent);
  }
}

.grid-layout {
  display: grid;
  grid-template-columns: 1fr 300px; // 右侧宽度稍小
  gap: 20px;                       // 原28px，减小
}

.left-area {
  display: flex;
  flex-direction: column;
  gap: 20px;                       // 原28px
}

.right-area {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.bottom-area {
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;                       // 原28px
  margin-top: 20px;                // 原28px
}

.full-width {
  grid-column: 1 / -1;
  margin-top: 20px;                // 原28px
}

.card {
  background: var(--bg-card);
  backdrop-filter: blur(12px);
  border-radius: 28px;             // 原32px，稍小
  border: var(--card-border);
  box-shadow: var(--card-shadow);
  transition: var(--transition);
  overflow: hidden;
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 16px 28px -12px rgba(0,0,0,0.1);
  }
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px 6px 16px;     // 原 18px 20px 8px 20px，减小
  font-size: 16px;                 // 原18px
  font-weight: 600;
  color: var(--text-accent);
  i {
    font-size: 16px;               // 原18px
    margin-right: 6px;             // 原4px，稍大一点但仍紧凑
  }
  .toggle-icon {
    cursor: pointer;
    font-size: 14px;
    margin-left: 8px;
  }
}

.intro-text {
  padding: 0 16px 16px 16px;       // 原 0 20px 20px 20px
  line-height: 1.6;
  color: var(--text-primary);
  font-size: 14px;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;                       // 原12px
  padding: 0 16px 16px 16px;
}

.info-item {
  background: rgba(44, 154, 168, 0.06);
  border-radius: 16px;             // 原20px
  padding: 10px;                   // 原12px
  .info-label {
    font-size: 11px;               // 原12px
    color: var(--text-secondary);
  }
  .info-value {
    font-weight: 600;
    color: var(--text-primary);
    margin-top: 2px;
    font-size: 13px;
  }
}

.timeline {
  padding: 0 16px 16px 16px;
  .timeline-item {
    display: flex;
    gap: 12px;                     // 原16px
    .timeline-dot {
      width: 8px;                  // 原10px
      height: 8px;
      background: var(--text-accent);
      border-radius: 50%;
      margin-top: 5px;
      position: relative;
      &::after {
        content: '';
        position: absolute;
        top: 12px;
        left: 3px;
        width: 2px;
        height: calc(100% + 16px);
        background: var(--divider);
      }
    }
    .timeline-content {
      flex: 1;
      .edu-title {
        font-weight: 700;
        font-size: 16px;           // 原18px
        color: var(--text-primary);
      }
      .edu-date {
        font-size: 12px;
        color: var(--text-secondary);
        margin: 2px 0 8px;
      }
      .edu-honor, .edu-courses {
        font-size: 13px;
        color: var(--text-secondary);
        line-height: 1.4;
        margin-top: 4px;
      }
    }
  }
}

.profile-card {
  text-align: center;
  .avatar-wrap {
    margin: 16px auto 12px;        // 原20px auto 16px
    width: 88px;                   // 原100px
    height: 88px;
    border-radius: 50%;
    overflow: hidden;
    border: 2px solid var(--text-accent);
    .avatar {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  .contact-info {
    .contact-item {
      margin: 8px 0;               // 原12px
      color: var(--text-primary);
      font-size: 13px;
      i {
        margin-right: 6px;
        color: var(--text-accent);
        font-size: 14px;
      }
    }
  }
  .social-links {
    display: flex;
    justify-content: center;
    gap: 16px;                     // 原20px
    margin: 16px 0;                // 原20px
    .social-link {
      padding: 4px 12px;           // 原6px 16px
      background: var(--accent-light);
      border-radius: 40px;
      color: var(--text-accent);
      text-decoration: none;
      font-size: 13px;
      &:hover {
        background: var(--text-accent);
        color: white;
      }
    }
  }
}

.keyword-cloud {
  padding: 0 16px 16px 16px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;                       // 原10px
}
.keyword {
  padding: 4px 10px;              // 原6px 14px
  background: rgba(44, 154, 168, 0.08);
  border-radius: 32px;
  font-size: 12px;
  color: var(--text-primary);
  transition: 0.2s;
  &:hover {
    background: var(--accent-light);
    transform: translateY(-2px);
  }
}

.skill-list {
  padding: 0 16px 16px 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;                      // 原12px
}
.skill-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;                      // 原12px
  padding: 6px 0;                 // 原8px
  border-bottom: 1px solid var(--divider);
  &:last-child {
    border-bottom: none;
  }
  .skill-icon {
    background: var(--text-accent);
    border-radius: 50%;
    padding: 2px;
    color: white;
    font-size: 10px;
    margin-top: 2px;
  }
  .skill-text {
    flex: 1;
    font-size: 13px;              // 原14px
    line-height: 1.45;
    color: var(--text-primary);
  }
}

.expand-enter-active, .expand-leave-active {
  transition: all 0.25s ease;
  max-height: 500px;
  overflow: hidden;
}
.expand-enter, .expand-leave-to {
  max-height: 0;
  opacity: 0;
}

.blog-list {
  padding: 0 16px 16px 16px;
  display: flex;
  flex-direction: column;
  gap: 20px;                      // 原28px，减小
}

.self-text {
  padding: 0 16px 16px 16px;
  white-space: pre-line;
  line-height: 1.6;
  color: var(--text-primary);
  font-size: 14px;
}

@media (max-width: 900px) {
  .grid-layout {
    grid-template-columns: 1fr;
  }
  .bottom-area {
    grid-template-columns: 1fr;
  }
  .hero-title {
    font-size: 32px;
  }
}
</style>