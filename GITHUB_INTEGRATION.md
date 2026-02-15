# Cloudflare Pages + GitHub 集成指南

## 🎯 集成方案

您已经手动上传了文件到Cloudflare Pages，现在通过Git管理这些文件。

## 📋 操作步骤

### 第一步：初始化Git仓库（已完成）
✅ Git仓库已初始化
✅ 文件已提交

### 第二步：创建GitHub仓库

1. 访问 https://github.com/new
2. 仓库名称：`project_zlpr-website`
3. 描述：`项目发布中心 - 工具和软件下载平台`
4. 选择Public或Private
5. **不要勾选**初始化选项

### 第三步：连接GitHub仓库

创建GitHub仓库后，运行以下命令：

```bash
cd g:\bamub\project-website

# 添加GitHub远程仓库
git remote add origin git@github.com:zlpr123456/project_zlpr-website.git

# 推送到GitHub
git push -u origin master
```

### 第四步：连接Cloudflare Pages

1. 访问 https://dash.cloudflare.com/
2. 进入 **Workers & Pages**
3. 点击 **Create application**
4. 选择 **Connect to Git**
5. 选择GitHub作为Git提供商
6. 授权Cloudflare访问您的GitHub账户
7. 选择 `project_zlpr-website` 仓库
8. 配置构建设置：
   - **Project name**: `project_zlpr-website`
   - **Production branch**: `master`
   - **Build command**: 留空（静态HTML不需要构建）
   - **Build output directory**: 留空（根目录）
9. 点击 **Save and Deploy**

## 🔄 工作流程

### 日常更新流程

```bash
# 1. 进入项目目录
cd g:\bamub\project-website

# 2. 编辑文件（修改index.html等）

# 3. 查看修改
git status

# 4. 添加修改
git add .

# 5. 提交
git commit -m "更新说明：添加了新工具"

# 6. 推送到GitHub
git push origin master

# Cloudflare会自动检测更新并重新部署
```

## 🎨 添加新项目

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

## 📊 架构说明

```
项目文件
    ├── Git管理（GitHub）
    ├── 自动部署（Cloudflare Pages）
    └── 手动上传（Cloudflare Pages）
```

**工作流程**：
1. 本地修改 → Git提交 → GitHub推送 → Cloudflare自动部署

## ✅ 优势

- **版本控制**：Git提供完整的版本历史
- **自动部署**：Cloudflare自动检测GitHub更新
- **备份安全**：代码存储在GitHub，更加安全
- **团队协作**：支持多人协作开发
- **访问稳定**：GitHub + Cloudflare组合，国内外访问都稳定

## 🚀 开始使用

现在您可以：

1. 在GitHub上创建 `project-website` 仓库
2. 运行上面的Git命令连接仓库
3. 在Cloudflare Pages中连接GitHub
4. 开始使用Git管理您的网站内容！