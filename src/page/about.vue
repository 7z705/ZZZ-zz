<template>
    <el-row class="container" :gutter="20">
        <el-col :span="18">
            <el-card class="portfolio-card">
                <div class="hero">
                    <div class="hero-label">ABOUT ME</div>
                    <div class="hero-title">前端开发工程师 / 求职主页</div>
                    <div class="hero-desc">
                        我希望用这个博客系统来展示我的前端能力、项目经历、技术积累和个人表达。
                        如果你正在寻找一位能落地业务页面、关注交互体验并愿意持续成长的前端工程师，欢迎查看我的 GitHub 与简历。
                    </div>
                    <div class="hero-actions">
                        <a :href="profile.githubUrl" target="_blank" rel="noopener noreferrer" class="action-link">GitHub 主页</a>
                        <a :href="profile.resumeUrl" target="_blank" rel="noopener noreferrer" class="action-link">简历入口</a>
                    </div>
                </div>

                <div class="section">
                    <div class="section-title">个人信息</div>
                    <div class="info-grid">
                        <div class="info-item">
                            <div class="label">姓名</div>
                            <div class="value">{{ profile.name }}</div>
                        </div>
                        <div class="info-item">
                            <div class="label">方向</div>
                            <div class="value">{{ profile.role }}</div>
                        </div>
                        <div class="info-item">
                            <div class="label">状态</div>
                            <div class="value">{{ profile.status }}</div>
                        </div>
                        <div class="info-item">
                            <div class="label">GitHub</div>
                            <a class="value link" :href="profile.githubUrl" target="_blank" rel="noopener noreferrer">
                                {{ profile.githubText }}
                            </a>
                        </div>
                        <div class="info-item">
                            <div class="label">电话</div>
                            <div class="value">{{ profile.phone }}</div>
                        </div>
                        <div class="info-item">
                            <div class="label">年龄</div>
                            <div class="value">{{ profile.age }}</div>
                        </div>
                        <div class="info-item">
                            <div class="label">性别</div>
                            <div class="value">{{ profile.gender }}</div>
                        </div>
                        <div class="info-item">
                            <div class="label">学历</div>
                            <div class="value">{{ profile.education }}</div>
                        </div>
                        <div class="info-item">
                            <div class="label">邮箱</div>
                            <div class="value">{{ profile.email }}</div>
                        </div>
                        <div class="info-item">
                            <div class="label">求职意向</div>
                            <div class="value">{{ profile.jobIntent }}</div>
                        </div>
                        <div class="info-item">
                            <div class="label">实习经验</div>
                            <div class="value">{{ profile.internshipYears }}</div>
                        </div>
                    </div>
                </div>

                <div class="section">
                    <div class="section-title">教育背景</div>
                    <div class="edu-card">
                        <div class="edu-head">
                            <div class="edu-school">{{ education.school }}</div>
                            <div class="edu-time">{{ education.time }}</div>
                        </div>
                        <div class="edu-major">{{ education.major }}</div>
                        <div class="edu-grade">{{ education.grade }}</div>
                    </div>
                </div>

                <div class="section">
                    <div class="section-title">荣誉奖项</div>
                    <ul class="detail-list">
                        <li v-for="award in awards" :key="award">{{ award }}</li>
                    </ul>
                </div>

                <div class="section">
                    <div class="section-title">主修课程</div>
                    <div class="skills">
                        <span class="skill" v-for="course in courses" :key="course">{{ course }}</span>
                    </div>
                </div>

                <div class="section">
                    <div class="section-title">我想展示什么</div>
                    <div class="card-list">
                        <div class="info-card" v-for="item in highlights" :key="item.title">
                            <div class="card-title">{{ item.title }}</div>
                            <div class="card-text">{{ item.text }}</div>
                        </div>
                    </div>
                </div>

                <div class="section">
                    <div class="section-title">技术侧重点</div>
                    <div class="skills">
                        <span class="skill" v-for="skill in skills" :key="skill">{{ skill }}</span>
                    </div>
                </div>

                <div v-if="userInfo.description" class="section">
                    <div class="section-title">补充介绍</div>
                    <div ref="contentRef" id="content" class="content markdown-body line-numbers" v-html="userInfo.description"></div>
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
import Prism from 'prismjs'
export default {
    name: 'about',
    components: {
        generInfo,
    },
    async created() {
        await this.getUserInfo()
        if (this.userInfo.description) {
            this.$nextTick(() => {
                Prism.highlightAll()
                if (this.$refs.contentRef) {
                    this.$formula(this.$refs.contentRef)
                }
            })
        }
    },
    data() {
        return {
            userInfo: {},
            profile: {
                name: '郑瞄瞄',
                role: '前端开发工程师',
                status: '求职中',
                phone: '18737151171',
                age: '22',
                gender: '女',
                education: '统招本科 | 全日制',
                email: '2831639494@qq.com',
                jobIntent: '前端开发 | 随时到岗',
                internshipYears: '1年',
                githubUrl: 'https://github.com/7z705',
                githubText: 'github.com/7z705',
                resumeUrl: '/resume.pdf',
            },
            education: {
                school: '郑州轻工业大学',
                major: '网络工程专业',
                time: '2022.09 - 至今',
                grade: '大四'
            },
            awards: [
                '大学英语四级证书',
                '河南省第五届“金盾信安杯”三等奖',
                '河南省第六届“金盾信安杯”三等奖',
                '校级奖学金',
                '三好学生',
                '学科优秀单项奖学金'
            ],
            courses: [
                'Web设计技术与安全',
                '数据库系统与安全',
                '操作系统',
                '数据库通信与安全',
                '计算机网络'
            ],
            highlights: [
                {
                    title: '项目一：中海油领导端Pad系统',
                    text: '项目描述：面向领导层使用的Pad端干部管理与审查系统，提供材料审核、关注管理、干部画像、任免跟踪、反查追溯等功能，支持多维度干部信息展示与操作，提升领导决策效率。技术栈：uni-app、Vue.js、scroll-view、ECharts、lodash、Promise.all核心贡献：1、开发材料审核页面，实现文件树形结构、面包屑导航与PDF/Office预览切换，支持自适应布局2、实现我的关注模块，支持关注/取消关注、批量操作与分页加载，提升文件管理效率3、开发设置页面，实现滚动分页、选中状态管理与简介展开/收起功能4、为查询结果增加干部、家庭、履历三种检索方式，支持并行统计与动态表格刷新5、调整名册表格样式，整合表头、动态添加性别标识，并跳转人员详情页联调接口6、重构干部画像模块布局，实现一屏展示与性能优化，开发兼职信息与分工信息页面7、实现预警信息反查功能，支持点击统计数字跳转人员列表页完成数据追溯8、开发班子配备模块与分工信息页面，采用卡片与表单布局，支持数据动态渲染9、为任免跟踪管理页面增加搜索框与时间节点反查功能，支持环节状态判断与弹窗详情展示10、开发优干信息页面，实现三级字典项层级展示与数据转换'
                },
                {
                    title: '项目经历 2',
                    text: '请把这里替换成第二个重点项目，建议突出技术栈、业务场景、难点处理和你个人的实际贡献。'
                },
                {
                    title: '项目经历 3',
                    text: '如果你还有第三个想展示的项目或实习经历，可以放在这里；如果没有，也可以删掉这一项。'
                },
            ],
            skills: [
                '熟练运用语义化标签、Flex/Grid 布局，掌握 rpx/vw/vh 响应式适配，实现多端适配；深入理解原型链、闭包、事件循环，熟练使用 Promise、async/await 处理异步操作。',
                '具备 TypeScript 实际项目开发经验，熟练使用接口定义、类型推断、泛型等特性，实现全链路类型安全。',
                '熟练使用 Vue 全家桶进行企业级应用开发，掌握响应式原理、组件通信、路由守卫、状态管理（Vuex/Pinia）、Composition API 与 Options API。',
                '熟练使用 uni-app 进行 iOS/Android/H5 跨端开发，掌握条件编译、移动端适配、文件下载预览、App 端原生能力集成。',
                '遵循单一职责原则封装可复用组件，熟练使用 Webpack 进行代码分割、懒加载等性能优化，掌握 ESLint、Prettier 代码规范。',
                '熟练使用 Axios 封装请求，掌握拦截器实现统一错误处理、Token 注入，具备丰富接口联调经验。',
                '熟练使用 Git 进行分支管理、冲突解决，熟悉 Git Flow 工作流与 commit 规范。',
                '熟练使用虚拟滚动、懒加载、防抖节流优化性能，具备干部任免、考察流程、假勤管理等复杂业务系统开发经验。',
                '熟练使用 GitHub Copilot、Cursor、通义灵码等 AI 编程工具辅助代码生成与调试，结合 ChatGPT 等大语言模型进行技术方案调研、问题排查与代码优化，提升开发效率。'
            ],
        }
    },
    methods: {
        // 获取用户信息
        async getUserInfo() {
            const {data: res} = await this.$http.get('/public/user/default')
            if (res.meta.status !== 200) {
                this.$message.error("获取用户信息失败：" + res.meta.msg)
                return
            }
            console.log(res.data)
            this.userInfo = res.data
        },
    },
}
</script>

