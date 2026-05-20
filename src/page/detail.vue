<template>
    <el-row class="container" :gutter="20">
        <el-col :xs="24" :md="18" :lg="18">
            <el-card>
                <!-- 文章首图 -->
                <img v-if="blog.firstPicture" :src="blog.firstPicture" alt="" style="width:100%">
                <!-- 文章标题 -->
                <div class="title">
                    {{ blog.title }}
                </div>
                <!-- 文章信息（发表时间、阅读次数等） -->
                <div class="subtitle">
                    <!-- <div><i class="el-icon-view"></i><span> 阅读次数 {{ blog.views }}</span></div> -->
                </div>
                <!-- 文章内容 -->
                <div ref="contentRef" id="content" class="content markdown-body line-numbers" v-html="blog.content"></div>
                <div class="thanks">
                    ----- 本文结束，感谢您的阅读 -----
                </div>
                <!-- 底部声明栏 -->
                <el-card shadow="never" class="footer">
                    <div class="author">
                        <!-- 这里确保能够拿到数据，因为向服务器获取数据需要时间 -->
                        <span>本文作者：</span><a href="https://github.com/xiaoqieF">{{ blog.user ? blog.user.nickname:"" }}</a>
                    </div>
                    <div class="copyright">
                        <span>版权声明：</span>本博客所有文章除特别声明外，均采用 <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/deed.en">BY-NC-SA</a> 许可协议。转载请注明出处！
                    </div>
                </el-card>
                <!-- 底部标签区 -->
                <div class="foot-tag">
                    <router-link to="/tags" class="foot-tag-item" v-for="tag in blog.tags" :key="tag.id">
                        <i class="iconfont icon-tags">{{ tag.name }}</i>
                    </router-link>
                </div>
            </el-card>
            <!-- 点赞 + 评论区 -->
            <el-card class="interaction-bar">
              <div class="interaction-row">
                <LikeButton :articleId="$route.params.blogId" />
              </div>
            </el-card>
            <el-card class="comment">
              <div class="comment-title">评论区</div>
              <!--
                Giscus 配置说明：
                1. 在 GitHub 创建一个 public 仓库（如 blog-comments）
                2. 在仓库 Settings > Features 中开启 Discussions
                3. 安装 Giscus App: https://github.com/apps/giscus
                4. 访问 https://giscus.app/zh-CN 获取 data-repo-id 和 data-category-id
                5. 将下面的占位值替换为实际值
              -->
              <div ref="giscusContainer" class="giscus-container"></div>
            </el-card>
        </el-col>
        <el-col ref="sideRef" :xs="0" :md="6" :lg="6">
            <generInfo/>
            <!-- 目录区域 -->
            <el-card :class="dirClass" ref="dirRef">
                <div class="dir-title">
                    目录
                </div>
                <!-- 目录内容，由tocbot生成 -->
                <div class="dir-content">
                </div>
            </el-card>
        </el-col>
    </el-row>
</template>

