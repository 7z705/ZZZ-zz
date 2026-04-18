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
            '多文件预览与统一入口渲染',
            '岗位联动与表格动态刷新',
            '二维码与邮件功能集成',
            'Pad / H5 双端退出逻辑适配',
            '锁定 / 解锁状态统一管理',
            '分页个性化设置与刷新联动'
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
            '拖拽调配与编制数据实时联动',
            '树形表格动态加载与行合并',
            '考察表单与表格联动计算',
            '页面编辑权限动态控制',
            '模块互斥编辑与状态隔离',
            'OA 流程打通与数据同步'
          ],
          points: [
            '在江淮汽车模拟任免模块中，实现实有数、核定数、超缺编数动态展示，并在人员拖拽调整后实时联动更新编制数据。',
            '开发添加酝酿单位弹窗，支持类型筛选、名称搜索、树形表格多选与临时机构新增，适配复杂组织结构场景。',
            '基于 HTML5 拖拽 API 实现跨区域人员调动，结合响应式数据完成复杂交互与状态同步。',
            '在江淮汽车干部任免模块中，完成竞聘结果上传、考察情况录入、任职回写等页面开发，实现文件上传回显、表单与表格联动、测评得分自动计算与批量提交。',
            '通过接口获取职务详情与职级树，实现管理层次与职级的联动过滤，提升任职回写数据准确性。',
            '在央视干部任免模块中，实现从人员详情页与流程任务进入页面时的状态区分，支持只读与可编辑模式切换。',
            '通过前置标记与任务状态判断实现页面编辑权限的动态控制，保障流程规范与数据安全。',
            '在中国核电工程干部任免模块中，实现互斥编辑、锁定切换、数据清空、组件禁用与解锁操作，完成模块间数据隔离。',
            '在北京保障房个人假勤模块中，完成请休假、转正、离职、调配等流程与 OA 平台的联通，实现多流程数据同步与状态流转。'
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