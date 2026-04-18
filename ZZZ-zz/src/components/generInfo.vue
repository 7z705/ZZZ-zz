<template>
  <el-card class="general-info">
    <div class="avatar">
      <img src="/avatar.jpg" alt="">
    </div>
    <div class="name">{{ profile.name }}</div>
    <div class="role">{{ profile.role }}</div>
    <div class="moto">
      {{ profile.summary || userInfo.moto }}
    </div>
    <div class="social">
      <a :href="profile.githubUrl" target="_blank" rel="noopener noreferrer" class="social-item" title="GitHub">
        <i class="iconfont icon-github"></i>
      </a>
      <a :href="profile.emailUrl" target="_blank" rel="noopener noreferrer" class="social-item" title="邮箱">
        <i class="iconfont icon-youxiang"></i>
      </a>
      <a :href="profile.resumeUrl" target="_blank" rel="noopener noreferrer" class="social-link">
        查看简历
      </a>
    </div>
    <a :href="profile.githubUrl" target="_blank" rel="noopener noreferrer" class="github-entry">
      <span>GitHub</span>
      <span>{{ profile.githubText }}</span>
    </a>
    <div class="state"></div>
  </el-card>
</template>

<script>
export default {
  name: "generInfo",
  created() {  
    this.getUserInfo()
    this.getSiteInfo()
  },
  data() {
    return {
      userInfo: {},
      siteInfo: {
        archivesNum: 0,
        categoriesNum: 0,
        tagsNum: 0,
      },
      profile: {
        name: '郑瞄瞄',
        role: '前端开发工程师 / 随时到岗',
        summary: '掌握 HTML、CSS、JavaScript、Vue2、Vue3、Node.js、Git 与 uni-app',
        githubUrl: 'https://github.com/7z705',
        githubText: 'github.com/7z705',
        emailUrl: 'mailto:283163949@qq.com',
        resumeUrl: '/resume.pdf',
      }
    }
  },
  methods: {
    async getUserInfo() {
      const {data: res} = await this.$http.get(`public/user/default`)
      if (res.meta.status !== 200) {
        this.$message.error("获取用户信息失败：" + res.meta.msg)
        return
      }
      this.userInfo = res.data
    },
    async getSiteInfo() {
      const {data: res} = await this.$http.get(`public/statistics`)
      if (res.meta.status !== 200) {
        this.$message.error("获取网站信息失败：" + res.meta.msg)
        return
      }
      this.siteInfo = res.data
    },
  }
}
</script>

<style lang='less' scoped>
.general-info {
  color: var(--text-primary);
  .avatar {
    text-align: center;
    width: 100px;
    height: 100px;
    border-radius: 50%;
    border: 1px solid var(--divider);
    box-shadow: 0 8px 18px rgba(0,0,0,0.05);
    margin: auto;
    overflow: hidden;
    img { width: 100%; }
  }
  .avatar:hover {
    animation: bounce;
    animation-duration: 1s;
  }
  .moto {
    text-align: center;
    font-weight: 500;
    padding: 14px 0 20px;
    line-height: 1.8;
    color: var(--text-secondary);
  }
  .name {
    margin-top: 18px;
    text-align: center;
    font-size: 24px;
    font-weight: 700;
  }
  .role {
    margin-top: 8px;
    text-align: center;
    font-size: 14px;
    color: var(--text-accent);
  }
  .social {
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    .iconfont {
      color: var(--text-primary);
      font-size: 30px !important;
    }
    .iconfont:hover {
      color: var(--text-accent);
    }
  }
  .social-link {
    color: var(--text-accent);
  }
  .social-link:hover {
    color: var(--btn-hover);
  }
  .github-entry {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 18px;
    padding: 12px 14px;
    color: var(--text-accent);
    background: var(--accent-light);
    border: 1px solid var(--divider);
    border-radius: 24px;
    text-decoration: none;
  }
  .github-entry:hover {
    color: var(--btn-hover);
  }
}
</style>