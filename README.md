# 李想 · 个人网站

个人品牌名片单页网站，部署于 [lixiang.fun](https://lixiang.fun)，通过 GitHub Pages 发布。

## 本地预览

```bash
# 在 website 目录下启动任意静态服务器，例如：
python -m http.server 8000
# 浏览器打开 http://localhost:8000
```

## 结构

- `index.html` — 页面结构（7 个章节）
- `styles.css` — 视觉系统（iOS 26 液态玻璃 / 绿蓝品牌色）
- `script.js` — 滚动渐入、数字计数、导航、视差、视频控制
- `assets/avatar.jpg` — 头像
- `assets/harvest.mp4` — 绿叶菜采收机器人作业视频
- `CNAME` — 自定义域名 `lixiang.fun`
- `.nojekyll` — 禁用 GitHub Pages 的 Jekyll 处理

## 部署

推送到 GitHub 仓库 `main` 分支根目录，Settings → Pages 选择从 `main` / root 发布，自定义域名填 `lixiang.fun`。

DNS（name.com）：
- A 记录 `@` → 185.199.108.153 / 185.199.109.153 / 185.199.110.153 / 185.199.111.153
- CNAME `www` → leewlrma9077.github.io
