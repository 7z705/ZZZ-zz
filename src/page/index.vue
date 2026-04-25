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
          @click="scrollToSection(item.key)">
          <i :class="item.icon"></i>
          <span>{{ t(`nav.${item.key}`) }}</span>
        </div>
      </div>
      <div class="nav-right">
        <el-input
          v-model="searchKeyword"
          :placeholder="t('searchPlaceholder')"
          clearable
          size="small"
          class="search-input">
          <i slot="prefix" class="el-icon-search"></i>
        </el-input>
        <!-- 语言切换按钮 -->
        <div class="lang-switch" @click="toggleLanguage">
          <span :class="{ active: locale === 'zh' }">中</span>
          <span class="separator">/</span>
          <span :class="{ active: locale === 'en' }">En</span>
        </div>
      </div>
    </div>

     <!-- Hero 区域（已添加标签点击事件） -->
    <section class="hero-section" ref="heroSection" @mousemove="handleMouseMove" @mouseleave="resetTextRotation">
      <canvas ref="heroCanvas" class="hero-canvas"></canvas>
      <div class="hero-wrapper">
        <div class="hero-text-3d" :style="text3DStyle">
          <span class="hero-greeting">{{ t('hero.greeting') }}</span>
        </div>
        <!-- 技术栈标签：水平排列，随机上下偏移，点击跳转 -->
        <div class="hero-tags-row">
          <span 
            v-for="(tag, index) in heroTagList" 
            :key="tag"
            class="hero-tag"
            :style="{ transform: `translateY(${tagOffsets[index]}px)` }"
            @click.stop="goToArticlesByTag(tag)">
            {{ tag }}
          </span>
        </div>
        <div class="hero-actions">
          <a class="hero-link" :href="portfolio.githubUrl" target="_blank">{{ t('hero.github') }}</a>
          <a class="hero-link" :href="portfolio.resumeUrl" target="_blank">{{ t('hero.resume') }}</a>
        </div>
      </div>
    </section>

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
  </div>
</template>

<script>
import blogSummary from '../components/blogSummary.vue'
import FlipCard from '../components/FlipCard.vue'