<style lang='less' scoped>
    .container{
        margin-top: 20px;
        color: #2C3E50;
    }
    .portfolio-card{
        color: #2C3E50;
        background-color: #FFFFFF;
        border: 1px solid #D6E4F0;
    }
    .hero{
        padding: 10px 0 30px;
    }
    .hero-label{
        font-size: 13px;
        letter-spacing: 0.25em;
        color: #1F7A8C;
    }
    .hero-title{
        margin-top: 12px;
        font-size: 34px;
        font-weight: 700;
        line-height: 1.3;
    }
    .hero-desc{
        margin-top: 18px;
        font-size: 16px;
        line-height: 1.9;
        color: #5D6D7E;
    }
    .hero-actions{
        margin-top: 22px;
    }
    .action-link{
        display: inline-block;
        margin-right: 14px;
        padding: 10px 18px;
        color: #1F7A8C;
        border: 1px solid #1F7A8C;
        background-color: #FFFFFF;
    }
    .action-link:hover{
        color: #fff;
        background-color: #2A8B9E;
        border-color: #2A8B9E;
    }
    .section{
        margin-top: 24px;
    }
    .section-title{
        margin-bottom: 16px;
        font-size: 24px;
        font-weight: 700;
    }
    .info-grid{
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 14px;
    }
    .info-item{
        padding: 16px;
        background-color: #FFFFFF;
        border: 1px solid #D6E4F0;
    }
    .edu-card{
        padding: 18px;
        background-color: #FFFFFF;
        border: 1px solid #D6E4F0;
    }
    .edu-head{
        display: flex;
        justify-content: space-between;
        gap: 16px;
    }
    .edu-school{
        font-size: 20px;
        font-weight: 700;
    }
    .edu-time{
        color: #5D6D7E;
        white-space: nowrap;
    }
    .edu-major{
        margin-top: 10px;
        color: #1F7A8C;
        font-weight: 600;
    }
    .edu-grade{
        margin-top: 8px;
        color: #5D6D7E;
    }
    .label{
        font-size: 13px;
        color: #5D6D7E;
        margin-bottom: 8px;
    }
    .value{
        font-size: 16px;
        font-weight: 600;
    }
    .link{
        color: #1F7A8C;
    }
    .link:hover{
        color: #2A8B9E;
    }
    .card-list{
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 14px;
    }
    .info-card{
        padding: 18px;
        background-color: #FFFFFF;
        border: 1px solid #D6E4F0;
    }
    .card-title{
        font-size: 18px;
        font-weight: 700;
        margin-bottom: 10px;
    }
    .card-text{
        line-height: 1.8;
    }
    .skills{
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
    }
    .skill{
        padding: 12px 16px;
        background-color: #FFFFFF;
        color: #2C3E50;
        border: 1px solid #D6E4F0;
        border-radius: 16px;
        line-height: 1.8;
        transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    .skill:hover{
        transform: translateY(-6px);
        box-shadow: 0 10px 18px rgba(31, 122, 140, 0.12);
    }
    .detail-list{
        margin: 0;
        padding-left: 20px;
        line-height: 2;
        color: #2C3E50;
    }
    .markdown-body {
        box-sizing: border-box;
        min-width: 200px;
        max-width: 980px;
        margin: 0 auto;
        padding: 45px;
        background-color: #F4F9FF;
    }
    
    @media (max-width: 767px) {
        .info-grid,
        .card-list{
            grid-template-columns: 1fr;
        }
        .edu-head{
            flex-direction: column;
        }
        .hero-title{
            font-size: 28px;
        }
        .action-link{
            margin-right: 0;
            margin-bottom: 10px;
        }
        .markdown-body {
            padding: 15px;
        }
    }
</style>