<script>
import generInfo from '../components/generInfo.vue'
import LikeButton from '../components/LikeButton.vue'
import Prism from 'prismjs'
import * as tocbot from 'tocbot'
export default {
    name: 'detail',
    components: {
        generInfo,
        LikeButton,
    },
    async created() {
        await this.getBlog()
        // Giscus 在 mounted 中初始化（需要 DOM 已挂载）
        Prism.highlightAll()
        this.$formula(this.$refs.contentRef)
        tocbot.init({
            tocSelector: '.dir-content',
            contentSelector: '.content',
            headingSelector: 'h1, h2, h3',
            hasInnerContainers: true,
        });
        this.increaseViews()
        this.trackArticleView()
    },
    mounted() {
        window.addEventListener('scroll', this.scrollHandler)
        this.initGiscus()
        this.$bus.$on('theme-changed', this.syncGiscusTheme)
    },
    beforeDestroy() {
        window.removeEventListener('scroll', this.scrollHandler)
        this.$bus.$off('theme-changed', this.syncGiscusTheme)
    },
    data() {
        return {
            // 博客信息
            blog:{},
            // 目录标签的所属类，用于改变样式
            dirClass: '',
            // Giscus 配置 — 请替换为你的实际值
            // 获取方式：访问 https://giscus.app/zh-CN 完成设置后复制以下属性值
            giscusConfig: {
                repo: '7z705/blog-comments',
                repoId: 'R_kgDO0000000',        // TODO: 替换为你的 repo-id
                category: 'General',
                categoryId: 'DIC_kwDO0000000',  // TODO: 替换为你的 category-id
            }
        }
    },
    methods: {
        async getBlog() {
            const {data: res} = await this.$http.get(`public/blog/${this.$route.params.blogId}`)
            console.log(res)
            if (res.meta.status === 200) {
                this.blog = res.data
            } else {
                this.$message.error('获取博客数据失败:', res.meta.msg)
            }
        },

        scrollHandler(event) {
            if (this.$refs.sideRef.$el.getBoundingClientRect().top < -250) {
                this.dirClass = 'dir-sticky'
            } else {
                this.dirClass = ''
            }
        },

        async increaseViews() {
            const {data: res} = await this.$http.post(`/public/blog/view/${this.$route.params.blogId}`)
                console.log(res)
        },

        trackArticleView() {
            try {
                const key = 'blog_stats'
                const raw = localStorage.getItem(key)
                if (!raw) return
                let stats = JSON.parse(raw)
                stats.articleViews = stats.articleViews || {}
                const id = this.$route.params.blogId
                stats.articleViews[id] = (stats.articleViews[id] || 0) + 1
                localStorage.setItem(key, JSON.stringify(stats))
            } catch { /* ignore */ }
        },

        initGiscus() {
            const container = this.$refs.giscusContainer
            if (!container) return

            const cfg = this.giscusConfig
            const script = document.createElement('script')
            script.src = 'https://giscus.app/client.js'
            script.setAttribute('data-repo', cfg.repo)
            script.setAttribute('data-repo-id', cfg.repoId)
            script.setAttribute('data-category', cfg.category)
            script.setAttribute('data-category-id', cfg.categoryId)
            script.setAttribute('data-mapping', 'pathname')
            script.setAttribute('data-strict', '0')
            script.setAttribute('data-reactions-enabled', '1')
            script.setAttribute('data-emit-metadata', '0')
            script.setAttribute('data-input-position', 'bottom')
            script.setAttribute('data-theme', this.getGiscusTheme())
            script.setAttribute('data-lang', 'zh-CN')
            script.setAttribute('crossorigin', 'anonymous')
            script.async = true
            container.innerHTML = ''
            container.appendChild(script)
        },

        getGiscusTheme() {
            const theme = document.documentElement.getAttribute('data-theme')
            return theme === 'dark' ? 'dark' : 'light'
        },

        syncGiscusTheme(theme) {
            const iframe = document.querySelector('iframe.giscus-frame')
            if (iframe) {
                iframe.contentWindow.postMessage({
                    giscus: { setConfig: { theme: theme === 'dark' ? 'dark' : 'light' } }
                }, 'https://giscus.app')
            }
        }
    },
}
</script>

<style lang='less' scoped>
    @import '../style/tocbot.css';
    .container{
        margin-top: 20px;
    }
    .title{
        text-align: center;
        line-height: 2;
        font-size: 28px;
        color: #444950;
        font-weight: bold;
    }
    .subtitle{
        text-align: center;
        font-size: 16px;
        div{
            display: inline-block;
            margin-right: 15px;
        }
        div:nth-child(2){
            color: #409eff;
        }
    }
    .thanks{
        text-align: center;
        color: #ccd0d5;
        font-size: 16px;
        padding: 20px;
    }
    .footer{
        line-height: 2;
        span{
            font-weight: bold;
        }
        a{
            color: #409eff;
        }
    }
    .foot-tag{
        .foot-tag-item{
            display: inline-block;
            padding: 10px;
            color: #409eff;
            font-size: 28px;
            margin-top: 10px;
        }
        .foot-tag-item:hover{
            color: rgb(240, 62, 38);
        }
    }
    .interaction-bar {
        margin-top: 20px;
    }
    .interaction-row {
        display: flex;
        align-items: center;
        gap: 12px;
    }

    .comment{
        margin-top: 20px;
    }

    .comment-title{
        font-size: 24px;
        font-weight: 600;
        color: var(--text-primary);
        margin-bottom: 20px;
        padding-left: 20px;
        border-left: 4px solid var(--text-accent);
    }

    .giscus-container {
        min-height: 100px;
    }

    .markdown-body {
        box-sizing: border-box;
        min-width: 200px;
        max-width: 980px;
        margin: 0 auto;
        padding: 45px;
    }
    
    @media (max-width: 767px) {
        .markdown-body {
            padding: 15px;
        }
    }
    .dir-sticky{
        position: fixed;
        top: 60px;
    }
    .dir-title{
        padding-left: 10px;
        font-size: 18px;
        border-left: 4px solid #409eff;
    }
</style>