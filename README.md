# 项目发布中心 - Cloudflare Pages 部署指南

## 📋 项目介绍

这是一个静态网站项目，用于展示和发布多个工具和软件的下载页面。

## 🎯 当前包含内容

- **3MF文件预览工具 v1.4** - 专为Bambu Lab A1打印机设计的3MF文件预览和处理工具
- 更多项目即将推出

## 🚀 部署到Cloudflare Pages

### 方法一：通过GitHub连接（推荐）

#### 第一步：创建GitHub仓库

1. 访问 https://github.com/new
2. 创建新仓库：`project-website`
3. 设置为Public或Private（根据需要）
4. 不要初始化README、.gitignore或license

#### 第二步：推送代码到GitHub

```bash
# 进入项目目录
cd g:\bamub\project-website

# 初始化Git仓库
git init

# 添加所有文件
git add .

# 提交
git commit -m "Initial commit: 项目发布中心"

# 添加远程仓库
git remote add origin https://github.com/zlpr123456/project-website.git

# 推送到GitHub
git push -u origin main
```

#### 第三步：连接Cloudflare Pages

1. 访问 https://dash.cloudflare.com/
2. 登录您的Cloudflare账户
3. 在左侧菜单中找到 **Workers & Pages**
4. 点击 **Create application**
5. 选择 **Connect to Git**
6. 选择GitHub作为Git提供商
7. 授权Cloudflare访问您的GitHub账户
8. 选择 `project-website` 仓库
9. 配置构建设置：
   - **Project name**: `project-website`
   - **Production branch**: `main`
   - **Build command**: 留空（静态HTML不需要构建）
   - **Build output directory**: 留空（根目录）
10. 点击 **Save and Deploy**

#### 第四步：等待部署

Cloudflare会自动构建和部署您的网站，通常需要1-2分钟。

#### 第五步：访问网站

部署完成后，Cloudflare会提供一个URL，类似：
`https://project-website.pages.dev`

您可以在Cloudflare Pages设置中自定义域名。

### 方法二：直接上传（简单）

#### 第一步：准备文件

确保项目目录包含：
- `index.html` - 主页文件
- `styles.css` - 样式文件

#### 第二步：上传到Cloudflare

1. 访问 https://dash.cloudflare.com/
2. 进入 **Workers & Pages**
3. 点击 **Create application**
4. 选择 **Upload assets**
5. 拖拽整个 `project-website` 文件夹到上传区域
6. 点击 **Deploy site**

#### 第三步：获取URL

部署完成后，您会得到一个URL，可以立即访问。

## 🎨 自定义和扩展

### 添加新项目

在 `index.html` 中添加新的项目卡片：

```html
<div class="project-card">
    <div class="project-header">
        <h3>🎯 新工具名称</h3>
        <span class="badge">v1.0</span>
    </div>
    <div class="project-body">
        <p class="description">工具描述</p>
        <ul class="features">
            <li>功能1</li>
            <li>功能2</li>
        </ul>
        <div class="download-section">
            <a href="下载链接" class="btn btn-primary" target="_blank">
                📥 下载
            </a>
        </div>
    </div>
</div>
```

### 修改样式

编辑 `styles.css` 文件来自定义网站外观。

### 添加新页面

1. 创建新的HTML文件（如 `about.html`）
2. 在 `index.html` 中添加链接
3. 推送更新到GitHub

## 📝 更新网站

当需要更新网站内容时：

```bash
# 1. 进入项目目录
cd g:\bamub\project-website

# 2. 编辑文件
# 修改 index.html 或其他文件

# 3. 查看修改
git status

# 4. 添加修改
git add .

# 5. 提交
git commit -m "更新：添加新工具/修改内容"

# 6. 推送
git push origin main
```

Cloudflare Pages会自动检测到GitHub的更新并重新部署。

## 🌐 自定义域名

### 使用Cloudflare域名

1. 在Cloudflare Pages项目设置中
2. 点击 **Custom domains**
3. 添加您的域名（如 `tools.yourdomain.com`）
4. 按照提示配置DNS记录

### 使用其他域名

1. 在域名DNS设置中添加CNAME记录
2. 指向Cloudflare Pages提供的URL
3. 在Cloudflare Pages中添加自定义域名

## 🔧 技术栈

- **HTML5** - 网页结构
- **CSS3** - 样式和动画
- **响应式设计** - 支持移动设备
- **Cloudflare Pages** - 静态网站托管

## 📊 项目结构

```
project-website/
├── index.html          # 主页
├── styles.css          # 样式文件
├── README.md          # 说明文档
└── DEPLOY.md          # 部署指南
```

## 🎯 未来计划

- [ ] 添加更多工具项目
- [ ] 创建工具分类页面
- [ ] 添加搜索功能
- [ ] 实现用户反馈系统
- [ ] 添加多语言支持

## 📞 支持

如有问题，请通过以下方式联系：
- GitHub Issues: https://github.com/zlpr123456/project-website/issues
- 邮件: zlpr123456@github.com

## 📄 许可证

本项目采用 MIT 许可证。