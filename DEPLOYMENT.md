# 🚀 部署清单

## 📋 预部署检查

在部署到 GitHub Pages 之前，请按照以下步骤进行检查和验证。

### ✅ 本地功能验证（必做）

- [ ] **启动本地服务器**
  ```bash
  python -m http.server 8000
  # 浏览器打开 http://localhost:8000
  ```

- [ ] **首页测试**
  - [ ] 页面正常加载（蓝色顶部栏可见）
  - [ ] 打卡热图显示正确（GitHub 风格的格子）
  - [ ] 快速导航区域可见（向下滚动显示）
  - [ ] 点击 "进入记录页" 链接，跳转成功

- [ ] **记录页面测试**
  - [ ] 页面正常加载
  - [ ] 日期显示正确（显示今天的日期和周几）
  - [ ] 日期导航按钮可点击（前一天、后一天、今天）
  - [ ] 所有输入框可输入文字
  - [ ] 可添加关键词标签
  - [ ] 可添加明天计划项目
  - [ ] 可添加待办清单
  - [ ] "AI 建议" 按钮可显示建议
  - [ ] "保存" 按钮可保存数据

- [ ] **专注模式测试**
  - [ ] 点击 "🎯 专注模式" 弹出输入框
  - [ ] 输入任务名称后显示计时器
  - [ ] 点击 "▶ 开始" 计时器开始倒计时
  - [ ] 按 ESC 键可退出
  - [ ] 退出后显示专注时长统计

- [ ] **导出功能测试**
  - [ ] 点击 "📥 导出纯文本" 可下载 txt 文件
  - [ ] 导出文件内容格式正确

- [ ] **数据持久化测试**
  - [ ] 输入一些数据并保存
  - [ ] 刷新页面后数据仍然存在
  - [ ] 关闭浏览器后重新打开，数据仍然存在

- [ ] **快速导航测试**
  - [ ] 点击 "+" 按钮可添加新链接
  - [ ] 输入网址（需含 https://）
  - [ ] 可选择性输入标题
  - [ ] 链接显示正确的图标
  - [ ] 点击 "✕" 可删除链接

---

## 📦 文件完整性检查

- [ ] 根目录文件
  - [ ] `index.html` 存在且 > 5KB
  - [ ] `records.html` 存在且 > 10KB
  - [ ] `hero.jpg` 存在（背景图）
  - [ ] `README.md` 已更新
  - [ ] `.gitignore` 存在

- [ ] `static/` 文件夹
  - [ ] `styles.css` 存在（不含 Flask 依赖）
  - [ ] `data.js` 存在（新增的数据管理模块）
  - [ ] `fade.js` 存在
  - [ ] `hero.jpg` 存在

- [ ] 文档文件
  - [ ] `QUICKSTART.md` 存在
  - [ ] `MIGRATION.md` 存在
  - [ ] `COMPLETION.md` 存在

---

## 🔍 代码检查

{% raw %}
### HTML 文件
- [ ] `index.html` 中没有 `{{ }}` 模板语法
- [ ] `index.html` 中没有 `{% %}` 模板语法
- [ ] `records.html` 中没有 `{{ }}` 模板语法
- [ ] `records.html` 中没有 `{% %}` 模板语法
- [ ] 所有 CSS 链接使用相对路径：`href="static/styles.css"`
- [ ] 所有 JS 链接使用相对路径：`src="static/..."`
- [ ] 页面间导航使用相对路径：`href="index.html"` 和 `href="records.html"`
{% endraw %}

### JavaScript 文件
- [ ] `data.js` 中包含所有必要的函数：
  - [ ] `getRecord(dateStr)`
  - [ ] `saveRecordData(dateStr, data)`
  - [ ] `getHeatmapData()`
  - [ ] `getQuickNav()`
  - [ ] `saveQuickNav(links)`
- [ ] 没有任何 `fetch('/api/...` 的 API 调用

### CSS 文件
- [ ] `styles.css` 中没有 Flask `url_for` 函数
- [ ] 所有资源路径是相对路径

---

## 🌐 GitHub Pages 部署前

