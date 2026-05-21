<template>
  <div class="container">
    <!-- 顶部导航栏 -->
    <div class="header-nav" :class="navClass">
      <div class="nav-menu">
        <div
          v-for="item in navItems"
          :key="item.key"
          class="nav-item"
          :class="{ active: activeSection === item.key }"
          @click="item.type === 'scroll' ? scrollToSection(item.key) : $router.push(item.path)">
          <i :class="item.icon"></i>
          <span>{{ t(`nav.${item.key}`) }}</span>
        </div>
      </div>
      <div class="nav-right">
        <a class="nav-resume" :href="portfolio.resumeUrl" target="_blank">
          <i class="el-icon-document"></i> <span>{{ t('hero.resume') }}</span>
        </a>
        <a class="nav-github" :href="portfolio.githubUrl" target="_blank">
          <i class="el-icon-s-cooperation"></i> <span>GitHub</span>
        </a>
        <el-input
          v-model="searchKeyword"
          :placeholder="t('searchPlaceholder')"
          clearable
          size="small"
          class="search-input">
          <i slot="prefix" class="el-icon-search"></i>
        </el-input>
        <div class="lang-switch" @click="toggleLanguage">
          <span :class="{ active: locale === 'zh' }">中</span>
          <span class="separator">/</span>
          <span :class="{ active: locale === 'en' }">En</span>
        </div>
      </div>
    </div>

     <!-- Hero 区域 -->
    <section class="hero-section" ref="heroSection">
      <canvas class="hero-particles" ref="heroParticles"></canvas>
      <div class="hero-text-wrap">
        <span id="hero-title" class="hero-greeting">
          <span
            v-for="(ch, i) in greetingChars"
            :key="i"
            class="hero-char"
            :style="{ transform: `scale(${charScales[i]})` }"
          >{{ ch }}</span>
        </span>
      </div>
    </section>

    <!-- 技术栈互动标签云 -->
    <TagCloud :tags="heroTagList" @tag-click="goToArticlesByTag" />

    <!-- 关于区块（精确 Grid 布局） -->
    <section class="content-section" ref="aboutSection" id="about">
      <div class="section-container">
        <h2 class="section-title">{{ t('sections.about') }}</h2>
        <div class="about-precise-grid">
          <div class="first-row">
            <FlipCard class="card-item">
              <template #front>
                <div class="card-front">
                  <i class="el-icon-user"></i>
                  <h3>{{ t('aboutCards.personal.title') }}</h3>
                  <p>郑瞄瞄 · {{ t('aboutCards.personal.role') }}</p>
                  <p class="front-summary">{{ t('aboutCards.personal.summary') }}</p>
                </div>
              </template>
              <template #back>
                <div class="card-back">
                  <h4><i class="el-icon-user"></i> {{ t('aboutCards.personal.detailTitle') }}</h4>
                  <p>{{ t('aboutCards.personal.detail') }}</p>
                </div>
              </template>
            </FlipCard>

            <FlipCard class="card-item">
              <template #front>
                <div class="card-front">
                  <i class="el-icon-document"></i>
                  <h3>{{ t('aboutCards.basic.title') }}</h3>
                  <p>{{ basicInfoPreview }}</p>
                  <p class="front-summary">{{ t('aboutCards.basic.summary') }}</p>
                </div>
              </template>
              <template #back>
                <div class="card-back">
                  <h4>{{ t('aboutCards.basic.detailTitle') }}</h4>
                  <div class="info-grid info-grid-large">
                    <div class="info-item" v-for="item in currentBasicInfo" :key="item.label">
                      <span class="info-label">{{ item.label }}</span>
                      <span v-if="item.label === t('basicInfo.emailLabel') || item.label === 'Email'" class="info-value">
                        <a :href="'mailto:' + item.value" class="email-link" @click.stop>{{ item.value }}</a>
                      </span>
                      <span v-else class="info-value">{{ item.value }}</span>
                    </div>
                  </div>
                </div>
              </template>
            </FlipCard>

            <FlipCard class="card-item">
              <template #front>
                <div class="card-front">
                  <i class="el-icon-reading"></i>
                  <h3>{{ t('aboutCards.education.title') }}</h3>
                  <p>{{ t('aboutCards.education.school') }}</p>
                  <p class="front-summary">{{ t('aboutCards.education.summary') }}</p>
                </div>
              </template>
              <template #back>
                <div class="card-back">
                  <h4>{{ t('aboutCards.education.detailTitle') }}</h4>
                  <div class="edu-detail" v-html="currentEducationDetail"></div>
                </div>
              </template>
            </FlipCard>
          </div>

          <div class="second-row">
            <div class="left-cell">
              <FlipCard class="card-item">
                <template #front>
                  <div class="card-front">
                    <i class="el-icon-chat-line-square"></i>
                    <h3>{{ t('aboutCards.self.title') }}</h3>
                    <p>{{ t('aboutCards.self.subtitle') }}</p>
                    <p class="front-summary">{{ t('aboutCards.self.summary') }}</p>
                  </div>
                </template>
                <template #back>
                  <div class="card-back">
                    <h4>{{ t('aboutCards.self.detailTitle') }}</h4>
                    <div class="self-text">{{ currentSelfEvaluation }}</div>
                  </div>
                </template>
              </FlipCard>
            </div>
            <div class="right-cell">
              <FlipCard class="skill-card">
                <template #front>
                  <div class="card-front skill-front">
                    <i class="el-icon-star-off"></i>
                    <h3>{{ t('aboutCards.skills.title') }}</h3>
                    <div class="skill-summary">
                      <div class="summary-item" v-for="(item, idx) in currentSkillSummary" :key="idx">✓ {{ item }}</div>
                    </div>
                    <p class="front-hint">{{ t('aboutCards.skills.hint') }}</p>
                  </div>
                </template>
                <template #back>
                  <div class="card-back skill-back">
                    <h4>{{ t('aboutCards.skills.title') }}</h4>
                    <div class="skill-list-full">
                      <div class="skill-item-full" v-for="(skill, idx) in currentSkills" :key="idx">
                        <i class="el-icon-check"></i> {{ skill }}
                      </div>
                    </div>
                  </div>
                </template>
              </FlipCard>
            </div>
          </div>

          <div class="third-row">
            <div class="left-cell">
              <FlipCard class="card-item">
                <template #front>
                  <div class="card-front">
                    <i class="el-icon-price-tag"></i>
                    <h3>{{ t('aboutCards.keywords.title') }}</h3>
                    <div class="keyword-preview">
                      <span v-for="kw in currentPersonalKeywords.slice(0,4)" :key="kw">{{ kw }}</span>
                    </div>
                  </div>
                </template>
                <template #back>
                  <div class="card-back">
                    <h4>{{ t('aboutCards.keywords.detailTitle') }}</h4>
                    <div class="keyword-cloud">
                      <span class="keyword" v-for="kw in currentPersonalKeywords" :key="kw">{{ kw }}</span>
                    </div>
                  </div>
                </template>
              </FlipCard>
            </div>
          </div>
        </div>
        <!-- 获奖证书时间轴 -->
        <div class="awards-section">
          <h3 class="awards-title">
            <i class="el-icon-trophy"></i> 
            {{ locale === 'zh' ? '🏆 荣誉证书墙 🏆' : '🏆 Awards Wall 🏆' }}
          </h3>
          <div class="timeline">
            <div 
              v-for="(item, idx) in currentAwards" 
              :key="idx" 
              class="timeline-item"
              :class="{ 'timeline-visible': visibleItems[idx] }"
            >
              <div class="timeline-marker">
                <div class="timeline-dot">
                  <span class="dot-icon">{{ getAwardIcon(idx) }}</span>
                </div>
                <div class="timeline-line"></div>
              </div>
              <div class="timeline-date">{{ item.date }}</div>
              <div class="timeline-content">
                <div class="timeline-title">{{ item.title }}</div>
                <div class="timeline-desc">{{ item.description }}</div>
                <div class="timeline-issuer">
                  <i class="el-icon-school"></i> {{ item.issuer }}
                </div>
              </div>
            </div>
          </div>
          <!-- 已去掉底部提示 -->
        </div>
      </div>
    </section>

    <!-- 博客文章区块 -->
    <section class="content-section" ref="archivesSection" id="archives">
      <div class="section-container">
        <h2 class="section-title">{{ t('sections.blog') }}</h2>
        <div class="search-bar">
          <el-input v-model="searchKeyword" :placeholder="t('searchPlaceholder')" clearable prefix-icon="el-icon-search"></el-input>
        </div>
        <div v-if="filteredBlogs.length" class="blog-list">
          <div class="blog-item-wrapper" v-for="blog in filteredBlogs" :key="blog.id" :data-id="blog.id" @click="grayscaleBlog(blog.id)">
            <blogSummary :blogInfo="blog" shadow="never" />
          </div>
        </div>
        <el-empty v-else :description="t('emptyBlog')"></el-empty>
      </div>
    </section>

    <!-- 项目/实习经历区块 -->
    <section class="content-section" ref="categoriesSection" id="categories">
      <div class="section-container">
        <h2 class="section-title">{{ t('sections.experience') }}</h2>
        <div class="section">
          <div class="subsection-title"><i class="el-icon-suitcase"></i> {{ t('exp.internshipTitle') }}</div>
          <div class="experience-item" v-for="item in currentInternships" :key="item.title">
            <div class="item-head">
              <div class="item-title">{{ item.title }}</div>
              <div class="item-time">{{ item.time }}</div>
            </div>
            <div class="item-subtitle">{{ item.company }}</div>
            <div class="item-desc">{{ item.description }}</div>
          </div>
        </div>
        <div class="section">
          <div class="subsection-title"><i class="el-icon-folder-opened"></i> {{ t('exp.projectTitle') }}</div>
          <div class="experience-item" v-for="item in currentProjects" :key="item.title">
            <div class="item-head">
              <div class="item-title">{{ item.title }}</div>
              <div class="item-time">{{ item.time }}</div>
            </div>
            <div class="item-stack">{{ t('exp.techStack') }}：{{ item.stack }}</div>
            <div class="item-desc">{{ item.description }}</div>
            <div v-if="item.highlights && item.highlights.length" class="highlight-block">
              <div class="highlight-title"><i class="el-icon-star-on"></i> {{ t('exp.highlights') }}</div>
              <div class="highlight-tags">
                <span class="highlight-tag" v-for="highlight in item.highlights" :key="highlight">{{ highlight }}</span>
              </div>
            </div>
            <ul class="item-points">
              <li v-for="point in item.points" :key="point">{{ point }}</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- 访问统计区块 -->
    <section class="content-section" ref="statsSection" id="stats">
      <div class="section-container">
        <h2 class="section-title reveal-up">{{ t('sections.stats') }}</h2>
        <p class="section-sub reveal-up">{{ t('stats.subtitle') }}</p>

        <div class="overview-cards">
          <div class="stat-card reveal-up" v-for="(card, i) in overviewCards" :key="card.label" :style="{ transitionDelay: i * 0.1 + 's' }">
            <div class="card-icon">
              <i :class="card.icon"></i>
            </div>
            <div class="card-body">
              <div class="card-value"><AnimatedCount :target="card.value" :duration="1500" /></div>
              <div class="card-label">{{ card.label }}</div>
            </div>
          </div>
        </div>

        <div class="charts-grid">
          <div class="chart-box reveal-up">
            <h3><i class="el-icon-star-on"></i> {{ t('stats.topArticles') }}</h3>
            <StatsBar :items="topArticles" />
          </div>
          <div class="chart-box reveal-up" style="transition-delay: 0.15s">
            <h3><i class="el-icon-pie-chart"></i> {{ t('stats.categoryChart') }}</h3>
            <StatsCircle :segments="categorySegments" />
          </div>
        </div>

        <div class="chart-box reveal-up" style="margin-top: 24px">
          <h3><i class="el-icon-view"></i> {{ t('stats.pageViews') }}</h3>
          <StatsBar :items="pageViewItems" />
        </div>
      </div>
    </section>

    <!-- 在线演示区块 -->
    <section class="content-section" ref="playgroundSection" id="playground">
      <div class="section-container">
        <h2 class="section-title reveal-up">{{ t('sections.playground') }}</h2>
        <p class="section-sub reveal-up">
          <!-- 交互式 Demo，展示技术能力 -->
        </p>

        <div class="demo-tabs reveal-up">
          <span
            v-for="tab in playgroundTabs"
            :key="tab.key"
            class="demo-tab"
            :class="{ active: playgroundTab === tab.key }"
            @click="playgroundTab = tab.key"
          >
            <i :class="tab.icon"></i> {{ tab.label }}
          </span>
        </div>

        <div class="demo-content reveal-up" style="transition-delay: 0.1s">
          <keep-alive>
            <ParticlePlayground v-if="playgroundTab === 'particles'" />
            <DragDropDemo v-if="playgroundTab === 'dragdrop'" />
          </keep-alive>
        </div>
      </div>
    </section>

    <!-- 滚动进度条 -->
    <div class="scroll-progress" :style="{ width: scrollProgress + '%' }"></div>

    <!-- 侧边导航点 -->
    <div class="side-dots" v-show="scrollY > 300">
      <div
        v-for="dot in sideDots"
        :key="dot.key"
        class="side-dot"
        :class="{ active: activeSection === dot.key }"
        @click="scrollToSection(dot.key)"
        :title="t(`nav.${dot.key}`)"
      ></div>
    </div>

    <!-- 回到顶部 -->
    <div class="back-to-top" v-show="scrollY > 600" @click="scrollToTop">
      <i class="el-icon-top"></i>
    </div>

    <!-- 页脚 -->
    <footer class="site-footer">
      <div class="footer-inner">
        <div class="footer-links">
          <a href="https://github.com/7z705" target="_blank"><i class="el-icon-s-cooperation"></i> GitHub</a>
          <a href="mailto:2831639494@qq.com"><i class="el-icon-message"></i> 2831639494@qq.com</a>
          <a :href="portfolio.resumeUrl" target="_blank"><i class="el-icon-document"></i> 在线简历</a>
        </div>
        <div class="footer-copy">© 2026 ZZZ-zz · Built with Vue + Element UI</div>
      </div>
    </footer>
  </div>
