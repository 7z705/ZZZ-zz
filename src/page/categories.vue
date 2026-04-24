<template>
  <el-row class="container" :gutter="20">
    <el-col :span="18">
      <el-card class="experience-card">
        <div class="title">
          <i class="el-icon-notebook-2"></i> 项目 / 实习经历
        </div>
        <div class="section">
          <div class="section-title"><i class="el-icon-suitcase"></i> 实习经历</div>
          <div class="experience-item" v-for="item in internships" :key="item.title">
            <div class="item-head">
              <div class="item-title">{{ item.title }}</div>
              <div class="item-time">{{ item.time }}</div>
            </div>
            <div class="item-subtitle">{{ item.company }}</div>
            <div class="item-desc">{{ item.description }}</div>
          </div>
        </div>
        <div class="section">
          <div class="section-title"><i class="el-icon-folder-opened"></i> 项目经历</div>
          <div class="experience-item" v-for="item in projects" :key="item.title">
            <div class="item-head">
              <div class="item-title">{{ item.title }}</div>
              <div class="item-time">{{ item.time }}</div>
            </div>
            <div class="item-stack">技术栈：{{ item.stack }}</div>
            <div class="item-desc">{{ item.description }}</div>
            <div v-if="item.highlights && item.highlights.length" class="highlight-block">
              <div class="highlight-title"><i class="el-icon-star-on"></i> 项目亮点</div>
              <div class="highlight-tags">
                <span class="highlight-tag" v-for="highlight in item.highlights" :key="highlight">{{ highlight }}</span>
              </div>
            </div>
            <ul class="item-points">
              <li v-for="point in item.points" :key="point">{{ point }}</li>
            </ul>
          </div>
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

