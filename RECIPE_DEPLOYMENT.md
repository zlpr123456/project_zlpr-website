# 家庭食谱程序部署指南

## 📋 项目概述

这是一个基于Cloudflare Pages + D1 + R2的家庭食谱管理程序，支持：
- ✅ 创建和保存食谱
- ✅ 上传和保存食谱图片
- ✅ 查看食谱列表和详情
- ✅ 收藏食谱
- ✅ 搜索食谱

## 🚀 部署步骤

### 第一步：创建D1数据库

1. **访问Cloudflare Dashboard**：
   - 访问 https://dash.cloudflare.com/
   - 进入 **Workers & Pages** → **D1**

2. **创建数据库**：
   - 点击 **Create database**
   - 输入数据库名称：`recipe-db`
   - 点击 **Create**

3. **获取数据库ID**：
   - 创建成功后，复制 **Database ID**
   - 保存此ID，后续配置需要使用

4. **执行数据库初始化脚本**：
   - 在数据库页面，点击 **Console**
   - 复制 `database/schema.sql` 文件中的SQL语句
   - 粘贴到Console中执行
   - 确认所有表和索引创建成功

### 第二步：创建R2存储桶

1. **访问R2存储**：
   - 在Cloudflare Dashboard中，找到 **R2** 服务
   - 点击 **Create bucket**

2. **创建存储桶**：
   - 输入存储桶名称：`recipe-images`
   - 点击 **Create bucket**

3. **配置公共访问**（可选）：
   - 进入存储桶设置
   - 找到 **Public access** 部分
   - 启用公共访问（如果需要直接访问图片）
   - 或者通过API提供访问

4. **获取存储桶ID**：
   - 在存储桶详情页面，找到 **Bucket ID**
   - 保存此ID，后续配置需要使用

### 第三步：部署到Cloudflare Pages

1. **创建Pages项目**：
   - 访问 https://dash.cloudflare.com/
   - 进入 **Workers & Pages**
   - 点击 **Create application**
   - 选择 **Pages** 选项卡
   - 选择 **Connect to Git**
   - 连接您的 `project_zlpr-website` 仓库

2. **配置构建设置**：
   - **Framework preset**：选择 "None"
   - **Build command**：留空
   - **Build output directory**：留空或设置为 `.`

3. **部署项目**：
   - 点击 **Save and Deploy**
   - 等待部署完成

### 第四步：绑定D1数据库和R2存储桶

1. **进入项目设置**：
   - 在Pages项目页面，点击 **Settings**
   - 找到 **Functions** 部分

2. **绑定D1数据库**：
   - 点击 **D1 database bindings**
   - 点击 **Add binding**
   - **Variable name**：输入 `DB`
   - **D1 database**：选择 `recipe-db`
   - 点击 **Save**

3. **绑定R2存储桶**：
   - 点击 **R2 bucket bindings**
   - 点击 **Add binding**
   - **Variable name**：输入 `MY_BUCKET`
   - **R2 bucket**：选择 `recipe-images`
   - 点击 **Save**

4. **添加环境变量**（可选）：
   - 在 **Environment variables** 部分
   - 添加变量 `MY_BUCKET_ID`，值为您的R2存储桶ID
   - 点击 **Save**

### 第五步：添加自定义域名

1. **添加域名**：
   - 在Pages项目页面，点击 **Custom domains**
   - 点击 **Add custom domain**
   - 输入您的域名：`08202010.xyz`
   - 点击 **Add**

2. **配置DNS记录**：
   - Cloudflare会自动添加CNAME记录
   - 或者手动在DNS管理中添加CNAME记录
   - 等待DNS记录生效

3. **验证域名**：
   - 访问 `http://08202010.xyz/recipes.html`
   - 确认网站正常显示

## 📝 使用说明

### 访问网站

- **食谱列表**：`http://08202010.xyz/recipes.html`
- **创建食谱**：`http://08202010.xyz/create-recipe.html`
- **我的收藏**：`http://08202010.xyz/favorites.html`

### 创建食谱

1. 访问创建食谱页面
2. 填写食谱信息：
   - 标题（必填）
   - 描述
   - 烹饪时间
   - 份量
   - 难度
   - 分类
   - 标签
3. 填写食材列表（每行一个）
4. 填写制作步骤（每行一个步骤）
5. 上传图片（可选，可多选）
6. 点击保存

### 查看食谱

1. 在食谱列表中点击任意食谱卡片
2. 查看食谱详情
3. 点击收藏按钮添加到收藏

### 搜索食谱

1. 在搜索框中输入关键词
2. 点击搜索按钮或按回车
3. 查看搜索结果

### 管理收藏

1. 访问我的收藏页面
2. 查看所有收藏的食谱
3. 点击删除按钮取消收藏

## 🔧 故障排除

### 数据库连接失败

- 检查D1数据库是否正确绑定
- 确认数据库ID是否正确
- 查看Pages Functions日志

### 图片上传失败

- 检查R2存储桶是否正确绑定
- 确认存储桶ID是否正确
- 检查图片大小是否超过5MB
- 查看Pages Functions日志

### 域名无法访问

- 检查DNS记录是否正确配置
- 确认DNS记录是否已生效
- 检查Cloudflare Pages项目状态

### API请求失败

- 检查Functions是否正确部署
- 查看浏览器控制台错误信息
- 检查网络请求是否成功

## 💡 技术架构

| 组件 | 技术 | 用途 |
|------|------|------|
| **前端** | HTML/CSS/JavaScript | 用户界面 |
| **后端** | Cloudflare Pages Functions | API端点 |
| **数据库** | Cloudflare D1 | 食谱数据、收藏关系 |
| **存储** | Cloudflare R2 | 食谱图片 |

## 📊 数据库表结构

### recipes（食谱表）
- `id`：主键
- `title`：标题
- `description`：描述
- `ingredients`：食材
- `instructions`：制作步骤
- `cooking_time`：烹饪时间
- `servings`：份量
- `difficulty`：难度
- `category`：分类
- `tags`：标签
- `created_at`：创建时间
- `updated_at`：更新时间

### favorites（收藏表）
- `id`：主键
- `recipe_id`：食谱ID
- `user_id`：用户ID
- `created_at`：创建时间

### images（图片表）
- `id`：主键
- `recipe_id`：食谱ID
- `r2_key`：R2存储键
- `r2_url`：R2访问URL
- `is_cover`：是否为封面
- `created_at`：创建时间

## 🎉 完成

部署完成后，您就可以开始使用家庭食谱程序了！

如有问题，请查看Cloudflare Pages Functions日志或联系技术支持。