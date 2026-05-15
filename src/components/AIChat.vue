<template>
  <div class="ai-chat-container">
    <!-- 悬浮按钮 -->
    <div class="chat-toggle" @click="toggleChat" :class="{ active: isOpen }">
      <i :class="isOpen ? 'el-icon-close' : 'el-icon-chat-dot-round'"></i>
    </div>

    <!-- 聊天窗口 -->
    <transition name="slide-fade">
      <div v-if="isOpen" class="chat-window">
        <div class="chat-header">
          <span><i class="el-icon-service"></i> AI博客助手</span>
          <i class="el-icon-close" @click="toggleChat"></i>
        </div>

        <div class="chat-messages" ref="messagesContainer">
          <div v-for="(msg, idx) in messages" :key="idx" :class="['message', msg.role]">
            <div class="avatar">
              <i :class="msg.role === 'user' ? 'el-icon-user' : 'el-icon-cpu'"></i>
            </div>
            <div class="content" v-html="formatMessage(msg.content)"></div>
          </div>
          <div v-if="isLoading" class="message assistant">
            <div class="avatar"><i class="el-icon-cpu"></i></div>
            <div class="content typing"><span></span><span></span><span></span></div>
          </div>
        </div>

        <div class="chat-input">
          <el-input
            type="textarea"
            :rows="2"
            v-model="inputText"
            placeholder="例如：介绍一下你的中海油项目 / 推荐一篇关于Vue的文章"
            @keyup.ctrl.enter="sendMessage"
            resize="none"
          ></el-input>
          <el-button type="primary" size="small" @click="sendMessage" :loading="isLoading">发送</el-button>
        </div>
        <div class="chat-tip">✨ 支持回车发送，Ctrl+Enter 换行 | 我会推荐相关文章</div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'AIChat',
  data() {
    return {
      isOpen: false,
      isLoading: false,
      inputText: '',
      messages: [],
      // ========== DeepSeek 配置 ==========
      DEEPSEEK_API_KEY: 'sk-f2f15d83a02f4959a7a4e903c9fbb093',
      DEEPSEEK_ENDPOINT: 'https://api.deepseek.com/v1/chat/completions',
      DEEPSEEK_MODEL: 'deepseek-chat',
      
      // 存储博客知识库
      blogKnowledge: {
        userProfile: null,    // 个人信息
        projects: [],         // 项目列表
        skills: [],           // 技能列表
        blogList: []          // 博客文章列表
      }
    }
  },
  async created() {
    await this.loadKnowledgeBase()
    // 初始化欢迎消息
    this.messages.push({
      role: 'assistant',
      content: '你好！我是博客助手 🤖<br>我可以：<br>• 回答关于博主项目经历、技能的问题<br>• 推荐相关技术文章<br>• 解释代码片段<br>试试问我："中海油项目用了什么技术？" 或 "推荐一篇关于Webpack的文章"'
    })
  },
  watch: {
    isOpen(val) {
      if (val) this.$nextTick(() => this.scrollToBottom())
    },
    messages: {
      deep: true,
      handler() { this.$nextTick(() => this.scrollToBottom()) }
    }
  },
  methods: {
    toggleChat() { this.isOpen = !this.isOpen },
    scrollToBottom() {
      const container = this.$refs.messagesContainer
      if (container) container.scrollTop = container.scrollHeight
    },
    formatMessage(content) {
      return content.replace(/\n/g, '<br>').replace(/`(.*?)`/g, '<code>$1</code>')
    },

    // ---------- 加载知识库 ----------
    async loadKnowledgeBase() {
      try {
        // 1. 获取用户基本信息（从 /public/user/default）
        const userRes = await this.$http.get('/public/user/default')
        if (userRes.data.meta.status === 200) {
          this.blogKnowledge.userProfile = userRes.data.data
        }
        
        // 2. 获取博客文章列表
        const blogListRes = await this.$http.get('/public/blogs', { params: { pageNum: 1, pageSize: 100 } })
        if (blogListRes.data.meta.status === 200) {
          this.blogKnowledge.blogList = blogListRes.data.data.blogList || []
        } else {
          // 降级：使用你在 archives.vue 中定义的静态数据（复制过来）
          this.blogKnowledge.blogList = [
            { id: 'article-1', title: 'JS 的一些常用底层原理', description: '原型链、闭包、事件循环...' },
            { id: 'article-2', title: 'Windows/Mac 下配置 Node.js 开发环境的完整指南', description: '安装配置...' },
            { id: 'article-3', title: '常见 Git 命令及使用指南', description: '日常命令...' },
            { id: 'article-4', title: 'JavaScript 常用工具函数库', description: '防抖、深拷贝...' },
            { id: 'article-5', title: '8 个让写代码效率翻倍的 VS Code 插件', description: '插件推荐...' },
            { id: 'article-6', title: 'HTML5 语义化与 SEO 最佳实践', description: '语义化标签...' },
            { id: 'article-7', title: 'CSS Grid 布局完全指南', description: 'Grid 布局...' },
            { id: 'article-8', title: 'Vue 3 Composition API 实战与响应式原理', description: 'Composition API...' },
            { id: 'article-9', title: 'uni-app 跨端开发最佳实践', description: '跨端开发...' },
            { id: 'article-10', title: 'Webpack 5 性能优化：代码分割与懒加载', description: 'Webpack 优化...' }
          ]
        }
        
        // 3. 项目经历（从 categories.vue 中提取，或直接定义）
        // 因为 categories.vue 是静态组件，这里直接复制数据（或后续通过 API 获取）
        this.blogKnowledge.projects = [
          {
            name: '中海油领导端 Pad 系统',
            tech: 'uni-app、Vue.js、ECharts',
            description: '面向领导层使用的干部管理与审查系统，提供材料审核、关注管理、干部画像等功能。'
          },
          {
            name: '中海油干部考察系统（Pad/PC端）',
            tech: 'uni-app、Vue.js、Vuex',
            description: '支持考察任务管理、干部名册联动、谈话记录、状态筛选等。'
          },
          {
            name: '干部任免与假勤管理系统',
            tech: 'Vue.js、拖拽API',
            description: '涵盖模拟任免、竞聘管理、考察录入、任职回写、流程集成等模块。'
          }
        ]
        
        // 4. 技能列表（从 about.vue 中提取）
        this.blogKnowledge.skills = [
          'Vue 全家桶', 'uni-app', 'TypeScript', 'Webpack', 'Git', 'JavaScript 底层原理', 'Axios'
        ]
      } catch (err) {
        console.error('加载知识库失败:', err)
      }
    },

    // ---------- 构建 System Prompt（包含博客知识） ----------
    buildSystemPrompt() {
      let prompt = `你是一个专业的前端开发助手，专门为博主“郑瞄瞄”的个人博客服务。回答要简洁、准确，并且尽量引用博主自己的项目和技术栈。

以下是一些关于博主的信息，请在回答时优先使用这些真实信息：

【个人信息】
- 姓名：郑瞄瞄，22岁，女
- 求职状态：前端开发工程师，一年实习经验，随时到岗
- 邮箱：2831639494@qq.com
- GitHub：https://github.com/7z705
- 教育：郑州轻工业大学 网络工程专业 2026届
- 荣誉：四级证书、金盾信安杯三等奖、校级奖学金、三好学生

【技能栈】
${this.blogKnowledge.skills.join('、')}

【项目经历】
`
      this.blogKnowledge.projects.forEach(p => {
        prompt += `- ${p.name}：${p.description} 技术栈：${p.tech}\n`
      })
      
      prompt += `
【博客文章列表】（用户可能要求推荐文章，请根据标题和描述推荐最相关的1-2篇）
`
      this.blogKnowledge.blogList.forEach(blog => {
        prompt += `- 标题：《${blog.title}》 简介：${blog.description}\n`
      })
      
      prompt += `
【额外要求】
1. 当用户询问某个技术问题时，如果博客中有相关文章，请主动推荐。
2. 回答结尾可以附上推荐文章链接（格式：推荐阅读：《文章标题》）。
3. 如果用户要求解释代码，请给出清晰示例。
4. 不要编造不存在的项目或技能。
`
      return prompt
    },

    // ---------- 根据用户问题推荐相关文章 ----------
    recommendArticles(question) {
      const keywords = question.toLowerCase().split(/[\s,，。？?]+/)
      const scored = this.blogKnowledge.blogList.map(blog => {
        const text = (blog.title + ' ' + blog.description).toLowerCase()
        let score = 0
        keywords.forEach(kw => {
          if (kw.length > 1 && text.includes(kw)) score++
        })
        return { blog, score }
      })
      const top = scored.filter(s => s.score > 0).sort((a,b) => b.score - a.score).slice(0, 2)
      if (top.length === 0) return ''
      let recommend = '\n\n📚 相关文章推荐：\n'
      top.forEach(({blog}) => {
        const link = blog.articleUrl ? blog.articleUrl : `/detail/${blog.id}`
        recommend += `- 《${blog.title}》：<a href="${link}" target="_blank">点击阅读</a>\n`
      })
      return recommend
    },

    // ---------- 调用 DeepSeek API ----------
    async sendMessage() {
      const text = this.inputText.trim()
      if (!text || this.isLoading) return
      
      this.messages.push({ role: 'user', content: text })
      this.inputText = ''
      this.isLoading = true
      
      try {
        const systemPrompt = this.buildSystemPrompt()
        const response = await fetch(this.DEEPSEEK_ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.DEEPSEEK_API_KEY}`
          },
          body: JSON.stringify({
            model: this.DEEPSEEK_MODEL,
            messages: [
              { role: 'system', content: systemPrompt },
              ...this.messages.slice(-6) // 保留最近6轮对话
            ],
            temperature: 0.7,
            max_tokens: 1000
          })
        })
        
        if (!response.ok) {
          const err = await response.json()
          throw new Error(err.error?.message || `HTTP ${response.status}`)
        }
        
        const data = await response.json()
        let aiReply = data.choices[0].message.content
        
        // 附加推荐文章（如果问题可能涉及知识查询）
        const needRecommend = !text.includes('推荐') && !text.includes('文章') && aiReply.length < 300
        if (needRecommend) {
          const rec = this.recommendArticles(text)
          if (rec) aiReply += rec
        }
        
        this.messages.push({ role: 'assistant', content: aiReply })
      } catch (error) {
        console.error('API 失败:', error)
        this.messages.push({
          role: 'assistant',
          content: `😵 请求失败：${error.message}。请检查 API Key 和网络。`
        })
      } finally {
        this.isLoading = false
      }
    }
  }
}
</script>

<style lang="less" scoped>
.ai-chat-container {
  position: fixed;
  bottom: 100px;   /* 上移，避免遮挡底部内容 */
  right: 24px;
  z-index: 999;
}

.chat-toggle {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: var(--text-accent, #1F7A8C);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  i {
    font-size: 28px;
    color: white;
  }
  &:hover {
    transform: scale(1.05);
  }
  &.active {
    background: #f56c6c;
  }
}

.chat-window {
  position: absolute;
  bottom: 80px;
  right: 0;
  width: 360px;
  height: 500px;
  background: var(--bg-card, #ffffff);
  border-radius: 20px;
  box-shadow: 0 12px 32px rgba(0,0,0,0.15);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid var(--divider, #e4e7ed);
}

.chat-header {
  padding: 12px 16px;
  background: var(--text-accent, #1F7A8C);
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
  i {
    cursor: pointer;
    &:hover { opacity: 0.8; }
  }
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  background: var(--bg-page, #f5f7fa);
}

.message {
  display: flex;
  gap: 10px;
  .avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: var(--divider, #e4e7ed);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    i { font-size: 18px; color: var(--text-secondary); }
  }
  .content {
    flex: 1;
    padding: 8px 12px;
    border-radius: 12px;
    font-size: 14px;
    line-height: 1.5;
    word-break: break-word;
    code {
      background: rgba(0,0,0,0.05);
      padding: 2px 4px;
      border-radius: 4px;
      font-family: monospace;
    }
  }
  &.user {
    flex-direction: row-reverse;
    .content {
      background: var(--text-accent, #1F7A8C);
      color: white;
      code { background: rgba(255,255,255,0.2); color: white; }
    }
  }
  &.assistant .content {
    background: var(--bg-card, #ffffff);
    border: 1px solid var(--divider, #e4e7ed);
    color: var(--text-primary);
  }
}

.typing span {
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #999;
  margin-right: 4px;
  animation: typing 1.4s infinite;
  &:nth-child(2) { animation-delay: 0.2s; }
  &:nth-child(3) { animation-delay: 0.4s; }
}
@keyframes typing {
  0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
  30% { transform: translateY(-6px); opacity: 1; }
}

.chat-input {
  padding: 12px;
  border-top: 1px solid var(--divider, #e4e7ed);
  display: flex;
  gap: 8px;
  background: var(--bg-card);
  /deep/ .el-textarea__inner {
    border-radius: 12px;
    background: var(--bg-page);
    color: var(--text-primary);
  }
}
.chat-tip {
  font-size: 10px;
  text-align: center;
  color: var(--text-secondary);
  padding: 4px 0 8px;
  background: var(--bg-card);
}

.slide-fade-enter-active, .slide-fade-leave-active {
  transition: all 0.3s ease;
}
.slide-fade-enter, .slide-fade-leave-to {
  transform: translateY(20px);
  opacity: 0;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .ai-chat-container {
    bottom: 80px;
    right: 16px;
  }
  .chat-window {
    width: 300px;
    height: 450px;
    right: -8px;
  }
}

/* 暗色主题适配 */
[data-theme="dark"] .chat-window {
  background: #2a2a2a;
  border-color: #444;
}
[data-theme="dark"] .chat-messages {
  background: #1e1e1e;
}
[data-theme="dark"] .message.assistant .content {
  background: #2a2a2a;
  border-color: #444;
  color: #e0e0e0;
}
[data-theme="dark"] .chat-input,
[data-theme="dark"] .chat-tip {
  background: #2a2a2a;
}
</style>