export default {
  name: 'index',
  components: { blogSummary, FlipCard },
  mounted() {
    // 原有事件监听
    window.addEventListener('scroll', this.handleScroll);
    this.initHeroCanvas();
    this.setSectionRefs();
    this.updateActiveSection();

    // 技术标签随机上下偏移（原有）
    this.tagOffsets = this.heroTagList.map(() => (Math.random() - 0.5) * 50);

    // 读取保存的语言设置（原有）
    const savedLocale = localStorage.getItem('locale');
    if (savedLocale && (savedLocale === 'zh' || savedLocale === 'en')) {
      this.locale = savedLocale;
    }

    // 【修复】获奖时间轴滚动动画：确保进入页面立即显示可见条目
    this.$nextTick(() => {
      const items = document.querySelectorAll('.timeline-item');
      if (!items.length) return;

      // 根据当前获奖数量初始化 visibleItems 数组
      this.visibleItems = new Array(items.length).fill(false);

      // 创建 Intersection Observer（阈值 0.2，更易触发）
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.getAttribute('data-index'));
            if (!isNaN(index) && !this.visibleItems[index]) {
              this.$set(this.visibleItems, index, true);
            }
            observer.unobserve(entry.target); // 只触发一次
          }
        });
      }, { threshold: 0.2 });

      // 观察每个时间轴条目，并记录索引
      items.forEach((el, idx) => {
        el.setAttribute('data-index', idx);
        observer.observe(el);
      });

      // 关键修复：手动调用 takeRecords() 检测已经可见的条目，使其立即显示
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
    });
  },
  watch: {
    locale() {
      this.$nextTick(() => {
        this.visibleItems = new Array(this.currentAwards.length).fill(false);
        this.initTimelineObserver(); // 封装的 observer 初始化函数
      });
    }
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll)
    if (this.animationFrame) cancelAnimationFrame(this.animationFrame)
    if (this.resizeCanvas) window.removeEventListener('resize', this.resizeCanvas)
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
          nav: { about: '关于', archives: '博客文章', categories: '项目/实习' },
          sections: { about: '关于我', blog: '博客文章', experience: '项目 / 实习经历' },
          searchPlaceholder: '搜索文章...',
          emptyBlog: '无匹配文章，试试换个关键词吧',
          hero: { greeting: 'HELLO，我是 ZZZ-zz', github: 'GitHub', resume: '查看简历' },
          aboutCards: {
            personal: { title: '个人介绍', role: '前端开发', summary: '两年实习经验，随时到岗', detailTitle: '详细', detail: '目前就读于郑州轻工业大学，全日制统招本科，今年6月份毕业，有英语四级证书，两年实习经验，可随时到岗。' },
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
          nav: { about: 'About', archives: 'Blog', categories: 'Projects' },
          sections: { about: 'About Me', blog: 'Blog Posts', experience: 'Projects / Internships' },
          searchPlaceholder: 'Search articles...',
          emptyBlog: 'No matching articles, try different keywords',
          hero: { greeting: 'HELLO, I am ZZZ-zz', github: 'GitHub', resume: 'View Resume' },
          aboutCards: {
            personal: { title: 'Introduction', role: 'Frontend Dev', summary: '2 years internship, immediate start', detailTitle: 'Details', detail: 'Currently studying at Zhengzhou University of Light Industry, full-time undergraduate, graduating in June. CET-4 certified, 2 years internship experience, available immediately.' },
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
      personalKeywordsZh: ['前端工程师', '两年实习经验', '企业级项目', 'Pad端开发', '后台管理系统', '流程管理系统', '跨端应用', '可视化图表'],
      personalKeywordsEn: ['Frontend Engineer', '2-year Internship', 'Enterprise Projects', 'Pad Development', 'Admin Systems', 'Workflow Systems', 'Cross-platform Apps', 'Data Visualization'],
      selfEvaluationZh: '技术扎实、自学半年成功入行前端开发、具有实战项目开发经验\n学习能力强，喜欢学习新事物，团队荣誉感强，有明确的职业规划\n对工作充满热情，善于与团队沟通，吃苦耐劳，工作积极主动，适应能力强',
      selfEvaluationEn: 'Solid technical skills, successfully transitioned to frontend development through self-study for half a year, with practical project experience.\nStrong learning ability, enjoy exploring new technologies, strong sense of team honor, clear career plan.\nPassionate about work, good team communication, hardworking, proactive, highly adaptable.',
      internshipsZh: [
        {
          title: '北京北大软件工程股份有限公司',
          time: '2024.03-2026.03',
          company: '国企人力资源研发部--第二研发中心',
          description: '主要公司h5系统日常维护和需求开发，同时深度参与了两个uni-app系统从0到1的前端任务开发'
        }
      ],
      internshipsEn: [
        {
          title: 'Beijing Beida Software Engineering Co., Ltd.',
          time: '2024.03-2026.03',
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
          time: '2024.03-2026.03',
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
          time: '2024.03-2026.03',
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
          time: '2024.03-2026.03',
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
          time: '2024.03-2026.03',
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
          time: '2024.03-2026.03',
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
          time: '2024.03-2026.03',
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
      animationFrame: null,
      searchKeyword: '',
      heroTagList: ['HTML', 'CSS', 'JavaScript', 'Vue 2/3', 'Node.js', 'Git', 'uni-app', 'webpack'],
      tagOffsets: []
    }
  },
  computed: {
    currentAwards() {
      return this.locale === 'zh' ? this.awardsZh : this.awardsEn
    },
    navItems() {
      return [
        { key: 'about', icon: 'el-icon-s-home' },
        { key: 'archives', icon: 'el-icon-folder-opened' },
        { key: 'categories', icon: 'el-icon-paperclip' }
      ]
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
    }
  },
  methods: {
    // 获取卡片图标（根据索引循环）
    getAwardIcon(idx) {
      const icons = ['🏆', '🎖️', '📜', '⭐', '🏅', '✨'];
      return icons[idx % icons.length];
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
      const scrollY = window.scrollY
      this.navClass = scrollY > 50 ? 'header-nav-up' : 'header-nav-top'
      this.updateActiveSection()
    },
    updateActiveSection() {
      const sections = ['aboutSection', 'archivesSection', 'categoriesSection']
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
      const map = { about: 'aboutSection', archives: 'archivesSection', categories: 'categoriesSection' }
      const target = this.$refs[map[key]]
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    },
    setSectionRefs() {
      this.$nextTick(() => this.updateActiveSection())
    },
    handleMouseMove(e) {
      const rect = this.$refs.heroSection.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width - 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5
      const rotateY = x * 25
      const rotateX = -y * 25
      this.text3DStyle = { transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)` }
    },
    resetTextRotation() {
      this.text3DStyle = { transform: 'rotateX(0deg) rotateY(0deg)' }
    },
    grayscaleBlog(id) {
      const el = document.querySelector(`.blog-item-wrapper[data-id="${id}"]`)
      if (el) {
        el.style.filter = 'grayscale(1)'
        setTimeout(() => { el.style.filter = '' }, 500)
      }
    },
    initHeroCanvas() { /* 保持原有Canvas动画逻辑不变 */ 
      const canvas = this.$refs.heroCanvas
      if (!canvas) return
      const ctx = canvas.getContext('2d')
      let width = window.innerWidth
      let height = window.innerHeight
      let particles = []
      let mouseX = width/2, mouseY = height/2
      const PARTICLE_COUNT = 150

      const resize = () => {
        width = window.innerWidth
        height = window.innerHeight
        canvas.width = width
        canvas.height = height
      }
      window.addEventListener('resize', resize)
      this.resizeCanvas = resize
      resize()

      class Particle {
        constructor() {
          this.x = Math.random() * width
          this.y = Math.random() * height
          this.size = Math.random() * 2.5 + 1
          this.speedX = (Math.random() - 0.5) * 1.2
          this.speedY = (Math.random() - 0.5) * 1.2
          this.color = `hsl(${Math.random() * 60 + 180}, 70%, 65%)`
          this.originalX = this.x
          this.originalY = this.y
        }
        update() {
          const dx = mouseX - this.x
          const dy = mouseY - this.y
          const dist = Math.sqrt(dx*dx + dy*dy)
          if (dist < 150) {
            const angle = Math.atan2(dy, dx)
            const force = (150 - dist) / 150 * 2.5
            this.x -= Math.cos(angle) * force
            this.y -= Math.sin(angle) * force
          } else {
            this.x += (this.originalX - this.x) * 0.02
            this.y += (this.originalY - this.y) * 0.02
          }
          if (this.x < 0) this.x = 0
          if (this.x > width) this.x = width
          if (this.y < 0) this.y = 0
          if (this.y > height) this.y = height
        }
        draw() {
          ctx.beginPath()
          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
          ctx.fillStyle = this.color
          ctx.fill()
        }
      }

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(new Particle())
      }

      const onMouseMove = (e) => {
        const rect = canvas.getBoundingClientRect()
        mouseX = e.clientX - rect.left
        mouseY = e.clientY - rect.top
      }
      window.addEventListener('mousemove', onMouseMove)

      const animate = () => {
        ctx.clearRect(0, 0, width, height)
        ctx.fillStyle = 'rgba(255,255,255,0.08)'
        ctx.fillRect(0, 0, width, height)
        particles.forEach(p => {
          p.update()
          p.draw()
        })
        this.animationFrame = requestAnimationFrame(animate)
      }
      animate()
    }
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
  justify-content: center;
  padding: 12px 5%;
  background: rgba(255,255,255,0.96);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--divider);
  transition: all 0.3s;
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
  position: absolute;
  right: 5%;
  display: flex;
  align-items: center;
  gap: 12px;
  width: auto;
}
.search-input {
  width: 200px;
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
  height: 85vh;
  min-height: 600px;
  overflow: hidden;
}
.hero-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  pointer-events: none;
}
.hero-wrapper {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  pointer-events: none;
}
.hero-text-3d {
  text-align: center;
  width: 100%;
  margin-bottom: 40px;
  pointer-events: none;
  transform-style: preserve-3d;
  transition: transform 0.05s linear;
  .hero-greeting {
    display: inline-block;
    font-size: 120px;
    font-weight: 900;
    color: #000000;
    white-space: nowrap;
    text-shadow: 0 0 10px rgba(0,0,0,0.1);
    letter-spacing: 2px;
    transform: translateY(120px);
  }
}
[data-theme="dark"] .hero-greeting {
  color: #FFFFFF;
  text-shadow: 0 0 10px rgba(255,255,255,0.2);
}

/* 技术栈标签行 */
.hero-tags-row {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin: 20px 0 10px;
  padding: 90px 20px;
  width: 100%;
  pointer-events: auto;
}
.hero-tag {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 85px;
  height: 85px;
  background-color: #ffffff;
  color: #000000;
  font-size: 14px;
  font-weight: 500;
  border-radius: 50%;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  text-align: center;
  cursor: pointer;
  word-break: break-word;
  white-space: normal;
  padding: 8px;
  box-sizing: border-box;
  line-height: 1.3;
  transition: all 0.2s ease;
  border: 1px solid #e0e0e0;
  will-change: transform;
}
.hero-tag:hover {
  background-color: #000000;
  color: #ffffff;
  border-color: #000000;
  transform: scale(1.05) translateY(0) !important;
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
}
[data-theme="dark"] .hero-tag {
  background-color: #2d2d2d;
  color: #f0f0f0;
  border-color: #444;
}
[data-theme="dark"] .hero-tag:hover {
  background-color: #ffffff;
  color: #000000;
  border-color: #ffffff;
}
.hero-actions {
  display: flex;
  gap: 20px;
  margin-top: 8px;
  pointer-events: auto;
}
.hero-link {
  padding: 10px 24px;
  border-radius: 48px;
  background: var(--bg-card);
  border: 1px solid var(--divider);
  color: var(--text-primary);
  text-decoration: none;
  font-weight: 500;
  transition: 0.2s;
  &:hover {
    background: var(--btn-bg);
    color: white;
    transform: translateY(-2px);
  }
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
  color: #1E293B !important;
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
  .hero-tag {
    width: 70px;
    height: 70px;
    font-size: 12px;
  }
  .hero-tags-row {
    gap: 15px;
  }
}
@media (max-width: 768px) {
  .nav-menu span {
    display: none;
  }
  .nav-right {
    gap: 8px;
  }
  .search-input {
    width: 140px;
  }
  .hero-actions {
    flex-direction: column;
    align-items: center;
  }
  .info-grid-large {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  .hero-tag {
    width: 60px;
    height: 60px;
    font-size: 11px;
    padding: 4px;
  }
  .hero-tags-row {
    gap: 12px;
    margin: 15px 0 8px;
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
    background: linear-gradient(to bottom, rgba(255,255,255,0.6), transparent);
    animation: flowLight 3s infinite linear;
    opacity: 0.6;
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
}
</style>