export default {
  name: 'categories',
  components: { generInfo },
  data() {
    return {
      internships: [
        {
          title: '北京北大软件工程股份有限公司',
          time: '2024.03-2026.03',
          company: '国企人力资源研发部--第二研发中心',
          description: '主要公司h5系统日常维护和需求开发，同时深度参与了两个uni-app系统从0到1的前端任务开发'
        }
      ],
      projects: [
        {
          title: '项目一：中海油领导端 Pad 系统',
          time: '2024.03-2026.03',
          stack: 'uni-app、Vue.js、scroll-view、ECharts、lodash、Promise.all',
          description: '面向央企领导的干部管理Pad端系统，支持材料审核、干部画像、任免跟踪、预警反查等核心功能。',
          highlights: ['Pad 端系统', '复杂业务联调', '多模块协同开发'],
          points: [
            '文件预览与导航优化：构建了文件树形结构与面包屑导航，集成PDF/Office文件预览能力，并通过动态容器高度计算与防抖加载技术，实现了自适应的多格式文件统一预览。',
            '干部画像性能优化：对干部画像模块进行一屏展示重构，针对履历长列表引入虚拟滚动，对图片与图表采用懒加载策略，并通过接口按需获取数据，使首屏加载时间减少约40%。',
            '数据反查机制建立：将预警数字封装为可点击链接，利用参数化路由实现多类型反查页面共享，建立了完整的数据追溯链路。',
            '复杂信息规范化处理：在优干信息页面中，对三级字典项进行层级展示，通过computed数据转换将嵌套对象转为扁平层级结构，实现了字典项的规范化展示。',
            ' 任免跟踪与统一检索：设计了统一的搜索框组件，支持时间节点反查与环节状态判断，并通过弹窗展示详情。在查询结果检索中，实现了干部/家庭/履历三种检索方式，利用Promise.all并行预加载统计数据，动态刷新表格，确保检索条件与数据实时同步。'
          ]
        },
        {
          title: '项目二：中海油干部考察系统（Pad/PC端）',
          time: '2024.03-2026.03',
          stack: 'uni-app、Vue.js、JavaScript、HTML5/CSS3、ECharts、lodash、Vuex',
          description: '央企干部考察综合平台，支持考察任务、谈话记录、人员状态追踪、多端适配。',
          highlights: [
            '多文件预览与统一入口渲染',
            '岗位联动与表格动态刷新',
            '二维码与邮件功能集成',
            'Pad / H5 双端退出逻辑适配',
            '锁定 / 解锁状态统一管理',
            '分页个性化设置与刷新联动'
          ],
          points: [
            '全机型跨端适配：针对 iPad 与 Android Pad，采用 rpx/vw/vh 混合单位实现响应式布局，结合动态容器高度计算与横竖屏自适应，覆盖所有目标设备。',
            '手势与返回拦截：通过 onBackPress 拦截返回事件、setStyle 禁用右滑手势，并利用条件编译区分平台，确保多端操作安全与体验一致。',
            '考察状态联动与排序：实现谈话状态下拉框联动表格数据筛选，前端优先排序将未谈话人员置顶，通过插槽深度定制渲染彩色标签，显著提升人员组织效率。',
            '锁定/解锁功能复用：采用混入（Mixin）封装锁定/解锁的业务逻辑，基于单向数据流管理组件状态，接口调用后自动刷新视图，实现多页面状态统一管理与复用。',
            '分页组件个性化优化：新增每页条数切换与页码快速跳转功能，将用户偏好存储至本地，并集中管理分页状态，提升查阅效率与个性化体验。',
            '附件动态预览：根据文件数量区分单文件直接预览与多文件弹窗列表选择，调用 uni.downloadFile 与 uni.openDocument 实现跨端文件预览，提供灵活交互。',
            '干部名册模块：设计岗位下拉联动筛选、表格列自定义显示能力，对长文本内容进行省略并支持悬停全显，提高名册查阅效率及模块复用性。',
            '登录安全优化：后端对账号密码进行加密传输，前端解密后校验，再重新加密提交登录接口，双重加密保障数据传输安全性。'
          ]
        },
        {
          title: '项目三：干部任免与假勤管理系统（多项目整合）',
          time: '2024.03-2026.03',
          stack: 'Vue.js、JavaScript、HTML5/CSS3、HTML5拖拽API',
          description: '面向企业干部任免全流程与员工假勤管理的综合系统，涵盖模拟任免、竞聘管理、考察录入、任职回写、流程集成等模块。',
          highlights: [
            '拖拽调配与编制数据实时联动',
            '树形表格动态加载与行合并',
            '考察表单与表格联动计算',
            '页面编辑权限动态控制',
            '模块互斥编辑与状态隔离',
            'OA 流程打通与数据同步'
          ],
          points: [
            '拖拽式人员调配（核心亮点）：利用 HTML5 拖拽 API 实现跨单位人员调动功能，拖拽后实时更新编制数据（实有数、核定数、超缺编），通过 Vue 响应式机制自动刷新视图，并调用异步接口完成任职变更，彻底实现拖拽后数据零手动操作自动同步。',
            '互斥编辑逻辑（核心亮点）：针对民主推荐与民主测评模块，设计互斥编辑规则——后端维护数据状态，前端控制禁用/解锁状态，模块切换时自动清空另一方数据，从根源上保障数据一致性。',
            '动态权限控制：基于前置标记与任务状态判断，动态切换页面只读/可编辑模式，适配不同流程节点的数据安全要求，提升多场景权限适配能力。',
            '竞聘结果上传闭环：封装可复用的上传组件，实现文件标识双向绑定、上传后自动回显，保存时统一提交接口，形成从上传、绑定、回显到保存的完整文件处理流程',
            '考察情况联动录入：设计表单与表格联动逻辑，票数变化时自动计算测评得分，支持批量提交统一接口，有效提升考察数据录入效率。',
            '任职回写联动：新增管理层次与职级字段，通过接口获取职务详情与职级树，实现联动过滤与数据联动展示，保证任职信息准确性。',
            '树形表格弹窗交互：实现类型筛选与名称搜索，采用行合并方式展示单位及职务，支持动态加载子节点，并可内嵌新增临时机构，满足复杂单位树形结构的交互需求。',
            '假勤模块数据联通：完成请休假、转正、离职、调配等流程与 OA 平台的数据同步，确保多流程场景下数据的一致性与顺畅流转。'
          ]
        },
        {
          title: '项目四：个人技术博客系统（AI驱动开发实践）',
          time: '2025.09-至今',
          stack: 'Vue2 + Vue Router + Element UI + Axios + Less（Vue CLI构建）| Vercel部署',
          description: '个人技术博客与作品集展示系统，用于更直观、有趣地展示个人技术能力与成长轨迹。采用AI辅助开发模式（Vibe Coding），探索新一代前端开发范式。',
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
      ]
    }
  }
}
</script>

<style lang='less' scoped>
.container {
  margin-top: 20px;
  color: var(--text-primary);
}
.title {
  font-weight: bold;
  font-size: 30px;
  color: var(--text-primary);
  margin-bottom: 24px;
  i {
    margin-right: 10px;
    color: var(--text-accent);
  }
}
.section {
  margin-top: 30px;
}
.section:first-of-type {
  margin-top: 0;
}
.section-title {
  margin-bottom: 16px;
  font-size: 24px;
  font-weight: 700;
  color: var(--text-accent);
  i {
    margin-right: 8px;
  }
}
.experience-item {
  margin-bottom: 24px;
  padding: 24px;
  background: var(--bg-card);
  backdrop-filter: blur(12px);
  border-radius: 28px;
  border-left: 4px solid var(--text-accent);
  transition: var(--transition);
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 32px -12px rgba(44,154,168,0.2);
  }
}
.item-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  flex-wrap: wrap;
}
.item-title {
  font-size: 22px;
  font-weight: 700;
  color: var(--text-primary);
}
.item-time {
  font-size: 14px;
  color: var(--text-secondary);
  white-space: nowrap;
}
.item-subtitle, .item-stack {
  margin-top: 8px;
  font-size: 16px;
  color: var(--text-accent);
}
.item-desc {
  margin-top: 12px;
  line-height: 1.9;
  color: var(--text-secondary);
}
.highlight-block {
  margin-top: 16px;
  padding: 14px 16px;
  background: var(--accent-light);
  border-radius: 20px;
}
.highlight-title {
  color: var(--text-accent);
  font-weight: 700;
  margin-bottom: 12px;
  i {
    margin-right: 6px;
  }
}
.highlight-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
.highlight-tag {
  display: inline-block;
  padding: 6px 12px;
  border-radius: 999px;
  background: var(--bg-card);
  border: 1px solid var(--divider);
  color: var(--text-primary);
}
.item-points {
  margin: 14px 0 0;
  padding-left: 20px;
  line-height: 1.9;
  color: var(--text-primary);
}
@media (max-width: 767px) {
  .item-head {
    flex-direction: column;
  }
}
</style>