### Git 配置
- [ ] 已安装 Git 并配置用户名和邮箱
  ```bash
  git config --global user.name "Your Name"
  git config --global user.email "your.email@example.com"
  ```

### 仓库准备
- [ ] GitHub 账户已登录
- [ ] 创建了新仓库（可以是 `username.github.io` 或其他名称）
- [ ] 已将本项目文件夹初始化为 Git 仓库
  ```bash
  git init
  git add .
  git commit -m "Initial commit: Convert Flask app to static HTML"
  ```

### 远程配置
- [ ] 已添加 GitHub 远程仓库
  ```bash
  git remote add origin https://github.com/username/repo-name.git
  ```
- [ ] 已推送到 GitHub
  ```bash
  git push -u origin main
  ```

---

## ✨ 部署步骤

### 1. 在 GitHub 上启用 Pages

1. [ ] 打开你的 GitHub 仓库
2. [ ] 进入 **Settings**（设置）标签
3. [ ] 在左侧菜单找到 **Pages**
4. [ ] 在 **Source** 部分：
   - 选择 `Deploy from a branch`
   - Branch 选择 `main`（或 `master`）
5. [ ] 点击 **Save**（保存）

### 2. 等待部署完成

- [ ] GitHub 会自动构建和部署
- [ ] 部署通常需要 1-2 分钟
- [ ] 在 Pages 设置中会看到 "Your site is published at..." 提示

### 3. 验证部署

- [ ] 访问你的 GitHub Pages URL：
  - 如果仓库名为 `username.github.io`：`https://username.github.io`
  - 其他仓库：`https://username.github.io/repo-name`
- [ ] [ ] 首页加载正确
- [ ] [ ] 所有功能正常工作
- [ ] [ ] 没有 404 或加载错误

---

## 📝 常见部署问题

### 问题 1：页面显示 404
**解决**：
- [ ] 确保 GitHub Pages 已启用
- [ ] 确认分支选择正确（main 或 master）
- [ ] 等待 2-3 分钟后重新刷新

### 问题 2：样式或脚本加载失败
**解决**：
- [ ] 检查所有链接是否使用相对路径
- [ ] 确保文件名大小写正确
- [ ] 在浏览器开发者工具（F12）检查错误信息

### 问题 3：数据无法保存
**解决**：
- [ ] 确保不在隐私模式下使用
- [ ] 检查浏览器 LocalStorage 是否已启用
- [ ] 尝试清除浏览器缓存后重试

### 问题 4：热图不显示
**解决**：
- [ ] 确保 `static/data.js` 被正确加载
- [ ] 在浏览器控制台（F12）检查是否有错误
- [ ] 需要至少有一条已保存的记录才能显示

---

## 🎯 部署后的验证

部署完成后，请进行以下验证：

- [ ] **在浏览器中测试所有功能**（同本地测试）
- [ ] **在不同浏览器中测试**
- [ ] **在手机浏览器中测试**（响应式设计）
- [ ] **测试数据持久化**（关闭再打开）
- [ ] **测试导出功能**

---

## 📱 移动设备检查

- [ ] 在手机浏览器中打开网址
- [ ] 页面能正确缩放和自适应
- [ ] 按钮和输入框易于操作
- [ ] 热图在小屏幕上可见
- [ ] 记录页面在竖屏模式下可用

---

## 🔐 隐私和安全

- [ ] 确认没有硬编码敏感信息（密码、API 密钥等）
- [ ] 数据仅在用户浏览器中保存
- [ ] 没有任何跟踪或分析脚本

---

## 📞 最后确认

- [ ] 所有文件已提交到 Git
- [ ] 所有更改已推送到 GitHub
- [ ] GitHub Pages 已启用
- [ ] 网站已在线可访问
- [ ] 所有功能经过测试
- [ ] 文档已更新

---

## ✅ 部署完成！

🎉 恭喜！你的静态网页已成功部署到 GitHub Pages！

### 接下来你可以：
1. **分享你的网站 URL**
2. **定期备份数据**（导出 JSON）
3. **邀请朋友使用**
4. **持续改进和优化**

---

**转换日期**：2026 年 2 月 5 日

**状态**：✅ 已完成部署清单