</template>

<script>
import blogSummary from '../components/blogSummary.vue'
import FlipCard from '../components/FlipCard.vue'
import StatsBar from '../components/StatsBar.vue'
import StatsCircle from '../components/StatsCircle.vue'
import ParticlePlayground from '../components/ParticlePlayground.vue'
import DragDropDemo from '../components/DragDropDemo.vue'
import TagCloud from '../components/TagCloud.vue'

const AnimatedCount = {
  props: { target: Number, duration: { type: Number, default: 1500 } },
  data() { return { current: 0 } },
  mounted() { this.animate() },
  methods: {
    animate() {
      const start = performance.now()
      const step = (ts) => {
        const elapsed = ts - start
        const p = Math.min(elapsed / this.duration, 1)
        this.current = Math.round(p * this.target)
        if (p < 1) requestAnimationFrame(step)
      }
      requestAnimationFrame(step)
    }
  },
  render(h) { return h('span', this.current) }
}

function getStats() {
  try {
    const raw = localStorage.getItem('blog_stats')
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

export default {
  name: 'index',
  components: { blogSummary, FlipCard, StatsBar, StatsCircle, ParticlePlayground, DragDropDemo, AnimatedCount, TagCloud },
  mounted() {
    // 原有事件监听
    window.addEventListener('scroll', this.handleScroll);
    this.initCustomCursor();
    this.initHeroParticles();
    this.setSectionRefs();
    this.updateActiveSection();

    // 读取保存的语言设置（原有）
    const savedLocale = localStorage.getItem('locale');
    if (savedLocale && (savedLocale === 'zh' || savedLocale === 'en')) {
      this.locale = savedLocale;
    }

    // 获奖时间轴滚动动画 + 滚动揭示动画
    this.$nextTick(() => {
      this.initTimelineObserver();
      this.initRevealObserver();
    });
  },
  watch: {
    locale() {
      this.$nextTick(() => {
        this.visibleItems = new Array(this.currentAwards.length).fill(false);
        this.initTimelineObserver();
      });
    },
    '$route.path'(path) {
      const routeItem = this.navItems.find(item => item.type === 'route' && path.startsWith(item.path))
      if (routeItem) {
        this.activeSection = routeItem.key
      } else if (path === '/home' || path === '/') {
        this.updateActiveSection()
      }
    }
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll)
    this.destroyCustomCursor()
    this.destroyHeroParticles()
  },
  data() {
    return {
      visibleItems: [],  // 保留，但会在 mounted 中动态初始化长度
      navClass: 'header-nav-top',
      activeSection: 'about',
      locale: 'zh', // 当前语言 zh/en
      // 国际化文本库
      messages: {
        zh: {
          nav: { about: '关于', archives: '博客文章', categories: '项目/实习', stats: '访问统计', playground: '在线演示' },
          sections: { about: '关于我', blog: '博客文章', experience: '项目 / 实习经历', stats: '访问统计', playground: '在线演示' },
          stats: {
            subtitle: '博客浏览数据一览',
            topArticles: '热门文章 Top 5',
            categoryChart: '分类文章分布',
            pageViews: '页面访问分布',
            totalVisits: '总访问量',
            articleCount: '文章总数',
            catTagCount: '分类/标签',
            demoCount: '在线演示'
          },
          playground: {
            particles: '粒子系统',
            dragdrop: '拖拽看板'
          },
          searchPlaceholder: '搜索文章...',
          emptyBlog: '无匹配文章，试试换个关键词吧',
          hero: { greeting: 'HELLO，我是 ZZZ-zz', github: 'GitHub', resume: '查看简历' },
          aboutCards: {
            personal: { title: '个人介绍', role: '前端开发', summary: '一年实习经验，随时到岗', detailTitle: '详细', detail: '目前就读于郑州轻工业大学，全日制统招本科，今年6月份毕业，有英语四级证书，一年实习经验，可随时到岗。' },
            basic: { title: '基本信息', summary: '求职前端开发', detailTitle: '详细信息' },
            education: { title: '教育背景', school: '郑州轻工业大学', summary: '网络工程 · 2026届', detailTitle: '教育经历' },
            self: { title: '自我评价', subtitle: '技术扎实 · 热爱学习', summary: '团队荣誉感强', detailTitle: '自我评价详情' },
            skills: { title: '专业技能', hint: '鼠标悬停查看完整列表' },
            keywords: { title: '关键词云', detailTitle: '全部关键词' }
          },
          basicInfo: {
            nameLabel: '姓名', phoneLabel: '电话', ageLabel: '年龄', genderLabel: '性别',
            eduLabel: '学历', emailLabel: '邮箱', jobLabel: '求职意向', reportLabel: '到岗'
          },
          exp: {
            internshipTitle: '实习经历', projectTitle: '项目经历', techStack: '技术栈', highlights: '项目亮点'
          }
        },
        en: {
          nav: { about: 'About', archives: 'Blog', categories: 'Projects', stats: 'Stats', playground: 'Playground' },
          sections: { about: 'About Me', blog: 'Blog Posts', experience: 'Projects / Internships', stats: 'Site Stats', playground: 'Playground' },
          stats: {
            subtitle: 'Blog Statistics Overview',
            topArticles: 'Top 5 Articles',
            categoryChart: 'Category Distribution',
            pageViews: 'Page View Distribution',
            totalVisits: 'Total Visits',
            articleCount: 'Total Articles',
            catTagCount: 'Categories/Tags',
            demoCount: 'Demos'
          },
          playground: {
            particles: 'Particle System',
            dragdrop: 'Drag & Drop'
          },
          searchPlaceholder: 'Search articles...',
          emptyBlog: 'No matching articles, try different keywords',
          hero: { greeting: 'HELLO, I am ZZZ-zz', github: 'GitHub', resume: 'View Resume' },
          aboutCards: {
            personal: { title: 'Introduction', role: 'Frontend Dev', summary: '1 year internship, immediate start', detailTitle: 'Details', detail: 'Currently studying at Zhengzhou University of Light Industry, full-time undergraduate, graduating in June. CET-4 certified, 1 year internship experience, available immediately.' },
            basic: { title: 'Basic Info', summary: 'Looking for Frontend Dev', detailTitle: 'Details' },
            education: { title: 'Education', school: 'Zhengzhou University of Light Industry', summary: 'Network Eng · Class of 2026', detailTitle: 'Education' },
            self: { title: 'Self Evaluation', subtitle: 'Solid Skills · Love Learning', summary: 'Strong Team Spirit', detailTitle: 'Self Evaluation' },
            skills: { title: 'Technical Skills', hint: 'Hover for full list' },
            keywords: { title: 'Keywords', detailTitle: 'All Keywords' }
          },
          basicInfo: {
            nameLabel: 'Name', phoneLabel: 'Phone', ageLabel: 'Age', genderLabel: 'Gender',
            eduLabel: 'Education', emailLabel: 'Email', jobLabel: 'Job Target', reportLabel: 'Availability'
          },
          exp: {
            internshipTitle: 'Internships', projectTitle: 'Projects', techStack: 'Tech Stack', highlights: 'Highlights'
          }
        }
      },
      // 原始数据（中英文版本）
      basicInfoZh: [
        { label: '姓名', value: '郑瞄瞄' }, { label: '电话', value: '18737151171' },
        { label: '年龄', value: '22' }, { label: '性别', value: '女' },
        { label: '学历', value: '统招本科|全日制' }, { label: '邮箱', value: '2831639494@qq.com' },
        { label: '求职意向', value: '前端开发' }, { label: '到岗', value: '随时' }
      ],
      basicInfoEn: [
        { label: 'Name', value: 'Zheng Miaomiao' }, { label: 'Phone', value: '+86 18737151171' },
        { label: 'Age', value: '22' }, { label: 'Gender', value: 'Female' },
        { label: 'Education', value: 'Full-time Bachelor' }, { label: 'Email', value: '2831639494@qq.com' },
        { label: 'Job Target', value: 'Frontend Dev' }, { label: 'Availability', value: 'Immediate' }
      ],
      skillsZh: [
        '框架与跨端：Vue2/Vue3全家桶（响应式原理、组件通信、Composition API、Pinia）；uni-app跨端开发（条件编译、移动端适配、App原生能力集成）',
        '语言基础：JavaScript（原型链、闭包、事件循环、Promise/async-await）；TypeScript（接口定义、类型推断、泛型）',
        '工程化：Webpack（代码分割/懒加载）；ESLint/Prettier代码规范；Git Flow工作流（分支管理、冲突解决、commit规范）；Vue CLI',
        '性能优化：虚拟滚动、图片懒加载、防抖节流、自适应布局（rpx/vw/vh）',
        '复杂交互：HTML5拖拽API、树形表格、动态表单联动、文件预览（PDF/Office）、鼠标交互动效',
        'AI驱动开发：熟练使用GitHub Copilot、Cursor、Codex辅助代码生成与调试；结合ChatGPT/DeepSeek进行技术方案调研、问题排查与代码优化；具备AI辅助项目架构设计与开发全流程实践经验',
        '协作与工具：Axios封装（拦截器、Token注入）；Vercel部署；Less预处理器'
      ],
      skillsEn: [
        'Frameworks & Cross-platform: Vue2/Vue3 ecosystem (Reactivity, Component comm, Composition API, Pinia); uni-app (Conditional compilation, mobile adaptation, native integration)',
        'Language Basics: JavaScript (Prototype chain, closures, event loop, Promise/async-await); TypeScript (Interfaces, type inference, generics)',
        'Engineering: Webpack (Code splitting/lazy loading); ESLint/Prettier; Git Flow (Branch mgmt, conflict solving, commit conventions); Vue CLI',
        'Performance: Virtual scroll, lazy loading images, debounce/throttle, adaptive layout (rpx/vw/vh)',
        'Complex Interactions: HTML5 Drag & Drop API, tree tables, dynamic forms, file preview (PDF/Office), mouse interactions',
        'AI-driven Development: Proficient with GitHub Copilot, Cursor, Codex for code generation/debugging; Using ChatGPT/DeepSeek for tech research, troubleshooting and optimization; Full-cycle AI-assisted architecture design',
        'Collaboration & Tools: Axios wrapper (Interceptors, token injection); Vercel deployment; Less preprocessor'
      ],
      personalKeywordsZh: ['前端工程师', '一年实习经验', '企业级项目', 'Pad端开发', '后台管理系统', '流程管理系统', '跨端应用', '可视化图表'],
      personalKeywordsEn: ['Frontend Engineer', '1-year Internship', 'Enterprise Projects', 'Pad Development', 'Admin Systems', 'Workflow Systems', 'Cross-platform Apps', 'Data Visualization'],
      selfEvaluationZh: '技术扎实、自学半年成功入行前端开发、具有实战项目开发经验\n学习能力强，喜欢学习新事物，团队荣誉感强，有明确的职业规划\n对工作充满热情，善于与团队沟通，吃苦耐劳，工作积极主动，适应能力强',
      selfEvaluationEn: 'Solid technical skills, successfully transitioned to frontend development through self-study for half a year, with practical project experience.\nStrong learning ability, enjoy exploring new technologies, strong sense of team honor, clear career plan.\nPassionate about work, good team communication, hardworking, proactive, highly adaptable.',
      internshipsZh: [
        {
          title: '北京北大软件工程股份有限公司',
          time: '2025.03-2026.03',
          company: '国企人力资源研发部--第二研发中心',
          description: '主要公司h5系统日常维护和需求开发，同时深度参与了两个uni-app系统从0到1的前端任务开发'
        }
      ],
      internshipsEn: [
        {
          title: 'Beijing Beida Software Engineering Co., Ltd.',
          time: '2025.03-2026.03',
          company: 'State-owned Enterprise HR R&D Dept - Second R&D Center',
          description: 'Mainly responsible for daily maintenance and feature development of company H5 systems, and deeply participated in frontend development of two uni-app systems from 0 to 1.'
        }
      ],
      awardIcons: ['🏆', '🎖️', '📜', '⭐', '🏅'], // 循环使用
      // 获奖证书（中文） - 按时间升序
      awardsZh: [
        {
          date: '2023.11',
          title: '第五届金盾信安杯网络安全大赛',
          description: '团队三等奖',
          issuer: '河南省计算机学会'
        },
        {
          date: '2023.12',
          title: '优秀学生综合奖学金',
          description: '校级',
          issuer: '郑州轻工业大学'
        },
        {
          date: '2023.12',
          title: '“三好学生”荣誉称号',
          description: '',
          issuer: '郑州轻工业大学'
        },
        {
          date: '2023.12',
          title: '英语四级证书（CET-4）',
          // description: '成绩 559 分',
          issuer: '全国大学英语四六级考试委员会'
        },
        {
          date: '2024.12',
          title: '第六届金盾信安杯网络安全大赛',
          description: '团队三等奖',
          issuer: '河南省计算机学会'
        },
        {
          date: '2024.12',
          title: '学科优秀单项奖学金',
          description: '',
          issuer: '郑州轻工业大学'
        }
      ],

      // 获奖证书（英文）
      awardsEn: [
        {
          date: 'Nov 2023',
          title: 'The 5th Jindun Xin\'an Cup Cybersecurity Competition',
          description: 'Third Prize (Team)',
          issuer: 'Henan Computer Society'
        },
        {
          date: 'Dec 2023',
          title: 'Comprehensive Scholarship for Outstanding Students',
          description: 'University Level',
          issuer: 'ZZULI'
        },
        {
          date: 'Dec 2023',
          title: '"Merit Student" Honorary Title',
          description: '',
          issuer: 'ZZULI'
        },
        {
          date: 'Dec 2023',
          title: 'CET-4 Certificate',
          description: 'Score 559',
          issuer: 'CET National Committee'
        },
        {
          date: 'Dec 2024',
          title: 'The 6th Jindun Xin\'an Cup Cybersecurity Competition',
          description: 'Third Prize (Team)',
          issuer: 'Henan Computer Society'
        },
        {
          date: 'Dec 2024',
          title: 'Discipline Excellence Single Scholarship',
          description: '',
          issuer: 'ZZULI'
        }
      ],
      projectsZh: [
        {
          title: '项目一：中海油领导端 Pad 系统',
          time: '2025.03-2026.03',
          stack: 'uni-app、Vue.js、scroll-view、ECharts、lodash、Promise.all',
          description: '面向领导层使用的 Pad 端干部管理与审查系统，提供材料审核、关注管理、干部画像、任免跟踪、反查追溯等功能，支持多维度干部信息展示与操作，提升领导决策效率。',
          highlights: ['Pad 端系统', '复杂业务联调', '多模块协同开发'],
          points: [
            '开发材料审核页面，实现文件树、面包屑导航与 PDF / Office 预览切换，支持自适应布局。',
            '实现我的关注模块，支持关注、取消关注、批量操作与分页加载，提升文件管理效率。',
            '开发设置页面，实现滚动分页、选中状态管理与简介展开/收起功能。',
            '为查询结果增加干部、家庭、履历三种检索方式，支持并行统计与动态表格刷新。',
            '重构干部画像模块布局，实现一屏展示与性能优化，并开发兼职信息与分工信息页面。',
            '实现预警信息反查、班子配备、任免跟踪与优干信息等模块，完成多页面联调与数据动态渲染。'
          ]
        },
        {
          title: '项目二：中海油干部考察系统（Pad/PC端）',
          time: '2025.03-2026.03',
          stack: 'uni-app、Vue.js、JavaScript、HTML5/CSS3、ECharts、lodash、Vuex',
          description: '面向央企干部考察工作的移动端与PC端综合管理平台，支持考察任务管理、干部名册联动、谈话记录、人员状态筛选、锁定控制、多端适配等功能，提升干部考察工作的信息化与规范化水平',
          highlights: [
            '多文件预览与统一入口渲染', '岗位联动与表格动态刷新', '二维码与邮件功能集成',
            'Pad / H5 双端退出逻辑适配', '锁定 / 解锁状态统一管理', '分页个性化设置与刷新联动'
          ],
          points: [
            '实现考察附件动态预览功能，根据文件数量自动切换单文件直接预览与多文件弹窗列表预览模式',
            '开发干部人员名册模块，实现岗位与干部简历的动态联动展示，支持表格列自定义与长文本省略悬停显示',
            '完成谈话记录页面二维码与海邮邮箱功能，对接后端接口实现数据交互与邮件发送',
            '实现Pad端全局适配与退出应用功能，支持横竖屏自适应与多平台退出逻辑',
            '优化登录流程，实现后端加密账密的解密校验与再加密提交，提升安全性',
            '开发谈话状态筛选与表格联动功能，支持按状态排序与人员标签渲染',
            '实现页面右滑手势拦截与锁定/解锁功能，保障操作安全与数据一致性',
            '优化分页组件，支持每页条数切换与页码快速跳转，提升数据查阅效率'
          ]
        },
        {
          title: '项目三：干部任免与假勤管理系统（多项目整合）',
          time: '2025.03-2026.03',
          stack: 'Vue.js、JavaScript、HTML5/CSS3、HTML5拖拽API',
          description: '面向企业干部任免全流程与员工假勤管理的综合系统，涵盖模拟任免、竞聘管理、考察录入、任职回写、流程集成等模块，支持多场景下的权限控制与数据联动，提升组织人事管理效率',
          highlights: [
            '拖拽调配与编制数据实时联动', '树形表格动态加载与行合并', '考察表单与表格联动计算',
            '页面编辑权限动态控制', '模块互斥编辑与状态隔离', 'OA 流程打通与数据同步'
          ],
          points: [
            '在江淮汽车模拟任免模块中，实现实有数、核定数、超缺编数动态展示，并在人员拖拽调整后实时联动更新编制数据。',
            '开发添加酝酿单位弹窗，支持类型筛选、名称搜索、树形表格多选与临时机构新增，适配复杂组织结构场景。',
            '基于 HTML5 拖拽 API 实现跨区域人员调动，结合响应式数据完成复杂交互与状态同步。',
            '在江淮汽车干部任免模块中，完成竞聘结果上传、考察情况录入、任职回写等页面开发，实现文件上传回显、表单与表格联动、测评得分自动计算与批量提交。',
            '通过接口获取职务详情与职级树，实现管理层次与职级联动过滤，提升任职回写数据准确性。',
            '在央视干部任免模块中，实现从人员详情页与流程任务进入页面时的状态区分，支持只读与可编辑模式切换。',
            '通过前置标记与任务状态判断实现页面编辑权限的动态控制，保障流程规范与数据安全。',
            '在中国核电工程干部任免模块中，实现互斥编辑、锁定切换、数据清空、组件禁用与解锁操作，完成模块间数据隔离。',
            '在北京保障房个人假勤模块中，完成请休假、转正、离职、调配等流程与 OA 平台的联通，实现多流程数据同步与状态流转。'
          ]
        },
        {
          title: '项目四：个人技术博客系统（AI驱动开发实践）',
          time: '2025.09-至今',
          stack: 'Vue2 + Vue Router + Element UI + Axios + Less（Vue CLI构建）| Vercel部署',
          description: '个人技术博客与作品集展示系统，用于更直观、有趣地展示个人技术能力与成长轨迹。采用AI辅助开发模式（Vibe Coding），探索新一代前端开发范式。',
          highlights: ['AI助手接入', '日/夜间模式切换', '个人信息卡片翻转查看'],
          points: [
            '日间/夜间模式：通过全局主题切换 + CSS 变量动态绑定，结合本地存储持久化用户偏好，提升阅读体验。',
            '文章搜索：实现关键词模糊匹配与实时过滤搜索结果，帮助用户快速定位技术内容。',
            '交互动效：设计欢迎语随鼠标移动、背景动态变化、卡片悬停翻转等交互动效，增强用户体验与视觉吸引力。',
            '关键词云：将技术栈标签可视化展示为关键词云，支持点击标签跳转相关文章，实现技术栈与内容联动。',
            '简历PDF预览：提供在线查看PDF版简历功能，新窗口打开，方便招聘方直接查阅。',
            '邮箱快捷联系：点击邮箱自动唤起邮件客户端（mailto协议），有效降低沟通成本。',
            'AI辅助架构设计：使用ChatGPT/DeepSeek分析竞品博客项目，拆解为可执行的开发阶段（初始化→组件开发→功能集成→部署上线）',
            'Codex流式开发：将项目需求拆分为多个.md模块文件，利用Codex流式输出实现快速迭代与测试',
            '多模型协同：结合Copilot辅助编码、DeepSeek处理个性化定制需求，形成AI辅助开发工作流',
            '项目成果：完整交付个人博客系统并部署至Vercel，作为个人技术名片与AI开发能力证明'
          ]
        }
      ],
      projectsEn: [
        {
          title: 'Project 1: CNOOC Leadership Pad System',
          time: '2025.03-2026.03',
          stack: 'uni-app, Vue.js, scroll-view, ECharts, lodash, Promise.all',
          description: 'Pad-based cadre management and review system for leadership, providing material review, follow management, cadre profiling, appointment tracking, and reverse tracing, enhancing decision-making efficiency.',
          highlights: ['Pad System', 'Complex Business Integration', 'Multi-module Collaboration'],
          points: [
            'Developed material review page with file tree, breadcrumb navigation, and PDF/Office preview switching, supporting adaptive layout.',
            'Implemented Follow module supporting follow/unfollow, batch operations, and pagination, improving file management efficiency.',
            'Developed settings page with scroll pagination, selection state management, and expand/collapse functionality.',
            'Added three search types for query results: cadre, family, and resume, supporting parallel statistics and dynamic table refresh.',
            'Refactored cadre profiling module layout for one-screen display and performance optimization, and developed兼职 information page and分工 information page.',
            'Implemented预警 reverse check, team allocation, appointment tracking, and excellent cadre information modules, completing multi-page integration and dynamic data rendering.'
          ]
        },
        {
          title: 'Project 2: CNOOC Cadre Assessment System (Pad/PC)',
          time: '2025.03-2026.03',
          stack: 'uni-app, Vue.js, JavaScript, HTML5/CSS3, ECharts, lodash, Vuex',
          description: 'Mobile and PC integrated management platform for cadre assessment in SOEs, supporting task management, cadre roster linkage, interview records, status filtering, lock control, and multi-platform adaptation.',
          highlights: ['Multi-file preview', 'Position & table dynamic refresh', 'QR & email integration', 'Pad/H5 exit logic', 'Lock/unlock state management', 'Pagination settings'],
          points: [
            'Dynamic preview of assessment attachments: auto-switch between single file preview and multi-file popup list based on file count.',
            'Developed cadre roster module with dynamic linkage between positions and resumes, supporting custom table columns and truncated text tooltips.',
            'Implemented QR code and Haiyou email functionality for interview records, integrating backend APIs for data interaction and email sending.',
            'Implemented Pad global adaptation and exit functionality, supporting landscape/portrait adaptive and multi-platform exit logic.',
            'Optimized login flow: decryption verification and re-encryption submission of backend encrypted credentials, enhancing security.',
            'Developed interview status filter and table linkage, supporting sorting by status and rendering of personnel tags.',
            'Implemented right-swipe gesture interception and lock/unlock functionality to ensure operational security and data consistency.',
            'Optimized pagination component, supporting items per page switching and quick page jump, improving data browsing efficiency.'
          ]
        },
        {
          title: 'Project 3: Cadre Appointment & Attendance Management System',
          time: '2025.03-2026.03',
          stack: 'Vue.js, JavaScript, HTML5/CSS3, HTML5 Drag & Drop API',
          description: 'Comprehensive system covering end-to-end cadre appointment and employee attendance management, including模拟 appointment, competition management, assessment entry, appointment write-back, and process integration.',
          highlights: ['Drag & drop with real-time data sync', 'Dynamic tree table with row merge', 'Form-table联动 calculation', 'Dynamic edit permission control', 'Exclusive edit with state isolation', 'OA process integration'],
          points: [
            'In JAC simulation module, dynamically display actual, approved, and vacancy numbers, updating编制 data in real-time after personnel drag-and-drop.',
            'Developed modal for adding酝酿 units, supporting type filtering, name search, tree table multi-select, and temporary机构 addition, adapting to complex org structures.',
            'Cross-region personnel transfer using HTML5 Drag & Drop API, achieving complex interactions and state sync with reactive data.',
            'In JAC cadre appointment module, developed pages for competition result upload, assessment entry, and appointment write-back, with file upload preview, form-table联动, automatic score calculation, and batch submission.',
            'Fetched position details and rank tree via API to实现 management level and rank联动 filtering, improving appointment write-back data accuracy.',
            'In CCTV cadre appointment module, distinguished states when entering from personnel details vs process tasks, supporting read-only and editable mode switching.',
            'Dynamic control of page edit permissions based on前置 flags and task status to ensure process compliance and data security.',
            'In CNPE cadre appointment module, implemented exclusive editing, lock switching, data clearing, component disabling, and unlock operations for module-level data isolation.',
            'In Beijing affordable housing attendance module, connected leave, regularization, resignation, and调配 processes with OA platform for multi-process data sync and status transition.'
          ]
        },
        {
          title: 'Project 4: Personal Tech Blog System (AI-driven Development)',
          time: '2025.09-Present',
          stack: 'Vue2 + Vue Router + Element UI + Axios + Less (Vue CLI) | Vercel Deploy',
          description: 'Personal tech blog and portfolio system to showcase technical abilities and growth trajectory intuitively and engagingly, using AI-assisted development (Vibe Coding) to explore next-gen frontend paradigms.',
          highlights: ['AI Assistant Integration', 'Dark/Light Mode Toggle', 'Flip Cards for Personal Info'],
          points: [
            'Dark/Light Mode: global theme switching with CSS variables, persisted user preference via localStorage.',
            'Article Search: keyword fuzzy matching and real-time filtering for quick content discovery.',
            'Interactive Effects: dynamic greeting with mouse movement, animated background, card hover flip effects.',
            'Keyword Cloud: visual display of tech stack tags, click to filter related articles, enabling content linkage.',
            'Resume PDF Preview: inline PDF viewing in new tab for easy access by recruiters.',
            'Email Quick Contact: mailto protocol integration to reduce communication friction.',
            'AI-assisted architecture design: used ChatGPT/DeepSeek to analyze competitor blog projects, breaking down into executable stages (init → components → integration → deploy).',
            'Codex streaming development: split requirements into .md module files, using Codex streaming for rapid iteration and testing.',
            'Multi-model collaboration: combined Copilot for coding, DeepSeek for customization, forming an AI-assisted development workflow.',
            'Project outcome: fully delivered personal blog system deployed to Vercel as a personal tech portfolio and proof of AI development capability.'
          ]
        }
      ],
      // 博客文章中英文版本
      blogListZh: [
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
      blogListEn: [
        { id: 'article-1', title: 'Core JavaScript Principles Under the Hood', description: 'From prototype chain, scope chain, closures, this binding to event loop...', createTime: '2026-02-22 17:13:30', views: 128, articleUrl: '/articles/js-core-principles.html' },
        { id: 'article-2', title: 'Complete Guide to Setting Up Node.js Dev Environment on Windows/Mac', description: 'From installing Node.js, configuring npm mirror...', createTime: '2026-03-07 15:17:11', views: 96, articleUrl: '/articles/node-env-setup.html' },
        { id: 'article-3', title: 'Common Git Commands and Usage Guide', description: 'Organizing the most frequently used Git commands in daily development...', createTime: '2026-03-12 20:09:34', views: 84, articleUrl: '/articles/git-command-guide.html' },
        { id: 'article-4', title: 'JavaScript Utility Function Library (Debounce, Deep Clone, Date Format)', description: 'Handwriting common utility functions in pure JavaScript...', createTime: '2026-03-26 09:20:07', views: 73, articleUrl: '/articles/js-utils-library.html' },
        { id: 'article-5', title: '8 VS Code Extensions That Double Coding Efficiency', description: 'Recommending my most frequently used VS Code extensions in frontend development...', createTime: '2026-04-06 12:03:15', views: 66, articleUrl: '/articles/vscode-plugins.html' },
        { id: 'article-6', title: 'HTML5 Semantics and SEO Best Practices', description: 'Deep dive into HTML5 semantic tags, improving accessibility and search engine ranking.', createTime: '2026-04-10 10:00:00', views: 45, articleUrl: '/articles/html5-semantic.html' },
        { id: 'article-7', title: 'Complete Guide to CSS Grid Layout', description: 'Master CSS Grid from scratch to easily implement complex responsive layouts.', createTime: '2026-04-11 11:00:00', views: 52, articleUrl: '/articles/css-grid-guide.html' },
        { id: 'article-8', title: 'Vue 3 Composition API in Action and Reactivity Internals', description: 'Detailed explanation of Vue 3 Composition API usage and reactivity system principles, improving component reusability.', createTime: '2026-04-12 09:30:00', views: 78, articleUrl: '/articles/vue3-composition-api.html' },
        { id: 'article-9', title: 'Best Practices for uni-app Cross-platform Development', description: 'From project setup to deployment, mastering the full process of developing Pad, H5, and mini-programs with uni-app.', createTime: '2026-04-13 14:20:00', views: 63, articleUrl: '/articles/uni-app-best-practice.html' },
        { id: 'article-10', title: 'Webpack 5 Performance Optimization: Code Splitting and Lazy Loading', description: 'Deep dive into Webpack 5 configuration for efficient code splitting, lazy loading, and build speed optimization.', createTime: '2026-04-14 16:45:00', views: 71, articleUrl: '/articles/webpack-optimization.html' }
      ],
      portfolio: {
        githubUrl: 'https://github.com/7z705',
        resumeUrl: '/resume.pdf',
      },
      searchKeyword: '',
      heroTagList: ['HTML', 'CSS', 'JavaScript', 'Vue 2/3', 'Node.js', 'Git', 'uni-app', 'webpack'],
      scrollProgress: 0,
      scrollY: 0,
      playgroundTab: 'particles',
    }
  },
  computed: {
    currentAwards() {
      return this.locale === 'zh' ? this.awardsZh : this.awardsEn
    },
    navItems() {
      return [
        { key: 'about', icon: 'el-icon-s-home', type: 'scroll' },
        { key: 'archives', icon: 'el-icon-folder-opened', type: 'scroll' },
        { key: 'categories', icon: 'el-icon-paperclip', type: 'scroll' },
        { key: 'stats', icon: 'el-icon-s-data', type: 'scroll' },
        { key: 'playground', icon: 'el-icon-video-play', type: 'scroll' },
      ]
    },
    playgroundTabs() {
      return [
        { key: 'particles', label: this.t('playground.particles'), icon: 'el-icon-s-marketing' },
        { key: 'dragdrop', label: this.t('playground.dragdrop'), icon: 'el-icon-s-operation' }
      ]
    },
    sideDots() {
      return this.navItems
    },
    revealGreeting() {
      return this.locale === 'zh' ? 'HELLO，我是 郑瞄瞄' : 'HELLO, I am Zheng Miaomiao'
    },
    greetingChars() {
      return (this.t('hero.greeting') || '').split('')
    },
    charScales() {
      const chars = this.greetingChars
      const n = chars.length
      if (n <= 1) return [1]
      const center = (n - 1) / 2
      const maxDist = center
      return chars.map((_, i) => {
        const dist = Math.abs(i - center) / maxDist
        return 0.8 + 0.4 * dist * dist
      })
    },
    // 国际化方法
    t() {
      return (key) => {
        const keys = key.split('.')
        let val = this.messages[this.locale]
        for (const k of keys) {
          if (val && val[k] !== undefined) val = val[k]
          else return key
        }
        return val
      }
    },
    // 动态数据
    currentBasicInfo() {
      return this.locale === 'zh' ? this.basicInfoZh : this.basicInfoEn
    },
    basicInfoPreview() {
      if (this.locale === 'zh') return '郑瞄瞄 · 22岁 · 女'
      return 'Zheng Miaomiao · 22 · Female'
    },
    currentEducationDetail() {
      if (this.locale === 'zh') {
        return `
          <div class="edu-title">郑州轻工业大学 · 网络工程专业</div>
          <div class="edu-date">2022.09 - 至今（大四）</div>
          <div class="edu-honor">🏆 荣誉：英语四级证书、金盾信安杯三等奖、校级奖学金、三好学生</div>
          <div class="edu-courses">📚 主修课程：Web设计技术与安全、数据库系统与安全、操作系统、计算机网络</div>
        `
      } else {
        return `
          <div class="edu-title">Zhengzhou University of Light Industry · Network Engineering</div>
          <div class="edu-date">2022.09 - Present (Senior)</div>
          <div class="edu-honor">🏆 Honors: CET-4, Jindun Xin'an Cup Third Prize, University Scholarship, Merit Student</div>
          <div class="edu-courses">📚 Core Courses: Web Design Tech & Security, Database Systems & Security, Operating Systems, Computer Networks</div>
        `
      }
    },
    currentSelfEvaluation() {
      return this.locale === 'zh' ? this.selfEvaluationZh : this.selfEvaluationEn
    },
    currentSkills() {
      return this.locale === 'zh' ? this.skillsZh : this.skillsEn
    },
    currentSkillSummary() {
      const skills = this.currentSkills
      return skills.slice(0, 6).map(s => s.split('：')[0] || s.substring(0, 20))
    },
    currentPersonalKeywords() {
      return this.locale === 'zh' ? this.personalKeywordsZh : this.personalKeywordsEn
    },
    currentInternships() {
      return this.locale === 'zh' ? this.internshipsZh : this.internshipsEn
    },
    currentProjects() {
      return this.locale === 'zh' ? this.projectsZh : this.projectsEn
    },
    blogList() {
      return this.locale === 'zh' ? this.blogListZh : this.blogListEn
    },
    filteredBlogs() {
      const kw = this.searchKeyword.trim().toLowerCase()
      if (!kw) return this.blogList
      return this.blogList.filter(b =>
        b.title.toLowerCase().includes(kw) ||
        b.description.toLowerCase().includes(kw)
      )
    },
    statItems() {
      const local = getStats()
      const articleViews = local ? local.articleViews || {} : {}
      return Object.entries(articleViews).map(([id, count]) => ({
        label: id.replace(/^article-/, '文章 '), value: count
      })).sort((a, b) => b.value - a.value).slice(0, 5)
    },
    overviewCards() {
      const local = getStats()
      const total = local ? local.totalVisits || 0 : 0
      const articleCount = Object.keys(local ? local.articleViews || {} : {}).length || this.blogList.length
      return [
        { label: this.t('stats.totalVisits'), value: total || 168, icon: 'el-icon-view' },
        { label: this.t('stats.articleCount'), value: articleCount || 10, icon: 'el-icon-document' },
        { label: this.t('stats.catTagCount'), value: 12, icon: 'el-icon-collection-tag' },
        { label: this.t('stats.demoCount'), value: 2, icon: 'el-icon-s-data' }
      ]
    },
    topArticles() {
      const items = this.statItems
      return items.length ? items : this.blogList.slice(0, 5).map(b => ({
        label: b.title.length > 12 ? b.title.slice(0, 12) + '...' : b.title,
        value: b.views || Math.floor(Math.random() * 50 + 30)
      }))
    },
    categorySegments() {
      return [
        { label: 'JavaScript', value: 4 },
        { label: '工程化', value: 3 },
        { label: 'CSS', value: 1 },
        { label: '开发工具', value: 2 }
      ]
    },
    pageViewItems() {
      const local = getStats()
      const views = local ? local.pageViews || {} : {}
      const entries = Object.entries(views).map(([path, count]) => {
        const isEn = this.locale === 'en'
        const nameMap = isEn
          ? { '/home': 'Home', '/archives': 'Archives', '/about': 'About', '/categories': 'Projects', '/stats': 'Stats', '/playground': 'Playground' }
          : { '/home': '首页', '/archives': '归档', '/about': '关于', '/categories': '项目经历', '/stats': '统计', '/playground': '演示' }
        return { label: nameMap[path] || path, value: count }
      }).sort((a, b) => b.value - a.value)
      if (entries.length) return entries
      return this.locale === 'en'
        ? [{ label: 'Home', value: 168 }, { label: 'Archives', value: 72 }, { label: 'About', value: 45 }, { label: 'Projects', value: 38 }]
        : [{ label: '首页', value: 168 }, { label: '归档', value: 72 }, { label: '关于', value: 45 }, { label: '项目经历', value: 38 }]
    }
  },
  methods: {
    // 获取卡片图标（根据索引循环）
    getAwardIcon(idx) {
      const icons = ['🏆', '🎖️', '📜', '⭐', '🏅', '✨'];
      return icons[idx % icons.length];
    },
    initRevealObserver() {
      const els = document.querySelectorAll('.reveal-up')
      if (!els.length) return
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed')
            observer.unobserve(entry.target)
          }
        })
      }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' })
      els.forEach(el => observer.observe(el))
    },
    initTimelineObserver() {
      const items = document.querySelectorAll('.timeline-item');
      if (!items.length) return;

      this.visibleItems = new Array(items.length).fill(false);

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.getAttribute('data-index'));
            if (!isNaN(index) && !this.visibleItems[index]) {
              this.$set(this.visibleItems, index, true);
            }
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.2 });

      items.forEach((el, idx) => {
        el.setAttribute('data-index', idx);
        observer.observe(el);
      });

      const records = observer.takeRecords();
      records.forEach(record => {
        if (record.isIntersecting) {
          const idx = record.target.getAttribute('data-index');
          if (idx !== null && !this.visibleItems[parseInt(idx)]) {
            this.$set(this.visibleItems, parseInt(idx), true);
          }
          observer.unobserve(record.target);
        }
      });
    },
    toggleLanguage() {
      this.locale = this.locale === 'zh' ? 'en' : 'zh'
      localStorage.setItem('locale', this.locale)
    },
    goToArticlesByTag(tag) {
      const routeData = this.$router.resolve({
        path: '/archives',
        query: { keyword: tag }
      });
      window.open(routeData.href, '_blank');
    },
    handleScroll() {
      const sY = window.scrollY
      this.scrollY = sY
      this.navClass = sY > 50 ? 'header-nav-up' : 'header-nav-top'
      this.updateActiveSection()
      const docH = document.documentElement.scrollHeight - document.documentElement.clientHeight
      this.scrollProgress = docH > 0 ? Math.min(100, Math.round((sY / docH) * 100)) : 0
    },
    updateActiveSection() {
      const sections = ['aboutSection', 'archivesSection', 'categoriesSection', 'statsSection', 'playgroundSection']
      let current = 'about'
      for (let i = 0; i < sections.length; i++) {
        const ref = this.$refs[sections[i]]
        if (ref) {
          const rect = ref.getBoundingClientRect()
          if (rect.top <= 150 && rect.bottom >= 150) {
            current = sections[i].replace('Section', '')
            break
          }
        }
      }
      this.activeSection = current
    },
    scrollToSection(key) {
      const map = { about: 'aboutSection', archives: 'archivesSection', categories: 'categoriesSection', stats: 'statsSection', playground: 'playgroundSection' }
      const target = this.$refs[map[key]]
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    },
    scrollToTop() {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },
    setSectionRefs() {
      this.$nextTick(() => this.updateActiveSection())
    },
    initCustomCursor() {
      const ball = document.createElement('div')
      ball.className = 'custom-cursor-ball'
      ball.style.display = 'none'
      document.body.appendChild(ball)
      this._cursorBall = ball

      const reveal = document.createElement('span')
      reveal.className = 'hero-reveal-text'
      reveal.textContent = this.revealGreeting
      reveal.style.display = 'none'
      document.body.appendChild(reveal)
      this._revealEl = reveal

      const textEl = document.getElementById('hero-title')
      const heroSection = this.$refs.heroSection
      if (!textEl || !heroSection) return

      const MAX_ANGLE = 35
      const SENSITIVITY = 0.3
      const PERSPECTIVE = 500
      const LERP = 0.18

      // cached untransformed text rect
      let baseRect = null
      const updateBaseRect = () => {
        const prev = textEl.style.transform
        textEl.style.transform = ''
        baseRect = textEl.getBoundingClientRect()
        textEl.style.transform = prev
        // position reveal at base text location
        reveal.style.left = baseRect.left + 'px'
        reveal.style.top = baseRect.top + 'px'
      }
      updateBaseRect()

      const navEl = document.querySelector('.header-nav')
      const isInHero = (e) => {
        if (navEl) {
          const nr = navEl.getBoundingClientRect()
          if (e.clientY >= nr.top && e.clientY <= nr.bottom) return false
        }
        const r = heroSection.getBoundingClientRect()
        return e.clientX >= r.left && e.clientX <= r.right &&
               e.clientY >= r.top && e.clientY <= r.bottom
      }

      // current and target rotation + clip
      let curRX = 0, curRY = 0, curCX = -100, curCY = -100
      let targetRX = 0, targetRY = 0, targetCX = -100, targetCY = -100
      let tx = 0, ty = 0
      let active = false

      const onMove = (e) => {
        tx = e.clientX
        ty = e.clientY
        if (!isInHero(e)) {
          active = false
          targetRX = 0; targetRY = 0
          targetCX = -100; targetCY = -100
          return
        }
        active = true
        const cx = baseRect.left + baseRect.width / 2
        const cy = baseRect.top + baseRect.height / 2
        targetRY = Math.max(-MAX_ANGLE, Math.min(MAX_ANGLE, (tx - cx) * SENSITIVITY))
        targetRX = Math.max(-MAX_ANGLE, Math.min(MAX_ANGLE, -(ty - cy) * SENSITIVITY))
        targetCX = tx - baseRect.left
        targetCY = ty - baseRect.top
        ball.style.left = tx + 'px'
        ball.style.top = ty + 'px'
      }

      const onLeave = () => {
        active = false
        targetRX = 0; targetRY = 0
        targetCX = -100; targetCY = -100
      }

      let animId
      const loop = () => {
        animId = requestAnimationFrame(loop)

        // lerp
        curRX += (targetRX - curRX) * LERP
        curRY += (targetRY - curRY) * LERP
        curCX += (targetCX - curCX) * LERP
        curCY += (targetCY - curCY) * LERP

        if (active || Math.abs(curRX) > 0.01 || Math.abs(curRY) > 0.01) {
          ball.style.display = ''
          reveal.style.display = ''
          textEl.style.transform = `rotateX(${curRX}deg) rotateY(${curRY}deg)`
          reveal.style.transform = `perspective(${PERSPECTIVE}px) rotateX(${curRX}deg) rotateY(${curRY}deg)`
          reveal.style.clipPath = `circle(75px at ${curCX}px ${curCY}px)`
        } else {
          ball.style.display = 'none'
          reveal.style.display = 'none'
        }
      }
      loop()

      // recache rect on resize
      this._roText = new ResizeObserver(() => { updateBaseRect() })
      this._roText.observe(textEl)

      document.addEventListener('mousemove', onMove)
      document.addEventListener('mouseleave', onLeave)

      this._cursorCleanup = () => {
        cancelAnimationFrame(animId)
        if (this._roText) this._roText.disconnect()
        document.removeEventListener('mousemove', onMove)
        document.removeEventListener('mouseleave', onLeave)
      }
    },

    destroyCustomCursor() {
      if (this._cursorCleanup) this._cursorCleanup()
      if (this._cursorBall && this._cursorBall.parentNode) {
        this._cursorBall.parentNode.removeChild(this._cursorBall)
      }
      if (this._revealEl && this._revealEl.parentNode) {
        this._revealEl.parentNode.removeChild(this._revealEl)
      }
    },

    initHeroParticles() {
      const canvas = this.$refs.heroParticles
      if (!canvas) return
      const ctx = canvas.getContext('2d')
      const section = this.$refs.heroSection
      let w, h
      const particles = []
      const count = 60

      const resize = () => {
        w = section.clientWidth
        h = section.clientHeight
        canvas.width = w * (window.devicePixelRatio || 1)
        canvas.height = h * (window.devicePixelRatio || 1)
        canvas.style.width = w + 'px'
        canvas.style.height = h + 'px'
        ctx.setTransform(1, 0, 0, 1, 0, 0)
        ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1)
      }
      resize()

      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: 1.2 + Math.random() * 2,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3 - 0.15,
          opacity: 0.15 + Math.random() * 0.25
        })
      }

      let color = document.documentElement.getAttribute('data-theme') === 'dark' ? '255,255,255' : '0,0,0'

      const onThemeChange = () => {
        color = document.documentElement.getAttribute('data-theme') === 'dark' ? '255,255,255' : '0,0,0'
      }
      if (this.$root && this.$root.$on) {
        this.$root.$on('theme-changed', onThemeChange)
      }

      let animId
      const loop = () => {
        animId = requestAnimationFrame(loop)
        ctx.clearRect(0, 0, w, h)

        for (const p of particles) {
          p.x += p.vx
          p.y += p.vy

          if (p.x < -10) p.x = w + 10
          if (p.x > w + 10) p.x = -10
          if (p.y < -10) p.y = h + 10
          if (p.y > h + 10) p.y = -10

          ctx.beginPath()
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(${color},${p.opacity})`
          ctx.fill()
        }
      }
      loop()

      this._roParticles = new ResizeObserver(() => {
        resize()
        for (const p of particles) {
          p.x = Math.min(p.x, w)
          p.y = Math.min(p.y, h)
        }
      })
      this._roParticles.observe(section)
      this._stopParticles = () => {
        cancelAnimationFrame(animId)
        if (this._roParticles) this._roParticles.disconnect()
        if (this.$root && this.$root.$off) {
          this.$root.$off('theme-changed', onThemeChange)
        }
      }
    },

    destroyHeroParticles() {
      if (this._stopParticles) this._stopParticles()
    },

    grayscaleBlog(id) {
      const el = document.querySelector(`.blog-item-wrapper[data-id="${id}"]`)
      if (el) {
        el.style.filter = 'grayscale(1)'
        setTimeout(() => { el.style.filter = '' }, 500)
      }
    },
  }
}
</script>

<style lang="less" scoped>
.container {
  min-height: 100vh;
  background: var(--bg-page);
}

/* 导航栏 */
.header-nav {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 5%;
  background: rgba(255,255,255,0.96);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--divider);
  transition: all 0.3s;
  cursor: auto;
}
[data-theme="dark"] .header-nav {
  background: rgba(18, 26, 39, 0.96);
}
.nav-menu {
  display: flex;
  gap: 16px;
}
.nav-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 40px;
  font-weight: 500;
  cursor: pointer;
  transition: 0.2s;
  color: var(--text-primary);
  &:hover {
    background: var(--accent-light);
  }
  &.active {
    background: var(--text-accent);
    color: #fff;
  }
}
.nav-right {
  display: flex;
  align-items: center;
  gap: 8px;
  width: auto;
  flex-shrink: 0;
}
.search-input {
  width: 160px;
}
.search-input /deep/ .el-input__inner {
  border-radius: 40px;
  background: var(--bg-card);
}
.lang-switch {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  background: var(--bg-card);
  padding: 6px 12px;
  border-radius: 40px;
  border: 1px solid var(--divider);
  transition: 0.2s;
  &:hover {
    background: var(--accent-light);
  }
  span {
    color: var(--text-secondary);
    transition: 0.2s;
    &.active {
      color: var(--text-accent);
      font-weight: 700;
    }
  }
  .separator {
    margin: 0 2px;
    color: var(--text-secondary);
  }
}

/* Hero 区域 */
.hero-section {
  position: relative;
  height: 100vh;
  min-height: 700px;
  cursor: none;
}
.hero-particles {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}
.hero-wrapper {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.hero-text-wrap {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  perspective: 500px;
  text-align: center;
}

.hero-greeting {
  display: inline-block;
  font-size: 72px;
  font-weight: 900;
  color: #000;
  white-space: nowrap;
  letter-spacing: 2px;
  transform-style: preserve-3d;
  will-change: transform;
}

.hero-char {
  display: inline-block;
  transform-origin: center center;
  transition: transform 0.3s ease, color 0.3s;
}
[data-theme="dark"] .hero-greeting {
  color: #fff;
}

/* 导航栏快捷链接 */
.nav-resume, .nav-github {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 5px 10px;
  border-radius: 40px;
  font-size: 12px;
  font-weight: 500;
  text-decoration: none;
  color: var(--text-secondary);
  transition: 0.2s;
  border: 1px solid var(--divider);
  white-space: nowrap;
  cursor: pointer;
  &:hover {
    color: var(--text-accent);
    border-color: var(--text-accent);
    background: var(--accent-light);
  }
}
.nav-github i, .nav-resume i {
  font-size: 14px;
}

/* 其余区块样式（完全保持原样） */
.content-section {
  padding: 100px 24px;
  border-top: 1px solid var(--divider);
}
.section-container {
  max-width: 1400px;
  margin: 0 auto;
}
.section-title {
  font-size: 36px;
  font-weight: 700;
  text-align: center;
  margin-bottom: 48px;
  color: var(--text-primary);
}
.search-bar {
  margin-bottom: 32px;
}
.search-bar /deep/ .el-input__inner {
  border-radius: 48px;
}
.blog-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.blog-item-wrapper {
  transition: transform 0.2s ease, filter 0.3s ease;
  cursor: pointer;
}
.blog-item-wrapper:hover {
  transform: translateY(-4px);
}
.subsection-title {
  font-size: 24px;
  font-weight: 700;
  margin: 32px 0 20px;
  color: var(--text-primary);
}
.experience-item {
  background: var(--bg-card);
  border: var(--card-border);
  border-radius: 24px;
  padding: 24px;
  margin-bottom: 24px;
  transition: 0.2s;
}
.experience-item:hover {
  transform: translateY(-2px);
  box-shadow: var(--card-shadow);
}
.item-head {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
}
.item-title {
  font-size: 20px;
  font-weight: 700;
}
.item-time {
  color: var(--text-secondary);
}
.item-stack, .item-subtitle {
  color: var(--text-accent);
  margin: 8px 0;
}
.item-desc {
  line-height: 1.6;
}
.highlight-block {
  margin-top: 16px;
  padding: 12px;
  background: var(--accent-light);
  border-radius: 16px;
}
.highlight-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
}
.highlight-tag {
  background: var(--bg-card);
  padding: 4px 12px;
  border-radius: 40px;
  font-size: 12px;
}
.item-points {
  margin-left: 20px;
  line-height: 1.7;
}
.about-precise-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 28px;
}
.first-row {
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  gap: 28px;
}
.second-row {
  display: contents;
}
.second-row .left-cell {
  grid-row: 2;
  grid-column: 1;
}
.second-row .right-cell {
  grid-row: 2 / 4;
  grid-column: 2;
}
.third-row {
  display: contents;
}
.third-row .left-cell {
  grid-row: 3;
  grid-column: 1;
}
.skill-card {
  height: 550px;
}
.skill-front, .skill-back {
  height: 550px;
  overflow-y: auto;
}
.card-front, .card-back {
  min-height: 220px;
}
.card-front i {
  font-size: 36px;
  margin-bottom: 12px;
  color: var(--text-accent);
}
.card-front h3 {
  margin-bottom: 8px;
}
.front-summary {
  margin-top: 12px;
  font-size: 13px;
  color: var(--text-secondary);
}
.card-back {
  text-align: left;
  padding: 10px;
  overflow: visible;
}
.card-back h4 {
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 18px;
  border-bottom: 1px solid var(--divider);
  padding-bottom: 8px;
  color: var(--text-primary);
}
.skill-summary {
  width: 100%;
  text-align: left;
  margin: 16px 0;
}
.skill-summary .summary-item {
  padding: 6px 0;
  font-size: 16px;
  color: var(--text-primary);
  border-bottom: 1px dashed var(--divider);
}
.front-hint {
  font-size: 12px;
  color: var(--text-secondary);
  margin-top: 12px;
  font-style: italic;
}
.skill-back h4 {
  color: var(--text-primary) !important;
}
.skill-list-full {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 8px;
}
.skill-item-full {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 14px;
  line-height: 1.5;
  padding: 8px 0;
  border-bottom: 1px solid var(--divider);
}
.skill-item-full i {
  margin-top: 3px;
  color: var(--text-accent);
}
.info-grid-large {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0px 2px;
  padding: 0 4px;
}
.info-item {
  display: flex;
  justify-content: space-between;
  border-bottom: 1px dashed var(--divider);
  padding: 10px 34px;
  font-size: 14px;
}
.info-label {
  font-weight: 500;
  color: var(--text-secondary);
  margin-right: 8px;
}
.info-value {
  font-weight: 600;
  text-align: right;
  color: var(--text-primary);
}
.email-link {
  color: var(--text-accent);
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
}
.self-text {
  white-space: pre-line;
  line-height: 1.6;
  font-size: 14px;
}
.keyword-preview {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
  margin-top: 16px;
}
.keyword-preview span {
  background: var(--accent-light);
  padding: 4px 10px;
  border-radius: 40px;
  font-size: 14px;
}
.keyword-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
.keyword-cloud .keyword {
  background: var(--accent-light);
  padding: 6px 14px;
  border-radius: 40px;
  font-size: 15px;
}
.edu-detail {
  font-size: 14px;
  line-height: 1.6;
}

/* 滚动进度条 */
.scroll-progress {
  position: fixed;
  top: 0;
  left: 0;
  height: 3px;
  background: var(--text-accent);
  z-index: 200;
  transition: width 0.15s ease;
}

/* 滚动揭示动画 */
.reveal-up {
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.6s cubic-bezier(0.2, 0.9, 0.4, 1.1);
}
.reveal-up.revealed {
  opacity: 1;
  transform: translateY(0);
}

.section-sub {
  text-align: center;
  color: var(--text-secondary);
  margin-bottom: 32px;
  font-size: 14px;
}

/* 统计卡片 */
.overview-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 36px;
}
.stat-card {
  background: var(--bg-card);
  border: var(--card-border);
  border-radius: 20px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  transition: all 0.3s ease;
  &:hover {
    transform: translateY(-4px);
    box-shadow: var(--card-shadow);
    border-color: var(--text-accent);
  }
}
.card-icon {
  width: 52px;
  height: 52px;
  border-radius: 14px;
  background: var(--accent-light);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  i {
    font-size: 26px;
    color: var(--text-accent);
  }
}
.card-value {
  font-size: 30px;
  font-weight: 800;
  color: var(--text-primary);
  line-height: 1;
}
.card-label {
  font-size: 13px;
  color: var(--text-secondary);
  margin-top: 6px;
}

/* 图表网格 */
.charts-grid {
  display: grid;
  grid-template-columns: 3fr 2fr;
  gap: 24px;
}
.chart-box {
  background: var(--bg-card);
  border: var(--card-border);
  border-radius: 20px;
  padding: 28px;
  transition: all 0.3s ease;
  &:hover {
    box-shadow: var(--card-shadow);
  }
  h3 {
    font-size: 17px;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 22px;
    display: flex;
    align-items: center;
    gap: 8px;
    i { color: var(--text-accent); }
  }
}

/* 演示标签 */
.demo-tabs {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-bottom: 28px;
}
.demo-tab {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 24px;
  border-radius: 40px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  background: var(--bg-card);
  color: var(--text-secondary);
  border: 1px solid var(--divider);
  transition: all 0.25s ease;
  &:hover {
    border-color: var(--text-accent);
    color: var(--text-accent);
    transform: translateY(-1px);
  }
  &.active {
    background: var(--text-accent);
    color: #fff;
    border-color: var(--text-accent);
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  }
}
.demo-content {
  background: var(--bg-card);
  border: var(--card-border);
  border-radius: 20px;
  padding: 28px;
  transition: all 0.3s ease;
  &:hover {
    box-shadow: var(--card-shadow);
  }
}

/* 侧边导航点 */
.side-dots {
  position: fixed;
  right: 24px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 99;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.side-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--divider);
  cursor: pointer;
  transition: all 0.3s ease;
  &:hover {
    background: var(--text-accent);
    transform: scale(1.4);
  }
  &.active {
    background: var(--text-accent);
    box-shadow: 0 0 8px var(--text-accent);
    width: 12px;
    height: 12px;
  }
}

/* 回到顶部按钮 */
.back-to-top {
  position: fixed;
  bottom: 160px;
  right: 24px;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: var(--bg-card);
  border: var(--card-border);
  box-shadow: var(--card-shadow);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 999;
  font-size: 20px;
  color: var(--text-accent);
  transition: all 0.3s ease;
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 20px rgba(0,0,0,0.12);
    background: var(--text-accent);
    color: #fff;
  }
}

/* 页脚 */
.site-footer {
  border-top: 1px solid var(--divider);
  background: var(--bg-card);
  padding: 36px 24px;
  margin-top: 80px;
}
.footer-inner {
  max-width: 1400px;
  margin: 0 auto;
  text-align: center;
}
.footer-links {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 28px;
  margin-bottom: 16px;
  a {
    color: var(--text-secondary);
    text-decoration: none;
    font-size: 14px;
    display: flex;
    align-items: center;
    gap: 6px;
    transition: color 0.2s;
    &:hover {
      color: var(--text-accent);
    }
  }
}
.footer-copy {
  font-size: 12px;
  color: var(--text-secondary);
  opacity: 0.6;
}

@media (max-width: 768px) {
  .side-dots { display: none; }
  .back-to-top { bottom: 140px; right: 16px; }
}

/* 响应式适配 */
@media (max-width: 900px) {
  .about-precise-grid {
    display: flex;
    flex-direction: column;
  }
  .first-row {
    grid-template-columns: 1fr;
  }
  .skill-card {
    height: auto;
    min-height: 500px;
  }
  .hero-greeting {
    font-size: 48px !important;
    white-space: normal !important;
    width: 90vw;
  }
}
@media (max-width: 768px) {
  .nav-menu span {
    display: none;
  }
  .nav-right {
    gap: 6px;
  }
  .nav-resume span, .nav-github span {
    display: none;
  }
  .search-input {
    width: 120px;
  }
  .info-grid-large {
    grid-template-columns: 1fr;
    gap: 12px;
  }
}
.nav-right .search-input /deep/ .el-input__prefix {
  top: 75%;
  transform: translateY(-50%);
}

/* 趣味时间轴样式 - 主题统一版 */
.awards-section {
  margin-top: 60px;
  padding-top: 20px;
  border-top: 1px solid var(--divider);
}

.awards-title {
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 40px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  background: linear-gradient(135deg, var(--text-accent), #f0b27a);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  i {
    font-size: 36px;
    background: none;
    -webkit-background-clip: unset;
    color: var(--text-accent);
  }
}

.timeline {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.timeline-item {
  position: relative;
  display: flex;
  gap: 24px;
  opacity: 0;
  transform: translateX(-30px);
  transition: all 0.5s cubic-bezier(0.2, 0.9, 0.4, 1.1);
  
  &.timeline-visible {
    opacity: 1;
    transform: translateX(0);
  }
  
  &:nth-child(even) {
    transform: translateX(30px);
    &.timeline-visible {
      transform: translateX(0);
    }
  }
}

.timeline-marker {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 48px;
  flex-shrink: 0;
}

.timeline-dot {
  width: 48px;
  height: 48px;
  background: var(--bg-card);
  border: 3px solid var(--text-accent);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  z-index: 2;
  transition: all 0.2s ease;
  box-shadow: 0 0 0 4px var(--bg-page);
  
  .dot-icon {
    transform: scale(1);
    transition: transform 0.2s;
  }
}

.timeline-line {
  flex: 1;
  width: 2px;
  background: linear-gradient(to bottom, var(--text-accent), rgba(0,0,0,0));
  margin-top: 8px;
  position: relative;
  overflow: hidden;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(to bottom, var(--text-accent), transparent);
    animation: flowLight 3s infinite linear;
    opacity: 0.15;
  }
}

@keyframes flowLight {
  0% { transform: translateY(-100%); }
  100% { transform: translateY(100%); }
}

.timeline-date {
  width: 110px;
  flex-shrink: 0;
  font-weight: 700;
  color: var(--text-accent);
  background: var(--accent-light);
  padding: 6px 12px;
  border-radius: 40px;
  font-size: 14px;
  text-align: center;
  align-self: flex-start;
  margin-top: 10px;
}

.timeline-content {
  flex: 1;
  background: var(--bg-card);
  border: 1px solid var(--divider);
  border-radius: 28px;
  padding: 18px 24px;
  transition: all 0.3s ease;
  /* 不再有 cursor: pointer，因为无点击事件 */
  
  &:hover {
    transform: translateY(-6px) scale(1.02);
    border-color: var(--text-accent);
    box-shadow: 0 15px 30px -10px rgba(0,0,0,0.2);
  }
  
  /* 悬停时影响相邻的圆点（图标放大）*/
  &:hover ~ .timeline-marker .timeline-dot {
    transform: scale(1.1);
    background: var(--text-accent);
    .dot-icon {
      transform: rotate(5deg) scale(1.05);
    }
  }
}

/* 因为相邻兄弟选择器需要调整结构，确保 .timeline-content 之后是 .timeline-marker？实际上在 HTML 中 marker 在前。因此改用父级 .timeline-item 悬停控制圆点 */
.timeline-item:hover .timeline-dot {
  transform: scale(1.1);
  background: var(--text-accent);
  .dot-icon {
    transform: rotate(5deg) scale(1.05);
  }
}

.timeline-title {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 8px;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: 8px;
}

.timeline-desc {
  font-size: 14px;
  color: var(--text-secondary);
  margin-bottom: 12px;
  line-height: 1.4;
}

.timeline-issuer {
  font-size: 12px;
  color: var(--text-secondary);
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 3px 12px;
  background: var(--accent-light);
  border-radius: 40px;
  width: fit-content;
}

/* 响应式 */
@media (max-width: 768px) {
  .timeline-item {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }
  .timeline-marker {
    width: 40px;
    margin-left: 10px;
  }
  .timeline-dot {
    width: 40px;
    height: 40px;
    font-size: 20px;
  }
  .timeline-date {
    margin-left: 60px;
    width: auto;
  }
  .timeline-content {
    width: calc(100% - 60px);
    margin-left: 60px;
  }
  .timeline-item:nth-child(even) {
    transform: translateX(0);
  }
  .overview-cards {
    grid-template-columns: repeat(2, 1fr);
  }
  .charts-grid {
    grid-template-columns: 1fr;
  }
  .demo-tabs {
    flex-wrap: wrap;
  }
  .demo-tab {
    font-size: 13px;
    padding: 8px 16px;
  }
}
</style>
